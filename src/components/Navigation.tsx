import * as React from "react";
import { motion } from "framer-motion";
import ContactLinks from "./ContactLinks";
import TransitionLink from "./TransitionLink";

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

const titleVariants = {
  open: {
    // height: "max-content",
    opacity: 1,
    transition: { duration: 0.8 },
  },
  closed: {
    // height: 0,
    opacity: 0,
    transition: {
      duration: 0.1,
    },
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

interface Props {
  toggle: () => void;
  isOpen: boolean;
}

export const Navigation = ({ toggle, isOpen }: Props) => {
  const links = [
    { name: "Home", href: "/" },
    { name: "Galleries", href: "/galleries" },
    { name: "About", href: "/about" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="absolute p-5 top-0 w-full h-max flex justify-between gap-5 bg-white text-[var(--menu-text)]"
    >
      <motion.div
        className="hidden md:block w-[50%]"
        variants={titleVariants}
      >
        <span className="font-bold block">Kristina Bekher</span>
      </motion.div>

      <div className="flex flex-col justify-between w-full md:w-[50%]">
        <motion.ul
          variants={listVariants}
          className='flex flex-col gap-0 text-[60px] uppercase leading-none'
        >
          {links.map(({ name, href }) => (
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
              <TransitionLink
                href={href}
                beforeNavigate={() =>
                  new Promise((resolve) => {
                    toggle(); // close menu
                    setTimeout(resolve, 300); // wait for animation
                  })
                }
              >
                {name}
              </TransitionLink>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div variants={contactVariants} className="pt-[40px]">
          <ContactLinks />
        </motion.div>
      </div>

    </motion.div>
  );
}