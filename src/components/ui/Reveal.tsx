"use client";

import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { ARRIVE_MS, EASE, RISE_PX } from "@/components/intro/introTimings";

export interface RevealProps {
  /** Rendered element. Defaults to `div`. */
  as?: ElementType;
  /** Seconds before this element starts its reveal. Prefer a multiple of
   *  `STAGGER_TEXT_MS` so cascading siblings stay on the shared beat. */
  delay?: number;
  /** Seconds the fade + rise takes. Defaults to the scale's `ARRIVE_MS`;
   *  override only with another beat from `introTimings.ts`. */
  duration?: number;
  /** Starting offset in px, animated to 0. Defaults to `RISE_PX` — pass 0 for
   *  a pure fade with no movement, but avoid inventing other distances. */
  y?: number;
  /** When false, hold the hidden state until this becomes true. */
  startWhen?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * The project's one "fade + rise into place on mount" primitive — the
 * replacement for the framer-motion `variants` blocks that used to live in
 * AboutContent / IndexList / CollectionContent (see
 * `src/utils/useReducedMotion.ts` for why framer-motion was dropped).
 *
 * ## Why the hidden state is a CSS class, not an inline style
 * framer-motion serialised its `initial` variant into the SSR HTML as inline
 * `opacity: 0`, which meant a no-JS visitor got a permanently invisible page.
 * Here the resting-hidden state is the `.reveal` class in globals.css
 * instead, which buys two escape hatches an inline style cannot have: a
 * `prefers-reduced-motion` rule that forces it open, and a `<noscript>`
 * override in layout.tsx for when JS never runs at all. `opacity: 0` must
 * never be a terminal state — the same rule GridReveal.module.css follows.
 *
 * ## Why the animation is CSS and no longer GSAP
 * The entrance used to be a `gsap.fromTo` in a `useLayoutEffect`, which meant
 * every first screen on this site stayed invisible until ~220KB of JavaScript
 * had downloaded, parsed, hydrated and run — markup complete and paintable,
 * held at `opacity: 0` for no reason but where the animation lived. First
 * Contentful Paint was pinned to hydration.
 *
 * The entrance is now the `.reveal-run` CSS animation, which starts from the
 * server-rendered markup at first paint with no JavaScript involved. The beat
 * is identical and still comes from `introTimings.ts`, handed over as custom
 * properties. GSAP remains for choreography that genuinely needs sequencing —
 * the intro, the deal-out, the lightbox morph — but fading one element up is
 * not that.
 *
 * ## The three states, and why the last one exists
 * `hidden -> running -> done`. `running` is rendered on the SERVER whenever
 * `startWhen` is already true (every reveal on the site but one), so no
 * commit sits between the markup arriving and the entrance starting.
 *
 * `done` clears the animation once it has landed, and it is not cosmetic:
 * `animation-fill-mode: both` holds the final `translateY(0)`, and a non-none
 * transform — even an identity one — makes an element the containing block
 * for any `position: fixed` descendant. The lightbox morph pins the hero with
 * `position: fixed` and measures viewport rects; a stray transformed ancestor
 * would silently reinterpret those coordinates. The old GSAP path cleared its
 * inline transform on landing for exactly this reason, and dropping that
 * invariant while moving to CSS would have left a trap for whoever next put a
 * fixed-position element inside a `Reveal`.
 */
type Phase = "hidden" | "running" | "done";

export default function Reveal({
  as: Tag = "div",
  delay = 0,
  duration = ARRIVE_MS / 1000,
  y = RISE_PX,
  startWhen = true,
  className = "",
  children,
}: RevealProps) {
  const [phase, setPhase] = useState<Phase>(startWhen ? "running" : "hidden");
  // Latched: once an entrance has started it must never be taken away. A
  // parent re-render that flips `startWhen` back would otherwise re-hide
  // content that has already been read.
  const started = useRef(startWhen);

  useEffect(() => {
    if (!startWhen || started.current) return;
    started.current = true;
    setPhase("running");
  }, [startWhen]);

  const style = {
    "--rv-delay": `${delay}s`,
    "--rv-dur": `${duration}s`,
    "--rv-y": `${y}px`,
    "--rv-ease": EASE,
  } as CSSProperties;

  const phaseClass = phase === "running" ? " reveal-run" : phase === "done" ? " reveal-done" : "";

  return (
    <Tag
      style={style}
      className={`reveal${phaseClass}${className ? ` ${className}` : ""}`}
      // Animation events BUBBLE. Without the target check, any animated
      // descendant finishing — a shimmer placeholder, a nested reveal —
      // would end this element's entrance early, snapping it to full opacity
      // mid-fade.
      onAnimationEnd={(event: AnimationEvent) => {
        if (event.target !== event.currentTarget) return;
        setPhase((current) => (current === "running" ? "done" : current));
      }}
    >
      {children}
    </Tag>
  );
}
