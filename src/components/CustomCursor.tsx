"use client";

import useIsTouchDevice from "@/hooks/useIsTouchDevice";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<"default" | "text" | "view">("default");

  const isTouch = useIsTouchDevice();

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const mouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const variant = target.closest("[data-cursor]")?.getAttribute("data-cursor") as "default" | "text" | "view" | null;
      setCursorVariant(variant ?? "default");
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", mouseOver);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", mouseOver);
    };
  }, []);


  if (isTouch) return null;

  const variants = {
    default: {
      height: 24,
      width: 24,
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
    },
    text: {
      height: 48,
      width: 48,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
    },
    view: {
      height: 48,
      width: 48,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
    },
  };

  return (
    <motion.div
      className="w-[24px] h-[24px] fixed top-0 left-0 z-[99] pointer-events-none mix-blend-difference bg-white rounded-full flex items-center justify-center"
      variants={variants}
      animate={cursorVariant}
    >
      {cursorVariant === 'view' && (
        <svg
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6 -rotate-45"
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
        >
          <path
            d="M14 5l7 7m0 0l-7 7m7-7H3"
            stroke-linejoin="round"
            stroke-linecap="round"
          ></path>
        </svg>
      )}
    </motion.div>
  );
};

export default CustomCursor;
