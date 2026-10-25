# Addis Eats

A food-ordering frontend for Addis Ababa — the Module 3 (React) mini-project. Browse a menu
loaded from an API, filter by category, open any dish on its own page, build an order and
check out through a validated form.

React 19 · Vite · React Router v6 · Zustand · plain CSS

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 17 tests: cart store + checkout validation (no React needed)
npm run build      # production build, then:  npm run preview
```

Sign in with **any phone number like `0911234567`** (the sign-in is simulated).

> **The API is fake.** `vite.config.js` contains a small dev/preview-server plugin that serves
> `/api/dishes`, `/api/dishes/:slug` and `POST /api/orders` from `server/dishes.json`.
> It runs under `npm run dev` and `npm run preview`, but **not** on a static host: the real API
> arrives in Module 4.
> In `npm run dev` you also get **dev-only test switches** (break a dish, break the order panel,
> simulate a server failure). A production build does not show them.

## Routes

| Path | Screen | Notes |
|---|---|---|
| `/` | Home | today's specials, link into the menu |
| `/menu` | Menu | fetched dishes; category in the URL: `/menu?category=Vegetarian` |
| `/menu/:id` | Dish | `:id` is a slug (`/menu/doro-wat`); an unknown id shows a message |
| `/cart` | Cart | order lines and the running ETB total |
| `/checkout` | Checkout | **guarded** — signed out → `/login` → back to `/checkout`. **Lazy-loaded** |
| `/login` | Sign in | returns you to where you were headed |
| `/orders/:orderId` | Receipt | shown after placing an order. **Lazy-loaded** |
| `*` | Not found | a message and a way back |

## Where each required feature lives

| Day | Requirement | Where |
|---|---|---|
| 26–27 | Composed components, props, keys, conditional rendering | `menu/DishList` → `DishCard` (props, `key`); `children` in `Layout`, `RequireAuth`, `ErrorBoundary`; loading / empty / error branches in `menu/MenuBrowser` |
| 28 | State and events; a controlled form | `checkout/Checkout.jsx` (one state object, one handler), `menu/SearchBox`, `menu/CategoryBar` |
| 29 | Effect with cleanup | `hooks/useFetch.js` (aborts the request on change/unmount); focus effect in `SearchBox` |
| 30 | Custom hook + context or store | `useFetch`, `useAuth`; **Zustand** cart store `cart/cartStore.js`; auth and theme contexts |
| 31 | Nested, dynamic and guarded routes | `App.jsx` + `Layout.jsx` (nested, `<Outlet/>`), `menu/DishDetail` (`useParams`), `auth/RequireAuth` |
| 33 | Validation | `checkout/validate.js` (pure), `checkout/Field.jsx` (aria wiring), touched tracking in `Checkout` |
| 34 | Error boundary, lazy route | `ui/ErrorBoundary.jsx` around the app, each page, the menu and the order panel; `lazy()` for Checkout, Receipt and the dish modal |

## Folder map

```
src/
  api/        URL helpers and placeOrder
  hooks/      useFetch
  ui/         generic pieces: ErrorBoundary, Modal, Skeleton, RouteShell, NotFound …
  cart/       store, cart page, order panel, header badge
  menu/       menu page, browser, category bar, search, dish list, dish card, dish detail
  home/       landing page
  checkout/   form, validation rules, field, receipt
  auth/       session context, useAuth, RequireAuth, login
  theme/      light / dark
```

More in **BRIEF.md** (requirements, definition of done, marking) and **docs/PLAN.md**
(component tree, state-placement table, build order, failure checks, presentation outline).

## Behaviour worth knowing

- **Cart** is in a persisted Zustand store (`localStorage` key `addis-eats-cart`), so it survives navigation *and* a refresh. Components select only what they need, so a change re-renders only what depends on it.
- **Menu states:** loading ("Loading the menu..."), error (message + *Try Again*), empty (a note that says why) and data are all on screen. A bad dish is caught by an error boundary and replaces only the list.
- **Checkout** (fields in one state object; rules in a pure `validate()`): errors show after a field is touched and clear as soon as they are fixed; labels, `aria-invalid`, `aria-describedby`, `role="alert"`; ⚠ mark and text, not colour alone; focus moves to the first problem; the button shows the ETB total and disables while sending (it cannot double-send); on failure every value stays in the form.
- Try phone `0900000000` to see the server's **422** message ("not registered with TeleBirr").

## Checked

Loading on slow 3G; error state when the data file is missing, then recovery; empty search;
nonsense URL; signed-out `/checkout` round-trip; cold reload on nine URLs; the whole checkout
by keyboard alone; error visibility in greyscale; lazy chunks absent from the first download in
a production build; clean console. Details in `docs/PLAN.md`.
