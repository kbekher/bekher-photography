import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GalleryView } from "./GalleryContent";
import Image from "next/image";
import { DOMAIN } from "@/constants/constants";
import imageLoader from "@/utils/image-loader";
import NextGallery from "./NextGallery";

const GalleryDesktop = ({ activeGallery, nextGallery }: GalleryView) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Create a spring animation for smoother movement, matching the reference site
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 60,
    restDelta: 0.001
  });

  const [scrollableWidth, setScrollableWidth] = useState(0);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const updateDimensions = () => {
      const contentWidth = contentElement.scrollWidth;
      const windowWidth = window.innerWidth;
      // Calculate the exact overflow width
      setScrollableWidth(Math.max(0, contentWidth - windowWidth));
    };

    // Use ResizeObserver to reliably update dimensions when content or window size changes
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(contentElement);

    // Initial calculation
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Transform scroll progress to horizontal movement
  const x = useTransform(
    smoothProgress,
    [0, 1],
    [0, -scrollableWidth]
  );

  return (
    // Set the container height to the calculated overflow width
    <div ref={containerRef} style={{ height: `${scrollableWidth}px` }}>
      <div className="sticky top-0 h-screen">
        <div className="h-full relative">
          <div className='overflow-hidden'>
            <motion.div ref={contentRef} className="flex w-max items-center" style={{ x }}>

              {/* Intro div */}
              <div className="w-full min-h-screen flex flex-col pt-16 px-5" style={{ width: "75vw" }} >
                <h1 className="text-4xl md:text-6xl uppercase text-white mb-4" data-cursor="text">{activeGallery.name}</h1>
                <p aria-hidden="true" className="hidden">{activeGallery.description}</p>
              </div>

              {/* Images */}
              {activeGallery.photos.map((photo, index) => (
                <div key={photo.path}>
                  <motion.div
                    className={`shrink-0 relative flex items-center justify-center h-screen ${photo.styles}`}
                    initial={index === 0 ? false : { opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className='relative h-full' style={{ aspectRatio: photo.aspectRatio }}>
                      <Image
                        src={`${DOMAIN}/galleries/${activeGallery.id}/${photo.path}`}
                        alt={`Picture of ${activeGallery.name}`}
                        className={`object-cover object-center`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loader={imageLoader}
                        loading={index > 0 ? "lazy" : "eager"}
                        priority={index === 0}
                      />
                    </div>
                  </motion.div>
                </div>
              ))}

              {/* Next Gallery Preview */}
              <div className="">
                <NextGallery nextGallery={nextGallery} isDesktop={true} />
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDesktop;