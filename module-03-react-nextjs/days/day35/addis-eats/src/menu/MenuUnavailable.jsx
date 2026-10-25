// Fallback for the menu region (used by the error boundaries around it).
export default function MenuUnavailable({ reset }) {
  return (
    <div className="fallback" role="alert">
      <h3>⚠ The menu is unavailable right now</h3>
      <p>Something went wrong while showing the dishes. Your cart is safe.</p>
      <button className="retry-button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
