"use client";

import { motion } from "framer-motion";
import Logo from "./Logo";
import { useMenu } from "@/contexts/MenuContext";

const Header = () => {
  const { toggle } = useMenu();

  return (
    <header className="fixed z-10 top-0 left-0 right-0 p-5 flex justify-between items-center mix-blend-difference">
      <Logo isLink={true} />

      <motion.button
        onClick={toggle}
        className="bg-transparent border-none cursor-pointer text-white lg:text-xl"
        data-cursor="text"
      >
        Menu
      </motion.button>
    </header>
  )
}

export default Header;
