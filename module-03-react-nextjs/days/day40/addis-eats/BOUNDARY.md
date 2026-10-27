# BOUNDARY.md — what runs where

7 files carry `"use client"` (search: `grep -rl '^"use client"' app components lib`).
Every one is an interactive leaf, the provider, or the error boundary.

| Component / file | Runs on | Why |
|---|---|---|
| `app/layout.js` | Server | Owns `<html>`/`<body>`; imports only `Providers` and passes `{children}` in. |
| `app/providers.jsx` | **Client** | Context holds cart state → needs hooks. |
| `app/page.js` | Server | Awaits specials; no interactivity. |
| `app/menu/layout.js` | Server | Markup + passes plain strings to `CategoryBar`. |
| `app/menu/CategoryBar.jsx` | **Client** | Remembers the selected category, handles clicks. |
| `app/menu/FilterShell.jsx` | **Client** | Reads the selected category; wraps server content received as `children`. |
| `app/menu/page.js` | Server | `async`, awaits dishes, no hooks. |
| `app/menu/DishList.jsx` | Server | Markup from data — ships **no** JS (proof below). |
| `components/DishCard.jsx` | Server | Pure markup, shared by `/` and `/menu`. |
| `app/menu/[id]/page.js` | Server | `async`; `Promise.all` for dish + reviews; `notFound()`. |
| `components/AddToCartButton.jsx` | **Client** | `onClick`, writes to the cart store. Receives just a number. |
| `app/menu/error.js` | **Client** | Error boundaries hold state and get `{error, reset}`; React only mounts a boundary from a client component. |
| `app/menu/loading.js`, `not-found.js` | Server | Static markup. |
| `app/cart/page.js` | Server | Loads dishes, passes the plain array to the client panel. |
| `app/cart/CartPanel.jsx` | **Client** | Cart lines, quantity buttons, `useRouter().push`. |
| `app/checkout/page.js` | Server | Reads cookies + searchParams, shows summary and orders; forms for sign-in/cancel/sign-out use server actions directly (no JS needed). |
| `app/checkout/CheckoutForm.jsx` | **Client** | `useActionState` to show field errors from the server action. |
| `components/Field.jsx` | Imported by the client form | Plain markup with aria wiring. |
| `app/actions.js` | Server (`"use server"`) | Sign-in, place order, cancel order. |
| `lib/*`, `app/api/**` | Server (shared pure code is also imported by client for pricing only) | Data, validation, session, orders store. |

**Client shells wrapping server content (built with `children`, not import):**
`Providers` ⟵ every page · `FilterShell` ⟵ `DishList`.

**Proof the menu cards ship no JS:** the strings `Doro Wat`, `🌶` and a dish description appear in **0** files under `.next/static` (the browser bundle); the dishes reach the browser only as HTML.

**No callbacks cross the boundary:** props passed server → client are strings, numbers and plain arrays (`categories`, `dishId`, `dishes`, `areas`, `defaultName`).
