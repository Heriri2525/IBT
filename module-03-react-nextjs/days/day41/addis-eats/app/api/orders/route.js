import { getDishes } from "@/lib/dishes";
import { MAX_QTY, priceCart } from "@/lib/cart";
import { validateOrder } from "@/lib/validate-order";
import { getSession } from "@/lib/session";
import { createOrder, listOrders, publicOrder } from "@/lib/orders";

// GET /api/orders -> the signed-in person's own orders. 401 without a session.
export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in first" }, { status: 401 });
  return Response.json({ orders: listOrders(session.id).map(publicOrder) });
}

// POST /api/orders  { name, phone, area, notes?, items: [{ id, qty }] }
//   201 created · 400 not JSON · 415 wrong content type · 422 validation (fieldErrors)
export async function POST(request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Send Content-Type: application/json" }, { status: 415 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body is not valid JSON" }, { status: 400 });
  }

  const result = validateOrder(body); // the SAME schema the checkout form's action uses
  const fieldErrors = { ...result.fieldErrors };

  const items = Array.isArray(body?.items) ? body.items : [];
  const valid = items.every((l) => Number.isInteger(l?.id) && Number.isInteger(l?.qty) && l.qty >= 1 && l.qty <= MAX_QTY);
  const cart = priceCart(valid ? items : [], await getDishes());
  if (!valid || cart.lines.length === 0 || cart.lines.length !== items.length) {
    fieldErrors.items = `items must be a non-empty list of { id: <existing dish id>, qty: 1-${MAX_QTY} }`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json({ error: "Validation failed", fieldErrors }, { status: 422 });
  }

  const session = await getSession();
  const order = createOrder({
    owner: session?.id ?? "api",
    customer: result.values,
    lines: cart.lines, subtotal: cart.subtotal, fee: cart.fee, total: cart.total,
  });
  return Response.json({ order: publicOrder(order) }, { status: 201 });
}
