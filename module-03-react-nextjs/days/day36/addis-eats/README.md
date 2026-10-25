# Addis Eats — Day 36 (Next.js App Router)

Run: `npm install` → `npm run dev` (http://localhost:3000) · `npm run build` → `npm run start`

## Routes → the file that produces each

| URL | File |
|---|---|
| `/` | `app/page.js` |
| `/menu` | `app/menu/page.js` |
| `/menu/[id]` (e.g. `/menu/3`) | `app/menu/[id]/page.js` |
| `/cart` | `app/cart/page.js` |
| `/checkout` | `app/checkout/page.js` |
| any unknown URL / `notFound()` | `app/not-found.js` |

Special files: `app/layout.js` (root shell + nav), `app/menu/loading.js` (skeleton), `app/menu/error.js` (`"use client"` boundary).

## Colocated, NOT routable
`app/menu/DishList.jsx`, `CategoryBar.jsx`, `dishes.js`, `dishes.json`, `app/cart/CheckoutButton.jsx`, `app/menu/[id]/AddToCartLink.jsx`.
Only a `page.js` (or `route.js`) makes a folder public. `/menu/DishList` just hits `[id]` and shows not-found.

## Try each state
- Dish typed directly: open `/menu/3`.
- loading.js: click Menu (700 ms simulated latency) or throttle in DevTools.
- error.js: open `/menu?crash=1` (page deliberately throws); "Try again" calls `reset()`.
- not-found.js: open `/nope`, or `/menu/999` (page calls `notFound()`).
- `useRouter().push`: "Proceed to checkout" on `/cart`.

## Version notes
Next 16: `params` / `searchParams` are Promises → `const { id } = await params`.
`next.config.mjs` has Cache Components on (scaffold default); `loading.js` is the Suspense boundary for uncached data.
