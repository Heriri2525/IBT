import DishCard from "@/components/DishCard";

// Server component: ships no JavaScript. data-category lets the client shell hide cards via CSS.
export default function DishList({ dishes }) {
  return (
    <ul className="grid">
      {dishes.map((d) => (
        <li key={d.id} className="dish-item" data-category={d.category}>
          <DishCard dish={d} />
        </li>
      ))}
    </ul>
  );
}
