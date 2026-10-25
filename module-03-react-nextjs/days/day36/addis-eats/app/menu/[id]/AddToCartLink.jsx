import Link from "next/link";

export default function AddToCartLink() {
  return <Link href="/cart" className="btn alt" style={{ marginTop: "1rem" }}>Go to cart</Link>;
}
