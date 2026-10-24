// Pure reducer: (state, action) -> new state. No React, no fetch, no mutation.
// Cart item shape: { id, name, price, qty }

export const initialCartState = { items: [] };

export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((i) => i.id === action.dish.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.dish.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }

      const { id, name, price } = action.dish;
      return { ...state, items: [...state.items, { id, name, price, qty: 1 }] };
    }

    case "decrement":
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };

    case "remove":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
      };

    case "clear":
      return { ...state, items: [] };

    default:
      throw new Error("Unknown action: " + action.type);
  }
}
