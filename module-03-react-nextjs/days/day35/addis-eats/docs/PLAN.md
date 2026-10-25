# PLAN — Addis Eats (planning documents for Day 35)

The sheet asks for these on paper *before* coding. This version describes the application
as it was built, so **redraw the tree and re-write the table in your own hand** and compare:
every difference is a decision you can explain at the presentation.

## 1. Component tree (what each component owns → what it receives)

```
App                       providers + route table + last-resort error boundary
└─ Layout                 owns: nothing that changes. header, nav, <RouteShell/>, footer
   └─ RouteShell          page error boundary (keyed by path) + Suspense skeleton
      ├─ Home             owns: its fetch (useFetch)           → DishList
      ├─ Menu             owns: only dev test switches         (a frame, two regions)
      │  ├─ MenuBrowser   owns: category (URL), search, fetch  ← breakDish (dev switch)
      │  │  ├─ CategoryBar   props: category, onChange (memo)
      │  │  ├─ SearchBox     props: search, onSearch
      │  │  └─ DishList      props: dishes, onAdd, emptyMessage (memo)
      │  │     └─ DishCard   props: dish, onAdd (memo); owns: quick-view modal open?
      │  └─ CartPanel     reads: cart store (items, total)
      ├─ DishDetail       owns: its fetch; reads :id from the URL
      ├─ CartPage         reads: cart store
      ├─ RequireAuth ▸ Checkout   owns: form, touched, submitting, serverErrors
      ├─ OrderReceipt     reads: the order passed through router state
      ├─ Login            owns: phone, error, busy
      └─ NotFound         props: message
```

## 2. Where state lives

| State | Where it belongs | Why |
|---|---|---|
| Selected category | **The URL** (`?category=`) | shareable, survives a refresh |
| Search text | `MenuBrowser` | only the menu list reads it |
| Fetched dishes | the component that displays them (via `useFetch`) | server data stays out of the global store |
| The order (cart) | **Zustand store** (`cart/cartStore.js`), persisted | read on 4 screens + the header badge; survives refresh |
| Sign-in session | **Context** (`auth/`) | rarely changes, needed by the guard and the nav |
| Theme | Context (`theme/`), separate from auth | changes rarely, kept apart so neither re-renders the other |
| Checkout form fields | `Checkout`, nowhere else | nothing else needs them |
| Is a modal open | `DishCard` | the component that opens it |

## 3. Folders (by feature)

```
src/
  api/        dishes.js (URL helpers), orders.js (placeOrder)
  hooks/      useFetch.js
  ui/         ErrorBoundary, Modal, Skeleton, RouteShell, Fallbacks, NotFound, DevOnly, Bomb
  cart/       cartStore, CartPage, CartPanel, CartBadge, CartUnavailable
  menu/       Menu, MenuBrowser, CategoryBar, SearchBox, DishList, DishCard, DishDetail, MenuUnavailable
  home/       Home
  checkout/   Checkout, validate.js, Field, OrderReceipt
  auth/       AuthProvider, useAuth, authContext, RequireAuth, Login
  theme/      ThemeContext, ThemeToggle
  App.jsx  Layout.jsx  main.jsx  index.css
```

`ui/` holds only generic things. `NotFound` takes a `message`; `MenuUnavailable` mentions the
menu, so it lives in `menu/`.

## 4. Build order (vertical slices) and a commit for each

| # | Step | Suggested commit |
|---|---|---|
| 1 | Routes and Layout — every screen reachable, even if empty | `feat: routes and shared layout with nav` |
| 2 | The menu: fetch, loading, error, list | `feat: menu fetches dishes with loading and error states` |
| 3 | The filter, and the dish detail route | `feat: category filter in the query string` · `feat: dish detail page with unknown-id message` |
| 4 | The cart store, and adding from the menu | `feat: cart store with add, remove and clear` |
| 5 | The checkout form with validation | `feat: checkout form with validation and touched tracking` |
| 6 | Guard, boundary, lazy route, polish | `feat: guard checkout behind sign-in` · `feat: error boundaries and lazy routes` · `fix: …` |

**Honesty note on history.** The best history is made by committing at the end of each step *as you
build*. If you are instead committing finished code, group it by these steps (`git add` only that
step's folders) rather than one giant "final" commit, and be ready to say so.

## 5. The six failure checks, plus keyboard and greyscale

| Check | What should happen | Verified (dev server) |
|---|---|---|
| Throttle to Slow 3G | loading state, never blank | ✅ |
| Rename `server/dishes.json` | error state with a useful message and *Try Again* | ✅ |
| Filter to nothing (search "pizza") | friendly note, not an error | ✅ |
| Nonsense URL | `NotFound` with a way back | ✅ |
| `/checkout` signed out | redirect to `/login`, return afterwards | ✅ |
| Reload on every screen | each loads cold | ✅ (9 URLs) |
| Keyboard only | whole checkout completed with Tab / arrows / Enter | ✅ |
| Greyscale | errors still obvious (⚠ mark, bold text, summary box, border) | ✅ (viewed a screenshot) |

These passes found one real bug: after typing a bad value in the **last field** and clicking
**Order** once, the click was lost, because the field's error message appeared on blur, pushed the
button down, and the click landed on empty space. Fix: the button's `onMouseDown` keeps focus where
it is until the click completes (`checkout/Checkout.jsx`).

## 6. Presentation (8 minutes)

| Min | Cover |
|---|---|
| 0–1 | What it does, and who would use it |
| 1–4 | Live walkthrough: menu → dish → cart → checkout |
| 4–6 | One structural decision and why — e.g. *the cart is in a store but the form is not* |
| 6–7 | One thing that broke and how you found it — pick one **you** actually debugged. Candidates from this build: the lost click above; an inline handler defeating `React.memo`; state too high in `Menu` re-rendering the order panel |
| 7–8 | What you would do next, and questions |

Rehearse once, end to end, on the machine you will present from.
