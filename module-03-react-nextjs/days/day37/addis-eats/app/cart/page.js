import CartPanel from "./CartPanel";

export const metadata = { title: "Cart · Addis Eats" };

// Static shell; the contents are client-rendered from the browser's own storage.
export default function CartPage() {
  return (
    <section>
      <h1>Your cart</h1>
      <CartPanel />
    </section>
  );
}
