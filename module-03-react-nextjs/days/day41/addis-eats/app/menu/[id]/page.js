import Link from "next/link";
import { notFound } from "next/navigation";
import { getDish, getDishes, getReviews } from "@/lib/dishes";
import AddToCartButton from "@/components/AddToCartButton";

// Every dish id is known at build time -> one static HTML file per dish.
export async function generateStaticParams() {
  return (await getDishes()).map((d) => ({ id: String(d.id) }));
}

export default async function DishPage({ params }) {
  const { id } = await params;
  // parallel, not sequential
  const [dish, reviews] = await Promise.all([getDish(id), getReviews(id)]);
  if (!dish) notFound();

  return (
    <article className="card">
      <p><Link href="/menu">← Back to menu</Link></p>
      <h1>{dish.name}</h1>
      <p className="muted">{dish.category}{dish.spicy ? " · 🌶 spicy" : ""}{dish.special ? " · ⭐ special" : ""}</p>
      <p style={{ margin: ".75rem 0" }}>{dish.description}</p>
      <p className="price">{dish.price} ETB</p>
      <div className="row" style={{ marginTop: "1rem" }}>
        <AddToCartButton dishId={dish.id} />
        <Link href="/cart" className="btn alt">Go to cart</Link>
      </div>
      <h2 style={{ fontWeight: 700, marginTop: "1.25rem" }}>Reviews</h2>
      <ul>{reviews.map((r) => <li key={r.who}><strong>{r.who}:</strong> {r.text}</li>)}</ul>
    </article>
  );
}
