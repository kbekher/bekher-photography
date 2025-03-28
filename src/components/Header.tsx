"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
// import { useDimensions } from "../utils/utils";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";


const menubarVariants = {
  open: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 30,
      damping: 10,
      duration: 0.8,
    },
  },
  closed: {
    y: "-100%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      delay: 0.3
    },
  },
};


const Header = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  // const { height } = useDimensions(containerRef);

  return (
    <header className="sticky top-0 px-5 md:px-[60px] py-[50px] flex justify-between z-10 font-bold">
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
        <motion.div
          variants={menubarVariants}
          className="absolute top-0 left-0 right-0 h-[300px] bg-white"
        />
        <Navigation toggle={() => toggleOpen()} isOpen={isOpen} />
        <MenuToggle toggle={() => toggleOpen()} isOpen={isOpen} />
      </motion.nav>

    </header>
  )
}

export default Header;
