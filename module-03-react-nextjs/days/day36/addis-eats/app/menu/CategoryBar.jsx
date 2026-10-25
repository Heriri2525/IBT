import Link from "next/link";
import { CATEGORIES } from "./dishes";

// Server component: filters are plain <Link>s to /menu?category=... (no client JS).
export default function CategoryBar({ active = "All" }) {
  return (
    <div className="chips">
      {CATEGORIES.map((c) => (
        <Link
          key={c}
          href={c === "All" ? "/menu" : `/menu?category=${encodeURIComponent(c)}`}
          className={"chip" + (c === active ? " on" : "")}
        >
          {c}
        </Link>
      ))}
    </div>
  );
}
