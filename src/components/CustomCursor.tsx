"use client";

import useDeviceDetection from "@/hooks/useDeviceDetection";
import { motion, useMotionValue, AnimatePresence, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [cursorVariant, setCursorVariant] = useState<"default" | "text" | "view">("default");
  const [isMounted, setIsMounted] = useState(false);
  const deviceType = useDeviceDetection();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth out the cursor movement for a premium feel
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsMounted(true);

    const mouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const mouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Look for the closest element with a data-cursor attribute
      const variant = target.closest("[data-cursor]")?.getAttribute("data-cursor") as "default" | "text" | "view" | null;
      setCursorVariant(variant ?? "default");
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", mouseOver);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", mouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isMounted || deviceType !== 'Desktop') return null;

  const size = cursorVariant === "default" ? 12 : 80;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[999] pointer-events-none mix-blend-difference bg-white rounded-full flex items-center justify-center text-black font-medium text-[12px] tracking-tight overflow-hidden whitespace-nowrap"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: size,
        height: size,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
        restDelta: 0.001
      }}
    >
      <AnimatePresence mode="wait">
        {cursorVariant === 'view' && (
          <motion.span
            key="view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="uppercase"
          >
            Explore
          </motion.span>
        )}
        {cursorVariant === 'text' && (
          <motion.span
            key="text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {/* Optional text or just leave it as a larger dot */}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomCursor;
