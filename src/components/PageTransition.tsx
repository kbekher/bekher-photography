"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionContext } from "./TransitionContext";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isTransitioning, targetPath } = useTransitionContext();

  const [showOverlay, setShowOverlay] = useState(false);
  const [showChildren, setShowChildren] = useState(true);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    // If we're transitioning or doing a hard reload to home, show the loader
    if (isTransitioning && targetPath && targetPath !== currentPath) {
      setShowChildren(false);

        timeout = setTimeout(() => {
        setShowOverlay(true);

        const overlayDelay = 400;

        setTimeout(() => {
          setCurrentPath(targetPath || pathname);
          setShowOverlay(false);
          setShowChildren(true);
        }, overlayDelay);
      }, 400); // let current content animate out

      return () => {
        clearTimeout(timeout);
        setShowOverlay(false);
      };
    }
  }, [isTransitioning, targetPath, currentPath, pathname]);

  return (
    <div className="relative overflow-hidden">
      {/* Animate Page Content */}
      <AnimatePresence mode="wait">
        {showChildren && (
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay Animation */}
      <AnimatePresence>
        {showOverlay && (
            <motion.div
              key="overlay"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed inset-0 bg-[var(--branding)] z-40"
            />
        )}
      </AnimatePresence>
    </div>
  );
}
