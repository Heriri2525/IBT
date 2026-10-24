// placeOrder: POST the order.
//   success            -> { ok: true,  order }
//   422 (server rules) -> { ok: false, fieldErrors: { phone: "..." } }
//   anything else      -> throws Error(message the person can read)
export async function placeOrder(order, { fail = false } = {}) {
  let response;
  try {
    response = await fetch(`/api/orders${fail ? "?fail=1" : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
  } catch {
    throw new Error(
      "We couldn't reach Addis Eats. Check your connection and try again."
    );
  }

  if (response.status === 422) {
    const { fieldErrors } = await response.json();
    return { ok: false, fieldErrors };
  }

  if (!response.ok) {
    throw new Error(
      "Something went wrong on our side and your order was not placed. Your details are still here — please try again."
    );
  }

  return { ok: true, order: await response.json() };
}
