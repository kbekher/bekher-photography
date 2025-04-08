import { galleriesData } from '@/data'
import Link from 'next/link'

const GalleriesContent = () => {
  return (
    <section>
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
  </section>
  )
}

export default GalleriesContent
