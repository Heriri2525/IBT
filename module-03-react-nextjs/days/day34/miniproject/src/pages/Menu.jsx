import { useState } from "react";
import MenuBrowser from "../components/MenuBrowser";
import CartPanel from "../components/CartPanel";
import ErrorBoundary from "../ErrorBoundary";
import Bomb from "../ui/Bomb";
import DevProfiler from "../ui/DevProfiler";
import { CartUnavailable, MenuUnavailable } from "../ui/Fallbacks";
import { logRender } from "../hooks/logRender";

// The page is only a frame now: it holds the two test switches and places the
// two independent regions side by side, each behind its own boundary.
// It owns NO state that changes while browsing, so it (and the order panel)
// no longer re-render on every keystroke.
function Menu() {
  logRender("Menu");
  const [breakDish, setBreakDish] = useState(false);
  const [breakCart, setBreakCart] = useState(false);

  return (
    <main className="page">
      <h2>Addis Eats Menu</h2>

      <details className="devtools">
        <summary>Test the error boundaries</summary>
        <label>
          <input type="checkbox" checked={breakDish} onChange={(e) => setBreakDish(e.target.checked)} />{" "}
          Break one dish (it arrives without a price)
        </label>
        <label>
          <input type="checkbox" checked={breakCart} onChange={(e) => setBreakCart(e.target.checked)} />{" "}
          Break the order panel
        </label>
      </details>

      <div className="menu-layout">
        <section aria-label="Menu">
          {/* outer boundary: catch-all for the whole menu region */}
          <ErrorBoundary name="menu" fallback={MenuUnavailable}>
            <MenuBrowser breakDish={breakDish} />
          </ErrorBoundary>
        </section>

        <aside>
          <ErrorBoundary name="cart-panel" fallback={CartUnavailable}>
            <DevProfiler id="CartPanel">
              <CartPanel />
            </DevProfiler>
            {breakCart && <Bomb label="Order panel" />}
          </ErrorBoundary>
        </aside>
      </div>
    </main>
  );
}

export default Menu;
