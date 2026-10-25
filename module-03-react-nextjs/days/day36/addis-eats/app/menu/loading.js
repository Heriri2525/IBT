// Shown while app/menu/page.js (and /menu/[id]) are still fetching.
export default function Loading() {
  return (
    <section aria-busy="true">
      <h1>Menu</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>Loading dishes…</p>
      <div className="grid">
        {Array.from({ length: 6 }, (_, i) => <div key={i} className="skel" />)}
      </div>
    </section>
  );
}
