# BOUNDARY.md — Addis Eats (Day 38, updated for Day 39)

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
| `app/checkout/layout.js` | Server | Forces the whole checkout segment to render per request. |
| `app/checkout/page.js` | Server (dynamic) | Reads the session cookie (`getSession`); renders the heading, pricing and the form. |
| `app/checkout/OrderForm.jsx` | **Client** | `useActionState` (result + pending), the cart context, and a form. Imports only `lib/constants`, never zod. |
| `app/orders/page.js` | Server (cached) | Reads the in-memory store; no request data, so it is prerendered and refreshed by `revalidatePath`. |
| `app/orders/CancelButton.jsx` | **Client** | `useTransition` + click handler. Imports the `cancelOrder` action (a function may reach the browser only this way). |
| `app/signin/page.js` | Server (dynamic) | Plain forms with server actions; no client JavaScript. |
| `app/actions.js`, `app/signin/actions.js` | Server (`"use server"`) | `placeOrder`, `cancelOrder`, `signIn`, `signOut`. Each is a public endpoint, so each re-checks everything itself. |
| `app/api/**/route.js` | Server | Route handlers: HTTP endpoints for anything outside the UI. |
| `lib/schema.js`, `lib/orders.js`, `lib/session.js` | Server only | Zod, the store and `SESSION_SECRET`. No client file imports them (checked with grep). |
| `lib/constants.js`, `lib/users.js` | Shared | Plain data, no imports, safe in the browser. |

## Files that contain the directive

`"use client"` (9): `providers.jsx`, `menu/FilterShell.jsx`, `menu/Sidebar.jsx`, `menu/MenuCounter.jsx`,
`menu/error.js`, `menu/[id]/AddToCart.jsx`, `cart/CartPanel.jsx`, `checkout/OrderForm.jsx`,
`orders/CancelButton.jsx`. Day 39 added the last two: a form and a button, both genuine interactive leaves.

`"use server"` (2): `app/actions.js`, `app/signin/actions.js`.

## Answers to the "check yourself" questions

- **Does `layout.js` import anything that carries the directive?** Only `Providers`, the intended entry
  point. Pages reach it as `children`, so they stay server-rendered.
- **Is `DishList` shipped to the browser?** No. It has no directive and no client component imports it.
- **Why does `error.js` need the directive?** Error boundaries catch errors while React renders in the
  browser and expose `reset()`, which needs state, so they only work as client components.
- **Can a client file reach a secret?** No. `SESSION_SECRET` is read only in `lib/session.js`, which no
  client file imports, and it has no `NEXT_PUBLIC_` prefix. `npm run check:secrets` proves it on the build.
