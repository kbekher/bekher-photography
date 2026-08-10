"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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

// Tiles render at roughly 166-210 CSS px on desktop (see PhotoGrid §3
// geometry) and scale down at narrower breakpoints. Keep this tight — it's
// the single biggest perf lever on the grid pages.
//
// PhotoGrid only has two tiers (GridFrame switches 4-col -> 12-col at
// 1024px, not 640px — see GridFrame's doc). Below 1024px it's a uniform
// 2-up layout, no inset: tile = (viewport - 80 [frame padding] - 40 [one
// gutter]) / 2 = 50vw - 60px, EXACTLY (verified against the same formula
// PhotoGrid's nested grid uses) rather than an approximated vw figure.
// `calc()` here also sidesteps a Next.js quirk: its srcset-width filter
// looks for a bare "Nvw" token in `sizes` to decide which small candidate
// widths to keep, and a raw "50vw" would make it drop the (correct, still
// useful) 256px candidate — writing the exact calc() expression avoids
// that false signal and lets the browser's own layout do the picking.
// At >=1024px the tile is capped by the fixed 1280px frame at 166.67px, so
// a flat 210px is a safe, simple constant rather than a second calc() tier.
// Tiles are now fixed-size (PhotoGrid pins them to the Figma dimensions and
// never scales them up), so `sizes` is just the widest tile at each tier:
// 180px horizontal on phone, 215px horizontal on desktop. Being exact here
// is the biggest perf lever on the grid pages — it keeps the browser from
// pulling multi-thousand-pixel scans for a 215px box.
const SIZES = "(max-width: 1023px) 180px, 215px";

/**
 * Renders a single photo. Sizing/placement is entirely the caller's job
 * (PhotoGrid's grid engine, or later the lightbox) via `className` — this
 * component just fills whatever box it is given with a cover-fit image,
 * plus a shimmer placeholder and fade-in on load.
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
  const [loaded, setLoaded] = useState(false);
  const reduceMotion = useReducedMotion();
  const lightbox = useLightbox();
  const orientation = aspectRatio === horizontal ? "horizontal" : "vertical";

  // Is the lightbox currently showing *this* photo?
  const isActive = lightbox.isOpen && index !== undefined && lightbox.index === index;

  // Spec §5.5: while the lightbox is open, the clicked tile grows into it and
  // every other tile fades away. The active tile hands its position to the
  // overlay via the shared `layoutId`, so it must not also stay painted.
  const dimmed = lightbox.isOpen && !isActive;

  const image = (
    <Image
      loader={imageLoader}
      src={`/${src}`}
      alt={alt}
      fill
      draggable={false}
      priority={priority}
      sizes={SIZES}
      onLoad={() => setLoaded(true)}
      className={`object-cover transition-opacity duration-500 ease-out ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );

  // The shared-element seam (spec §5.5). The overlay renders the same
  // `layoutId`, so framer-motion morphs the tile's on-screen rect into the
  // lightbox rect. We DROP the id on the active tile while the lightbox is
  // open so only one element ever claims a given layoutId at a time —
  // framer still animates from this tile's last recorded position, and two
  // live claimants would fight over the projection.
  const inner = (
    <motion.div
      layoutId={isActive ? undefined : `photo-${src}`}
      className="absolute inset-0"
      animate={{ opacity: isActive ? 0 : dimmed ? 0 : 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {image}
    </motion.div>
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
        {inner}
      </button>
    );
  }

  return (
    <div className={boxClassName} data-index={index} data-orientation={orientation}>
      {inner}
    </div>
  );
}
