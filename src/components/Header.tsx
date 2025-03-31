"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";


const Header = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);

  return (
    <header className="sticky top-0 p-5 flex justify-between z-10 font-bold">
      <div>
        <Link href="/">[Logo] Kristina Bekher</Link>
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
