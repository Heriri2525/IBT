import CartPanel from "./CartPanel";
import { getDishes } from "@/lib/dishes";

export const metadata = { title: "Cart · Addis Eats" };

// Static shell. The cart is private to this browser, so its contents render on the client;
// the server only supplies the dish list (plain data) to look names and prices up.
export default async function CartPage() {
  const dishes = await getDishes();
  return (
    <section>
      <h1>Your cart</h1>
      <CartPanel dishes={dishes} />
    </section>
  );
}
