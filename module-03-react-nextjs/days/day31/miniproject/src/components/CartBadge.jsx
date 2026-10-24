import { useContext } from "react";
import { CartContext } from "../cart/CartContext";

// Reads the cart with useContext — zero cart props passed to it.
function CartBadge() {
  const { count } = useContext(CartContext);

  return (
    <span className="cart-badge" aria-label={`${count} items in cart`}>
      🛒 {count}
    </span>
  );
}

export default CartBadge;
