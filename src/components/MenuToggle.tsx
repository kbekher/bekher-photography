import * as React from "react";
import { motion } from "framer-motion";

interface Props {
  toggle: () => void;
  isOpen: boolean;
}

// Variants for text color and opacity
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

export const MenuToggle = ({ toggle, isOpen }: Props) => (
  <div className="absolute p-5 right-0">
    <motion.button
      onClick={toggle}
      className="bg-transparent border-none cursor-pointer"
    >
      <motion.span
        variants={textVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        whileHover={{
          color: "#8d89a3",
          transition: { duration: 0.3 },
        }}
      >
        {isOpen ? "CLOSE" : "MENU"}
      </motion.span>
    </motion.button>
  </div>
);
