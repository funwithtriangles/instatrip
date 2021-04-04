import { EffectPass } from 'postprocessing';

import { Mesh, TextureLoader, ShaderMaterial } from 'three';

import { renderPass, webcamEffect } from '../setup';

import { faceGeometry } from '../faceMesh';

import faceHighlightsUrl from '../assets/face_highlights.jpg';

import vert from '../glsl/noise/vertex.glsl';
import frag from '../glsl/noise/fragment.glsl';

// Soft edges of face texture
const faceHighlightsTex = new TextureLoader().load(faceHighlightsUrl);

export class Noise {
  constructor({ composer, scene }) {
    this.mat = new ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        faceHighlightsTex: { value: faceHighlightsTex },
      },
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true, // Important to blend with webcam behind using alpha in shader
    });

    // Add mesh with ShaderMaterial
    const mesh = new Mesh(faceGeometry, this.mat);
    scene.add(mesh);

    // Setup all the passes used below
    const camPass = new EffectPass(null, webcamEffect);

    // Need these settings to stop buffers getting cleared, etc
    camPass.renderToScreen = true;
    renderPass.renderToScreen = true;
    renderPass.clear = false;

    composer.addPass(camPass); // Webcam background
    composer.addPass(renderPass); // Shader mesh
  }

  update({ elapsedS }) {
    this.mat.uniforms.time.value = elapsedS;
  }
}
