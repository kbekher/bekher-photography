"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface LightboxRouteState {
  /** Whether `?photo=` currently points at a valid index into the photo list. */
  isOpen: boolean;
  /** The validated index. Only meaningful while `isOpen` is true (0 otherwise). */
  index: number;
  /**
   * Open the lightbox at `index`. Pushes a NEW history entry (not a replace)
   * so the browser Back button has something to undo — see `close()` below
   * for why that matters.
   */
  open: (index: number) => void;
  /** Switch the currently-open photo in place. Replaces the URL — no new
   * history entry, so arrow/keyboard nav and thumbnail hover don't spam the
   * back stack. */
  goTo: (index: number) => void;
  /**
   * Close the lightbox. If `open()` pushed the entry we're currently on,
   * this calls `history.back()` so Close and the physical Back button land
   * in the exact same place. If the page was loaded directly with `?photo=`
   * already in the URL (a deep link — there is no "clean" entry beneath it
   * to go back to), it falls back to `replace` so Close doesn't navigate the
   * visitor off the page entirely.
   */
  close: () => void;
}

/**
 * Deep-link + Back-button wiring for the lightbox (design spec §7).
 *
 * `?photo=<n>` is the single source of truth for open/closed state and which
 * index is showing — there is no separate React state to keep in sync with
 * it. `isOpen`/`index` are derived fresh from `searchParams` on every call,
 * which is what makes both deep-linking (the lightbox is already open on
 * first paint when the URL already carries `?photo=`) and the Back button
 * work for free: both are just the browser handing this hook a new
 * `searchParams` value.
 *
 * An out-of-range or non-numeric `?photo=` value simply fails the `isOpen`
 * check below (treated as "closed") — it is never thrown on.
 *
 * Must be called from a component rendered under a `<Suspense>` boundary
 * (Next.js's requirement for `useSearchParams` during static prerendering).
 * `LightboxProvider` supplies that boundary internally, so callers of this
 * hook — and pages that mount `LightboxProvider` — never have to add one
 * themselves.
 */
export function useLightboxRoute(photosCount: number): LightboxRouteState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawPhoto = searchParams.get("photo");
  // Strict "one or more digits" match before parsing — `Number()` alone is
  // too permissive (`Number("")` is 0, `Number(" 3 ")` is 3, `Number("1e1")`
  // is 10, `Number("0x1")` is 1), so a malformed/empty `?photo=` must fail
  // here rather than quietly resolving to a valid-looking index.
  const parsed = rawPhoto !== null && /^\d+$/.test(rawPhoto) ? Number(rawPhoto) : Number.NaN;
  const isOpen = photosCount > 0 && Number.isInteger(parsed) && parsed >= 0 && parsed < photosCount;
  const index = isOpen ? parsed : 0;

  // Did *we* push the history entry currently showing `?photo=`? Reset
  // whenever the lightbox transitions closed, however that happened (our
  // own close(), or the user physically pressing Back).
  const pushedRef = useRef(false);
  const wasOpenRef = useRef(isOpen);
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      pushedRef.current = false;
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const buildUrl = useCallback(
    (i: number | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (i === null) {
        params.delete("photo");
      } else {
        params.set("photo", String(i));
      }
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams]
  );

  const open = useCallback(
    (i: number) => {
      if (i < 0 || i >= photosCount) return;
      pushedRef.current = true;
      router.push(buildUrl(i), { scroll: false });
    },
    [buildUrl, photosCount, router]
  );

  const goTo = useCallback(
    (i: number) => {
      if (i < 0 || i >= photosCount) return;
      router.replace(buildUrl(i), { scroll: false });
    },
    [buildUrl, photosCount, router]
  );

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      router.back();
    } else {
      router.replace(buildUrl(null), { scroll: false });
    }
  }, [buildUrl, router]);

  return { isOpen, index, open, goTo, close };
}
