import { useEffect, useRef } from "react";

function OrderForm({ search, setSearch }) {
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  return (
    <div className="order-form">
      <label htmlFor="search">
        Search dishes
      </label>

      <input
        ref={searchRef}
        id="search"
        type="text"
        placeholder="Search for a dish..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>
  );
}

export default OrderForm;