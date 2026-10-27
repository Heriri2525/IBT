import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Analytics from "./Analytics";

// DAY 43 — FONTS. next/font downloads Inter ONCE, at build time, and serves it from our own
// origin: no request to Google, no third party learning who visits, and a fallback face with
// matching metrics so the swap barely moves anything (that is what keeps CLS near zero).
// `subsets` trims the file to the characters a Latin site needs. `variable` exposes the font
// as a CSS custom property that globals.css uses.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food, ordered from your phone.",
};

// Root layout: still a SERVER component. The header and footer ship no JavaScript.
// <Providers> is a client component, but pages reach it as {children} (passed in, not
// imported), so every page inside it is still rendered on the server.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <header className="bar">
          <Link href="/" className="brand">
            {/* A logo is an SVG (Image serves it as-is). alt is empty: the words beside it say the same thing. */}
            <Image src="/logo.svg" alt="" width={28} height={28} />
            Addis Eats
          </Link>
          <nav>
            <Link href="/menu">Menu</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/orders">Orders</Link>
            <Link href="/signin">Sign in</Link>
          </nav>
        </header>
        <main>
          <Providers>{children}</Providers>
        </main>
        <footer className="foot">© Addis Eats · Day 43 — optimisation &amp; environment</footer>
        {/* Third-party code, loaded last and lazily. Renders nothing unless a URL is configured. */}
        <Analytics />
      </body>
    </html>
  );
}
