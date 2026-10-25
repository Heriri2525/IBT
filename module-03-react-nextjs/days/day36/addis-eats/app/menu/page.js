import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import { getDishes, CATEGORIES } from "./dishes";

export const metadata = { title: "Menu · Addis Eats" };

export default async function MenuPage({ searchParams }) {
  const { category, crash } = await searchParams;

  // Deliberate failure to prove error.js renders: visit /menu?crash=1
  if (crash) throw new Error("Deliberate crash from /menu?crash=1");

  const active = CATEGORIES.includes(category) ? category : "All";
  const dishes = await getDishes(active);

  return (
    <section>
      <h1>Menu</h1>
      <CategoryBar active={active} />
      <DishList dishes={dishes} />
    </section>
  );
}
