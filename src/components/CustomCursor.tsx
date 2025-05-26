// components/CustomCursor.tsx
"use client";

import { useCursor } from "@/contexts/CursorContext";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const { mousePosition, cursorStyle } = useCursor();

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
  };

  return (
    <motion.div
      className="cursor"
      variants={variants}
      animate={cursorStyle.variant}
    >
      {cursorStyle.content}
    </motion.div>
  );
};

export default CustomCursor;
