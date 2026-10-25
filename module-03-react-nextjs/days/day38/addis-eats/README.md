# Addis Eats — Day 38 (Server & Client Components)

Run: `npm install` → `npm run dev` (http://localhost:3000) · `npm run build` → `npm run start`

Behaviour is identical to Day 37. Only **where each component runs** changed.

## What changed from Day 37
| Change | File |
|---|---|
| `DishList` is now a server component (no hooks, no directive) | `app/menu/DishList.jsx` |
| New client shell that filters by `?category=`; receives `DishList` as `children` | `app/menu/FilterShell.jsx`, `app/menu/page.js` |
| Menu page awaits its dishes in an async server component | `app/menu/page.js` (`Dishes`) |
| Cart provider extracted into its own client component; `layout.js` stays server | `app/providers.jsx`, `app/layout.js` |
| `AddToCart` and `CartPanel` read the cart from context (`useCart`) | `app/menu/[id]/AddToCart.jsx`, `app/cart/CartPanel.jsx` |
| Redundant directives removed (`cart-store.js`, `CheckoutButton.jsx`) | — |
| Every component placed and justified | `BOUNDARY.md` |

## Notes
- This project never had a `useFetch` hook: Day 36/37 already fetched on the server, so there was
  no hook, loading flag or error state to delete for the menu route.
- `/menu` keeps `revalidate = 3600` and its Suspense skeleton from Day 37.
- `/menu?crash=1` still reaches `error.js`; `/menu/999` still reaches `not-found.js`.

## Bundle measurement (`/menu`)
Next 16's `next build` output has no "First Load JS" column, so measure with the helper:

```
npm run build
npm run measure          # node scripts/first-load-js.mjs /menu
```
Cross-check in DevTools → Network → JS (tick "Disable cache", hard reload).

| | Raw | Gzip |
|---|---|---|
| Before (Day 37) | _fill in_ | _fill in_ |
| After (Day 38) | _fill in_ | _fill in_ |

**Explanation:** _fill in after measuring: what left the client bundle (DishList and its
useSearchParams logic), what was added (Providers, context, FilterShell), and why the
net change is small or large. Most of the total is React and Next runtime shared by every page._
