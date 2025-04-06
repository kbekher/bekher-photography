"use client";

import { useRef, useState } from "react";
import { motion, useCycle } from "framer-motion";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import TransitionLink from "./TransitionLink";
import { usePathname } from "next/navigation";


const Header = () => {
  const pathname = usePathname();
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [blendApplied, setBlendApplied] = useState(true); // Track blend mode state
  const containerRef = useRef(null);

  const handleEnd = () => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setBlendApplied(true); // Apply blend mode when closed
        clearTimeout(timer);
      }, 400);
    } else {
      setBlendApplied(false);
    }
  };
  return (
    <header className={`${blendApplied ? "blend" : ""} fixed top-0 left-0 right-0 p-5 flex justify-between z-10 font-bold custom-transition`}>
      <div>
        <TransitionLink href="/" className="custom-transition hover:text-[var(--accent)]">
          {pathname === '/' ? '[Logo] Kristina Bekher' : 'Home'}
        </TransitionLink>
      </div>

      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={1000}
        ref={containerRef}
        className="absolute top-0 left-0 right-0"
        onAnimationComplete={handleEnd}
      >
        <Navigation toggle={() => toggleOpen()} isOpen={isOpen} />
        <MenuToggle toggle={() => toggleOpen()} isOpen={isOpen} />
      </motion.nav>
    </header>
  )
}

export default Header;
