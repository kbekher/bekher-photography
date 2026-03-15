'use client';

import { useMemo } from 'react';
import { galleriesData, PhotoMetadata, Gallery } from '@/data';
import StaticImage from './StaticImage';
import NextGallery from './NextGallery';

export interface GalleryView {
  activeGallery: Gallery;
  nextGallery: Gallery;
}

// Artistic layout variations to ensure the gallery doesn't feel repetitive
// We vary the column spanning, the order (text first vs image first), and image alignment
const ARTISTIC_LAYOUTS = [
  // 1. Text Left (4cols), Image Right (8cols)
  { text: "md:col-span-4", image: "md:col-span-8", textFirst: true, imageAlign: "md:justify-start" },
  // 2. Image Left (8cols), Text Right (4cols)
  { text: "md:col-span-4", image: "md:col-span-8", textFirst: false, imageAlign: "md:justify-end" },
  // 3. Staggered: Text Left (3cols), Image Center-Right (7cols)
  { text: "md:col-start-2 md:col-span-3", image: "md:col-start-5 md:col-span-7", textFirst: true, imageAlign: "md:justify-center" },
  // 4. Staggered: Image Center-Left (7cols), Text Right (3cols)
  { text: "md:col-start-10 md:col-span-3", image: "md:col-start-2 md:col-span-8", textFirst: false, imageAlign: "md:justify-center" },
  // 5. Narrow Center: Image (6cols) centered, Text Left (3cols)
  { text: "md:col-start-1 md:col-span-3", image: "md:col-start-4 md:col-span-7", textFirst: true, imageAlign: "md:justify-center" },
  // 6. Wide Focus: Image (9cols) pushed left, Text Right (3cols)
  { text: "md:col-start-10 md:col-span-3", image: "md:col-start-1 md:col-span-9", textFirst: false, imageAlign: "md:justify-start" },
];

const GalleryContent = ({ galleryName }: { galleryName: string }) => {
  const galleryList = useMemo(() => Object.values(galleriesData), []);
  const gallery = useMemo(() => galleryList.find(g => g.id === galleryName), [galleryList, galleryName]);
  const currentIndex = useMemo(() => galleryList.findIndex(g => g.id === galleryName), [galleryList, galleryName]);

  const nextGalleries = useMemo(() => {
    if (currentIndex === -1) return [];
    return [
      galleryList[(currentIndex + 1) % galleryList.length],
      galleryList[(currentIndex + 2) % galleryList.length]
    ];
  }, [galleryList, currentIndex]);

  const activeGallery = gallery;

  if (!activeGallery) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <h2 className="text-white text-xl" role="alert">404 — No frames to be found.</h2>
      </div>
    );
  }

  // Use the gallery index to offset the layout sequence, so each gallery feels different
  const layoutOffset = currentIndex !== -1 ? currentIndex : 0;

  return (
    <div className="w-full min-h-full h-auto mx-auto max-w-[100vw] overflow-x-hidden px-0 md:px-[60px] pb-[140px] pt-16 text-white font-normal">
      <div className='mb-24 px-5 md:px-0'>
        <h1 className="text-4xl md:text-8xl text-center max-w-max uppercase mb-8 mx-auto font-bold" data-cursor="text">
          {activeGallery.name}
        </h1>
        <p className="md:ml-auto max-w-2xl text-sm md:text-xl text-[var(--secondary)] leading-tight" data-cursor="text">
          {activeGallery.description}
        </p>
      </div>

      <div className="flex flex-col gap-y-[60px] md:gap-y-[130px] px-5 md:px-0">
        {activeGallery.photos.map((photo: PhotoMetadata, index) => {
          const layout = ARTISTIC_LAYOUTS[(index + layoutOffset) % ARTISTIC_LAYOUTS.length];

          return (
            <div key={photo.path} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              {/* Text side */}
              <div className={`${layout.text} flex flex-col gap-2 ${layout.textFirst ? 'order-2 md:order-1 md:items-end md:text-right' : 'order-2 md:items-start md:text-left'}`}>
                {photo.description && (
                  <p className="text-sm md:text-base text-white/80 leading-tight max-w-sm" data-cursor="text">
                    &ldquo;{photo.description}&rdquo;
                  </p>
                )}
                <div className="text-[11px] md:text-[13px] uppercase tracking-[0.1em] text-[var(--secondary)]">
                  {photo.place && <span className="font-bold text-white" data-cursor="text">{photo.place}</span>}
                  {photo.year && <span data-cursor="text">, {photo.year}</span>}
                </div>
              </div>

              {/* Image side */}
              <div className={`${layout.image} w-full flex ${layout.imageAlign} ${layout.textFirst ? 'order-1 md:order-2' : 'order-1'}`}>
                <div className={`w-full max-w-full flex ${layout.textFirst ? 'md:justify-start' : 'md:justify-end'}`}>
                  <StaticImage galleryName={activeGallery.id} photo={photo} priority={index === 0} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Galleries Section */}
      <div className="mt-40 md:mt-60 px-5 md:px-0">
        <h3 className="text-3xl md:text-6xl uppercase mb-12 font-bold" data-cursor="text">
          More Galleries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {nextGalleries.map((nextG) => (
            <NextGallery key={nextG.id} nextGallery={nextG} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryContent;