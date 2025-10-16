"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import ApertureLogo from "./ApertureLogo";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const REQUIRED_IMAGES = 2;
  const MIN_LOADING_TIME = 2000; // 2 seconds minimum

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    let loadCount = 0;
    let imagesLoaded = false;
    let minTimeElapsed = false;

    const checkIfComplete = () => {
      if (imagesLoaded && minTimeElapsed) {
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
        onComplete();
      }
    };

    const handleImageLoad = () => {
      loadCount++;
      
      if (loadCount >= REQUIRED_IMAGES) {
        imagesLoaded = true;
        checkIfComplete();
      }
    };

    // Minimum loading time
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      checkIfComplete();
    }, MIN_LOADING_TIME);

    // Wait for DOM to be ready
    const domTimer = setTimeout(() => {
      const images = document.querySelectorAll('img');
      const imagesToTrack = Array.from(images).slice(0, REQUIRED_IMAGES);
      
      if (imagesToTrack.length === 0) {
        // No images, still wait for minimum time
        return;
      }

      imagesToTrack.forEach(img => {
        if (img.complete) {
          handleImageLoad();
        } else {
          img.addEventListener('load', handleImageLoad);
          img.addEventListener('error', handleImageLoad);
        }
      });
    }, 100);

    return () => {
      clearTimeout(domTimer);
      clearTimeout(minTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { 
          duration: 0.5,
          delay: 0.3,
          ease: "easeOut" 
        }
      }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--background)]"
    >
      <motion.div 
        className="text-l sm:text-xl md:text-2xl flex items-center gap-1" 
        data-cursor="text"
        exit={{
          opacity: 0,
          transition: {
            duration: 0.3,
            ease: "easeOut"
          }
        }}
      >
        N
        <div className="animate-spin">
          <ApertureLogo color="#cbcbcf" />
        </div>
        thing Beats Film Photography
      </motion.div>
    </motion.div>
  );
}

export default Preloader;
