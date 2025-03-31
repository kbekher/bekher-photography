"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";
// import TransitionLayer from "./TransitionLayer";

interface Props {
  children: React.ReactNode;
}

const PageTransition: React.FC<Props> = ({ children }) => {
  const pathname = usePathname(); // Get current route

  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* <TransitionLayer key="transition" /> Ensure this runs every route change */}
      <div key={pathname}>
        {children}
      </div>
    </AnimatePresence>
  );
};

export default PageTransition;
