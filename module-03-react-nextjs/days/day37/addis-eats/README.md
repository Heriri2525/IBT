# Addis Eats — Day 37 (Layouts & Rendering Strategies)

Run: `npm install` → `npm run dev` (http://localhost:3000) · `npm run build` → `npm run start`

## Where each requirement lives
| Requirement | File |
|---|---|
| Root layout (html, body, global CSS, header, footer) | `app/layout.js` |
| Menu layout with sidebar + layout counter | `app/menu/layout.js`, `Sidebar.jsx`, `MenuCounter.jsx` |
| ISR on the menu (`revalidate = 3600`) | `app/menu/page.js` |
| `generateStaticParams` (one page per dish) | `app/menu/[id]/page.js` |
| Checkout forced dynamic, with the `cookies()` read | `app/checkout/layout.js`, `app/checkout/page.js` |
| Suspense streaming of the dish list | `app/menu/page.js` (+ `DishSkeleton.jsx`) |
| Every route and why | `STRATEGY.md` |

## Build output (`npm run build`)
```
Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
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

## Things to know
- `next.config.mjs` sets `cacheComponents: false`. The Next 16 scaffold turns it on, but then `revalidate`/`dynamic` exports are rejected; today's sheet teaches those, so it is off on purpose.
- `/menu` is static, so its 700 ms simulated latency is paid at build/regeneration, not per visit. The skeleton is visible in `npm run dev` (every request renders) and on `/checkout`, which is dynamic. Category filtering is done in the browser with `?category=` so the page stays static.
- Day 36 states still work: `/menu?crash=1` → `error.js`, `/menu/999` → `not-found.js`.
