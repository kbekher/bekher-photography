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
  ANCHOR_MOVE_MS,
  ANCHOR_START_MS,
  CONTAINER_FADE_MS,
  DEAL_BUDGET_MS,
  DEAL_LANDING_MS,
  GSAP_EASE,
  MAX_STAGGER_MS,
  SETTLE_TRANSFORM_MS,
  STAGGER_PER_INDEX_MS,
  TRAVEL_MS,
} from "./introTimings";

export { DEAL_BUDGET_MS, DEAL_LANDING_MS };

const ANCHOR_SCALE = 1;
const STACK_FIT = 0.96;
const MAX_DEAL_TILES = 24;

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
 *  - `gather` snaps every visible tile to the anchor's centre, scaled down to
 *    fit behind it, z-ordered so the anchor sits on top. Nothing animates —
 *    this is a hard set, hidden either behind IntroOverlay's opaque sheet
 *    (home) or behind a CSS opacity gate (collection).
 *  - `deal` releases them: each tile flies to its slot on a stagger derived
 *    from its position in the deck, and the anchor leaves on the very first
 *    frame alongside them but flies for longer, so it lands last.
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

      const anchorRect = anchor.getBoundingClientRect();
      const anchorCx = anchorRect.left + anchorRect.width / 2;
      const anchorCy = anchorRect.top + anchorRect.height / 2;
      const poseW = anchorRect.width * ANCHOR_SCALE;
      const poseH = anchorRect.height * ANCHOR_SCALE;

      dealt.forEach((el) => {
        el.style.willChange = "transform";
        el.style.pointerEvents = el === anchor ? "" : "none";

        if (el === anchor) {
          gsap.set(el, {
            x: targetX - anchorCx,
            y: targetY - anchorCy,
            scale: ANCHOR_SCALE,
            zIndex: MAX_DEAL_TILES + 1,
            transformOrigin: "50% 50%",
          });
          return;
        }

        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const fit =
          r.width > 0 && r.height > 0
            ? Math.min(poseW / r.width, poseH / r.height) * STACK_FIT
            : 0.5;
        const index = Number(el.dataset.index ?? 0);
        gsap.set(el, {
          x: targetX - cx,
          y: targetY - cy,
          scale: fit,
          zIndex: Math.max(1, MAX_DEAL_TILES - index),
          transformOrigin: "50% 50%",
        });
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

      // The stagger counts POSITION IN THE DECK, not `data-index`. Those are
      // not the same list: `dealt` is filtered to what's in the viewport and
      // capped at MAX_DEAL_TILES, so keying off the raw grid index leaves
      // holes in the ramp — a skipped tile becomes a skipped beat, and the
      // cascade stutters. Sorting first is what makes "position" mean
      // "reading order", which is the order the eye expects them to leave in.
      const ordered = [...others].sort(
        (a, b) => Number(a.dataset.index ?? 0) - Number(b.dataset.index ?? 0)
      );

      ordered.forEach((el, position) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 1,
          duration: SETTLE_TRANSFORM_MS / 1000,
          delay: Math.min(position * STAGGER_PER_INDEX_MS, MAX_STAGGER_MS) / 1000,
          ease: GSAP_EASE,
          overwrite: true,
          onComplete: () => {
            el.style.pointerEvents = "";
          },
        });
      });

      if (anchor) {
        // Leaves on the SAME frame as the first card — see ANCHOR_START_MS,
        // which must stay 0. It arrives last only because ANCHOR_MOVE_MS
        // outlasts every other card's delay-plus-flight, so it is in motion
        // the entire time rather than waiting its turn.
        gsap.to(anchor, {
          x: 0,
          y: 0,
          scale: 1,
          duration: ANCHOR_MOVE_MS / 1000,
          delay: ANCHOR_START_MS / 1000,
          ease: GSAP_EASE,
          overwrite: true,
        });
      }
    }

    if (step === "done" && enteredRef.current) {
      enteredRef.current = false;
      const tiles =
        dealtRef.current.length > 0
          ? dealtRef.current
          : Array.from(container.querySelectorAll<HTMLElement>("[data-index]"));

      gsap.killTweensOf([...tiles, container]);
      tiles.forEach((el) => {
        gsap.set(el, { clearProps: "all" });
        el.style.willChange = "";
        el.style.pointerEvents = "";
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
