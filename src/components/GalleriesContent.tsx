'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { galleriesData, PhotoMetadata } from '@/data';
import { getBestFitRow } from '@/utils/utils';
import imageLoader from '@/utils/image-loader';

const GalleryImage = ({ id, photo, isPriority }: { id: string; photo: PhotoMetadata; isPriority: boolean }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`w-full h-full absolute inset-0 group transition-colors duration-500 ${!isLoaded && !isPriority ? 'image-placeholder' : ''}`}>
      <Image
        src={`/${id}/${photo.path}`}
        alt={`Picture of photo`}
        fill
        draggable={false}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${isPriority ? 'opacity-100' : (isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-1xl')}`}
        loader={imageLoader}
        priority={isPriority}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

const GalleriesContent = () => {
  return (
    <section className='pt-[120px] md:pt-[220px] relative'>
      <h1 className='text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter uppercase absolute top-12 md:top-0 left-1/2 -translate-x-1/2 origin-center'>
        Galleries
      </h1>

      <ul className="flex flex-col gap-4 md:gap-10">
        {Object.values(galleriesData).map((gallery, galleryIndex) => {
          const { id, name, photos } = gallery;
          const bestFitPhotos = getBestFitRow(photos);
          const isPriorityGallery = galleryIndex < 2;

          return (
            <motion.li
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: galleryIndex * 0.15 }}
            >
              <Link
                href={`/galleries/${id}`}
                aria-label={`Go to ${name} gallery page`}
                className='w-full flex flex-col'
                data-cursor="view"
              >
                {/* Title + Divider */}
                <div className='relative py-4'>
                  <div className="absolute top-0 left-0 right-0 h-px bg-[var(--secondary)]" />
                  <p className='w-max text-sm md:text-xl leading-none'>{name}</p>
                </div>

                {/* Gallery Row */}
                <div className='grid grid-cols-8 md:grid-cols-12 gap-x-2 md:gap-x-5 overflow-hidden'>
                  {bestFitPhotos.map(({ photo, colSpan }, imgIndex) => {
                    // Default to col-span-2 on mobile (8 cols), conditionally override for desktop
                    const colSpanClass = colSpan === 3
                      ? 'col-span-2 md:col-span-3'
                      : 'col-span-2';

                    return (
                      <div
                        key={`${name}-${photo.path}`}
                        className={`overflow-hidden relative ${colSpanClass} ${imgIndex > 3 ? 'hidden md:block' : ''}`}
                        style={{ aspectRatio: photo.aspectRatio }}
                      >
                        <GalleryImage
                          id={id}
                          photo={photo}
                          isPriority={isPriorityGallery}
                        />
                      </div>
                    )
                  })}
                </div>
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}

export default GalleriesContent;
