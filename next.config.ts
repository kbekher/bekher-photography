import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd14lj85n4pdzvr.cloudfront.net',
        port: '',
        pathname: '/**', // Allows all images from this hostname
      },
    ],
  },
};

export default nextConfig;
