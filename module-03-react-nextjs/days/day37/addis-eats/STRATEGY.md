# Rendering strategy — Addis Eats (Day 37)

Two questions per route: does it depend on who is asking, and how stale may it be?

| Route | Strategy | Build marker | Why |
|---|---|---|---|
| `/` | Static | ○ | Story and address never change between builds. |
| `/menu` | ISR, `revalidate = 3600` | ○ (Revalidate 1h) | Dishes change a few times a day; an hour-old menu misleads nobody and speed matters most. |
| `/menu/[id]` | Static via `generateStaticParams` | ● (12 pages) | Every dish id is known at build time. Unlisted ids render on first request, then cache. |
| `/cart` | Client | ○ shell + browser state | The cart is the person's own private state, kept in their browser. |
| `/checkout` | Dynamic | ƒ | `await cookies()` reads the session cookie (per-request); `force-dynamic` on the layout states it for the whole segment. |

Streaming: `/menu` sends the layout + sidebar first and the dish list behind a `<Suspense>` skeleton; `/checkout` streams "live pricing" behind its own boundary.
Not built: `/orders/[id]` (in the lecture table, not in today's requirements).
