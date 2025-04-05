"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setLoading(true);
    setShowContent(false);

    const loaderTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(contentTimer);
    };
  }, [pathname]);

  return (
    <div className="relative">
      <AnimatePresence>
        {isHome && loading && (
          <>
            <motion.div
              key="loader"
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit={{ y: "-100%", transition: { duration: 0.6, ease: "easeInOut" } }}
              className="fixed inset-0 flex items-center justify-center bg-black text-white z-50"
            >
              <span className="text-lg font-semibold">Kristina Bekher</span>
            </motion.div>

            {/* Accent Overlay */}
            <motion.div
              key="overlay"
              initial={{ y: "100%" }}
              animate={{ y: "0%", transition: { duration: 0.8, ease: "easeInOut" } }}
              exit={{ y: "-100%", opacity: 0, transition: { duration: 0.8, ease: "easeInOut", delay: 0.6 } }}
              className="fixed top-0 left-0 right-0 bottom-0 bg-[var(--accent)] z-40"
            />
          </>
        )}

        {!isHome && loading && (
          <motion.div
            key={pathname}
            initial={{ y: "100%" }}
            animate={{ y: "0%", transition: { duration: 0.8, ease: "easeInOut" } }}
            exit={{ y: "-100%", opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-[var(--accent)] z-40"
          />
        )}
      </AnimatePresence>

        {/* Page Content - only show after animations */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            className="opacity-0"
          >
            {children}
          </motion.div>
        )}
    </div >
  );
}
