// A shape roughly the size of what is coming: no layout jump, and a
// shorter-feeling wait than a spinner in an empty page.
export function PageSkeleton() {
  return (
    <div className="skeleton-page" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading the page…</span>
      <div className="sk sk-title" />
      <div className="sk sk-block" />
      <div className="sk sk-block" />
      <div className="sk sk-block short" />
    </div>
  );
}
