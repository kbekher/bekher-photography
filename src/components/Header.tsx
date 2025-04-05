"use client";

import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import TransitionLink from "./TransitionLink";
import { usePathname } from "next/navigation";


const Header = () => {
  const pathname = usePathname();
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);

  return (
    <header className={`${isOpen ? "" : "blend"} fixed top-0 left-0 right-0 p-5 flex justify-between z-10 font-bold transition-smooth`}>
      <div>
        <TransitionLink 
          href="/"
          className="transition-smooth hover:text-[var(--accent)]"
        >
          {pathname === '/' ? '[Logo] Kristina Bekher' : 'Home'}
        </TransitionLink>
      </div>

        <motion.nav
          initial={false}
          animate={isOpen ? "open" : "closed"}
          custom={1000}
          ref={containerRef}
          className="absolute top-0 left-0 right-0"
        >
          <Navigation toggle={() => toggleOpen()} isOpen={isOpen} />
          <MenuToggle toggle={() => toggleOpen()} isOpen={isOpen} />
        </motion.nav>
    </header>
  )
}

export default Header;
