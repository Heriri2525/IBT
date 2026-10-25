import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ThemeProvider } from "./theme/ThemeContext";
import RequireAuth from "./auth/RequireAuth";
import ErrorBoundary from "./ui/ErrorBoundary";
import { AppCrashed } from "./ui/Fallbacks";
import Layout from "./Layout";
import Home from "./home/Home";
import Menu from "./menu/Menu";
import DishDetail from "./menu/DishDetail";
import Cart from "./cart/CartPage";
import Login from "./auth/Login";
import NotFound from "./ui/NotFound";

// Split at the route. Home and Menu stay in the main bundle (the screens
// people arrive on). Checkout and the receipt are only needed later, so each
// downloads the first time it is rendered. The <Suspense> that shows a
// skeleton while that happens lives in ui/RouteShell.jsx, inside the Layout,
// so the header and navigation stay on screen.
const Checkout = lazy(() => import("./checkout/Checkout"));
const OrderReceipt = lazy(() => import("./checkout/OrderReceipt"));

function App() {
  return (
    // Boundary 1 (last resort): outside the router and every provider.
    // More boundaries sit at the seams below: Layout > page (ui/RouteShell),
    // and on the menu page: the dish list and the order panel, separately.
    <ErrorBoundary name="app" fallback={<AppCrashed />}>
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
    </ErrorBoundary>
  );
}

export default App;
