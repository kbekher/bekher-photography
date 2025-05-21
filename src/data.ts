// /data/galleryConfig.ts

export const horizontal = "3/2";
export const vertical = "2/3";

export interface PhotoMetadata {
  aspectRatio: string;
  path: string;
}

export const galleriesData = {
  bw: {
    name: "Black and White Collection",
    description: "A beautiful collection of black and white photographs.",
    photos: [
      { aspectRatio: vertical, path: "bw-1.jpg" },
      { aspectRatio: horizontal, path: "bw-2.jpg" },
      { aspectRatio: horizontal, path: "bw-3.jpg" },
      { aspectRatio: horizontal, path: "bw-4.jpg" },
      { aspectRatio: horizontal, path: "bw-5.jpg" },
      { aspectRatio: horizontal, path: "bw-6.jpg" },
    ] as PhotoMetadata[],
  },
  alps: {
    name: "Swiss Alps Collection",
    description: "A beautiful collection of Swiss Alps photographs.",
    photos: [
      { aspectRatio: vertical, path: "alps-1.jpg" },
      { aspectRatio: horizontal, path: "alps-2.jpg" },
      { aspectRatio: vertical, path: "alps-3.jpg" },
      { aspectRatio: horizontal, path: "alps-4.jpg" },
      { aspectRatio: vertical, path: "alps-5.jpg" },
      { aspectRatio: vertical, path: "alps-6.jpg" },
      { aspectRatio: horizontal, path: "alps-7.jpg" },
    ] as PhotoMetadata[],
  },
  purple: {
    name: "Purple Collection",
    description: "A collection focused on purple hues and stunning landscapes.",
    photos: [
      { aspectRatio: vertical, path: "purple-1.jpg" },
      { aspectRatio: horizontal, path: "purple-2.jpg" },
      // { aspectRatio: horizontal, path: "purple-3.jpg" },
      { aspectRatio: vertical, path: "purple-4.jpg" },
      { aspectRatio: horizontal, path: "purple-5.jpg" },
      { aspectRatio: horizontal, path: "purple-6.jpg" },
      // { aspectRatio: horizontal, path: "purple-7.jpg" },
      { aspectRatio: horizontal, path: "purple-8.jpg" },
      { aspectRatio: vertical, path: "purple-9.jpg" },
    ] as PhotoMetadata[],
  },
  nature: {
    name: "Nature Collection",
    description: "A beautiful collection of nature photographs.",
    photos: [
      { aspectRatio: vertical, path: "nature-1.jpg" },
      { aspectRatio: horizontal, path: "nature-2.jpg" },
      { aspectRatio: vertical, path: "nature-3.jpg" },
      { aspectRatio: vertical, path: "nature-4.jpg" },
      { aspectRatio: vertical, path: "nature-5.jpg" },
      { aspectRatio: horizontal, path: "nature-6.jpg" },
      { aspectRatio: vertical, path: "nature-7.jpg" },
      { aspectRatio: vertical, path: "nature-8.jpg" },
    ] as PhotoMetadata[],
  },
  travel: {
    name: "Travel Collection",
    description: "A collection of travel moments from around the world.",
    photos: [
      { aspectRatio: vertical, path: "travel-1.jpg" },
      { aspectRatio: vertical, path: "travel-2.jpg" },
      { aspectRatio: vertical, path: "travel-3.jpg" },
      // { aspectRatio: horizontal, path: "travel-4.jpg" },
      { aspectRatio: horizontal, path: "travel-6.jpg" },
      { aspectRatio: vertical, path: "travel-5.jpg" },
      { aspectRatio: vertical, path: "travel-7.jpg" },
      { aspectRatio: horizontal, path: "travel-8.jpg" },
      { aspectRatio: vertical, path: "travel-9.jpg" },
      // { aspectRatio: vertical, path: "travel-10.jpg" },
      // { aspectRatio: horizontal, path: "travel-11.jpg" },
      // { aspectRatio: horizontal, path: "travel-12.jpg" },
    ] as PhotoMetadata[],
  },
  people: {
    name: "People Collection",
    description: "A portrait collection capturing people in various settings.",
    photos: [
      { aspectRatio: vertical, path: "people-1.jpg" },
      { aspectRatio: horizontal, path: "people-2.jpg" },
      { aspectRatio: horizontal, path: "people-3.jpg" },
      { aspectRatio: vertical, path: "people-4.jpg" },
      // { aspectRatio: horizontal, path: "people-5.jpg" },
      // { aspectRatio: vertical, path: "people-6.jpg" },
      { aspectRatio: horizontal, path: "people-7.jpg" },
      { aspectRatio: horizontal, path: "people-8.jpg" },
      { aspectRatio: horizontal, path: "people-9.jpg" },
    ] as PhotoMetadata[],
  },

  pentax: {
    name: "Pentax 17 Collection",
    description: "A collection of picture made on Pentax 17.",
    photos: [
      { aspectRatio: vertical, path: "pentax-1.jpg" },
      { aspectRatio: vertical, path: "pentax-2.jpg" },
      { aspectRatio: vertical, path: "pentax-3.jpg" },
      { aspectRatio: vertical, path: "pentax-4.jpg" },
      { aspectRatio: vertical, path: "pentax-5.jpg" },
      { aspectRatio: vertical, path: "pentax-6.jpg" },
      { aspectRatio: vertical, path: "pentax-7.jpg" },
      { aspectRatio: vertical, path: "pentax-8.jpg" },
    ] as PhotoMetadata[],
  },
};
