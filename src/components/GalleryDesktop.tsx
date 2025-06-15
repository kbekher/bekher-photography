
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { GalleryView } from "./GalleryContent";
import { PhotoMetadata } from "@/data";
import { computeDimensions } from "@/utils/utils";
import { getImageMotionScale } from "@/constants/animations";
import Image from "next/image";
import { DOMAIN } from "@/constants/constants";
import imageLoader from "@/utils/image-loader";
import NextGallery from "./NextGallery";

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
              <div className="w-full min-h-screen xl:min-w-[70vw] flex flex-col pt-16 px-5">
                <h1 className="text-4xl md:text-6xl uppercase text-white mb-4" data-cursor="text">{activeGallery.name}</h1>
                <p aria-hidden="true" className="hidden">{activeGallery.description}</p>

                {/* //TODO: arrow scroll down   */}
              </div>

              {/* Images */}
              {activeGallery.photos.map((photo, index) => {
                const { aspectRatio, path, size } = photo;
                const { width, height } = computeDimensions(aspectRatio, size || 800);

                return (
                  <div key={path} className="px-[40px]">
                    <motion.div
                      className='shrink-0 relative w-full h-full flex items-center justify-center max-h-screen overflow-hidden p-0'
                      initial={index === 0 ? false : { opacity: 0, x: 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      style={{ width, height, aspectRatio }}
                    >
                      <motion.div
                        {...getImageMotionScale(1.2, true)}
                        className='-full h-full'
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


export default GalleryDesktop;