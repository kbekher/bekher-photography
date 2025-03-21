import Link from "next/link";

const GalleriesPage = () => {
  // List of gallery names
  const galleries = ["nature", "purple", "people", "travel"];

  return (
    <div>
      <h1>This is Galleries Page</h1>
      <ul>
        {galleries.map((gallery) => (
          <li key={gallery}>
            <Link href={`/galleries/${gallery}`}>{gallery}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GalleriesPage
