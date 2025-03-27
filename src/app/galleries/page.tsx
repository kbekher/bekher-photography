// "use client";

// import { motion, useIsPresent } from "framer-motion";
import { galleriesData } from "@/data";
import Link from "next/link";

const GalleriesPage = () => {
  // const isPresent = useIsPresent();

  return (
    <div className="w-full h-screen mx-[60px]">
      <h1>This is Galleries Page</h1>
      <ul className="grid grid-cols-12 gap-5">
        {Object.keys(galleriesData).map((gallery) => (
          <li key={gallery} className="col-span-12">
            <Link href={`/galleries/${gallery}`}>
              {galleriesData[gallery as keyof typeof galleriesData].name}
            </Link>
          </li>
        ))}
      </ul>
      
      {/* 
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.8, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.8, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="privacy-screen"
      /> */}
    </div>
  )
}

export default GalleriesPage
