import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const DONE = ["delivered", "cancelled"];

// One hook, one key: every component that calls it shares ONE cache entry and ONE request per poll.
export function useOrder(id, initial) {
  return useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData: { order: initial },                       // server-rendered first paint: no spinner
    // poll every 5 s, but stop once nothing can change any more
    refreshInterval: (latest) => (DONE.includes(latest?.order?.status) ? 0 : 5000),
    // revalidateOnFocus stays at its default (true): a tab that was hidden catches up immediately
  });
}
