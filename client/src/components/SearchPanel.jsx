import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchPanel() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [compareOne, setCompareOne] = useState("");
  const [compareTwo, setCompareTwo] = useState("");
  const snapshots = [
    { label: "Signals", value: "5 weighted categories" },
    { label: "Storage", value: "Persistent database storage" },
    { label: "Sharing", value: "Custom report URLs" }
  ];

  function handleSearch(event) {
    event.preventDefault();
    if (!username.trim()) {
      return;
    }

    navigate(`/report/${username.trim().toLowerCase()}`);
  }

  function handleCompare(event) {
    event.preventDefault();
    if (!compareOne.trim() || !compareTwo.trim()) {
      return;
    }

    navigate(
      `/compare?u1=${encodeURIComponent(compareOne.trim())}&u2=${encodeURIComponent(compareTwo.trim())}`
    );
  }

  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="eyebrow">GitHub Signal Scanner</span>
        <h1>Evaluate a GitHub profile with a cleaner, faster scorecard.</h1>
        <p>
          Built for quick screening, self-review, and portfolio polishing. Search a
          public username to see activity, code quality, breadth, community traction,
          and hiring readiness in one focused dashboard.
        </p>
        <div className="snapshot-strip">
          {snapshots.map((item) => (
            <article key={item.label} className="snapshot-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </div>

      <div className="hero-console">
        <div className="console-topbar">
          <span />
          <span />
          <span />
        </div>
        <p className="console-line">$ analyse --username &lt;github-user&gt;</p>
        <p className="console-subline">Generate portfolio strength, repository quality, and comparison views.</p>
      </div>

      <div className="search-grid">
        <form className="search-card" onSubmit={handleSearch}>
          <label htmlFor="username">Generate a report</label>
          <div className="input-row">
            <input
              id="username"
              type="text"
              placeholder="github username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <button type="submit">Analyse</button>
          </div>
        </form>

        <form className="search-card secondary" onSubmit={handleCompare}>
          <label>Compare two profiles</label>
          <div className="split-inputs">
            <input
              type="text"
              placeholder="first username"
              value={compareOne}
              onChange={(event) => setCompareOne(event.target.value)}
            />
            <input
              type="text"
              placeholder="second username"
              value={compareTwo}
              onChange={(event) => setCompareTwo(event.target.value)}
            />
          </div>
          <button type="submit">Compare</button>
        </form>
      </div>
    </section>
  );
}
