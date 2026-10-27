"use client";

// The cart context. This file is the only place that needs state for the whole app,
// so it is the client boundary; app/layout.js stays a server component and passes
// {children} in (they stay server-rendered).
//
// The cart lives in the browser as a cookie of [{ id, qty }] — ids and quantities
// only, never prices. The server reads that cookie at checkout and prices the order.
import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { CART_COOKIE, MAX_QTY, parseCart } from "@/lib/cart";

const listeners = new Set();
const readRaw = () => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${CART_COOKIE}=([^;]*)`));
  return m ? m[1] : "";
};
const subscribe = (cb) => { listeners.add(cb); return () => listeners.delete(cb); };
function write(lines) {
  document.cookie = `${CART_COOKIE}=${encodeURIComponent(JSON.stringify(lines))}; path=/; max-age=604800; SameSite=Lax`;
  listeners.forEach((cb) => cb());
}

const CartContext = createContext(null);

export function Providers({ children }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const value = useMemo(() => {
    const lines = parseCart(raw);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      add: (id) => {
        const next = lines.map((l) => ({ ...l }));
        const found = next.find((l) => l.id === id);
        if (found) found.qty = Math.min(found.qty + 1, MAX_QTY); else next.push({ id, qty: 1 });
        write(next);
      },
      setQty: (id, qty) => write(lines.map((l) => (l.id === id ? { ...l, qty } : l)).filter((l) => l.qty > 0)),
      clear: () => write([]),
    };
  }, [raw]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <Providers>");
  return ctx;
}
