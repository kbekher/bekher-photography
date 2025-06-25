"use client";

import { useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { PhotoMetadata } from '@/data';
import imageLoader from '@/utils/image-loader';
import { DOMAIN } from '@/constants/constants';
import { useMediaQuery } from 'react-responsive';

interface Props {
  galleryName: string;
  photo: PhotoMetadata;
}

const MotionImage = ({ galleryName, photo }: Props) => {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isMobile = useMediaQuery({ maxWidth: 1279 });
  const isFirstImage = useMemo(() => {
    return (isMobile && galleryName === 'europeanfeel') || (!isMobile && (galleryName === 'europeanfeel' || galleryName === 'noiretblanc'));
  }, [isMobile, galleryName]);

  // Reset animation when path changes
  useEffect(() => {
    setIsLoaded(false);
  }, [pathname]);

  return (
    <div className="relative overflow-hidden w-full h-full">
      <motion.div
        key={`${pathname}-${galleryName}-${photo.path}`}
        ref={ref}
        className="w-full h-full mx-auto relative overflow-hidden"
      >

        <div
          className="relative inset-0 z-[-1] bg-zinc-800 image-loading"
          style={{ aspectRatio: photo.aspectRatio }}
        />

        <motion.div
          initial={{ scale: 1.2, opacity: isFirstImage ? 1 : 0.5 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 1.2, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: isFirstImage ? 0.5 : 0.2 }}
          className="w-full h-full absolute inset-0 group"
        >
          <Image
            src={`${DOMAIN}/galleries/${galleryName}/${photo.path}`}
            alt={`Picture from ${galleryName} gallery`}
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`w-full h-full object-cover object-center transition-transform ease-in-out group-hover:scale-105 transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ aspectRatio: photo.aspectRatio }}
            draggable="false"
            onLoad={() => setIsLoaded(true)}
            loader={imageLoader}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MotionImage;