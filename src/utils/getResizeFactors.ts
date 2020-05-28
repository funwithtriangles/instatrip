export const getResizeFactors = (
  dWidth: number,
  dHeight: number,
  sWidth: number,
  sHeight: number
) => {
  let x;
  let y;

  if (sWidth > sHeight) {
    // Landscape
    x = (dWidth / sWidth) * (sHeight / dHeight);
    y = 1;
  } else {
    // Portrait
    x = 1;
    y = (sWidth / dWidth) * (dHeight / sHeight);
  }

  return { x, y };
};
