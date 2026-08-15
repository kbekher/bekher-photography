"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import gsap from "gsap";
import { useIntroPhase } from "./IntroContext";
import {
  ANCHOR_EASE,
  ANCHOR_MOVE_MS,
  CONTAINER_FADE_MS,
  DEAL_BUDGET_MS,
  DEAL_EASE,
  DEAL_LANDING_MS,
  DEAL_STAGGER_MS,
  GSAP_EASE,
  MAX_STAGGER_MS,
  SETTLE_TRANSFORM_MS,
  TRAVEL_MS,
} from "./introTimings";

export { DEAL_BUDGET_MS, DEAL_LANDING_MS };

const ANCHOR_SCALE = 1;
const MAX_DEAL_TILES = 24;
/** Must sit above every stacked layer so the cover card never gets buried. */
const ANCHOR_Z_INDEX = 1000;

/**
 * Deal delays, in reverse feed order: the LAST tile leaves the deck first and
 * the cover card (index 0) leaves last, DEAL_STAGGER_MS apart. Because the
 * grid is row-major, that single rule produces the reference's whole visible
 * order for free — bottom row first, right to left inside each row, working
 * up to the top-left slot. Deriving it from the index rather than from
 * (row, col) also means it cannot desync from the layout: no column count to
 * measure, nothing to get wrong at a breakpoint.
 *
 * Scales the whole ramp down if the dealt-tile count would otherwise exceed
 * MAX_STAGGER_MS — order is preserved, only tempo compresses.
 */
function computeDealDelays(
  tiles: HTMLElement[],
  anchor: HTMLElement | null
): Map<HTMLElement, number> {
  const others = tiles.filter((el) => el !== anchor);
  const delays = new Map<HTMLElement, number>();
  if (others.length === 0) return delays;

  const maxIndex = Math.max(...others.map((el) => Number(el.dataset.index ?? 0)));

  let maxRaw = 0;
  const raw: Array<{ el: HTMLElement; delay: number }> = [];

  for (const el of others) {
    const index = Number(el.dataset.index ?? 0);
    const delay = (maxIndex - index) * DEAL_STAGGER_MS;
    raw.push({ el, delay });
    maxRaw = Math.max(maxRaw, delay);
  }

  const scale = maxRaw > MAX_STAGGER_MS ? MAX_STAGGER_MS / maxRaw : 1;
  for (const { el, delay } of raw) {
    delays.set(el, delay * scale);
  }
  return delays;
}

function maxDealDelay(delays: Map<HTMLElement, number>): number {
  if (delays.size === 0) return 0;
  return Math.max(...delays.values());
}

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type DealOutStep = "idle" | "gather" | "deal" | "done";

export interface DealOutSequenceOptions {
  /** Fade the container in after `gather` (group opacity, not per-tile). */
  fadeContainer?: boolean;
  /** Ms after `gather` before the container fade starts (home syncs with nav). */
  fadeContainerDelay?: number;
}

/**
 * Imperative "deal out from centre" sequence — the ONE implementation, shared
 * verbatim by the home page's intro (`useDealOut` below) and by collection
 * pages (`useCollectionDealOut`). The two differ only in what triggers each
 * step: the home page is driven by IntroContext's phase machine, a collection
 * page by its own mount timers. The choreography, the stagger and every
 * duration come from `introTimings.ts` and are therefore identical on both.
 *
 * Uses GSAP rather than React state + CSS transitions because this is
 * per-element transform choreography over up to 24 nodes, measured off live
 * rects: timing stays precise without a re-render per tile, and teardown is
 * one `clearProps` pass instead of unwinding state.
 *
 * ## The shape
 *  - `gather` snaps every visible tile to the anchor's centre as a flush,
 *    fully opaque deck — cover card on top, the rest stacked under it in feed
 *    order. Nothing animates; this is a hard set, hidden either behind
 *    IntroOverlay's opaque sheet (home) or behind a CSS opacity gate
 *    (collection).
 *  - `deal` releases the stack in reverse feed order, DEAL_STAGGER_MS apart;
 *    each card slides out from UNDER the deck to its slot. The cover card
 *    starts on the same beat as the last stacked tile and lands last thanks
 *    to a longer, softer-eased flight.
 *  - `done` clears every inline style GSAP wrote, returning the grid to plain
 *    CSS-laid-out DOM.
 */
export function useDealOutSequence(
  containerRef: RefObject<HTMLElement | null>,
  step: DealOutStep,
  { fadeContainer = false, fadeContainerDelay = 0 }: DealOutSequenceOptions = {}
) {
  const enteredRef = useRef(false);
  const dealtRef = useRef<HTMLElement[]>([]);
  const fadeTimerRef = useRef<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (step === "gather") {
      enteredRef.current = true;

      const tiles = Array.from(container.querySelectorAll<HTMLElement>("[data-index]"));
      const anchor = tiles.find((el) => el.dataset.index === "0");
      if (!anchor) return;

      gsap.killTweensOf([...tiles, container]);

      tiles.forEach((el) => {
        gsap.set(el, { clearProps: "all" });
      });
      if (fadeContainer) {
        // Hide the wrapper in the SAME layout effect that poses the deck, so
        // the two land in one commit and the gather can never be painted.
        // `transition: none` matters because this element may still be
        // carrying a transition from a previous run.
        gsap.set(container, { clearProps: "opacity,transition" });
        container.style.transition = "none";
        container.style.opacity = "0";
      }
      void container.offsetHeight;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetX = vw / 2;
      const targetY = vh / 2;

      const visible = tiles.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < vh;
      });
      const dealt = visible.slice(0, MAX_DEAL_TILES);
      if (!dealt.includes(anchor)) dealt.push(anchor);
      dealtRef.current = dealt;
      const dealtSet = new Set(dealt);

      const anchorRect = anchor.getBoundingClientRect();
      const anchorCx = anchorRect.left + anchorRect.width / 2;
      const anchorCy = anchorRect.top + anchorRect.height / 2;
      const poseW = anchorRect.width * ANCHOR_SCALE;
      const poseH = anchorRect.height * ANCHOR_SCALE;

      dealt.forEach((el) => {
        el.style.willChange = "transform";
        el.style.position = "relative";
        el.style.pointerEvents = el === anchor ? "" : "none";

        if (el === anchor) {
          el.style.zIndex = String(ANCHOR_Z_INDEX);
          gsap.set(el, {
            x: targetX - anchorCx,
            y: targetY - anchorCy,
            scale: ANCHOR_SCALE,
            opacity: 1,
            zIndex: ANCHOR_Z_INDEX,
            transformOrigin: "50% 50%",
          });
          return;
        }

        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        /**
         * Capped at 1: the deck is flush in the reference — every card sits
         * at its natural size, and the pile reads as ONE card until it starts
         * to empty. `fitToAnchor` is therefore not a stylistic shrink, it is
         * only the clamp that keeps a wider tile (a 215px horizontal against
         * a 166px vertical cover) from sticking out of the pile. Same-shaped
         * tiles get exactly 1 and never scale at all.
         */
        const fitToAnchor =
          r.width > 0 && r.height > 0
            ? Math.min(1, poseW / r.width, poseH / r.height)
            : 1;
        // Straight feed order, so the deck is layered the way a real one is:
        // index 0 on top, each later tile one layer further down. It is also
        // exactly the reverse of the deal order, which is what makes each
        // card slide out from UNDER the pile instead of over it, and what
        // keeps an in-flight card above the cards that already landed.
        const index = Number(el.dataset.index ?? 0);
        const stackZ = Math.max(1, ANCHOR_Z_INDEX - index);
        el.style.zIndex = String(stackZ);
        gsap.set(el, {
          x: targetX - cx,
          y: targetY - cy,
          scale: fitToAnchor,
          // Opaque from the first frame — nothing fades in. A stacked card is
          // hidden because it is behind the cover and no larger than it, so
          // the deck depleting is the only thing that reveals anything.
          opacity: 1,
          zIndex: stackZ,
          transformOrigin: "50% 50%",
        });
      });

      tiles.forEach((el) => {
        if (!dealtSet.has(el)) {
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
        }
      });

      if (fadeContainer) {
        if (fadeTimerRef.current !== null) {
          window.clearTimeout(fadeTimerRef.current);
        }
        fadeTimerRef.current = window.setTimeout(() => {
          fadeTimerRef.current = null;
          gsap.to(container, {
            opacity: 1,
            duration: CONTAINER_FADE_MS / 1000,
            ease: GSAP_EASE,
            overwrite: true,
          });
        }, fadeContainerDelay);
      }

      return () => {
        if (fadeTimerRef.current !== null) {
          window.clearTimeout(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }
      };
    }

    if (step === "deal") {
      const dealt = dealtRef.current;
      const anchor = dealt.find((el) => el.dataset.index === "0") ?? null;
      const others = dealt.filter((el) => el !== anchor);
      const delays = computeDealDelays(dealt, anchor);

      others.forEach((el) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 1,
          duration: SETTLE_TRANSFORM_MS / 1000,
          delay: (delays.get(el) ?? 0) / 1000,
          ease: DEAL_EASE,
          overwrite: true,
          onComplete: () => {
            el.style.pointerEvents = "";
            el.style.zIndex = "";
          },
        });
      });

      if (anchor) {
        // Same start beat as the last stacked tile — not frame zero, not after
        // the deck has cleared — so the cover peels with the final card.
        const lastStartMs = maxDealDelay(delays);
        gsap.set(anchor, { zIndex: ANCHOR_Z_INDEX, opacity: 1 });
        anchor.style.zIndex = String(ANCHOR_Z_INDEX);
        gsap.to(anchor, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: ANCHOR_MOVE_MS / 1000,
          delay: lastStartMs / 1000,
          ease: ANCHOR_EASE,
          overwrite: true,
          onComplete: () => {
            anchor.style.zIndex = "";
          },
        });
      }
    }

    if (step === "done" && enteredRef.current) {
      enteredRef.current = false;
      const allTiles = Array.from(
        container.querySelectorAll<HTMLElement>("[data-index]")
      );

      gsap.killTweensOf([...allTiles, container]);
      allTiles.forEach((el) => {
        gsap.set(el, { clearProps: "all" });
        el.style.willChange = "";
        el.style.pointerEvents = "";
        el.style.visibility = "";
        el.style.position = "";
        el.style.zIndex = "";
      });
      gsap.set(container, { clearProps: "opacity" });
      container.style.transition = "";
      dealtRef.current = [];
    }
  }, [step, containerRef, fadeContainer, fadeContainerDelay]);
}

/**
 * Home-page entry point for the sequence above, driven by IntroContext's
 * phase machine:
 *
 *   nav + TRAVEL_MS  `gather` — the deck is posed and the wrapper faded in,
 *                    all of it behind IntroOverlay's still-opaque sheet, so
 *                    the snap is never seen. Timed to TRAVEL_MS so the first
 *                    photo arrives on the same beat as the nav echo.
 *   photo            the sheet dissolves, revealing the lone centred photo,
 *                    then PHOTO_HOLD_MS of stillness on it.
 *   dealOut          `deal`.
 *   done             `done` — every inline style cleared.
 *
 * No CSS gate is involved on this page; see the comment in OverviewFeed for
 * why the opaque overlay makes one unnecessary (and previously harmful).
 */
export function useDealOut(containerRef: RefObject<HTMLElement | null>) {
  const phase = useIntroPhase();
  const [step, setStep] = useState<DealOutStep>("idle");

  useEffect(() => {
    if (phase === "idle" || phase === "wordmark") {
      setStep("idle");
      return;
    }

    if (phase === "nav") {
      setStep("idle");
      const t = window.setTimeout(() => setStep("gather"), TRAVEL_MS);
      return () => window.clearTimeout(t);
    }

    if (phase === "photo") {
      setStep("gather");
      return;
    }

    if (phase === "dealOut") {
      setStep("deal");
      return;
    }

    if (phase === "done") {
      setStep("done");
    }
  }, [phase]);

  useDealOutSequence(containerRef, step, {
    fadeContainer: true,
    fadeContainerDelay: 0,
  });
}
