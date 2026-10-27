# STRATEGY.md — rendering strategy per route

Two questions per route: **who is asking?** and **how stale may it be?**
Checked against `npm run build` (markers: ○ static · ● SSG via params · ƒ dynamic).

| Route | Intended | Build marker | One line of reasoning |
|---|---|---|---|
| `/` | Static | ○ | Landing page and today’s specials are the same for everyone; they only change when we redeploy. |
| `/menu` | ISR, `revalidate = 3600` | ○ (1h) | Dishes change a few times a day, an hour-old menu misleads nobody, and it is the busiest route — so it must be instant. |
| `/menu/[id]` | Static via `generateStaticParams` | ● (12 pages) | Every dish id is known at build time; an id we didn’t list renders on request then caches, and a nonexistent one hits `notFound()`. |
| `/cart` | Client | ○ shell | The cart is private to this browser: the page is a static shell, the lines are rendered on the client from the cart store. |
| `/checkout` | Dynamic | ƒ | It reads the `session` and `cart` cookies (`cookies()`), so the response depends on who asks; `force-dynamic` on its layout says so explicitly. |
| `/api/dishes` | Static, 1h | ○ (1h) | Same data as the menu, for outside callers; no request-specific input. |
| `/api/dishes/[id]` | Dynamic | ƒ | Looks up whatever id is asked for; 404 for unknown ids. |
| `/api/orders` | Dynamic | ƒ | POST writes; GET reads the caller’s own orders from their session. |

**A route I changed my mind about:** I first wrote `/cart` as "static" (it is, as a shell). The decision that mattered was *where the cart lives*: I moved it from "client store only" to a cookie of `[{id, qty}]` so that the checkout (including with JavaScript off) can see it. The route is still ○ — only `/checkout` reads the cookie.

**Streaming:** `/menu` streams its dish list behind a `<Suspense>` skeleton; `/checkout` streams the delivery price behind its own boundary (visible in production because the route is dynamic).
