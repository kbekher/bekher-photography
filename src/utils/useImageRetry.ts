"use client";

import { useEffect, useRef, useState } from "react";

/**
 * How many times an image re-requests itself after a failed load.
 *
 * The resizer is capped at 10 concurrent invocations (a new-account Lambda
 * quota) and returns 429 past that, so ANY burst of simultaneous requests to
 * a cold URL loses everything past the tenth. Two places in this app produce
 * such a burst:
 *
 *  - the grid. A resize across the `lg` breakpoint changes `sizes` for every
 *    tile at once, so twenty tiles pick a new srcset candidate simultaneously.
 *    Without a retry those tiles keep their `opacity: 0` forever — `onLoad`
 *    never fires — which is the "broken images after resizing" symptom
 *    exactly: not a broken image, a permanently hidden one.
 *  - the lightbox thumbnail strip. Opening the viewer commits a row of
 *    thumbnails in one go and every one of them fetches a 96px rendition
 *    nothing else on the page has ever asked for. With no error handling at
 *    all — which is what the strip used to have — the throttled ones painted
 *    the browser's broken-image glyph and stayed that way.
 *
 * Two attempts on a staggered backoff is enough to ride out a burst, because
 * the burst is self-clearing: the requests that did succeed have freed their
 * concurrency slots by the time the first retry lands.
 *
 * This lives in one place on purpose. It is a property of the ORIGIN, not of
 * either call site, so a change to the Lambda's quota should be a change to
 * one number here rather than a hunt through the components.
 */
export const MAX_RETRIES = 2;
export const RETRY_BASE_MS = 400;

export interface ImageRetry {
  /**
   * Attempt counter, meant for `key={attempt}` on the `<Image>`. Remounting
   * is what actually re-issues the request; 429s are not cached by
   * CloudFront, so the retry reaches the origin.
   */
  attempt: number;
  /**
   * True once `MAX_RETRIES` have been spent and the image is never going to
   * arrive. Callers decide what that looks like — it is deliberately not a
   * decision this hook makes, because "no image" reads very differently in a
   * grid (reveal the element; a hole looks like a layout bug) and in the
   * thumbnail strip (keep the deliberate grey placeholder; a broken-image
   * glyph in a 40px box is just noise).
   */
  exhausted: boolean;
  /** Hand straight to `<Image onError>`. */
  onError: () => void;
}

/**
 * Retry-on-error state for a single `<Image>`.
 *
 * One hook instance per image — the backoff is per-image and deliberately
 * jittered, so a shared instance would defeat the whole point (see the
 * stagger below).
 */
export function useImageRetry(): ImageRetry {
  const [attempt, setAttempt] = useState(0);
  const [exhausted, setExhausted] = useState(false);
  const retryTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    };
  }, []);

  const onError = () => {
    if (attempt >= MAX_RETRIES) {
      setExhausted(true);
      return;
    }
    // Staggered so twenty simultaneously-throttled images don't retry in
    // lockstep and reproduce the burst that throttled them.
    const backoff = RETRY_BASE_MS * (attempt + 1) + Math.random() * RETRY_BASE_MS;
    retryTimer.current = window.setTimeout(() => setAttempt((n) => n + 1), backoff);
  };

  return { attempt, exhausted, onError };
}
