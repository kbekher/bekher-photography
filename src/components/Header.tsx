"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import MenuToggle from "./MenuToggle";
import TransitionLink from "./TransitionLink";
import { useMenu } from "@/contexts/MenuContext";

const textVariants = {
  open: {
    color: "#444251",
    opacity: 1,
    transition: { duration: 0.3 },
  },
  closed: {
    color: "#ffffff",
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const Header = () => {
  const { isOpen } = useMenu();
  const pathname = usePathname();

  return (
    <header className={`fixed z-40 top-0 left-0 right-0 p-5 flex justify-between font-bold custom-transition blend`}>
      <motion.div
        variants={textVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        whileHover={{
          color: "#8d89a3",
          transition: { duration: 0.3 },
        }}
        className={`${isOpen ? "hidden md:block" : ""}`}
      >
        <TransitionLink href="/">
          {pathname === "/" ? "[LOGO] Kristina Bekher" : "Home"}
        </TransitionLink>
      </motion.div>

      <MenuToggle text="menu" />
    </header>
  )
}

export default Header;
