"use client";

import { usePageTransition } from "@/contexts/PageTransitionContext";
import { motion, AnimatePresence } from "framer-motion";

export const PageTransition = () => {
  const { isTransitioning } = usePageTransition();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {/* Multiple curtain layers for depth effect */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ y: "100%" }}
              animate={{ 
                y: "0%",
                transition: {
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.76, 0, 0.24, 1],
                }
              }}
              exit={{ 
                y: "-100%",
                transition: {
                  duration: 0.6,
                  delay: (2 - index) * 0.08,
                  ease: [0.76, 0, 0.24, 1],
                }
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: index === 1 
                  ? "rgba(0, 0, 0, 1)" 
                  : index === 0 
                  ? "rgba(68, 66, 81, 0.5)" 
                  : "rgba(141, 137, 163, 0.3)",
                zIndex: 3 - index,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

