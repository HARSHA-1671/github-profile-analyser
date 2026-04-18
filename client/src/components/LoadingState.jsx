export default function LoadingState({ label = "Loading report..." }) {
  return (
    <div className="state-card">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

