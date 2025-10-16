'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { galleriesData } from '@/data';
import { getBestFitRow } from '@/utils/utils';
import imageLoader from '@/utils/image-loader';
import { DOMAIN } from '@/constants/constants';

const GalleriesContent = () => {
  return (
    <section className='pt-[120px] md:pt-[220px] relative'>
      <h1 className='text-6xl md:text-8xl lg:text-9xl text-white tracking-tighter uppercase absolute top-12 md:top-0 left-1/2 -translate-x-1/2 origin-center'>
        Galleries
      </h1>

      <ul className="flex flex-col gap-4 md:gap-10">
        {Object.values(galleriesData).map((gallery) => {
          const { id, name, photos } = gallery;
          const bestFitPhotos = getBestFitRow(photos);

          return (
            <li key={id}>
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
                  {bestFitPhotos.map(({ photo, index, colSpan }, imgIndex) => {
                    // Default to col-span-2 on mobile (8 cols), conditionally override for desktop
                    const colSpanClass = colSpan === 3
                      ? 'col-span-2 md:col-span-3'
                      : 'col-span-2';

                    return (
                      <motion.div
                        key={`${name}-${photo.path}`}
                        className={`overflow-hidden relative ${colSpanClass} ${imgIndex > 3 ? 'hidden md:block' : ''}`}
                        style={{ aspectRatio: photo.aspectRatio }}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      >
                        <div
                          className="w-full h-full absolute inset-0 group"
                        >
                          <Image
                            src={`${DOMAIN}/galleries/${id}/${photo.path}`}
                            alt={`Picture of ${name}`}
                            fill
                            draggable={false}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                            loader={imageLoader}
                          />
                        </div>
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
