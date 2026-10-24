import { useContext } from "react";
import { CartContext } from "../cart/CartContext";

function Header() {
  // consume: no props passed through App -> Header
  const { count } = useContext(CartContext);

  return (
    <header className="header">
      <div className="header-top">
        <h1>Addis Eats</h1>
        <span className="cart-badge" aria-label={`${count} items in cart`}>
          🛒 {count}
        </span>
      </div>
      <p>Fresh Ethiopian food, made with love.</p>
    </header>
  );
}

export default Header;
