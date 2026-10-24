import { useMemo, useReducer } from "react";
import { CartContext } from "./CartContext";
import { cartReducer, initialCartState } from "./cartReducer";

// 2. provide — the STATE lives here (useReducer); context only carries it.
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // derived on every render, never stored in the reducer
  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = state.items.reduce((sum, i) => sum + i.qty, 0);

  // Memoised so the value object keeps the same reference between renders.
  // Without it, a NEW object is created every time CartProvider renders and
  // EVERY consumer (badge, checkout, menu) re-renders even if the cart did not
  // change. `dispatch` is already stable, so it is not a dependency.
  const value = useMemo(
    () => ({ items: state.items, dispatch, total, count }),
    [state.items, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
