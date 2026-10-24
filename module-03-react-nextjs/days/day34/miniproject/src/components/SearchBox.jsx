import { useEffect, useRef } from "react";
import { logRender } from "../hooks/logRender";

function SearchBox({ search, onSearch }) {
  logRender("SearchBox");
  const searchRef = useRef(null);

  // Day 29: useRef + useEffect — focus the input once on mount
  useEffect(() => {
    searchRef.current.focus();
  }, []);

  return (
    <div className="order-form">
      <label htmlFor="search" className="search-label">
        Search dishes
      </label>
      <input
        ref={searchRef}
        id="search"
        className="search-input"
        type="text"
        placeholder="Search for a dish..."
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  );
}

export default SearchBox;
