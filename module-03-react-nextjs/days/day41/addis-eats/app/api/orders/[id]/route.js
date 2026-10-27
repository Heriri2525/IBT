import { getSession } from "@/lib/session";
import { getOrder, publicOrder } from "@/lib/orders";

// GET /api/orders/:id — polled by the order-status screen every 5 s.
//   200 { order } · 401 no session · 404 unknown id OR someone else's order (we don't reveal which)
export async function GET(_request, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in first" }, { status: 401 });
  const order = getOrder(id);
  if (!order || order.owner !== session.id) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }
  return Response.json({ order: publicOrder(order) });
}
