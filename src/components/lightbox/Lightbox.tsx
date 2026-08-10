"use client";

/**
 * ⚠️ SHARED-ELEMENT SEAM — read before wiring this up.
 *
 * The photo `<motion.div>` below carries `layoutId={`photo-${current.src}`}`.
 * For the grow/shrink morph in spec §5.5 ("the clicked tile grows in place
 * from its grid rect to the lightbox rect") to actually happen, the grid's
 * tile component MUST wrap its own image in a matching
 * `<motion.div layoutId={`photo-${photo.src}`}>`, using the exact same `src`
 * string as this photo's `LightboxPhoto.src`. Framer-motion matches shared
 * layout transitions purely by that id being mounted in only one place in
 * the tree at a time; no other wiring is required on the grid's side.
 * Without it, the lightbox still opens/closes correctly — it just
 * cross-fades in place instead of growing from the clicked tile's screen
 * position, and the "close reverses the open" requirement degrades to a
 * plain fade rather than a shrink-back-into-the-grid.
 *
 * Also recommended (not implemented here — it's grid-side code this file
 * cannot touch): while the lightbox is open, hide (e.g. `opacity-0`, not
 * unmount — unmounting would break the reverse-close morph) the grid tile
 * whose `src` matches the currently-open photo, and fade out the sibling
 * tiles per §5.5's "the other photos in the grid smoothly disappear". This
 * also avoids a second, hidden element quietly holding the same `layoutId`
 * while the lightbox's own instance is on screen.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import PageShell from "@/components/ui/PageShell";
import PillButton from "@/components/ui/PillButton";
import GridFrame from "@/components/ui/GridFrame";
import imageLoader from "@/utils/image-loader";
import { horizontal } from "@/data";
import { useLightbox, type LightboxPhoto } from "./LightboxProvider";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
// Debounce for thumbnail-strip hover switching (spec §5.6: "smooth... debounce
// lightly so a fast sweep across the strip doesn't thrash").
const THUMB_HOVER_DEBOUNCE_MS = 70;

function buildAlt(photo: LightboxPhoto): string {
  const parts = [photo.description, photo.place, photo.year].filter(
    (value): value is string => Boolean(value && value.trim().length > 0)
  );
  return parts.length > 0 ? parts.join(", ") : "Photograph by Kristina Bekher";
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={direction === "left" ? "rotate-180" : undefined}
    >
      <path
        d="M1 7H13M13 7L8 2M13 7L8 12"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type SwitchMode = "slide-next" | "slide-prev" | "fade";

// Arrow/keyboard nav = a horizontal slide; thumbnail hover = a plain
// crossfade (spec §5.6). Selected per-transition via `custom`.
const slideFadeVariants: Variants = {
  enter: (mode: SwitchMode) => ({
    opacity: 0,
    x: mode === "slide-next" ? 24 : mode === "slide-prev" ? -24 : 0,
  }),
  center: { opacity: 1, x: 0 },
  exit: (mode: SwitchMode) => ({
    opacity: 0,
    x: mode === "slide-next" ? -24 : mode === "slide-prev" ? 24 : 0,
  }),
};

// prefers-reduced-motion: render the final state immediately, no motion.
const staticVariants: Variants = {
  enter: { opacity: 1, x: 0 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 1, x: 0 },
};

/** Mounted once by `LightboxProvider`. Renders nothing while closed. */
export default function Lightbox() {
  const { photos, isOpen, index, close, next, prev, goTo } = useLightbox();
  return (
    <AnimatePresence>
      {isOpen ? (
        <LightboxOverlay photos={photos} index={index} close={close} next={next} prev={prev} goTo={goTo} />
      ) : null}
    </AnimatePresence>
  );
}

interface OverlayProps {
  photos: LightboxPhoto[];
  index: number;
  close: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

function LightboxOverlay({ photos, index, close, next, prev, goTo }: OverlayProps) {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [switchMode, setSwitchMode] = useState<SwitchMode>("fade");
  const hoverTimeoutRef = useRef<number | null>(null);

  const current = photos[index];
  // Captured once, at the moment this overlay instance mounts (i.e. the
  // photo it was opened on) — only THIS photo gets the shared layoutId, so
  // switching to other photos mid-session never fights the grid's own
  // matching layoutId for a tile that isn't the one currently in view. See
  // the file-level comment above.
  const [openedSrc] = useState(() => current?.src);

  const goNext = useCallback(() => {
    setSwitchMode("slide-next");
    next();
  }, [next]);

  const goPrev = useCallback(() => {
    setSwitchMode("slide-prev");
    prev();
  }, [prev]);

  const goThumb = useCallback(
    (i: number) => {
      setSwitchMode("fade");
      goTo(i);
    },
    [goTo]
  );

  const scheduleThumbHover = useCallback(
    (i: number) => {
      if (hoverTimeoutRef.current !== null) window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = window.setTimeout(() => {
        hoverTimeoutRef.current = null;
        goThumb(i);
      }, THUMB_HOVER_DEBOUNCE_MS);
    },
    [goThumb]
  );

  const cancelThumbHover = useCallback(() => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => () => cancelThumbHover(), [cancelThumbHover]);

  // Esc closes, arrows navigate, Tab is trapped inside the dialog. A single
  // window-level listener so it works regardless of what currently has
  // focus inside the overlay.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === "Tab") {
        const container = dialogRef.current;
        if (!container) return;
        const focusable = getFocusable(container);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey) {
          if (active === first || !container.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !container.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, goNext, goPrev]);

  // Move focus into the dialog on open (spec: focus trapped while open).
  useEffect(() => {
    const container = dialogRef.current;
    if (!container) return;
    const focusable = getFocusable(container);
    (focusable[0] ?? container).focus();
    // Intentionally run once on mount only.
     
  }, []);

  // Lock body scroll while open; restore the exact scroll position on close.
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    return () => {
      body.style.overflow = prevOverflow;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);

  if (!current) return null;

  const isHorizontal = current.aspectRatio === horizontal;
  const placeYear = [current.place, current.year].filter(Boolean).join(", ");
  const totalDigits = Math.max(2, String(photos.length).length);
  const counterLabel = `${String(index + 1).padStart(totalDigits, "0")}/${String(photos.length).padStart(
    totalDigits,
    "0"
  )}`;

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      tabIndex={-1}
      className="fixed inset-0 z-50 overflow-y-auto bg-bg outline-none"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
    >
      <PageShell
        navTrailing={
          <PillButton as="button" onClick={close}>
            Close
          </PillButton>
        }
      >
        <motion.div
          className="flex w-full flex-col items-center pt-[64px]"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.15, ease: EASE }}
        >
          <div className="flex w-full flex-col items-center px-[40px] text-center">
            {current.description ? <p>&ldquo;{current.description}&rdquo;</p> : null}
            {placeYear ? <p>{placeYear}</p> : null}
          </div>

          <div className="relative mt-[26px] w-full">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-0 top-1/2 z-10 -m-[10px] -translate-y-1/2 p-[10px] text-fg"
            >
              <ArrowIcon direction="left" />
            </button>

            <GridFrame frame={false}>
              <div
                className={
                  // GridFrame only switches 4 -> 12 columns at `lg:` (1024px),
                  // so these placements MUST use `lg:` too. With `sm:` (640px)
                  // the child asked for columns 4-9 / 5-8 while the frame was
                  // still a 4-column track, breaking every viewport between
                  // 640px and 1023px (iPad portrait, landscape phones).
                  isHorizontal
                    ? "col-span-4 aspect-[580/388] lg:col-start-4 lg:col-span-6"
                    : "col-span-4 aspect-[374/540] lg:col-start-5 lg:col-span-4"
                }
              >
                <AnimatePresence mode="popLayout" custom={switchMode} initial={false}>
                  <motion.div
                    key={current.src}
                    layoutId={current.src === openedSrc ? `photo-${current.src}` : undefined}
                    custom={switchMode}
                    variants={reducedMotion ? staticVariants : slideFadeVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      opacity: { duration: reducedMotion ? 0 : 0.35, ease: EASE },
                      x: { duration: reducedMotion ? 0 : 0.35, ease: EASE },
                      layout: { duration: reducedMotion ? 0 : 0.6, ease: EASE },
                    }}
                    className="relative h-full w-full overflow-hidden"
                  >
                    <Image
                      loader={imageLoader}
                      src={`/${current.src}`}
                      alt={buildAlt(current)}
                      fill
                      priority
                      quality={90}
                      // Orientation matters here: a horizontal photo renders
                      // at a 6-column span (580px) but a vertical one only at
                      // 4 columns (374px). Quoting 580px for both made every
                      // vertical — about half the catalogue — fetch ~2.4x the
                      // pixel area it displays, on the largest image on the
                      // site.
                      sizes={
                        isHorizontal
                          ? "(max-width: 1023px) 92vw, 580px"
                          : "(max-width: 1023px) 92vw, 374px"
                      }
                      className="object-cover"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </GridFrame>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-0 top-1/2 z-10 -m-[10px] -translate-y-1/2 p-[10px] text-fg"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

          <p className="mt-8 text-center tabular-nums" aria-label={`Photo ${index + 1} of ${photos.length}`}>
            {counterLabel}
          </p>

          <div
            role="list"
            aria-label="Photo thumbnails"
            className="mt-[20px] flex w-full flex-wrap items-center justify-center gap-8 px-[40px]"
          >
            {photos.map((photo, i) => {
              const active = i === index;
              const thumbHorizontal = photo.aspectRatio === horizontal;
              return (
                <button
                  key={`${photo.src}-${i}`}
                  type="button"
                  role="listitem"
                  aria-current={active || undefined}
                  aria-label={active ? `${buildAlt(photo)} (current photo)` : buildAlt(photo)}
                  onMouseEnter={() => scheduleThumbHover(i)}
                  onMouseLeave={cancelThumbHover}
                  onFocus={() => goThumb(i)}
                  onClick={() => goThumb(i)}
                  className={`relative block h-[40px] shrink-0 overflow-hidden outline-none transition-opacity duration-200 ${
                    thumbHorizontal ? "aspect-[36/24]" : "aspect-[22/32]"
                  } ${active ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                >
                  <Image
                    loader={imageLoader}
                    src={`/${photo.src}`}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
        </motion.div>
      </PageShell>
    </motion.div>
  );
}
