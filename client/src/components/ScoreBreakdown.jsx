import { titleCase } from "../utils/formatters";

export default function ScoreBreakdown({ scores }) {
  return (
    <div className="score-breakdown">
      {Object.entries(scores || {}).map(([key, value]) => (
        <article key={key} className="metric-card">
          <div className="metric-head">
            <p>{titleCase(key)}</p>
            <strong>{Math.round(value)}</strong>
          </div>
          <div className="metric-bar">
            <span style={{ width: `${Math.max(6, value)}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}
