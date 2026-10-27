import Link from "next/link";
import { notFound } from "next/navigation";
import { getDish, getDishes } from "../dishes";
import AddToCart from "./AddToCart";

// One static HTML page per dish, built at `next build` time.
// (ids must be strings.) A dish added after the build is rendered on first
// request and then cached, because dynamicParams defaults to true.
export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((d) => ({ id: String(d.id) }));
}

export default async function DishPage({ params }) {
  const { id } = await params; // Next 15/16: params is a Promise
  const dish = await getDish(id);
  if (!dish) notFound();

  return (
    <article className="card">
      <p><Link href="/menu">← Back to menu</Link></p>
      <h1>{dish.name}</h1>
      <p className="muted">{dish.category}{dish.spicy ? " · 🌶 spicy" : ""}{dish.special ? " · ⭐ special" : ""}</p>
      <p style={{ margin: ".75rem 0" }}>{dish.description}</p>
      <p className="price">{dish.price} ETB</p>
      <AddToCart dish={{ id: dish.id, name: dish.name, price: dish.price }} />
    </article>
  );
}
