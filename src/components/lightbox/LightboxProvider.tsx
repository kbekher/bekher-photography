"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLightboxRoute } from "./useLightboxRoute";
import Lightbox from "./Lightbox";

/**
 * The contract every grid tile / caller must speak. `src` is the S3 key
 * relative to the lambda base (e.g. "european-feel/venice-first-impression.jpg"),
 * `aspectRatio` is "3/2" (horizontal) or "2/3" (vertical) — see `src/data.ts`'s
 * `horizontal`/`vertical` constants.
 */
export interface LightboxPhoto {
  src: string;
  aspectRatio: string;
  place?: string;
  year?: string;
  description?: string;
}

export interface LightboxContextValue {
  photos: LightboxPhoto[];
  isOpen: boolean;
  index: number;
  /** True when the user clicked a tile (vs a `?photo=` deep link on load). */
  morphFromClick: boolean;
  /** Open the lightbox at `index` — call this from a grid tile's onClick. */
  open: (index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  /** Jump straight to `index` while already open (arrows/thumbnails use this). */
  goTo: (index: number) => void;
}

function noop() {
  /* inert default — see DEFAULT_CONTEXT below */
}

// A real (non-null) default context value, deliberately inert. It exists so
// that `useLightbox()` never throws when called from the `<Suspense>`
// fallback branch below (which renders `children` — i.e. the photo grid —
// without a real provider underneath during Next's static prerender pass).
// Real pages always end up under the functional provider once client JS
// runs; this default is never seen by an interactive user.
const DEFAULT_CONTEXT: LightboxContextValue = {
  photos: [],
  isOpen: false,
  index: 0,
  morphFromClick: false,
  open: noop,
  close: noop,
  next: noop,
  prev: noop,
  goTo: noop,
};

const LightboxContext = createContext<LightboxContextValue>(DEFAULT_CONTEXT);

/**
 * Read lightbox state + controls from anywhere under `<LightboxProvider>`.
 * A grid tile calls `open(i)` on click; the lightbox overlay itself (and
 * nothing else) needs the rest.
 */
export function useLightbox(): LightboxContextValue {
  return useContext(LightboxContext);
}

export interface LightboxProviderProps {
  /** The full photo list this lightbox instance paginates over — an Overview
   * feed page or a single collection's photos. `?photo=<n>` indexes into
   * exactly this array, so pass the same list/order the grid rendered. */
  photos: LightboxPhoto[];
  children: ReactNode;
}

/**
 * Mounts the lightbox overlay + context around a page's photo grid.
 * Open/close uses a GSAP FLIP morph from the clicked tile (see
 * `lightboxMorph.ts`). Grid tiles stay plain DOM — no shared layoutIds.
 *
 * `useSearchParams` (used internally by `useLightboxRoute` for the
 * `?photo=` deep link) requires a `<Suspense>` ancestor during Next's
 * static prerender. That boundary lives here, so pages that mount this
 * provider never have to add one themselves.
 */
export default function LightboxProvider({ photos, children }: LightboxProviderProps) {
  return (
    <Suspense fallback={<>{children}</>}>
      <LightboxRouteBridge photos={photos}>{children}</LightboxRouteBridge>
    </Suspense>
  );
}

function LightboxRouteBridge({ photos, children }: LightboxProviderProps) {
  const route = useLightboxRoute(photos.length);
  const photosLength = photos.length;
  const [morphFromClick, setMorphFromClick] = useState(false);

  // The element that had focus at the moment `open()` was called (i.e. the
  // grid tile that was clicked) — restored on close, per spec's a11y note.
  const originRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(route.isOpen);

  const open = useCallback(
    (i: number) => {
      setMorphFromClick(true);
      if (typeof document !== "undefined") {
        originRef.current = (document.activeElement as HTMLElement) ?? null;
      }
      route.open(i);
    },
    [route.open]
  );

  useEffect(() => {
    if (!route.isOpen) {
      setMorphFromClick(false);
    }
  }, [route.isOpen]);

  const next = useCallback(() => {
    if (!route.isOpen || photosLength === 0) return;
    route.goTo((route.index + 1) % photosLength);
  }, [route.goTo, route.isOpen, route.index, photosLength]);

  const prev = useCallback(() => {
    if (!route.isOpen || photosLength === 0) return;
    route.goTo((route.index - 1 + photosLength) % photosLength);
  }, [route.goTo, route.isOpen, route.index, photosLength]);

  // Restore focus to the originating tile once the lightbox closes, no
  // matter how it closed (Close button, Esc, or the browser Back button).
  useEffect(() => {
    if (wasOpenRef.current && !route.isOpen) {
      originRef.current?.focus?.();
      originRef.current = null;
    }
    wasOpenRef.current = route.isOpen;
  }, [route.isOpen]);

  const value = useMemo<LightboxContextValue>(
    () => ({
      photos,
      isOpen: route.isOpen,
      index: route.index,
      morphFromClick,
      open,
      close: route.close,
      next,
      prev,
      goTo: route.goTo,
    }),
    [photos, route.isOpen, route.index, morphFromClick, open, route.close, next, prev, route.goTo]
  );

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <Lightbox />
    </LightboxContext.Provider>
  );
}
