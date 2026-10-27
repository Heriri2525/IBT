import Link from "next/link";
import DishCard from "@/components/DishCard";
import { getSpecials } from "@/lib/dishes";

// Static: nobody in particular is asking, and specials only change between builds.
export default async function Home() {
  const specials = await getSpecials();
  return (
    <section>
      <h1>Welcome to Addis Eats</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>Doro wat, kitfo, shiro and more — straight from the kitchen.</p>
      <h2 style={{ fontWeight: 700, margin: "1rem 0 .5rem" }}>Today’s specials</h2>
      {specials.length === 0 ? (
        <p className="muted">No specials today — see the full menu.</p>
      ) : (
        <ul className="grid" style={{ marginBottom: "1rem" }}>
          {specials.map((d) => <li key={d.id}><DishCard dish={d} /></li>)}
        </ul>
      )}
      <Link href="/menu" className="btn alt">See the full menu</Link>
    </section>
  );
}
