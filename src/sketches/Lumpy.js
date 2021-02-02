import { EffectPass } from 'postprocessing';

import { Mesh, TextureLoader, ShaderMaterial } from 'three';

import { renderPass, webcamEffect } from '../setup';

import { faceGeometry } from '../faceMesh';
import { camTextureFlipped } from '../webcam';

import faceHighlightsUrl from '../assets/face_highlights.jpg';

import vert from '../glsl/faceBulge/vertex.glsl';
import frag from '../glsl/faceBulge/fragment.glsl';

const faceHighlightsTex = new TextureLoader().load(faceHighlightsUrl);

export class Lumpy {
  constructor({ composer, scene }) {
    this.mat = new ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        camTex: { value: camTextureFlipped },
        fadeHighlightsTex: { value: faceHighlightsTex },
      },

      vertexShader: vert,
      fragmentShader: frag,
    });

    // Add mesh with face as texture
    const mesh = new Mesh(faceGeometry, this.mat);
    scene.add(mesh);

    // Setup all the passes used below

    const camPass = new EffectPass(null, webcamEffect);

    camPass.renderToScreen = true;
    renderPass.renderToScreen = true;
    renderPass.clear = false;

    composer.addPass(camPass);
    composer.addPass(renderPass);
  }

  update({ elapsedS }) {
    this.mat.uniforms.time.value = elapsedS;
  }
}
