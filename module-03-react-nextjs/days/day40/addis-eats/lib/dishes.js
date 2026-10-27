// Shared data layer. Server components call these functions directly —
// no /api round trip. (lib/ = used by more than one route.)
import dishes from "./dishes.json";

export { CATEGORIES } from "./categories";

// simulated latency in dev only, so loading.js / Suspense are visible while developing
const LATENCY = process.env.NODE_ENV === "development" ? 700 : 0;
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
