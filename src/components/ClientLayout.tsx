'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MenuProvider } from "@/contexts/MenuContext";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function BodyContent({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const pathname = usePathname();

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  // Ensure scrolling is enabled for non-home pages
  React.useEffect(() => {
    if (pathname !== '/') {
      document.body.style.overflow = '';
    }
  }, [pathname]);

  return (
    <main className={montserrat.className}>
      <div className="antialiased scroll-smooth bg-[var(--background)] text-[var(--secondary)] font-bold tracking-[0.5px]">
        <div className="relative min-h-screen">
          {/* Preloader - only show on home page */}
          {showPreloader && pathname === '/' && (
            <AnimatePresence>
              <motion.div
                className="absolute inset-0 z-50 bg-[var(--background)]"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Preloader onComplete={handlePreloaderComplete} />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Main Content */}
          <div
            style={{
              opacity: showPreloader && pathname === '/' ? 0 : 1,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            <MenuProvider>
              <Header />
              <Navigation />
              {children}
              <Footer />
            </MenuProvider>
          </div>
        </div>
      </div>
    </main>
  );
}