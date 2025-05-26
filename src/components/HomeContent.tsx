// 'use client';

import Link from "next/link";
import MotionImage from "./MotionImage";
import { galleriesData } from "@/data";

const galleryLayout = [
  { id: "europeanfeel", styles: "h-max col-start-2 col-span-3", photoIndex: 0 },
  { id: "noiretblanc", styles: "h-max col-start-8 col-span-4 md:translate-y-[-80px]", photoIndex: 0 },
  { id: "momentsofstillness", styles: "h-max row-start-2 col-start-4 col-span-6", photoIndex: 1 },
  { id: "jazzyblues", styles: "h-max row-start-3 col-start-8 col-span-5", photoIndex: 4 },
  { id: "grainofukraine", styles: "h-max row-start-3 col-start-1 col-span-5 md:pt-50", photoIndex: 3 },
  { id: "alpineescape", styles: "h-max row-start-4 col-start-3 col-span-8", photoIndex: 3 },
  { id: "facesandplaces", styles: "h-max row-start-5 col-start-2 col-span-3 md:pt-20", photoIndex: 3 },
  { id: "pentax17", styles: "h-max row-start-5 col-start-8 col-span-4", photoIndex: 0 },
];


const HomeContent = () => {
  return (
      <div className="w-auto min-h-full h-auto mx-5 md:mx-[60px] pb-[140px] pt-[64px]">
        <div className="flex flex-col md:grid grid-cols-12 gap-x-5 gap-y-10">
          {galleryLayout.map(({ id, styles, photoIndex }) => {
            const gallery = galleriesData[id as keyof typeof galleriesData];
            if (!gallery) return null;

            return (
              <div key={id} className={styles}>
                <Link href={`/galleries/${id}`}>
                  <MotionImage galleryName={id} photo={gallery.photos[photoIndex]} />
                  <span className="pt-2">{gallery.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
  );
};

export default HomeContent;
