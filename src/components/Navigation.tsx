"use client";

import { motion } from "framer-motion";
import ContactLinks from "./ContactLinks";
import MenuToggle from "./MenuToggle";
import { useMenu } from "@/contexts/MenuContext";
import { navLinks } from "@/constants/constants";
import { textVariants } from "@/constants/animations";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

const containerVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.1,
      staggerChildren: 0.07,
    },

  },
  closed: {
    y: -300,
    opacity: 0,
    transition: { duration: 0.3 },
  }
};

const listVariants = {
  open: {
    height: "max-content",
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
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
  const router = useRouter();

  return (
    <>
      {isOpen && (
        <div
          id="menu-backdrop"
          onClick={() => { toggle(); }}
          className="fixed inset-0 z-50"
        />
      )}

      <motion.div
        variants={containerVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="fixed z-50 top-0 left-0 right-0 p-5 w-full h-max flex justify-between gap-5 bg-[var(--secondary)] text-[var(--branding)]"
      >
        {/* Logo */}
        <motion.div className="hidden md:block w-[50%]" variants={textVariants}>
            <Logo isLink={false} />
        </motion.div>

        {/* Nav */}
        <div className="flex flex-col gap-[80px] justify-between w-full md:w-[50%]">
          <motion.ul
            variants={listVariants}
            className='flex flex-col gap-0 text-[60px] leading-none tracking-tighter'
          >
            {navLinks.map(({ name, href }) => (
              <motion.li
                key={name}
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
                className="flex items-center w-max list-none"
                whileHover={{
                  color: "#8d89a3",
                  transition: { duration: 0.3 },
                }}
              >
                <button
                  className="uppercase cursor-pointer"
                  onClick={() => {
                    toggle();
                    setTimeout(() => {
                      router.push(href);
                    }, 300); // wait for menu-closing animation
                  }}
                >
                  {name}
                </button>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={contactVariants}>
            <ContactLinks />
          </motion.div>
        </div>

        <MenuToggle text="close" />

      </motion.div>
    </>
  );
}

export default Navigation;