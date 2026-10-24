# Addis Eats — Day 31: Routed (React Router v6)

The week 1 app, split across real screens with real URLs.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # cartReducer tests (no React)
```

Sign-in is fake: use any phone like `0912345678`. A tiny fake API lives in
`vite.config.js` (data in `server/dishes.json`).

## Routes

| Path | Screen | Notes |
|---|---|---|
| `/` | Home | index route; today's specials |
| `/menu` | Menu | category filter in the URL: `/menu?category=Vegetarian` |
| `/menu/:id` | DishDetail | `id` is a slug, e.g. `/menu/doro-wat`; unknown id shows "No dish called …" |
| `/cart` | Cart | order and total in ETB |
| `/checkout` | Checkout | **protected** by `RequireAuth`; redirects to `/login`, then back |
| `/login` | Login | returns you to where you were headed |
| `/orders/:orderId` | OrderReceipt | reached after placing an order (`navigate`, `replace`) |
| `*` | NotFound | catch-all |

All routes are nested under `Layout` (header, `NavLink` nav, `<Outlet />`, footer).

## Key files

- `src/App.jsx` — providers above `BrowserRouter`, nested route table
- `src/Layout.jsx` — rendered once; only the `Outlet` changes
- `src/DishDetail.jsx` — `useParams` + `useFetch`; loading → error → not found → data
- `src/auth/RequireAuth.jsx` — waits for `loading`, redirects with `replace` and `state.from`
- `src/auth/AuthProvider.jsx` — session in context (+ localStorage)
- `src/cart/*` — Day 30 reducer + provider, now surviving navigation
- `src/hooks/useFetch.js` — returns `{ data, loading, error, notFound, retry }`

## Notes
- The cart lives in memory, so a full page refresh empties it (the session is kept).
- Each dish card uses a `Link` on its name and a "View details" link, so the
  "Add to order" button never navigates by accident.
