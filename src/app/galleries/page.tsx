import TransitionLink from "@/components/TransitionLink";
import { galleriesData } from "@/data";

const GalleriesPage = () => {

  return (
    <section>
      <h1>This is Galleries Page</h1>
      <ul className="grid grid-cols-12 gap-5">
        {Object.keys(galleriesData).map((gallery) => (
          <li key={gallery} className="col-span-full">
            <TransitionLink href={`/galleries/${gallery}`}>
              {galleriesData[gallery as keyof typeof galleriesData].name}
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default GalleriesPage
