// Renders its children in `npm run dev` only. Used for the test switches
// (break a dish, simulate a server failure) so a production build — what a
// stranger would use — never shows them.
export default function DevOnly({ children }) {
  return import.meta.env.DEV ? children : null;
}
