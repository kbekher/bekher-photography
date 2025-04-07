"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MenuContextType {
  isOpen: boolean;
  toggle: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <MenuContext.Provider value={{ isOpen, toggle }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
