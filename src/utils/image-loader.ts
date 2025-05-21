import { ImageLoader } from 'next/image';

const imageLoader: ImageLoader = ({ src, width, quality }) => {
  // Extract the path from the full URL
  const url = new URL(src);
  const path = url.pathname;
  
  // Round width to nearest 100 to reduce number of transformations
  const roundedWidth = Math.round(width / 100) * 100;
  
  // Optimize for size and performance
  return `https://d14lj85n4pdzvr.cloudfront.net${path}?w=${roundedWidth}&q=${quality || 60}&format=webp&cache=31536000`;
};

export default imageLoader;
