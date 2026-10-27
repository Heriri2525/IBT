import Link from "next/link";

// Server component: pure markup from data, ships no JavaScript of its own.
// Shared by the home page (specials) and the menu list.
export default function DishCard({ dish }) {
  return (
    <div className="card">
      <h2><Link href={`/menu/${dish.id}`}>{dish.name}</Link></h2>
      <p className="muted">
        {dish.category}{dish.spicy ? " · 🌶 spicy" : ""}
        {dish.special ? <> · <span className="tag">special</span></> : null}
      </p>
      <p className="price">{dish.price} ETB</p>
    </div>
  );
}
