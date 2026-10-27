// Colocated data module (not a route). Latency is simulated so the Suspense
// boundary has something to wait on; in a static build it is paid once at build.
import { cache } from "react";
import dishes from "./dishes.json";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Day 44: wrapped in React's cache(). generateMetadata, the page, and the sitemap all ask for the
// same dish in ONE render, and cache() makes that cost one lookup. (fetch() is deduped by Next.js
// automatically; a database call or a JSON import is not, so we ask for it explicitly.)
export const getDishes = cache(async () => {
  await delay(700);
  return dishes;
});

export const getDish = cache(async (id) => {
  await delay(100);
  return dishes.find((d) => String(d.id) === String(id)) ?? null;
});
