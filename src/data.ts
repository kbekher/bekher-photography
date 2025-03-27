// /data/galleryConfig.ts

export const horizontal = "3/2";
export const vertical = "2/3";

export interface PhotoMetadata {
  aspectRatio: string;
}

export const galleriesData = {
  bw: {
    name: "Black and White Collection",
    description: "A beautiful collection of black and white photographs.",
    photos: [
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
    ] as PhotoMetadata[],
  },
  alps: {
    name: "Swiss Alps Collection",
    description: "A beautiful collection of Swiss Alps photographs.",
    photos: [
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
    ] as PhotoMetadata[],
  },
  nature: {
    name: "Nature Collection",
    description: "A beautiful collection of nature photographs.",
    photos: [
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
    ] as PhotoMetadata[],
  },
  purple: {
    name: "Purple Collection",
    description: "A collection focused on purple hues and stunning landscapes.",
    photos: [
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
    ] as PhotoMetadata[],
  },
  people: {
    name: "People Collection",
    description: "A portrait collection capturing people in various settings.",
    photos: [
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
    ] as PhotoMetadata[],
  },
  travel: {
    name: "Travel Collection",
    description: "A collection of travel moments from around the world.",
    photos: [
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: horizontal },
      { aspectRatio: horizontal },
    ] as PhotoMetadata[],
  },
  pentax: {
    name: "Pentax 17 Collection",
    description: "A collection of picture made on Pentax 17.",
    photos: [
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
      { aspectRatio: vertical },
    ] as PhotoMetadata[],
  },

};
