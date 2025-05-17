"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { galleriesData } from '@/data';
import { usePathname } from 'next/navigation';

interface Props {
  galleryName: string;
  imgIndex: number;
}

const MotionImage = ({ galleryName, imgIndex }: Props) => {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname(); // Get current path
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  const gallery = galleriesData[galleryName as keyof typeof galleriesData];
  const imageSrc = `https://d14lj85n4pdzvr.cloudfront.net/galleries/${galleryName}/${galleryName}-${imgIndex + 1}.jpg`;

  // Reset animation when path changes
  useEffect(() => {
    setIsLoaded(false);
  }, [pathname]);

  return (
    <div className="relative overflow-hidden w-full h-full">
      <motion.div
        key={`${pathname}-${galleryName}-${imgIndex}`} // Force re-render on path change
        ref={ref}
        initial={{ scale: 1.2, opacity: 0.5 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 1.2, opacity: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="w-full h-full mx-auto relative overflow-hidden"
      >
        {/* Placeholder */}
        <div className="absolute inset-0 bg-zinc-800 z-[-1]" />

        <Image
          src={imageSrc}
          alt={`Picture of ${gallery.name}`}
          width={800}
          height={600}
          className={`w-full h-auto object-cover object-center transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          draggable="false"
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </div>
  );
};

export default MotionImage;