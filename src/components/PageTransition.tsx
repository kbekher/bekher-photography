"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, usePresence } from "framer-motion";
import { useTransitionContext } from "./TransitionContext";

function Overlay() {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      const timeout = setTimeout(() => {
        safeToRemove();
      }, 600); // exit duration plus buffer
      return () => clearTimeout(timeout);
    }
  }, [isPresent, safeToRemove]);

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      exit={{ y: "-100%", opacity: 0.8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 bg-[var(--branding)] z-40"
    />
  );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isTransitioning, targetPath } = useTransitionContext();

  const [showOverlay, setShowOverlay] = useState(false);
  // const [showChildren, setShowChildren] = useState(true);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    // If we're transitioning or doing a hard reload to home, show the loader
    if (isTransitioning && targetPath && targetPath !== currentPath) {
      setShowOverlay(true);
    }
  }, [isTransitioning, targetPath, currentPath]);

  useEffect(() => {
    // When path changes, update state
    if (pathname !== currentPath) {
      setCurrentPath(pathname);
      setShowOverlay(false);
    }
  }, [pathname, currentPath]);

  return (
    <div className="relative overflow-hidden">
      {/* Animate Page Content */}
      <AnimatePresence propagate initial={false}>
        {pathname === currentPath && (
          <motion.div
            key={currentPath}
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay Animation */}
      <AnimatePresence>
        {showOverlay && <Overlay />}
      </AnimatePresence>
    </div>
  );
}
