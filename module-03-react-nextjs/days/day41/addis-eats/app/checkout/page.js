import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";
import CheckoutForm from "./CheckoutForm";
import { cancelOrder, signIn, signOut } from "@/app/actions";
import { getDishes } from "@/lib/dishes";
import { CART_COOKIE, deliveryFee, parseCart, priceCart } from "@/lib/cart";
import { AREAS, NOTES_MAX } from "@/lib/validate-order";
import { getSession } from "@/lib/session";
import { getOrder, listOrders, statusOf } from "@/lib/orders";

export const metadata = { title: "Checkout · Addis Eats" };

const NOTICES = {
  name: "Please enter your name (up to 60 characters).",
  signin: "Please sign in first.",
  cancelled: "Order cancelled.",
  forbidden: "That order belongs to someone else — nothing was changed.",
  "not-found": "We couldn’t find that order.",
  "too-late": "That order can no longer be cancelled.",
};

// Streams in behind the already-visible summary (simulated rider-availability lookup).
async function DeliveryAndTotal({ subtotal }) {
  await new Promise((r) => setTimeout(r, 800));
  const fee = deliveryFee(subtotal);
  return (
    <>
      <p data-testid="delivery">Delivery: {fee === 0 ? "free" : `${fee} ETB`}</p>
      <p><strong data-testid="grand-total">Total: {subtotal + fee} ETB</strong></p>
    </>
  );
}

export default async function CheckoutPage({ searchParams }) {
  const { notice, placed } = await searchParams;
  // THE READS THAT MAKE THIS ROUTE DYNAMIC: both depend on who is asking.
  const session = await getSession(); // cookies(): the `session` cookie
  const cartCookie = (await cookies()).get(CART_COOKIE)?.value; // cookies(): the `cart` cookie

  const banner = NOTICES[notice] && (
    <p className={"banner" + (notice === "cancelled" ? " ok" : "")} role="status">{NOTICES[notice]}</p>
  );

  if (!session) {
    return (
      <section>
        <h1>Checkout</h1>
        {banner}
        <form action={signIn} className="card">
          <p className="muted" style={{ marginBottom: ".75rem" }}>Tell us who is ordering to continue.</p>
          <div className="form-group">
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" required autoComplete="name" />
          </div>
          <button className="btn" type="submit">Continue</button>
        </form>
      </section>
    );
  }

  const placedOrder = placed ? getOrder(placed) : null;
  const cart = priceCart(parseCart(cartCookie), await getDishes());
  const orders = listOrders(session.id);

  return (
    <section>
      <h1>Checkout</h1>
      {banner}
      <div className="row" style={{ marginBottom: "1rem" }}>
        <span className="muted">Signed in as {session.name}</span>
        <form action={signOut}><button className="btn alt" type="submit">Sign out</button></form>
      </div>

      {placed && placedOrder?.owner === session.id && (
        <p className="banner ok" role="status" data-testid="confirmation">
          Order {placedOrder.id} placed — {placedOrder.total} ETB. Thank you, {placedOrder.customer.name}!{" "}
          <Link href={`/orders/${placedOrder.id}`}>Track this order →</Link>
        </p>
      )}
      {placed && placedOrder?.owner !== session.id && <p className="banner" role="alert">We couldn’t find that order.</p>}

      {cart.lines.length === 0 ? (
        <p className="muted" style={{ marginBottom: "1rem" }}>
          Your cart is empty. <Link href="/menu">Browse the menu</Link>
        </p>
      ) : (
        <>
          <ul className="lines">
            {cart.lines.map((l) => (
              <li key={l.id} className="line"><span>{l.name} × {l.qty}</span><strong>{l.lineTotal} ETB</strong></li>
            ))}
          </ul>
          <p>Subtotal: {cart.subtotal} ETB</p>
          <Suspense fallback={<p className="muted">Fetching delivery price…</p>}>
            <DeliveryAndTotal subtotal={cart.subtotal} />
          </Suspense>
          <div style={{ marginTop: "1rem" }}>
            <CheckoutForm defaultName={session.name} areas={AREAS} notesMax={NOTES_MAX} />
          </div>
        </>
      )}

      {orders.length > 0 && (
        <>
          <h2 style={{ fontWeight: 700, margin: "1.5rem 0 .5rem" }}>Your orders</h2>
          <ul className="lines">
            {orders.map((o) => (
              <li key={o.id} className="line" data-testid="order">
                <span><Link href={`/orders/${o.id}`}>{o.id}</Link> · {o.total} ETB · <em>{statusOf(o)}</em></span>
                {statusOf(o) === "placed" && (
                  <form action={cancelOrder}>
                    <input type="hidden" name="orderId" value={o.id} />
                    <button className="btn alt" type="submit">Cancel</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <p style={{ marginTop: "1rem" }}><Link href="/cart">← Back to cart</Link></p>
    </section>
  );
}
