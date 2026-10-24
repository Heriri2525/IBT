// HOMEWORK — "Rebuild it with the library". NOT wired into the app.
// To try it: npm i react-hook-form, then point the /checkout route at this file.
// Compare line for line with src/checkout/Checkout.jsx.
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCartStore, selectTotal } from "../src/cart/cartStore";
import { useAuth } from "../src/auth/useAuth";
import { placeOrder } from "../src/api/orders";
import Field from "../src/checkout/Field";
import { AREAS, NOTES_MAX, TELEBIRR, normalizePhone } from "../src/checkout/validate";

export default function CheckoutRHF() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);
  const clear = useCartStore((s) => s.clear);
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched", // validate on blur, then live — the same timing as by hand
    defaultValues: { name: "", phone: user?.phone ?? "", area: "Bole", notes: "" },
  });

  async function onSubmit(values) {
    // handleSubmit only calls this when the form is valid, and sets
    // isSubmitting for us (and blocks double-submits while this is pending)
    try {
      const result = await placeOrder({
        ...values,
        phone: normalizePhone(values.phone),
        items,
        total,
      });
      if (!result.ok) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field, { message }, { shouldFocus: true });
        }
        return;
      }
      navigate(`/orders/${result.order.id}`, {
        replace: true,
        state: { order: { ...values, id: result.order.id, address: values.area, items, total } },
      });
      clear();
    } catch (err) {
      setError("root.server", { message: err.message });
    }
  }

  return (
    <main className="page">
      <form className="order-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Delivery details</h2>

        {errors.root?.server && (
          <div role="alert" className="submit-error">
            ⚠ {errors.root.server.message}
          </div>
        )}

        <Field
          id="name"
          label="Full name"
          error={errors.name?.message}
          {...register("name", { required: "Please enter your name so we know who the order is for" })}
        />

        <Field
          id="phone"
          label="TeleBirr number"
          type="tel"
          error={errors.phone?.message}
          {...register("phone", {
            required: "Please enter your TeleBirr number",
            setValueAs: normalizePhone, // strip spaces before testing
            pattern: { value: TELEBIRR, message: "Use 09... or +2519... (a TeleBirr number has 10 digits)" },
          })}
        />

        <Field id="area" as="select" label="Delivery area" error={errors.area?.message} {...register("area")}>
          {AREAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </Field>

        <Field
          id="notes"
          as="textarea"
          rows={3}
          label="Notes for the kitchen (optional)"
          hint={`${watch("notes").length}/${NOTES_MAX} characters`}
          error={errors.notes?.message}
          {...register("notes", { maxLength: { value: NOTES_MAX, message: `Notes can be up to ${NOTES_MAX} characters` } })}
        />

        <button className="pay-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending your order..." : `Order — ${total} ETB`}
        </button>
      </form>
    </main>
  );
}
