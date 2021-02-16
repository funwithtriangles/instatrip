import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Texture } from 'three';

import fragment from './shader.frag';

interface DriftEffectProps {
  prevFrameTex: Texture;
  featuresTex: Texture;
  headTex: Texture;
  driftAmp: number;
  maskAmp: number;
  frame: number;
}

export class DriftEffect extends Effect {
  constructor({
    prevFrameTex,
    featuresTex,
    driftAmp,
    maskAmp,
    frame,
  }: DriftEffectProps) {
    super('DriftEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['prevFrameTex', new Uniform(prevFrameTex)],
        ['featuresTex', new Uniform(featuresTex)],
        ['driftAmp', new Uniform(driftAmp)],
        ['maskAmp', new Uniform(maskAmp)],
        ['frame', new Uniform(frame)],
      ]),
    });
  }
}
