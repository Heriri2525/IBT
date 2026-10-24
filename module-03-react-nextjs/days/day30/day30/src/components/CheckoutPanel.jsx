import { useContext, useState } from "react";
import { CartContext } from "../cart/CartContext";

function CheckoutPanel() {
  const { items, total, addItem, decrementItem, removeItem, clearCart } =
    useContext(CartContext);
  const [placed, setPlaced] = useState(false);

  function placeOrder() {
    setPlaced(true);
    clearCart();
  }

  return (
    <aside className="checkout">
      <h2>Your Order</h2>

      {placed && items.length === 0 && (
        <p className="success">✅ Order placed. Thank you!</p>
      )}

      {items.length === 0 && !placed && (
        <p className="empty-message">Your cart is empty.</p>
      )}

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-row">
            <div>
              <strong>{item.name}</strong>
              <div className="category">
                {item.price} ETB × {item.qty}
              </div>
            </div>
            <div className="qty-controls">
              <button onClick={() => decrementItem(item.id)} aria-label="Less">
                −
              </button>
              <span>{item.qty}</span>
              <button onClick={() => addItem(item)} aria-label="More">
                +
              </button>
              <button
                className="remove"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="order-total">
        <h2>Total: {total} ETB</h2>
      </div>

      <button
        className="pay-button"
        disabled={items.length === 0}
        onClick={placeOrder}
      >
        Place order
      </button>
      <button
        className="clear-button"
        disabled={items.length === 0}
        onClick={clearCart}
      >
        Clear cart
      </button>
    </aside>
  );
}

export default CheckoutPanel;
