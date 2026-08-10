"use client";

import { useEffect, useState } from "react";
import { useIntroPhase } from "./IntroContext";

const EASE = "cubic-bezier(0.25, 0.1, 0.25, 1)";
const NAV_LABELS = ["Overview", "Index", "About"];

/**
 * Steps 1-2 of the intro (spec §5.1): a fixed, opaque white sheet that shows
 * a K+B monogram morphing into the "Kristina Bekher" wordmark, then carries
 * it up into its real header position while a decorative navbar echo fades
 * in beneath it — before dissolving to reveal the real page underneath.
 *
 * ## Why this can fake the header's exact position without measuring it
 * The real header (PageShell) is `flex flex-col items-center pt-24`, then
 * the logotype, then `mt-24` before the navbar — fixed, known pixel
 * offsets, not something that needs `getBoundingClientRect`. This overlay
 * reuses those exact same values, so the wordmark's *resting* position here
 * (no transform) is already pixel-identical to the real one. The only thing
 * that needs to animate is a translateY from that resting spot out to
 * viewport-centre, which a single `calc(50vh - 24px - 50%)` handles: `50vh`
 * puts its top edge at viewport-middle, and `-50%` (a percentage of the
 * element's *own* box, per the CSS transform spec) pulls it up by half its
 * own height, landing it dead-centre regardless of viewport size.
 *
 * ## Why this never needs its own fade-in
 * The wordmark/navbar block simply appears at full opacity when this
 * component mounts (nothing animates "into" the centred pose) — the overlay
 * itself only fades OUT, during the `photo` phase, and it's fully opaque
 * for the wordmark/nav phases. There's nothing to reveal underneath until
 * that fade-out begins, so an entrance fade here would be invisible work.
 *
 * ## a11y
 * Purely decorative — the real, interactive Logotype/NavBar are already
 * present underneath (PageShell always server-renders them). This sheet is
 * `aria-hidden` and non-interactive so it never becomes a duplicate landmark
 * or a duplicate "Kristina Bekher" link for assistive tech.
 */
export default function IntroOverlay() {
  const phase = useIntroPhase();
  const [stage, setStage] = useState<"in" | "enter" | "morph">("in");

  const mounted = phase === "wordmark" || phase === "nav" || phase === "photo";

  useEffect(() => {
    if (phase !== "wordmark") {
      setStage("in");
      return;
    }
    const raf = requestAnimationFrame(() => setStage("enter"));
    const t = setTimeout(() => setStage("morph"), 260);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [phase]);

  if (!mounted) return null;

  const centered = phase === "wordmark";
  const fadingOut = phase === "photo";
  const showNav = phase === "nav" || phase === "photo";

  const kbVisible = stage === "in" || stage === "enter";
  const wordmarkVisible = stage === "morph";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] bg-white"
      style={{
        opacity: fadingOut ? 0 : 1,
        transition: `opacity 0.3s ${EASE}`,
      }}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-[40px]">
        <div className="flex w-full flex-col items-center pt-24">
          <div
            style={{
              transform: centered
                ? "translateY(calc(50vh - 24px - env(safe-area-inset-top, 0px) - 50%))"
                : "translateY(0)",
              transition: `transform 0.5s ${EASE}`,
            }}
          >
            <div className="grid">
              <span
                className="col-start-1 row-start-1 block whitespace-nowrap text-center"
                style={{
                  opacity: stage === "in" ? 0 : kbVisible ? 1 : 0,
                  transform: stage === "in" ? "scale(0.92)" : kbVisible ? "scale(1)" : "scale(1.06)",
                  filter: kbVisible ? "blur(0px)" : "blur(4px)",
                  transition:
                    stage === "morph"
                      ? `opacity 0.35s ${EASE}, transform 0.35s ${EASE}, filter 0.35s ${EASE}`
                      : `opacity 0.22s ${EASE}, transform 0.22s ${EASE}`,
                }}
              >
                K+B
              </span>
              <span
                className="col-start-1 row-start-1 block whitespace-nowrap text-center"
                style={{
                  opacity: wordmarkVisible ? 1 : 0,
                  transform: wordmarkVisible ? "scale(1)" : "scale(0.94)",
                  filter: wordmarkVisible ? "blur(0px)" : "blur(4px)",
                  transition: `opacity 0.4s ${EASE} 0.06s, transform 0.4s ${EASE} 0.06s, filter 0.4s ${EASE} 0.06s`,
                }}
              >
                Kristina Bekher
              </span>
            </div>
          </div>

          <div
            className="mt-24 flex items-center justify-center gap-8"
            style={{
              opacity: showNav ? 1 : 0,
              transition: `opacity 0.4s ${EASE} ${showNav ? "0.1s" : "0s"}`,
            }}
          >
            {NAV_LABELS.map((label) => (
              <span
                key={label}
                className="inline-flex h-[31px] items-center justify-center rounded-pill px-8 py-[6px] text-center"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
