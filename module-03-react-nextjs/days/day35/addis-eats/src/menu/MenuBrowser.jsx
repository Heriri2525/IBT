import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryBar, { categories } from "./CategoryBar";
import SearchBox from "./SearchBox";
import DishList from "./DishList";
import MenuUnavailable from "./MenuUnavailable";
import ErrorBoundary from "../ui/ErrorBoundary";
import DevOnly from "../ui/DevOnly";
import { dishesUrl } from "../api/dishes";
import { useFetch } from "../hooks/useFetch";
import { useCartStore } from "../cart/cartStore";

// Everything that changes while someone browses — category (in the URL),
// search text and the fetch — lives HERE, in the component that uses it.
// The order panel is a sibling, so typing in the search box can't re-render it.
function MenuBrowser({ breakDish = false }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get("category");
  const category = categories.includes(requested) ? requested : "All";

  const [search, setSearch] = useState("");
  const [simulateError, setSimulateError] = useState(false);

  const { data, loading, error, retry } = useFetch(
    dishesUrl(category, { fail: simulateError })
  );
  const addItem = useCartStore((s) => s.addItem);

  // stable handler: CategoryBar is memoised, an inline arrow would defeat it
  const chooseCategory = useCallback(
    (cat) => setParams(cat === "All" ? {} : { category: cat }),
    [setParams]
  );

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = (data ?? [])
      .filter((d) => d.name.toLowerCase().includes(term))
      .sort((a, b) => a.price - b.price);
    // dev test switch: the first dish "arrives" without a price (bad data)
    return breakDish ? list.map((d, i) => (i === 0 ? { ...d, price: undefined } : d)) : list;
  }, [data, search, breakDish]);

  const emptyMessage = search.trim()
    ? `No dishes match “${search.trim()}”${category === "All" ? "" : ` in ${category}`}. Try a different word or category.`
    : `Nothing in ${category} yet — check back soon or pick another category.`;

  return (
    <>
      <CategoryBar category={category} onChange={chooseCategory} />
      <SearchBox search={search} onSearch={setSearch} />

      <DevOnly>
        <label className="sim-error">
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
          />{" "}
          Simulate server error
        </label>
      </DevOnly>

      {loading && (
        <p className="loading" role="status">
          Loading the menu...
        </p>
      )}

      {!loading && error && (
        <div className="api-error" role="alert">
          <p>{error}</p>
          <button className="retry-button" onClick={retry}>
            Try Again
          </button>
        </div>
      )}

      {/* inner boundary: a bad dish replaces the LIST, the controls stay */}
      {!loading && !error && (
        <ErrorBoundary name="dish-list" fallback={MenuUnavailable} resetKeys={[category, search]}>
          <DishList dishes={shown} onAdd={addItem} emptyMessage={emptyMessage} />
        </ErrorBoundary>
      )}
    </>
  );
}

export default MenuBrowser;
