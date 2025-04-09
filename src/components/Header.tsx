"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useMenu } from "@/contexts/MenuContext";
import MenuToggle from "./MenuToggle";

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
  // const pathname = usePathname();

  return (
    <header className={`fixed z-40 top-0 left-0 right-0 p-5 flex justify-between font-bold custom-transition mix-blend-difference`}>
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
        <Link href="/" className=" mx-1.2px flex gap-2 items-center">

          {/* //TODO: make a separate component (color, link or not) */}

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{
              ...box,
              borderRadius: "50%",
              background: "#cbcbcf",
            }}
          />

        <span>Kristina Bekher</span>

        </Link>
      </motion.div>

      <MenuToggle text="menu" />
    </header>
  )
}

const box = {
  width: 16,
  height: 16,
  backgroundColor: "#cbcbcf",
  borderRadius: 5,
}
export default Header;
