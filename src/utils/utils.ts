export const computeDimensions = (aspectRatio: string, baseWidth: number) => {
  const [widthRatio, heightRatio] = aspectRatio.split('/').map(Number);
  const width = baseWidth;
  const height = (baseWidth * heightRatio) / widthRatio;
  return { width, height };
};

