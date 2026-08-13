import { FONT_WAIT_CAP_MS } from "./introTimings";

/**
 * Resolves once Switzer is actually available to paint with — or once
 * FONT_WAIT_CAP_MS has elapsed, whichever comes first.
 *
 * ## Why the intro needs this at all
 * `next/font`'s `display: "swap"` (layout.tsx) means the browser paints text
 * in the metric-adjusted Arial fallback the instant it has layout, then
 * re-paints it in Switzer whenever the woff2 arrives. For body copy that is
 * exactly the right trade. For the intro it is not: the overlay is a white
 * sheet with *one* thing on it, so the swap reads as the K+B visibly changing
 * size and shape mid-animation — the glitch this module exists to remove.
 * Both the reveal of the overlay's content and the start of the phase machine
 * hang off this promise, so the monogram's first painted frame is always
 * already in the right typeface.
 *
 * ## Why this is safe to call only from the client
 * `document.fonts.ready` is only meaningful once the `@font-face` rules have
 * been parsed and the document has had a layout pass to discover which faces
 * it needs — before that, the set is idle and `ready` can resolve immediately
 * on a font that has not even been requested yet. That is precisely why this
 * check does NOT live in layout.tsx's inline `<head>` script alongside the
 * `data-intro` decision: by the time any React effect runs, the stylesheet is
 * parsed, first paint has happened and the font request is genuinely pending,
 * so `ready` means what it says.
 *
 * ## Why it can never hang
 * `fonts.ready` resolves on failure as well as success, so a 404'd font still
 * settles this — but a request that neither succeeds nor fails (a stalled
 * connection) would otherwise hold the intro in `idle` behind a blank white
 * sheet indefinitely. The timeout is the floor under that: worst case the
 * intro starts in the fallback face, which is the old behaviour, not a new
 * failure. Missing/ancient `document.fonts` resolves immediately for the same
 * reason.
 */
export function whenFontsReady(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();

  let ready: Promise<unknown> | undefined;
  try {
    ready = document.fonts?.ready;
  } catch {
    ready = undefined;
  }
  if (!ready) return Promise.resolve();

  return Promise.race([
    ready.then(() => undefined),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, FONT_WAIT_CAP_MS);
    }),
  ]);
}
