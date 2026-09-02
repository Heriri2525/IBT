import PropTypes from "prop-types";
import Card from "./Card.jsx";

function Dish({
  name,
  price,
  category,
  spicy,
  currency = "ETB",
}) {
  return (
    <Card>
      <div className="dish">
        <h3>{name}</h3>

        <p>
          {price} {currency}
        </p>

        <p className="category">{category}</p>

        {spicy && typeof spicy === "boolean" && (
          <span className="spicy-badge">Spicy</span>
        )}
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
};

export default Dish;