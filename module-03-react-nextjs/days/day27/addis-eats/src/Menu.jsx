import Dish from "./Dish.jsx";

function Menu({ menu, category }) {
  const filteredMenu =
    category === "All"
      ? menu
      : menu.filter((dish) => dish.category === category);

  return (
    <div className="menu">
      {filteredMenu.length === 0 ? (
        <p className="empty-message">
          No dishes found in this category.
        </p>
      ) : (
        filteredMenu.map((dish) => (
          <Dish
            key={dish.id}
            name={dish.name}
            price={dish.price}
            category={dish.category}
            spicy={dish.spicy}
          />
        ))
      )}
    </div>
  );
}

export default Menu;