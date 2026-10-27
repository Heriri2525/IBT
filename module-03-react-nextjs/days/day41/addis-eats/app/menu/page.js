import { Suspense } from "react";
import DishList from "./DishList";
import DishBrowser from "./DishBrowser";
import DishSkeleton from "./DishSkeleton";
import { searchDishes } from "@/lib/dishes";

export const metadata = { title: "Menu · Addis Eats" };

// ISR: dishes change a few times a day, so an hour-old page misleads nobody
// and the menu is the most visited route.
export const revalidate = 3600;

async function FirstPage() {
  const first = await searchDishes({ page: 1 }); // server: awaited directly, no endpoint, no hook
  return (
    <DishBrowser pageCount={first.pageCount}>
      <DishList dishes={first.dishes} />
    </DishBrowser>
  );
}

export default function MenuPage() {
  return (
    <section>
      <h1>Menu</h1>
      <Suspense fallback={<DishSkeleton />}>
        <FirstPage />
      </Suspense>
    </section>
  );
}
