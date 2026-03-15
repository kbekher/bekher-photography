import { Gallery } from "@/data";
import imageLoader from "@/utils/image-loader";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { TransitionLink } from "./TransitionLink";

const NextGallery = ({ nextGallery }: { nextGallery: Gallery }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -100px 0px", once: true });
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-full">
      <TransitionLink href={`/galleries/${nextGallery.id}`} className="cursor-none block w-full h-full group" dataCursor="view">
        <div className={`relative w-full h-full overflow-hidden transition-colors duration-500 ${!isLoaded ? 'image-placeholder' : ''}`}>
          <motion.div
            ref={ref}
            initial={{ scale: 1.05, opacity: 0.7 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image
              src={`/${nextGallery.id}/${nextGallery.photos[0].path}`}
              alt={`Preview of ${nextGallery.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              loader={imageLoader}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-1xl'}`}
              onLoad={() => setIsLoaded(true)}
            />
          </motion.div>

          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4 transition-colors group-hover:bg-black/20">
            <span className="text-white text-2xl md:text-4xl uppercase font-bold tracking-tighter group-hover:scale-105 transition-transform">{nextGallery.name}</span>
          </div>
        </div>
      </TransitionLink>
    </div>
  )
}

export default NextGallery
