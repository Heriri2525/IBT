# Rendering strategy — Addis Eats (Day 37, extended on Days 39 and 42)

Two questions per route: does it depend on who is asking, and how stale may it be?

| Route | Strategy | Build marker | Why |
|---|---|---|---|
| `/` | Static | ○ | Story and address never change between builds. |
| `/menu` | ISR, `revalidate = 3600` | ○ (Revalidate 1h) | Dishes change a few times a day; an hour-old menu misleads nobody and speed matters most. |
| `/menu/[id]` | Static via `generateStaticParams` | ● (12 pages) | Every dish id is known at build time. Unlisted ids render on first request, then cache. |
| `/cart` | Client | ○ shell + browser state | The cart is the person's own private state, kept in their browser. |
| `/checkout` | Dynamic | ƒ | `await cookies()` reads the session cookie (per-request); `force-dynamic` on the layout states it for the whole segment. |
| `/orders` | Dynamic | ƒ | Private and scoped to the session id, so it cannot be prerendered. (Day 39 cached it; Day 42 made it per-person.) |
| `/kitchen` | Dynamic | ƒ | Reads the session and the role. Staff only. |
| `/signin` | Dynamic | ƒ | Reads the session cookie and `?next=`. |
| `/api/dishes`, `/api/dishes/[id]` | Dynamic | ƒ | `/api/dishes` reads `request.url`; the `[id]` segment is not prebuilt. |
| `/api/orders`, `/api/orders/[id]`, `/api/auth/*` | Never cached | ƒ | They read the session, or they write. |
| *Proxy / middleware* | Before rendering | ƒ | Runs only for `/checkout/:path*` and `/orders/:path*`. |

Streaming: `/menu` sends the layout + sidebar first and the dish list behind a `<Suspense>` skeleton; `/checkout` streams "live pricing" behind its own boundary.
Not built: `/orders/[id]` (in the lecture table, not in today's requirements).
