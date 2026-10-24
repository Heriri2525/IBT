import { useCartStore, selectCount } from "./cart/cartStore";
import { logRender } from "./hooks/logRender";

// Subscribes to ONE number: the item count. It re-renders only when that
// number changes — and nothing else in the cart can wake it up.
function CartBadge() {
  logRender("CartBadge");
  const count = useCartStore(selectCount);

  return (
    <span className="cart-badge" aria-label={`${count} items in cart`}>
      🛒 {count}
    </span>
  );
}

export default CartBadge;
