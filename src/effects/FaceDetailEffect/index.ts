import { Uniform, Texture } from 'three';
import { Effect, BlendFunction } from 'postprocessing';

import fragment from './shader.frag';

interface FaceDetailEffectProps {
  camTexture: Texture;
  maskTexture: Texture;
  invert: boolean;
}

export class FaceDetailEffect extends Effect {
  constructor({ camTexture, maskTexture, invert }: FaceDetailEffectProps) {
    super('FaceDetailEffect', fragment, {
      blendFunction: BlendFunction.ALPHA,
      uniforms: new Map([
        ['camTexture', new Uniform(camTexture)],
        ['maskTexture', new Uniform(maskTexture)],
        ['invert', new Uniform(invert)],
      ]),
    });
  }
}
