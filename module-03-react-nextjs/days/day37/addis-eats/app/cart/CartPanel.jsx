"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readRaw, subscribe, clearCart } from "../cart-store";
import CheckoutButton from "./CheckoutButton";

// CLIENT rendering: the cart is the person's own, private state in their browser.
export default function CartPanel() {
  // server snapshot "[]" → the static HTML is an empty cart, then the browser fills it in
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  const items = JSON.parse(raw);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <>
        <p className="muted" style={{ marginBottom: "1rem" }}>Your cart is empty.</p>
        <p><Link href="/menu">Browse the menu</Link></p>
      </>
    );
  }
  return (
    <>
      <ul className="grid" style={{ marginBottom: "1rem" }}>
        {items.map((i) => (
          <li key={i.id} className="card">
            <h2>{i.name} × {i.qty}</h2>
            <p className="price">{i.price * i.qty} ETB</p>
          </li>
        ))}
      </ul>
      <p style={{ marginBottom: "1rem" }}><strong>Total: {total} ETB</strong></p>
      <div style={{ display: "flex", gap: ".75rem" }}>
        <CheckoutButton />
        <button className="btn alt" onClick={clearCart}>Clear</button>
      </div>
    </>
  );
}
