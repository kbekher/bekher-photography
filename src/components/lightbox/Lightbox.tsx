"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import PillButton from "@/components/ui/PillButton";
import SiteHeader from "@/components/ui/SiteHeader";
import imageLoader from "@/utils/image-loader";
import { useImageRetry } from "@/utils/useImageRetry";
import { prefersReducedMotion, useReducedMotion } from "@/utils/useReducedMotion";
import {
  FADE_MS,
  FLIGHT_MS,
  GSAP_EASE,
  SNAP_MS,
} from "@/components/intro/introTimings";
import { horizontal } from "@/data";
import { useLightbox, type LightboxPhoto } from "./LightboxProvider";
import {
  getTileImageSrc,
  killMorph,
  morphClose,
  morphOpen,
  revealAllTiles,
  setTileHidden,
} from "./lightboxMorph";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Everything that is not the photo itself. Faded as one group on open and
 *  close, via this attribute rather than a ref per element. */
const CHROME_SELECTOR = "[data-lb-chrome]";

// The lightbox's CHROME is on the site's shared scale; its morph deliberately
// is not (see lightboxMorph.ts). Backdrop and chrome are pure opacity changes
// on things that do not move, so FADE_MS; chrome leaving is something getting
// out of the way, so SNAP_MS; the hero fade and the photo crossfade are short
// moves, so FLIGHT_MS. Every one of these was already within ~60ms of its
// beat — they were tuned by eye to the same tempo, just never told about it.
const BACKDROP_IN_S = FADE_MS / 1000;
const BACKDROP_OUT_S = FADE_MS / 1000;
const CHROME_IN_S = FADE_MS / 1000;
const CHROME_IN_DELAY_S = SNAP_MS / 1000;
const CHROME_OUT_S = SNAP_MS / 1000;
/** Fallback when there is no tile to morph from/to (deep link, or a photo
 *  past the end of the home feed's rendered page). */
const HERO_FADE_S = FLIGHT_MS / 1000;
/** Crossfade when switching photos with the arrows or the thumb strip. */
const SWITCH_S = FLIGHT_MS / 1000;
/**
 * Last-resort valve for a switch that never reports back — an aborted request,
 * a tab resuming from sleep. See the timeout effect for why it exists.
 *
 * It used to be 1.2s, and that was the white screen: a hero rendition is
 * ~650KB-1.5MB, so this fired on any ordinary slow connection, dropped the
 * shimmer and ran the crossfade on an `<img>` that had no pixels yet. Now that
 * the placeholder survives a switch (nothing below keys the shimmer off this),
 * landing early no longer paints an empty frame, so the valve can sit where a
 * genuinely stuck request is the only thing that trips it.
 */
const SWITCH_LOAD_TIMEOUT_MS = 10000;

// --- Touch navigation -----------------------------------------------------
// Gesture thresholds only. A swipe/tap here does exactly what an arrow click
// does — it hands off to the same crossfade — so there is deliberately no
// motion tied to the finger: the photo never moves, it changes.

/**
 * The SEED window: how many thumbnails either side of the active one render
 * an `<Image>` before the IntersectionObserver below has said anything.
 *
 * Whether a thumbnail renders its image is a question about VISIBILITY, and
 * this constant is not that — it is only the answer for the very first commit,
 * when there has been no observation yet. It exists so that commit is not
 * empty and so the `scrollIntoView` effect has a real, painted thumbnail to
 * centre on. Everything after that frame comes from the observer.
 *
 * ## Why it is not the whole answer any more, and why it is still small
 * It used to be 20, and it used to be the ONLY rule — a thumbnail further than
 * 20 positions from the active photo rendered no image at all, just the
 * `bg-fg/10` box. The strip is the whole feed (134 photos on the home page)
 * and is horizontally scrollable, so scrolling it past the twentieth thumbnail
 * showed nothing but grey boxes, for ever: an index window cannot know where
 * the strip is scrolled to. Tapping one made it active, the window re-centred
 * on it, and only then did it load. That was the reported "thumbnails stay
 * grey until I tap them".
 *
 * Going the other way and simply rendering all 134 is the reason the window
 * was there in the first place: each entry mounts a next/image with a
 * 14-candidate srcset (next.config's `deviceSizes` plus `imageSizes`, all of
 * them emitted because `sizes` is given in px), i.e. ~1,900 candidate URLs for
 * the browser to parse, built SYNCHRONOUSLY in the commit that opens the lightbox
 * — main-thread work landing precisely on the frame the open morph is trying
 * to keep smooth. And every rendered thumbnail is a request the 10-concurrent
 * resizer has to answer (see `useImageRetry`).
 *
 * So: visibility decides, and this only seeds it. 2 rather than 20 because
 * five thumbnails is all the first frame needs — the observer's first delivery
 * lands within a frame or two of it and covers the rest of the strip's
 * viewport.
 *
 * The buttons themselves all render regardless, at every index. They cost
 * almost nothing, and keeping them is what preserves the strip's true scroll
 * extent, the `scrollIntoView` targets and the a11y tree.
 */
const THUMB_RENDER_WINDOW = 2;

/**
 * How far outside the strip's own box a thumbnail starts loading, as an
 * `IntersectionObserver` rootMargin on the horizontal axis only.
 *
 * The strip's pitch is 36px per vertical thumbnail and 68px per horizontal one
 * (the thumb plus this row's 8px gap), so 200px buys between three and five
 * thumbnails of lead in each direction: a swipe or a flick of the strip
 * arrives at photos that have already been asked for rather than at grey boxes
 * — which is the other half of what "small images should load on swipe" was
 * asking for.
 *
 * Deliberately modest. Every px of margin here is more thumbnails committed
 * and fetched in one go, and the origin throttles bursts; the retry in
 * `useImageRetry` now catches what does get throttled, but not needing to be
 * caught is better than being caught.
 */
const THUMB_PRELOAD_PX = 200;

/** Fraction of the frame's width a swipe must cover to count — but never
 *  fewer than MIN_COMMIT_PX, so a narrow frame stays swipeable. */
const SWIPE_RATIO = 0.22;
const MIN_SWIPE_PX = 48;
/** px/ms past which a flick counts however far it actually travelled. A fast
 *  flick is unambiguous, and demanding distance from it is exactly what makes
 *  a swipe feel unresponsive. */
const SWIPE_VELOCITY = 0.45;
/** Movement before a gesture is classified as horizontal or vertical. */
const AXIS_LOCK_PX = 8;
/** A touch that never locked an axis and ended within this is a tap. */
const TAP_MAX_MS = 300;
/** Left of this fraction of the frame taps backwards, right of it forwards.
 *  Under half on purpose: forward is the overwhelmingly common intent. */
const TAP_PREV_ZONE = 0.4;

/**
 * The hero's box, sized to ONE photo's aspect. Both crossfade layers call
 * this with their own photo, which is what stops a frame from changing shape
 * before the photo inside it does. See `.lightbox-hero-frame` in globals.css
 * for how `--rw`/`--rh` turn into an actual on-ratio size.
 */
const HERO_BOX_CLASS = "lightbox-hero-frame relative shrink-0 overflow-hidden";

function heroBoxClass(photo: LightboxPhoto): string {
  return photo.aspectRatio === horizontal
    ? `${HERO_BOX_CLASS} lightbox-hero-frame--horizontal`
    : HERO_BOX_CLASS;
}

function heroFrameStyle(photo: LightboxPhoto): CSSProperties {
  const [rw, rh] = photo.aspectRatio === horizontal ? [580, 388] : [374, 540];
  return { "--rw": rw, "--rh": rh } as CSSProperties;
}

/**
 * What the browser is told to download for the hero — the single biggest lever
 * on how long a photo takes to appear, and what the old values got wrong.
 *
 * `sizes` has to describe the box `.lightbox-hero-frame` actually produces:
 *  - phones: the frame is `100cqw`, i.e. the viewport minus the dialog's 80px
 *    of side padding, and hard-capped at the photo's nominal width (374px
 *    vertical / 580px horizontal). Above ~460/660px wide, that cap — not the
 *    viewport — is what you get, all the way to `lg`.
 *  - desktop: the frame is HEIGHT-driven (`--h: min(100cqh, …)`, width follows
 *    from the aspect), so the hint has to follow the viewport's height. `vh`
 *    is a legal source-size and is the only way to say that. The hero viewport
 *    is roughly `100vh` minus ~310px of chrome (header, caption, counter,
 *    thumb strip), so a vertical frame is ≈0.69·(100vh − 310px) ≈ 50vh and a
 *    horizontal one ≈1.5·(100vh − 310px), capped by the 1280px container, so
 *    ≈90vh.
 *
 * The flat 900px/1280px hints described neither. On a retina laptop the
 * vertical hero asked for the 1920px rendition — 1.5MB, and above this photo
 * set's ~2075px native width, so it was the full scan — to fill a box ~420 CSS
 * px wide. Right-sized, that same hero is the 1080px rendition at ~650KB.
 *
 * The numbers lean generous on purpose: a hint slightly too large costs one
 * srcset step, one slightly too small costs sharpness.
 */
/** Paint a cached, already-decoded stand-in behind a hero frame — see
 *  `previewSrc`. `cover`/`center` matches the `<img>`'s own object-fit, so the
 *  photo resolves on top of itself rather than over a differently framed crop. */
function previewStyle(src: string | null): CSSProperties | undefined {
  return src
    ? {
        backgroundImage: `url("${src}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;
}

/** The shimmer is the LAST resort — only for a photo with no tile on the page
 *  to borrow a stand-in from (a deep link, or a photo past the end of the
 *  home feed's rendered page). */
function frameClass(photo: LightboxPhoto, showShimmer: boolean): string {
  return showShimmer ? `${heroBoxClass(photo)} image-placeholder` : heroBoxClass(photo);
}

function heroSizesFor(photo: LightboxPhoto): string {
  return photo.aspectRatio === horizontal
    ? "(max-width: 660px) 90vw, (max-width: 1023px) 580px, 90vh"
    : "(max-width: 454px) 85vw, (max-width: 1023px) 374px, 50vh";
}

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

const ARROW_BTN_CLASS =
  "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center text-fg lg:flex";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={direction === "right" ? "scale-x-[-1]" : undefined}
    >
      <path
        d="M8.80249 11.62L4.99916 7.81667C4.54999 7.36751 4.54999 6.63251 4.99916 6.18334L8.80249 2.38"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ThumbProps {
  photo: LightboxPhoto;
  index: number;
  active: boolean;
  /** Whether this thumbnail's `<Image>` is mounted at all — see
   *  `THUMB_RENDER_WINDOW` and the observer in `LightboxOverlay`. */
  render: boolean;
  onSelect: (index: number) => void;
  /** Hands this thumbnail's button to the strip's IntersectionObserver and
   *  returns the matching un-observe. Stable for the life of the overlay. */
  observe: (node: HTMLElement) => () => void;
}

/**
 * One thumbnail.
 *
 * A component rather than JSX inline in the `.map()` for one reason: retry
 * state is PER IMAGE. The strip commits a row of thumbnails at once, all of
 * them asking the resizer for a 96px rendition nothing else on the page has
 * ever requested, and the resizer 429s past ten concurrent invocations. The
 * strip used to have no `onError` at all, so a throttled thumbnail painted
 * the browser's broken-image glyph and kept it for the life of the overlay —
 * intermittently, depending on what was already warm at the CDN edge, which
 * is exactly how it was reported.
 *
 * When the retries are spent the image is dropped rather than left to render
 * its glyph: a thumbnail that will not load should be indistinguishable from
 * the deliberate `bg-fg/10` placeholder the strip already uses for one that
 * hasn't been scrolled to. (`PhotoTile` makes the opposite call for a full
 * grid tile, and says why there.)
 */
function LightboxThumb({ photo, index, active, render, onSelect, observe }: ThumbProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { attempt, exhausted, onError } = useImageRetry();

  // Passive, not layout: the observer is created in the overlay's LAYOUT
  // effect, and React runs every layout effect in a commit before any passive
  // one — so by the time this runs there is always an observer to register
  // with, on the first commit as much as on any later one.
  useEffect(() => {
    const node = buttonRef.current;
    if (!node) return;
    return observe(node);
  }, [observe]);

  const showImage = render && !exhausted;
  const thumbHorizontal = photo.aspectRatio === horizontal;

  return (
    <button
      ref={buttonRef}
      type="button"
      data-thumb-index={index}
      aria-current={active || undefined}
      aria-label={active ? `${buildAlt(photo)} (current photo)` : buildAlt(photo)}
      onClick={() => onSelect(index)}
      className={`relative block h-[40px] shrink-0 cursor-pointer overflow-hidden outline-none transition-opacity duration-200 ${
        thumbHorizontal ? "aspect-[36/24]" : "aspect-[22/32]"
      } ${active ? "opacity-100" : "opacity-40 hover:opacity-70"} ${
        showImage ? "" : "bg-fg/10"
      }`}
    >
      {showImage ? (
        <Image
          // Remounts on retry, which is what re-issues the request. 429s are
          // not cached by CloudFront, so the retry reaches the origin.
          key={attempt}
          loader={imageLoader}
          src={`/${photo.src}`}
          alt=""
          fill
          sizes="40px"
          className="object-cover"
          draggable={false}
          onError={onError}
        />
      ) : null}
    </button>
  );
}

/**
 * Mount gate for the overlay, which has to outlive `isOpen` so the close
 * morph can finish playing.
 *
 * ## Why there is a session id
 * Reopening DURING a close is easy to do by accident and used to kill the
 * lightbox outright. The grid is fully visible again 300ms into a 440ms
 * close, so clicking another tile then is invited, not exotic. Two things
 * went wrong at once:
 *
 *  1. `mounted` was already `true`, so the new open only RECONCILED the dying
 *     overlay. Its open sequence is a mount-only layout effect, so no morph
 *     ran — you got the old hero still shrinking away with the new photo
 *     crossfading on top of it and the chrome stuck at opacity 0.
 *  2. Worse, the old close then completed and unmounted the overlay while
 *     `isOpen` was `true`. The effect below is keyed on `isOpen`, which had
 *     not changed, so `setMounted(true)` never fired again — leaving
 *     `?photo=n` in the URL with no overlay, no Close button and no Escape
 *     target, permanently, for the rest of the page's life.
 *
 * Keying the overlay on a per-open id fixes both: a re-open mounts a genuinely
 * fresh overlay (so the open sequence runs), and the old instance's unmount
 * cleanup tears its morph down. `handleClosed` then ignores any close report
 * that isn't from the CURRENT session, so a stale one can no longer unmount
 * the live overlay.
 */
export default function Lightbox() {
  const { isOpen } = useLightbox();
  const [mounted, setMounted] = useState(isOpen);
  // Seeded to 1 when the page loads with `?photo=` already set, so that
  // deep-link mount isn't immediately remounted by the effect below.
  const [session, setSession] = useState(() => (isOpen ? 1 : 0));
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const wasOpenRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) setSession((s) => s + 1);
    wasOpenRef.current = isOpen;
    if (isOpen) setMounted(true);
  }, [isOpen]);

  const handleClosed = useCallback((closedSession: number) => {
    if (closedSession === sessionRef.current) setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <LightboxOverlay
      key={session}
      session={session}
      isOpen={isOpen}
      onClosed={handleClosed}
    />
  );
}

interface OverlayProps {
  isOpen: boolean;
  /** This overlay's open id — echoed back through `onClosed` so a stale
   *  instance can't unmount the one that replaced it. */
  session: number;
  onClosed: (session: number) => void;
}

/**
 * The lightbox overlay, mounted only while open (plus the close morph).
 *
 * ## The bug this file's structure exists to prevent
 * `?photo=<n>` is the single source of truth for both "is the lightbox open"
 * and "which photo" — see `useLightboxRoute`. Closing therefore drops the
 * param, and `index` snaps back to its 0 default IN THE SAME RENDER that
 * flips `isOpen` to false. Any close logic that reads `index` (or
 * `photos[index]`) at that point is reading 0, not the photo the user was
 * actually looking at. That is precisely why closing always used to shrink
 * back into the FIRST tile, and why the hero visibly swapped to the first
 * photo on the way down.
 *
 * `lastOpen` below is the fix, and it is a piece of state rather than a
 * convenience: it latches `{ index, photo }` on every render where the
 * lightbox IS open, and every close-path consumer — the morph target, the
 * rendered photo, the aspect ratio of the hero box — reads from it instead of
 * from the live route. Because it is updated in an effect that only runs
 * while open, the render that closes already has the correct frozen value; no
 * extra commit, so no frame of the wrong photo.
 *
 * ## Open / close, beat by beat
 * open   backdrop fades up over the grid; chrome follows just behind; the
 *        hero FLIPs out of the clicked tile's rect into its own layout box
 *        (`morphOpen`), painting the tile's already-cached image underneath
 *        itself so the growing box is never empty.
 * close  chrome snaps out; the backdrop fades away to reveal the grid; the
 *        hero FLIPs back down into its tile and that tile is un-hidden on the
 *        frame the hero lands (`morphClose`); only then does the overlay
 *        unmount.
 *
 * Every one of those has a no-tile fallback (a deep link has no tile to come
 * from; the paginated home feed may have no tile to return to) which degrades
 * to a fade rather than animating from a garbage rect.
 */
function LightboxOverlay({ isOpen, session, onClosed }: OverlayProps) {
  const { photos, index, morphFromClick, close, next, prev, goTo } = useLightbox();
  const reducedMotion = useReducedMotion();

  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  /** The area a swipe/tap is read from; see the touch effect for why it is
   *  this element and not the dialog. */
  const viewportRef = useRef<HTMLDivElement>(null);
  /** Live gesture state. A ref, not state: it updates on every touchmove and
   *  must never cause a render — nothing on screen follows the finger. */
  const dragRef = useRef({
    active: false,
    axis: null as null | "x" | "y",
    dx: 0,
    startX: 0,
    startY: 0,
    startT: 0,
  });

  const [isClosing, setIsClosing] = useState(false);
  // See the doc comment above — the whole close path reads this, never
  // `index`, because `index` is already 0 by then.
  const [lastOpen, setLastOpen] = useState(() => ({ index, photo: photos[index] }));
  const wasOpenRef = useRef(isOpen);
  // Whether this overlay was opened by clicking a tile (vs. a `?photo=` deep
  // link on load). Captured at mount: the provider clears `morphFromClick` as
  // soon as the route closes, which is too early for the close path to read.
  const openedFromClickRef = useRef(morphFromClick);
  const activeIndexRef = useRef(index);

  const activeIndex = isOpen ? index : lastOpen.index;
  const current = isOpen ? photos[index] : lastOpen.photo;
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    if (isOpen && photos[index]) setLastOpen({ index, photo: photos[index] });
  }, [isOpen, index, photos]);

  // --- Photo switching (arrows / thumbnails) -------------------------------
  //
  // `displayIndex` lags `activeIndex` until the incoming photo has loaded and
  // the switch has landed. Each layer gets its OWN aspect box (see
  // `heroBoxClass`) so a horizontal frame never crops a vertical photo.
  //
  // On navigation the outgoing photo hides immediately and the incoming frame
  // appears at once with a stand-in (see `previewSrc`), so thumbnail/metadata
  // changes are not left hanging over the previous image while the full-size
  // file loads. Once the incoming `<img>` has loaded AND decoded, it fades in
  // and `displayIndex` catches up.
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [incomingTimedOut, setIncomingTimedOut] = useState(false);
  const switchingTo = displayIndex !== activeIndex ? activeIndex : null;
  const displayPhoto = photos[displayIndex] ?? current;
  const incomingPhoto = switchingTo !== null ? photos[switchingTo] : undefined;
  // Set just before `displayIndex` catches up, so the layout effect that
  // resets the resting layer's tweened opacity can tell a completed switch
  // apart from the initial mount (whose opacity belongs to the open sequence).
  const switchLandedRef = useRef(false);

  const goNext = useCallback(() => next(), [next]);
  const goPrev = useCallback(() => prev(), [prev]);
  const goThumb = useCallback((i: number) => goTo(i), [goTo]);

  // --- "Has this photo actually got pixels?" -------------------------------
  //
  // Tracked per SRC rather than per layer, which is what makes the handover at
  // the end of a switch seamless. Landing mounts a brand-new `<img>` in the
  // resting layer for a url the incoming layer just finished downloading; that
  // img is a memory-cache hit, but its own `load` event is still asynchronous,
  // so a per-layer flag would show a frame or two of placeholder every single
  // time a switch completed. Keyed on the url, the resting layer knows the
  // photo is already there and renders it as ready immediately.
  //
  // A ref + a bump rather than a `Set` in state: this is a monotonic cache,
  // never re-read across renders for anything but membership, and rebuilding a
  // Set on every load only to render the same thing is pure ceremony.
  const loadedSrcsRef = useRef<Set<string>>(new Set());
  const [, bumpLoaded] = useReducer((n: number) => n + 1, 0);
  const markLoaded = useCallback((src: string, img: HTMLImageElement | null) => {
    const mark = () => {
      if (loadedSrcsRef.current.has(src)) return;
      loadedSrcsRef.current.add(src);
      bumpLoaded();
    };
    // `load` means the bytes arrived, NOT that there is a frame ready to
    // paint — decoding a 2000px photo takes real time on a phone, and that
    // gap is exactly the flash this whole file is trying to remove. `decode()`
    // closes it; if it rejects (src changed, no support) fall through, because
    // a slightly early swap still beats waiting forever.
    if (typeof img?.decode === "function") img.decode().then(mark, mark);
    else mark();
  }, []);

  /**
   * The grid tile's own already-decoded image, painted UNDER the hero as a
   * low-res stand-in while the full-size rendition loads. Free — the browser
   * has it in cache and on screen already — and far better than a shimmer,
   * because what you see is the photo you asked for, arriving blurry and then
   * sharpening, rather than a grey box.
   *
   * `previewSrc` belongs to whatever is in the RESTING layer, so it is set at
   * open and re-read when a switch lands; the incoming layer carries its own.
   * Both stay painted for the life of their layer: dropping one the moment its
   * `<img>` reports ready is what used to expose the background between the
   * stand-in going and the photo painting.
   */
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [incomingPreviewSrc, setIncomingPreviewSrc] = useState<string | null>(null);

  // Whether prefetching the neighbouring photos is a favour or an imposition.
  // Resolved after mount, never during render: this component server-renders
  // on a `?photo=` deep link, and it also means the first paint carries no
  // warmers at all — which is what we want anyway, the hero comes first.
  const [mayWarm, setMayWarm] = useState(false);
  useEffect(() => {
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    setMayWarm(
      !connection?.saveData && !/(^|-)2g$/.test(connection?.effectiveType ?? "")
    );
  }, []);

  const restingLoaded = loadedSrcsRef.current.has(displayPhoto.src);
  const incomingLoaded = incomingPhoto
    ? loadedSrcsRef.current.has(incomingPhoto.src)
    : false;
  const incomingReady = incomingLoaded || incomingTimedOut;

  // Belt and braces: a photo that never fires `load` or `error` (an aborted
  // request, an offline tab resuming) must not freeze the viewer on the
  // previous photo forever. After this the switch proceeds regardless — the
  // resting layer keeps the stand-in and the shimmer until the photo lands, so
  // proceeding early costs nothing visually.
  useEffect(() => {
    if (switchingTo === null || incomingLoaded) return;
    const t = window.setTimeout(() => setIncomingTimedOut(true), SWITCH_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [switchingTo, incomingLoaded]);

  // Hide the resting photo and show the incoming placeholder frame the same
  // frame the route changes — do not wait for the full-size image to load.
  useLayoutEffect(() => {
    if (switchingTo === null) return;
    setIncomingTimedOut(false);
    // In a LAYOUT effect so the stand-in is on the incoming frame before it is
    // ever painted; a passive effect here would show one frame of empty box.
    setIncomingPreviewSrc(getTileImageSrc(switchingTo));
    const outgoing = heroRef.current;
    const incoming = incomingRef.current;
    if (outgoing) {
      gsap.killTweensOf(outgoing);
      gsap.set(outgoing, { opacity: 0 });
    }
    if (incoming) {
      gsap.killTweensOf(incoming);
      gsap.set(incoming, { opacity: 1 });
    }
  }, [switchingTo]);

  useLayoutEffect(() => {
    if (switchingTo === null || !incomingReady) return;
    const incoming = incomingRef.current;
    const land = () => {
      switchLandedRef.current = true;
      // The stand-in moves down with the photo, so the resting layer has
      // something under it if this switch landed on the timeout rather than on
      // a load. Re-read from the grid rather than carried over from
      // `incomingPreviewSrc`, which is only as fresh as the last render.
      setPreviewSrc(getTileImageSrc(switchingTo));
      setDisplayIndex(switchingTo);
    };
    if (!incoming || reducedMotion) {
      land();
      return;
    }
    const img = incoming.querySelector("img");
    if (!img) {
      land();
      return;
    }
    const tl = gsap.timeline({ onComplete: land });
    tl.fromTo(img, { opacity: 0 }, { opacity: 1, duration: SWITCH_S, ease: GSAP_EASE });
    return () => {
      tl.kill();
    };
  }, [switchingTo, incomingReady, reducedMotion]);

  // The resting layer was faded to 0 by the crossfade above; now that it has
  // re-rendered as the NEW photo it has to come back. In a layout effect so it
  // happens before paint — a passive effect here would show one frame of a
  // fully transparent hero.
  useLayoutEffect(() => {
    if (!switchLandedRef.current) return;
    switchLandedRef.current = false;
    const el = heroRef.current;
    if (el) gsap.set(el, { opacity: 1 });
  }, [displayIndex]);

  // --- Swipe + tap ---------------------------------------------------------
  //
  // Touch had no way to move between photos at all: the arrows are `lg:` only,
  // which left the thumbnail strip as the sole control on a phone. So swipe
  // horizontally to move, or tap the left of the frame to go back and the
  // right to go forward.
  //
  // This is gesture DETECTION only — it calls the same `next`/`prev` an arrow
  // click does and the existing crossfade takes it from there. Nothing tracks
  // the finger.
  //
  // ## Native listeners, not React's `onTouch*`
  // `touchmove` has to be non-passive so a horizontal drag can
  // `preventDefault` and stop the browser also reading it as a scroll or an
  // edge back-navigation. React attaches its own touch listeners passively at
  // the root, where `preventDefault` is a no-op.
  //
  // ## Why the hero VIEWPORT and not the dialog
  // The thumbnail strip is its own horizontally scrollable element. Bound any
  // higher and a swipe along the strip would change photo instead of scrolling
  // it — the two gestures are identical and only the target tells them apart.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || photos.length < 2 || isClosing) return;

    const drag = dragRef.current;
    const swipeDistance = () =>
      Math.max(MIN_SWIPE_PX, (heroRef.current?.offsetWidth ?? vp.clientWidth) * SWIPE_RATIO);

    function onStart(event: TouchEvent) {
      // Never hijack a press on a control, and never try to interpret a second
      // finger — a pinch to zoom the photo has to keep working.
      if (event.touches.length !== 1) {
        drag.active = false;
        return;
      }
      if ((event.target as HTMLElement | null)?.closest("button")) return;
      const t = event.touches[0];
      drag.active = true;
      drag.axis = null;
      drag.dx = 0;
      drag.startX = t.clientX;
      drag.startY = t.clientY;
      drag.startT = performance.now();
    }

    function onMove(event: TouchEvent) {
      if (!drag.active) return;
      if (event.touches.length !== 1) {
        drag.active = false;
        return;
      }
      const t = event.touches[0];
      const dx = t.clientX - drag.startX;
      const dy = t.clientY - drag.startY;

      // Decide the axis ONCE and stay decided. Re-deciding as the finger
      // wanders would let a drifting vertical drag turn into a photo change.
      if (drag.axis === null) {
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        drag.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      if (drag.axis !== "x") return;
      event.preventDefault();
      drag.dx = dx;
    }

    const onEnd = (event: TouchEvent) => {
      if (!drag.active) return;
      drag.active = false;
      const elapsed = Math.max(1, performance.now() - drag.startT);
      const touch = event.changedTouches[0];

      // Never became a drag: a tap.
      if (drag.axis === null) {
        if (elapsed > TAP_MAX_MS || !touch) return;
        const rect = vp.getBoundingClientRect();
        const ratio = (touch.clientX - rect.left) / Math.max(1, rect.width);
        if (ratio < TAP_PREV_ZONE) goPrev();
        else goNext();
        return;
      }
      if (drag.axis !== "x") return;

      const dx = drag.dx;
      const velocity = Math.abs(dx) / elapsed;
      if (Math.abs(dx) < swipeDistance() && velocity < SWIPE_VELOCITY) return;
      // Swiping left pulls the next photo in from the right, which is the
      // direction the content conceptually moves.
      if (dx < 0) goNext();
      else goPrev();
    };

    function onCancel() {
      drag.active = false;
    }

    vp.addEventListener("touchstart", onStart, { passive: true });
    vp.addEventListener("touchmove", onMove, { passive: false });
    vp.addEventListener("touchend", onEnd, { passive: true });
    vp.addEventListener("touchcancel", onCancel, { passive: true });
    return () => {
      vp.removeEventListener("touchstart", onStart);
      vp.removeEventListener("touchmove", onMove);
      vp.removeEventListener("touchend", onEnd);
      vp.removeEventListener("touchcancel", onCancel);
    };
  }, [photos.length, isClosing, goNext, goPrev]);

  // Exactly one grid tile is hidden at a time: the one the hero is currently
  // standing in for. `morphOpen` hides the tile it grows out of, but arrows
  // and the thumbnail strip move the hero somewhere else afterwards, and
  // without this that stays true of the ORIGINAL tile forever. Two visible
  // consequences, both of which this exists to prevent:
  //  - the destination tile sits fully visible under the hero for the whole
  //    close descent, so the morph reads as a duplicate rather than a return;
  //  - the original tile is still a hole in the grid for the ~140ms between
  //    the backdrop clearing and the morph landing, then pops back in.
  //
  // Frozen once `isOpen` goes false: from that point the close path owns tile
  // visibility (`morphClose` un-hides its target on the frame the hero lands,
  // which has to be the same frame or you get a gap/double).
  const hiddenTileRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = hiddenTileRef.current;
    if (previous !== null && previous !== activeIndex) setTileHidden(previous, false);
    setTileHidden(activeIndex, true);
    hiddenTileRef.current = activeIndex;
  }, [isOpen, activeIndex]);

  // --- Which thumbnails have an image ---------------------------------------
  //
  // Visibility inside the STRIP decides, not distance from the active photo.
  // See `THUMB_RENDER_WINDOW` for what the old index window got wrong (the
  // whole strip past ±20 was permanently grey) and why an unwindowed strip is
  // not the answer either.
  //
  // The set only ever GROWS. A thumbnail scrolled back out is left mounted on
  // purpose: unmounting it would re-issue its request the next time it came
  // back, so scrubbing the strip back and forth would manufacture exactly the
  // burst the origin's 10-concurrent cap punishes. A mounted 40px webp costs
  // nothing worth reclaiming.
  const [renderedThumbs, setRenderedThumbs] = useState<ReadonlySet<number>>(
    () => new Set()
  );
  const thumbObserverRef = useRef<IntersectionObserver | null>(null);
  /** Buttons that have registered but may have done so before the observer
   *  existed. Belt and braces for the effect-ordering below. */
  const thumbNodesRef = useRef<Set<HTMLElement>>(new Set());

  const observeThumb = useCallback((node: HTMLElement) => {
    thumbNodesRef.current.add(node);
    thumbObserverRef.current?.observe(node);
    return () => {
      thumbNodesRef.current.delete(node);
      thumbObserverRef.current?.unobserve(node);
    };
  }, []);

  // A LAYOUT effect, and mount-only.
  //
  // Layout so the observer exists before any thumbnail's own (passive) effect
  // asks to be observed — React runs every layout effect in a commit before
  // any passive one, which is the whole reason registration can be a plain
  // `useEffect` down in `LightboxThumb` and still never miss.
  //
  // The strip is centred on the active thumbnail HERE, instantly, before the
  // observer is created. The `scrollIntoView` effect below does the same thing
  // smoothly and would otherwise be the first thing to move the strip — and a
  // smooth scroll from scrollLeft 0 to the middle of a 6,000px strip drags
  // every thumbnail on the way through the observer's root, one frame at a
  // time, rendering and requesting all of them. Landing the strip on its
  // resting position first means the observer's first delivery describes where
  // the strip actually IS. (The effect below is not made redundant: it still
  // re-centres on every subsequent photo change, and now always over a short
  // distance, so it stays smooth.)
  useLayoutEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;

    strip
      .querySelector<HTMLElement>(`[data-thumb-index="${activeIndexRef.current}"]`)
      ?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });

    const observer = new IntersectionObserver(
      (entries) => {
        const arrived: number[] = [];
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Number((entry.target as HTMLElement).dataset.thumbIndex);
          if (!Number.isInteger(i)) continue;
          arrived.push(i);
          // Rendering is one-way, so there is nothing left to learn about
          // this node. Dropping it keeps the observer's per-frame work
          // proportional to what is still grey rather than to the feed.
          observer.unobserve(entry.target);
        }
        if (arrived.length === 0) return;
        setRenderedThumbs((prev) => {
          const next = new Set(prev);
          for (const i of arrived) next.add(i);
          return next.size === prev.size ? prev : next;
        });
      },
      {
        // The strip, not the viewport: these thumbnails are clipped by its
        // `overflow-x`, so the document viewport cannot tell a visible one
        // from one 5,000px along the row.
        root: strip,
        // Horizontal only. The strip is a single row — vertical margin would
        // just be an invitation for a thumbnail to count as visible while the
        // dialog is scrolled somewhere else.
        rootMargin: `0px ${THUMB_PRELOAD_PX}px`,
        threshold: 0,
      }
    );
    thumbObserverRef.current = observer;
    // Anything that registered before this ran (it should not, given the
    // ordering above, but a future refactor that moves registration into a
    // layout effect would silently lose them).
    thumbNodesRef.current.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      thumbObserverRef.current = null;
    };
  }, []);

  // Latch the seed window as the active photo moves, so a thumbnail never
  // loses its image by the active photo walking away from it. In practice the
  // observer has already claimed these — the active thumbnail is centred in
  // the strip, so its neighbours are visible by construction — but that is
  // only true once the observer has delivered, and this costs one Set union
  // per photo change.
  useEffect(() => {
    setRenderedThumbs((prev) => {
      const next = new Set(prev);
      for (let i = activeIndex - THUMB_RENDER_WINDOW; i <= activeIndex + THUMB_RENDER_WINDOW; i++) {
        if (i >= 0 && i < photos.length) next.add(i);
      }
      return next.size === prev.size ? prev : next;
    });
  }, [activeIndex, photos.length]);

  // Keep the active thumbnail visible in the single-row strip.
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(`[data-thumb-index="${activeIndex}"]`);
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  // --- Open --------------------------------------------------------------
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;
    if (!hero || !backdrop || !dialog) return;

    const openIndex = activeIndexRef.current;
    const chrome = dialog.querySelectorAll<HTMLElement>(CHROME_SELECTOR);

    // Read HERE and not in the rAF below: setting state in a layout effect
    // re-renders before the browser paints, so the hero's very first frame
    // already carries the tile's image. Deferred by one frame it would instead
    // be the first frame of the morph that is empty — the exact hole this
    // stand-in exists to fill.
    if (openedFromClickRef.current) setPreviewSrc(getTileImageSrc(openIndex));

    // Read synchronously, not from `useReducedMotion()`. This effect is
    // mount-only and the hook resolves one commit later, so branching on its
    // seeded `false` here would mean this branch never ran at all.
    if (prefersReducedMotion()) {
      gsap.set([backdrop, hero], { opacity: 1 });
      gsap.set(chrome, { opacity: 1 });
      setTileHidden(openIndex, true);
      return;
    }

    gsap.set(backdrop, { opacity: 0 });
    gsap.set(chrome, { opacity: 0 });
    gsap.set(hero, { opacity: 0 });

    // One frame, so the dialog's flex layout has settled before the hero's
    // destination rect is measured. Measuring in the layout effect itself
    // would read a box that has not been sized yet.
    //
    // One frame is enough, and deliberately still is. The rect `morphOpen`
    // reads here is the only measurement of the destination there will ever
    // be, so it has to be final — but everything that could still move it has
    // already happened by now. The scroll lock is a LAYOUT effect declared
    // below this one, so it has run (and reflowed the document) before this
    // callback; `setPreviewSrc` above re-rendered before paint; and the
    // dialog's height is `h-svh`, which no longer moves when the browser
    // expands its toolbar in response to that lock. Nothing here waits on
    // fonts: a morph only happens on a tile CLICK, by which point the page has
    // been rendered and Switzer has long since swapped in — a deep link, which
    // is the only open that can race font loading, has no tile and fades
    // instead. And nothing re-measures on resize on purpose: a retarget is a
    // moving part that has to be right in every interrupted-morph case, which
    // is a worse trade than the bug it would cover.
    const raf = requestAnimationFrame(() => {
      gsap.to(backdrop, { opacity: 1, duration: BACKDROP_IN_S, ease: GSAP_EASE });
      gsap.to(chrome, {
        opacity: 1,
        duration: CHROME_IN_S,
        delay: CHROME_IN_DELAY_S,
        ease: GSAP_EASE,
      });

      if (openedFromClickRef.current && morphOpen(hero, openIndex)) return;

      // No tile to morph from — deep link, or a photo the grid hasn't
      // rendered. Fade the hero up in place instead.
      setTileHidden(openIndex, true);
      gsap.to(hero, { opacity: 1, duration: HERO_FADE_S, ease: GSAP_EASE });
    });

    return () => cancelAnimationFrame(raf);
    // Mount-only: this IS the open sequence, and nothing may restart it.
  }, []);

  // --- Close ---------------------------------------------------------------
  useEffect(() => {
    if (!wasOpenRef.current || isOpen) {
      wasOpenRef.current = isOpen;
      return;
    }
    wasOpenRef.current = isOpen;
    setIsClosing(true);

    const hero = heroRef.current;
    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;
    // Frozen at the moment of close — NOT `index`, which is already 0.
    const closingIndex = lastOpen.index;

    if (!hero || reducedMotion) {
      revealAllTiles();
      onClosed(session);
      return;
    }

    if (dialog) {
      gsap.to(dialog.querySelectorAll<HTMLElement>(CHROME_SELECTOR), {
        opacity: 0,
        duration: CHROME_OUT_S,
        ease: "power2.in",
        overwrite: true,
      });
    }
    if (backdrop) {
      // The grid is revealed by the backdrop LEAVING, not by tweening tiles
      // back in. Nothing about the grid's own opacity is touched, so there is
      // no half-finished tile restore to get stranded.
      //
      // Delayed by exactly the chrome's own fade so the two never overlap.
      // Run together — as they did — and the grid is already showing through
      // the thinning backdrop while the caption is still half visible, so the
      // photo's description and place read as printed over the page behind
      // them. The text has to be gone before anything appears underneath it.
      //
      // Still lands before the close morph does (CHROME_OUT_S +
      // BACKDROP_OUT_S is under `morphClose`'s own duration), so this delay
      // cannot leave the backdrop mid-fade when the overlay unmounts.
      gsap.to(backdrop, {
        opacity: 0,
        duration: BACKDROP_OUT_S,
        delay: CHROME_OUT_S,
        ease: GSAP_EASE,
        overwrite: true,
      });
    }

    const morph = openedFromClickRef.current ? morphClose(hero, closingIndex) : null;
    if (morph) {
      morph.finished.then(() => onClosed(session));
      return;
    }

    // Same delay as the backdrop, for the same reason: the caption must be
    // gone before the photo starts going too.
    gsap.to(hero, {
      opacity: 0,
      duration: HERO_FADE_S,
      delay: CHROME_OUT_S,
      ease: GSAP_EASE,
      overwrite: true,
      onComplete: () => {
        revealAllTiles();
        onClosed(session);
      },
    });
  }, [isOpen, onClosed, session, reducedMotion, lastOpen.index]);

  // Safety net: however this overlay goes away — a completed close, an
  // interrupted one, a navigation mid-morph — the grid must never be left
  // with an invisible photo in it, and no hero tween may outlive the node.
  useEffect(() => {
    // Captured now, not read in the cleanup: by unmount `heroRef.current` is
    // already null, and the tween we need to kill belongs to the node that
    // existed while this effect was alive. Refs are attached before effects
    // run, so this is the real element.
    const hero = heroRef.current;
    return () => {
      killMorph(hero);
      revealAllTiles();
    };
  }, []);

  // Disarmed the moment closing starts. The provider restores focus to the
  // originating grid tile as soon as the route closes, so from then on
  // `container.contains(activeElement)` is false — and a Tab press during the
  // 440ms close morph would hit the branch below and pull focus back INTO a
  // dialog that is fading out and about to unmount, stranding focus on
  // <body>. Escape and the arrows are pointless during a close for the same
  // reason: the route is already gone.
  useEffect(() => {
    if (isClosing) return;

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
        // The dialog ITSELF is a legitimate resting place for focus — it is
        // where the mount effect below now puts it (see there for why), and it
        // is also where focus sits if a control is clicked and then removed.
        // It needed calling out explicitly because it slips through both of
        // the tests below: `container.contains(container)` is true, so the
        // "focus has escaped" branch never fires, and it is neither `first`
        // nor `last`. Forward that was harmless by accident — a container
        // precedes its own children in tab order, so the browser's native Tab
        // lands on `first` regardless — but BACKWARDS it was the one hole in
        // the trap: Shift+Tab from the container walked out of the dialog
        // entirely, onto whatever grid tile precedes it in the document,
        // behind an opaque backdrop, with no visible focus anywhere.
        const atContainer = active === container;
        if (event.shiftKey) {
          if (atContainer || active === first || !container.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (atContainer || active === last || !container.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isClosing, close, goNext, goPrev]);

  // Initial focus goes to the DIALOG, never to the first focusable inside it.
  //
  // This used to be `(focusable[0] ?? container).focus()`, and `focusable[0]`
  // is the "Kristina Bekher" logotype link in `<SiteHeader chrome hideNav />`
  // — the first `a[href]` in the dialog. globals.css draws a 2px outline on
  // `:focus-visible`, and several engines treat a programmatic `.focus()` on a
  // link or button as focus-visible (the heuristic keys off the element being
  // keyboard-interactive, not off how focus arrived), so EVERY open — mouse,
  // touch, keyboard alike — parked a focus ring around the wordmark at the top
  // of the overlay. It was also the worst possible default target on its
  // merits: the one control in the dialog that navigates away from the page.
  //
  // The container is what a modal should focus anyway. It carries
  // `role="dialog" aria-modal="true"` and an `aria-label`, so assistive tech
  // announces the viewer and its label instead of starting the visitor
  // mid-chrome, and `tabIndex={-1}` + `outline-none` let it hold focus without
  // painting anything. The Tab trap above knows about this resting position
  // explicitly — see `atContainer` there, without which Shift+Tab from here
  // would leave the dialog. Focus is handed back to the originating grid tile
  // on close by `LightboxProvider`, which is unaffected by any of this.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Scroll lock. The width compensation is load-bearing for the morph, not
  // cosmetic: taking the body out of flow can remove the document scrollbar,
  // and the page would then widen underneath us — shifting every grid tile
  // sideways between the rect the open morph measured and the rect the close
  // morph measures.
  //
  // ## Why a LAYOUT effect
  // This was a passive effect, which meant the overlay had already mounted and
  // PAINTED over a still-unlocked body; the lock then landed a frame later and
  // reflowed the whole page underneath a backdrop that was still transparent.
  // That one shifted frame is the blink on open. Worse, passive effects and
  // the open sequence's `requestAnimationFrame` have no guaranteed order
  // between them, so the morph could measure a tile's rect either before or
  // after the reflow — the same open looked different run to run. Locking
  // before the first paint removes both: nothing paints unlocked, and every
  // measurement happens after the document has settled.
  //
  // ## What it still cannot control, and why that no longer matters
  // `position: fixed` on <body> also makes the page unscrollable, and mobile
  // browsers read that as licence to expand the URL bar they had collapsed —
  // asynchronously, animated, landing squarely inside the open morph. Nothing
  // here can prevent that or wait it out. The dialog is therefore sized in
  // `svh` (see the comment above its className) so its layout simply does not
  // depend on where the toolbar is, and the hero's destination rect survives
  // the transition untouched.
  useLayoutEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const dialog = dialogRef.current;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const prevDialogPadding = dialog?.style.paddingRight ?? "";

    const html = document.documentElement;
    const prevHtmlOverflowY = html.style.overflowY;

    const widthBefore = html.clientWidth;

    // Hold the viewport's scrollbar gutter open for the whole lock.
    //
    // `scrollbar-gutter: stable` reserves space only where a classic scrollbar
    // COULD appear — that is, `overflow: auto` or `scroll`. The lock below sets
    // `overflow: hidden` on <body>, and because <html>'s overflow is `visible`
    // that value propagates to the viewport, which stops being a place a
    // scrollbar can appear at all. The gutter is released with it, the page
    // gets a scrollbar's width wider, and everything centred — the whole grid,
    // via PageShell's `mx-auto max-w-[1280px]` — slides right by half of it,
    // then back on close. That is the visible jump.
    //
    // Forcing `overflow-y: scroll` on <html> keeps the viewport a scrollbar-
    // bearing box for the duration, so the gutter is reserved by definition
    // rather than by measurement, and clientWidth cannot change. It also means
    // the scrollbar TRACK stays put instead of vanishing, which is the other
    // half of what the jump looked like. Nothing can actually scroll: <body>
    // is taken out of flow immediately below, so the viewport has no
    // scrollable overflow left.
    //
    // Deliberately not left to the delta measurement further down: browsers
    // update scrollbar state during layout, so reading clientWidth in the same
    // effect that wrote the lock can return the pre-release value and
    // compensate by zero, with the release — and the jump — landing a frame
    // later.
    html.style.overflowY = "scroll";

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    // Compensate for the shift the lock ACTUALLY caused, rather than assuming
    // it equals the scrollbar's width.
    //
    // It usually does not. globals.css sets `scrollbar-gutter: stable` on
    // <html> precisely so the gutter survives the scrollbar going away — so on
    // every browser that honours it the correct compensation here is ZERO, and
    // the old `innerWidth - clientWidth` reading still returned a full
    // scrollbar width (that difference is the reserved gutter, present with or
    // without a scrollbar). Two fixes for one problem, stacking: the page was
    // pushed sideways by a scrollbar's width for as long as the lightbox was
    // open, and back again on close. On macOS's default overlay scrollbars the
    // width is 0 and nothing showed, which is why this only bit sometimes.
    //
    // Reading the delta is correct in both worlds, including browsers with no
    // `scrollbar-gutter` support, where it still yields the scrollbar width.
    //
    // With the `overflow-y: scroll` pin above this should now always be 0; it
    // stays as the safety net for any engine where the pin doesn't hold.
    const shift = html.clientWidth - widthBefore;
    if (shift > 0) {
      body.style.paddingRight = `${shift}px`;
      if (dialog) dialog.style.paddingRight = `${shift}px`;
    }
    return () => {
      html.style.overflowY = prevHtmlOverflowY;
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;
      if (dialog) dialog.style.paddingRight = prevDialogPadding;
      window.scrollTo(0, scrollY);
    };
  }, []);

  if (!current) return null;

  const placeYear = [current.place, current.year].filter(Boolean).join(", ");
  const totalDigits = Math.max(2, String(photos.length).length);
  const counterLabel = `${String(activeIndex + 1).padStart(totalDigits, "0")}/${String(
    photos.length
  ).padStart(totalDigits, "0")}`;

  // The photos worth having in cache before they are asked for: whichever way
  // the visitor goes next. This is what turns an arrow press from "wait for
  // 650KB" into an instant switch — by the time the crossfade above runs, the
  // file it is waiting on has usually been here for a while.
  //
  // Gated on the CURRENT photo having finished, because warming is only worth
  // doing with bandwidth nobody is waiting on, and `fetchPriority="low"` keeps
  // it behind anything that is.
  //
  // `activeIndex` is in the list on purpose even though it is normally the
  // photo on screen: the filter drops it then, but DURING a switch the resting
  // layer is still the outgoing photo, so keeping the incoming one here means
  // its warm `<img>` is not torn out from under a download that is already in
  // flight the moment the arrow is pressed.
  const warmPhotos =
    mayWarm && restingLoaded && !isClosing && photos.length > 1
      ? [activeIndex, activeIndex + 1, activeIndex - 1]
          .map((i) => photos[(i + photos.length) % photos.length])
          .filter(
            (photo, i, list): photo is LightboxPhoto =>
              Boolean(photo) &&
              photo.src !== displayPhoto.src &&
              list.findIndex((other) => other?.src === photo.src) === i
          )
      : [];

  // `h-svh`, and it is the fix for the hero jumping upward on mobile.
  //
  // The hero's destination is a pure function of this element's height: the
  // hero viewport below is `flex-1` in this column, `.lightbox-hero-frame`
  // sizes itself from `100cqh` of that viewport, and the frame is centred in
  // it. `morphOpen` measures that destination rect ONCE, in a rAF right after
  // mount, and then tweens a `position: fixed` clone to it for 520ms. So any
  // change to this height mid-morph means the hero lands on a stale rect and
  // snaps to the real one when `unpin` puts it back in its CSS box.
  //
  // This was `100dvh`, which changes exactly then. The scroll lock below sets
  // `body { position: fixed }`, the page stops being scrollable, and iOS
  // Safari / Chrome Android respond by expanding the URL bar they had
  // collapsed — over a few hundred ms, i.e. inside the morph. `dvh` tracks
  // that, the column loses the toolbar's height, the centred hero's midpoint
  // rises by half of it, and everything below it rises by all of it. On a
  // phone the frame's width is `100cqw`-bound rather than `100cqh`-bound, so
  // the SIZE was right and only the position was wrong — which is precisely
  // the reported "grows big and then jumps up". It only happened "sometimes"
  // because it needs the toolbar to have been collapsed at click time, i.e.
  // the visitor to have scrolled the feed first.
  //
  // `svh` is the small viewport — the toolbar-EXPANDED height, which is the
  // steady state the lock forces us into anyway — and it is defined never to
  // change as browser chrome shows or hides. So the destination rect measured
  // in that first rAF is the rect the hero lands in, whatever the toolbar does
  // during the 520ms. Desktop is unaffected: with no dynamic chrome, `svh`,
  // `dvh` and `vh` are the same number.
  //
  // `pt-[env(safe-area-inset-top,0px)]` stays and does NOT double-count against
  // globals.css's `body { padding-top: env(safe-area-inset-top) }`: this
  // element is `position: fixed`, so it is laid out against the viewport and
  // the body's padding never moves it. It needs its own inset or its header
  // would sit under the notch. (Both are 0 today — there is no
  // `viewport-fit=cover` in the viewport meta — so this is insurance, not
  // current geometry.)
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      tabIndex={-1}
      className={`fixed inset-0 z-50 flex h-svh flex-col overflow-hidden pt-[env(safe-area-inset-top,0px)] outline-none ${
        isClosing ? "pointer-events-none" : ""
      }`}
    >
      {/* The backdrop is its own element rather than a `bg-bg` class on the
          dialog so it can be faded independently of the hero, which has to
          stay fully opaque while it morphs across it.

          `fixed`, not `absolute`, and that is the other half of the `h-svh`
          change above. While the toolbar is still collapsed — the first few
          hundred ms of an open — the visible viewport is TALLER than `svh`, so
          a backdrop bounded by the dialog would leave a strip of the live page
          showing along the bottom until the toolbar finished expanding. A
          fixed box resolves against the viewport instead of against the
          dialog, so it covers regardless of what the chrome is doing.

          It is not clipped by the dialog's `overflow-hidden`: overflow clips
          descendants whose containing block is inside the clipper, and a fixed
          element's containing block is the viewport (nothing here sets a
          transform/filter/will-change that would change that). Nothing else
          moves either — it is still a plain positioned element with `z-index:
          auto` inside the dialog's `z-50` stacking context, so the morphing
          hero's `HERO_Z = 60` still paints over it, and the close tween on
          `backdropRef` only ever touched opacity. */}
      <div ref={backdropRef} aria-hidden="true" className="fixed inset-0 bg-bg" />

      <div className="relative mx-auto flex h-full w-full max-w-[1280px] flex-col items-center px-[40px]">
        <SiteHeader chrome className="shrink-0" hideNav />

        <div className="flex min-h-0 w-full flex-1 flex-col items-center">
          <div
            data-lb-chrome
            className="grid w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center pt-[26px]"
          >
            <div aria-hidden="true" />
            <div className="flex flex-wrap justify-center gap-2 text-center">
              <span>{current.description ? <p>&ldquo;{current.description}&rdquo; </p> : null}</span>
              <span>{placeYear ? <p>{placeYear}</p> : null}</span>
            </div>
            <div className="hidden justify-end lg:flex">
              <PillButton as="button" onClick={close}>
                Close
              </PillButton>
            </div>
          </div>

          <div
            ref={viewportRef}
            /* `pan-y pinch-zoom` hands the browser everything except the
               horizontal axis, which the swipe handler claims. Left at `auto`
               the browser may start its own scroll or back-navigation gesture
               before `preventDefault` lands. */
            style={{ touchAction: "pan-y pinch-zoom" }}
            className="lightbox-hero-viewport relative mt-[26px] flex min-h-0 w-full flex-1 items-center justify-center">
            <button
              data-lb-chrome
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className={`${ARROW_BTN_CLASS} left-0 -ml-2`}
            >
              <ArrowIcon direction="left" />
            </button>

            {/* Resting layer — the photo actually on screen, and the element
                the open/close morph flies. Its box is sized to ITS OWN photo,
                never to the incoming one. */}
            <div
              ref={heroRef}
              style={{ ...heroFrameStyle(displayPhoto), ...previewStyle(previewSrc) }}
              className={frameClass(displayPhoto, !restingLoaded && !previewSrc)}
            >
              <Image
                key={displayPhoto.src}
                loader={imageLoader}
                src={`/${displayPhoto.src}`}
                alt={buildAlt(displayPhoto)}
                fill
                /* `priority` is deprecated in Next 16 and would also inject a
                   `<link rel=preload>` into the head for an overlay that only
                   ever mounts client-side — these two are the half of it that
                   actually does anything here. */
                loading="eager"
                fetchPriority="high"
                quality={90}
                sizes={heroSizesFor(displayPhoto)}
                className="object-cover"
                draggable={false}
                onLoad={(event) => markLoaded(displayPhoto.src, event.currentTarget)}
              />
            </div>

            {/* Incoming layer while switching — shown immediately over the
                tile's cached stand-in (or a shimmer if there is none); the
                full-size image fades in on top once it has loaded AND decoded.
                The stand-in stays put underneath for the whole crossfade,
                which is what closes the gap the old code left between the
                placeholder going and the photo painting. */}
            {incomingPhoto ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div
                  ref={incomingRef}
                  style={{
                    ...heroFrameStyle(incomingPhoto),
                    ...previewStyle(incomingPreviewSrc),
                  }}
                  className={frameClass(
                    incomingPhoto,
                    !incomingLoaded && !incomingPreviewSrc
                  )}
                >
                  <Image
                    key={incomingPhoto.src}
                    loader={imageLoader}
                    src={`/${incomingPhoto.src}`}
                    alt=""
                    fill
                    loading="eager"
                    fetchPriority="high"
                    quality={90}
                    sizes={heroSizesFor(incomingPhoto)}
                    className="object-cover opacity-0"
                    draggable={false}
                    onLoad={(event) => markLoaded(incomingPhoto.src, event.currentTarget)}
                    onError={() => setIncomingTimedOut(true)}
                  />
                </div>
              </div>
            ) : null}

            {/* Neighbour warming. Off-screen but not `display: none` — a
                hidden image still downloads, a non-rendered one does not — and
                deliberately the same loader/quality/`sizes` as the hero, so
                the browser picks the identical srcset candidate and the arrow
                press that follows is a cache hit rather than a near miss. */}
            {warmPhotos.length > 0 ? (
              <div
                aria-hidden="true"
                className="pointer-events-none invisible absolute h-px w-px overflow-hidden"
              >
                {warmPhotos.map((photo) => (
                  <Image
                    key={photo.src}
                    loader={imageLoader}
                    src={`/${photo.src}`}
                    alt=""
                    fill
                    loading="eager"
                    fetchPriority="low"
                    quality={90}
                    sizes={heroSizesFor(photo)}
                    draggable={false}
                    onLoad={(event) => markLoaded(photo.src, event.currentTarget)}
                  />
                ))}
              </div>
            ) : null}

            <button
              data-lb-chrome
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className={`${ARROW_BTN_CLASS} right-0 -mr-2`}
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

          <p
            data-lb-chrome
            className="mt-8 shrink-0 text-center tabular-nums"
            aria-label={`Photo ${activeIndex + 1} of ${photos.length}`}
          >
            {counterLabel}
          </p>

          <div
            data-lb-chrome
            ref={thumbStripRef}
            role="group"
            aria-label="Photo thumbnails"
            /* Click only. Hover-to-switch had a feedback loop built into it:
               changing photo scrolls the strip to re-centre the new active
               thumbnail, which slides a DIFFERENT thumbnail under a stationary
               cursor, which fires `mouseenter` and changes the photo again.
               Debouncing only set the rate of the runaway, it didn't stop it.
               Selecting by focus is gone for the same class of reason — it
               changed the photo on every Tab stop. */
            className="mt-[20px] w-full shrink-0 overflow-x-auto overflow-y-hidden pb-6 [scrollbar-width:thin]"
          >
            <div className="mx-auto flex w-max flex-nowrap items-center justify-center gap-8 px-2">
              {photos.map((photo, i) => (
                // The button, its box and its label always render, at every
                // index — only the image is conditional. `render` is the
                // observer's answer, OR the seed window for the frames before
                // the observer has one (see THUMB_RENDER_WINDOW).
                <LightboxThumb
                  key={`${photo.src}-${i}`}
                  photo={photo}
                  index={i}
                  active={i === activeIndex}
                  render={
                    renderedThumbs.has(i) || Math.abs(i - activeIndex) <= THUMB_RENDER_WINDOW
                  }
                  onSelect={goThumb}
                  observe={observeThumb}
                />
              ))}
            </div>
          </div>

          <div
            data-lb-chrome
            className="mt-4 mb-3 flex shrink-0 justify-center pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
          >
            <PillButton as="button" onClick={close}>
              Close
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
