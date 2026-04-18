export default function HeatmapGrid({ cells = [] }) {
  return (
    <div className="panel-card">
      <div className="panel-heading">
        <h3>Contribution Heatmap</h3>
        <p>Recent public activity grouped into a 12-week grid.</p>
      </div>
      <div className="heatmap-grid" aria-label="Contribution heatmap">
        {cells.map((cell) => (
          <div
            key={cell.date}
            className={`heatmap-cell level-${cell.level}`}
            title={`${cell.date}: ${cell.count} events`}
          />
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-cell level-0" />
        <div className="heatmap-cell level-1" />
        <div className="heatmap-cell level-2" />
        <div className="heatmap-cell level-3" />
        <div className="heatmap-cell level-4" />
        <span>More</span>
      </div>
    </div>
  );
}
