"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "./filter-store";

// Client shell, server content: {children} is the already-rendered <DishList/>.
// It never imports DishList, so the cards stay plain server HTML; the shell only
// adds one CSS rule hiding cards of other categories.
export default function FilterShell({ children }) {
  const { category, crash } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Deliberate failure to prove error.js: open /menu?crash=1
  if (crash) throw new Error("Deliberate crash from /menu?crash=1");
  return (
    <div>
      {category !== "All" && <style>{`.dish-item:not([data-category="${category}"]){display:none}`}</style>}
      {children}
    </div>
  );
}
