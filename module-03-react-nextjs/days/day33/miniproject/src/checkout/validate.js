// Pure rules for the checkout: no React, no DOM, no side effects.
// validate(form) -> { fieldName: "message" }   ({} means valid)
// The dev server (vite.config.js) imports this SAME file to re-check orders,
// because the server has the final word.

export const AREAS = ["Bole", "Kazanchis", "Megenagna", "Piassa"];
export const NOTES_MAX = 200;
export const TELEBIRR = /^(?:\+251|0)9\d{8}$/;

// "091 123-4567" -> "0911234567": fix formatting ourselves, never reject it
export function normalizePhone(phone) {
  return String(phone ?? "").replace(/[\s\-().]/g, "");
}

export function validate(form) {
  const errors = {};

  // name — we need someone to hand the order to
  if (!form.name.trim()) {
    errors.name = "Please enter your name so we know who the order is for";
  }

  // phone — empty gets its own message, wrong shape gets the expected shape
  const phone = normalizePhone(form.phone);
  if (!phone) {
    errors.phone = "Please enter your TeleBirr number";
  } else if (!TELEBIRR.test(phone)) {
    errors.phone = "Use 09... or +2519... (a TeleBirr number has 10 digits)";
  }

  // area — a select can only hold a listed value, but check anyway:
  // anything sent from a browser can be forged
  if (!AREAS.includes(form.area)) {
    errors.area = "Choose a delivery area from the list";
  }

  // notes — optional, but capped
  if (form.notes.length > NOTES_MAX) {
    errors.notes = `Notes can be up to ${NOTES_MAX} characters (you have ${form.notes.length})`;
  }

  return errors;
}
