"use client";

import { useEffect, useRef, useState } from "react";
import PhotoGrid from "./PhotoGrid";
import PillButton from "@/components/ui/PillButton";
import LightboxProvider from "./lightbox/LightboxProvider";
import { useDealOut } from "./intro/useDealOut";
import { homeFeed } from "@/data";

const PAGE_SIZE = 20;
/**
 * How many tiles load eagerly, at high priority.
 *
 * This was 4 — "the first row", counting the desktop breakpoint's four
 * columns. That undercounted the first SCREEN badly: rows are 240px plus a
 * 64px gutter, so a 900px-tall window shows most of three rows, and Next's
 * own LCP detection kept flagging tiles at feed index 11 and 13 as the
 * Largest Contentful Paint while they were still `loading="lazy"`. The
 * largest element on the page was being told it could wait.
 *
 * Eight is two full desktop rows and four phone rows (the grid is 2 columns
 * below `lg`), which covers the first screen on both without eagerly pulling
 * a third of the feed. It is deliberately not twelve: every eager tile is a
 * request that competes for the resizer's ten concurrent slots, and tiles
 * below the fold load almost immediately anyway — lazy loading defers the
 * PRIORITY, not the fetch, for anything near the viewport.
 */
const PRIORITY_COUNT = 8;

/**
 * Client wrapper around PhotoGrid: paginates the unified home feed 20 at a
 * time. "View previous" appends the next 20 and hides itself once the feed
 * is exhausted. No captions are rendered here — Overview is a bare grid.
 */
export default function OverviewFeed() {
  const [count, setCount] = useState(Math.min(PAGE_SIZE, homeFeed.length));
  const endRef = useRef<HTMLDivElement>(null);
  // Grid wrapper ref — the intro's "deal out from centre" (spec §5.1 steps
  // 3-4) reads tile positions off this subtree via PhotoTile's `data-index`
  // attribute and nudges them imperatively. See useDealOut for why that's
  // done from outside rather than by touching PhotoGrid/PhotoTile.
  const gridRef = useRef<HTMLDivElement>(null);
  useDealOut(gridRef);
  const hasMore = count < homeFeed.length;
  const visible = homeFeed.slice(0, count);

  // The "View previous" button occupies the same position in the tree while
  // it exists, so a click never loses focus — React keeps the same DOM node
  // across the re-render. Only move focus explicitly for the last click,
  // when the button itself unmounts (its focus would otherwise fall back to
  // <body>).
  //
  // `preventScroll` is load-bearing, not a precaution. The target is
  // `.sr-only`, which is `position: absolute` with no `top`/`left`, so it
  // resolves to its static position — and for an absolutely-positioned child
  // of a FLEX container (the wrapper below is `flex flex-col`), that is the
  // container's content-box start corner, i.e. the TOP of the grid, not the
  // end of it where this div actually sits in source order. Focusing scrolls
  // the target into view, so without this the last click threw the reader
  // back to scroll 0, away from the photos it had just loaded.
  useEffect(() => {
    if (!hasMore) {
      endRef.current?.focus({ preventScroll: true });
    }
  }, [hasMore]);

  function handleViewPrevious() {
    setCount((prev) => Math.min(prev + PAGE_SIZE, homeFeed.length));
  }

  return (
    // The provider gets the WHOLE feed, not just the visible slice, so
    // `?photo=<n>` indexes stay stable across pagination and a deep link to
    // photo 80 still resolves on first load. `visible` is a prefix slice of
    // `homeFeed`, so a tile's grid index already equals its feed index.
    <LightboxProvider photos={homeFeed}>
      {/*
        No CSS visibility gate here, unlike the collection page's
        `GridReveal.module.css`. The home grid doesn't need one: IntroOverlay
        is an opaque, full-viewport white sheet sitting on top of it for every
        phase up to and including `photo`, so there is nothing to hide the
        gather behind — it's already hidden. `useDealOut` owns this wrapper's
        opacity outright from `gather` onwards.

        This used to carry an `.intro-grid-gate` class scoped to
        `html[data-intro="play"]`, which made the grid's visibility depend on
        an attribute that something else could remove (see IntroContext's note
        on the StrictMode unmount that used to do exactly that). An
        `opacity: 0` whose escape hatch lives in a DIFFERENT file than the code
        that clears it is a blank-page waiting to happen.
      */}
      <div ref={gridRef} className="flex w-full flex-col items-center">
        <PhotoGrid photos={visible} priorityCount={PRIORITY_COUNT} />

        {/* Polite announcement so screen reader users hear the feed grow. */}
        <div aria-live="polite" className="sr-only">
          {`Showing ${visible.length} of ${homeFeed.length} photos`}
        </div>

        {hasMore ? (
          <div className="mt-[64px]">
            <PillButton as="button" onClick={handleViewPrevious}>
              View previous
            </PillButton>
          </div>
        ) : (
          <div ref={endRef} tabIndex={-1} className="sr-only">
            End of photos
          </div>
        )}
      </div>
    </LightboxProvider>
  );
}
