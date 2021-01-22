import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Texture } from 'three';

import fragment from './shader.frag';

interface ShiftEffectProps {
  prevFrameTex: Texture;
}

export class ShiftEffect extends Effect {
  constructor({ prevFrameTex }: ShiftEffectProps) {
    super('ShiftEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([['prevFrameTex', new Uniform(prevFrameTex)]]),
    });
  }
}
