"use client";

import { motion } from "framer-motion";
import MenuToggle from "./MenuToggle";
import Logo from "./Logo";

import { useMenu } from "@/contexts/MenuContext";
import { textVariants } from "@/constants/animations";

const Header = () => {
  const { isOpen } = useMenu();

  return (
    <header className={`fixed z-10 top-0 left-0 right-0 p-5 flex justify-between custom-transition mix-blend-difference`}>
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
        <Logo isLink={true} />
      </motion.div>

      <MenuToggle text="menu" />
    </header>
  )
}

export default Header;
