"use client";

import { useState } from 'react';
import Image from 'next/image';
import { PhotoMetadata } from '@/data';
import imageLoader from '@/utils/image-loader';

interface Props {
  galleryName: string;
  photo: PhotoMetadata;
  priority?: boolean;
}

const StaticImage = ({ galleryName, photo, priority = false }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden w-full transition-colors duration-500 ${!isLoaded ? 'image-placeholder' : ''}`}
      style={{
        aspectRatio: photo.aspectRatio,
        maxHeight: '82vh',
        width: '100%',
        maxWidth: `calc(82vh * (${photo.aspectRatio}))`
      }}
    >
      <div className="w-full h-full relative">
        <Image
          src={`/${galleryName}/${photo.path}`}
          alt={`Picture from ${galleryName} gallery`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 85vw"
          className={`object-cover object-center transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-1xl'}`}
          draggable="false"
          priority={priority}
          loading={priority ? "eager" : "lazy"}

          quality={90}
          loader={imageLoader}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
};

export default StaticImage;
