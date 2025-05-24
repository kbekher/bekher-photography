'use client';

import * as React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

import { galleriesData } from '@/data';
import { computeDimensions } from '@/utils/utils';
import imageLoader from '@/utils/image-loader';

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
    const { width } = computeDimensions(photo.aspectRatio, 800);
    return acc + width + 130; // 40px for gap
  }, 0) ?? 0;

  // Add width for next gallery preview (400px) and its gap (40px)
  const totalContentWidth = totalWidth + 580 + window.innerWidth * 0.75;

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
        <div className="h-full relative">
          <div className='overflow-hidden'>
            <motion.div
              className="flex w-min-content"
              style={{ x }}
            >

              {/* Intro div */}
              <div className="w-full min-h-screen xl:min-w-[75vw] flex flex-col pt-[64px] px-[20px]">
                <h1 className="text-[48px] xl:text-[64px] uppercase text-white mb-4">{activeGallery.name}</h1>
                <p className="text-white/70 xl:w-1/2">{activeGallery.description}</p>
              </div>

              {/* Images */}
              {activeGallery.photos.map((photo, index) => {
                const { aspectRatio, path } = photo;
                const { width, height } = computeDimensions(aspectRatio, 800);

                return (

                  <div key={path} className="px-5 md:px-[40px] self-center">
                    <motion.div
                      className={`shrink-0 relative max-h-screen w-[${width}]`}
                      initial={{ opacity: 0, x: 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      style={{
                        width,
                        height,
                        aspectRatio: aspectRatio,
                      }}
                    >
                      <Image
                        src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${activeGalleryName}/${path}`}
                        alt={`Picture of ${activeGallery.name}`}
                        width={width}
                        height={height}
                        draggable={false}
                        // loading={index > 1 ? "lazy" : "eager"}
                        loading="lazy"
                        sizes="(min-width: 1280px) 600px, (min-width: 768px) 400px, 300px" // TODO: remove?
                        className="object-contain w-auto h-full"
                        loader={imageLoader}
                      />
                    </motion.div>
                  </div>
                );
              })}

              {/* Next Gallery Preview */}
              <div className="px-5 md:px-[40px] self-center">
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
                        src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${nextGalleryName}/${nextGallery.photos[0].path}`}
                        alt={`Preview of ${nextGallery.name}`}
                        width={400}
                        height={800}
                        loading="lazy"
                        sizes="(min-width: 1280px) 600px, (min-width: 768px) 400px, 300px" // TODO: remove?
                        draggable={false}
                        className="object-cover w-full h-full"
                        loader={imageLoader}
                      />
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center">
                        <span className="text-white text-2xl mb-2">Next Gallery</span>
                        <span className="text-white text-3xl font-light">{nextGallery.name}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryContent;