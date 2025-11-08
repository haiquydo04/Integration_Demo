export default function Loader({ label = 'Loading data…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

