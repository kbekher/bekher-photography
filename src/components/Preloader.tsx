"use client";

import { useEffect, useRef } from "react";
import ApertureLogo from "./ApertureLogo";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const hasFinished = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Min time the loader should be visible
    const MIN_TIME = 2000;
    const MAX_TIME = 5000;

    const startTime = Date.now();

    const finish = () => {
      if (hasFinished.current) return;
      hasFinished.current = true;

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_TIME - elapsed);

      setTimeout(() => {
        document.body.style.overflow = '';
        onComplete();
      }, remaining);
    };

    // We can try to wait for images, but for now let's use a solid timer approach 
    // that feels right for the animation.
    const timeoutId = setTimeout(finish, MAX_TIME);

    // If we want to be smarter, we could check for first few images
    const checkReady = () => {
      const images = Array.from(document.images);
      const loadedCount = images.filter(img => img.complete).length;
      if (loadedCount >= 2) {
        finish();
      } else {
        setTimeout(checkReady, 200);
      }
    };

    const readyTimer = setTimeout(checkReady, 500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(readyTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-[var(--background)]">
      <div className="text-l sm:text-xl md:text-2xl flex items-center gap-1" data-cursor="text">
        N
        <div className="animate-spin">
          <ApertureLogo color="#cbcbcf" />
        </div>
        thing Beats Film Photography
      </div>
    </div>
  );
}

export default Preloader;
