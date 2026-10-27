// ONE schema for every caller: the checkout form's server action AND POST /api/orders.
// Carried over from Day 35 (src/checkout/validate.js) — same rules, same messages.
// validateOrder(input) -> { ok, values, fieldErrors }

export const AREAS = ["Bole", "Kazanchis", "Megenagna", "Piassa"];
export const NOTES_MAX = 200;
export const TELEBIRR = /^(?:\+251|0)9\d{8}$/;

// "091 123-4567" -> "0911234567": fix formatting ourselves, never reject it
export function normalizePhone(phone) {
  return String(phone ?? "").replace(/[\s\-().]/g, "");
}

export function validateOrder(input) {
  const src = input && typeof input === "object" ? input : {};
  const values = {
    name: String(src.name ?? "").trim(),
    phone: normalizePhone(src.phone),
    area: String(src.area ?? ""),
    notes: String(src.notes ?? "").trim(),
  };
  const fieldErrors = {};

  if (!values.name) {
    fieldErrors.name = "Please enter your name so we know who the order is for";
  } else if (values.name.length > 60) {
    fieldErrors.name = "Name can be up to 60 characters";
  }

  if (!values.phone) {
    fieldErrors.phone = "Please enter your TeleBirr number";
  } else if (!TELEBIRR.test(values.phone)) {
    fieldErrors.phone = "Use 09... or +2519... (a TeleBirr number has 10 digits)";
  }

  // anything sent from a browser can be forged — check the select value too
  if (!AREAS.includes(values.area)) {
    fieldErrors.area = "Choose a delivery area from the list";
  }

  if (values.notes.length > NOTES_MAX) {
    fieldErrors.notes = `Notes can be up to ${NOTES_MAX} characters (you have ${values.notes.length})`;
  }

  return { ok: Object.keys(fieldErrors).length === 0, values, fieldErrors };
}
