"use client";

import { useEffect, useState } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import PillButton from "@/components/ui/PillButton";
import Reveal from "@/components/ui/Reveal";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import { useCollectionDealOut } from "@/components/collection/useCollectionDealOut";
import {
  ARRIVE_MS,
  RISE_PX,
  STAGGER_TEXT_MS,
} from "@/components/intro/introTimings";
import type { Gallery } from "@/data";
import styles from "@/components/collection/GridReveal.module.css";

export interface CollectionContentProps {
  gallery: Gallery;
  /** Index link shown between prev/next on mobile (`/collections`). */
  backHref: string;
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
 *   prev/next     once the deal has fully landed (synced via `dealDone`)
 *
 * Only the two text beats' numbers live here. The prev/next pair waits on
 * `useCollectionDealOut`'s `dealDone` flag so it never quotes a stale delay
 * if the deal-out timings change.
 */
// All three text beats are the same gesture — something arriving and staying
// — so all three are ARRIVE_MS at RISE_PX, one STAGGER_TEXT_MS apart. They
// used to be 0.45/0.4/0.4 at y 14/10/8, three tunings of one thing.
const NAME_DURATION = ARRIVE_MS / 1000;
const NAME_Y = RISE_PX;

const DESCRIPTION_DURATION = ARRIVE_MS / 1000;
const DESCRIPTION_DELAY = STAGGER_TEXT_MS / 1000;
const DESCRIPTION_Y = RISE_PX;

const BUTTONS_DURATION = ARRIVE_MS / 1000;
const BUTTONS_Y = RISE_PX;

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
 * The gated wrapper below is deliberately scoped to wrap only `<PhotoGrid>`, not
 * `<LightboxProvider>` itself — `LightboxProvider` also renders the
 * `<Lightbox/>` overlay as a sibling of its children, and that overlay must
 * never be swept into the same `[data-index]` query the deal-out hook runs
 * against (same nesting `OverviewFeed` uses for the home feed).
 */
export default function CollectionContent({
  gallery,
  backHref,
  prevHref,
  nextHref,
}: CollectionContentProps) {
  // Already `LightboxPhoto`-shaped — `Photo.src` is the full S3 key (see
  // src/data.ts), so there is nothing to map.
  const photos = gallery.photos;

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

  // A ref CALLBACK, not a RefObject — the hook has to know the exact commit
  // the grid attaches on, because on a reload it is not the one this
  // component mounts in. See useCollectionDealOut's doc comment.
  const { setGridRef, dealDone } = useCollectionDealOut({ enabled: dealEnabled });

  return (
    <div className="flex w-full flex-col items-center flex-1">
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
        <div ref={setGridRef} className={`mt-48 w-full flex-1 ${styles.gate}`}>
          {/* Two desktop rows / four phone rows — the first screen. See
              OverviewFeed's note on why this is 8 and not 4. */}
          <PhotoGrid photos={photos} priorityCount={8} />
        </div>
      </LightboxProvider>

      <Reveal
        // Full-width with the buttons pushed to the edges on phone — three
        // pills centred with a gap leaves them clustered in the middle of a
        // narrow screen. From `lg` there is room, so it goes back to centred.
        className="mt-auto pt-24 mb-24 flex w-full flex-wrap items-center justify-between gap-8 lg:justify-center lg:gap-[40px]"
        startWhen={dealDone}
        duration={BUTTONS_DURATION}
        y={BUTTONS_Y}
      >
        <PillButton href={prevHref}>View previous</PillButton>
        <PillButton href={backHref} className="lg:hidden">
          Back
        </PillButton>
        <PillButton href={nextHref}>View next</PillButton>
      </Reveal>
    </div>
  );
}
