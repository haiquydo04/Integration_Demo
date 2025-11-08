export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <strong>Something went wrong.</strong>
      <p>{message ?? 'Unable to fetch data from the integration API.'}</p>
      {onRetry && (
        <button type="button" className="secondary-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

