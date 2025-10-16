"use client";

import { motion, AnimatePresence } from "framer-motion";
import ContactLinks from "./ContactLinks";
import { useMenu } from "@/contexts/MenuContext";
import { navLinks } from "@/constants/constants";
import Logo from "./Logo";
import { TransitionLink } from "./TransitionLink";

const overlayVariants = {
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

const menuVariants = {
  open: {
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  closed: {
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const listVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
      opacity: { duration: 0.3 }
    }
  },
  closed: {
    y: 80,
    opacity: 0,
    transition: {
      y: { duration: 0.4, ease: [0.32, 0, 0.67, 0] },
      opacity: { duration: 0.2 }
    }
  }
};

const contactVariants = {
  open: {
    opacity: 1,
    transition: { delay: 0.8, duration: 0.3 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const Navigation = () => {
  const { toggle, isOpen } = useMenu();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={toggle}
            className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
          />

          {/* Menu Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 left-0 right-0 w-full z-[100] bg-[var(--secondary)] text-[var(--branding)]"
          >
            {/* Menu Header */}
            <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Logo isLink={false} />
              </motion.div>

              <motion.button
                onClick={toggle}
                className="bg-transparent border-none cursor-pointer capitalize text-[var(--branding)] lg:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                data-cursor="text"
              >
                close
              </motion.button>
            </div>

            {/* Menu Content */}
            <div className="h-full flex items-center lg:justify-end p-5 pt-[100px] lg:pt-[68px]">
              <div className="flex flex-col gap-[80px] justify-center w-full lg:max-w-[40%] pl-auto">
                <motion.ul
                  variants={listVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className='flex flex-col gap-2 text-5xl sm:text-6xl leading-none tracking-tighter'
                >
                  {navLinks.map(({ name, href }) => (
                    <li
                      key={name}
                      className="overflow-hidden list-none"
                    >
                      <motion.div
                        variants={itemVariants}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center w-max uppercase cursor-pointer"
                        data-cursor="text"
                      >
                        <TransitionLink href={href}>{name}</TransitionLink>
                      </motion.div>
                    </li>
                  ))}
                </motion.ul>

                <motion.div variants={contactVariants}>
                  <ContactLinks />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Navigation;