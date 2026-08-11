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
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
