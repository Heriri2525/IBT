// One place to report errors caught by boundaries.
// In a real app, send them to a service (Sentry, LogRocket, ...) from here.
export function logError(error, info, where = "boundary") {
  console.error(`[${where}]`, error, info?.componentStack ?? "");
  if (import.meta.env.DEV) {
    window.__errors ??= [];
    window.__errors.push({ where, message: error?.message });
  }
}
