// HOMEWORK — "Write it in Redux too". NOT wired into the app.
// (To try it you would run: npm i @reduxjs/toolkit react-redux)
// Compare side by side with src/cart/cartStore.js.
import { createSlice, configureStore } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    // Immer lets us "mutate" the draft; Redux Toolkit produces a new object.
    addItem: (state, action) => {
      const dish = action.payload;
      const existing = state.items.find((i) => i.id === dish.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ id: dish.id, name: dish.name, price: dish.price, qty: 1 });
      }
    },
    decrement: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty -= 1;
      state.items = state.items.filter((i) => i.qty > 0);
    },
    remove: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clear: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, decrement, remove, clear } = cartSlice.actions;

export const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// Reading (inside components):
//   const count = useSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));
//   const dispatch = useDispatch();
//   dispatch(addItem(dish));
// Mounting: <Provider store={store}><App /></Provider>
