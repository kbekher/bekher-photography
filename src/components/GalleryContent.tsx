'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

import { galleriesData, Gallery, PhotoMetadata } from '@/data';
import { computeDimensions } from '@/utils/utils';
import imageLoader from '@/utils/image-loader';
import { useEffect, useMemo, useRef, useState } from 'react';
import NextGallery from './NextGallery';
import { useMediaQuery } from 'react-responsive';
import { getImageMotionScale } from '@/constants/animations';
import { DOMAIN } from '@/constants/constants';

interface GalleryView {
  activeGallery: Gallery;
  nextGallery: Gallery;
}

const GalleryMobile = ({ activeGallery, nextGallery }: GalleryView) => (
  <div className="flex flex-col gap-4">
    <div className='px-5 pt-16'>
      <h1 className="text-4xl md:text-6xl text-white uppercase mb-2" data-cursor="text">{activeGallery.name}</h1>
      <p aria-hidden="true" className="hidden">{activeGallery.description}</p>
    </div>

    {activeGallery.photos.map((photo: PhotoMetadata, index) => {
      const { aspectRatio, path, styles } = photo;
      const { width, height } = computeDimensions(aspectRatio, 400); // smaller for mobile

      return (
        <div key={path} className={`w-full relative ${styles}`}>
          {/* Outer wrapper that defines the clip boundary */}
          <div className="w-full overflow-hidden" >
            <motion.div
              // className="w-full h-full"
              {...getImageMotionScale()}
            >
              <Image
                src={`${DOMAIN}/galleries/${activeGallery.id}/${path}`}
                alt={`Picture of ${activeGallery.name}`}
                className="w-full h-full object-cover"
                width={width}
                height={height}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                //sizes="
                //  (max-width: 320px) 256px,
                //  (max-width: 480px) 384px,
                //  (max-width: 768px) 640px,
                //  (max-width: 1024px) 828px,
                //  (max-width: 1280px) 1080px,
                //  (max-width: 1440px) 1200px,
                //  1200px
                // "
                loader={imageLoader}
                loading={index > 0 ? "lazy" : "eager"}
                priority={index === 0}
              />
            </motion.div>
          </div>
        </div>
      );
    })
    }

    <NextGallery nextGallery={nextGallery} />
  </div >
);

const GalleryDesktop = ({ activeGallery, nextGallery }: GalleryView) => {
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

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const introWidth = windowWidth * 0.7;         // 70vw
  const imageGap = 80;                          // Each image has 2 x 40px padding = 40px
  const nextGalleryWidth = 500;                // Width of preview
  const nextGalleryMargin = 400;               // `ml-[400px]`

  // Calculate total width of all images including the next gallery preview
  const totalWidth = useMemo(() => {
    return activeGallery?.photos.reduce((acc: number, photo: PhotoMetadata) => {
      const { width } = computeDimensions(photo.aspectRatio, photo.size || 800);
      return acc + width + imageGap + activeGallery.buffer;
    }, 0) ?? 0;
  }, [activeGallery, imageGap]);

  const totalContentWidth = useMemo(() => {
    return totalWidth + introWidth + nextGalleryWidth + nextGalleryMargin;
  }, [totalWidth, introWidth, nextGalleryWidth, nextGalleryMargin]);

  // Transform scroll progress to horizontal movement
  const x = useTransform(
    smoothProgress,
    [0, 1],
    [0, -totalContentWidth + windowWidth]
  );

  return (
    <div ref={containerRef} className="h-[1300vh]">
      <div className="sticky top-0 h-screen">
        <div className="h-full relative">
          <div className='overflow-hidden'>
            <motion.div className="flex w-max items-center" style={{ x }}>

              {/* Intro div */}
              <div className="w-full min-h-screen xl:min-w-[70vw] flex flex-col pt-16 px-10">
                <h1 className="text-4xl md:text-6xl uppercase text-white mb-4" data-cursor="text">{activeGallery.name}</h1>
                <p aria-hidden="true" className="hidden">{activeGallery.description}</p>
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
                      style={{ width, height, aspectRatio }}
                    >
                      <motion.div
                        {...getImageMotionScale(1.2)}
                        className="w-full h-full"
                        style={{ willChange: 'transform, opacity', transformStyle: 'preserve-3d' }}
                      >
                        <Image
                          src={`${DOMAIN}/galleries/${activeGallery.id}/${path}`}
                          alt={`Picture of ${activeGallery.name}`}
                          className="w-auto h-full object-contain"
                          width={width}
                          height={height}
                          draggable={false}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          //sizes="
                          //  (max-width: 320px) 256px,
                          //  (max-width: 480px) 384px,
                          //  (max-width: 768px) 640px,
                          //  (max-width: 1024px) 828px,
                          //  (max-width: 1280px) 1080px,
                          //  (max-width: 1440px) 1200px,
                          //  1200px
                          // "
                          loader={imageLoader}
                          loading={index > 0 ? "lazy" : "eager"}
                          priority={index === 0}
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}

              {/* Next Gallery Preview */}
              <NextGallery nextGallery={nextGallery} isDesktop={true} />

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GalleryContent = () => {
  const params = useParams();
  const { galleryName } = params as { galleryName: string };

  const isMobile = useMediaQuery({ maxWidth: 1279 });

  const [prevValidGalleryName, setPrevValidGalleryName] = useState<string | null>(null);

  const galleryList = useMemo(() => Object.values(galleriesData), []);
  const gallery = useMemo(() => galleryList.find(g => g.id === galleryName), [galleryList, galleryName]);
  const currentIndex = useMemo(() => galleryList.findIndex(g => g.id === galleryName), [galleryList, galleryName]);
  const nextGallery = galleryList[(currentIndex + 1) % galleryList.length];

  useEffect(() => {
    if (galleryName && galleriesData[galleryName as keyof typeof galleriesData]) {
      setPrevValidGalleryName(galleryName);
    }
  }, [galleryName]);

  const activeGalleryName = gallery ? galleryName : prevValidGalleryName;
  const activeGallery = galleriesData[activeGalleryName as keyof typeof galleriesData];

  if (!activeGallery) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <h2 className="text-white text-xl" role="alert">404 — No frames to be found.</h2>
      </div>
    )
  }

  return isMobile ? (
    <GalleryMobile activeGallery={activeGallery} nextGallery={nextGallery} />
  ) : (
    <GalleryDesktop activeGallery={activeGallery} nextGallery={nextGallery} />
  )
};

export default GalleryContent;