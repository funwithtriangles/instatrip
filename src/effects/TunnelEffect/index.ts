import { Effect, BlendFunction } from 'postprocessing';
import { Uniform, Texture } from 'three';

import fragment from './shader.frag';

interface MeltEffectProps {
  prevFrameTex: Texture;
  featuresTex: Texture;
  headTex: Texture;
  noiseStength: number;
  featuresStrength: number;
}

export class MeltEffect extends Effect {
  constructor({
    prevFrameTex,
    featuresTex,
    noiseStength,
    featuresStrength,
  }: MeltEffectProps) {
    super('MeltEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['prevFrameTex', new Uniform(prevFrameTex)],
        ['featuresTex', new Uniform(featuresTex)],
        ['noiseStrength', new Uniform(noiseStength)],
        ['featuresStrength', new Uniform(featuresStrength)],
      ]),
    });
  }
}
