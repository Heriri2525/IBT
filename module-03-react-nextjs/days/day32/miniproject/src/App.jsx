import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ThemeProvider } from "./theme/ThemeContext";
import RequireAuth from "./auth/RequireAuth";
import Layout from "./Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import DishDetail from "./DishDetail";
import Cart from "./pages/Cart";
import Checkout from "./Checkout";
import Login from "./pages/Login";
import OrderReceipt from "./pages/OrderReceipt";
import NotFound from "./pages/NotFound";

function App() {
  return (
    // No <CartProvider> any more: the cart lives in a Zustand store
    // (src/cart/cartStore.js), outside the component tree. Only the
    // rarely-changing session and theme still use context, each in its own
    // provider so one can never re-render the other's consumers.
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="menu/:id" element={<DishDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route
                path="checkout"
                element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                }
              />
              <Route path="orders/:orderId" element={<OrderReceipt />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
