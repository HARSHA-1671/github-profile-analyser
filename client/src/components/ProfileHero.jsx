import { formatDate, formatNumber } from "../utils/formatters";
import ScoreRing from "./ScoreRing";

export default function ProfileHero({ report }) {
  const profile = report?.profile;

  return (
    <section className="profile-hero">
      <div className="profile-card">
        <div className="profile-main">
          <img src={profile.avatarUrl} alt={`${profile.username} avatar`} className="avatar" />
          <div className="profile-copy">
            <div className="profile-title">
              <h1>{profile.name || profile.username}</h1>
              <span>@{profile.username}</span>
            </div>
            <p>{profile.bio || "No bio available."}</p>
            <div className="meta-grid">
              <span>Joined {formatDate(profile.joinedAt)}</span>
              <span>{formatNumber(profile.followers)} followers</span>
              <span>{formatNumber(profile.publicRepos)} public repos</span>
              <span>{profile.location || "Location not listed"}</span>
            </div>
            <div className="cta-row">
              <a href={profile.htmlUrl} target="_blank" rel="noreferrer">
                View GitHub
              </a>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Copy Share URL
              </button>
            </div>
          </div>
        </div>
        <div className="profile-side">
          <div className="profile-pill">Public GitHub</div>
          <div className="profile-pill">{formatNumber(profile.following)} following</div>
          <div className="profile-pill">{profile.blog ? "website linked" : "no website"}</div>
        </div>
      </div>
      <div className="overall-card">
        <p className="score-label">Overall Score</p>
        <ScoreRing score={report?.scores?.overall} />
        <small>Cached until {formatDate(report?.cache?.expiresAt)}</small>
      </div>
    </section>
  );
}
