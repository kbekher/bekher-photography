"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApertureLogo from "./ApertureLogo";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable scrolling while preloader is active
    document.body.style.overflow = 'hidden';
    let loadedImages = 0;
    const REQUIRED_IMAGES = 2; // Wait for first 2 images on home page
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = ''; // Re-enable scrolling
      setTimeout(() => onComplete(), 500); // Smooth transition
    }, 5000); // 5 second maximum timeout

    const handleImageLoad = () => {
      loadedImages++;
      if (loadedImages >= REQUIRED_IMAGES) {
        // Wait a bit more for smooth transition
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = ''; // Re-enable scrolling
          setTimeout(() => onComplete(), 500);
        }, 500);
      }
    };

    const handleImageError = () => {
      loadedImages++; // Count errors as loaded too
      if (loadedImages >= REQUIRED_IMAGES) {
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = ''; // Re-enable scrolling
          setTimeout(() => onComplete(), 500);
        }, 500);
      }
    };

    // Wait for DOM to be ready, then start tracking images
    const checkImages = () => {
      const images = document.querySelectorAll('img');
      
      if (images.length === 0) {
        // No images found, hide preloader
        setIsLoading(false);
        document.body.style.overflow = ''; // Re-enable scrolling
        setTimeout(() => onComplete(), 500);
        return;
      }

      // Track the first 2 images
      const imagesToTrack = Array.from(images).slice(0, REQUIRED_IMAGES);
      
      imagesToTrack.forEach(img => {
        if (img.complete) {
          handleImageLoad();
        } else {
          img.addEventListener('load', handleImageLoad);
          img.addEventListener('error', handleImageError);
        }
      });

      // If all required images are already loaded
      if (loadedImages >= REQUIRED_IMAGES) {
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = ''; // Re-enable scrolling
          setTimeout(() => onComplete(), 500);
        }, 500);
      }
    };

    // Small delay to ensure DOM is ready
    const domTimer = setTimeout(checkImages, 100);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(domTimer);
      
      // Re-enable scrolling when preloader is done
      document.body.style.overflow = '';
      
      // Clean up event listeners
      const images = document.querySelectorAll('img');
      const imagesToTrack = Array.from(images).slice(0, REQUIRED_IMAGES);
      imagesToTrack.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageError);
      });
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { 
              duration: 0.5,
              ease: "easeInOut" 
            }
          }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--background)]"
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { 
                duration: 0.4, 
                ease: "easeInOut" 
              }
            }}
            className="text-l sm:text-xl md:text-2xl flex items-center gap-1" 
            data-cursor="text"
          >
            N
            <div className="animate-spin">
            <ApertureLogo color="#cbcbcf" />
            </div>
            thing Beats Film Photography
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
