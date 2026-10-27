// Shared menu state: category (sidebar), search term and page (browser). It lives in the URL
// (?category=&q=&page=) so a result can be linked and shared, and in this tiny store so the
// sidebar (in the layout) and the browser (in the page) stay in sync across navigation.
import { CATEGORIES } from "@/lib/categories";

export const SERVER = { category: "All", q: "", page: 1, crash: false };
let state = SERVER;
let ready = false;
const listeners = new Set();
const emit = () => listeners.forEach((cb) => cb());

function read() {
  const p = new URLSearchParams(window.location.search);
  const c = p.get("category");
  const page = Number.parseInt(p.get("page") ?? "", 10);
  return {
    category: CATEGORIES.includes(c) ? c : "All",
    q: (p.get("q") ?? "").slice(0, 60),
    page: Number.isInteger(page) && page > 0 ? page : 1,
    crash: Boolean(p.get("crash")),
  };
}

function init() {
  if (ready || typeof window === "undefined") return;
  ready = true;
  state = read();
  window.addEventListener("popstate", () => { state = read(); emit(); }); // Back / Forward
}

export const getServerSnapshot = () => SERVER;
export function getSnapshot() { init(); return state; }
export function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }

export function hrefFor({ category, q, page }) {
  const p = new URLSearchParams();
  if (category !== "All") p.set("category", category);
  if (q) p.set("q", q);
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `/menu?${s}` : "/menu";
}

function write(patch, push) {
  init();
  state = { ...state, ...patch };
  window.history[push ? "pushState" : "replaceState"](null, "", hrefFor(state));
  emit();
}

// typing and filtering REPLACE the history entry (no entry per keystroke); paging PUSHES one
export const setCategory = (category) => write({ category, page: 1 }, false);
export const setQuery = (q) => { init(); if (q !== state.q) write({ q, page: 1 }, false); };
export const setPage = (page) => write({ page }, true);
