"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/utils/useReducedMotion";
import { GSAP_EASE } from "@/components/intro/introTimings";

export interface RevealProps {
  /** Rendered element. Defaults to `div`. */
  as?: ElementType;
  /** Seconds before this element starts its reveal. */
  delay?: number;
  /** Seconds the fade + rise takes. */
  duration?: number;
  /** Starting offset in px, animated to 0. */
  y?: number;
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
 * instead, which buys two escape hatches that an inline style cannot have:
 * a `prefers-reduced-motion` rule that forces it open, and a `<noscript>`
 * override in layout.tsx for when JS never runs at all. `opacity: 0` must
 * never be a terminal state — the same rule GridReveal.module.css follows.
 *
 * The class is also what makes this flash-free: it is present in the
 * server-rendered HTML, so the element is already hidden on the very first
 * paint, and `useLayoutEffect` hands it to GSAP before the next one.
 */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  duration = 0.45,
  y = 12,
  className = "",
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Read the preference synchronously rather than via `useReducedMotion()`.
    // That hook resolves one commit AFTER mount, and this is a mount-only
    // layout effect that starts animating immediately — so with the hook, a
    // reduced-motion visitor would get `gsap.fromTo` writing an inline
    // `opacity: 0` (which outranks globals.css's
    // `@media (prefers-reduced-motion) .reveal { opacity: 1 }` escape hatch)
    // and a real tween starting, only corrected on the next commit. On a
    // route whose mount schedules no synchronous work, that correction can
    // land after paint: a frame of hidden content, for the one visitor who
    // asked not to see motion.
    //
    // Reduced motion still has to REMOVE the hidden state — it just does it
    // without a tween. Returning early would leave `.reveal`'s `opacity: 0`
    // in place, which is the "invisible page" failure this component exists
    // to avoid.
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: GSAP_EASE,
        // The inline transform is cleared on landing so it can never
        // interfere with anything measured off this subtree later.
        onComplete: () => gsap.set(el, { clearProps: "transform" }),
      }
    );

    return () => {
      tween.kill();
    };
  }, [delay, duration, y]);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
