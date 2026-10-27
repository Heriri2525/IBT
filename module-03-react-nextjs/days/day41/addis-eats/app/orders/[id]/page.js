import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import OrderStatus, { OrderBadge } from "./OrderStatus";
import { getSession } from "@/lib/session";
import { getOrder, publicOrder } from "@/lib/orders";

export const metadata = { title: "Order status · Addis Eats" };

// Dynamic: depends on who is asking (session cookie) and on the current time.
// The server renders the order NOW; the client then polls it (see OrderStatus.jsx).
export default async function OrderPage({ params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/checkout?notice=signin");
  const order = getOrder(id);
  if (!order || order.owner !== session.id) notFound();
  const initial = publicOrder(order);

  return (
    <section>
      <h1>Order {initial.id} <OrderBadge id={id} initial={initial} /></h1>
      <OrderStatus id={id} initial={initial} />
      <p style={{ marginTop: "1rem" }}><Link href="/checkout">← Back to checkout</Link> · <Link href="/menu">Menu</Link></p>
    </section>
  );
}
