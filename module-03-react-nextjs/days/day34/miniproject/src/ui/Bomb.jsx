// Throws while rendering — the reliable way to see a boundary's fallback.
export default function Bomb({ label = "component" }) {
  throw new Error(`${label} crashed on purpose (boundary test)`);
}
