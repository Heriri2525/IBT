// The one fetcher every SWR query uses.
//   fetcher("/api/orders/ord_1")                         -> GET that URL
//   fetcher(["/api/dishes", { q, category, page }])      -> GET /api/dishes?q=..&page=.. (empty values dropped)
// Non-OK responses THROW, so SWR's `error` is set instead of an error body being cached as data.
export class FetchError extends Error {
  constructor(message, status, info) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.info = info;
  }
}

export function toUrl(key) {
  if (!Array.isArray(key)) return key;
  const [path, params = {}] = key;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== "" && v != null && v !== "All") qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `${path}?${s}` : path;
}

export async function fetcher(key) {
  const res = await fetch(toUrl(key));
  if (!res.ok) {
    let info = null;
    try { info = await res.json(); } catch {}
    throw new FetchError(info?.error ?? `Request failed (${res.status})`, res.status, info);
  }
  return res.json();
}
