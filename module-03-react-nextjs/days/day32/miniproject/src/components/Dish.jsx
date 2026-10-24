import { memo } from "react";
import { Link } from "react-router-dom";
import { logRender } from "../hooks/logRender";

function Dish({ dish, onAdd }) {
  logRender("Dish");
  const { name, price, category, spicy, slug } = dish;

  return (
    <div className="dish">
      <h3>
        {/* Link to a dynamic route: /menu/doro-wat */}
        <Link to={`/menu/${slug}`} className="dish-link">
          {name}
        </Link>
      </h3>
      <p className="category">{category}</p>
      {spicy && <span className="spicy-badge">🌶️ Spicy</span>}
      <strong>{price} ETB</strong>
      <div>
        <Link to={`/menu/${slug}`} className="details-link">
          View details
        </Link>
      </div>
      <div>
        <button className="add-button" onClick={() => onAdd(dish)}>
          Add to order
        </button>
      </div>
    </div>
  );
}

export default memo(Dish);
