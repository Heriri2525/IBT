import Link from "next/link";

export default function Home() {
  return (
    <section>
      <h1>Welcome to Addis Eats</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Doro wat, kitfo, shiro and more — straight from the kitchen.
      </p>
      <Link href="/menu" className="btn alt">See the menu</Link>
    </section>
  );
}
