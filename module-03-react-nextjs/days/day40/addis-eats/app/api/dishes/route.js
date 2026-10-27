import { getDishes } from "@/lib/dishes";

// For callers outside our pages (a partner app, curl). Our own server components
// do NOT call this — they use lib/dishes.js directly.
export const revalidate = 3600;

export async function GET() {
  return Response.json({ dishes: await getDishes() });
}
