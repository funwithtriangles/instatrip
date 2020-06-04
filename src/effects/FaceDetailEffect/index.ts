import { Uniform, Texture } from 'three';
import { Effect, BlendFunction } from 'postprocessing';

import fragment from './shader.frag';

interface FaceDetailEffectProps {
  camTexture: Texture;
  maskTexture: Texture;
}

export class FaceDetailEffect extends Effect {
  constructor({ camTexture, maskTexture }: FaceDetailEffectProps) {
    super('FaceDetailEffect', fragment, {
      blendFunction: BlendFunction.ALPHA,
      uniforms: new Map([
        ['camTexture', new Uniform(camTexture)],
        ['maskTexture', new Uniform(maskTexture)],
      ]),
    });
  }
}
