import DishSkeleton from "./DishSkeleton";

export default function Loading() {
  return (
    <section aria-busy="true">
      <h1>Menu</h1>
      <DishSkeleton />
    </section>
  );
}
