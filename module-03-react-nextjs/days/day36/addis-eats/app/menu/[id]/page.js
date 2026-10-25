import Link from "next/link";
import { notFound } from "next/navigation";
import { getDish } from "../dishes";
import AddToCartLink from "./AddToCartLink";

// Next 15/16: params is a Promise — read it from props and await it (no hook).
export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  return (
    <article className="card">
      <p><Link href="/menu">← Back to menu</Link></p>
      <h1>{dish.name}</h1>
      <p className="muted">{dish.category}{dish.spicy ? " · 🌶 spicy" : ""}{dish.special ? " · ⭐ special" : ""}</p>
      <p style={{ margin: ".75rem 0" }}>{dish.description}</p>
      <p className="price">{dish.price} ETB</p>
      <AddToCartLink />
    </article>
  );
}
