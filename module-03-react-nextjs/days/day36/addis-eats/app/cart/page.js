import Link from "next/link";
import CheckoutButton from "./CheckoutButton";

export const metadata = { title: "Cart · Addis Eats" };

export default function CartPage() {
  return (
    <section>
      <h1>Your cart</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Your cart is empty for now (state arrives in a later lesson).
      </p>
      <p style={{ marginBottom: "1rem" }}><Link href="/menu">Browse the menu</Link></p>
      <CheckoutButton />
    </section>
  );
}
