import { memo } from "react";
import DishCard from "./DishCard";

// `emptyMessage` lets the parent explain WHY the list is empty.
function DishList({ dishes, onAdd, emptyMessage = "No dishes found." }) {
  if (dishes.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }

  return (
    <div className="menu">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default memo(DishList);
