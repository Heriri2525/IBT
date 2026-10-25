// Fallback for the order panel (used by the error boundary around it).
export default function CartUnavailable({ reset }) {
  return (
    <div className="fallback" role="alert">
      <h3>⚠ Your order panel is unavailable</h3>
      <p>The menu still works, and your items are saved.</p>
      <button className="retry-button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
