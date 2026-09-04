function CategoryBar({ category, setCategory }) {
  const categories = [
    "All",
    "Ethiopian",
    "Vegetarian",
    "Breakfast",
    "Fast Food"
  ];

  return (
    <div className="category-bar">
      {categories.map((item) => (
        <button
          key={item}
          className={
            category === item
              ? "chip on"
              : "chip"
          }
          onClick={() => setCategory(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;