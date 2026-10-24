import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore, selectTotal } from "./cart/cartStore";
import { useAuth } from "./auth/useAuth";

function Checkout() {
  // narrow selectors: Checkout reads the items and the total, and uses clear
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotal);
  const clear = useCartStore((s) => s.clear);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);

  if (items.length === 0) {
    return (
      <main className="page">
        <div className="empty-message">
          <p>Your cart is empty — nothing to check out.</p>
          <Link to="/menu" className="cta">
            Browse the menu
          </Link>
        </div>
      </main>
    );
  }

  function placeOrder(event) {
    event.preventDefault();
    if (!name.trim() || !address.trim()) {
      setError("Please enter your name and delivery address.");
      return;
    }

    const order = {
      id: Date.now().toString(36),
      name: name.trim(),
      address: address.trim(),
      phone: user.phone,
      items,
      total,
    };

    clear();
    // navigate from CODE after an event; replace so Back can't return to the form
    navigate(`/orders/${order.id}`, { replace: true, state: { order } });
  }

  return (
    <main className="page">
      <form className="order-form" onSubmit={placeOrder}>
        <h2>Delivery details</h2>
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="address">Delivery address</label>
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <p className="category">Phone: {user.phone}</p>
        <div className="order-total">
          <h2>
            {items.length} item type(s) · Total: {total} ETB
          </h2>
        </div>
        {error && <p className="error">{error}</p>}
        <button className="pay-button">Place order</button>
      </form>
    </main>
  );
}

export default Checkout;
