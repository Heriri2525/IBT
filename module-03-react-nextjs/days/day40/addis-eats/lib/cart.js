// Cart rules shared by the browser (display) and the server (the real total).
// The cart travels as [{ id, qty }] — NEVER prices. The server prices the order.
export const CART_COOKIE = "cart";
export const MAX_QTY = 20;
export const FREE_DELIVERY_FROM = 500; // ETB
export const DELIVERY_FEE = 45; // ETB

export function parseCart(raw) {
  try {
    const v = JSON.parse(decodeURIComponent(raw ?? ""));
    if (!Array.isArray(v)) return [];
    return v
      .filter((l) => l && Number.isInteger(l.id) && Number.isInteger(l.qty) && l.qty > 0)
      .map((l) => ({ id: l.id, qty: Math.min(l.qty, MAX_QTY) }));
  } catch {
    return [];
  }
}

export function deliveryFee(subtotal) {
  return subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
}

// lines: [{id, qty}] + dishes -> priced lines, subtotal, fee, total
export function priceCart(lines, dishes) {
  const byId = new Map(dishes.map((d) => [d.id, d]));
  const priced = lines
    .map((l) => ({ ...l, dish: byId.get(l.id) }))
    .filter((l) => l.dish)
    .map((l) => ({ id: l.id, name: l.dish.name, price: l.dish.price, qty: l.qty, lineTotal: l.dish.price * l.qty }));
  const subtotal = priced.reduce((s, l) => s + l.lineTotal, 0);
  const fee = deliveryFee(subtotal);
  return { lines: priced, subtotal, fee, total: subtotal + fee };
}
