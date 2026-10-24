import { Link, Navigate, useLocation, useParams } from "react-router-dom";

function OrderReceipt() {
  const { orderId } = useParams();
  const order = useLocation().state?.order;

  // opened cold (typed URL / refresh): there is no order to show
  if (!order || order.id !== orderId) return <Navigate to="/menu" replace />;

  return (
    <main className="page">
      <div className="order-form">
        <h2>✅ Order {order.id} placed</h2>
        <p>
          Thank you, {order.name}! Delivering to {order.address}.
        </p>
        <ul className="cart-list">
          {order.items.map((i) => (
            <li key={i.id} className="cart-row">
              <span>
                {i.name} × {i.qty}
              </span>
              <strong>{i.price * i.qty} ETB</strong>
            </li>
          ))}
        </ul>
        <div className="order-total">
          <h2>Total: {order.total} ETB</h2>
        </div>
        <Link to="/menu" className="cta">
          Order more
        </Link>
      </div>
    </main>
  );
}

export default OrderReceipt;
