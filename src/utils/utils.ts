import { PhotoMetadata } from "@/data";

export const computeDimensions = (aspectRatio: string, baseWidth: number) => {
  const [widthRatio, heightRatio] = aspectRatio.split('/').map(Number);
  const width = baseWidth;
  const height = (baseWidth * heightRatio) / widthRatio;
  return { width, height };
};

export const getBestFitRow = (photos: { aspectRatio: string }[]) => {
  const maxCols = 12;
  let bestCombo: { photo: PhotoMetadata; index: number; colSpan: number }[] = [];
  let maxColsUsed = 0;

  for (let start = 0; start < photos.length; start++) {
    const combo: { photo: PhotoMetadata; index: number; colSpan: number }[] = [];
    let colsUsed = 0;

    for (let i = start; i < photos.length; i++) {
      const photo = photos[i];
      const isHorizontal = photo.aspectRatio === "3/2";
      const colSpan = isHorizontal ? 3 : 2;

      if (colsUsed + colSpan > maxCols) continue;

      combo.push({ photo, index: i, colSpan });
      colsUsed += colSpan;

      if (colsUsed === maxCols) return combo; // Perfect fit — exit early
    }

    // Keep the best (most full) combo found so far
    if (colsUsed > maxColsUsed) {
      bestCombo = combo;
      maxColsUsed = colsUsed;
    }

    // Early exit if perfect fit found
    if (maxColsUsed === maxCols) break;
  }

  return bestCombo;
};
