import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/session";
import OrderForm from "./OrderForm";

export const metadata = { title: "Checkout · Addis Eats" };

async function LivePricing() {
  await new Promise((r) => setTimeout(r, 800)); // pretend: live pricing service
  return <p className="price" data-testid="pricing">Delivery today: 45 ETB (live price)</p>;
}

export default async function CheckoutPage() {
  // THE READ THAT MAKES THIS ROUTE DYNAMIC: the session cookie depends on who is asking.
  const user = await getSession();

  return (
    <section>
      <h1>Checkout</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        {user ? (
          `Signed in as ${user.name}.`
        ) : (
          <>Ordering as a guest. <Link href="/signin">Sign in</Link> to own (and cancel) your orders.</>
        )}
      </p>
      <Suspense fallback={<p className="muted">Fetching live pricing…</p>}>
        <LivePricing />
      </Suspense>
      <div style={{ margin: "1rem 0" }}>
        <OrderForm />
      </div>
      <p style={{ marginTop: "1rem" }}><Link href="/cart">← Back to cart</Link></p>
    </section>
  );
}
