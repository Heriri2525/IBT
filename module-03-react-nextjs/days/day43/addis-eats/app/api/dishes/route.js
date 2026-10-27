import { getDishes } from "@/app/menu/dishes";
import { CATEGORIES } from "@/app/menu/categories";
import { jsonError } from "@/lib/http";

// GET /api/dishes            -> 200, the whole menu
// GET /api/dishes?category=X -> 200, one category; 400 if X is not a real category
// Reading request.url makes this handler dynamic (Day 37 rules apply to handlers too).
export async function GET(request) {
  const category = new URL(request.url).searchParams.get("category");
  const dishes = await getDishes();

  if (category === null || category === "All") return Response.json(dishes);

  // The query string is user input like any other: check it before use.
  if (!CATEGORIES.includes(category)) return jsonError("Unknown category", 400);
  return Response.json(dishes.filter((d) => d.category === category));
}
