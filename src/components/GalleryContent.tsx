'use client';

import * as React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

import { galleriesData } from '@/data';
import { computeDimensions } from '@/utils/utils';

const GalleryContent = () => {
  const params = useParams();
  const { galleryName } = params as { galleryName: string };
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Create a spring animation for smoother movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const gallery = galleriesData[galleryName as keyof typeof galleriesData];
  const galleryNames = Object.keys(galleriesData);
  const currentIndex = galleryNames.indexOf(galleryName);
  const nextGalleryName = galleryNames[(currentIndex + 1) % galleryNames.length];
  const nextGallery = galleriesData[nextGalleryName as keyof typeof galleriesData];

  const [prevValidGalleryName, setPrevValidGalleryName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (gallery && galleryName) {
      setPrevValidGalleryName(galleryName);
    }
  }, [gallery, galleryName]);

  const activeGalleryName = gallery ? galleryName : prevValidGalleryName;
  const activeGallery = galleriesData[activeGalleryName as keyof typeof galleriesData];

  // Calculate total width of all images including the next gallery preview
  const totalWidth = activeGallery?.photos.reduce((acc, photo) => {
    const { width } = computeDimensions(photo.aspectRatio, 600);
    return acc + width + 40; // 40px for gap
  }, 0) ?? 0;

  // Add width for next gallery preview (400px) and its gap (40px)
  const totalContentWidth = totalWidth + 400 + 220;

  // Transform scroll progress to horizontal movement
  const x = useTransform(
    smoothProgress,
    [0, 1],
    [0, -totalContentWidth + (typeof window !== 'undefined' ? window.innerWidth : 0)]
  );

  if (!activeGallery) {
    return <div>Gallery not found.</div>;
  }

  return (
    <div ref={containerRef} className="h-[1300vh]">
      <div className="sticky top-0 h-screen">
        <section className="h-full relative">
          {/* Info */}
          <div className="absolute top-[120px] left-10 z-10">
            <h1 className="text-[48px] text-white">{activeGallery.name}</h1>
            <p className="text-white/70">{activeGallery.description}</p>
          </div>

          {/* Images Container */}
          <motion.div
            className="flex gap-10 px-10 h-full items-center"
            style={{ x }}
          >
            {activeGallery.photos.map((photo, index) => {
              const { width, height } = computeDimensions(photo.aspectRatio, 600);

              return (
                <motion.div
                  key={index}
                  className="shrink-0 relative"
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    width,
                    height,
                    aspectRatio: photo.aspectRatio,
                  }}
                >
                  <Image
                    src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${activeGalleryName}/${activeGalleryName}-${index + 1}.jpg`}
                    alt={`Picture of ${activeGallery.name}`}
                    width={width}
                    height={height}
                    draggable={false}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              );
            })}

            {/* Next Gallery Preview */}
            <motion.div
              className="shrink-0 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href={`/galleries/${nextGalleryName}`}>
                <div className="w-[400px] h-screen relative">
                  <Image
                    src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${nextGalleryName}/${nextGalleryName}-1.jpg`}
                    alt={`Preview of ${nextGallery.name}`}
                    width={300}
                    height={500}
                    draggable={false}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <span className="text-white text-2xl mb-2">Next Gallery</span>
                    <span className="text-white text-3xl font-light">{nextGallery.name}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default GalleryContent;