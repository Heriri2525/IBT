import { useState } from "react";
import MenuBrowser from "./MenuBrowser";
import MenuUnavailable from "./MenuUnavailable";
import CartPanel from "../cart/CartPanel";
import CartUnavailable from "../cart/CartUnavailable";
import ErrorBoundary from "../ui/ErrorBoundary";
import Bomb from "../ui/Bomb";
import DevOnly from "../ui/DevOnly";

// The page is only a frame: it places two independent regions side by side,
// each behind its own error boundary, so either can fail alone.
// It owns no state that changes while browsing (see MenuBrowser).
function Menu() {
  // dev-only test switches for the error boundaries
  const [breakDish, setBreakDish] = useState(false);
  const [breakCart, setBreakCart] = useState(false);

  return (
    <main className="page">
      <h2>Addis Eats Menu</h2>

      <DevOnly>
        <details className="devtools">
          <summary>Test the error boundaries (dev only)</summary>
          <label>
            <input type="checkbox" checked={breakDish} onChange={(e) => setBreakDish(e.target.checked)} />{" "}
            Break one dish (it arrives without a price)
          </label>
          <label>
            <input type="checkbox" checked={breakCart} onChange={(e) => setBreakCart(e.target.checked)} />{" "}
            Break the order panel
          </label>
        </details>
      </DevOnly>

      <div className="menu-layout">
        <section aria-label="Menu">
          <ErrorBoundary name="menu" fallback={MenuUnavailable}>
            <MenuBrowser breakDish={breakDish} />
          </ErrorBoundary>
        </section>

        <aside>
          <ErrorBoundary name="cart-panel" fallback={CartUnavailable}>
            <CartPanel />
            {breakCart && <Bomb label="Order panel" />}
          </ErrorBoundary>
        </aside>
      </div>
    </main>
  );
}

export default Menu;
