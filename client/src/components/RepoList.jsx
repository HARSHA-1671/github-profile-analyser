import { formatDate, formatNumber } from "../utils/formatters";

export default function RepoList({ repositories = [] }) {
  return (
    <div className="panel-card">
      <div className="panel-heading">
        <h3>Top Repositories</h3>
        <p>Prioritized by stars, forks, recency, and maintainability signals.</p>
      </div>
      <div className="repo-list">
        {repositories.map((repo) => (
          <article key={repo.name} className="repo-card">
            <div className="repo-header">
              <a href={repo.url} target="_blank" rel="noreferrer">
                {repo.name}
              </a>
              <span className="repo-language">{repo.language || "Unknown"}</span>
            </div>
            <div>
              <p>{repo.description || "No description provided."}</p>
            </div>
            <div className="repo-meta">
              <span>{formatNumber(repo.stars)} stars</span>
              <span>{formatNumber(repo.forks)} forks</span>
              <span>Updated {formatDate(repo.updatedAt)}</span>
            </div>
            <div className="repo-tags">
              {repo.topics?.length
                ? repo.topics.map((topic) => <span key={topic}>{topic}</span>)
                : <span>no topics</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
