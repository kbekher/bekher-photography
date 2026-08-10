"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useIntroPhase } from "./IntroContext";

const EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)";
const STAGGER_MS = 20;
const MAX_STAGGER_MS = 280;

/**
 * Steps 3-4 of the intro (spec §5.1): "the newest photo in the feed appears
 * alone, centred... the remaining grid photos emanate from that photo's
 * position and settle into their grid slots."
 *
 * This is intentionally NOT implemented by changing PhotoGrid/PhotoTile (out
 * of scope — see task file-ownership rules) — it works entirely from
 * outside, by grabbing the already-rendered tile elements via the
 * `data-index` attribute PhotoTile already puts on its root node, and
 * nudging their `transform`/`opacity` imperatively. React never manages a
 * `style` prop on that node, so these direct DOM writes are never
 * clobbered by PhotoTile's own re-renders (e.g. its `loaded` state flipping
 * on image load), and they're cleared entirely once the intro finishes.
 *
 * ## Why plain DOM mutation instead of state/framer here
 * The grid can hold up to 20 tiles on first paint; driving this from React
 * state would mean re-rendering all of them every frame. A one-shot
 * "snap to a computed offset, then transition to identity" (the classic
 * FLIP technique) is imperceptibly different for the user and far cheaper.
 *
 * ## Sequencing with IntroOverlay
 * The `photo` phase's snap-to-hidden/centred state is applied instantly
 * (`transition: none`) the moment the phase flips — at that exact instant
 * IntroOverlay is still opaque (its own fade-out is just beginning), so the
 * snap is never visible; the overlay's fade is what "reveals" the already
 *-repositioned anchor tile.
 */
export function useDealOut(containerRef: RefObject<HTMLElement | null>) {
  const phase = useIntroPhase();
  const enteredRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (phase === "photo") {
      enteredRef.current = true;

      const tiles = Array.from(container.querySelectorAll<HTMLElement>("[data-index]"));
      const anchor = tiles.find((el) => el.dataset.index === "0");
      if (!anchor) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetX = vw / 2;
      const targetY = vh / 2;

      const anchorRect = anchor.getBoundingClientRect();
      const anchorCx = anchorRect.left + anchorRect.width / 2;
      const anchorCy = anchorRect.top + anchorRect.height / 2;
      const scale = Math.min(
        1.9,
        Math.max(1.2, (Math.min(vw, vh) * 0.42) / Math.max(anchorRect.width, anchorRect.height))
      );

      tiles.forEach((el) => {
        el.style.willChange = "transform, opacity";
        el.style.transition = "none";
        el.style.transformOrigin = "50% 50%";

        if (el === anchor) {
          el.style.transform = `translate(${targetX - anchorCx}px, ${targetY - anchorCy}px) scale(${scale})`;
          el.style.opacity = "1";
          return;
        }

        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        el.style.transform = `translate(${targetX - cx}px, ${targetY - cy}px) scale(0.55)`;
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      });
    }

    if (phase === "dealOut") {
      const tiles = Array.from(container.querySelectorAll<HTMLElement>("[data-index]"));

      tiles.forEach((el) => {
        const index = Number(el.dataset.index ?? 0);
        const delay = Math.min(index * STAGGER_MS, MAX_STAGGER_MS);
        el.style.transition = `transform 0.65s ${EASE} ${delay}ms, opacity 0.45s ease-out ${delay}ms`;
      });
      // Force a style flush so the browser commits `transition` before we
      // change the target values below — otherwise it can coalesce both
      // into a single recalc and skip the animation entirely.
      void container.offsetHeight;

      requestAnimationFrame(() => {
        tiles.forEach((el) => {
          el.style.transform = "none";
          el.style.opacity = "1";
          el.style.pointerEvents = "";
        });
      });
    }

    if (phase === "done" && enteredRef.current) {
      enteredRef.current = false;
      const tiles = Array.from(container.querySelectorAll<HTMLElement>("[data-index]"));
      tiles.forEach((el) => {
        el.style.transition = "";
        el.style.transform = "";
        el.style.opacity = "";
        el.style.transformOrigin = "";
        el.style.pointerEvents = "";
        el.style.willChange = "";
      });
    }
  }, [phase, containerRef]);
}
