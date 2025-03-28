import * as React from "react";
import { motion } from "framer-motion";

interface Props {
  toggle: () => void;
  isOpen: boolean;
}

export const MenuToggle = ({ toggle, isOpen }: Props) => (
  <button onClick={toggle} className="absolute px-5 md:px-[60px] py-[50px] right-0">
    {/* <AnimatePresence mode="wait"> */}
      {isOpen ? (
        <motion.span
          key="close"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          exit={{ y: 20 }}
          transition={{ duration: 0.3 }}
          className="text-black"
        >
          CLOSE
        </motion.span>
      ) : (
        <motion.span
          key="menu"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          exit={{ y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-white"
        >
          MENU
        </motion.span>
      )}
    {/* </AnimatePresence> */}
  </button>
);
