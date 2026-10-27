import { CATEGORIES } from "@/lib/categories";
import { searchDishes } from "@/lib/dishes";

// GET /api/dishes?q=tib&category=Vegetarian&page=2
//   200 { dishes, total, page, pageSize, pageCount } · 400 for a bad page number
// Called by the browser's SWR queries (search + paging). Our server components do NOT use it.
export async function GET(request) {
  const p = new URL(request.url).searchParams;
  const page = p.has("page") ? Number(p.get("page")) : 1;
  if (!Number.isInteger(page) || page < 1) {
    return Response.json({ error: "page must be a whole number, 1 or more" }, { status: 400 });
  }
  const category = p.get("category") ?? "All";
  if (!CATEGORIES.includes(category)) {
    return Response.json({ error: `Unknown category "${category}"` }, { status: 400 });
  }
  const q = (p.get("q") ?? "").slice(0, 60);
  return Response.json(await searchDishes({ q, category, page }));
}
