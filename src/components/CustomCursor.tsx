"use client";

// import { useCursor } from "@/contexts/CursorContext";
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
      const variant = target.closest("[data-cursor]")?.getAttribute("data-cursor") as "default" | "text" | null;
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
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
    },
    text: {
      height: 48,
      width: 48,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
    },
    // TODO:
    view: {
      height: 48,
      width: 48,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
    },  
  };

  return (
    <motion.div
      className="cursor"
      variants={variants}
      animate={cursorVariant}
    >
      {/* {cursorStyle.content} */}
    </motion.div>
  );
};

export default CustomCursor;
