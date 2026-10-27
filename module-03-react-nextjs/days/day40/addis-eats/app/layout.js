import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food, ordered from your phone.",
};

// Server component: owns <html>/<body>, imports one client file (Providers) and
// hands {children} to it, so every page below is still rendered on the server.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="bar">
            <Link href="/" className="brand">Addis Eats</Link>
            <nav>
              <Link href="/menu">Menu</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/checkout">Checkout</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="foot">© Addis Eats · Next.js foundations project</footer>
        </Providers>
      </body>
    </html>
  );
}
