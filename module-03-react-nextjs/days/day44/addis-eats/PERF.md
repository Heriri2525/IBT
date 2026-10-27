# PERF.md — Addis Eats, Day 43

Fill this in with YOUR numbers. The worked example from the slides is shown for comparison only;
do not copy it. Without a starting point you cannot tell an improvement from a different run of the same test.

## How to measure (every time, the same way)
1. `npm run perf` (= `next build && next start`). **Never** measure `npm run dev`: it is unminified and compiles on demand.
2. Chrome → open `http://localhost:3000/menu` in an **Incognito** window (extensions skew results).
3. DevTools → Lighthouse → **Mobile**, category **Performance**. Or DevTools → Network: *Slow 4G* and Performance: *CPU 4x slowdown*.
4. Run it **3 times** and write down the median.
5. `npm run measure` prints the JavaScript a route downloads (from the build output). `npm run images` lists image weights.

## How to capture the BEFORE
Do this first, before you trust any of the "after" numbers. Easiest honest way: in `app/menu/DishCard.jsx`,
temporarily swap the `<Image ... />` for the plain tag below, remove `priority` from `app/page.js` and
`app/menu/[id]/page.js`, rebuild, measure `/menu`, then undo the swap.

```jsx
// eslint-disable-next-line @next/next/no-img-element
<img src={`/dishes/${dish.slug}.jpg`} alt={dish.name} />
```
For the font: temporarily replace the `next/font` import with a `<link>` to Google Fonts in `layout.js`.
(If you cloned this repo with git, `git stash` is the cleaner way to go back and forth.)

## Results (page measured: `/menu`, Slow 4G, 4x CPU, median of 3)

| Step | LCP | CLS | INP | Page weight | What caused the change |
|---|---|---|---|---|---|
| 0. Before (plain `<img>`, `<link>` font) | ___ s | ___ | ___ ms | ___ kB | |
| 1. `<img>` → `<Image>` with `width`/`height`/`sizes` | ___ | ___ | ___ | ___ | resized + WebP/AVIF + lazy-load |
| 2. `priority` on the one hero (home page) | ___ | ___ | ___ | ___ | hero preloaded |
| 3. `next/font` instead of a link tag | ___ | ___ | ___ | ___ | no third-party request, metric-matched fallback |
| 4. Analytics script `lazyOnload` (if you added one) | ___ | ___ | ___ | ___ | |
| **After** | ___ | ___ | ___ | ___ | |

Also record the home page (`/`), because that is where the `priority` hero lives:

| Page | LCP before | LCP after |
|---|---|---|
| `/` | ___ | ___ |
| `/menu` | ___ | ___ |
| `/menu/1` | ___ | ___ |

## Waterfall: what was the biggest bar?
(Network tab, sorted by time. Which single request cost the most before? After? One or two sentences.)

> _write here_

## One thing I would fix next
> _write here_

## Reference: the worked example from the slides (not your numbers)
| Change | LCP | Page weight |
|---|---|---|
| Starting point | 6.1 s | 3.4 MB |
| img → Image with sizes | 2.9 s | 480 kB |
| priority on the hero | 2.2 s | 480 kB |
| next/font instead of a link tag | 2.0 s | 460 kB |
| Menu as a server component | 1.7 s | 390 kB |

The first change did most of the work. Measure first, then fix the biggest thing.

## Review questions (answer before you leave)
1. **Why does `next/image` require `width` and `height` when CSS controls the display size?** They are the aspect ratio. The browser reserves that space before the file arrives, so nothing jumps (CLS).
2. **What does `sizes` change, and what happens without it?** It tells the browser how wide the image will really be, so it picks a smaller file from the `srcset`. Without it the browser assumes full width and downloads the largest version.
3. **Which single image gets `priority`, and why not more?** The largest one visible without scrolling (the LCP element). It disables lazy loading and preloads the file, so several of them compete for the same bandwidth.
4. **How does `next/font` avoid invisible text and a jumping layout?** `display: "swap"` shows text at once in a fallback face, and `next/font` generates that fallback with matching metrics so the swap barely moves anything.
5. **95 on `npm run dev`: why meaningless?** The dev build is unminified and compiles on demand. Only `build` + `start` represents what users get.
6. **`NEXT_PUBLIC_TELEBIRR_KEY` holding the payment secret?** They published it. `NEXT_PUBLIC_` values are inlined into the JavaScript at build time and readable by anyone; the secret must be rotated, renamed without the prefix, and the app rebuilt.
