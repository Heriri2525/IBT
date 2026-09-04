import { useState } from "react";
import PropTypes from "prop-types";
import CategoryBar from "./CategoryBar.jsx";
import DishList from "./DishList.jsx";
import OrderForm from "./OrderForm.jsx";

function Menu({ menu }) {
  const [category, setCategory] = useState("All");
  const [total, setTotal] = useState(0);

  const filteredMenu =
    category === "All"
      ? menu
      : menu.filter(
          (dish) => dish.category === category
        );

  function addToOrder(price) {
    setTotal(total + price);
  }

  return (
    <div>
      <CategoryBar
        selected={category}
        onSelect={setCategory}
      />

      <DishList
        dishes={filteredMenu}
        onAdd={addToOrder}
      />

      <div className="order-total">
        <h2>Order Total: {total} ETB</h2>
      </div>

      <OrderForm />
    </div>
  );
}

Menu.propTypes = {
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      spicy: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default Menu;