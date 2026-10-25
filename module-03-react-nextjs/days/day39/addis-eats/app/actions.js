"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { getOrder, markCancelled, submitOrder } from "@/lib/orders";

// Every export of a "use server" file becomes a real HTTP endpoint that anyone can call
// with any argument. So each action re-checks everything itself.

const field = (formData, key) => String(formData.get(key) ?? "");

// Used with useActionState, so the first argument is the PREVIOUS state.
// Returns the same shapes as the API: { error, fieldErrors } or { id, total, currency }.
export async function placeOrder(prevState, formData) {
  const values = { name: field(formData, "name"), phone: field(formData, "phone"), area: field(formData, "area") };

  let items;
  try {
    items = JSON.parse(field(formData, "items") || "[]");
  } catch {
    items = null; // the schema turns this into fieldErrors.items
  }

  try {
    const user = await getSession();
    const result = await submitOrder({ ...values, items }, user?.id ?? null);
    if (!result.ok) {
      return { error: "Validation failed", fieldErrors: result.fieldErrors, values };
    }
    revalidatePath("/orders"); // the cached orders page is now wrong: refresh it
    return { id: result.order.id, total: result.order.total, currency: result.order.currency };
  } catch (err) {
    console.error("placeOrder failed:", err);
    return { error: "Something went wrong. Please try again.", values };
  }
}

// The authorisation lives HERE, not in the button. The orders page shows a Cancel button
// on every order on purpose: hiding it would be interface, not security.
// Failures are RETURNED (not thrown) because thrown errors are masked in production.
export async function cancelOrder(orderId) {
  const user = await getSession();
  if (!user) return { error: "Not signed in" };

  const order = getOrder(String(orderId));
  if (!order) return { error: "No such order" };
  if (order.userId !== user.id) return { error: "Not yours" }; // ownership, from the record, not the client
  if (order.status === "cancelled") return { error: "Already cancelled" };

  markCancelled(order.id);
  revalidatePath("/orders");
  return { ok: true };
}
