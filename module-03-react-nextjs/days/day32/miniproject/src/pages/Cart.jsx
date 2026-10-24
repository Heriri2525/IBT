import { Link } from "react-router-dom";
import { useCartStore, selectTotal } from "../cart/cartStore";

function Cart() {
  // one selector per value
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);
  const addItem = useCartStore((s) => s.addItem);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  return (
    <main className="page">
      <h2>Your Order</h2>

      {items.length === 0 ? (
        <div className="empty-message">
          <p>Your cart is empty.</p>
          <Link to="/menu" className="cta">
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="checkout cart-page">
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
                  <button onClick={() => decrement(item.id)} aria-label="Less">
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => addItem(item)} aria-label="More">
                    +
                  </button>
                  <button
                    className="remove"
                    onClick={() => remove(item.id)}
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

          <Link to="/checkout" className="pay-button as-link">
            Proceed to checkout
          </Link>
          <button className="clear-button" onClick={clear}>
            Clear cart
          </button>
        </div>
      )}
    </main>
  );
}

export default Cart;
