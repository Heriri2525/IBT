import Dish from "./Dish";

function DishList({ dishes }) {
  if (dishes.length === 0) {
    return (
      <p className="empty-message">
        No dishes found.
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
        />
      ))}
    </div>
  );
}

export default DishList;