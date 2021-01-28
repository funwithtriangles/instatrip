import {
  EffectPass,
  BlurPass,
  KernelSize,
  SavePass,
  TextureEffect,
  BlendFunction,
} from 'postprocessing';

import { Mesh, MeshBasicMaterial, TextureLoader } from 'three';
import { renderPass, webcamEffect } from '../setup';

import { faceGeometry } from '../faceMesh';
import { SmokeEffect } from '../effects/SmokeEffect';

import eyesMouthUrl from '../assets/eyes_mouth_inverted.png';

const eyesMouthTex = new TextureLoader().load(eyesMouthUrl);
const mat = new MeshBasicMaterial({
  map: eyesMouthTex,
  transparent: true,
});

export class Smoke {
  constructor({ composer, scene }) {
    // Add mesh with eyes/mouth/nostrils texture
    const mesh = new Mesh(faceGeometry, mat);
    scene.add(mesh);

    // Setup all the passes used below
    const saveSmokePass = new SavePass();

    const smokeEffect = new SmokeEffect({
      prevFrameTex: saveSmokePass.renderTarget.texture,
    });

    const smokeEffectPass = new EffectPass(null, smokeEffect);

    const smokeTexEffect = new TextureEffect({
      texture: saveSmokePass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const overlaySmokePass = new EffectPass(null, webcamEffect, smokeTexEffect);

    const blurPass = new BlurPass({
      KernelSize: KernelSize.SMALL,
    });
    blurPass.scale = 0.2;

    // Render eyes, mouth, nostrils
    composer.addPass(renderPass);
    // Add previous frame and manipulate for smoke effect
    composer.addPass(smokeEffectPass);
    // Blur each frame
    composer.addPass(blurPass);
    // Save frame to be fed into next frame
    composer.addPass(saveSmokePass);
    // Render webcam image and overlay smoke
    composer.addPass(overlaySmokePass);
  }

  update() {}
}
