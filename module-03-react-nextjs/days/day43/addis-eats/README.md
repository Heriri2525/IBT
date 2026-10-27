# Addis Eats — Day 43 (Optimisation & Environment)

Addis Eats is now fast and configurable. Built on the Day 42 project (middleware, sessions, ownership checks): everything from Day 42 still works unchanged. Today adds images, fonts, a lazy third-party script, measurement, and environment configuration.

## Run it
```
npm install
npm run dev              # http://localhost:3000   (for writing code, NOT for measuring)
npm run perf             # production build + start: measure THIS
```
No `.env.local` is needed. `.env.example` lists every variable.

Demo accounts are unchanged from Day 42:

| Phone | Password | Role |
|---|---|---|
| `0911000001` | `Abebe-pass-42` | customer (Abebe) |
| `0911000002` | `Selam-pass-42` | customer (Selam) |
| `0911000003` | `Kitchen-pass-42` | **staff** (Kidist) |

## What changed from Day 42
| Change | File |
|---|---|
| Dish cards use `next/image`: real `width`/`height`, honest `sizes`, meaningful `alt`, no `priority` | `app/menu/DishCard.jsx` (new), `app/menu/DishList.jsx` |
| Home hero: `fill` + `priority` (the one largest above-the-fold image) | `app/page.js` |
| Dish page photo: `priority` (the one image above the fold there) | `app/menu/[id]/page.js` |
| Logo as SVG through `Image`, empty `alt` (decorative) | `public/logo.svg`, `app/layout.js` |
| Inter via `next/font/google`: self-hosted, `display: "swap"`, Latin subset | `app/layout.js`, `app/globals.css` |
| Third-party script via `next/script`, `lazyOnload`, off unless configured | `app/Analytics.jsx` |
| `images` (formats, remote host) and security headers and a redirect, in config not middleware | `next.config.mjs` |
| Env files: committed defaults + `.env.example`; `.env*.local` ignored | `.env`, `.env.development`, `.env.production`, `.env.example`, `.gitignore` |
| Environment validated when the server boots | `lib/env.js`, `instrumentation.js` (used by `lib/session.js`) |
| The "before you deploy" checklist as a command | `scripts/check-env.mjs` |
| Image weights report | `scripts/image-report.mjs` |
| Before/after numbers, review answers | `PERF.md` (**you fill this in**) |

## Photos are placeholders
`public/dishes/*.jpg` (12 dishes, named by each dish's `slug` in `app/menu/dishes.json`, 1200×900) and `public/hero.jpg` (1800×800) are generated stand-ins so the project runs. Replace them with real photographs, **keeping the file names**, and keep the same proportions (4:3 for dishes). Export at roughly display size: `next/image` cannot make a badly chosen original small. `npm run images` flags anything over 500 kB.

## Checks
```
npm run check:env        # .env*.local gitignored, no secret-sounding NEXT_PUBLIC_, no secret committed, .env.example complete
npm run build && npm run check:secrets   # unchanged from Day 42
npm run images           # image weights
npm run measure          # JavaScript a route downloads
npm run test:api         # and npm run test:auth, with the app running (unchanged, expect all PASS)
```

## Env files, in order of precedence (highest first)
| File | Committed? | Purpose |
|---|---|---|
| real environment / platform settings | no | production secrets |
| `.env.local` | **never** | your own secrets (git-ignored, as is every `.env*.local`) |
| `.env.development` / `.env.production` | yes | defaults for that mode |
| `.env` | yes | defaults for everyone |
| `.env.example` | yes | every variable, dummy values |

`NEXT_PUBLIC_` values are inlined into the JavaScript at **build** time: readable by anyone, and changing one means rebuilding, not restarting. Never put a secret behind that prefix.

## Things to know
- **Built on Day 42.** All Day 42 behaviour (sessions, middleware, ownership, `/kitchen`) is untouched; see `AUTH.md`.
- **`next/font/google` downloads Inter when you run `npm run build` (and on first `npm run dev`),** so that step needs an internet connection. Afterwards the font is served from your own origin. For a font Google does not host (an Amharic typeface), use `next/font/local`.
- **`priority` and newer Next.js:** the course teaches `priority`. If your Next.js version prints a deprecation notice for it, the replacement is the `preload` prop on `Image`; use it in exactly the same single place.
- **Analytics demo:** put `NEXT_PUBLIC_ANALYTICS_SRC=https://...` in `.env.local`, rebuild, and watch the script load only after the page is usable (Network tab, or Lighthouse's third-party summary).
- **Images use `Image` everywhere except decorative CSS.** Cards use no `priority`: `/menu` is a grid, and the one preloaded image lives on `/` and `/menu/[id]`.
- Sessions and orders are in memory. Restarting the server signs everyone out and resets the orders.

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
