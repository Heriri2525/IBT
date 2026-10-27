"use client";

import { useCallback } from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher, retryOnlyServerErrors } from "@/lib/fetcher";
import CancelButton from "./CancelButton";

const POLL_MS = 5000;

// DAY 45 — THE ONE POLLED QUERY.
// The server already read the session and built `initialOrders` (listOrdersFor(user.id)), so the
// first paint has data and nobody watches a spinner. SWR then keeps it fresh by asking the same
// session-scoped endpoint, GET /api/orders. There is no id in the key: the server decides whose
// orders these are, so there is nothing here for an attacker to change.
export default function LiveOrders({ initialOrders }) {
  // Polling stops by itself once nothing can change: an order is "placed" until the kitchen
  // marks it ready or the customer cancels it. `data` is undefined until the first poll lands,
  // so the seed answers the question until then.
  const interval = useCallback(
    (latest) => ((latest ?? initialOrders).some((o) => o.status === "placed") ? POLL_MS : 0),
    [initialOrders],
  );

  const { data, error, mutate } = useSWR("/api/orders", fetcher, {
    fallbackData: initialOrders, // the seed: renders on the server and on the first client paint
    revalidateOnMount: false, // the server rendered this a moment ago; do not ask again at once
    refreshInterval: interval, // paused automatically while the tab is hidden (refreshWhenHidden is false)
    onErrorRetry: retryOnlyServerErrors,
  });

  const orders = data ?? initialOrders;
  const signedOut = error?.status === 401;

  if (orders.length === 0) {
    return <p className="muted">No orders yet. <Link href="/menu">Browse the menu</Link></p>;
  }

  return (
    <>
      {/* aria-live: a screen reader hears "ready" when the status changes, without a page reload */}
      <p className="muted live-note" aria-live="polite">
        {signedOut
          ? <>Your session has ended. <Link href="/signin?next=/orders">Sign in again</Link> to see updates.</>
          : error
            ? "Live updates paused: could not reach the server."
            : orders.some((o) => o.status === "placed")
              ? "Live: statuses refresh every few seconds."
              : "All orders are finished, so updates have stopped."}
      </p>
      <ul className="grid">
        {orders.map((o) => (
          <li key={o.id} className="card">
            <h2>{o.id} · <span data-testid={`status-${o.id}`} className={`status status-${o.status}`}>{o.status}</span></h2>
            <p className="muted">{o.area}</p>
            <p style={{ margin: ".5rem 0" }}>
              {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
            </p>
            <p className="price">{o.total} {o.currency}</p>
            {/* After a cancel, refetch now instead of waiting for the next tick. The server
                action re-checks the session and the owner itself; this only refreshes the screen. */}
            {o.status === "placed" && <CancelButton orderId={o.id} onDone={() => mutate()} />}
          </li>
        ))}
      </ul>
    </>
  );
}
