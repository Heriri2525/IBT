# Addis Eats — Week 1 Project (Day 30)

React + Vite. Days 26–30 assembled: components & props, state & events,
API-driven menu with loading/error states, category filter, cart shared
through context, reducer-owned cart transitions, and a custom `useFetch` hook.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # tests cartReducer without React
npm run build
```

`/api/dishes?c=<category>` is a tiny fake API defined in `vite.config.js`
(data in `server/dishes.json`, 600 ms delay so loading is visible).
Tick **Simulate server error** to see the error state and **Try Again**.

## What each piece contributes

| File | Hook(s) | Contribution |
|---|---|---|
| `src/hooks/useFetch.js` | useState, useEffect, useCallback | Returns `{ data, loading, error, retry }`. Aborts the previous request when the URL changes or on unmount. Used in `Menu` and `MenuStats` (separate state each). |
| `src/cart/cartReducer.js` | – (pure) | add / decrement / remove / clear. Tested in `cartReducer.test.js`. |
| `src/cart/CartProvider.jsx` | useReducer, useMemo | Holds cart state; provides `items, dispatch, total, count`. Value memoised so consumers don't re-render needlessly. `total` is derived, not stored. |
| `src/cart/CartContext.js` | createContext, useContext | The context + `useCart` helper. |
| `src/components/CartBadge.jsx` | useContext | Header badge, no props. |
| `src/components/CheckoutPanel.jsx` | useContext, useState | Items, quantities, total in ETB, place order. |
| `src/Menu.jsx` | useState, useMemo, useCallback, custom hook, context | Category drives the fetch; `useMemo` for search+sort; `useCallback` for `onAdd` passed to memoised `DishList`/`Dish`. |
| `src/components/SearchBox.jsx` | useRef, useEffect | Focuses the input on mount. |
| `src/theme/ThemeContext.jsx` | createContext, useMemo | Exercise 1: light/dark theme read by a nested toggle. |

## Justifying the memoisation
- **Provider `useMemo`**: avoids a new context object every render.
- **`useMemo` in Menu**: filter+sort only when `data`/`search` change, not on every cart update.
- **`useCallback` in Menu**: keeps `onAdd` stable so `React.memo` on `Dish`/`DishList` can skip renders.
