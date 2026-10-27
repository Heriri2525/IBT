import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <section>
      <h1>Welcome to Addis Eats</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Doro wat, kitfo, shiro and more — straight from the kitchen.
      </p>

      {/* The hero is the LARGEST image visible without scrolling, so it is the LCP element and the
          ONE image on this page allowed `priority` (no lazy loading, preloaded). `fill` is for
          when the size is set by the container: .hero reserves the space (aspect-ratio), so
          nothing jumps. Its alt is empty because it is decoration; the heading says it all. */}
      <div className="hero">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          style={{ objectFit: "cover" }}
        />
      </div>

      <Link href="/menu" className="btn alt">See the menu</Link>
    </section>
  );
}
