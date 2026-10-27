// One field = label + control + hint + message, with the aria wiring done once
// (carried over from Day 35). Plain markup — no hooks, no directive of its own.
export default function Field({ id, label, error, hint, as: Control = "input", children, ...props }) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={error ? "form-group invalid" : "form-group"}>
      <label htmlFor={id}>{label}</label>
      <Control id={id} name={id} aria-invalid={!!error} aria-describedby={describedBy} {...props}>
        {children}
      </Control>
      {hint && <p id={hintId} className="hint">{hint}</p>}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          <span aria-hidden="true">⚠ </span>{error}
        </p>
      )}
    </div>
  );
}
