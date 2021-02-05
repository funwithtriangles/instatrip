import {
  EffectPass,
  SavePass,
  TextureEffect,
  BlendFunction,
  MaskPass,
  ClearMaskPass,
} from 'postprocessing';

import { Mesh, MeshBasicMaterial, TextureLoader } from 'three';
import { orthCam, renderPass, webcamEffect } from '../setup';

import { faceGeometry, metrics } from '../faceMesh';
import { MeltEffect } from '../effects/MeltEffect';

import eyesMouthUrl from '../assets/eyes_mouth_inverted.png';

const eyesMouthTex = new TextureLoader().load(eyesMouthUrl);
const mat = new MeshBasicMaterial({
  map: eyesMouthTex,
  transparent: true,
});

export class Melt {
  constructor({ composer, scene }) {
    // Add mesh with head outline
    const mesh = new Mesh(faceGeometry, mat);
    scene.add(mesh);

    // Setup all the passes used below
    const headMaskPass = new MaskPass(scene, orthCam);
    const clearMaskPass = new ClearMaskPass();

    const camPass = new EffectPass(null, webcamEffect);

    const saveMeltPass = new SavePass();
    const saveFeaturesPass = new SavePass();

    this.meltEffect = new MeltEffect({
      prevFrameTex: saveMeltPass.renderTarget.texture,
      featuresTex: saveFeaturesPass.renderTarget.texture,
      frame: 0,
    });

    const meltEffectPass = new EffectPass(null, this.meltEffect);

    const meltTexEffect = new TextureEffect({
      texture: saveMeltPass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const overlayMeltPass = new EffectPass(null, webcamEffect, meltTexEffect);

    composer.addPass(renderPass);
    composer.addPass(saveFeaturesPass);
    // Mask head
    composer.addPass(headMaskPass);
    // Render camera
    composer.addPass(camPass);
    // Clear mask
    composer.addPass(clearMaskPass);
    // Do melt effect
    composer.addPass(meltEffectPass);
    // Save frame to be fed into next frame
    composer.addPass(saveMeltPass);
    // Render webcam image and overlay melt
    composer.addPass(overlayMeltPass);

    this.frame = 0;
  }

  update() {
    this.meltEffect.uniforms.get('frame').value = this.frame;

    this.meltEffect.uniforms.get('noiseStrength').value =
      5 + metrics.mouthOpenness * 10;

    this.meltEffect.uniforms.get('featuresStrength').value =
      metrics.mouthOpenness * 2;

    this.frame++;
  }
}
