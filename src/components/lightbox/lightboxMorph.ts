import gsap from "gsap";
import { GSAP_EASE } from "@/components/intro/introTimings";

/**
 * The GSAP FLIP morph between a grid tile and the lightbox hero, plus the
 * handful of DOM helpers that go with it. Kept out of `Lightbox.tsx` so the
 * measurement/tween logic can be reasoned about on its own — it is the part
 * that has to be exactly right, and it has no React in it at all.
 *
 * ## Why width/height and not transform: scale
 * Both the tile and the hero render the photo with `object-fit: cover`, and
 * they have DIFFERENT aspect ratios (a 166x240 tile vs a 374x540 hero). A
 * transform-scale FLIP would stretch the pixels to get from one to the other.
 * Animating the BOX instead — top/left/width/height on a `position: fixed`
 * element — lets `object-fit` re-crop on every frame, so the photo appears to
 * open up rather than distort. It costs a layout per frame, but on exactly one
 * fixed-position element with no in-flow siblings that is not a real cost.
 *
 * ## Why only ONE tile is ever hidden
 * An earlier version faded every tile in the grid out on open and back in on
 * close. That was both redundant — the lightbox's own opaque backdrop already
 * covers the grid — and fragile, because "restore N tiles" is a cleanup that
 * can be interrupted, and an interrupted one leaves the page with invisible
 * photos. The only tile that genuinely must be hidden is the one currently
 * masquerading as the hero. `revealAllTiles()` below is the safety net for
 * even that.
 */

/**
 * The one pair of durations in the app deliberately NOT taken from
 * `introTimings.ts`'s shared scale, and the reason is the input, not the
 * pixels.
 *
 * Every beat on that scale describes motion the visitor watches: an intro
 * playing itself, a page introducing itself. This morph is motion the visitor
 * CAUSED — they clicked a photo and are waiting for it. Direct manipulation
 * has to answer faster than choreography does, or the click reads as lag, and
 * a lightbox that opens on a cinematic tempo feels broken in a way the same
 * duration on a page-enter never would.
 *
 * They land close to the scale anyway (OPEN_S is TRAVEL_MS + 20ms, CLOSE_S is
 * exactly HOLD_MS) because it is all one tempo — but they are their own
 * constants on purpose. Retune them against how the lightbox feels to click,
 * not against what the deal-out is doing.
 */
const OPEN_S = 0.52;
const CLOSE_S = 0.44;

/** z-index of the morphing hero: above the lightbox backdrop (z-50) so it is
 *  never covered mid-flight, and above the grid it is flying to/from. */
const HERO_Z = 60;

export function getTile(index: number): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[data-photo-grid] [data-index="${index}"]`
  );
}

/**
 * The exact image URL the grid tile is ALREADY showing — read off the live
 * `<img>`'s `currentSrc`, which is whatever the browser actually picked out
 * of the responsive `srcset` for this viewport and pixel ratio.
 *
 * Reading it rather than reconstructing it is the whole point: the lightbox
 * requests a much larger rendition than the grid does (see PhotoTile's
 * `sizes` and next.config's `imageSizes`), so at the instant the open morph
 * starts, the hero's own image is usually still in flight and the growing box
 * would be empty. Painting THIS url as the hero's background fills it with a
 * guaranteed-decoded, guaranteed-cached copy of the same photo — no network,
 * no flash — and the full-size image simply resolves on top of it.
 * Reconstructing the url by hand would defeat that: guess one srcset
 * candidate wrong and it's a cache miss, i.e. exactly the blank box again.
 */
export function getTileImageSrc(index: number): string | null {
  const img = getTile(index)?.querySelector("img");
  return img?.currentSrc || img?.src || null;
}

/**
 * Hide (or restore) the single grid tile the hero is standing in for.
 * Instant, never tweened: it is masked by the hero sitting exactly on top of
 * it, so any duration here would only create a window where the photo is
 * visible twice.
 */
export function setTileHidden(index: number, hidden: boolean): void {
  const tile = getTile(index);
  if (!tile) return;
  gsap.killTweensOf(tile);
  if (hidden) {
    gsap.set(tile, { opacity: 0 });
  } else {
    gsap.set(tile, { clearProps: "opacity" });
  }
}

/**
 * Unconditionally restore every tile in the grid. The safety net: whatever
 * happened — an interrupted close, an unmount mid-morph, a navigation — the
 * page must never be left with an invisible photo in it. Cheap enough to call
 * on every unmount without thinking about whether it's needed.
 */
export function revealAllTiles(): void {
  const tiles = Array.from(
    document.querySelectorAll<HTMLElement>("[data-photo-grid] [data-index]")
  );
  if (tiles.length === 0) return;
  gsap.killTweensOf(tiles);
  tiles.forEach((el) => gsap.set(el, { clearProps: "opacity" }));
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function rectOf(el: HTMLElement): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

/** Pin the hero to an absolute viewport rect, out of the document flow. */
function pin(hero: HTMLElement, rect: Rect): void {
  gsap.set(hero, {
    position: "fixed",
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    margin: 0,
    maxWidth: "none",
    maxHeight: "none",
    zIndex: HERO_Z,
    willChange: "top,left,width,height",
  });
}

/** Return the hero to its CSS-defined box. Every property `pin` wrote must be
 *  listed here — a leftover `maxWidth: none` is invisible until the next
 *  resize, which is the worst kind of bug to find. */
function unpin(hero: HTMLElement): void {
  gsap.set(hero, {
    clearProps: "position,top,left,width,height,margin,maxWidth,maxHeight,zIndex,willChange",
  });
}

export interface MorphResult {
  /** Resolves when the morph has landed and the hero is back in normal flow. */
  finished: Promise<void>;
}

/**
 * Grow the hero from `index`'s grid tile into the hero's own layout box.
 * Returns `null` when there is nothing to morph FROM — an off-screen or
 * not-yet-rendered tile (the home feed paginates, so a `?photo=40` can
 * legitimately have no tile) — so the caller can fall back to a plain fade
 * instead of animating from a garbage rect.
 */
export function morphOpen(hero: HTMLElement, index: number): MorphResult | null {
  const source = getTile(index);
  if (!source) return null;

  const from = rectOf(source);
  // Measured BEFORE `pin` — once the hero is `position: fixed` its layout box
  // is gone and this rect is no longer recoverable.
  const to = rectOf(hero);
  if (to.width === 0 || to.height === 0) return null;

  setTileHidden(index, true);
  gsap.killTweensOf(hero);
  gsap.set(hero, { opacity: 1 });
  pin(hero, from);

  const finished = new Promise<void>((resolve) => {
    gsap.to(hero, {
      ...to,
      duration: OPEN_S,
      ease: GSAP_EASE,
      overwrite: true,
      onComplete: () => {
        unpin(hero);
        resolve();
      },
    });
  });

  return { finished };
}

/**
 * Shrink the hero back into `index`'s grid tile, then reveal that tile again
 * on the same frame the hero lands. Returns `null` on a missing target tile,
 * same contract as `morphOpen`.
 *
 * The reveal is deliberately the LAST thing that happens. Restoring the grid
 * up front (which an earlier version did, to make sure tiles were never left
 * hidden) meant the destination photo sat there fully visible while a second
 * copy of it shrank down on top — the morph read as a duplicate rather than a
 * return.
 *
 * ## Why this one does NOT unpin
 * `morphOpen` has to unpin: its hero goes on living, and it must be back in
 * normal flow to respond to layout. This hero is about to unmount, and
 * unpinning it first is actively harmful — it snaps the element out of the
 * tile-sized rect it just landed in and back to its full-size, centred CSS
 * box, which paints for the frame or two before React commits the unmount.
 * That is a full-screen flash of the photo AFTER it has visibly returned to
 * the grid. So instead it is hidden and left exactly where it landed; the
 * unmount cleans it up, and `killMorph` unpins if anything ever needs it.
 */
export function morphClose(hero: HTMLElement, index: number): MorphResult | null {
  const target = getTile(index);
  if (!target) return null;

  const from = rectOf(hero);
  const to = rectOf(target);
  if (to.width === 0 || to.height === 0) return null;

  gsap.killTweensOf(hero);
  pin(hero, from);

  const finished = new Promise<void>((resolve) => {
    gsap.to(hero, {
      ...to,
      duration: CLOSE_S,
      ease: GSAP_EASE,
      overwrite: true,
      onComplete: () => {
        // Same frame: the tile comes back and the hero goes away. Doing these
        // in two separate commits shows either a gap (neither visible) or a
        // doubled photo (both visible).
        setTileHidden(index, false);
        gsap.set(hero, { opacity: 0 });
        resolve();
      },
    });
  });

  return { finished };
}

/** Kill any in-flight hero tween and return it to its CSS box. Used when a
 *  morph is abandoned (unmount mid-flight) rather than completed. */
export function killMorph(hero: HTMLElement | null): void {
  if (!hero) return;
  gsap.killTweensOf(hero);
  unpin(hero);
}
