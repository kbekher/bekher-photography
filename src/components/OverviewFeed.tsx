"use client";

import { useEffect, useRef, useState } from "react";
import PhotoGrid from "./PhotoGrid";
import PillButton from "@/components/ui/PillButton";
import LightboxProvider from "./lightbox/LightboxProvider";
import { homeFeed } from "@/data";

const PAGE_SIZE = 20;
// "priority only for the first row" — 4 columns at the desktop breakpoint.
const PRIORITY_COUNT = 4;

/**
 * Client wrapper around PhotoGrid: paginates the unified home feed 20 at a
 * time. "View previous" appends the next 20 and hides itself once the feed
 * is exhausted. No captions are rendered here — Overview is a bare grid.
 */
export default function OverviewFeed() {
  const [count, setCount] = useState(Math.min(PAGE_SIZE, homeFeed.length));
  const endRef = useRef<HTMLDivElement>(null);
  const hasMore = count < homeFeed.length;
  const visible = homeFeed.slice(0, count);

  // The "View previous" button occupies the same position in the tree while
  // it exists, so a click never loses focus — React keeps the same DOM node
  // across the re-render. Only move focus explicitly for the last click,
  // when the button itself unmounts (its focus would otherwise fall back to
  // <body>).
  useEffect(() => {
    if (!hasMore) {
      endRef.current?.focus();
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
      <div className="flex w-full flex-col items-center">
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
