"use server";
// Server actions = public POST endpoints. Every one re-checks the session and
// re-validates its input itself; nothing is trusted because "the button was hidden".

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDishes } from "@/lib/dishes";
import { CART_COOKIE, parseCart, priceCart } from "@/lib/cart";
import { validateOrder } from "@/lib/validate-order";
import { clearSession, getSession, setSession } from "@/lib/session";
import { cancelOrderFor, createOrder } from "@/lib/orders";

export async function signIn(formData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length > 60) redirect("/checkout?notice=name");
  await setSession(name);
  redirect("/checkout");
}

export async function signOut() {
  await clearSession();
  redirect("/checkout");
}

// useActionState(placeOrder, {}) -> returns { error?, fieldErrors?, values? } or redirects on success
export async function placeOrder(_prev, formData) {
  const session = await getSession(); // 1. who is asking? (checked HERE, not in the component)
  if (!session) return { error: "Your session has ended. Please sign in again." };

  const result = validateOrder(Object.fromEntries(formData)); // 2. the same schema as POST /api/orders
  if (!result.ok) return { fieldErrors: result.fieldErrors, values: result.values };

  // 3. price the order on the server from the cart cookie: ids and quantities only
  const cart = priceCart(parseCart((await cookies()).get(CART_COOKIE)?.value), await getDishes());
  if (cart.lines.length === 0) return { error: "Your cart is empty.", values: result.values };

  const order = createOrder({
    owner: session.id,
    customer: result.values,
    lines: cart.lines, subtotal: cart.subtotal, fee: cart.fee, total: cart.total,
  });
  (await cookies()).delete(CART_COOKIE);
  redirect(`/checkout?placed=${order.id}`);
}

// Ownership is enforced inside the action: tampering with orderId can't cancel someone else's order.
export async function cancelOrder(formData) {
  const session = await getSession();
  if (!session) redirect("/checkout?notice=signin");
  const outcome = cancelOrderFor(session.id, String(formData.get("orderId") ?? ""));
  redirect(`/checkout?notice=${outcome === "ok" ? "cancelled" : outcome}`);
}
