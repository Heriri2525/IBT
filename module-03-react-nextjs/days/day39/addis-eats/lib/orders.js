import { getDish } from "@/app/menu/dishes";
import { orderSchema } from "./schema";
import { userName } from "./users";

// SERVER ONLY. A tiny in-memory "database" so the endpoints and actions have something
// real to write to. It lives on globalThis so dev-mode reloads and the separate route
// bundles all share ONE store. It resets when the server restarts; Module 4 swaps it for
// a real database without changing anything that calls these functions.

function seedOrders() {
  const now = new Date().toISOString();
  return [
    {
      id: "ord_1001", userId: "abebe", name: "Abebe", phone: "0911000001", area: "Bole",
      items: [{ id: 1, name: "Doro Wat", price: 320, qty: 2 }],
      total: 640, currency: "ETB", status: "placed", createdAt: now,
    },
    {
      id: "ord_1002", userId: "selam", name: "Selam", phone: "0911000002", area: "Piassa",
      items: [{ id: 3, name: "Tibs", price: 290, qty: 1 }],
      total: 290, currency: "ETB", status: "placed", createdAt: now,
    },
  ];
}

function createStore() {
  const orders = new Map();
  for (const o of seedOrders()) orders.set(o.id, o);
  return { orders, nextNumber: 1003 };
}

const store = (globalThis.__addisEatsOrders ??= createStore());

// What the /orders page may show. No phone number, no user id: those stay on the server.
function toPublic(o) {
  return {
    id: o.id, status: o.status, area: o.area, owner: userName(o.userId),
    items: o.items, total: o.total, currency: o.currency,
  };
}

export function listOrders() {
  return [...store.orders.values()].reverse().map(toPublic); // newest first
}

// The FULL record, including userId. For server-side checks only; never send it out.
export function getOrder(id) {
  return store.orders.get(id) ?? null;
}

export function markCancelled(id) {
  const order = store.orders.get(id);
  if (order) order.status = "cancelled";
}

// The server decides the prices, never the browser.
async function priceItems(items) {
  const dishes = await Promise.all(items.map((i) => getDish(i.id))); // parallel, not sequential
  const missing = items.filter((_, idx) => !dishes[idx]).map((i) => i.id);
  if (missing.length > 0) {
    return { ok: false, errors: missing.map((id) => `No such dish: ${id}`) };
  }
  const lines = items.map((i, idx) => ({
    id: dishes[idx].id, name: dishes[idx].name, price: dishes[idx].price, qty: i.qty,
  }));
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  return { ok: true, lines, total };
}

// THE single enforcement point. Both POST /api/orders and the placeOrder action call this,
// so the rules (schema + real prices + real dish ids) can never drift apart.
//   -> { ok: true, order: { id, total, currency, status } }
//   -> { ok: false, fieldErrors: { field: [messages] } }
export async function submitOrder(input, userId) {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const priced = await priceItems(parsed.data.items);
  if (!priced.ok) return { ok: false, fieldErrors: { items: priced.errors } };

  const id = `ord_${store.nextNumber++}`;
  store.orders.set(id, {
    id, userId, name: parsed.data.name, phone: parsed.data.phone, area: parsed.data.area,
    items: priced.lines, total: priced.total, currency: "ETB", status: "placed",
    createdAt: new Date().toISOString(),
  });
  return { ok: true, order: { id, total: priced.total, currency: "ETB", status: "placed" } };
}
