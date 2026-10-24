import { memo } from "react";
import Dish from "./Dish";
import { logRender } from "../hooks/logRender";

function DishList({ dishes, onAdd }) {
  logRender("DishList");
  if (dishes.length === 0) {
    return <p className="empty-message">No dishes found.</p>;
  }

  return (
    <div className="menu">
      {dishes.map((dish) => (
        <Dish key={dish.id} dish={dish} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default memo(DishList);
