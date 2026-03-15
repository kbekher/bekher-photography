import { LAMBDA_IMG_BASE } from "@/constants/constants";
import { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  const q = quality ?? 75;

  // Normalize src -> must become an S3 key path like /projects/seen-1.jpg
  // If src is a full URL, extract its pathname.
  let path;
  if (src.startsWith("http")) {
    const url = new URL(src);
    path = url.pathname;
  } else {
    path = src.startsWith("/") ? src : `/${src}`;
  }

  // Build: <lambda>/img/<path>?w=...&q=...&f=...
  // Your Lambda expects /img/<s3-key>, so we append the path directly after /img
  return `${LAMBDA_IMG_BASE}${path}?w=${width}&q=${q}&f=webp`;
}
