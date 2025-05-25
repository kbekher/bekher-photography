'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { galleriesData } from '@/data';
import { computeDimensions, getBestFitRow } from '@/utils/utils';
import imageLoader from '@/utils/image-loader';

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

          return (
            <li key={id}>
              <Link
                href={`/galleries/${id}`}
                aria-label={`Go to ${name} gallery page`}
                className='w-full flex flex-col'
              >
                {/* Title + Divider */}
                <div className='relative py-4'>
                  <div className="absolute top-0 left-0 right-0 h-px bg-[var(--secondary)]" />
                  <p className='w-max leading-none'>{name}</p>
                </div>

                {/* Gallery Row */}
                <div className='grid grid-cols-8 md:grid-cols-12 gap-x-2 md:gap-x-5 h-max-[230px] overflow-hidden'>
                  {bestFitPhotos.map(({ photo, index, colSpan }, itemIndex) => {
                    const { width, height } = computeDimensions(photo.aspectRatio, 200);

                    // Default to col-span-2 on mobile (8 cols), conditionally override for desktop
                    const colSpanClass = colSpan === 3
                      ? 'col-span-2 md:col-span-3'
                      : 'col-span-2';

                    return (
                      <motion.div
                        key={`${name}-${photo.path}`}
                        className={`relative ${colSpanClass} ${itemIndex > 3 ? 'hidden md:block' : 'block'}`}
                        style={{ aspectRatio: photo.aspectRatio }}
                        initial={itemIndex < 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Image
                          src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${id}/${photo.path}`}
                          alt={`Picture of ${name}`}
                          width={width}
                          height={height}
                          draggable={false}
                          sizes="400px"
                          className="object-cover w-full h-full"
                          loader={imageLoader}
                          priority={galleryIndex < 2}
                        />
                      </motion.div>
                    )
                  })}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default GalleriesContent;
