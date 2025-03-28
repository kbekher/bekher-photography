// /app/galleries/[galleryName]/page.tsx

import { galleriesData } from "@/data";
import { computeDimensions } from "@/utils/utils";
import Image from "next/image";

interface Props {
  params: {
    galleryName: string;
  };
}

const GalleryPage = async ({ params }: Props) => {
  const { galleryName } = await params;
  const gallery = galleriesData[galleryName as keyof typeof galleriesData];

  if (!gallery) {
    return <div>Gallery not found</div>;
  }

  return (
    <div className="w-full h-full mx-5 md:mx-[60px] pb-[140px]">

      {/* Info */}
      <div>
        <h1 className="">{gallery.name}</h1>
        <p>{gallery.description}</p>
      </div>

      {/* Images */}
      <div className="w-full h-full overflow-hidden">
        {gallery.photos.map((photo, index) => {
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
                src={`https://d14lj85n4pdzvr.cloudfront.net/galleries/${galleryName}/${galleryName}-${index + 1}.jpg`}
                alt={`Picture of ${galleryName}`}
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
    </div>
  );
};

export default GalleryPage;
