import { getDish } from "@/lib/dishes";

export async function GET(_request, { params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) return Response.json({ error: `No dish with id "${id}"` }, { status: 404 });
  return Response.json({ dish });
}
