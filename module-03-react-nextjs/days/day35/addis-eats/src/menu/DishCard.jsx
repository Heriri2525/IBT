import { lazy, memo, Suspense, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ErrorBoundary from "../ui/ErrorBoundary";
import { useCartStore } from "../cart/cartStore";

// Rarely opened UI -> split into its own chunk, downloaded on first open.
const Modal = lazy(() => import("../ui/Modal"));

function DishCard({ dish, onAdd }) {
  const { name, price, category, spicy, slug, description } = dish;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const addItem = useCartStore((s) => s.addItem);

  // a dish that arrives without a price throws HERE, during render —
  // exactly what an error boundary exists for
  const priceLabel = `${price.toLocaleString("en-US")} ETB`;

  return (
    <div className="dish">
      <h3>
        <Link to={`/menu/${slug}`} className="dish-link">
          {name}
        </Link>
      </h3>
      <p className="category">{category}</p>
      {spicy && <span className="spicy-badge">🌶️ Spicy</span>}
      <strong>{priceLabel}</strong>
      <div>
        <Link to={`/menu/${slug}`} className="details-link">
          View details
        </Link>
      </div>
      <div className="dish-actions">
        <button
          ref={triggerRef}
          className="quick-view"
          aria-haspopup="dialog"
          aria-label={`Quick view of ${name}`}
          onClick={() => setOpen(true)}
        >
          Quick view
        </button>
        <button className="add-button" onClick={() => onAdd(dish)}>
          Add to order
        </button>
      </div>

      {open && (
        // chunk failed to download -> say so, instead of a click that does nothing
        <ErrorBoundary
          name="dish-modal"
          fallback={({ reset }) => (
            <p className="field-error" role="alert">
              Couldn’t open the preview.{" "}
              <button
                className="link-button"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
              >
                Dismiss
              </button>
            </p>
          )}
        >
          <Suspense fallback={null}>
            <Modal title={name} onClose={() => setOpen(false)} returnFocusRef={triggerRef}>
              <p className="category">
                {category} {spicy && "· 🌶️ Spicy"}
              </p>
              <p className="description">{description}</p>
              <p className="price">{priceLabel}</p>
              <div className="modal-actions">
                <button
                  className="add-button"
                  onClick={() => {
                    addItem(dish); // context/store still work through the portal
                    setOpen(false);
                  }}
                >
                  Add to order
                </button>
                <Link to={`/menu/${slug}`} className="details-link">
                  Full page
                </Link>
              </div>
            </Modal>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default memo(DishCard);
