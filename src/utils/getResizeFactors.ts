export const getResizeFactors = (
  dWidth: number,
  dHeight: number,
  sWidth: number,
  sHeight: number
) => {
  let x;
  let y;

  if (sWidth / sHeight > dWidth / dHeight) {
    // Source has wider aspect ratio than destination
    x = (dWidth / sWidth) * (sHeight / dHeight);
    y = 1;
  } else {
    // Source has narrower aspect ratio than destination
    x = 1;
    y = (sWidth / dWidth) * (dHeight / sHeight);
  }

  return { x, y };
};
