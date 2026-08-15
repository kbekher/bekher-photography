import PhotoTile from "./PhotoTile";
import { horizontal } from "@/data";

export interface GridPhoto {
  src: string;
  aspectRatio: string;
  place?: string;
  year?: string;
  description?: string;
}

export interface PhotoGridProps {
  photos: GridPhoto[];
  /** How many of the first photos (in array order) load eagerly at high
   *  priority — i.e. how many cover the first screen. */
  priorityCount?: number;
  /**
   * Make tiles open the lightbox on click. Requires a `<LightboxProvider>`
   * ancestor whose `photos` array is index-aligned with `photos` here.
   * Default true — a photo grid is expected to be viewable.
   */
  interactive?: boolean;
}

function buildAlt(photo: GridPhoto): string {
  const parts = [photo.description, photo.place, photo.year].filter(
    (value): value is string => Boolean(value && value.trim().length > 0)
  );
  if (parts.length > 0) return parts.join(", ");
  return "Photograph by Kristina Bekher";
}

/**
 * The photo layout engine (spec §3). Used by Overview and by collection pages.
 *
 * ## 4 columns, on fixed tracks
 *   desktop (>=1024px): 4 columns x 166px, 40px gutter -> 784px measure
 *   phone   (<1024px):  2 columns x 141px, 40px gutter -> 322px measure
 * Both are the exact Figma tile widths, and the container is centred. The
 * tracks are a fixed px width rather than `1fr` on purpose: these are film
 * scans, and letting a track stretch on a wide monitor would upscale the
 * image past its design size and soften it. The block simply centres and
 * stops growing.
 *
 * ## Why this is order-independent
 * The layout must look right for ANY feed ordering, so nothing about a row's
 * shape is allowed to depend on what happens to land in it:
 *  - `grid-auto-rows` is pinned to the vertical tile height (240 / 204px), so
 *    every row is the same height whether it holds four verticals, four
 *    horizontals, or a mix. This is what the earlier version got wrong — it
 *    let the row height be derived from its tallest child, so a row that
 *    happened to contain only horizontals silently collapsed to 144px and
 *    broke the rhythm.
 *  - `items-center` then centres each tile in that fixed row. A vertical
 *    exactly fills it (zero slack, so it reads as flush to the top); a
 *    horizontal gets (240-144)/2 = 48px of offset — precisely the inset the
 *    Figma shows — and it gets it in every row, unconditionally.
 *
 * ## The horizontal break-out
 * A horizontal tile is 215px wide against a 166px track (180 vs 141 on
 * phone), so it deliberately bleeds ~24px into the gutter on each side.
 * `justify-self-center` keeps that overhang symmetric. This is the detail
 * that gives the grid its irregular Swiss rhythm — nothing in this chain sets
 * `overflow-hidden`, so it is never clipped.
 */
export default function PhotoGrid({
  photos,
  priorityCount = 0,
  interactive = true,
}: PhotoGridProps) {
  return (
    <div
      // Stable hook for page-enter reveals to target the tiles precisely.
      // Do not remove: a positional selector here would also match sibling
      // elements a provider renders alongside the grid (e.g. the lightbox
      // overlay), applying the reveal to them too.
      data-photo-grid=""
      className={[
        "mx-auto grid w-fit items-center justify-center",
        // Column gutter must exceed the horizontal tile's total overhang, or
        // two horizontals in adjacent columns collide: a 215px tile in a
        // 166px track hangs 24.5px past each edge, so neighbours need
        // 2 x 24.5 = 49px of clearance. The Figma's 40px gutter is 9px short
        // of that — it only ever looked right because no two horizontals
        // happened to sit side by side. These gutters clear it at every tier,
        // so the layout holds for ANY feed ordering. They also widen on large
        // screens, which is what lets the block claim more horizontal space
        // without upscaling the images.
        "gap-x-[48px] lg:gap-x-[96px] 2xl:gap-x-[120px]",
        "gap-y-[64px]",
        // Tile dimensions as custom properties, so the track/row/tile sizes
        // below all derive from one place per breakpoint.
        "[--tile-v-w:141px] [--tile-v-h:204px] [--tile-h-w:180px] [--tile-h-h:120px]",
        "lg:[--tile-v-w:166px] lg:[--tile-v-h:240px] lg:[--tile-h-w:215px] lg:[--tile-h-h:144px]",
        // 2 fixed columns on phone, 4 on desktop.
        "grid-cols-[repeat(2,var(--tile-v-w))] lg:grid-cols-[repeat(4,var(--tile-v-w))]",
        // Every row is exactly one vertical-tile tall, regardless of contents.
        "[grid-auto-rows:var(--tile-v-h)]",
      ].join(" ")}
    >
      {photos.map((photo, i) => {
        const isHorizontal = photo.aspectRatio === horizontal;
        return (
          <PhotoTile
            key={`${photo.src}-${i}`}
            src={photo.src}
            aspectRatio={photo.aspectRatio}
            alt={buildAlt(photo)}
            priority={i < priorityCount}
            index={i}
            interactive={interactive}
            className={
              isHorizontal
                ? "w-[var(--tile-h-w)] h-[var(--tile-h-h)] justify-self-center"
                : "w-[var(--tile-v-w)] h-[var(--tile-v-h)]"
            }
          />
        );
      })}
    </div>
  );
}
