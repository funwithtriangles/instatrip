import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Texture } from 'three';

import fragment from './shader.frag';

interface TunnelEffectProps {
  prevFrameTex: Texture;
}

export class TunnelEffect extends Effect {
  constructor({ prevFrameTex }: TunnelEffectProps) {
    super('TunnelEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([['prevFrameTex', new Uniform(prevFrameTex)]]),
    });
  }
}
