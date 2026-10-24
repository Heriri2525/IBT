import { useFetch } from "../hooks/useFetch";

// Exercise 2: the SAME hook used in a second component.
// It has its own data/loading/error — nothing is shared with <Menu />.
function MenuStats() {
  const { data, loading, error } = useFetch("/api/dishes?c=All");

  if (loading) return <p className="stats">Counting dishes...</p>;
  if (error) return <p className="stats">Stats unavailable.</p>;

  const spicy = data.filter((d) => d.spicy).length;
  return (
    <p className="stats">
      {data.length} dishes on the full menu · {spicy} spicy
    </p>
  );
}

export default MenuStats;
