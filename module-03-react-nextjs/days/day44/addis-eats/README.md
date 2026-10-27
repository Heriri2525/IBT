# Addis Eats — Day 44 (Metadata & SEO)

Addis Eats is now findable and looks worth opening when a link is shared. Built on the Day 43 project (images, fonts, environment) which was built on Day 42 (middleware, sessions): everything from those days still works unchanged.

## Run it
```
npm install
npm run dev              # http://localhost:3000
npm run perf             # production build + start: the honest way to check metadata too
```
No `.env.local` is needed. `.env.example` lists every variable.

Demo accounts are unchanged:

| Phone | Password | Role |
|---|---|---|
| `0911000001` | `Abebe-pass-42` | customer (Abebe) |
| `0911000002` | `Selam-pass-42` | customer (Selam) |
| `0911000003` | `Kitchen-pass-42` | **staff** (Kidist) |

## What changed from Day 43
| Change | File |
|---|---|
| `metadataBase`, title template (`%s · Addis Eats`), default title and description, Open Graph fallback | `app/layout.js` |
| One home for the site URL, brand, private-route list and the `openGraphFor` / `clip` helpers | `lib/site.js` |
| Static metadata with a written-for-a-person description on every route; private routes `noindex` | `app/page.js`, `app/menu/page.js`, `app/cart`, `app/checkout`, `app/orders`, `app/kitchen`, `app/signin` |
| Section default description for everything under `/menu`; canonical `/menu` | `app/menu/layout.js`, `app/menu/page.js` |
| `generateMetadata` for dishes: title, price, description and canonical from the record | `app/menu/[id]/page.js` |
| Titles no longer hard-code "· Addis Eats" (the template adds it once) | every page above |
| `getDish` / `getDishes` wrapped in React `cache()` so metadata, page and sitemap share one lookup | `app/menu/dishes.js` |
| `MenuItem` JSON-LD from the same dish object the page renders | `app/menu/[id]/page.js`, `app/JsonLd.jsx` |
| `Restaurant` JSON-LD (only facts the home page shows) | `app/page.js` |
| Site-wide preview card, `/menu` card, favicon and Apple icon by file name | `app/opengraph-image.jpg`, `app/menu/opengraph-image.jpg`, `app/icon.png`, `app/apple-icon.png`, `*.alt.txt` |
| A generated 1200 × 630 preview per dish (`ImageResponse`) | `app/menu/[id]/opengraph-image.jsx` |
| Sitemap generated from the dishes; private routes excluded | `app/sitemap.js` |
| `robots.txt` with the private routes disallowed and a pointer to the sitemap | `app/robots.js` |
| "View source", automated | `scripts/check-seo.mjs` (`npm run check:seo`) |
| Route table, view-source cheat sheet, review answers, results to fill in | `SEO.md` |

## IMPORTANT: set your real address before you share anything
`metadataBase` comes from `NEXT_PUBLIC_SITE_URL`. `.env.production` contains `https://addiseats.et` as a **placeholder**: change it to the address you actually deploy to, then **rebuild** (the value is inlined at build time, Day 43). With a localhost address every `og:image` points at the visitor's own computer and every shared card arrives without its picture.

## Check it (verify on the running page, not by reading code)
```
npm run perf             # terminal 1: build + start
npm run check:seo        # terminal 2: fetches the real pages and checks what a crawler sees
npm run check:seo -- https://your-site.example     # the same checks against a deployment
```
It checks, for `/`, `/menu` and all 12 dishes: title, a description of sensible length, canonical, exactly one `<h1>`, absolute `og:` URLs, that the `og:image` really serves a 1200 × 630 image, JSON-LD whose name and ETB price match the page, that no two dishes share a description, that the sitemap lists every dish and no private route, and that `robots.txt` disallows them.

Then by hand (also in `SEO.md`):
1. View source on `/menu/2` (Ctrl+U) and find `<title>`, `description`, `canonical`, the `og:` tags and the `ld+json` script.
2. Open `/menu/2/opengraph-image` in the browser: that is the card people will see.
3. Open `/sitemap.xml` and `/robots.txt`.
4. After deploying, paste a dish link into a Telegram chat or a preview debugger.

The Day 43 checks still work: `npm run check:env`, `npm run build && npm run check:secrets`, `npm run test:api`, `npm run test:auth`.

## Two fixes since the first Day 44 build
- **The font is now `next/font/local`** (Liberation Sans, in `app/fonts/`), so `npm run build` needs **no internet**. The earlier `next/font/google` version failed with "Failed to fetch Inter" on a network that cannot reach `fonts.googleapis.com`. To use Inter, see the comment in `app/layout.js`.
- **`middleware.js` is now `proxy.js`**, as Next.js 16.4 asks (it prints a deprecation warning otherwise). Nothing inside changed; `npm run test:auth` still proves it runs through the `x-auth-layer` header.

## Things to know
- **Photos and preview cards are placeholders.** The dish photos and the site/menu preview cards were generated so the project runs. Replace `app/opengraph-image.jpg` and `app/menu/opengraph-image.jpg` with your own designs (1200 × 630). **Rename the file when you change the design**: chat apps cache previews for days.
- **`openGraph` replaces, it does not merge.** A page that sets `openGraph` loses the layout's `siteName` and `locale`, so `openGraphFor()` in `lib/site.js` repeats them. `check:seo` fails if they go missing.
- **`params` is a Promise** in Next 15/16, so `generateMetadata` and the OG image do `const { id } = await params` (the slides' `params.id` is the older style).
- **The dish `summary` in the slides is `description` in this project's data.**
- **`/menu/01` and `/menu/1`** show the same dish; the canonical URL is always `/menu/1`.
- **The dish preview embeds the photo** by reading `public/dishes/<slug>.jpg`. If your host does not bundle `public/` into server functions, the card falls back to text only (no error).
- **`ImageResponse` fails silently**, and `next build` cannot tell you the card looks wrong: open `/menu/1/opengraph-image` after any change.
- **No `Restaurant` address or opening hours** in the JSON-LD, because the page shows none and structured data must match the page. Add them to the page and the JSON-LD together when you have them.
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
