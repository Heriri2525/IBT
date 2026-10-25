import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food, ordered from your phone.",
};

// Root layout: still a SERVER component. The header and footer ship no JavaScript.
// <Providers> is a client component, but pages reach it as {children} (passed in, not
// imported), so every page inside it is still rendered on the server.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bar">
          <Link href="/" className="brand">Addis Eats</Link>
          <nav>
            <Link href="/menu">Menu</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/checkout">Checkout</Link>
          </nav>
        </header>
        <main>
          <Providers>{children}</Providers>
        </main>
        <footer className="foot">© Addis Eats · Day 38 — server &amp; client components</footer>
      </body>
    </html>
  );
}
