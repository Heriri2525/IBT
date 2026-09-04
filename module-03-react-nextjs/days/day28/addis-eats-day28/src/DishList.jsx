import PropTypes from "prop-types";
import Dish from "./Dish.jsx";

function DishList({ dishes, onAdd }) {
  if (dishes.length === 0) {
    return (
      <p className="empty-message">
        No dishes found in this category.
      </p>
    );
  }

  return (
    <div className="menu">
      {dishes.map((dish) => (
        <Dish
          key={dish.id}
          name={dish.name}
          price={dish.price}
          category={dish.category}
          spicy={dish.spicy}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}

DishList.propTypes = {
  dishes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      spicy: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default DishList;