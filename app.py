import os
import shutil
import signal
import socket
import subprocess
import sys
import time
import webbrowser
from pathlib import Path


ROOT = Path(__file__).resolve().parent
LOG_DIR = ROOT / ".logs"
SERVER_PORT = 5000
CLIENT_PORT = 5173
APP_HOST = "127.0.0.1"


def ensure_env_file(folder_name: str) -> None:
    example_path = ROOT / folder_name / ".env.example"
    env_path = ROOT / folder_name / ".env"

    if env_path.exists() or not example_path.exists():
        return

    shutil.copy(example_path, env_path)
    print(f"[setup] Created {env_path.relative_to(ROOT)} from .env.example")


def read_env_value(env_path: Path, key: str) -> str:
    if not env_path.exists():
        return ""

    for line in env_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        if line.startswith(f"{key}="):
            return line.split("=", 1)[1].strip()
    return ""


def warn_if_github_token_missing() -> None:
    token = read_env_value(ROOT / "server" / ".env", "GITHUB_TOKEN")
    if not token:
        print("[tip] GITHUB_TOKEN is empty in server/.env. Add a GitHub token to avoid low API rate limits.")


def npm_executable() -> str:
    return "npm.cmd" if os.name == "nt" else "npm"


def is_port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as connection:
        connection.settimeout(0.4)
        return connection.connect_ex(("127.0.0.1", port)) == 0


def wait_for_port(port: int, label: str, timeout: int = 45) -> bool:
    started_at = time.time()
    while time.time() - started_at < timeout:
        if is_port_open(port):
            print(f"[ready] {label} is available on http://{APP_HOST}:{port}")
            return True
        time.sleep(0.5)
    return False


def print_access_banner(app_url: str) -> None:
    print("")
    print("=" * 64)
    print(" GitHub Profile Analyser is running")
    print(f" Website: {app_url}")
    print(f" API:     http://{APP_HOST}:{SERVER_PORT}/api/health")
    print("")
    print(" Keep this Python window open while using the website.")
    print(" Logs:")
    print(f"   Backend:  {LOG_DIR / 'backend.log'}")
    print(f"   Frontend: {LOG_DIR / 'frontend.log'}")
    print("=" * 64)
    print("")


def start_process(args: list[str], label: str) -> subprocess.Popen:
    creationflags = 0
    if os.name == "nt":
        creationflags = subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.CREATE_NO_WINDOW

    LOG_DIR.mkdir(exist_ok=True)
    log_path = LOG_DIR / f"{label}.log"
    log_file = log_path.open("a", encoding="utf-8")

    print(f"[launch] Starting {label} in the background. Logs: {log_path.relative_to(ROOT)}")
    process = subprocess.Popen(
        args,
        cwd=ROOT,
        stdin=subprocess.DEVNULL,
        stdout=log_file,
        stderr=subprocess.STDOUT,
        creationflags=creationflags
    )
    process._log_file = log_file
    return process


def terminate_process(process: subprocess.Popen, label: str) -> None:
    if process.poll() is not None:
        return

    print(f"[shutdown] Stopping {label}")
    try:
        if os.name == "nt":
            subprocess.run(
                ["taskkill", "/PID", str(process.pid), "/T", "/F"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=subprocess.CREATE_NO_WINDOW,
                check=False
            )
            time.sleep(1)
        else:
            process.terminate()
    except Exception:
        pass

    if process.poll() is None:
        process.terminate()

    try:
        process.wait(timeout=8)
    except subprocess.TimeoutExpired:
        process.kill()

    log_file = getattr(process, "_log_file", None)
    if log_file:
        log_file.close()


def main() -> int:
    ensure_env_file("server")
    ensure_env_file("client")
    warn_if_github_token_missing()

    npm = npm_executable()
    server_process = None
    client_process = None

    try:
        if not is_port_open(SERVER_PORT):
            server_process = start_process(
                [npm, "run", "dev", "--workspace", "server"],
                "backend"
            )
        else:
            print(f"[skip] Port {SERVER_PORT} is already in use. Reusing existing backend.")

        if not wait_for_port(SERVER_PORT, "Backend API"):
            print("[error] Backend did not start in time.")
            return 1

        if not is_port_open(CLIENT_PORT):
            client_process = start_process(
                [npm, "run", "dev", "--workspace", "client", "--", "--host", APP_HOST],
                "frontend"
            )
        else:
            print(f"[skip] Port {CLIENT_PORT} is already in use. Reusing existing frontend.")

        if not wait_for_port(CLIENT_PORT, "Frontend"):
            print("[error] Frontend did not start in time.")
            return 1

        app_url = f"http://{APP_HOST}:{CLIENT_PORT}"
        print_access_banner(app_url)
        print(f"[open] Opening browser at {app_url}")
        webbrowser.open(app_url, new=2)
        print("[running] Press Ctrl+C in this terminal to stop the local app.")

        while True:
            if server_process and server_process.poll() is not None:
                print("[error] Backend process exited unexpectedly.")
                return server_process.returncode or 1
            if client_process and client_process.poll() is not None:
                print("[error] Frontend process exited unexpectedly.")
                return client_process.returncode or 1
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[shutdown] Interrupt received.")
        return 0
    finally:
        if client_process:
            terminate_process(client_process, "frontend")
        if server_process:
            terminate_process(server_process, "backend")


if __name__ == "__main__":
    sys.exit(main())
