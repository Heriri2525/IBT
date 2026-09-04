import { useState } from "react";
import PropTypes from "prop-types";
import Card from "./Card.jsx";

function Dish({
  name,
  price,
  category,
  spicy,
  currency = "ETB",
  onAdd,
}) {
  const [count, setCount] = useState(0);

  function handleAdd() {
    setCount(count + 1);
    onAdd(price);
  }

  return (
    <Card>
      <div className="dish">
        <h3>{name}</h3>

        <p>
          {price} {currency}
        </p>

        <p className="category">{category}</p>

        {spicy && <span className="spicy-badge">Spicy</span>}

        <p className="quantity">
          Quantity: {count}
        </p>

        <button
          className="add-button"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
    </Card>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string,
  spicy: PropTypes.bool,
  currency: PropTypes.string,
  onAdd: PropTypes.func.isRequired,
};

export default Dish;