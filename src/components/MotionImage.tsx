"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { PhotoMetadata } from '@/data';
import imageLoader from '@/utils/image-loader';
import { useMediaQuery } from 'react-responsive';
import { useUI } from '@/contexts/MenuContext';

interface Props {
  galleryName: string;
  photo: PhotoMetadata;
  priority?: boolean;
}

const MotionImage = ({ galleryName, photo, priority = false }: Props) => {
  const ref = useRef(null);
  const pathname = usePathname();
  const { isPreloaderFinished } = useUI();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const mediaQuery = useMediaQuery({ maxWidth: 1279 });

  useEffect(() => {
    setIsMobile(mediaQuery);
  }, [mediaQuery]);

  // Only trigger once both the element is in view AND the preloader is finished
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const shouldAnimate = isInView && isPreloaderFinished;

  // Use either the explicit priority prop or the legacy logic for the homepage
  const shouldBePriority = useMemo(() => {
    if (priority) return true;
    return (isMobile && galleryName === 'european-feel') || (!isMobile && (galleryName === 'european-feel' || galleryName === 'noir-et-blanc'));
  }, [priority, isMobile, galleryName]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden w-full h-full transition-colors duration-500 ${!isLoaded ? 'image-placeholder' : ''}`}
      style={{ aspectRatio: photo.aspectRatio }}
    >
      <motion.div
        key={`${pathname}-${galleryName}-${photo.path}`}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={shouldAnimate ? { scale: 1, opacity: 1 } : { scale: 1.1, opacity: 0 }}
        transition={{
          duration: 0.8,
          delay: shouldBePriority ? 0.2 : 0.1,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
        className="w-full h-full group relative"
      >
        <Image
          src={`/${galleryName}/${photo.path}`}
          alt={`Picture from ${galleryName} gallery`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 75vw"
          className={`object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-1xl'}`}
          draggable="false"
          priority={shouldBePriority}
          loader={imageLoader}
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
};

export default MotionImage;