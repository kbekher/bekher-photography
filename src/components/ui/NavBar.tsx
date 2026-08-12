"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import PillButton from "./PillButton";

const NAV_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Index", href: "/collections" },
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
 *
 * Three equal grid tracks keep the pill row at the true horizontal centre
 * even when a trailing control (Close, Back) sits in the right column.
 */
export default function NavBar({ trailing, className = "" }: NavBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`grid w-full grid-cols-[1fr_auto_1fr] items-center ${className}`.trim()}
    >
      <div aria-hidden="true" />
      <ul className="flex items-center gap-8" role="list">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <PillButton href={item.href} active={isActive(pathname, item.href)}>
              {item.label}
            </PillButton>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">{trailing}</div>
    </nav>
  );
}
