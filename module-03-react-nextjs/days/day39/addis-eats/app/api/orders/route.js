import { jsonError } from "@/lib/http";
import { submitOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

// POST /api/orders
//   201 { id, total, currency, status }              order created
//   400 { error }                                    body is not a JSON object
//   422 { error, fieldErrors }                       well-formed, but the values failed validation
//   500 { error }                                    we broke, not you (details are only logged)
//
// Anyone can call this with curl and no form at all, so every rule is enforced HERE:
// the schema, the dish ids and the prices. Nothing the browser checked is trusted.
// A signed-in caller owns the order; anyone else orders as a guest.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Request body must be valid JSON", 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return jsonError("Request body must be a JSON object", 400);
  }

  try {
    const user = await getSession();
    const result = await submitOrder(body, user?.id ?? null);
    if (!result.ok) {
      return jsonError("Validation failed", 422, { fieldErrors: result.fieldErrors });
    }
    return Response.json(result.order, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders failed:", err); // the stack trace stays on the server
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
