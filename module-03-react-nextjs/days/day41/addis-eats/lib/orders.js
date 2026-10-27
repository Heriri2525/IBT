// In-memory order store (resets when the server restarts) — stands in for a database.
// Every order remembers its owner (session id); reads and cancels check it.
import "server-only";
import { STEPS } from "./order-steps";
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
  if (statusOf(o) !== "placed") return "too-late";
  o.status = "cancelled";
  return "ok";
}

// Status moves with time (a stand-in for a real kitchen/rider system), so polling has something to show.

const STEP_SECONDS = [0, 10, 25, 45];

export function statusOf(order) {
  if (order.status === "cancelled") return "cancelled";
  const age = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  let step = 0;
  STEP_SECONDS.forEach((s, i) => { if (age >= s) step = i; });
  return STEPS[step];
}

// What the browser may see: no owner id; status computed fresh.
export function publicOrder(o) {
  return {
    id: o.id, status: statusOf(o), createdAt: o.createdAt,
    customer: { name: o.customer.name, area: o.customer.area },
    lines: o.lines, subtotal: o.subtotal, fee: o.fee, total: o.total,
  };
}
