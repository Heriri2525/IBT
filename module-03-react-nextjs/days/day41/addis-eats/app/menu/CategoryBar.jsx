"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, setCategory, subscribe } from "./filter-store";

// Client leaf: remembers the selected category and handles clicks.
// Receives plain strings only (no callback crosses from the server).
export default function CategoryBar({ categories }) {
  const { category } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <ul>
      {categories.map((c) => (
        <li key={c}>
          <button type="button" onClick={() => setCategory(c)} aria-pressed={c === category}
            className={"side-btn" + (c === category ? " on" : "")}>{c}</button>
        </li>
      ))}
    </ul>
  );
}
