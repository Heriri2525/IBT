"use client";

import { useOrder } from "./useOrder";
import { STEPS } from "@/lib/order-steps";

// Compact chip in the page heading. Same key as <OrderStatus/> => no extra request.
export function OrderBadge({ id, initial }) {
  const { data } = useOrder(id, initial);
  return <span className="tag" data-testid="badge">{data.order.status}</span>;
}

export default function OrderStatus({ id, initial }) {
  const { data, error, isValidating } = useOrder(id, initial);
  const order = data.order;
  const at = STEPS.indexOf(order.status);

  return (
    <div>
      {error && <p className="banner" role="alert">Couldn’t refresh the status ({error.message}). Showing the last known state.</p>}
      {order.status === "cancelled" ? (
        <p className="banner" data-testid="status">Status: cancelled</p>
      ) : (
        <ol className="steps" data-testid="steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i < at ? "done" : i === at ? "now" : ""} aria-current={i === at ? "step" : undefined}>{s}</li>
          ))}
        </ol>
      )}
      <p className="muted" aria-live="polite">{isValidating ? "Refreshing…" : "Up to date"}</p>
      <ul className="lines">
        {order.lines.map((l) => (
          <li key={l.id} className="line"><span>{l.name} × {l.qty}</span><strong>{l.lineTotal} ETB</strong></li>
        ))}
      </ul>
      <p><strong>Total: {order.total} ETB</strong> · delivering to {order.customer.area}</p>
    </div>
  );
}
