import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../theme/ThemeContext";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// A modal people can actually use:
//   ✓ rendered through a portal into #modal-root (escapes overflow / z-index traps)
//   ✓ role="dialog" + aria-modal + aria-labelledby (announced by screen readers)
//   ✓ focus moves in, is trapped while open, and returns to the opener on close
//   ✓ Escape closes; clicking the dim backdrop closes
// It is still a CHILD in the React tree: it reads context (theme, cart store)
// and its events bubble to its React parents, not to #modal-root.
function Modal({ title, children, onClose, returnFocusRef }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const openerRef = useRef(document.activeElement);
  const onCloseRef = useRef(onClose);
  const { theme } = useTheme(); // context works through a portal

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const panel = panelRef.current;
    const appRoot = document.getElementById("root");
    const opener = returnFocusRef?.current ?? openerRef.current;
    const previousOverflow = document.body.style.overflow;

    // the page underneath can't be tabbed to, clicked or read while open
    appRoot?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    panel.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      // keep Tab inside the dialog
      const focusable = [...panel.querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      appRoot?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      opener?.focus?.(); // continue from where they were
    };
  }, [returnFocusRef]);

  return createPortal(
    <div className="overlay" data-theme={theme} onClick={() => onClose()}>
      <div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={panelRef}
        // a click INSIDE must not close it (and, because React events bubble
        // through the React tree, must not reach the card that opened it)
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={() => onClose()} aria-label="Close">
          ✕
        </button>
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") ?? document.body
  );
}

export default Modal;
