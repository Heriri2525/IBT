import { Link, NavLink } from "react-router-dom";
import RouteShell from "./ui/RouteShell";
import CartBadge from "./cart/CartBadge";
import ThemeToggle from "./theme/ThemeToggle";
import { useTheme } from "./theme/ThemeContext";
import { useAuth } from "./auth/useAuth";

const linkClass = ({ isActive }) => (isActive ? "nav-link on" : "nav-link");

// Rendered ONCE by the parent route. Only <Outlet /> changes on navigation.
function Layout() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="app" data-theme={theme}>
      <header className="header">
        <div className="header-top">
          <Link to="/" className="brand">
            <h1>Addis Eats</h1>
          </Link>
          <Link to="/cart" className="badge-link">
            <CartBadge />
          </Link>
          <ThemeToggle />
        </div>
        <p>Fresh Ethiopian food, made with love.</p>
      </header>

      <nav className="nav">
        {/* `end` stops "/" from being active on every route */}
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/menu" className={linkClass}>
          Menu
        </NavLink>
        <NavLink to="/cart" className={linkClass}>
          Cart
        </NavLink>
        <NavLink to="/checkout" className={linkClass}>
          Checkout
        </NavLink>
        <span className="nav-spacer" />
        {user ? (
          <>
            <span className="who">📱 {user.phone}</span>
            <button className="link-button" onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Sign in
          </NavLink>
        )}
      </nav>

      <RouteShell />

      <footer className="footer">
        <p>© Addis Eats · Week 1 project, now routed.</p>
        {/* external addresses use a plain anchor */}
        <a href="https://reactrouter.com" target="_blank" rel="noreferrer">
          React Router docs
        </a>
      </footer>
    </div>
  );
}

export default Layout;
