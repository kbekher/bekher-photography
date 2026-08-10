import type { ReactNode } from "react";
import Footer from "./Footer";
import Logotype from "./Logotype";
import NavBar from "./NavBar";

export interface PageShellProps {
  children: ReactNode;
  /** Passed through to NavBar's trailing slot, e.g. "Back" or "Close". */
  navTrailing?: ReactNode;
}

/**
 * Shared page frame: centered content, logotype + navbar header
 * (24px from top, 24px between), page content, footer at the bottom.
 */
export default function PageShell({ children, navTrailing }: PageShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col items-center px-[40px]">
      <header className="flex w-full flex-col items-center pt-24">
        <Logotype />
        <div className="mt-24 w-full">
          <NavBar trailing={navTrailing} />
        </div>
      </header>
      <main className="flex w-full flex-1 flex-col items-center">{children}</main>
      <div className="mt-auto w-full pb-24 pt-24">
        <Footer />
      </div>
    </div>
  );
}
