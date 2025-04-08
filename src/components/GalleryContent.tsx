'use client';

import * as React from 'react'
import Image from "next/image";
import { useParams } from 'next/navigation';

import { galleriesData } from "@/data";
import { computeDimensions } from "@/utils/utils";


const GalleryContent = () => {
  const params = useParams();
  const { galleryName } = params as { galleryName: string };

  const gallery = galleriesData[galleryName as keyof typeof galleriesData];

  // Show prev gallery until animation is complete
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
    <section>

      {/* Info */}
      <div>
        <h1 className="">{activeGallery.name}</h1>
        <p>{activeGallery.description}</p>
      </div>

      {/* Images */}
      <div className="w-full h-full overflow-hidden">
        {activeGallery.photos.map((photo, index) => {
          const { width, height } = computeDimensions(photo.aspectRatio, 700); // Calculate dynamic width and height

          return (
            <div
              key={index}
              className="max-w-[800px] mx-auto "
              style={{
                aspectRatio: photo.aspectRatio,
                // backgroundColor: "#d5d4ff", // You can add actual images here
                position: "relative",
              }}
            >

              {/* Display your image or placeholder here */}
              <Image
                src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${activeGalleryName}/${activeGalleryName}-${index + 1}.jpg`}
                alt={`Picture of ${activeGalleryName}`}
                width={width}
                height={height}
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                draggable='false'
                className='object-cover absolute top-0'
                style={{ aspectRatio: photo.aspectRatio }}
              />
            </div>
          )
        })}
      </div>
    </section>
  );
};

export default GalleryContent;