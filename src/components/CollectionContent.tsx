import PhotoGrid from "@/components/PhotoGrid";
import PillButton from "@/components/ui/PillButton";
import type { Gallery } from "@/data";

export interface CollectionContentProps {
  gallery: Gallery;
  /** Collection slug — needed to build each photo's S3 key (`<slug>/<path>`). */
  slug: string;
  /** `/index/<prevSlug>` — the previous collection in `keptCollectionSlugs`. */
  prevHref: string;
  /** `/index/<nextSlug>` — the next collection in `keptCollectionSlugs`. */
  nextHref: string;
}

/**
 * Collection detail content (spec §4.3): name, description, photo grid, then
 * a prev/next collection pair. Purely presentational — the only client code
 * involved is PillButton's `<Link>` and PhotoGrid's PhotoTile (image
 * load/fade), neither of which this component owns — so it stays a plain
 * server component. No enter animation here; a later agent owns
 * page-transition motion (spec §5), this just leaves clean markup for it.
 */
export default function CollectionContent({
  gallery,
  slug,
  prevHref,
  nextHref,
}: CollectionContentProps) {
  const photos = gallery.photos.map((photo) => ({
    src: `${slug}/${photo.path}`,
    aspectRatio: photo.aspectRatio,
    place: photo.place,
    year: photo.year,
    description: photo.description,
  }));

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-64 flex flex-col items-center gap-8 text-center">
        <h1 className="font-normal">{gallery.name}</h1>
        <p className="max-w-[506px]">{gallery.description}</p>
      </div>

      <div className="mt-48 w-full">
        <PhotoGrid photos={photos} priorityCount={4} />
      </div>

      <div className="mt-64 flex items-center justify-center gap-[40px]">
        <PillButton href={prevHref}>View previous</PillButton>
        <PillButton href={nextHref}>View next</PillButton>
      </div>
    </div>
  );
}
