"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import imageLoader from "@/utils/image-loader";
import { horizontal } from "@/data";
import { useLightbox } from "./lightbox/LightboxProvider";

export interface PhotoTileProps {
  /** S3 key path relative to the lambda base, e.g. "noir-et-blanc/road-in-mist-bw.jpg" */
  src: string;
  /** "3/2" = horizontal, "2/3" = vertical (see data.ts `horizontal`/`vertical` constants) */
  aspectRatio: string;
  alt: string;
  /** Only the first grid row should be priority-loaded. */
  priority?: boolean;
  /**
   * Seam for the lightbox: when provided, the tile renders as a real
   * <button> and calls onClick on activation. Left unwired on Overview/
   * collection grids until the lightbox is built — no lightbox behaviour
   * lives here.
   */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Index within the feed/collection. Must match this photo's position in the
   * `photos` array given to `<LightboxProvider>` — `?photo=<n>` indexes into
   * that same array.
   */
  index?: number;
  /**
   * When true (and `index` is given), the tile becomes a button that opens
   * the lightbox at `index`. Requires a `<LightboxProvider>` ancestor; the
   * provider's default context is inert, so this is safe without one.
   */
  interactive?: boolean;
  /**
   * Box sizing/placement, entirely the caller's job (grid engine or
   * lightbox), e.g. "aspect-[25/36] w-full". Deliberately NOT derived from
   * `aspectRatio` here: the grid tile's box shape (166.67x240 / 215x144) is
   * a layout constant from §3, not the same ratio as the source photo's
   * true aspect ratio (2:3 / 3:2) — object-fit: cover reconciles the two.
   */
  className?: string;
}

/**
 * Per-orientation, because the two tile shapes are genuinely different widths
 * (PhotoGrid's `--tile-v-w` / `--tile-h-w`) and a single shared value has to
 * be the larger of the two — which silently over-fetched every vertical tile,
 * and verticals are most of the feed.
 *
 * These are px, not vw, on purpose: the tracks are a fixed pixel width at
 * each breakpoint (see PhotoGrid's note on why they don't stretch), so a vw
 * value would be a worse description of the same box. See next.config's
 * `imageSizes` for the candidate widths these resolve against.
 */
const SIZES = {
  vertical: "(max-width: 1023px) 141px, 166px",
  horizontal: "(max-width: 1023px) 180px, 215px",
} as const;

/**
 * How many times a tile re-requests an image that failed.
 *
 * The resizer is capped at 10 concurrent invocations and returns 429 past
 * that. A resize across the `lg` breakpoint changes `sizes` for every tile at
 * once, so twenty tiles pick a new srcset candidate simultaneously and
 * everything past the tenth is throttled. Without a retry those tiles keep
 * their `opacity: 0` forever — `onLoad` never fires — which is the "broken
 * images after resizing" symptom exactly: not a broken image, a permanently
 * hidden one.
 *
 * Two attempts on a staggered backoff is enough to ride out a burst, because
 * the burst is self-clearing: the requests that did succeed have freed their
 * concurrency slots by the time the first retry lands.
 */
const MAX_RETRIES = 2;
const RETRY_BASE_MS = 400;

/**
 * Renders a single photo. Sizing/placement is entirely the caller's job
 * (PhotoGrid's grid engine, or later the lightbox) via `className` — this
 * component just fills whatever box it is given with a cover-fit image,
 * plus a shimmer placeholder on load.
 *
 * Lightbox open/close morph is handled imperatively by `lightboxMorph.ts`
 * (GSAP FLIP from this tile's screen rect) — no framer-motion layoutIds here,
 * so intro deal-out transforms on the same node never fight the morph.
 */
export default function PhotoTile({
  src,
  aspectRatio,
  alt,
  priority = false,
  onClick,
  index,
  interactive = false,
  className = "",
}: PhotoTileProps) {
  // Priority tiles are the first row — the LCP element on every grid page —
  // and they start VISIBLE rather than waiting for React to confirm the load.
  //
  // The fade is worth having below the fold and worth nothing above it: the
  // browser paints a webp atomically once decoded, so there is no half-drawn
  // image to hide, and gating on `onLoad` meant the largest thing on the page
  // could not appear until hydration had run and attached the handler. That
  // put LCP behind ~220KB of JavaScript for a purely decorative fade.
  const [loaded, setLoaded] = useState(priority);
  const [attempt, setAttempt] = useState(0);
  const retryTimer = useRef<number | null>(null);
  const lightbox = useLightbox();
  const orientation = aspectRatio === horizontal ? "horizontal" : "vertical";

  useEffect(() => {
    return () => {
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    };
  }, []);

  const handleError = () => {
    if (attempt >= MAX_RETRIES) {
      // Out of retries: reveal the element rather than leaving an invisible
      // hole in the grid. A browser's broken-image glyph is honest; a tile
      // that never arrives looks like a layout bug.
      setLoaded(true);
      return;
    }
    // Staggered so twenty simultaneously-throttled tiles don't retry in
    // lockstep and reproduce the burst that throttled them.
    const backoff = RETRY_BASE_MS * (attempt + 1) + Math.random() * RETRY_BASE_MS;
    retryTimer.current = window.setTimeout(() => setAttempt((n) => n + 1), backoff);
  };

  const image = (
    <Image
      // Remounts on retry, which is what re-issues the request. 429s are not
      // cached by CloudFront, so the retry reaches the origin.
      key={attempt}
      loader={imageLoader}
      src={`/${src}`}
      alt={alt}
      fill
      draggable={false}
      priority={priority}
      sizes={SIZES[orientation]}
      onLoad={() => setLoaded(true)}
      onError={handleError}
      className={`object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );

  const boxClassName = `relative block overflow-hidden ${
    loaded ? "" : "image-placeholder"
  } ${className}`.trim();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick) return onClick(e);
    if (index !== undefined) lightbox.open(index);
  };

  if (onClick || (interactive && index !== undefined)) {
    return (
      <button
        type="button"
        onClick={handleClick}
        data-index={index}
        data-orientation={orientation}
        className={`${boxClassName} cursor-zoom-in appearance-none border-0 bg-transparent p-0 text-left`}
        aria-label={`Open photo: ${alt}`}
      >
        <div className="absolute inset-0">{image}</div>
      </button>
    );
  }

  return (
    <div className={boxClassName} data-index={index} data-orientation={orientation}>
      <div className="absolute inset-0">{image}</div>
    </div>
  );
}
