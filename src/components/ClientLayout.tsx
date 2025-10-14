'use client';

import React, { useState, useCallback } from "react";
import { Montserrat } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { MenuProvider } from "@/contexts/MenuContext";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const pathname = usePathname();

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <main className={montserrat.className}>
      <div className="antialiased scroll-smooth bg-[var(--background)] text-[var(--secondary)] font-bold tracking-[0.5px]">
        <div className="relative min-h-screen">
          <MenuProvider>
            <AnimatePresence mode="wait">
              {showPreloader && pathname === '/' && (
                <Preloader onComplete={handlePreloaderComplete} />
              )}
            </AnimatePresence>
            
            <Header />
            <Navigation />
            {children}
            <Footer />
          </MenuProvider>
        </div>
      </div>
    </main>
  );
}