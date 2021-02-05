import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Texture } from 'three';

import fragment from './shader.frag';

interface SmokeEffectProps {
  prevFrameTex: Texture;
  frame: number;
}

export class SmokeEffect extends Effect {
  constructor({ prevFrameTex, frame }: SmokeEffectProps) {
    super('SmokeEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['prevFrameTex', new Uniform(prevFrameTex)],
        ['frame', new Uniform(frame)],
      ]),
    });
  }
}
