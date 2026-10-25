// Two demo accounts so ownership checks can be tried by hand. A plain data module:
// safe to import anywhere. Real accounts and passwords arrive in Module 4.
export const DEMO_USERS = [
  { id: "abebe", name: "Abebe" },
  { id: "selam", name: "Selam" },
];

export function userName(userId) {
  return DEMO_USERS.find((u) => u.id === userId)?.name ?? "Guest";
}
