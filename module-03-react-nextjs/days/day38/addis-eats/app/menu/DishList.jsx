import Link from "next/link";

// SERVER component: pure markup from data, no hooks, no handlers, no directive.
// It ships zero JavaScript. Filtering is done by <FilterShell>, which wraps this
// component as {children} and hides cards using the data-category attribute below.
export default function DishList({ dishes }) {
  return (
    <ul className="grid">
      {dishes.map((d) => (
        <li key={d.id} className="card dish-card" data-category={d.category}>
          <h2><Link href={`/menu/${d.id}`}>{d.name}</Link></h2>
          <p className="muted">{d.category}{d.spicy ? " · 🌶 spicy" : ""}</p>
          <p className="price">{d.price} ETB</p>
        </li>
      ))}
    </ul>
  );
}
