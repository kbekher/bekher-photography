'use client';

import React, { useState, useCallback, useEffect } from "react";
import { Montserrat } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { UIProvider, useUI } from "@/contexts/MenuContext";
import CustomCursor from "@/components/CustomCursor";

const montserrat = Montserrat({ subsets: ["latin"] });

function LayoutContent({ children, showPreloader }: { children: React.ReactNode, showPreloader: boolean }) {
  const { setPreloaderFinished } = useUI();

  useEffect(() => {
    if (!showPreloader) {
      setPreloaderFinished(true);
    }
  }, [showPreloader, setPreloaderFinished]);

  return (
    <>
      <Header />
      <Navigation />
      {children}
      <Footer />
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const pathname = usePathname();

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <UIProvider>
      <main className={montserrat.className}>
        <div className="antialiased scroll-smooth bg-[var(--background)] text-[var(--secondary)] font-bold tracking-[0.5px]">
          <div className="relative min-h-screen">
            <AnimatePresence mode="wait">
              {showPreloader && pathname === '/' && (
                <Preloader onComplete={handlePreloaderComplete} />
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div
              style={{
                opacity: showPreloader && pathname === '/' ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              <LayoutContent showPreloader={showPreloader}>
                {children}
              </LayoutContent>
            </div>
            <CustomCursor />
          </div>
        </div>
      </main>
    </UIProvider>
  );
}