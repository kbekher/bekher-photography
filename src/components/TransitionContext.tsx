"use client";

import { createContext, useContext, useState } from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  targetPath: string | null;
  startTransition: (path: string, callback: () => void) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const startTransition = (path: string, callback: () => void) => {
    setIsTransitioning(true);
    setTargetPath(path);

    setTimeout(() => {
      callback(); // router.push(path)
    }, 400);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, targetPath, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransitionContext = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransitionContext must be used within a TransitionProvider");
  }
  return context;
};
