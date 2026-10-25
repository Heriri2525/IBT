import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata = { title: "Checkout · Addis Eats" };

async function LivePricing() {
  await new Promise((r) => setTimeout(r, 800)); // pretend: live pricing service
  return <p className="price" data-testid="pricing">Delivery today: 45 ETB (live price)</p>;
}

export default async function CheckoutPage() {
  // THE READ THAT MAKES THIS ROUTE DYNAMIC: cookies() depends on who is asking.
  const session = (await cookies()).get("session");

  return (
    <section>
      <h1>Checkout</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        {session ? `Signed in (session ${session.value}).` : "Ordering as a guest."}
      </p>
      <Suspense fallback={<p className="muted">Fetching live pricing…</p>}>
        <LivePricing />
      </Suspense>
      <p style={{ marginTop: "1rem" }}><Link href="/cart">← Back to cart</Link></p>
    </section>
  );
}
