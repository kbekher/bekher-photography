"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { galleriesData } from '@/data';

interface Props {
  galleryName: string;
  imgIndex: number;
}

const MotionImage = ({ galleryName, imgIndex }: Props) => {

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const gallery = galleriesData[galleryName as keyof typeof galleriesData];

  const imageSrc = `https://d14lj85n4pdzvr.cloudfront.net/galleries/${galleryName}/${galleryName}-${imgIndex + 1}.jpg`;

  return (
    <div className="overflow-hidden w-full h-full">
      <motion.div
        ref={ref}
        initial={{ scale: 1.2 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="w-full h-full mx-auto relative overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt={`Picture of ${gallery.name}`}
          width={800}
          height={600}
          className="w-full h-auto object-cover object-center"
          draggable="false"
        />
      </motion.div>
    </div>
  );
};

export default MotionImage;




// Version with keeping imhg ratio
//   return (
//     <div className="overflow-hidden">
//       <motion.div
//         ref={ref}
//         initial={{ scale: 1.2, opacity: 1 }}
//         animate={isInView ? { scale: 1, opacity: 1 } : {}}
//         transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }} 
//         className="max-w-[800px] mx-auto relative"
//         style={{ aspectRatio: gallery.photos[imgIndex].aspectRatio }}
//       >
//         <Image
//           src={imageSrc}
//           alt={`Picture of ${gallery.name}`}
//           width={800}
//           height={600}
//           className="object-cover absolute top-0"
//           style={{ aspectRatio: gallery.photos[imgIndex].aspectRatio }}
//           draggable="false"
//         />
//       </motion.div>
//     </div>
//   );


