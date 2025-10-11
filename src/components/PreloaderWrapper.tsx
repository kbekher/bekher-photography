"use client";

import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";
import { usePageTransition } from "@/contexts/PageTransitionContext";

export default function PreloaderWrapper() {
  const [showPreloader, setShowPreloader] = useState(true);
  const pathname = usePathname();
  const { startTransition, endTransition } = usePageTransition();

  const handlePreloaderComplete = useCallback(() => {
    // Immediately start page transition
    startTransition();
    
    // Wait for transition to reach the middle (when screen is fully covered)
    setTimeout(() => {
      setShowPreloader(false); // Hide preloader
    }, 600);
    
    // End transition to reveal page
    setTimeout(() => {
      endTransition();
    }, 1200);
  }, [startTransition, endTransition]);

  // Only show preloader on home page initial load
  if (pathname !== '/' || !showPreloader) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <Preloader onComplete={handlePreloaderComplete} />
    </AnimatePresence>
  );
}

