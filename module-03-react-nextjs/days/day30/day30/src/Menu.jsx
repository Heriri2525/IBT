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

  // custom hook (Day 29 logic, extracted)
  const { data, loading, error, retry } = useFetch("/dishes.json");

  // context (addItem is stable, thanks to useCallback in the provider)
  const { addItem } = useCart();

  // useMemo: recompute only when data / category / search change
  const shown = useMemo(() => {
    const term = search.toLowerCase();
    return (data ?? [])
      .filter((d) => category === "All" || d.category === category)
      .filter((d) => d.name.toLowerCase().includes(term))
      .sort((a, b) => a.price - b.price);
  }, [data, category, search]);

  // useCallback: stable prop for the React.memo'd CategoryBar
  const handleCategory = useCallback((c) => setCategory(c), []);

  return (
    <main className="menu-section">
      <h2>Addis Eats Menu</h2>

      {loading && <p className="loading">Loading the menu...</p>}

      {error && (
        <div className="api-error">
          <p>{error}</p>
          <button className="retry-button" onClick={retry}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <CategoryBar category={category} onChange={handleCategory} />
          <SearchBox search={search} onSearch={setSearch} />
          <Card>
            <DishList dishes={shown} onAdd={addItem} />
          </Card>
        </>
      )}
    </main>
  );
}

export default Menu;
