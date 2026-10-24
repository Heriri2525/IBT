import { CartProvider } from "./cart/CartProvider";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import Header from "./components/Header";
import Menu from "./Menu";
import CheckoutPanel from "./components/CheckoutPanel";
import MenuStats from "./components/MenuStats";

function Shell() {
  const { theme } = useTheme();
  return (
    <div className="app" data-theme={theme}>
      <Header />
      <div className="layout">
        <Menu />
        <CheckoutPanel />
      </div>
      <MenuStats />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
