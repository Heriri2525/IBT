import { notFound, redirect } from "next/navigation";
import SignOutButton from "@/app/SignOutButton";
import { listAllOrders } from "@/lib/orders";
import { getSession } from "@/lib/session";
import ReadyButton from "./ReadyButton";

export const metadata = { title: "Kitchen · Addis Eats" };

// STAFF ONLY, checked on the server. The role comes from the session record, not from anything
// the browser sent. A customer gets a 404, so the page does not even confirm that it exists.
export default async function KitchenPage() {
  const user = await getSession();
  if (!user) redirect("/signin?next=/kitchen");
  if (user.role !== "staff") notFound();

  const orders = listAllOrders();
  return (
    <section>
      <h1>Kitchen</h1>
      <div style={{ display: "flex", gap: ".75rem", alignItems: "center", margin: "0 0 1rem" }}>
        <span className="muted">Signed in as {user.name} (staff)</span>
        <SignOutButton />
      </div>
      <ul className="grid">
        {orders.map((o) => (
          <li key={o.id} className="card">
            <h2>{o.id} · {o.status}</h2>
            <p className="muted">{o.area} · {o.owner}</p>
            <p style={{ margin: ".5rem 0" }}>
              {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
            </p>
            {o.status === "placed" && <ReadyButton orderId={o.id} />}
          </li>
        ))}
      </ul>
    </section>
  );
}
