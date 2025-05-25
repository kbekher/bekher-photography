import Link from "next/link"
import MotionImage from "./MotionImage"
import { galleriesData } from "@/data"

const HomeContent = () => {
  return (
    <div className="w-auto min-h-full h-auto mx-5 md:mx-[60px] pb-[140px] pt-[64px]">

    <div className="flex flex-col md:grid grid-cols-12 gap-x-5 gap-y-10">

      <div className="h-max col-start-2 col-span-3">
        <Link href={`/galleries/fromparistovenice`}>
          <MotionImage galleryName="fromparistovenice" photo={galleriesData.fromparistovenice.photos[0]} />
          <span className="pt-2">{galleriesData.fromparistovenice.name}</span>
        </Link>
      </div>

      <div className="h-max col-start-8 col-span-4 md:translate-y-[-80px]">
        <Link href={`/galleries/noiretblanc`}>
          <MotionImage galleryName="noiretblanc" photo={galleriesData.noiretblanc.photos[0]} />
          <span className="pt-2">{galleriesData.noiretblanc.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-2 col-start-4 col-span-6">
        <Link href={`/galleries/momentsofstillness`}>
          <MotionImage galleryName="momentsofstillness" photo={galleriesData.momentsofstillness.photos[1]} />
          <span className="pt-2">{galleriesData.momentsofstillness.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-3 col-start-8 col-span-5">
        <Link href={`/galleries/jazzyblues`}>
          <MotionImage galleryName="jazzyblues" photo={galleriesData.jazzyblues.photos[4]} />
          <span className="pt-2">{galleriesData.jazzyblues.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-3 col-start-1 col-span-5 md:pt-50">
        <Link href={`/galleries/familiarfaces`}>
          <MotionImage galleryName="familiarfaces" photo={galleriesData.familiarfaces.photos[7]} />
          <span className="pt-2">{galleriesData.familiarfaces.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-4 col-start-3 col-span-8">
        <Link href={`/galleries/alpineescape`}>
          <MotionImage galleryName="alpineescape" photo={galleriesData.alpineescape.photos[3]} />
          <span className="pt-2">{galleriesData.alpineescape.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-5 col-start-2 col-span-3 md:pt-20">
        <Link href={`/galleries/pentax17`}>
          <MotionImage galleryName="pentax17" photo={galleriesData.pentax17.photos[0]} />
          <span className="pt-2">{galleriesData.pentax17.name}</span>
        </Link>
      </div>

      <div className="h-max row-start-5 col-start-8 col-span-4">
        <Link href={`/galleries/pentax17`}>
          <MotionImage galleryName="pentax17" photo={galleriesData.pentax17.photos[2]} />
          <span className="pt-2">{galleriesData.pentax17.name}</span>
        </Link>
      </div>

    </div>
  </div>
  )
}

export default HomeContent
