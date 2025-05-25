"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { PhotoMetadata } from '@/data';
import imageLoader from '@/utils/image-loader';

interface Props {
  galleryName: string;
  photo: PhotoMetadata;
}

const MotionImage = ({ galleryName, photo }: Props) => {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  // Use photo.path directly instead of constructing with index
  const imageSrc = `https://d14lj85n4pdzvr.cloudfront.net/galleries/${galleryName}/${photo.path}`;
  
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
        {/* Placeholder with same aspect ratio */}
        <div
          className="absolute inset-0 bg-zinc-800 z-[-1] image-loading"
          style={{ aspectRatio: photo.aspectRatio }}
        />

        <motion.div
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 1.2, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="w-full h-full absolute inset-0"
        >
          <Image
            src={imageSrc}
            alt={`Picture from ${galleryName} gallery`}
            width={800}
            height={600}
            className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ aspectRatio: photo.aspectRatio }}
            draggable="false"
            onLoad={() => setIsLoaded(true)}
            // sizes={`${800}px`}
            priority={galleryName === "fromparistovenice" || galleryName === "noiretblanc"}
            loader={imageLoader}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MotionImage;