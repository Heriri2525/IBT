import Link from "next/link";
import Image from "next/image";
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
      {/* The one big image above the fold on this page, so it is the one with `priority`. */}
      <Image
        className="dish-img"
        src={`/dishes/${dish.slug}.jpg`}
        alt={`${dish.name}, ${dish.category.toLowerCase()} dish`}
        width={800}
        height={600}
        priority
        sizes="(max-width: 640px) 100vw, 600px"
      />
      <h1>{dish.name}</h1>
      <p className="muted">{dish.category}{dish.spicy ? " · 🌶 spicy" : ""}{dish.special ? " · ⭐ special" : ""}</p>
      <p style={{ margin: ".75rem 0" }}>{dish.description}</p>
      <p className="price">{dish.price} ETB</p>
      <AddToCart dish={{ id: dish.id, name: dish.name, price: dish.price }} />
    </article>
  );
}
