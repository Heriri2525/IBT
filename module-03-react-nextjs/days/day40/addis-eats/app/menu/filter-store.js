// Tiny shared store: the sidebar (in the layout) and the list wrapper (in the page)
// both need the selected category. Module state + useSyncExternalStore keeps it in
// sync, survives navigation (the layout stays mounted) and mirrors ?category= in the URL.
import { CATEGORIES } from "@/lib/categories";

const SERVER = { category: "All", crash: false };
let state = SERVER;
let ready = false;
const listeners = new Set();

function init() {
  if (ready || typeof window === "undefined") return;
  ready = true;
  const p = new URLSearchParams(window.location.search);
  const c = p.get("category");
  state = { category: CATEGORIES.includes(c) ? c : "All", crash: Boolean(p.get("crash")) };
}

export const getServerSnapshot = () => SERVER;
export function getSnapshot() { init(); return state; }
export function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }
export function setCategory(category) {
  init();
  state = { ...state, category };
  const url = new URL(window.location.href);
  if (category === "All") url.searchParams.delete("category"); else url.searchParams.set("category", category);
  window.history.replaceState(null, "", url);
  listeners.forEach((cb) => cb());
}
