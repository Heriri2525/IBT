// Shared data layer. Server components call these functions directly —
// no /api round trip. (lib/ = used by more than one route.)
import dishes from "./dishes.json";

export { CATEGORIES } from "./categories";

// simulated latency in dev only, so loading.js / Suspense are visible while developing
// (override with DISH_LATENCY_MS=400 to watch loading/keepPreviousData on a production build)
const LATENCY = Number(process.env.DISH_LATENCY_MS ?? (process.env.NODE_ENV === "development" ? 700 : 0));
const delay = (ms) => (ms ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve());

export async function getDishes() {
  await delay(LATENCY);
  return dishes;
}

export async function getDish(id) {
  await delay(LATENCY / 7);
  return dishes.find((d) => String(d.id) === String(id)) ?? null;
}

export async function getSpecials() {
  return (await getDishes()).filter((d) => d.special);
}

// sheet's Day 38 "parallel, not sequential" example
export async function getReviews(id) {
  await delay(LATENCY / 2);
  const n = Number(id) || 1;
  return [
    { who: "Almaz", text: n % 2 ? "Just like home." : "Generous portion, arrived hot." },
    { who: "Dawit", text: "Will order again." },
  ];
}

export const PAGE_SIZE = 6;

// Search + filter + paging in one place: used by the menu page (server, directly)
// and by GET /api/dishes (for the browser's SWR queries).
export async function searchDishes({ q = "", category = "All", page = 1, pageSize = PAGE_SIZE } = {}) {
  const all = await getDishes();
  const needle = q.trim().toLowerCase();
  const matches = all.filter(
    (d) =>
      (category === "All" || d.category === category) &&
      (!needle || d.name.toLowerCase().includes(needle) || d.description.toLowerCase().includes(needle))
  );
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
  return {
    dishes: matches.slice((page - 1) * pageSize, page * pageSize),
    total: matches.length, page, pageSize, pageCount,
  };
}
