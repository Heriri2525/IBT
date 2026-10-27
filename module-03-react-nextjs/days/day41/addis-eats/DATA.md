# DATA.md — every client-side query

Rule from Day 38 still holds: if a server component can fetch it, it does. These are the fetches that cannot.
All use SWR and the one shared fetcher `lib/fetcher.js` (throws a `FetchError` for any non-OK response, so `error` is set instead of an error body being cached as data).

| Query | Key | Refresh rule | Why |
|---|---|---|---|
| Order status (`app/orders/[id]/useOrder.js`) | `` `/api/orders/${id}` `` | `refreshInterval`: 5000 ms, switched to 0 once the status is `delivered` or `cancelled`; `revalidateOnFocus` left on; `fallbackData` = the server-rendered order | The kitchen status really changes within seconds, and 5 s is quick enough to feel live without hammering the server. Once nothing can change, polling is wasted traffic, so it stops. A tab that was in the background should catch up the moment it is focused again. `fallbackData` means the first paint has the order — no spinner. |
| Order status, second component (`OrderBadge`) | **same key as above** | same hook | Two components, one cache entry, **one request per poll** (measured, see README). |
| Dish browser (`app/menu/DishBrowser.jsx`) | `["/api/dishes", { q, category, page }]`, or `null` | none; `revalidateOnFocus: false`; `dedupingInterval: 30_000`; `keepPreviousData: true` | The key holds everything the result depends on, so a change of term, category or page refetches and each combination is its own cache entry. `null` while nothing is searched, filtered or paged (the server-rendered first page is on screen), so we never fetch what the server already gave us. The menu changes a few times a day (it is a 1-hour ISR page), so refetching on focus or on a timer is waste; a 30 s dedupe window answers repeated identical searches from the cache. `keepPreviousData` keeps the old list on screen while the next one loads — no flash. |

## The debounce
The search box keeps what is typed in `draft`; `useDebounce(draft, 300)` only changes after 300 ms of silence, and only that value goes into the key. Typing "tibs" quickly = **one** request.

## Page and search live in the URL
`/menu?q=tibs&category=Vegetarian&page=2` is shareable and reloadable. Typing and filtering *replace* the history entry (no entry per keystroke); paging *pushes* one, so Back goes to the previous page. The Previous/Next controls are real `<a href>` links.

## What the server still does (not a query)
- Menu on arrival → server component (`searchDishes` called directly, no fetch).
- Dish detail → server component, `generateStaticParams`.
- Placing / cancelling an order → server actions.

## Gotcha worth remembering
With `keepPreviousData: true`, SWR's `isLoading` is still `true` while the next key loads (it only counts *loaded* data). Showing a skeleton on `isLoading` brings the flash back; use `!data` instead. (I hit this and fixed it.)
