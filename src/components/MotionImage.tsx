"use client";

import { useRef, useMemo } from 'react';
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
  const pathname = usePathname();
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isMobile = useMediaQuery({ maxWidth: 1279 });
  const isFirstImage = useMemo(() => {
    return (isMobile && galleryName === 'europeanfeel') || (!isMobile && (galleryName === 'europeanfeel' || galleryName === 'noiretblanc'));
  }, [isMobile, galleryName]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden w-full h-full"
      style={{ aspectRatio: photo.aspectRatio }}
    >
      <motion.div
        key={`${pathname}-${galleryName}-${photo.path}`}
        initial={{ scale: 1.2, opacity: 0.5 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 1.2, opacity: 0.5 }}
        transition={{ duration: 0.8, delay: isFirstImage ? 0.8 : 0.2 }}
        className="w-full h-full group relative"
      >
          <Image
            src={`${DOMAIN}/galleries/${galleryName}/${photo.path}`}
            alt={`Picture from ${galleryName} gallery`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
            draggable="false"
            loader={imageLoader}
            priority={isFirstImage}
            quality={85}
          />
      </motion.div>
    </div>
  );
};

export default MotionImage;