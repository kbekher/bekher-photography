"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import PillButton from "@/components/ui/PillButton";
import Logotype from "@/components/ui/Logotype";
import NavBar from "@/components/ui/NavBar";
import imageLoader from "@/utils/image-loader";
import { prefersReducedMotion, useReducedMotion } from "@/utils/useReducedMotion";
import { GSAP_EASE } from "@/components/intro/introTimings";
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

const BACKDROP_IN_S = 0.32;
const BACKDROP_OUT_S = 0.3;
const CHROME_IN_S = 0.26;
const CHROME_IN_DELAY_S = 0.14;
const CHROME_OUT_S = 0.16;
/** Fallback when there is no tile to morph from/to (deep link, or a photo
 *  past the end of the home feed's rendered page). */
const HERO_FADE_S = 0.3;
/** Crossfade when switching photos with the arrows or the thumb strip. */
const SWITCH_S = 0.3;
/** How long the crossfade will wait for the incoming photo to load before
 *  giving up and switching anyway. See the timeout effect for why. */
const SWITCH_LOAD_TIMEOUT_MS = 1200;

/**
 * The hero's box, sized to ONE photo's aspect. Both crossfade layers call
 * this with their own photo, which is what stops a frame from changing shape
 * before the photo inside it does. See `.lightbox-hero-frame` in globals.css
 * for how `--rw`/`--rh` turn into an actual on-ratio size.
 */
const HERO_BOX_CLASS = "lightbox-hero-frame relative shrink-0 overflow-hidden";

function heroFrameStyle(photo: LightboxPhoto): CSSProperties {
  const [rw, rh] = photo.aspectRatio === horizontal ? [580, 388] : [374, 540];
  return { "--rw": rw, "--rh": rh } as CSSProperties;
}

function heroSizesFor(photo: LightboxPhoto): string {
  return photo.aspectRatio === horizontal
    ? "(max-width: 1023px) 92vw, 580px"
    : "(max-width: 1023px) 92vw, 374px";
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
  // `displayIndex` lags `activeIndex` for the length of one crossfade, so the
  // outgoing and incoming photos are on screen together. Each gets its OWN
  // box, sized to its OWN aspect ratio (see `heroBoxClass`), which is the
  // whole reason this can't be a single element whose `src` swaps:
  //
  //  - the frame must not change before the photo in it does. Sizing one
  //    shared box from the incoming photo while it still contains the
  //    outgoing one is what produced a horizontal photo `object-cover`-
  //    cropped inside a vertical frame.
  //  - and the incoming photo must not appear before it can be drawn. The
  //    crossfade therefore does not start on the index change at all — it
  //    waits for the incoming `<img>` to report `load`, so the new frame and
  //    the new pixels arrive on the same frame.
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [incomingReady, setIncomingReady] = useState(false);
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

  // A new target resets the readiness latch; the incoming `<Image>`'s `onLoad`
  // sets it. Cached photos fire that synchronously on mount, so an
  // already-seen photo still switches immediately.
  useEffect(() => {
    setIncomingReady(false);
  }, [switchingTo]);

  // Belt and braces: a photo that never fires `load` or `error` (an aborted
  // request, an offline tab resuming) must not freeze the viewer on the
  // previous photo forever. After this the switch proceeds regardless — worst
  // case the incoming frame is briefly empty, which is still better than the
  // arrows appearing to be broken.
  useEffect(() => {
    if (switchingTo === null || incomingReady) return;
    const t = window.setTimeout(() => setIncomingReady(true), SWITCH_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [switchingTo, incomingReady]);

  useLayoutEffect(() => {
    if (switchingTo === null || !incomingReady) return;
    const outgoing = heroRef.current;
    const incoming = incomingRef.current;
    const land = () => {
      switchLandedRef.current = true;
      setDisplayIndex(switchingTo);
    };
    if (!incoming || reducedMotion) {
      land();
      return;
    }
    // Both layers animate, unlike the open/close morph: their boxes are
    // different shapes, so the incoming one cannot be relied on to cover the
    // outgoing one.
    const tl = gsap.timeline({ onComplete: land });
    tl.fromTo(incoming, { opacity: 0 }, { opacity: 1, duration: SWITCH_S, ease: GSAP_EASE }, 0);
    if (outgoing) {
      tl.to(outgoing, { opacity: 0, duration: SWITCH_S, ease: GSAP_EASE }, 0);
    }
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

  // Keep the active thumbnail visible in the single-row strip.
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(`[data-thumb-index="${activeIndex}"]`);
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  // --- Open --------------------------------------------------------------
  // The tile's own rendered image url, captured at open so it can be painted
  // under the hero while the full-size rendition loads. State rather than a
  // style computed inline, because it can only be read off the live DOM.
  const [morphBackdropSrc, setMorphBackdropSrc] = useState<string | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;
    if (!hero || !backdrop || !dialog) return;

    const openIndex = activeIndexRef.current;
    const chrome = dialog.querySelectorAll<HTMLElement>(CHROME_SELECTOR);

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
    const raf = requestAnimationFrame(() => {
      gsap.to(backdrop, { opacity: 1, duration: BACKDROP_IN_S, ease: GSAP_EASE });
      gsap.to(chrome, {
        opacity: 1,
        duration: CHROME_IN_S,
        delay: CHROME_IN_DELAY_S,
        ease: GSAP_EASE,
      });

      if (openedFromClickRef.current) {
        setMorphBackdropSrc(getTileImageSrc(openIndex));
        if (morphOpen(hero, openIndex)) return;
      }

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
      gsap.to(backdrop, {
        opacity: 0,
        duration: BACKDROP_OUT_S,
        ease: GSAP_EASE,
        overwrite: true,
      });
    }

    const morph = openedFromClickRef.current ? morphClose(hero, closingIndex) : null;
    if (morph) {
      morph.finished.then(() => onClosed(session));
      return;
    }

    gsap.to(hero, {
      opacity: 0,
      duration: HERO_FADE_S,
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
  }, [isClosing, close, goNext, goPrev]);

  useEffect(() => {
    const container = dialogRef.current;
    if (!container) return;
    const focusable = getFocusable(container);
    (focusable[0] ?? container).focus();
  }, []);

  // Scroll lock. The width compensation is load-bearing for the morph, not
  // cosmetic: taking the body out of flow removes the document scrollbar, and
  // on any platform with classic (space-occupying) scrollbars the page would
  // widen by ~15px underneath us — shifting every grid tile sideways between
  // the rect the open morph measured and the rect the close morph measures.
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, []);

  if (!current) return null;

  const placeYear = [current.place, current.year].filter(Boolean).join(", ");
  const totalDigits = Math.max(2, String(photos.length).length);
  const counterLabel = `${String(activeIndex + 1).padStart(totalDigits, "0")}/${String(
    photos.length
  ).padStart(totalDigits, "0")}`;

  // Dropped the instant the full-size rendition paints — see
  // `getTileImageSrc`. Keeping it after that would only matter during a
  // photo switch, where it would show the WRONG photo's thumbnail through the
  // crossfade.
  const morphBackdrop: CSSProperties | undefined =
    !heroLoaded && morphBackdropSrc
      ? {
          backgroundImage: `url("${morphBackdropSrc}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : undefined;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      tabIndex={-1}
      className={`fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden outline-none ${
        isClosing ? "pointer-events-none" : ""
      }`}
    >
      {/* The backdrop is its own element rather than a `bg-bg` class on the
          dialog so it can be faded independently of the hero, which has to
          stay fully opaque while it morphs across it. */}
      <div ref={backdropRef} aria-hidden="true" className="absolute inset-0 bg-bg" />

      <div className="relative mx-auto flex h-full w-full max-w-[1280px] flex-col px-[40px]">
        <header data-lb-chrome className="flex w-full shrink-0 flex-col items-center pt-24">
          <Logotype />
          <div className="mt-24 w-full">
            <NavBar
              trailing={
                <PillButton as="button" onClick={close}>
                  Close
                </PillButton>
              }
            />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col items-center">
          <div
            data-lb-chrome
            className="flex gap-2 flex-wrap w-full shrink-0 justify-center pt-[26px] text-center"
          >
            <span>{current.description ? <p>&ldquo;{current.description}&rdquo; </p> : null}</span>
            <span>{placeYear ? <p>{placeYear}</p> : null}</span>
          </div>

          <div className="lightbox-hero-viewport relative mt-[26px] flex min-h-0 w-full flex-1 items-center justify-center">
            <button
              data-lb-chrome
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-0 top-1/2 z-10 -m-[10px] -translate-y-1/2 p-[10px] text-fg"
            >
              <ArrowIcon direction="left" />
            </button>

            {/* Resting layer — the photo actually on screen, and the element
                the open/close morph flies. Its box is sized to ITS OWN photo,
                never to the incoming one. */}
            <div
              ref={heroRef}
              style={{ ...heroFrameStyle(displayPhoto), ...morphBackdrop }}
              className={HERO_BOX_CLASS}
            >
              <Image
                key={displayPhoto.src}
                loader={imageLoader}
                src={`/${displayPhoto.src}`}
                alt={buildAlt(displayPhoto)}
                fill
                priority
                quality={90}
                sizes={heroSizesFor(displayPhoto)}
                className="object-cover"
                draggable={false}
                onLoad={() => setHeroLoaded(true)}
              />
            </div>

            {/* Incoming layer, only while switching. A sibling of the hero
                rather than a child of it, so it can carry its own aspect box:
                a vertical photo arriving over a horizontal one gets a vertical
                frame from the first frame it is visible, instead of being
                cover-cropped into the outgoing photo's shape.

                Rendered (invisible) as soon as the target changes so the
                browser starts fetching it — `onLoad` is what releases the
                crossfade, so this element existing early is the preload. */}
            {incomingPhoto ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div
                  ref={incomingRef}
                  style={{ ...heroFrameStyle(incomingPhoto), opacity: 0 }}
                  className={HERO_BOX_CLASS}
                >
                  <Image
                    key={incomingPhoto.src}
                    loader={imageLoader}
                    src={`/${incomingPhoto.src}`}
                    alt=""
                    fill
                    priority
                    quality={90}
                    sizes={heroSizesFor(incomingPhoto)}
                    className="object-cover"
                    draggable={false}
                    onLoad={() => setIncomingReady(true)}
                    onError={() => setIncomingReady(true)}
                  />
                </div>
              </div>
            ) : null}

            <button
              data-lb-chrome
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-0 top-1/2 z-10 -m-[10px] -translate-y-1/2 p-[10px] text-fg"
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
              {photos.map((photo, i) => {
                const active = i === activeIndex;
                const thumbHorizontal = photo.aspectRatio === horizontal;
                return (
                  <button
                    key={`${photo.src}-${i}`}
                    type="button"
                    data-thumb-index={i}
                    aria-current={active || undefined}
                    aria-label={active ? `${buildAlt(photo)} (current photo)` : buildAlt(photo)}
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
          </div>
        </div>
      </div>
    </div>
  );
}
