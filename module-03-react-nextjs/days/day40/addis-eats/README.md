# Addis Eats — Day 40: Next.js foundations project

Run: `npm install` → `npm run build` → `npm run start` (http://localhost:3000). Dev: `npm run dev`.
Optional: copy `.env.example` to `.env.local` and set `SESSION_SECRET` (server-only). Without it a throwaway secret is generated at start-up, so sessions reset on restart.

Documents: [STRATEGY.md](STRATEGY.md) · [BOUNDARY.md](BOUNDARY.md)

## Folder tree
```
app/
  layout.js  page.js  not-found.js  actions.js  providers.jsx
  menu/      layout.js page.js loading.js error.js  CategoryBar.jsx FilterShell.jsx DishList.jsx [id]/page.js
  cart/      page.js CartPanel.jsx
  checkout/  layout.js page.js CheckoutForm.jsx
  api/dishes/route.js  api/dishes/[id]/route.js  api/orders/route.js
components/  DishCard.jsx AddToCartButton.jsx Field.jsx      (used by more than one route)
lib/         dishes.js cart.js validate-order.js session.js orders.js
```

## Build output (`npm run build`)
```
Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /api/dishes                1h      1y
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                      1h      1y
└   /menu/[id]
  ├ ● /menu/1
  ├ ● /menu/2
  ├ ● /menu/3
  └ ● [+9 more paths]


○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand

```

## Endpoints and status codes
| Request | Result |
|---|---|
| `GET /api/dishes` | 200 `{dishes}` |
| `GET /api/dishes/not-a-dish` | 404 `{error}` |
| `POST /api/orders` valid | 201 `{order}` (price/total computed on the server; any `price` sent by the client is ignored) |
| `POST /api/orders` invalid | 422 `{error, fieldErrors}` |
| `POST /api/orders` not JSON / wrong content type | 400 / 415 |
| `GET /api/orders` | 200 own orders · 401 without a session |

```
curl -i localhost:3000/api/dishes/not-a-dish                      # 404
curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
  -d '{"name":"Almaz","phone":"0912"}'                            # 422, fieldErrors.phone
```
The route handler and the checkout server action call the **same** `lib/validate-order.js` (carried over from Day 35).

## Data flow decisions
- Menu / dish data: server components call `lib/dishes.js` directly. **Nothing in the app calls `/api/dishes`** — it exists for outside callers.
- Placing an order: server action `placeOrder` (`app/actions.js`).
- Cart: kept in the browser as a cookie of `[{id, qty}]` (no prices). The server only reads it on `/checkout` and re-prices the order itself.
- Authorisation: `placeOrder` and `cancelOrder` check the signed `session` cookie **inside the action**; `cancelOrder` also checks the order belongs to that session.

## Verified on the production build
- Build markers match STRATEGY.md (above).
- curl: 404, 422, 400, 415, 201, 401 all as listed; a client-sent price is ignored.
- Browser (Playwright): menu → filter → dish → add to cart → cart total → sign in → invalid phone shows the error beside the field → order placed → cart emptied → cancel own order works.
- Attack: editing the hidden `orderId` to another person’s order and submitting → refused ("belongs to someone else").
- JavaScript disabled: the sign-in and the checkout form both work, field errors show beside the field, values are kept, the order is placed.
- `error.js` (`/menu?crash=1`) keeps header and footer; `/menu/not-a-dish` and `/nope` show not-found (`/nope` returns a real 404).
- Secret search: the `SESSION_SECRET` value and the words `SESSION_SECRET` / `node:crypto` appear in **0** files under `.next/static`.
- `npm run lint` clean; fresh unzip → `npm install` → `npm run build` works.

## First Load JS for /menu: Day 35 vs today (gzip, all scripts loaded on first visit)
| | JS files | gzip total |
|---|---|---|
| Day 35 (Vite + React Router, client-rendered) | 1 | 84.6 kB |
| Day 40 (Next.js, server components) | 11 | 137.9 kB |

Measured with Playwright on `vite preview` and `next start`, summing the gzip size of every script the page loads. **The total went up, not down:** Next.js ships its own client runtime (React DOM plus the App Router, ≈115 kB of the 138 kB), which the Vite build did not need. What server components changed is the *app’s own share*: the dish list, cards, specials, reviews, validation messages and the checkout summary are HTML only — none of that text is in the JavaScript. Only seven small client files carry app code. The saving grows with the amount of server-rendered content; it does not offset the framework baseline in an app this small.

## Honest notes
- `loading.js` is hard to see on the production build for `/menu` because the page is static (instant). It appears in `npm run dev` (700 ms simulated latency in development only) and the checkout’s delivery price streams in production behind its Suspense boundary.
- Orders live in server memory and vanish on restart (there is no database yet); the session is a signed cookie, not real authentication (week 9).
- `next.config.mjs` sets `cacheComponents: false` so `revalidate` and `dynamic` work as the course teaches.
- Capstone migration: not included here — it needs your own project.
