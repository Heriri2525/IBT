"use client";

import { useCart } from "@/app/providers";

// Client leaf: an onClick that writes to the cart store. Receives only a number.
export default function AddToCartButton({ dishId }) {
  const { add, lines } = useCart();
  const inCart = lines.find((l) => l.id === dishId)?.qty ?? 0;
  return (
    <button className="btn" onClick={() => add(dishId)}>
      Add to order{inCart ? ` (${inCart} in cart)` : ""}
    </button>
  );
}
