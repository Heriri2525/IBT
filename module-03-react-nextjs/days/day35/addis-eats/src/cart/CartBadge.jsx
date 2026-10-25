import { useCartStore, selectCount } from "./cartStore";

// Subscribes to ONE number: the item count. It re-renders only when that
// number changes — and nothing else in the cart can wake it up.
function CartBadge() {
  const count = useCartStore(selectCount);

  return (
    <span className="cart-badge" aria-label={`${count} items in cart`}>
      🛒 {count}
    </span>
  );
}

export default CartBadge;
