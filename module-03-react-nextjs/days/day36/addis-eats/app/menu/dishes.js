// Colocated data module (not a route: no page.js here, and the file is not special).
import dishes from "./dishes.json";

export const CATEGORIES = ["All", "Ethiopian", "Vegetarian", "Breakfast", "Fast Food"];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Simulated network latency so loading.js is visible without throttling.
export async function getDishes(category = "All") {
  await delay(700);
  return category === "All" ? dishes : dishes.filter((d) => d.category === category);
}

export async function getDish(id) {
  await delay(300);
  return dishes.find((d) => String(d.id) === String(id)) ?? null;
}
