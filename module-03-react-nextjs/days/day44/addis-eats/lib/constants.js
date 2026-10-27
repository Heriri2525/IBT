// Plain constants with NO imports, so a client component (the checkout form) can use
// them without dragging zod into the browser bundle. lib/schema.js builds on these.
export const DELIVERY_AREAS = ["Bole", "Kazanchis", "Piassa", "Megenagna", "CMC"];
export const PHONE_PATTERN = /^(09\d{8}|\+2519\d{8})$/;
export const PHONE_HINT = "Use 09... or +2519...";
