function Dish({ name, price, category, spicy }) {
  return (
    <div className="dish">
      <h3>{name}</h3>

      <p className="category">
        {category}
      </p>

      {spicy && (
        <span className="spicy-badge">
          🌶️ Spicy
        </span>
      )}

      <strong>{price} ETB</strong>
    </div>
  );
}

export default Dish;