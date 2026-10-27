# Addis Eats — Day 42 (Middleware & Authentication)

Addis Eats now knows who is asking. Built on the Day 39 project (route handlers, server actions, the shared schema).

## Run it
```
npm install
npm run dev              # http://localhost:3000
```
No `.env.local` is needed. `.env.example` explains the one optional setting (`COOKIE_SECURE`).

## Demo accounts
| Phone | Password | Role |
|---|---|---|
| `0911000001` | `Abebe-pass-42` | customer (Abebe, owns `ord_1001`, `ord_1003`) |
| `0911000002` | `Selam-pass-42` | customer (Selam, owns `ord_1002`, `ord_1004`) |
| `0911000003` | `Kitchen-pass-42` | **staff** (Kidist) |

`+2519...` works the same as `09...`. Passwords are stored as scrypt hashes in `lib/users.js`.

## What changed from Day 39
| Change | File |
|---|---|
| Middleware: cookie shape check, redirect with `?next=`, narrow matcher | `middleware.js` |
| Real sessions (random id, server-side store), hardened cookie, one `getSession()` helper | `lib/session.js` |
| Password hashing and constant-time check | `lib/password.js`, `lib/users.js` |
| Open-redirect guard for `next` | `lib/safe-next.js` |
| Sign-in form (phone + password) and sign-out | `app/signin/page.js`, `SignInForm.jsx`, `actions.js` |
| `/checkout` and `/orders` check the session; `/orders` is scoped to the session id | `app/checkout/page.js`, `app/orders/page.js` |
| `/kitchen`, staff only, with a `markReady` action | `app/kitchen/*`, `app/actions.js` |
| Ownership checks shared by the action and the route handlers | `lib/orders.js` |
| Orders endpoints now need a session; `GET /api/orders`, `GET` and `DELETE /api/orders/[id]` added | `app/api/orders/**` |
| Sign-in and sign-out for non-form clients | `app/api/auth/signin`, `app/api/auth/signout` |
| Every protected route, its layers, the three attacks | `AUTH.md` |

## Endpoints
Errors always look like `{ "error": "..." }`, plus `fieldErrors` for validation.

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/dishes`, `/api/dishes/[id]` | 200 | 400 · 404 (unchanged from Day 39, public) |
| POST | `/api/auth/signin` `{ phone, password }` | 200 `{ id, name, role }` + `Set-Cookie` | 400 not JSON · 422 missing fields · 401 wrong phone or password |
| POST | `/api/auth/signout` | 200 `{ ok: true }` | none |
| GET | `/api/orders` | 200 the **signed-in user's** orders | 401 |
| POST | `/api/orders` | 201 `{ id, total, currency, status }` | 401 · 400 · 422 `fieldErrors` · 500 |
| GET | `/api/orders/[id]` | 200 the order | 401 · 404 · 403 not yours |
| DELETE | `/api/orders/[id]` | 200 `{ ok: true }` | 401 · 404 · 403 · 409 already cancelled or ready |

Server actions (`app/actions.js`, `app/signin/actions.js`): `placeOrder`, `cancelOrder`, `markReady` (staff), `signIn`, `signOut`.

## Test it
With the app running, in a second terminal:
```
npm run test:api       # Day 39 contract (now signs in first)         expect all PASS
npm run test:auth      # cookie flags, 3 layers, ownership, roles, sign-out, ?next=   expect all PASS
```
Then the by-hand checks in the browser (they are the three attacks in `AUTH.md`):
1. Signed out, open `/orders`: you land on `/signin?next=/orders`. Sign in as Selam: you return to `/orders` and see only `ord_1002` and `ord_1004`.
2. Press F12 → Application → Cookies: `session` has the `HttpOnly`, `Secure` and `SameSite=Lax` columns set, and `document.cookie` in the Console does not show it.
3. Sign in as Selam, open `/kitchen`: 404. Sign in as Kidist: you see everyone's orders and can press **Mark ready**.
4. Do the three attacks in `AUTH.md` and write your results into its last column.
5. `npm run build`, then `npm run check:secrets`.

## Things to know
- **Built on Day 39, not Days 40 and 41.** If your Day 40/41 folders added code (the foundations project, SWR or React Query polling), copy `middleware.js`, `lib/`, `app/signin`, `app/kitchen`, `app/api/auth`, `AUTH.md` into that project and re-point its queries at `getSession()`.
- **If Next.js says "middleware" is deprecated:** newer versions call the file `proxy.js`. Run `git mv middleware.js proxy.js` and change nothing inside it (it uses a default export, which works for both names). `npm run test:auth` checks that this layer is running via the `x-auth-layer` header.
- `/orders` is no longer cached: a page that depends on who is asking cannot be prerendered, so its `revalidate` setting from Day 39 is gone.
- Sessions and orders are in memory. Restarting the server signs everyone out and resets the orders.
- Failed attempts are not rate-limited; see "Known limits" in `AUTH.md`.
