import { Suspense } from "react";
import DishList from "./DishList";
import FilterShell from "./FilterShell";
import DishSkeleton from "./DishSkeleton";
import { getDishes } from "@/lib/dishes";

export const metadata = { title: "Menu · Addis Eats" };

// ISR: dishes change a few times a day, so an hour-old page misleads nobody
// and the menu is the most visited route.
export const revalidate = 3600;

async function Dishes() {
  const dishes = await getDishes(); // server: awaited directly, no hook, no endpoint
  return (
    <FilterShell>
      <DishList dishes={dishes} />
    </FilterShell>
  );
}

export default function MenuPage() {
  return (
    <section>
      <h1>Menu</h1>
      <Suspense fallback={<DishSkeleton />}>
        <Dishes />
      </Suspense>
    </section>
  );
}
