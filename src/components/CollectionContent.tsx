"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import PhotoGrid from "@/components/PhotoGrid";
import PillButton from "@/components/ui/PillButton";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import { useCollectionDealOut } from "@/components/collection/useCollectionDealOut";
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
 * -> grid deal-out -> prev/next pair.
 *
 *   name          0.00 -> 0.45s  (fade + rise)
 *   description   0.10 -> 0.50s  (fade + rise, follows just behind)
 *   grid           ~0.35s        wrapper fades in (~0.35s), revealing ONLY
 *                                the centred first photo — every other photo
 *                                is stacked opaquely behind it (see
 *                                useCollectionDealOut.ts for the full
 *                                gather/deal timeline this kicks off)
 *   grid deal      ~1.00 -> 3.00s  the deck peels off card by card into the
 *                                grid, staggered; the first photo travels
 *                                into its own slot last — same choreography
 *                                as the intro's useDealOut
 *   prev/next     3.10 -> 3.50s  (fade + rise, after the grid has settled)
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

// Delay is timed to land after the grid's deal-out has fully settled
// (~3.0s — see useCollectionDealOut.ts), not in the middle of it.
const buttonsVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay: 3.1 },
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
 * ## The grid's reveal
 * The grid plays the SAME "deal out from centre" choreography as the home
 * page's intro (`useDealOut`/`useDealOutSequence` in
 * `src/components/intro/useDealOut.ts`), via `useCollectionDealOut` — the
 * first photo appears alone, centred and enlarged, then every other tile
 * flies into its grid slot while the first photo travels into its own slot
 * last. That hook works the same way `useDealOut` does: it nudges the
 * already-rendered tiles' `transform`/`opacity` imperatively via their
 * `data-index` attribute rather than wrapping each one in its own animated
 * component, because `PhotoTile` already wraps its image in a `layoutId`
 * shared-element for the lightbox morph (spec §5.5) — stacking another
 * animated ancestor around that isn't a risk worth taking, and it clears
 * every inline style it sets once the sequence reaches `done`.
 *
 * `gridRef` below is deliberately scoped to wrap only `<PhotoGrid>`, not
 * `<LightboxProvider>` itself — `LightboxProvider` also renders the
 * `<Lightbox/>` overlay as a sibling of its children, and that overlay must
 * never be swept into the same `[data-index]` query the deal-out hook runs
 * against (same nesting `OverviewFeed` uses for the home feed).
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

  const gridRef = useRef<HTMLDivElement>(null);

  // The deal-out plays only when there's something to deal: more than one
  // photo, no `?photo=` deep link already taking over with the lightbox, and
  // no reduced-motion preference. `dealEnabled` starts as the one part of
  // that decision knowable from props alone (photo count) — server and
  // client agree on it before hydration, so no mismatch — and the rest is
  // resolved in the effect below, same "decide once, after mount" shape
  // IntroContext uses on the home page. Read from `window.location`/
  // `matchMedia` directly rather than `useSearchParams()`/
  // `useReducedMotion()` for the deep-link/motion checks: this must not
  // influence the FIRST render (see useCollectionDealOut's gather/paint
  // ordering), only the decision an effect makes after it.
  const [dealEnabled, setDealEnabled] = useState(() => photos.length > 1);

  useEffect(() => {
    if (photos.length <= 1) return;

    let disable = false;
    try {
      disable = new URLSearchParams(window.location.search).has("photo");
    } catch {
      disable = false;
    }
    if (!disable) {
      try {
        disable = window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;
      } catch {
        disable = false;
      }
    }
    if (disable) setDealEnabled(false);
    // photos.length is derived from `gallery`/`slug` props, which never
    // change for a mounted collection page (a slug change remounts the
    // route), so this effect is effectively mount-only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useCollectionDealOut(gridRef, { enabled: dealEnabled });

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
        <noscript> fallback for GridReveal.module.css's opacity gate: if JS
        never runs, useCollectionDealOut never sets `data-visible`, and
        without this the grid would stay at `opacity: 0` forever. This block
        only ever reaches the DOM when scripting is disabled, so it can never
        fight the JS-driven reveal when JS *is* available.
      */}
      <noscript>
        <style>{`.${styles.gate} { opacity: 1 !important; }`}</style>
      </noscript>

      <LightboxProvider photos={photos}>
        <div ref={gridRef} className={`mt-48 w-full ${styles.gate}`}>
          <PhotoGrid photos={photos} priorityCount={4} />
        </div>
      </LightboxProvider>

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
