"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import PillButton from "./PillButton";

const NAV_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Index", href: "/index" },
  { label: "About", href: "/about" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface NavBarProps {
  /** Optional right-aligned slot, e.g. "Back" on collection pages or "Close" in the lightbox. */
  trailing?: ReactNode;
  className?: string;
}

/**
 * 213x31 nav row: Overview / Index / About, centered, 24px below the logotype.
 * Marks the current route active via usePathname. Keyboard navigable (native
 * link/button semantics via PillButton).
 */
export default function NavBar({ trailing, className = "" }: NavBarProps) {
  const pathname = usePathname();

  return (
    <nav className={`relative flex items-center justify-center gap-8 ${className}`.trim()}>
      <ul className="flex items-center gap-8" role="list">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <PillButton href={item.href} active={isActive(pathname, item.href)}>
              {item.label}
            </PillButton>
          </li>
        ))}
      </ul>
      {trailing ? (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">{trailing}</div>
      ) : null}
    </nav>
  );
}
