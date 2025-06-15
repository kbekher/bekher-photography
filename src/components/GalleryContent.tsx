'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

import { galleriesData, Gallery, PhotoMetadata } from '@/data';
import { computeDimensions } from '@/utils/utils';
import imageLoader from '@/utils/image-loader';
import { useEffect, useMemo, useState } from 'react';
import NextGallery from './NextGallery';
import { useMediaQuery } from 'react-responsive';
import { getImageMotionScale } from '@/constants/animations';
import { DOMAIN } from '@/constants/constants';
import GalleryDesktop from './GalleryDesktop';

export interface GalleryView {
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