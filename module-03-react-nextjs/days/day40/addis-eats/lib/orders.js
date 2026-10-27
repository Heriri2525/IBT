// In-memory order store (resets when the server restarts) — stands in for a database.
// Every order remembers its owner (session id); reads and cancels check it.
import "server-only";
import { randomBytes } from "node:crypto";

const store = (globalThis.__addisOrders ??= new Map());

export function createOrder({ owner, customer, lines, subtotal, fee, total }) {
  const order = {
    id: "ord_" + randomBytes(4).toString("hex"),
    owner, customer, lines, subtotal, fee, total,
    status: "placed",
    createdAt: new Date().toISOString(),
  };
  store.set(order.id, order);
  return order;
}
export const getOrder = (id) => store.get(id) ?? null;
export const listOrders = (owner) => [...store.values()].filter((o) => o.owner === owner).reverse();

// returns "ok" | "not-found" | "forbidden" | "too-late"
export function cancelOrderFor(owner, id) {
  const o = store.get(id);
  if (!o) return "not-found";
  if (o.owner !== owner) return "forbidden"; // the ownership check lives HERE, server-side
  if (o.status !== "placed") return "too-late";
  o.status = "cancelled";
  return "ok";
}
