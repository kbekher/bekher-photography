import Link from "next/link";

import { galleriesData } from "@/data"
import MotionImage from "@/components/MotionImage";

const Home = () => {

  return (
    <div className="w-auto h-auto mx-[60px]">
      {/* <Link href='/galleries'> Galleries </Link> */}

      <div className="grid grid-cols-12 gap-x-5 gap-y-10">

        <div className="col-start-2 col-span-3">
          <Link href={`/galleries/pentax`} >
            <MotionImage galleryName="pentax" imgIndex={0} />
            <span>{galleriesData.pentax.name}</span>
          </Link>
        </div>

        <div className="col-start-8 col-span-4 translate-y-[-80px]">
          <Link href={`/galleries/bw`} >
            <MotionImage galleryName="bw" imgIndex={0} />
            <span>{galleriesData.bw.name}</span>
          </Link>
        </div>

        <div className="row-start-2 col-start-4 col-span-6">
          <Link href={`/galleries/nature`} >
            <MotionImage galleryName="nature" imgIndex={1} />
            <span>{galleriesData.nature.name}</span>
          </Link>
        </div>

        <div className="row-start-3 col-start-8 col-span-5">
          <Link href={`/galleries/purple`} >
            <MotionImage galleryName="purple" imgIndex={6} />
            <span>{galleriesData.purple.name}</span>
          </Link>
        </div>


        <div className="row-start-3 col-start-8 col-span-5">
          <Link href={`/galleries/purple`} >
            <MotionImage galleryName="purple" imgIndex={6} />
            <span>{galleriesData.purple.name}</span>
          </Link>
        </div>
        
        <div className="row-start-3 col-start-1 col-span-5 pt-50">
          <Link href={`/galleries/people`} >
            <MotionImage galleryName="people" imgIndex={1} />
            <span>{galleriesData.people.name}</span>
          </Link>
        </div>

        <div className="row-start-4 col-start-3 col-span-8">
          <Link href={`/galleries/alps`} >
            <MotionImage galleryName="alps" imgIndex={3} />
            <span>{galleriesData.alps.name}</span>
          </Link>
        </div>

        <div className="row-start-5 col-start-2 col-span-3 pt-20">
          <Link href={`/galleries/travel`} >
            <MotionImage galleryName="travel" imgIndex={0} />
            <span>{galleriesData.travel.name}</span>
          </Link>
        </div>

        <div className="row-start-5 col-start-8 col-span-4">
          <Link href={`/galleries/pentax`} >
            <MotionImage galleryName="pentax" imgIndex={2} />
            <span>{galleriesData.pentax.name}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Home;