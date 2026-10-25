# BOUNDARY.md — Addis Eats (Day 38)

Rule used: every component is a **server** component unless it needs state, an effect, a
ref, context, an event handler or a browser API. A directive sits only on a file that is
imported from a server component (that is where the boundary actually is).

| Component | Runs on | Why |
|---|---|---|
| `app/layout.js` | Server | Header/footer are static markup. Receives `{children}` and passes them into `<Providers>`; imports nothing client except `Providers` itself. |
| `app/providers.jsx` | **Client** | Context + `useSyncExternalStore` hold the cart, and state needs the browser. |
| `app/cart-store.js` | Client (by import) | Plain module touching `localStorage`; no directive because only `providers.jsx` imports it. |
| `app/page.js` | Server | Static welcome text and a link. |
| `app/not-found.js` | Server | Static markup. |
| `app/menu/layout.js` | Server | Structure only; places the sidebar and counter. |
| `app/menu/page.js` | Server (async) | `Dishes` awaits `getDishes()` directly: no hook, no effect, no loading flag, no `/api`. |
| `app/menu/DishList.jsx` | Server | **Was client.** Now pure markup from data; it ships no JavaScript. |
| `app/menu/FilterShell.jsx` | **Client** | Reads `?category=` / `?crash=` with `useSearchParams`. Wraps `DishList` through `children`, never imports it. |
| `app/menu/Sidebar.jsx` | **Client** | `useSearchParams` to highlight the active category. It contains nothing else that could stay on the server. |
| `app/menu/MenuCounter.jsx` | **Client** | `useState` + `onClick` (the layout-persistence demo). |
| `app/menu/DishSkeleton.jsx` | Server | Static placeholder markup. |
| `app/menu/loading.js` | Server | Static fallback for the segment. |
| `app/menu/error.js` | **Client** | Error boundaries must be client components: they use `reset` and must catch errors thrown while rendering in the browser. |
| `app/menu/dishes.js`, `dishes.json` | Server only | Only server components import them, so the data never ships. |
| `app/menu/categories.js` | Shared constant | Tiny plain module; imported by `Sidebar`. |
| `app/menu/[id]/page.js` | Server (async) | Awaits `getDish(id)`; `notFound()` handles empty. |
| `app/menu/[id]/AddToCart.jsx` | **Client** | `onClick` + cart context. Receives a plain `dish` object, no callbacks. |
| `app/cart/page.js` | Server | Static shell around the cart. |
| `app/cart/CartPanel.jsx` | **Client** | Reads the cart from context and clears it on click. |
| `app/cart/CheckoutButton.jsx` | Client (by import) | `useRouter().push`. No directive of its own: its only importer is `CartPanel`. |
| `app/checkout/layout.js`, `page.js` | Server | Dynamic route; reads `cookies()`, which only the server can do. |

## Files that contain the directive: 7

`providers.jsx`, `menu/FilterShell.jsx`, `menu/Sidebar.jsx`, `menu/MenuCounter.jsx`,
`menu/error.js`, `menu/[id]/AddToCart.jsx`, `cart/CartPanel.jsx`.

(Day 37 had 8: `cart-store.js`, `DishList`, `Sidebar`, `MenuCounter`, `error.js`, `AddToCart`,
`CartPanel`, `CheckoutButton`.) Removed: `DishList` (nothing in it needs the browser),
`cart-store.js` and `CheckoutButton` (redundant, only ever imported from client code).
Added: `providers.jsx` and `FilterShell.jsx`.

## Answers to the "check yourself" questions

- **Does `layout.js` import anything that carries the directive?** Only `Providers`, which
  is the intended entry point. Pages reach it as `children`, so they stay server-rendered.
- **Is `DishList` shipped to the browser?** No. It has no directive and no client component
  imports it; `page.js` (server) renders it and hands the result to `FilterShell` as `children`.
- **Why does `error.js` need the directive?** Error boundaries catch errors while React renders
  in the browser and expose `reset()`, which needs state, so they only work as client components.
