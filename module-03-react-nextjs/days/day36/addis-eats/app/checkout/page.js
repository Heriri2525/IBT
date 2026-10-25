import Link from "next/link";

export const metadata = { title: "Checkout · Addis Eats" };

export default function CheckoutPage() {
  return (
    <section>
      <h1>Checkout</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>The checkout form lands here later.</p>
      <Link href="/cart">← Back to cart</Link>
    </section>
  );
}
