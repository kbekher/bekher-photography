"use client";

import { useEffect, useRef, useState } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import PillButton from "@/components/ui/PillButton";
import Reveal from "@/components/ui/Reveal";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import { useCollectionDealOut } from "@/components/collection/useCollectionDealOut";
import {
  COLLECTION_DEAL_START_MS,
  DEAL_BUDGET_MS,
} from "@/components/intro/introTimings";
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

/**
 * Page-enter sequence, echoing §5.2's shape ("name settles first, the rest
 * cascades in behind it") adapted to a collection page: name -> description
 * -> grid deal-out -> prev/next pair. Each text beat is a `Reveal` (fade +
 * rise, GSAP, shared soft ease-out per design spec §5).
 *
 *   name          starts immediately
 *   description   follows just behind it
 *   grid          the wrapper's own gate fades in, revealing ONLY the centred
 *                 first photo — every other photo is stacked opaquely behind
 *                 it (see useCollectionDealOut.ts for the full gather/deal
 *                 timeline this kicks off)
 *   grid deal     the deck peels off card by card into the grid, staggered;
 *                 the first photo travels into its own slot last — same
 *                 choreography as the intro's useDealOut
 *   prev/next     once the deal has fully landed (see BUTTONS_DELAY)
 *
 * Only the two text beats' numbers live here. Everything the grid does is
 * owned by introTimings.ts, and the one beat that has to agree with it —
 * the prev/next pair — is derived from those constants rather than restated,
 * so retuning the deal-out can never leave this file quoting a stale figure.
 */
const NAME_DURATION = 0.45;
const NAME_Y = 14;

const DESCRIPTION_DURATION = 0.4;
const DESCRIPTION_DELAY = 0.1;
const DESCRIPTION_Y = 10;

/**
 * The prev/next pair must land AFTER the deal-out has fully settled, not in
 * the middle of it: the deal's start plus its whole budget, plus a short beat
 * so the two reads are separate gestures rather than one blur.
 */
const BUTTONS_SETTLE_BEAT_MS = 100;
const BUTTONS_DELAY =
  (COLLECTION_DEAL_START_MS + DEAL_BUDGET_MS + BUTTONS_SETTLE_BEAT_MS) / 1000;
const BUTTONS_DURATION = 0.4;
const BUTTONS_Y = 8;

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
 * animation was added) so it can drive the enter sequence. The tradeoff: the
 * whole subtree now hydrates on the client instead of only the
 * `LightboxProvider`/`PhotoGrid` island. Nothing about the markup changes to
 * make this true, though — name, description and every photo `<img>` are
 * plain server-rendered elements; `Reveal` only adds a `.reveal` class whose
 * hidden state has both a reduced-motion and a `<noscript>` escape hatch, so
 * SSR output and no-JS rendering are unaffected (same pattern as
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
 * component. The lightbox's open/close morph (`lightboxMorph.ts`) measures
 * and repositions those exact same nodes, so keeping them plain DOM means the
 * two never fight over ownership of a tile's transform — and the deal-out
 * clears every inline style it set once it reaches `done`.
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
      <div className="mt-24 flex flex-col items-center gap-8 text-center">
        <Reveal as="h1" className="font-normal" duration={NAME_DURATION} y={NAME_Y}>
          {gallery.name}
        </Reveal>
        <Reveal
          as="p"
          className="max-w-[506px]"
          delay={DESCRIPTION_DELAY}
          duration={DESCRIPTION_DURATION}
          y={DESCRIPTION_Y}
        >
          {gallery.description}
        </Reveal>
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

      <Reveal
        className="mt-64 flex items-center justify-center gap-[40px]"
        delay={BUTTONS_DELAY}
        duration={BUTTONS_DURATION}
        y={BUTTONS_Y}
      >
        <PillButton href={prevHref}>View previous</PillButton>
        <PillButton href={nextHref}>View next</PillButton>
      </Reveal>
    </div>
  );
}
