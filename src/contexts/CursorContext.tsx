// context/CursorContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CursorStyle = {
  variant: string;             // for motion animation variants
  content?: ReactNode;         // any inner JSX to show inside cursor
};

type CursorContextType = {
  mousePosition: { x: number; y: number };
  cursorStyle: CursorStyle;
  setCursorStyle: (style: CursorStyle) => void;
  resetCursorStyle: () => void;
};

const defaultCursorStyle: CursorStyle = { variant: "default", content: null };

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>(defaultCursorStyle);


  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  const resetCursorStyle = () => setCursorStyle(defaultCursorStyle);

  return (
    <CursorContext.Provider value={{ mousePosition, cursorStyle, setCursorStyle, resetCursorStyle }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) throw new Error("useCursor must be used within a CursorProvider");
  return context;
};
