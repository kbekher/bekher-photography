import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd14lj85n4pdzvr.cloudfront.net',
        port: '',
        pathname: '/**', // Allows all images from this hostname
      },
    ],
    loader: 'custom',
    loaderFile: './src/utils/image-loader.ts', 
  },
};

export default nextConfig;
