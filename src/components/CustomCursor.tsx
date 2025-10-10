"use client";

import useDeviceDetection from "@/hooks/useDeviceDetection";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<"default" | "text" | "view">("default");

  const deviceType = useDeviceDetection();

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


  if (deviceType !== 'Desktop') return null;

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
      height: 72,
      width: 72,
      x: mousePosition.x - 36,
      y: mousePosition.y - 46,
    },
  };

  return (
    <motion.div
      className={`w-[24px] h-[24px] fixed top-0 left-0 z-30 pointer-events-none mix-blend-difference border-1 border-white rounded-full flex items-center justify-center`}
      variants={variants}
      animate={cursorVariant}
    >
      {cursorVariant === 'view' && (
        // <svg 
        //   className="h-6 w-6 -rotate-45" 
        //   xmlns="http://www.w3.org/2000/svg" 
        //   viewBox="0 0 448 512"
        // >
        //   <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
        // </svg>
        <div className="text-md font-medium text-white">view</div>
      )}
    </motion.div>
  );
};

export default CustomCursor;
