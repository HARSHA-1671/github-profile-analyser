export default function ScoreRing({ score }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  const style = {
    background: `conic-gradient(var(--accent) ${safeScore * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`
  };

  return (
    <div className="score-ring" style={style}>
      <div className="score-ring__inner">
        <span>{safeScore}</span>
        <small>/100</small>
      </div>
    </div>
  );
}

