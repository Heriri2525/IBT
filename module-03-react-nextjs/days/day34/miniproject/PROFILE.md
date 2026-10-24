# PROFILE.md — Day 34: profiling and fixing re-renders

## What I recorded

One scripted session on `/menu`, repeated 5 times (median reported):

1. type `doro` in the search box (4 keystrokes), then clear it
2. click the **Breakfast** chip, then the **Vegetarian** chip
3. add 3 dishes to the order

Method: React's `<Profiler>` API (the same data the DevTools Profiler shows) via
`src/ui/DevProfiler.jsx`, plus `logRender("Name")` counters. Headless Chromium, **dev build,
CPU throttled 6×** to mimic a phone. React StrictMode double-renders in dev, so render
counts below are halved to real renders. Read them yourself with
`console.table(window.__renders)` and `console.table(window.__profile)`.

## Slowest component

`DishList` (≈185 ms of throttled render time across the session). It is legitimately
re-rendered — its dishes change on every filter or category change — and `Dish` is already
`React.memo`'d, so I left it alone. With 12 dishes there is nothing to virtualise.

## Unnecessary re-renders found

Asking "why did this render?" on the first version:

| Component | Renders | Needed | Why it rendered |
|---|---|---|---|
| `CartPanel` | **12** | 3 (one per dish added) | its **parent re-rendered**: `Menu` owned the search text, the category and the fetch, so *every keystroke and category change re-rendered the page and the order panel beside it* |
| `CategoryBar` | **9** | 2 (one per category click) | a **handler recreated each render**: `onChange={(cat) => …}` was a new function every time, so its `React.memo` could never skip |

## Fixes (cheapest first, measured one at a time)

1. **Move state down.** The category, search text and fetch moved from the page into a new
   `MenuBrowser` component. `Menu` is now just a frame holding two test switches, and
   `CartPanel` is its sibling, so typing can't reach it.
2. **`useCallback` for `CategoryBar`'s `onChange`**, because `CategoryBar` is memoised and the
   handler was the only thing changing.

## Before and after

| Component | Before | After fix 1 | After fix 2 |
|---|---|---|---|
| `Menu` (page) | 9 | 0 | 0 |
| `CartPanel` renders | 12 | **3** | 3 |
| `CategoryBar` renders | 9 | 9 | **2** |
| `SearchBox`, `DishList`, `Dish` | 9 · 6 · 14 | same | same (all needed) |
| `CartPanel` Profiler time (6× CPU) | 56.7 ms | 34.2 ms | 27.2 ms |
| `DishList` Profiler time (6× CPU) | 185.2 ms | 153.2 ms | 157.5 ms |

## Honest reading

- The **render counts** are exact and repeatable: 9 wasted `CartPanel` renders and 7 wasted
  `CategoryBar` renders are gone.
- The **milliseconds** are small and noisy (and `DishList`, which I did not change, moved
  by ~15% from run-to-run variation alone). With 12 dishes none of this was ever *slow*;
  the point of the exercise is removing causes, and the fixes are free and permanent.
  The same mistakes in a 500-row screen would matter.
- I kept both fixes because each has a measured cause. Nothing was memoised "just in case".
- These numbers come from my machine. Please record your own session in React DevTools →
  Profiler (profile a production build, CPU throttled) and replace or confirm them here.
