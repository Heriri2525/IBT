import { listOrders } from "@/lib/orders";
import CancelButton from "./CancelButton";

export const metadata = { title: "Orders · Addis Eats" };

// CACHED: no cookies, headers or request data, so this page is prerendered and reused
// (ISR, like /menu). placeOrder and cancelOrder call revalidatePath("/orders") after
// writing, which is what makes a new order appear straight away instead of in an hour.
export const revalidate = 3600;

export default function OrdersPage() {
  const orders = listOrders();
  return (
    <section>
      <h1>Orders</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        A cancel button is shown on every open order on purpose. Whether it works is decided by
        the server, not by the button.
      </p>
      <ul className="grid">
        {orders.map((o) => (
          <li key={o.id} className="card">
            <h2>{o.id} · {o.status}</h2>
            <p className="muted">{o.area} · {o.owner}</p>
            <p style={{ margin: ".5rem 0" }}>
              {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
            </p>
            <p className="price">{o.total} {o.currency}</p>
            {o.status === "placed" && <CancelButton orderId={o.id} />}
          </li>
        ))}
      </ul>
    </section>
  );
}
