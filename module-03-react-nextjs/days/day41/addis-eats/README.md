# Addis Eats — Day 41: live data with SWR

Run: `npm install` → `npm run build` → `npm run start` (http://localhost:3000). Dev: `npm run dev`.
Optional env (see `.env.example`): `SESSION_SECRET`, and `DISH_LATENCY_MS=400` to make loading and `keepPreviousData` visible on a production build.

Documents: [DATA.md](DATA.md) (every query: key, refresh rule, why) · [STRATEGY.md](STRATEGY.md) · [BOUNDARY.md](BOUNDARY.md)

## What was added
| Piece | File |
|---|---|
| Shared fetcher (throws on non-OK) | `lib/fetcher.js` |
| Order-status route, server-rendered then polled every 5 s | `app/orders/[id]/page.js`, `OrderStatus.jsx`, `useOrder.js` |
| Order endpoint (session + owner checked) | `app/api/orders/[id]/route.js` |
| Debounced search, null key, `keepPreviousData`, paging in the URL | `app/menu/DishBrowser.jsx`, `filter-store.js`, `lib/use-debounce.js` |
| Search + paging endpoint | `app/api/dishes/route.js` (`?q=&category=&page=`) |
| Track-order links | `app/checkout/page.js` |

The order status moves with time (placed → preparing after 10 s → on the way after 25 s → delivered after 45 s) so the polling has something to show.

## Build output
```
Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ƒ /api/orders/[id]
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                      1h      1y
├   /menu/[id]
│ ├ ● /menu/1
│ ├ ● /menu/2
│ ├ ● /menu/3
│ └ ● [+9 more paths]
└ ƒ /orders/[id]


○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand

```

## What the network tab shows (verified with Playwright on the production build)
- **Typing "tibs" quickly:** exactly **one** request, `/api/dishes?q=tibs&page=1`, 300 ms after the last key. Not four.
- **Changing "sh" → "tib":** the old list stays on screen (dimmed) until the new one arrives — no skeleton, no empty state.
- **Race:** with the response for `q=sh` held back 1.5 s, typing `tibs` right after still ends on **Tibs**; the late `sh` response does not overwrite it.
- **Order page:** the first paint already contains the order (also present in the raw HTML with JavaScript off). Then one `GET /api/orders/<id>` every 5 s — **one per poll even though two components (`OrderBadge`, `OrderStatus`) use it** (3 requests in 10 s). After `delivered`, **zero** further requests.
- **Paging:** `Next →` pushes `?page=2` (no full reload); Back returns to page 1; `/menu?page=2` and `/menu?category=Vegetarian` load directly.
- Someone else's order id → 404 page and a 404 from the API.

## Check yourself
- Five characters typed → **one** request. ✔
- Order page shows data immediately, no spinner. ✔
- Two components, same key → one network call per poll. ✔
- List keeps previous results while the next load runs. ✔
- Every `refreshInterval` / `staleTime`-style rule is justified in DATA.md. ✔ (SWR has no `staleTime`; its equivalents are `refreshInterval`, `dedupingInterval` and `revalidateOnFocus`.)

## First Load JS for /menu (gzip, all scripts loaded on first visit)
Day 35 (Vite) 84.6 kB · Day 40 (Next) 137.9 kB · **Day 41 144.7 kB** — about 7 kB more for SWR plus the browser/pager code.

## Honest notes
- `/menu`’s server-rendered first page is now 6 dishes (page size 6, two pages), not all 12.
- Hard-loading `/menu?page=2` or `?q=` shows the server’s page 1 for a moment, then the SWR result (the static HTML cannot know the query string).
- Orders and sessions are still in server memory / a signed cookie (real auth is Day 42).
- `next.config.mjs` keeps `cacheComponents: false`.
