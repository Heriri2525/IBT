import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food, ordered from your phone.",
};

// Minimal root shell: <html>, <body>, a nav built from next/link, and {children}.
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
      </body>
    </html>
  );
}
