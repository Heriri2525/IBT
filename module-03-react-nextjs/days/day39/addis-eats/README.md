# Addis Eats — Day 39 (API Routes & Route Handlers)

The server half of Addis Eats, in the same repository as the pages.

## Run it
```
npm install
npm run dev              # http://localhost:3000
```
`.env.local` is included with a throwaway `SESSION_SECRET` so sign-in works straight away.
It is git-ignored; `.env.example` is the committed template.

## Endpoints
Every failure uses ONE shape: `{ "error": "message" }`, plus `fieldErrors` for validation.

| Method | Path | Success | Errors | Cached? |
|---|---|---|---|---|
| GET | `/api/dishes` | `200` array of dishes | — | dynamic (reads `request.url`) |
| GET | `/api/dishes?category=Vegetarian` | `200` filtered array | `400` unknown category | dynamic |
| GET | `/api/dishes/[id]` | `200` the dish | `400` id is not a number · `404` no such dish | dynamic |
| POST | `/api/orders` | `201` `{ id, total, currency, status }` | `400` body is not a JSON object · `422` `{ error, fieldErrors }` · `500` `{ error }` | never (POST) |

`POST /api/orders` body: `{ "name", "phone", "area", "items": [{ "id": 1, "qty": 2 }] }`.
There is no `price` field: the server looks prices up itself, and ignores one if you send it.
If the request carries a valid session cookie the order belongs to that user; otherwise it is a guest order.

## Server actions (`app/actions.js`)
| Action | Used by | Returns |
|---|---|---|
| `placeOrder(prevState, formData)` | checkout form, via `useActionState` | `{ id, total, currency }` or `{ error, fieldErrors, values }`; calls `revalidatePath("/orders")` after a write |
| `cancelOrder(orderId)` | Cancel button on `/orders` | `{ ok: true }` or `{ error }`: `Not signed in` / `No such order` / `Not yours` / `Already cancelled` |

Both call `submitOrder` in `lib/orders.js`, which validates with the one schema in `lib/schema.js`,
so the API and the form can never disagree.

## Where each requirement lives
| Requirement | File |
|---|---|
| `GET /api/dishes`, `GET /api/dishes/[id]` with honest 404 and one error shape | `app/api/dishes/route.js`, `app/api/dishes/[id]/route.js`, `lib/http.js` |
| `POST /api/orders`: 201, 422 with `fieldErrors` | `app/api/orders/route.js`, `lib/orders.js` (`submitOrder`) |
| The one shared zod schema | `lib/schema.js` (+ `lib/constants.js`, kept zod-free so the browser never downloads zod) |
| `placeOrder` replacing the fetch, `useActionState` driving the button | `app/actions.js`, `app/checkout/OrderForm.jsx` |
| `revalidatePath` after a write; a cached page that refreshes | `app/actions.js`, `app/orders/page.js` (`revalidate = 3600`) |
| `cancelOrder` checks session AND owner | `app/actions.js`, `lib/session.js` |
| `.env.local` ignored, no secret in client code | `.gitignore`, `.env.example`, `scripts/check-secrets.mjs` |

## Test it
**1. Automated contract test** (app running in another terminal):
```
npm run test:api
```
Prints PASS/FAIL for 13 checks (200/400/404/422/201, error shape, server-side pricing).

**2. By hand with curl** (in PowerShell use `curl.exe`; plain `curl` is a different command there):
```
curl.exe -i http://localhost:3000/api/dishes/999
curl.exe -i -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" --data-binary "@requests/order-bad-phone.json"
curl.exe -i -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" --data-binary "@requests/order-valid.json"
```
Expect `404`, `422` with `fieldErrors.phone`, then `201` with `"total":640` (the `price: 1` in that file is ignored).

**3. In the browser**
1. `/menu` → open a dish → *Add to cart* → `/checkout`. Submit empty: field errors appear (from the server).
2. Fill the form with phone `12345`: error under the phone field, your other values are kept.
3. Use `0911223344`, pick an area, *Place order*: the button says "Sending...", then the confirmation appears and the cart empties.
4. `/orders`: the new order is already there (cache refreshed by `revalidatePath`).
5. **Break your own action:** `/signin` → *Sign in as Selam* → `/orders` → *Cancel order* on **ord_1001** (Abebe's). The server answers "Not yours" and the order stays open. Cancel **ord_1002** (Selam's) and it works.
6. Sign out and press Cancel: "Not signed in".

Server actions cannot be called as plain functions from the console, so the Cancel button on someone else's order is the honest way to try it. The button is shown to everyone on purpose: hiding it would be interface, not security.

## Secrets
```
npm run build
npm run check:secrets    # looks for every non-NEXT_PUBLIC value of .env.local inside .next/static
git check-ignore -v .env.local    # should print the .gitignore rule that ignores it
```

## Things to know
- The orders "database" is an in-memory store (`lib/orders.js`) with two seeded orders. It resets when the server restarts. Module 4 replaces it with a real database.
- Sign-in is a **demo** (two accounts, no password) so ownership checks can be tried. The cookie is signed with `SESSION_SECRET`, so editing it by hand does not work.
- Failures from actions are *returned*, not thrown: thrown errors are masked in production builds, so the message would never reach the page.
- The checkout form posts the cart as hidden `items` JSON; the cart lives in the browser, so the form needs JavaScript to know the cart.
- `zod` is pinned to the 3.x API (`^3.25.0`). If your Day 33 schema differs (TeleBirr pattern, areas), edit `lib/constants.js` and `lib/schema.js`.
- Days 36 to 38 still work: `/menu?crash=1` → `error.js`, `/menu/999` → `not-found.js`.
