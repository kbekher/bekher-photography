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
    <header className="sticky top-0 p-5 flex justify-between z-10 font-bold">
      <div>
        <TransitionLink 
          href="/"
          className="duration-[0.3] transition-all hover:text-[var(--accent)] "
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
