import { useCallback, useMemo, useReducer } from "react";
import { CartContext } from "./CartContext";
import { cartReducer, initialCartState } from "./cartReducer";

// 2. provide — state lives HERE (useReducer); context only carries it down.
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // stable handlers: React.memo children won't be broken by new functions
  const addItem = useCallback((dish) => dispatch({ type: "add", dish }), []);
  const decrementItem = useCallback(
    (id) => dispatch({ type: "decrement", id }),
    []
  );
  const removeItem = useCallback((id) => dispatch({ type: "remove", id }), []);
  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);

  // derived values — never stored, so they can't disagree with items
  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = state.items.reduce((sum, i) => sum + i.qty, 0);

  // memoised value: consumers only re-render when the cart really changes
  const value = useMemo(
    () => ({
      items: state.items,
      total,
      count,
      addItem,
      decrementItem,
      removeItem,
      clearCart,
    }),
    [state.items, total, count, addItem, decrementItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
