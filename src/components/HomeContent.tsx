import Link from "next/link"
import MotionImage from "./MotionImage"
import { galleriesData } from "@/data"

const HomeContent = () => {
  return (
    <div className="w-auto min-h-full h-auto mx-5 md:mx-[60px] pb-[140px] pt-[64px]">

    <div className="flex flex-col md:grid grid-cols-12 gap-x-5 gap-y-10">

      <div className="h-max col-start-2 col-span-3">
        <Link href={`/galleries/travel`}>
          <MotionImage galleryName="travel" photo={galleriesData.travel.photos[0]} />
          <span className="pt-2">{galleriesData.travel.name}</span>
        </Link>
      </div>

      <div className="h-max col-start-8 col-span-4 md:translate-y-[-80px]">
        <Link href={`/galleries/bw`}>
          <MotionImage galleryName="bw" photo={galleriesData.bw.photos[0]} />
          <span className="pt-2">{galleriesData.bw.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-2 col-start-4 col-span-6">
        <Link href={`/galleries/nature`}>
          <MotionImage galleryName="nature" photo={galleriesData.nature.photos[1]} />
          <span className="pt-2">{galleriesData.nature.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-3 col-start-8 col-span-5">
        <Link href={`/galleries/purple`}>
          <MotionImage galleryName="purple" photo={galleriesData.purple.photos[4]} />
          <span className="pt-2">{galleriesData.purple.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-3 col-start-1 col-span-5 md:pt-50">
        <Link href={`/galleries/people`}>
          <MotionImage galleryName="people" photo={galleriesData.people.photos[6]} />
          <span className="pt-2">{galleriesData.people.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-4 col-start-3 col-span-8">
        <Link href={`/galleries/alps`}>
          <MotionImage galleryName="alps" photo={galleriesData.alps.photos[3]} />
          <span className="pt-2">{galleriesData.alps.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-5 col-start-2 col-span-3 md:pt-20">
        <Link href={`/galleries/pentax`}>
          <MotionImage galleryName="pentax" photo={galleriesData.pentax.photos[0]} />
          <span className="pt-2">{galleriesData.pentax.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-5 col-start-8 col-span-4">
        <Link href={`/galleries/pentax`}>
          <MotionImage galleryName="pentax" photo={galleriesData.pentax.photos[2]} />
          <span className="pt-2">{galleriesData.pentax.name}</span>
        </Link>
      </div>

    </div>
  </div>
  )
}

export default HomeContent
