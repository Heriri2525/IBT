"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/providers";
import { priceCart } from "@/lib/cart";

// Client: order lines and the running ETB total, from the browser's own cart.
export default function CartPanel({ dishes }) {
  const { lines, setQty, clear } = useCart();
  const router = useRouter();
  const cart = priceCart(lines, dishes);

  if (cart.lines.length === 0) {
    return (
      <>
        <p className="muted" style={{ marginBottom: "1rem" }}>Your cart is empty.</p>
        <Link href="/menu">Browse the menu</Link>
      </>
    );
  }
  return (
    <>
      <ul className="lines">
        {cart.lines.map((l) => (
          <li key={l.id} className="line">
            <span>{l.name} · {l.price} ETB</span>
            <span className="qty">
              <button aria-label={`Fewer ${l.name}`} onClick={() => setQty(l.id, l.qty - 1)}>−</button>
              <span>{l.qty}</span>
              <button aria-label={`More ${l.name}`} onClick={() => setQty(l.id, l.qty + 1)}>+</button>
            </span>
            <strong>{l.lineTotal} ETB</strong>
          </li>
        ))}
      </ul>
      <p>Subtotal: {cart.subtotal} ETB</p>
      <p>Delivery: {cart.fee === 0 ? "free" : `${cart.fee} ETB`}</p>
      <p style={{ margin: ".5rem 0 1rem" }}><strong data-testid="total">Total: {cart.total} ETB</strong></p>
      <div className="row">
        <button className="btn" onClick={() => router.push("/checkout")}>Proceed to checkout</button>
        <button className="btn alt" onClick={clear}>Clear cart</button>
      </div>
    </>
  );
}
