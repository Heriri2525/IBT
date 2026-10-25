"use client";

import { useRouter } from "next/navigation";

// Client component: programmatic navigation with useRouter().push.
export default function CheckoutButton() {
  const router = useRouter();
  return (
    <button className="btn" onClick={() => router.push("/checkout")}>
      Proceed to checkout
    </button>
  );
}
