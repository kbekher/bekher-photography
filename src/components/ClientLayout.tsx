// src/components/BodyContent.tsx
'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Montserrat } from "next/font/google";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MenuProvider } from "@/contexts/MenuContext";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function BodyContent({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setContentVisible(true);
      }, 100);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <body className={montserrat.className}>
      <div className="antialiased scroll-smooth bg-[var(--background)] text-[var(--secondary)] font-bold tracking-[0.5px]">
        <div className="relative min-h-screen">
          {/* Preloader */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="absolute inset-0 z-50 bg-[var(--background)]"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Preloader />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div 
            style={{ 
              opacity: loading ? 0 : 1,
              transition: 'opacity 0.5s ease-in-out'
            }}
          >
            <MenuProvider>
              <Header />
              <Navigation />
              {contentVisible && children}
              <Footer />
            </MenuProvider>
          </div>
        </div>
      </div>
    </body>
  );
}