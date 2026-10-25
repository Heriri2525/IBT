import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useCartStore } from "../cart/cartStore";
import NotFound from "../ui/NotFound";
import { dishUrl } from "../api/dishes";

function DishDetail() {
  // useParams returns STRINGS keyed by the names in the path ("menu/:id")
  const { id } = useParams();
  const { data: dish, loading, error, notFound, retry } = useFetch(
    dishUrl(id)
  );
  const addItem = useCartStore((s) => s.addItem);

  // Loading -> error -> empty (param matched nothing) -> data
  if (loading) return <p className="loading">Loading dish...</p>;

  if (error) {
    return (
      <div className="api-error">
        <p>{error}</p>
        <button className="retry-button" onClick={retry}>
          Try Again
        </button>
      </div>
    );
  }

  if (notFound || !dish) {
    return <NotFound message={`No dish called "${id}".`} />;
  }

  return (
    <main className="page">
      <article className="detail">
        <Link to="/menu" className="back">
          ← Back to menu
        </Link>
        <h2>{dish.name}</h2>
        <p className="category">{dish.category}</p>
        {dish.spicy && <span className="spicy-badge">🌶️ Spicy</span>}
        <p className="description">{dish.description}</p>
        <p className="price">{dish.price} ETB</p>
        <button
          className="add-button"
          onClick={() => addItem(dish)}
        >
          Add to order
        </button>
      </article>
    </main>
  );
}

export default DishDetail;
