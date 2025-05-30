import { DOMAIN } from '@/constants/constants';
import { ImageLoader } from 'next/image';

const ALLOWED_WIDTHS = [256, 384, 640, 828, 1080, 1200];

const imageLoader: ImageLoader = ({ src, width }) => {
  // Extract the path from the full URL
  const url = new URL(src);
  const path = url.pathname;

  // Find the closest allowed width that is >= requested width
  const suitableWidth = ALLOWED_WIDTHS.find(w => w >= width);

  if (suitableWidth) {
    const baseName = path.replace(/\.\w+$/, ''); // remove extension
    return `${DOMAIN}${baseName}-${suitableWidth}.jpg`;
  }

  // If requested width is greater than all allowed sizes, return original (full-size) image
  return `${DOMAIN}${path}`;
};

export default imageLoader;
