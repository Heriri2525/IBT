import { useCallback, useMemo, useState } from "react";
import CategoryBar from "./components/CategoryBar";
import SearchBox from "./components/SearchBox";
import DishList from "./components/DishList";
import Card from "./components/Card";
import { useFetch } from "./hooks/useFetch";
import { useCart } from "./cart/CartContext";

function Menu() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [simulateError, setSimulateError] = useState(false);

  // The category DRIVES the fetch. When it changes, useFetch's cleanup aborts
  // the previous request and starts a new one.
  const url = `/api/dishes?c=${encodeURIComponent(category)}${
    simulateError ? "&fail=1" : ""
  }`;
  const { data, loading, error, retry } = useFetch(url);

  const { dispatch } = useCart();

  // useCallback (deliberate): DishList and Dish are wrapped in React.memo.
  // A new onAdd function each render would defeat memo; this keeps it stable.
  const addToOrder = useCallback(
    (dish) => dispatch({ type: "add", dish }),
    [dispatch]
  );

  // useMemo (deliberate): search + sort run only when data or search change,
  // not when the cart changes and Menu re-renders.
  const shown = useMemo(() => {
    const term = search.toLowerCase();
    return (data ?? [])
      .filter((d) => d.name.toLowerCase().includes(term))
      .sort((a, b) => a.price - b.price);
  }, [data, search]);

  return (
    <main className="menu-section">
      <h2>Addis Eats Menu</h2>

      <CategoryBar category={category} onChange={setCategory} />
      <SearchBox search={search} onSearch={setSearch} />

      <label className="sim-error">
        <input
          type="checkbox"
          checked={simulateError}
          onChange={(e) => setSimulateError(e.target.checked)}
        />{" "}
        Simulate server error
      </label>

      {/* all three states visible on screen */}
      {loading && <p className="loading">Loading the menu...</p>}

      {!loading && error && (
        <div className="api-error">
          <p>{error}</p>
          <button className="retry-button" onClick={retry}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <Card>
          <DishList dishes={shown} onAdd={addToOrder} />
        </Card>
      )}
    </main>
  );
}

export default Menu;
