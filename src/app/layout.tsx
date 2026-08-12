import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const switzer = localFont({
  src: "../../public/fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  display: "swap",
  weight: "100 900",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
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
        url: "https://d14lj85n4pdzvr.cloudfront.net/hero-1200.jpg",
        width: 1200,
        height: 630,
        alt: "Kristina Bekher",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kristina Bekher",
    description: "Kristina Bekher is a Ukrainian photographer and software developer based in Germany. The website is a portfolio of her photography work.",
    images: ["https://d14lj85n4pdzvr.cloudfront.net/hero-256.jpg"],
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
    <html lang="en" className={switzer.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_HEAD_SCRIPT }} />
        <noscript>
          <style>{REVEAL_NOSCRIPT_CSS}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
