"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import PhotoGrid from "@/components/PhotoGrid";
import PillButton from "@/components/ui/PillButton";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import type { Gallery } from "@/data";
import styles from "@/components/collection/GridReveal.module.css";

export interface CollectionContentProps {
  gallery: Gallery;
  /** Collection slug — needed to build each photo's S3 key (`<slug>/<path>`). */
  slug: string;
  /** `/collections/<prevSlug>` — the previous collection in `keptCollectionSlugs`. */
  prevHref: string;
  /** `/collections/<nextSlug>` — the next collection in `keptCollectionSlugs`. */
  nextHref: string;
}

// Shared soft ease-out, per design spec §5.
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * Page-enter sequence, echoing §5.2's shape ("name settles first, the rest
 * cascades in behind it") adapted to a collection page: name -> description
 * -> grid -> prev/next pair. Whole sequence lands well under the spec's
 * ~1.2s budget (last element finishes ~1.15s in).
 *
 *   name          0.00 -> 0.45s  (fade + rise)
 *   description   0.10 -> 0.50s  (fade + rise, follows just behind)
 *   grid tiles    0.30 -> 0.80s  (CSS opacity-only stagger, see GridReveal.module.css)
 *   prev/next     0.75 -> 1.15s  (fade + rise, last)
 */
const nameVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const descriptionVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay: 0.1 },
  },
};

const buttonsVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay: 0.75 },
  },
};

/**
 * Collection detail content (spec §4.3): name, description, photo grid, then
 * a prev/next collection pair. The grid is wrapped in `<LightboxProvider>`
 * exactly as `OverviewFeed` wraps the home feed — same `photos` array is
 * passed to both the provider and `PhotoGrid`, so a tile's index in the grid
 * is always the same index `?photo=<n>` and the lightbox use, with no
 * separate pagination to keep in sync (a collection page shows every photo
 * at once, unlike Overview's paginated feed).
 *
 * This is a client component (was a server component before the page-enter
 * animation was added) so it can drive the enter sequence with framer-motion
 * and `useReducedMotion()`. The tradeoff: the whole subtree now hydrates on
 * the client instead of only the `LightboxProvider`/`PhotoGrid` island.
 * Nothing about the markup changes to make this true, though — name,
 * description and every photo `<img>` are plain server-rendered elements;
 * motion only ever sets their *initial* inline opacity/transform, so SSR
 * output and no-JS rendering are unaffected (same pattern as
 * `AboutContent`/`IndexList`).
 *
 * The grid reveal is deliberately NOT done by wrapping each tile in its own
 * framer motion component — see the comment at the top of
 * `GridReveal.module.css` for why (short version: `PhotoTile` already runs a
 * `layoutId` shared-element morph into the lightbox, and stacking another
 * animated ancestor around it isn't a risk worth taking). Instead the grid's
 * container fades/rises as one animated unit, and a plain CSS
 * opacity-only stagger (no transform) plays across the tiles inside it for
 * the "assembling" feel — opacity cannot affect the layoutId morph's
 * position/size measurement, so it's safe by construction.
 */
export default function CollectionContent({
  gallery,
  slug,
  prevHref,
  nextHref,
}: CollectionContentProps) {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? false : "hidden";

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
        <motion.h1
          className="font-normal"
          initial={initial}
          animate="visible"
          variants={nameVariants}
        >
          {gallery.name}
        </motion.h1>
        <motion.p
          className="max-w-[506px]"
          initial={initial}
          animate="visible"
          variants={descriptionVariants}
        >
          {gallery.description}
        </motion.p>
      </div>

      {/*
        Reduced motion is handled entirely inside GridReveal.module.css via
        `@media (prefers-reduced-motion: reduce)` — a pure CSS gate, so the
        class is always applied and there's no `shouldReduceMotion`-driven
        branching here to cause a hydration mismatch.
      */}
      <div className={`mt-48 w-full ${styles.reveal}`}>
        <LightboxProvider photos={photos}>
          <PhotoGrid photos={photos} priorityCount={4} />
        </LightboxProvider>
      </div>

      <motion.div
        className="mt-64 flex items-center justify-center gap-[40px]"
        initial={initial}
        animate="visible"
        variants={buttonsVariants}
      >
        <PillButton href={prevHref}>View previous</PillButton>
        <PillButton href={nextHref}>View next</PillButton>
      </motion.div>
    </div>
  );
}
