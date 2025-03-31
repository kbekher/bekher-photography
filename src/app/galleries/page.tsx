import { galleriesData } from "@/data";
import Link from "next/link";
import TransitionLayer from "@/components/TransitionLayer";

const GalleriesPage = () => {

  return (
    <div className="w-full h-full mx-5 md:mx-[60px] pb-[140px]">
      <h1>This is Galleries Page</h1>
      <ul className="grid grid-cols-12 gap-5">
        {Object.keys(galleriesData).map((gallery) => (
          <li key={gallery} className="col-span-full">
            <Link href={`/galleries/${gallery}`}>
              {galleriesData[gallery as keyof typeof galleriesData].name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Transition Layer */}
      <TransitionLayer />
    </div>
  )
}

export default GalleriesPage
