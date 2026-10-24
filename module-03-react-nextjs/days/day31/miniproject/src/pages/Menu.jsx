import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryBar, { categories } from "../components/CategoryBar";
import SearchBox from "../components/SearchBox";
import DishList from "../components/DishList";
import { useFetch } from "../hooks/useFetch";
import { useCart } from "../cart/CartContext";

function Menu() {
  // The category lives in the URL: /menu?category=Vegetarian
  const [params, setParams] = useSearchParams();
  const requested = params.get("category");
  const category = categories.includes(requested) ? requested : "All";

  const [search, setSearch] = useState("");
  const [simulateError, setSimulateError] = useState(false);

  const url = `/api/dishes?c=${encodeURIComponent(category)}${
    simulateError ? "&fail=1" : ""
  }`;
  const { data, loading, error, retry } = useFetch(url);
  const { dispatch } = useCart();

  const chooseCategory = useCallback(
    (cat) => setParams(cat === "All" ? {} : { category: cat }),
    [setParams]
  );

  // useCallback: keeps onAdd stable for the React.memo'd DishList / Dish
  const addToOrder = useCallback(
    (dish) => dispatch({ type: "add", dish }),
    [dispatch]
  );

  // useMemo: search + sort only when data or search change
  const shown = useMemo(() => {
    const term = search.toLowerCase();
    return (data ?? [])
      .filter((d) => d.name.toLowerCase().includes(term))
      .sort((a, b) => a.price - b.price);
  }, [data, search]);

  return (
    <main className="page">
      <h2>Addis Eats Menu</h2>

      <CategoryBar category={category} onChange={chooseCategory} />
      <SearchBox search={search} onSearch={setSearch} />

      <label className="sim-error">
        <input
          type="checkbox"
          checked={simulateError}
          onChange={(e) => setSimulateError(e.target.checked)}
        />{" "}
        Simulate server error
      </label>

      {loading && <p className="loading">Loading the menu...</p>}

      {!loading && error && (
        <div className="api-error">
          <p>{error}</p>
          <button className="retry-button" onClick={retry}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && <DishList dishes={shown} onAdd={addToOrder} />}
    </main>
  );
}

export default Menu;
