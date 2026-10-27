// Everything under /checkout is rendered fresh on every request.
//
// WHY: page.js reads cookies() — the `session` cookie (who is asking) and the `cart`
// cookie (what they are ordering). That request-time read is what makes this route
// dynamic; `force-dynamic` states the intent for the whole segment.
export const dynamic = "force-dynamic";

export default function CheckoutLayout({ children }) {
  return <div>{children}</div>;
}
