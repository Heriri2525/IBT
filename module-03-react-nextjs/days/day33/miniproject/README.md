# Addis Eats — Day 33: The Checkout (forms & controlled components)

Day 32's app (routes + Zustand cart) with a finished checkout form.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # cart store + validate() — no React involved
```

Sign in with any phone like `0912345678`, add dishes, open **Checkout**.

Things to try (the dev server fakes the order API):
- `0900000000` as the phone → server answers **422** "not registered with TeleBirr"
- tick **Simulate a server failure** → **500**; every value stays in the form
- press **Order** twice quickly → only one order is sent

## Files

| File | Job |
|---|---|
| `src/checkout/Checkout.jsx` | form state, touched, submit, all six states |
| `src/checkout/validate.js` | pure `validate(form)` → errors object (also reused by the dev server) |
| `src/checkout/Field.jsx` | label + control + hint + message, aria wiring done once |
| `src/api/orders.js` | `placeOrder` — returns field errors on a 422, throws a readable message otherwise |
| `homework/CheckoutRHF.jsx` | the same form with React Hook Form (not wired in) |

## Validation rules and why each exists

| Field | Rule | Why |
|---|---|---|
| name | required (spaces don't count) | the kitchen needs someone to hand the order to |
| phone | strip spaces/dashes first, then `09…` or `+2519…` (10 digits) | TeleBirr numbers come in both shapes; we fix formatting instead of rejecting it. Empty and wrong-shape get different messages |
| area | must be Bole, Kazanchis, Megenagna or Piassa | the only areas we deliver to — checked even though a select can't hold anything else, because requests can be forged |
| notes | optional, max 200 characters | keeps tickets readable; the counter shows how much is left |
| (server) | all of the above again, plus "number registered with TeleBirr" | client validation is a courtesy; the server has the final word |

## The six states

| State | What the person sees |
|---|---|
| pristine | no errors until they've visited a field |
| dirty | their input, exactly as typed |
| invalid | message beside the field (text + ⚠ mark), a summary "Please fix N fields", focus on the first bad field |
| submitting | button disabled, label "Sending your order..." (a ref guard + disabled button stop a second send) |
| failed | the reason in an alert banner (or beside the field on a 422); **every value kept**; focus moves to the problem |
| succeeded | redirect to the receipt with `replace: true`, cart cleared |

## Timing

Errors are **derived** on every render (`validate(form)`), never stored. A field shows its
error once it has been **touched** (blurred) or after a submit attempt; because it's derived,
the message disappears the moment the value is fixed.

## Accessibility

Real `<label htmlFor>` on every field · `aria-invalid` · `aria-describedby` (hint + message) ·
`role="alert"` on messages · not colour alone: text + ⚠ mark + thick border · focus moved to the
first invalid field · `onSubmit` on the form, so Enter works · visible focus outline.
