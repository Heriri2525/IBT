import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryBar, { categories } from "./CategoryBar";
import SearchBox from "./SearchBox";
import DishList from "./DishList";
import ErrorBoundary from "../ErrorBoundary";
import DevProfiler from "../ui/DevProfiler";
import { MenuUnavailable } from "../ui/Fallbacks";
import { useFetch } from "../hooks/useFetch";
import { useCartStore } from "../cart/cartStore";
import { logRender } from "../hooks/logRender";

// Everything that changes while someone browses — category, search text, the
// fetch — lives HERE, in the component that uses it. The order panel is a
// sibling of this component, so typing in the search box can't re-render it.
function MenuBrowser({ breakDish = false }) {
  logRender("MenuBrowser");
  const [params, setParams] = useSearchParams();
  const requested = params.get("category");
  const category = categories.includes(requested) ? requested : "All";

  const [search, setSearch] = useState("");
  const [simulateError, setSimulateError] = useState(false);

  // stable handler: CategoryBar is wrapped in React.memo, and an inline arrow
  // would be a NEW function on every render, so memo could never skip anything
  const chooseCategory = useCallback(
    (cat) => setParams(cat === "All" ? {} : { category: cat }),
    [setParams]
  );

  const url = `/api/dishes?c=${encodeURIComponent(category)}${simulateError ? "&fail=1" : ""}`;
  const { data, loading, error, retry } = useFetch(url);
  const addItem = useCartStore((s) => s.addItem);

  const shown = useMemo(() => {
    const term = search.toLowerCase();
    const list = (data ?? [])
      .filter((d) => d.name.toLowerCase().includes(term))
      .sort((a, b) => a.price - b.price);
    // test switch: the first dish "arrives" without a price (bad data)
    return breakDish ? list.map((d, i) => (i === 0 ? { ...d, price: undefined } : d)) : list;
  }, [data, search, breakDish]);

  return (
    <>
      <CategoryBar category={category} onChange={chooseCategory} />
      <SearchBox search={search} onSearch={setSearch} />

      <label className="sim-error">
        <input type="checkbox" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} />{" "}
        Simulate server error
      </label>

      {loading && <p className="loading">Loading the menu...</p>}
      {!loading && error && (
        <div className="api-error">
          <p>{error}</p>
          <button className="retry-button" onClick={retry}>Try Again</button>
        </div>
      )}

      {/* inner boundary: a bad dish replaces the LIST, the controls stay */}
      {!loading && !error && (
        <ErrorBoundary name="dish-list" fallback={MenuUnavailable} resetKeys={[category, search]}>
          <DevProfiler id="DishList">
            <DishList dishes={shown} onAdd={addItem} />
          </DevProfiler>
        </ErrorBoundary>
      )}
    </>
  );
}

export default MenuBrowser;
