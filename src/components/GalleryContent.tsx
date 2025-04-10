'use client';

import * as React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

import { galleriesData } from '@/data';
import { computeDimensions } from '@/utils/utils';

const GalleryContent = () => {
  const params = useParams();
  const { galleryName } = params as { galleryName: string };

  const gallery = galleriesData[galleryName as keyof typeof galleriesData];

  const [prevValidGalleryName, setPrevValidGalleryName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (gallery && galleryName) {
      setPrevValidGalleryName(galleryName);
    }
  }, [gallery, galleryName]);

  const activeGalleryName = gallery ? galleryName : prevValidGalleryName;
  const activeGallery = galleriesData[activeGalleryName as keyof typeof galleriesData];

  if (!activeGallery) {
    return <div>Gallery not found.</div>;
  }

  return (
    <section className="pt-[120px]">
      <div className="min-w-max flex gap-10 px-10">
        {/* Info */}
        <div className="shrink-0 w-[400px] flex flex-col justify-center">
          <h1 className="text-[48px] text-white">{activeGallery.name}</h1>
          <p className="text-white/70">{activeGallery.description}</p>
        </div>

        {/* Images */}
        {activeGallery.photos.map((photo, index) => {
          const { width, height } = computeDimensions(photo.aspectRatio, 500);

          return (
            <motion.div
              key={index}
              className="shrink-0 relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
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
      </div>
    </section>
  );
};

export default GalleryContent;
