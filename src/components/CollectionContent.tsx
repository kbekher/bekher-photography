import PhotoGrid from "@/components/PhotoGrid";
import PillButton from "@/components/ui/PillButton";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
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
 * a prev/next collection pair. The grid is wrapped in `<LightboxProvider>`
 * exactly as `OverviewFeed` wraps the home feed — same `photos` array is
 * passed to both the provider and `PhotoGrid`, so a tile's index in the grid
 * is always the same index `?photo=<n>` and the lightbox use, with no
 * separate pagination to keep in sync (a collection page shows every photo
 * at once, unlike Overview's paginated feed). `LightboxProvider` is a client
 * component, but it accepts a plain serializable prop, so this component
 * itself stays a server component — only the provider/grid subtree below it
 * hydrates. No enter animation here; a later agent owns page-transition
 * motion (spec §5), this just leaves clean markup for it.
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
        <LightboxProvider photos={photos}>
          <PhotoGrid photos={photos} priorityCount={4} />
        </LightboxProvider>
      </div>

      <div className="mt-64 flex items-center justify-center gap-[40px]">
        <PillButton href={prevHref}>View previous</PillButton>
        <PillButton href={nextHref}>View next</PillButton>
      </div>
    </div>
  );
}
