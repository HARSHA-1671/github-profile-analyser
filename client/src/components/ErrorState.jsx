export default function ErrorState({ message }) {
  return (
    <div className="state-card error">
      <h2>We couldn&apos;t generate that report.</h2>
      <p>{message}</p>
    </div>
  );
}

