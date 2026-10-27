import { Suspense } from "react";
import DishList from "./DishList";
import DishSkeleton from "./DishSkeleton";
import FilterShell from "./FilterShell";
import { getDishes } from "./dishes";

export const metadata = { title: "Menu · Addis Eats" };

// ISR (Day 37, unchanged): built at deploy time, then regenerated in the background
// at most hourly.
export const revalidate = 3600;

// Plain object of numbers: serialisable, so it may be passed to a client component.
function countByCategory(dishes) {
  const counts = {};
  for (const d of dishes) counts[d.category] = (counts[d.category] ?? 0) + 1;
  return counts;
}

// ASYNC SERVER COMPONENT: awaits its data directly. No useState, no useEffect, no
// loading flag, no /api endpoint. loading.js / <Suspense> cover the wait, error.js
// catches a throw.
async function Dishes() {
  const dishes = await getDishes(); // the slow part
  return (
    <FilterShell counts={countByCategory(dishes)}> {/* client */}
      <DishList dishes={dishes} /> {/* server: passed as children, never imported */}
    </FilterShell>
  );
}

export default function MenuPage() {
  return (
    <section>
      <h1>Menu</h1>
      {/* Sidebar (in menu/layout.js) is already on screen; only this waits. */}
      <Suspense fallback={<DishSkeleton />}>
        <Dishes />
      </Suspense>
    </section>
  );
}
