import { Suspense } from "react";
import DishList from "./DishList";
import DishSkeleton from "./DishSkeleton";
import { getDishes } from "./dishes";

export const metadata = { title: "Menu · Addis Eats" };

// ISR: built at deploy time, then regenerated in the background at most hourly.
// 1 hour: dishes change a few times a day, a stale menu misleads nobody for an
// hour, and speed matters most. (A promotion price would need a far shorter window.)
export const revalidate = 3600;

async function Dishes() {
  const dishes = await getDishes(); // the slow part
  return <DishList dishes={dishes} />;
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
