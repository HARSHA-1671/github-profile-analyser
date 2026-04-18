import { BarChart3, GitCompare, Github, Search, Sparkles } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Layout({ children }) {
  const navItems = [
    { path: "/", label: "Home", icon: Github },
    { path: "/analyze", label: "Analyze", icon: BarChart3 },
    { path: "/compare", label: "Compare", icon: GitCompare },
    { path: "/insights", label: "Insights", icon: Sparkles }
  ];

  return (
    <div className="github-bg min-h-screen text-[#e6edf3]">
      <header className="sticky top-0 z-50 border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-2">
              <div className="relative">
                <Github className="h-8 w-8 text-[#e6edf3]" />
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl transition-all group-hover:bg-blue-500/30" />
              </div>
              <span className="bg-gradient-to-r from-[#e6edf3] to-[#7d8590] bg-clip-text text-xl font-semibold text-transparent">
                Profile Analyzer
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                        isActive
                          ? "border border-[#1f6feb]/50 bg-[#1f6feb]/10 text-[#58a6ff]"
                          : "text-[#7d8590] hover:bg-[#30363d]/50 hover:text-[#e6edf3]"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Search bar removed as per user request */}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>

      <footer className="mt-20 border-t border-[#30363d]">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-[#7d8590] sm:px-6 lg:px-8">
          <p>Powered by GitHub API - Built with React, Express, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
