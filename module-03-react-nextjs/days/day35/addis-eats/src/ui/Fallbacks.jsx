import { Link } from "react-router-dom";

// Generic fallbacks. A fallback should say WHAT failed and offer a way out.
// (Feature-specific ones live with their feature: menu/MenuUnavailable.jsx,
// cart/CartUnavailable.jsx.)

// A lazy chunk that could not be downloaded (dropped connection, new deploy)
export function isChunkError(error) {
  return /dynamically imported module|importing a module script|failed to fetch|loading chunk|loading css chunk/i.test(
    String(error?.message ?? error)
  );
}

// Page-level: the header and navigation are still on screen around it
export function PageCrashed({ error, reset }) {
  const chunk = isChunkError(error);
  return (
    <main className="page">
      <div className="fallback" role="alert">
        <h3>⚠ {chunk ? "This page could not be loaded" : "This page hit a problem"}</h3>
        <p>
          {chunk
            ? "Your connection may have dropped while it was loading."
            : "The rest of Addis Eats is still working."}
        </p>
        {/* a rejected lazy import is cached by React, so retrying needs a reload */}
        {chunk ? (
          <button className="retry-button" onClick={() => window.location.reload()}>
            Reload the page
          </button>
        ) : (
          <button className="retry-button" onClick={reset}>
            Try again
          </button>
        )}{" "}
        <Link to="/menu" className="details-link">
          Go to the menu
        </Link>
      </div>
    </main>
  );
}

// Last resort: sits OUTSIDE the router and every provider, so it uses
// nothing but plain elements.
export function AppCrashed() {
  return (
    <div className="fallback app-crashed" role="alert">
      <h1>Addis Eats hit a problem</h1>
      <p>Sorry — something went badly wrong. Your saved cart is still on this device.</p>
      <a href="/" className="cta">
        Reload Addis Eats
      </a>
    </div>
  );
}
