# Addis Eats — Day 32: Context done well + Zustand store

Day 31's routed app, with the cart moved out of context into a **Zustand store**.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # cart store tests, no React involved
```

Sign in with any phone like `0912345678`. The cart now **survives a page refresh**.

## What changed

| Before (Day 31) | Now (Day 32) |
|---|---|
| `CartProvider` + `useReducer` + `cartReducer` | `src/cart/cartStore.js` — state + actions in one `create()` |
| `useCart()` returning everything | one narrow selector per value |
| `useMemo` on the provider value | not needed — selectors do the job |
| cart lost on refresh | `persist` middleware (`localStorage` key `addis-eats-cart`) |
| `AuthContext` exported directly | `src/auth/useAuth.js` hook; context object kept private |
| (theme + auth already separate providers) | unchanged; no cart provider left above them |

Still context (changes rarely): session (`AuthProvider` / `useAuth`) and theme (`ThemeProvider` / `useTheme`).
Each has its own provider, so a theme change never re-renders session consumers and vice versa.

## Selectors per component

| Component | Reads |
|---|---|
| `CartBadge.jsx` | `selectCount` (a number) |
| `Checkout.jsx` | `items`, `selectTotal`, `clear` |
| `pages/Cart.jsx` | `items`, `selectTotal`, `addItem`, `decrement`, `remove`, `clear` |
| `pages/Menu.jsx`, `pages/Home.jsx`, `DishDetail.jsx` | only `addItem` (never changes → never re-renders for cart changes) |

`total` and `count` are derived inside selectors and return **numbers**, so Zustand's
equality check works. Returning a fresh object from a selector would defeat it.

## What re-renders changed

Measured in a real browser (dev build, adding 3 dishes on `/menu`; React StrictMode
doubles dev renders, so counts below are halved to real renders):

| Component | Context (Day 31) | Zustand (Day 32) |
|---|---|---|
| `CartBadge` | 3 | 3 (it displays the count, so it should) |
| `Menu` page | **3** | **0** |
| `Layout`, `Dish` | 0 | 0 |

`Menu` used `useCart()` just to get `dispatch`, so every cart change re-rendered it.
Now it selects only the stable `addItem` action. Try it yourself: add `logRender("Name")`
(from `src/hooks/logRender.js`) to a component, add dishes, then run
`console.table(window.__renders)`. Or turn on React DevTools → "Highlight updates".

## Routes (unchanged from Day 31)

`/` · `/menu?category=…` · `/menu/:id` · `/cart` · `/checkout` (protected) · `/login` · `/orders/:orderId` · `*`

## Homework

`homework/cartSlice.js` — the same cart as a Redux Toolkit slice (not wired in).
Compare it with `src/cart/cartStore.js`.
