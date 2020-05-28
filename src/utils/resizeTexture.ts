import { VideoTexture } from 'three';
import { getResizeFactors } from './getResizeFactors';

export const resizeTexture = (
  texture: VideoTexture,
  dWidth: number,
  dHeight: number,
  sWidth: number,
  sHeight: number
) => {
  texture.center.set(0.5, 0.5);

  const { x, y } = getResizeFactors(dWidth, dHeight, sWidth, sHeight);

  texture.repeat.x = x;
  texture.repeat.y = y;
};
