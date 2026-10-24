import { Link } from "react-router-dom";
import { useCartStore, selectTotal } from "../cart/cartStore";
import { logRender } from "../hooks/logRender";

// A compact order summary that sits beside the menu.
function CartPanel() {
  logRender("CartPanel");
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);

  return (
    <section className="cart-panel" aria-label="Your order">
      <h3>Your order</h3>
      {items.length === 0 ? (
        <p className="category">Nothing yet — add a dish.</p>
      ) : (
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.id} className="cart-row">
              <span>
                {item.name} × {item.qty}
              </span>
              <strong>{item.price * item.qty} ETB</strong>
            </li>
          ))}
        </ul>
      )}
      <p className="panel-total">Total: {total} ETB</p>
      <Link to="/cart" className="details-link">
        View cart
      </Link>{" "}
      <Link to="/checkout" className="details-link">
        Checkout
      </Link>
    </section>
  );
}

export default CartPanel;
