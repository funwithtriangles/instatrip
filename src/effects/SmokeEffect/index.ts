import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Texture, Vector3, Vector2 } from 'three';

import fragment from './shader.frag';

interface SmokeEffectProps {
  prevFrameTex: Texture;
  smokeColorHSL: Vector3;
  frame: number;
  smokeTextureAmp: number;
  smokeVelocity: Vector2;
  smokeDecay: number;
  smokeRot: number;
}

export class SmokeEffect extends Effect {
  constructor({
    prevFrameTex,
    frame,
    smokeColorHSL,
    smokeTextureAmp,
    smokeVelocity,
    smokeDecay,
    smokeRot,
  }: SmokeEffectProps) {
    super('SmokeEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['prevFrameTex', new Uniform(prevFrameTex)],
        ['frame', new Uniform(frame)],
        ['smokeColorHSL', new Uniform(smokeColorHSL)],
        ['smokeTextureAmp', new Uniform(smokeTextureAmp)],
        ['smokeVelocity', new Uniform(smokeVelocity)],
        ['smokeDecay', new Uniform(smokeDecay)],
        ['smokeRot', new Uniform(smokeRot)],
      ]),
    });
  }
}
