// Colocated data module (not a route). Latency is simulated so the Suspense
// boundary has something to wait on; in a static build it is paid once at build.
import dishes from "./dishes.json";



const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getDishes() {
  await delay(700);
  return dishes;
}

export async function getDish(id) {
  await delay(100);
  return dishes.find((d) => String(d.id) === String(id)) ?? null;
}
