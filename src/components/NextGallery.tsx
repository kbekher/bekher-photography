import { DOMAIN } from "@/constants/constants";
import { Gallery } from "@/data";
import imageLoader from "@/utils/image-loader";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface NextGallery {
  nextGallery: Gallery;
  isDesktop?: boolean;
}

const NextGallery = ({ nextGallery, isDesktop = false }: NextGallery) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -100px 0px" });

  // Determine object position classes
  const objectPositionClass = isDesktop
    ? isInView ? "object-center" : "object-left"
    : isInView ? "object-center" : "object-top";

  return (
    <div className="w-full mt-[200px] xl:mt-0 xl:ml-[400px] xl:flex xl:justify-end">
      <Link href={`/galleries/${nextGallery.id}`} className="cursor-none block xl:w-[25vw]" data-cursor="view">
        <div className="relative w-full h-[300px] xl:h-screen overflow-hidden">
          <motion.div
            ref={ref}
            initial={{ scale: 1.05, opacity: 0.7 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image
              src={`${DOMAIN}/galleries/${nextGallery.id}/${nextGallery.photos[0].path}`}
              alt={`Preview of ${nextGallery.name}`}
              width={300}
              height={600}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
              loader={imageLoader}
              loading="lazy"
              className={`w-full h-full object-cover transition-[object-position] duration-[1200ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] will-change-[object-position] ${objectPositionClass}`}
            />
          </motion.div>

          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center">
            <span className="text-white text-2xl mb-2 font-light">Next Collection</span>
            <span className="text-white text-3xl uppercase">{nextGallery.name}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NextGallery
