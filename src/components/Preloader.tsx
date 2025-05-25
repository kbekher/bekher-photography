"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable scrolling while preloader is active
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Simulate loading delay or wait for assets if needed
    const timeout = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = '';
    }, 1200); // change this if needed

    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
        >
          <div className="text-xl animate-pulse">Nothing Beats Film Photography</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
