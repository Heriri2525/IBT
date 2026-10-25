import Link from "next/link";

export default function DishList({ dishes }) {
  if (dishes.length === 0) return <p className="muted">No dishes in this category.</p>;
  return (
    <ul className="grid">
      {dishes.map((d) => (
        <li key={d.id} className="card">
          <h2>
            <Link href={`/menu/${d.id}`}>{d.name}</Link>
          </h2>
          <p className="muted">{d.category}{d.spicy ? " · 🌶 spicy" : ""}</p>
          <p className="price">{d.price} ETB</p>
        </li>
      ))}
    </ul>
  );
}
