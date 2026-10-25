import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

// The whole cart: state + actions in ONE function call. No provider, no
// reducer file, no action-type strings. Cart item shape: { id, name, price, qty }
export const useCartStore = create(
  devtools(
    persist(
      (set) => ({
        items: [],

        addItem: (dish) =>
          set(
            (state) => {
              const existing = state.items.find((i) => i.id === dish.id);
              if (existing) {
                return {
                  items: state.items.map((i) =>
                    i.id === dish.id ? { ...i, qty: i.qty + 1 } : i
                  ),
                };
              }
              const { id, name, price } = dish;
              return { items: [...state.items, { id, name, price, qty: 1 }] };
            },
            false,
            "cart/addItem" // label shown in the Redux DevTools extension
          ),

        decrement: (id) =>
          set(
            (state) => ({
              items: state.items
                .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
                .filter((i) => i.qty > 0),
            }),
            false,
            "cart/decrement"
          ),

        remove: (id) =>
          set(
            (state) => ({ items: state.items.filter((i) => i.id !== id) }),
            false,
            "cart/remove"
          ),

        clear: () => set({ items: [] }, false, "cart/clear"),
      }),
      {
        name: "addis-eats-cart", // localStorage key
        storage: createJSONStorage(() => localStorage),
        // save only the data, not the action functions
        partialize: (state) => ({ items: state.items }),
      }
    ),
    { name: "CartStore" }
  )
);

// Derived values are computed in the selector, never stored, so they can't
// go out of date. Both return a NUMBER, so Zustand's equality check works:
//   const total = useCartStore(selectTotal);
export const selectTotal = (s) =>
  s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectCount = (s) => s.items.reduce((sum, i) => sum + i.qty, 0);
