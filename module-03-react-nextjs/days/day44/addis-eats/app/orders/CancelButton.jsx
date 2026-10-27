"use client";

import { useState, useTransition } from "react";
import { cancelOrder } from "../actions";

// Client leaf: needs state and a click handler. The action is IMPORTED from a "use server"
// file (not passed down as a prop), which is how a function may reach the browser.
export default function CancelButton({ orderId }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);

  function onClick() {
    startTransition(async () => {
      const result = await cancelOrder(orderId);
      setMessage(result?.error ?? null);
    });
  }

  return (
    <div style={{ marginTop: ".75rem" }}>
      <button className="btn alt" onClick={onClick} disabled={pending}>
        {pending ? "Cancelling…" : "Cancel order"}
      </button>
      {message && <p className="error" role="alert">{message}</p>}
    </div>
  );
}
