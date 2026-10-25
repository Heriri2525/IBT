"use client";

import Link from "next/link";
import { addToCart } from "../../cart-store";

export default function AddToCart({ dish }) {
  return (
    <div style={{ marginTop: "1rem", display: "flex", gap: ".75rem" }}>
      <button className="btn" onClick={() => addToCart(dish)}>Add to cart</button>
      <Link href="/cart" className="btn alt">Go to cart</Link>
    </div>
  );
}
