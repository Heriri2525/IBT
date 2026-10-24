import { createContext, useContext } from "react";

// 1. create
export const CartContext = createContext(null);

// small custom hook so consumers don't repeat useContext + null check
export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === null) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}
