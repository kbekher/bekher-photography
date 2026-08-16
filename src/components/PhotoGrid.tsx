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
 * ## Columns: fixed on desktop, fluid-but-capped on phone
 *   desktop (>=1024px): 4 columns x 166px, 96px gutter -> 952px measure
 *   phone   (<1024px):  2 columns x AT MOST 141px, 48px gutter -> <=330px
 * 166/141 are the exact Figma tile widths, and the block is centred. The
 * tracks are a px width rather than `1fr` on purpose: these are film scans,
 * and letting a track stretch on a wide monitor would upscale the image past
 * its design size and soften it. The block simply centres and stops growing.
 *
 * ### Why the phone tile is `min()` rather than a flat 141px
 * The design size only fits from ~410px of viewport up. Every page is framed
 * by PageShell's `max-w-[1280px] px-[40px]`, so the content box is
 * `100vw - 80px`; two 141px tracks plus the 48px gutter is 330px, which is
 * WIDER than that box on a 390px phone (310px). An over-constrained box
 * resolves `margin-inline: auto` to zero on the right in LTR, so the grid
 * stopped centring: it pinned to the left with a 40px gap and only ~20px on
 * the right, and the right-hand horizontal tile's break-out (below) came
 * within half a pixel of the screen edge.
 *
 * So on phone ONE value is fluid — `--tile-v-w` — and all four tile
 * dimensions are derived from it at the Figma ratios (141x204 vertical,
 * 180x120 horizontal). It is capped at 141px, so nothing ever renders larger
 * than the design size, and floored by the space actually available:
 *
 *     --tile-v-w: min(141px, (100vw - 80px - 48px) / 2)
 *                             \_ PageShell's 2x40px  \_ the column gutter
 *
 * i.e. the grid's max-content width is never more than the content box, so
 * `w-fit` + `mx-auto` centre it exactly at every width, and the horizontal
 * break-out shrinks with the tile so it always lands inside the 40px padding.
 * At >=410px this clamps to the flat 141px and the layout is unchanged.
 *
 * Two things this couples to, so a future change stays traceable:
 *  - the `80px` is PageShell's `px-[40px]`, and the `48px` is `gap-x-[48px]`
 *    below. Change either and this must change with it.
 *  - `100vw` is normally the one term here that could be wrong, because it
 *    classically INCLUDES a scrollbar's width while the content box excludes
 *    it. It doesn't here: globals.css sets `html { scrollbar-gutter: stable }`,
 *    and reserved gutter comes out of the initial containing block, which is
 *    what `vw` measures. Verified in Chrome at 320-1440px — a `100vw` probe
 *    matches `documentElement.clientWidth` exactly, with and without a classic
 *    scrollbar — so the formula is exact on overlay- and classic-scrollbar
 *    platforms alike. `max-w-full` below is the backstop if that ever stops
 *    holding (the gutter rule is removed, or a UA disagrees): it caps the grid
 *    BOX at the real content width so `justify-center` does the centring and
 *    overflows the tracks symmetrically into the 40px padding, instead of an
 *    auto margin collapsing to zero and skewing the whole block left again.
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
 * A horizontal tile is 215px wide against a 166px track (at most 180 vs 141
 * on phone), so it deliberately bleeds ~24px into the gutter on each side.
 * `justify-self-center` keeps that overhang symmetric. This is the detail
 * that gives the grid its irregular Swiss rhythm — nothing in this chain sets
 * `overflow-hidden`, so it is never clipped.
 *
 * On phone the overhang is 39/141 of the tile width, halved — 19.5px at the
 * design size, scaling down with `--tile-v-w` on narrower screens (18.1px at
 * 390px, 13.3px at 320px). It is therefore always well inside PageShell's
 * 40px padding, which is what keeps the outer columns' break-out on-screen.
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
        // `max-w-full` is what guarantees the block can never be
        // over-constrained, and it is deliberately NOT dropped at `lg`.
        //
        // The failure it prevents is the whole reason this file changed: a
        // grid wider than its container resolves `margin-inline: auto` to zero
        // on the right in LTR, so `mx-auto` silently stops centring and the
        // whole block pins left. `max-w-full` caps the grid BOX at the real
        // content width, which hands centring to `justify-center` instead —
        // and `justify-content: center` overflows its tracks SYMMETRICALLY.
        // So the worst case degrades to "slightly too wide, still centred"
        // rather than "visibly off to one side".
        //
        // On phone it is inert, because `--tile-v-w`'s `min()` already keeps
        // the grid inside the content box (see the doc comment). On desktop it
        // is inert too — except between 1024px and 1032px of viewport, where
        // the 952px `lg` measure (4x166 + 3x96) does not fit the 944px content
        // box PageShell's `px-[40px]` leaves at 1024px. That is an 8px-wide
        // window, but it is the exact same bug, so it gets the same backstop
        // rather than a note saying it was left in.
        "mx-auto grid w-fit max-w-full items-center justify-center",
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
        //
        // Phone: the vertical tile's WIDTH is the single fluid input (capped
        // at the 141px design size, floored by the width PageShell actually
        // leaves — see "Why the phone tile is min()" above), and the other
        // three dimensions are that width at the Figma ratios: 204/141
        // vertical height, 180/141 and 120/141 for the horizontal tile.
        "[--tile-v-w:min(141px,(100vw_-_128px)/2)]",
        "[--tile-v-h:calc(var(--tile-v-w)_*_204_/_141)]",
        "[--tile-h-w:calc(var(--tile-v-w)_*_180_/_141)]",
        "[--tile-h-h:calc(var(--tile-v-w)_*_120_/_141)]",
        // Desktop stays flat px: the measure fits from 1024px up, so there is
        // nothing to solve and no reason to make it fluid.
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
