import { memo } from "react";

export const categories = [
  "All",
  "Ethiopian",
  "Vegetarian",
  "Breakfast",
  "Fast Food",
];

function CategoryBar({ category, onChange }) {
  return (
    <div className="category-bar">
      {categories.map((item) => (
        <button
          key={item}
          className={category === item ? "chip on" : "chip"}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default memo(CategoryBar);
