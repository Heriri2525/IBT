import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useCartStore } from "../cart/cartStore";
import DishList from "../menu/DishList";
import { dishesUrl } from "../api/dishes";

function Home() {
  const { data, loading, error, retry } = useFetch(dishesUrl("All"));
  const addItem = useCartStore((s) => s.addItem);

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
      {loading && (
        <p className="loading" role="status">
          Loading specials...
        </p>
      )}
      {error && (
        <div className="api-error">
          <p>{error}</p>
          <button className="retry-button" onClick={retry}>
            Try Again
          </button>
        </div>
      )}
      {!loading && !error && <DishList dishes={specials} onAdd={addItem} emptyMessage="No specials today — see the full menu." />}
    </main>
  );
}

export default Home;
