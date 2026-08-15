import type { Metadata } from "next";
import type { CSSProperties } from "react";
import localFont from "next/font/local";
import "./globals.css";
import {
  EASE,
  INTRO_CONTENT_FAILSAFE_MS,
  MONOGRAM_FADE_MS,
} from "@/components/intro/introTimings";
import { LAMBDA_IMG_BASE } from "@/constants/constants";

/**
 * The social preview card (Facebook, LinkedIn, WhatsApp, Slack, iMessage, X).
 * Nothing on the site renders this — it exists only for link unfurls.
 *
 * ## Why it is built from LAMBDA_IMG_BASE rather than hardcoded
 * It used to point at a pair of standalone objects (`hero-1200.jpg`,
 * `hero-256.jpg`) sitting at the root of the assets bucket, which meant the
 * same photograph existed twice, in two places, at two sizes, maintained by
 * hand. Deriving it from the image base makes the resizer the one source of
 * truth, and means this URL follows `NEXT_PUBLIC_IMG_ORIGIN` onto the CDN
 * along with everything else, with no second place to remember to update.
 *
 * ## Why `f=jpeg` and not the webp every other image on the site uses
 * Scrapers are not browsers. Several of the big ones — Facebook and LinkedIn
 * especially — still treat WebP as unsupported for `og:image` and will
 * silently show no preview at all. JPEG is the format that always unfurls,
 * and this is one image fetched by a crawler, not by a visitor, so its bytes
 * do not matter.
 *
 * ## Why the dimensions are declared, and declared like THIS
 * These numbers are the real intrinsic size of the rendition. The previous
 * pair claimed `1200x630` — the conventional 1.91:1 social banner — for a
 * photo that is actually 1200x1810. Platforms lay the card out from what you
 * declare, so that mismatch had them reserving a wide letterbox for a tall
 * portrait. If a proper 1.91:1 preview is ever wanted it needs a purpose-made
 * crop: the resizer scales by width only and ignores `h`.
 */
const OG_IMAGE_URL = `${LAMBDA_IMG_BASE}/hero.jpg?w=1200&q=75&f=jpeg`;
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 1810;

const SITE_URL = "https://www.kristinabekher.com";

/**
 * Site-wide publication date.
 *
 * A LITERAL, deliberately — never `new Date()`. A date computed at build time
 * would move on every deploy, telling crawlers the site had been republished
 * each time a typo was fixed, which is both untrue and the kind of signal
 * that gets discounted once noticed. Edit it when the site is genuinely
 * republished, and not otherwise.
 */
const SITE_PUBLISHED = "2026-08-15";

/**
 * The publish date, and the only reason it is JSON-LD rather than a `<meta>`
 * tag: there is no meta tag that carries a publication date for a *site*.
 * `article:published_time` is an OpenGraph article property and is ignored
 * outright when `og:type` is `website`, so adding it here would emit markup
 * that reads correctly and does nothing. Three lines of JSON-LD is the
 * smallest thing that a crawler actually parses.
 */
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  datePublished: SITE_PUBLISHED,
};

// `display: "swap"` stays deliberately: for body copy, text-in-a-fallback
// beats invisible text, and next/font emits a `<link rel="preload">` plus an
// Arial fallback face with matched metrics, so the swap costs no reflow.
//
// The intro is the one place that trade doesn't hold — a swap under a
// single, centred, animating wordmark is a visible change of glyph shape, not
// an invisible reflow — so the intro opts out of the swap specifically,
// rather than the whole site opting into `font-display: block`. See
// src/components/intro/fontsReady.ts.
const switzer = localFont({
  src: "../../public/fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  display: "swap",
  weight: "100 900",
  adjustFontFallback: "Arial",
});

// The intro's font gate lives in CSS (it has to hold from the first painted
// frame, before React exists — see globals.css), but its numbers live in
// introTimings.ts like every other beat in the sequence. These custom
// properties are the join between the two, so the durations are still written
// exactly once, in TS.
const INTRO_CSS_VARS = {
  "--intro-content-fade": `${MONOGRAM_FADE_MS}ms`,
  "--intro-content-failsafe": `${INTRO_CONTENT_FAILSAFE_MS}ms`,
  "--intro-ease": EASE,
} as CSSProperties;

export const metadata: Metadata = {
  // Resolves every relative url in this file and in each route's own metadata
  // (canonicals, og:url) to an absolute one, which is what crawlers require.
  metadataBase: new URL("https://www.kristinabekher.com"),
  // Root canonical, correct for `/` itself. App Router metadata is inherited
  // by child segments, so EVERY other route must declare its own — a page
  // that doesn't will claim to be the home page, which is worse than having
  // no canonical at all. All current routes do; new ones must too.
  alternates: { canonical: "/" },
  // Inherited by every route, which is correct here: one person shot,
  // wrote and published all of it. `authors` emits <meta name="author">
  // plus <link rel="author">; `creator`/`publisher` are what the OG and
  // schema-consuming crawlers read.
  authors: [{ name: "Kristina Bekher", url: "https://www.kristinabekher.com" }],
  creator: "Kristina Bekher",
  publisher: "Kristina Bekher",
  title: "Kristina Bekher",
  description: "Kristina Bekher is a Ukrainian photographer and software developer based in Germany. The website is a portfolio of her photography work.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Kristina Bekher",
    description: "Kristina Bekher is a Ukrainian photographer and software developer based in Germany. The website is a portfolio of her photography work.",
    images: [
      {
        url: OG_IMAGE_URL,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: "Kristina Bekher",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kristina Bekher",
    description: "Kristina Bekher is a Ukrainian photographer and software developer based in Germany. The website is a portfolio of her photography work.",
    // Same rendition as OpenGraph, deliberately: `summary_large_image` wants
    // roughly 1200px across, and this used to hand it a 256x386 thumbnail.
    images: [OG_IMAGE_URL],
  },
};

// Anti-FOUC gate for the first-load intro/preloader (see
// src/components/intro/IntroContext.tsx). React seeds intro state as
// `"idle"` on both server and client so hydration never mismatches — but
// that means the *decision* to play the intro can only be made inside a
// `useEffect`, which runs after the browser's first paint. Left alone, that
// paints the finished real page first and layers the white preloader sheet
// on top a moment later, which is backwards: the preloader must cover the
// page from the very first paint or it isn't a preloader.
//
// This inline, synchronous script runs in <head> — before the body is
// parsed or painted — and makes that same play/skip decision using the
// exact same rules IntroContext uses (session flag, `?intro=1` replay,
// prefers-reduced-motion, `?photo=` deep link). If it decides the intro
// should play, it sets `data-intro="play"` on <html>; globals.css keys the
// preloader overlay's visibility purely off that attribute, so the overlay
// can be visible from the first painted frame instead of flashing in after
// hydration. IntroContext's own effect then reads this same attribute
// (rather than recomputing the decision) so the two can never disagree.
//
// Default-safe by construction: if this script throws for any reason (a
// storage exception, matchMedia missing, anything), the attribute is simply
// never set, globals.css's default rule keeps the overlay hidden, and the
// real page renders normally — nobody is ever left on a blank white screen
// because of this script.
const INTRO_HEAD_SCRIPT = `(function () {
  try {
    var KEY = "kb-intro-played";
    var params = new URLSearchParams(window.location.search);
    var forceReplay = params.get("intro") === "1";
    var isPhotoDeepLink = params.has("photo");

    var alreadyPlayed;
    try {
      alreadyPlayed = window.sessionStorage.getItem(KEY) === "1";
    } catch (e) {
      // Storage disabled/unavailable — skip conservatively, same fallback
      // as introSession.ts's hasPlayedIntro().
      alreadyPlayed = true;
    }

    var prefersReducedMotion = false;
    try {
      prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;
    } catch (e) {
      // Unknown reading — only an affirmative "true" should skip the
      // intro, same rule IntroContext applies to useReducedMotion().
      prefersReducedMotion = false;
    }

    var skip = (alreadyPlayed && !forceReplay) || prefersReducedMotion || isPhotoDeepLink;

    if (!skip) {
      document.documentElement.setAttribute("data-intro", "play");

      // Dead-man's switch. globals.css turns this attribute into an OPAQUE,
      // full-viewport white sheet, and the only thing that ever removes it is
      // IntroProvider reaching its "done" phase. So if the client bundle
      // never executes far enough to mount IntroProvider — a chunk 404, a
      // throw in any client module evaluated before it, an extension breaking
      // hydration — the visitor is stranded on a blank white screen forever,
      // with no CSS escape hatch. Every other opacity/visibility gate in this
      // codebase has one (see .reveal and GridReveal's .gate); this is that
      // hatch, and it deliberately lives here in the head script rather than
      // in React, because the whole failure mode is "React never ran".
      // Comfortably longer than the ~3.7s intro, so it can never fire early.
      // Dropping the attribute also releases the overlay's font gate
      // (globals.css scopes its .intro-content rules under it), so that
      // second opacity gate can't outlive this one either.
      setTimeout(function () {
        document.documentElement.removeAttribute("data-intro");
      }, 8000);
    }
  } catch (e) {
    // Never let a script error leave the page blank.
  }
})();`;

// No-JS escape hatch for the `Reveal` primitive's hidden state (the `.reveal`
// class in globals.css). This hazard is inherited, not new: framer-motion —
// which Reveal replaces — serialised its `initial` variant into the SSR HTML
// as an inline `opacity: 0`, so a visitor without JS got a page whose text
// was permanently invisible, with no way to override it. Moving the hidden
// state into a class fixed the "no way to override it" half; this block is
// the override. <noscript> content only reaches the DOM when scripting is
// disabled, so it can never fight the GSAP-driven reveal when JS *is*
// available. `!important` because it must beat `.reveal` regardless of where
// the stylesheet lands in source order.
const REVEAL_NOSCRIPT_CSS = `.reveal { opacity: 1 !important; }`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html
      lang="en"
      className={switzer.variable}
      style={INTRO_CSS_VARS}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_HEAD_SCRIPT }} />
        <noscript>
          <style>{REVEAL_NOSCRIPT_CSS}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
