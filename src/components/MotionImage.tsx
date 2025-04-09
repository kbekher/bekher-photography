"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { galleriesData } from '@/data';

interface Props {
  galleryName: string;
  imgIndex: number;
}

const MotionImage = ({ galleryName, imgIndex }: Props) => {
  const ref = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const gallery = galleriesData[galleryName as keyof typeof galleriesData];
  const imageSrc = `https://d14lj85n4pdzvr.cloudfront.net/galleries/${galleryName}/${galleryName}-${imgIndex + 1}.jpg`;

  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* Placeholder while image is loading */}
      {/* {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-[fadeOut_1s_ease-out] z-20" />
      )} */}

      <motion.div
        ref={ref}
        initial={{ scale: 1.2, opacity: 0.5 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }} 
        transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
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
