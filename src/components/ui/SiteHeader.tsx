import type { ReactNode } from "react";
import Logotype from "./Logotype";
import NavBar from "./NavBar";

export interface SiteHeaderProps {
  /** Passed through to NavBar's trailing slot, e.g. "Back" or "Close". */
  navTrailing?: ReactNode;
  className?: string;
  /** Marks chrome for lightbox fade targeting (`data-lb-chrome`). */
  chrome?: boolean;
}

/**
 * Shared logotype + navbar header used by PageShell and the lightbox so both
 * land the wordmark and nav pills at the same pixel position (24px from top,
 * 24px between).
 */
export default function SiteHeader({ navTrailing, className = "", chrome = false }: SiteHeaderProps) {
  return (
    <header
      {...(chrome ? { "data-lb-chrome": true } : {})}
      className={`flex w-full flex-col items-center pt-24 ${className}`.trim()}
    >
      <Logotype />
      <div className="mt-24 w-full">
        <NavBar trailing={navTrailing} />
      </div>
    </header>
  );
}
