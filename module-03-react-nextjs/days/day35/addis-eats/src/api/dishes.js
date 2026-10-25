// Fetch helpers for the dishes resource. They only BUILD URLs: the
// fetching, loading and error handling live in the useFetch hook.
// (`fail` makes the dev server answer 500 — used by the "simulate error" switch.)

export function dishesUrl(category = "All", { fail = false } = {}) {
  return `/api/dishes?c=${encodeURIComponent(category)}${fail ? "&fail=1" : ""}`;
}

export function dishUrl(slug) {
  return `/api/dishes/${encodeURIComponent(slug)}`;
}
