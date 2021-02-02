import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Texture } from 'three';

import fragment from './shader.frag';

interface DisplacementEffectProps {
  displacementTex: Texture;
}

export class DisplacementEffect extends Effect {
  constructor({ displacementTex }: DisplacementEffectProps) {
    super('MeltEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([['displacementTex', new Uniform(displacementTex)]]),
    });
  }
}
