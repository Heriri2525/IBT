import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore, selectTotal } from "../cart/cartStore";
import { useAuth } from "../auth/useAuth";
import { placeOrder } from "../api/orders";
import Field from "./Field";
import DevOnly from "../ui/DevOnly";
import { AREAS, NOTES_MAX, normalizePhone, validate } from "./validate";

const FIELDS = ["name", "phone", "area", "notes"];

function Checkout() {
  // cart: narrow selectors
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);
  const clear = useCartStore((s) => s.clear);

  const { user } = useAuth();
  const navigate = useNavigate();

  // ── one state object for every field, one change handler ─────────────
  const [form, setForm] = useState({
    name: "",
    phone: user?.phone ?? "",
    area: "Bole",
    notes: "",
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false); // tried to submit at least once
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({}); // from a 422
  const [serverMessage, setServerMessage] = useState(null); // network / 500
  const [simulateFail, setSimulateFail] = useState(false);

  // a ref guard too: it flips instantly, state flips on the next render
  const inFlight = useRef(false);
  const bannerRef = useRef(null);

  // ── errors are DERIVED on every render, never stored ─────────────────
  const errors = validate(form);
  const errorCount = Object.keys(errors).length;

  // show a client error only once the field is touched (or after a submit
  // attempt) — and because it's derived, it clears the moment it's fixed
  const clientError = (field) =>
    (touched[field] || submitted) && errors[field] ? errors[field] : null;
  const shownError = (field) => clientError(field) ?? serverErrors[field] ?? null;

  // move focus to the failure banner when a general failure appears
  useEffect(() => {
    if (serverMessage) bannerRef.current?.focus();
  }, [serverMessage]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value })); // updater form: latest state
    // the person is correcting this field: drop what the server said about it
    setServerErrors((s) => (s[name] ? { ...s, [name]: undefined } : s));
    setServerMessage(null);
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function focusField(field) {
    document.getElementById(field)?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault(); // no page reload
    if (inFlight.current) return; // no double order

    setSubmitted(true);

    // invalid: land the person on the first problem, send nothing
    const firstError = FIELDS.find((f) => errors[f]);
    if (firstError) {
      focusField(firstError);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setServerMessage(null);
    setServerErrors({});

    try {
      const result = await placeOrder(
        {
          name: form.name.trim(),
          phone: normalizePhone(form.phone),
          area: form.area,
          notes: form.notes.trim(),
          items,
          total,
        },
        { fail: simulateFail }
      );

      if (!result.ok) {
        // the server has the final word: show its messages beside the fields
        setServerErrors(result.fieldErrors);
        const firstBad = FIELDS.find((f) => result.fieldErrors[f]);
        if (firstBad) focusField(firstBad);
        return;
      }

      navigate(`/orders/${result.order.id}`, {
        replace: true, // Back must not return to the checkout form
        state: {
          order: {
            id: result.order.id,
            name: form.name.trim(),
            address: form.area,
            notes: form.notes.trim(),
            phone: normalizePhone(form.phone),
            items,
            total,
          },
        },
      });
      clear();
    } catch (err) {
      // failed: say why — and keep EVERY value in the form
      setServerMessage(err.message);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="page">
        <div className="empty-message">
          <p>Your cart is empty — nothing to check out.</p>
          <Link to="/menu" className="cta">
            Browse the menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <form className="order-form" onSubmit={handleSubmit} noValidate>
        <h2>Delivery details</h2>

        {/* summary: how much is left, with a link to each field */}
        {submitted && errorCount > 0 && (
          <div role="alert" className="summary">
            <p>
              Please fix {errorCount} {errorCount === 1 ? "field" : "fields"}:
            </p>
            <ul>
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <a
                    href={`#${field}`}
                    onClick={(e) => {
                      e.preventDefault();
                      focusField(field);
                    }}
                  >
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* failed state: why, with every value still in the form */}
        {serverMessage && (
          <div role="alert" className="submit-error" tabIndex={-1} ref={bannerRef}>
            <span aria-hidden="true">⚠ </span>
            {serverMessage}
          </div>
        )}

        <Field
          id="name"
          label="Full name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shownError("name")}
        />

        <Field
          id="phone"
          label="TeleBirr number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="For example 0911234567 or +251911234567"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shownError("phone")}
        />

        <Field
          id="area"
          as="select"
          label="Delivery area"
          value={form.area}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shownError("area")}
        >
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Field>

        <Field
          id="notes"
          as="textarea"
          rows={3}
          label="Notes for the kitchen (optional)"
          hint={`${form.notes.length}/${NOTES_MAX} characters`}
          value={form.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shownError("notes")}
        />

        <DevOnly>
          <label className="sim-error">
            <input
              type="checkbox"
              checked={simulateFail}
              onChange={(e) => setSimulateFail(e.target.checked)}
            />{" "}
            Simulate a server failure (dev only)
          </label>
        </DevOnly>

        <button
          className="pay-button"
          type="submit"
          disabled={submitting}
          // Without this, pressing the button first BLURS the last field, its
          // error message appears and pushes the button down, and the click
          // lands on empty space (the person has to click twice). Keeping
          // focus where it is until the click completes avoids the layout shift.
          onMouseDown={(e) => e.preventDefault()}
        >
          {submitting ? "Sending your order..." : `Order — ${total} ETB`}
        </button>
      </form>
    </main>
  );
}

export default Checkout;
