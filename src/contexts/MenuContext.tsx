"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isOpen: boolean;
  toggle: () => void;
  closeMenu: () => void;
  isPreloaderFinished: boolean;
  setPreloaderFinished: (value: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreloaderFinished, setIsPreloaderFinished] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <UIContext.Provider value={{
      isOpen,
      toggle,
      closeMenu,
      isPreloaderFinished,
      setPreloaderFinished: setIsPreloaderFinished
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};

// Aliases for compatibility with "Updated upstream" logic if some files use it
export const useMenu = useUI;
export const MenuProvider = UIProvider;
