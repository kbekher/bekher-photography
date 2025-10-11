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
      x: mousePosition.x - 46,
      y: mousePosition.y - 44,
    },
  };

  return (
    <motion.div
      className={`w-[24px] h-[24px] fixed top-0 left-0 z-[101] pointer-events-none mix-blend-difference flex items-center justify-center rounded-full ${cursorVariant === 'view' ? 'border-2 border-white' : 'bg-white'}`}
      variants={variants}
      animate={cursorVariant}
    >
      {cursorVariant === 'view' && <div className="h-max text-md uppercase font-bold text-white">view</div>}
    </motion.div>
  );
};

export default CustomCursor;
