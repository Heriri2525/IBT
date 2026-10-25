"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Receives ALL dishes from the server and filters in the browser by ?category=.
export default function DishList({ dishes }) {
  const params = useSearchParams();
  // Deliberate failure to prove error.js: open /menu?crash=1
  if (params.get("crash")) throw new Error("Deliberate crash from /menu?crash=1");
  const category = params.get("category");
  const shown = category ? dishes.filter((d) => d.category === category) : dishes;

  if (shown.length === 0) return <p className="muted">No dishes in this category.</p>;
  return (
    <ul className="grid">
      {shown.map((d) => (
        <li key={d.id} className="card">
          <h2><Link href={`/menu/${d.id}`}>{d.name}</Link></h2>
          <p className="muted">{d.category}{d.spicy ? " · 🌶 spicy" : ""}</p>
          <p className="price">{d.price} ETB</p>
        </li>
      ))}
    </ul>
  );
}
