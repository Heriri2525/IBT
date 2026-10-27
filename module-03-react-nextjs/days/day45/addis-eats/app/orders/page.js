import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "@/app/SignOutButton";
import { listOrdersFor } from "@/lib/orders";
import { getSession } from "@/lib/session";
import LiveOrders from "./LiveOrders";
import { NO_INDEX } from "@/lib/site";

export const metadata = {
  title: "My orders",
  description: "Your Addis Eats orders and their status. Sign in to see them.",
  robots: NO_INDEX,
};

// Day 45: the list is rendered by <LiveOrders>, a client component seeded with `orders` below.
// PRIVATE, so no longer cached: the page depends on who is asking (Day 37), and reading the
// session cookie makes it dynamic. Layers: middleware (cookie exists) -> THIS check (session is
// real) -> the cancel action (ownership).
export default async function OrdersPage() {
  const user = await getSession();
  if (!user) redirect("/signin?next=/orders"); // layer 2: do not trust that middleware ran

  // Scoped to the SESSION's id. There is no id in the URL to change.
  const orders = listOrdersFor(user.id);

  return (
    <section>
      <h1>My orders</h1>
      <div style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap", margin: "0 0 1rem" }}>
        <span className="muted">Signed in as {user.name}</span>
        {/* Showing this link is interface only. /kitchen and markReady refuse customers themselves. */}
        {user.role === "staff" && <Link href="/kitchen">Kitchen</Link>}
        <SignOutButton />
      </div>

      {/* The server's answer seeds the client query: data on arrival, then it stays live. */}
      <LiveOrders initialOrders={orders} />
    </section>
  );
}
