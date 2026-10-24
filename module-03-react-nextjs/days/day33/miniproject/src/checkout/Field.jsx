// One field = label + control + hint + message, with the aria wiring done once.
//   htmlFor/id        -> label is connected to the input (bigger tap target too)
//   aria-invalid      -> marks the field as wrong
//   aria-describedby  -> ties the hint and the message to the field
//   role="alert"      -> a screen reader announces the message
// Colour is never the only signal: the message is text, and carries a ⚠ mark.
function Field({ id, label, error, hint, as: Control = "input", children, ...props }) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={error ? "form-group invalid" : "form-group"}>
      <label htmlFor={id}>{label}</label>

      <Control
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Control>

      {hint && (
        <p id={hintId} className="hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="field-error" role="alert">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </div>
  );
}

export default Field;
