import { ImageLoader } from 'next/image';

const imageLoader: ImageLoader = ({ src, width }) => {
  // Extract the path from the full URL
  const url = new URL(src);
  const path = url.pathname;
  
  // Round width to nearest 100 to reduce number of transformations
  const roundedWidth = Math.round(width / 100) * 100;
  
  // Reduce quality and add blur parameter for better performance
  return `https://d14lj85n4pdzvr.cloudfront.net${path}?w=${roundedWidth}&format=webp&blur=10`;
};

export default imageLoader;
