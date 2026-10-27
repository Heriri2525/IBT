"use client";

import { useActionState } from "react";
import { placeOrder } from "@/app/actions";
import Field from "@/components/Field";

// Client leaf: useActionState shows the server's field errors beside each field.
// The <form action> still works with JavaScript disabled (progressive enhancement).
export default function CheckoutForm({ defaultName, areas, notesMax }) {
  const [state, formAction, pending] = useActionState(placeOrder, {});
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};
  return (
    <form action={formAction} className="card" noValidate>
      <h2 style={{ fontWeight: 700, marginBottom: ".75rem" }}>Delivery details</h2>
      {state.error && <p className="banner" role="alert">{state.error}</p>}
      <Field id="name" label="Name" error={e.name} defaultValue={v.name ?? defaultName} autoComplete="name" />
      <Field id="phone" label="TeleBirr number" type="tel" error={e.phone} defaultValue={v.phone ?? ""}
        hint="09… or +2519…" autoComplete="tel" />
      <Field id="area" label="Delivery area" as="select" error={e.area} defaultValue={v.area ?? areas[0]}>
        {areas.map((a) => <option key={a} value={a}>{a}</option>)}
      </Field>
      <Field id="notes" label="Notes (optional)" as="textarea" rows={3} error={e.notes} defaultValue={v.notes ?? ""}
        hint={`Up to ${notesMax} characters`} />
      <button className="btn" type="submit" disabled={pending}>{pending ? "Placing order…" : "Place order"}</button>
    </form>
  );
}
