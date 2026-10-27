import CategoryBar from "./CategoryBar";
import { CATEGORIES } from "@/lib/categories";

// Wraps /menu and /menu/[id]; stays mounted between them (sidebar + selection persist).
export default function MenuLayout({ children }) {
  return (
    <div className="shell">
      <aside className="side" aria-label="Categories">
        <h2>Categories</h2>
        <CategoryBar categories={CATEGORIES} />
      </aside>
      <div>{children}</div>
    </div>
  );
}
