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
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [startTime] = useState(Date.now());
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const REQUIRED_IMAGES = 3; // Only wait for first 3 images
  const MIN_LOADING_TIME = 2000; // 2 seconds minimum

  // // Manage body overflow
  // useEffect(() => {
  //   if (loading) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'unset';
  //   }

  //   return () => {
  //     document.body.style.overflow = 'unset';
  //   };
  // }, [loading]);

  // Ensure minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, MIN_LOADING_TIME);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Count all images on the page
    const countImages = () => {
      const images = document.querySelectorAll('img');
      return Math.min(images.length, REQUIRED_IMAGES); // Only count first 3
    };

    // Track image loading
    const handleImageLoad = () => {
      setImagesLoaded(prev => prev + 1);
    };

    // Wait for DOM to be ready, then count images
    const timer = setTimeout(() => {
      const imageCount = countImages();
      
      if (imageCount === 0) {
        // No images found, hide preloader after minimum time
        setTimeout(() => {
          if (minTimeElapsed) {
            setLoading(false);
            setTimeout(() => setIsContentVisible(true), 100);
          }
        }, Math.max(0, MIN_LOADING_TIME - (Date.now() - startTime)));
        return;
      }

      // Add load event listeners to first 3 images only
      const images = document.querySelectorAll('img');
      const imagesToTrack = Array.from(images).slice(0, REQUIRED_IMAGES);
      
      imagesToTrack.forEach(img => {
        if (img.complete) {
          handleImageLoad();
        } else {
          img.addEventListener('load', handleImageLoad);
          img.addEventListener('error', handleImageLoad); // Count errors as loaded too
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      // Clean up event listeners
      const images = document.querySelectorAll('img');
      const imagesToTrack = Array.from(images).slice(0, REQUIRED_IMAGES);
      imagesToTrack.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, [minTimeElapsed, startTime]);

  // Hide preloader when conditions are met
  useEffect(() => {
    if (minTimeElapsed && imagesLoaded >= REQUIRED_IMAGES) {
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setIsContentVisible(true), 100);
      }, 300); // Small delay for smooth transition
    }
  }, [imagesLoaded, minTimeElapsed]);

  return (
    <main className={montserrat.className}>
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
              {isContentVisible ? (
                children
              ) : (
                <div className="min-h-screen" />
              )}
              <Footer />
            </MenuProvider>
          </div>
        </div>
      </div>
    </main>
  );
}