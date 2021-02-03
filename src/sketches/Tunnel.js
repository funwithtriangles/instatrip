import { EffectPass } from 'postprocessing';

import { Mesh, TextureLoader, ShaderMaterial, Vector3 } from 'three';

import { renderPass, webcamEffect } from '../setup';

import { faceGeometry } from '../faceMesh';
import { camTextureFlipped } from '../webcam';

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
      },

      vertexShader: vert,
      fragmentShader: frag,
      // wireframe: true,
    });

    // Add mesh with face as texture
    const mesh = new Mesh(faceGeometry, this.mat);
    scene.add(mesh);

    // Setup all the passes used below

    const camPass = new EffectPass(null, webcamEffect);

    camPass.renderToScreen = true;
    renderPass.renderToScreen = true;
    renderPass.clear = false;

    // composer.addPass(camPass);
    composer.addPass(renderPass);
  }

  update({ elapsedS }) {
    this.mat.uniforms.time.value = elapsedS;
  }
}
