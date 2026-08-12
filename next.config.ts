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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2600, 3000, 3840],
    // `sizes` values given in px (rather than vw) make next/image emit the
    // FULL width list and let the browser pick — so the only thing that
    // decides how many bytes a grid tile costs is whether a candidate exists
    // near the width it actually needs. Grid tiles are 141-215px CSS, i.e.
    // ~282-430px at DPR 2 and ~423-645px at DPR 3. Without 448/512 in this
    // list the next candidate up from 430 was 640 — a 2x pixel overshoot on
    // every tile of the feed, which is what made the home page so heavy.
    // Both stay below deviceSizes[0] (640), as next/image requires.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 448, 512],
    loader: 'custom',
    loaderFile: './src/utils/image-loader.ts',
    qualities: [75, 90],
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
