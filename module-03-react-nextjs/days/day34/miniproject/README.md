# Addis Eats — Day 34: Hardened (boundaries, lazy loading, performance, portals)

Day 33's app, made to survive failures, load less up front, and render a proper modal.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 17 tests (cart store + validate)
npm run build      # then: npm run preview   (to see real chunks)
```

## Error boundaries

`src/ErrorBoundary.jsx` — the one class you still write. Props: `fallback` (element, or
`({ error, reset }) => element`), `name` (for the log), `resetKeys` (try again when these change).
Errors are reported through `src/logError.js` (swap in Sentry there).

| Boundary | Wraps | If it fails… |
|---|---|---|
| App (`App.jsx`) | everything | `AppCrashed`: last resort, plain reload link |
| Page (`ui/RouteShell.jsx`) | each routed page, `key` = pathname | header + nav stay; navigating away recovers |
| Menu (`pages/Menu.jsx`) | the menu region | `MenuUnavailable` with *Try again* |
| Dish list (`components/MenuBrowser.jsx`) | just the list | controls stay; resets when category or search changes |
| Order panel (`pages/Menu.jsx`) | the order panel, **separately** | `CartUnavailable`; the menu keeps working |
| Quick-view modal (`components/Dish.jsx`) | the lazy modal | "Couldn't open the preview" instead of a dead click |

**Try it:** on `/menu`, open *Test the error boundaries* and tick **Break one dish** (the first
dish arrives without a price, so `price.toLocaleString()` throws during render) or **Break the
order panel**. The rest of the screen keeps working.

**What they do not catch:** event handlers, async code and promises, and errors in the
boundary itself. Those use `try/catch` and the Day 29 / Day 33 error states (see the failed
order and *Simulate server error* paths, which still work).

## Code splitting

- `lazy()` routes in `App.jsx`: **Checkout** and **OrderReceipt**.
- `Modal` is lazy too (rarely opened UI) — downloaded the first time someone opens Quick view.
- The `<Suspense>` + skeleton lives in `ui/RouteShell.jsx`, *inside* the Layout, so the header
  stays on screen while a chunk downloads. Boundary outside, Suspense inside: a chunk that
  fails to download is a render error, so the boundary catches it (with a *Reload* button,
  because React caches a rejected `lazy` import).
- Home and Menu are **not** split: they are the screens people arrive on.

### Reading the bundle (production build)

| Chunk | Size | gzip | In the first download? |
|---|---|---|---|
| `index-*.js` | 273.2 kB | 86.5 kB | yes — React, React Router, Zustand and the app shell: nothing of ours worth splitting |
| `Checkout-*.js` | 4.8 kB | 2.3 kB | no — on demand |
| `Modal-*.js` | 1.6 kB | 0.8 kB | no — on demand |
| `OrderReceipt-*.js` | 0.9 kB | 0.5 kB | no — on demand |

Honest verdict: the three lazy chunks total ~7 kB, so by the sheet's own rule ("split where the
saving is tens of kilobytes") they are practice, not a measurable win. The pattern pays off the
moment a heavy library (a chart, a map) lands on one screen.

## Performance

See **PROFILE.md**: a profiled session found two wasted-render causes (state living too high,
and an inline handler defeating `React.memo`); both fixed and re-measured.

## Portals — `src/ui/Modal.jsx`

`createPortal` into `<div id="modal-root">` (in `index.html`, outside `#root`), so the card's
`overflow: hidden` can't clip it.

- `role="dialog"`, `aria-modal`, `aria-labelledby` the title
- focus moves in, **Tab / Shift+Tab are trapped**, the page underneath is `inert`, scroll locked
- **Escape** closes, backdrop click closes, **focus returns** to the Quick view button
- still a React child: it reads the theme context and the cart store, and click events bubble
  through the React tree (the panel stops propagation so a click inside doesn't close it or
  reach the card)

## Not browser-tested

The generic *Try again* branch of the page-level fallback and the last-resort `AppCrashed`
screen: the chunk-failure branch was tested, but I had no clean way to force a render error
there. Throw `<Bomb />` (`src/ui/Bomb.jsx`) inside a page or a provider to see them.
