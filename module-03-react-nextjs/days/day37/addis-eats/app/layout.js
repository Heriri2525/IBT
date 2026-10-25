import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food, ordered from your phone.",
};

// Root layout: the ONLY file that owns <html> and <body>. Global CSS is imported
// here. Header and footer wrap every page; {children} is whichever page matched.
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
        <main>{children}</main>
        <footer className="foot">© Addis Eats · Day 37 — layouts &amp; rendering strategies</footer>
      </body>
    </html>
  );
}
