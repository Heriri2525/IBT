import { useEffect, useState } from "react";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import OrderForm from "./OrderForm";
import Card from "./Card";
import { loadDishes } from "./api";

function Menu() {
  const [category, setCategory] = useState("All");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      setLoading(true);
      setError(null);

      try {
        const data = await loadDishes(
          category,
          controller.signal
        );

        setDishes(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      controller.abort();
    };
  }, [category, retry]);

  const filteredDishes = dishes.filter((dish) =>
    dish.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main className="menu">
        <h2>Addis Eats Menu</h2>

        <p className="loading">
          Loading the menu...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="menu">
        <h2>Addis Eats Menu</h2>

        <div className="error">
          <p>{error}</p>

          <button
            onClick={() =>
              setRetry((value) => value + 1)
            }
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="menu">
      <h2>Addis Eats Menu</h2>

      <CategoryBar
        category={category}
        setCategory={setCategory}
      />

      <OrderForm
        search={search}
        setSearch={setSearch}
      />

      <Card>
        <DishList dishes={filteredDishes} />
      </Card>
    </main>
  );
}

export default Menu;