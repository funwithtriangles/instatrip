import { EffectPass, SavePass } from 'postprocessing';

import { Mesh, TextureLoader, ShaderMaterial } from 'three';

import { renderPass } from '../setup';

import { faceGeometry, metrics } from '../faceMesh';
import { camTextureFlipped } from '../webcam';

import { TunnelEffect } from '../effects/TunnelEffect';

import eyesDisplacementUrl from '../assets/eyes_displacement.png';

import vert from '../glsl/texDisplace/vertex.glsl';
import frag from '../glsl/texDisplace/fragment.glsl';

const dispTex = new TextureLoader().load(eyesDisplacementUrl);

export class Tunnel {
  constructor({ composer, scene }) {
    this.mat = new ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        camTex: { value: camTextureFlipped },
        dispTex: { value: dispTex },
        masterDisp: { value: 1 },
      },

      vertexShader: vert,
      fragmentShader: frag,
      // wireframe: true,
    });

    // Add mesh with face as texture
    const mesh = new Mesh(faceGeometry, this.mat);
    scene.add(mesh);

    // Setup all the passes used below
    const saveFacePass = new SavePass();
    const saveAllPass = new SavePass();
    const finalSavePass = new SavePass();

    const tunnelEffect = new TunnelEffect({
      prevFrameTex: saveAllPass.renderTarget.texture,
    });

    const tunnelPass = new EffectPass(null, tunnelEffect);

    finalSavePass.renderToScreen = true;

    composer.addPass(renderPass);
    composer.addPass(saveFacePass);
    composer.addPass(tunnelPass);
    composer.addPass(saveAllPass);
    composer.addPass(finalSavePass);
  }

  update({ elapsedS }) {
    this.mat.uniforms.time.value = elapsedS;
    this.mat.uniforms.masterDisp.value = metrics.zed / metrics.zed / 2.5;
  }
}
