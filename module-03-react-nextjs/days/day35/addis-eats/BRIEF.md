# BRIEF — Addis Eats (Day 35 mini-project)

Build **Addis Eats**: a food-ordering frontend for Addis Ababa. Browse a menu loaded from an API,
filter by category, open any dish on its own page, build an order, and check out through a
validated form.

## Screens

| Screen | Route | What it does |
|---|---|---|
| Home | `/` | Today's specials, link into the menu |
| Menu | `/menu` | Fetched dishes, category filter in the URL |
| Dish | `/menu/:id` | One dish, with an add-to-order action |
| Cart | `/cart` | Order lines and the running ETB total |
| Checkout | `/checkout` | Validated form, guarded by sign-in |
| Not found | `*` | A useful message and a way back |

## Required features

| From day | Must appear in the build |
|---|---|
| 26–27 | Composed components, props, keys, conditional rendering |
| 28 | State and events, and a controlled form |
| 29 | Data fetched in an effect, with cleanup on unmount |
| 30 | A custom hook, and context or a store |
| 31 | Nested routes, a dynamic route and a guarded route |
| 33–34 | Validation, an error boundary and one lazy-loaded route |

## Requirements checklist

- [ ] All six routes working, including the catch-all, each loading cold from the address bar
- [ ] Menu fetched, with loading, error and empty states all visible on screen
- [ ] Category filter in the query string; dynamic dish route reading its parameter
- [ ] Cart readable from at least two screens; checkout form with validation and touched tracking
- [ ] Guarded checkout; an error boundary around at least one region; one lazy-loaded route
- [ ] Readable commit history and a README explaining how to run it

## Definition of done

| Not done | Done |
|---|---|
| Works when you click carefully | Works when a stranger uses it |
| Blank screen while loading | Loading, empty and error states shown |
| Console full of warnings | A clean console |
| One giant commit | A history someone can read |
| Runs on your machine | Runs from a fresh clone and install |

## How it is marked

| Criterion | Weight |
|---|---|
| Required features working end to end | 40% |
| Component structure and state placement | 20% |
| Handling of loading, empty and error states | 15% |
| Code quality, naming and commit history | 15% |
| Presentation and walkthrough | 10% |
