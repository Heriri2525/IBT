import PropTypes from "prop-types";

function CategoryBar({ selected, onSelect }) {
  const categories = [
    "All",
    "Main",
    "Side",
    "Breakfast",
  ];

  return (
    <div className="category-bar">
      {categories.map((category) => (
        <button
          key={category}
          className={
            category === selected
              ? "chip on"
              : "chip"
          }
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

CategoryBar.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryBar;