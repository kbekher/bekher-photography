'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

import { galleriesData } from '@/data';
import { computeDimensions } from '@/utils/utils';
import imageLoader from '@/utils/image-loader';
import { useEffect, useRef, useState } from 'react';

const GalleryContent = () => {
  const params = useParams();
  const { galleryName } = params as { galleryName: string };
  const containerRef = useRef<HTMLDivElement>(null);

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

  const [prevValidGalleryName, setPrevValidGalleryName] = useState<string | null>(null);
  // const [isDesktop, setIsDesktop] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (gallery && galleryName) {
      setPrevValidGalleryName(galleryName);
    }
  }, [gallery, galleryName]);

  const activeGalleryName = gallery ? galleryName : prevValidGalleryName;
  const activeGallery = galleriesData[activeGalleryName as keyof typeof galleriesData];

  const introWidth = windowWidth * 0.7;         // 70vw
  const imageGap = 80;                          // Each image has 2 x 40px padding = 40px
  const nextGalleryWidth = 500;                // Width of preview
  const nextGalleryMargin = 400;               // `ml-[400px]`

  // Calculate total width of all images including the next gallery preview
  const totalWidth = activeGallery?.photos.reduce((acc, photo) => {
    const { width } = computeDimensions(photo.aspectRatio, photo.size || 800);
    return acc + width + imageGap + photo.buffer;
  }, 0) ?? 0;

  const totalContentWidth = totalWidth + introWidth + nextGalleryWidth + nextGalleryMargin;

  // Transform scroll progress to horizontal movement
  const x = useTransform(
    smoothProgress,
    [0, 1],
    [0, -totalContentWidth + windowWidth]
  );

  if (!activeGallery) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-white text-xl">404 — No frames to be found.</p>
      </div>
    )
  }

  // MOBILE: stacked column layout
  if (windowWidth < 1280) {
    return (
      <div className="flex flex-col gap-4">
        <div className='px-5 pt-[64px]'>
          <h1 className="text-4xl md:text-6xl text-white uppercase mb-2">{activeGallery.name}</h1>
          {/* <p className="text-white/70">{activeGallery.description}</p> */}
        </div>

        {activeGallery.photos.map((photo) => {
          const { aspectRatio, path, styles } = photo;
          const { width, height } = computeDimensions(aspectRatio, 400); // smaller for mobile

          return (
            <div key={path} className={`w-full flex justify-center items-center overflow-hidden ${styles}`}>
              <motion.div
                className="w-full"
                initial={{ opacity: 0.6, scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ amount: 0.5 }}
              >
                <Image
                  src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${activeGalleryName}/${path}`}
                  alt={`Picture of ${activeGallery.name}`}
                  width={width}
                  height={height}
                  loading="lazy"
                  sizes="400px"
                  className="w-full h-auto object-contain"
                  loader={imageLoader}
                />
              </motion.div>
            </div>
          );
        })
        }

        {/* Optional: Show next gallery preview at the bottom */}
        <div className="w-full mt-10">
          <Link href={`/galleries/${nextGalleryName}`}>
            <div className="relative w-full h-[250px]">
              <Image
                src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${nextGalleryName}/${nextGallery.photos[0].path}`}
                alt={`Preview of ${nextGallery.name}`}
                fill
                className="object-cover"
                loader={imageLoader}
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-center">
                <div>
                  <p className="text-xl font-light">Next Collection</p>
                  <p className="text-2xl uppercase">{nextGallery.name}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div >
    );
  }

  return (
    <div ref={containerRef} className="h-[1300vh]">
      <div className="sticky top-0 h-screen">
        <div className="h-full relative">
          <div className='overflow-hidden'>
            <motion.div
              className="flex w-min-content items-center"
              style={{ x }}
            >

              {/* Intro div */}
              <div className="w-full min-h-screen xl:min-w-[70vw] flex flex-col pt-[64px] px-[20px]">
                <h1 className="text-[48px] xl:text-[64px] uppercase text-white mb-4">{activeGallery.name}</h1>
                {/* <p className="text-white/70 xl:w-1/2">{activeGallery.description}</p> */}
              </div>

              {/* Images */}
              {activeGallery.photos.map((photo, index) => {
                const { aspectRatio, path, styles, size } = photo;
                const { width, height } = computeDimensions(aspectRatio, size || 800);

                return (

                  <div key={path} className="px-[40px]">
                    <motion.div
                      className={`shrink-0 relative w-full h-full flex items-center justify-center max-h-screen overflow-hidden ${styles}`}
                      initial={index === 0 ? false : { opacity: 0, x: 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      style={{
                        width,
                        height,
                        aspectRatio: aspectRatio,
                      }}
                    >
                      <motion.div
                        initial={{ scale: 1.2, opacity: 0.6 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                        className="w-full h-full"
                      >
                        <Image
                          src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${activeGalleryName}/${path}`}
                          alt={`Picture of ${activeGallery.name}`}
                          width={width}
                          height={height}
                          draggable={false}
                          // loading={index === 0 ? 'eager' : 'lazy'}
                          // loading="lazy"
                          sizes="400px"
                          className="w-auto h-full object-contain"
                          loader={imageLoader}
                          priority={index === 0}
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}

              {/* Next Gallery Preview */}
              <div className="ml-[400px]">
                <motion.div
                  className="shrink-0 relative"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/galleries/${nextGalleryName}`}>
                    <div className="w-[500px] h-screen relative">
                      <Image
                        src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${nextGalleryName}/${nextGallery.photos[0].path}`}
                        alt={`Preview of ${nextGallery.name}`}
                        width={500}
                        height={800}
                        loading="lazy"
                        // sizes="400px"
                        draggable={false}
                        className="object-cover w-full h-full"
                        loader={imageLoader}
                      />
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center">
                        <span className="text-white text-2xl mb-2 font-light">Next Collection</span>
                        <span className="text-white text-3xl uppercase">{nextGallery.name}</span>
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