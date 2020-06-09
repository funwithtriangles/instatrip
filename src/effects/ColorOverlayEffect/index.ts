import { Effect, BlendFunction } from 'postprocessing';

import fragment from './shader.frag';

export class ColorOverlayEffect extends Effect {
  constructor() {
    super('FaceDetailEffect', fragment, {
      blendFunction: BlendFunction.ALPHA,
      uniforms: new Map([]),
    });
  }
}
