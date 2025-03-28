import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const listVariants = {
  open: {
    height: 300,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    height: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: -50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

interface Props {
  toggle: () => void;
  isOpen: boolean;
}

// TODO: could be a better way to add menu - overlay or so 

export const Navigation = ({ toggle, isOpen }: Props) => {
  return (
    <motion.ul
      variants={listVariants}
      className={`absolute p-5 top-0 w-full text-[60px] uppercase ${isOpen ? "pointer-events-all": "pointer-events-none"}`}
    >
      {["home", "galleries", "about"].map((item) => (
        <motion.li
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-black list-none"
          key={item}
        >
          <Link 
            href={item === "home" ? "/" : `/${item}`} 
            className="w-max"
            onClick={toggle}
          >
            {item}
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}