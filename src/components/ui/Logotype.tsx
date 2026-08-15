import Link from "next/link";

/**
 * "Kristina Bekher" wordmark — plain 15px text, links home.
 * 108x19 per the design spec, centered at the top of every page.
 */
export default function Logotype() {
  return (
    <Link href="/" className="inline-block whitespace-nowrap">
      Kristina Bekher
    </Link>
  );
}
