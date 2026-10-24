import { memo } from "react";

function Dish({ dish, onAdd }) {
  const { name, price, category, spicy } = dish;

  return (
    <div className="dish">
      <h3>{name}</h3>
      <p className="category">{category}</p>
      {spicy && <span className="spicy-badge">🌶️ Spicy</span>}
      <strong>{price} ETB</strong>
      <div>
        <button className="add-button" onClick={() => onAdd(dish)}>
          Add to order
        </button>
      </div>
    </div>
  );
}

// memo + stable onAdd (useCallback in the provider) = skipped re-renders
export default memo(Dish);
