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
    }
  } catch (e) {
    // Never let a script error leave the page blank.
  }
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={switzer.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_HEAD_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
