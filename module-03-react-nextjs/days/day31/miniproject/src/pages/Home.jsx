import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useCart } from "../cart/CartContext";
import DishList from "../components/DishList";
import { useCallback } from "react";

function Home() {
  const { data, loading, error, retry } = useFetch("/api/dishes?c=All");
  const { dispatch } = useCart();
  const addToOrder = useCallback(
    (dish) => dispatch({ type: "add", dish }),
    [dispatch]
  );

  const specials = (data ?? []).filter((d) => d.special);

  return (
    <main className="page">
      <section className="hero">
        <h2>Welcome to Addis Eats 👋</h2>
        <p>Order injera, tibs and more, delivered hot.</p>
        <Link to="/menu" className="cta">
          Browse the full menu
        </Link>
      </section>

      <h2>Today’s specials</h2>
      {loading && <p className="loading">Loading specials...</p>}
      {error && (
        <div className="api-error">
          <p>{error}</p>
          <button className="retry-button" onClick={retry}>
            Try Again
          </button>
        </div>
      )}
      {!loading && !error && <DishList dishes={specials} onAdd={addToOrder} />}
    </main>
  );
}

export default Home;
