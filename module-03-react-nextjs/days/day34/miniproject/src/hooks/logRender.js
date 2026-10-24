// Dev-only helper for the "what re-renders?" experiment.
// Call logRender("Name") at the top of a component, add dishes, then run
//   console.table(window.__renders)
// in the browser console. (StrictMode doubles every count in dev.)
export function logRender(name) {
  if (import.meta.env.DEV) {
    window.__renders ??= {};
    window.__renders[name] = (window.__renders[name] ?? 0) + 1;
  }
}
