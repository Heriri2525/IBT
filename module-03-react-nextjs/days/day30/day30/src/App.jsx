import { CartProvider } from "./cart/CartProvider";
import Header from "./components/Header";
import Menu from "./Menu";
import CheckoutPanel from "./components/CheckoutPanel";

function App() {
  return (
    // Provider near the top: Header, Menu and CheckoutPanel can all read the cart
    <CartProvider>
      <div className="app">
        <Header />
        <div className="layout">
          <Menu />
          <CheckoutPanel />
        </div>
      </div>
    </CartProvider>
  );
}

export default App;
