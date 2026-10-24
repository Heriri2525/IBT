import CartBadge from "./CartBadge";
import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <h1>Addis Eats</h1>
        <CartBadge />
        <ThemeToggle />
      </div>
      <p>Fresh Ethiopian food, made with love.</p>
    </header>
  );
}

export default Header;
