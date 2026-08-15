import type { NextConfig } from "next";

const RETIRED_SLUGS = [
  "mind-the-gap",
  "moments-of-stillness",
  "grain-of-ukraine",
  "pentax-17",
  "faces-and-places",
];

const KEPT_SLUGS = [
  "noir-et-blanc",
  "alpine-escape",
  "harman-phoenix",
  "european-feel",
  "jazzy-blues",
];

const nextConfig: NextConfig = {
  images: {
    // Every entry here and in `imageSizes` below is a candidate in EVERY
    // image's srcset, and each one a browser actually picks is a separate
    // object at the origin. Two reasons to keep the list tight rather than
    // generous:
    //
    //  - cache concentration. The resizer is capped at 10 concurrent
    //    invocations (a new-account Lambda quota) and 429s past it. Every
    //    extra candidate spreads visitors' viewport/DPR combinations across
    //    more distinct URLs, so more requests miss the CDN and reach the
    //    function. Fewer, better-chosen widths mean more of them are already
    //    warm at the edge.
    //  - the top end was unreachable. The source scans are 2064-2075px wide
    //    (vertical) and 3012-3130px (horizontal), and the lightbox hero's box
    //    is capped by the 1280px container at ~1008 CSS px — 2016px at DPR 2.
    //    So 2600/3000/3840 could never be the right answer for anything on
    //    the site; they could only ever hand a near-native original to a box
    //    a third its size. 2048 covers the largest real case.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // `sizes` values given in px (rather than vw) make next/image emit the
    // FULL width list and let the browser pick — so the only thing that
    // decides how many bytes a grid tile costs is whether a candidate exists
    // near the width it actually needs. Grid tiles are 141-215px CSS, i.e.
    // ~282-430px at DPR 2 and ~423-645px at DPR 3. Without 448/512 in this
    // list the next candidate up from 430 was 640 — a 2x pixel overshoot on
    // every tile of the feed, which is what made the home page so heavy.
    // All stay below deviceSizes[0] (640), as next/image requires.
    //
    // 16/32/64 went the same way as the giant end of `deviceSizes`: nothing
    // on the site is smaller than a 40px lightbox thumbnail, which needs 48
    // at DPR 1, 96 at DPR 2 and 128 at DPR 3. A candidate no layout can ask
    // for is pure srcset weight on every <img> in the document.
    imageSizes: [48, 96, 128, 256, 384, 448, 512],
    loader: 'custom',
    loaderFile: './src/utils/image-loader.ts',
    // 75 for grid tiles and thumbnails, 80 for the lightbox hero. Every
    // allowed value is another distinct object at the origin, so this list
    // stays as short as what the site actually asks for — the same reasoning
    // as the width lists above. 90 is gone: nothing renders at it any more.
    // (The OpenGraph urls still request q=90, but they are hand-built strings
    // that bypass next/image, so this list does not govern them.)
    qualities: [75, 80],
  },
  async redirects() {
    return [
      {
        source: "/galleries",
        destination: "/collections",
        permanent: true,
      },
      ...KEPT_SLUGS.map((slug) => ({
        source: `/galleries/${slug}`,
        destination: `/collections/${slug}`,
        permanent: true,
      })),
      ...RETIRED_SLUGS.map((slug) => ({
        source: `/galleries/${slug}`,
        destination: "/collections",
        permanent: true,
      })),
      {
        source: "/index",
        destination: "/collections",
        permanent: true,
      },
      {
        source: "/index/:slug",
        destination: "/collections/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
