import {
  EffectPass,
  SavePass,
  TextureEffect,
  BlendFunction,
} from 'postprocessing';

import { Mesh, MeshBasicMaterial, TextureLoader } from 'three';
import { renderPass, webcamEffect } from '../setup';

import { faceGeometry, metrics } from '../faceMesh';
import { DriftEffect } from '../effects/DriftEffect';

import eyesMouthUrl from '../assets/eyes_mouth_inverted.png';
import { clamp } from '../utils/clamp';

export const easeFunc = t => t * t;

const eyesMouthTex = new TextureLoader().load(eyesMouthUrl);
const mat = new MeshBasicMaterial({
  map: eyesMouthTex,
  transparent: true,
});

export class Drift {
  constructor({ composer, scene }) {
    // Add mesh with head outline
    const mesh = new Mesh(faceGeometry, mat);
    scene.add(mesh);

    // Setup all the passes used below
    const camPass = new EffectPass(null, webcamEffect);

    const saveDriftPass = new SavePass();
    const saveFeaturesPass = new SavePass();

    this.driftEffect = new DriftEffect({
      prevFrameTex: saveDriftPass.renderTarget.texture,
      featuresTex: saveFeaturesPass.renderTarget.texture,
      frame: 0,
    });

    const driftEffectPass = new EffectPass(null, this.driftEffect);

    const driftTexEffect = new TextureEffect({
      texture: saveDriftPass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const overlayDriftPass = new EffectPass(null, webcamEffect, driftTexEffect);

    composer.addPass(renderPass);
    composer.addPass(saveFeaturesPass);
    // Render camera
    composer.addPass(camPass);
    // Do melt effect
    composer.addPass(driftEffectPass);
    // Save frame to be fed into next frame
    composer.addPass(saveDriftPass);
    // Render webcam image and overlay melt
    composer.addPass(overlayDriftPass);

    this.frame = 0;
    this.checkTime = 0;
    this.prevLength = metrics.track.position.lengthSq();
    this.motion = 1;
    this.drift = 0;
    this.mask = 1;
  }

  update({ elapsedS, deltaFPS }) {
    if (elapsedS - this.checkTime > 0.1) {
      // Roughly calculate motion every 0.1s
      // TODO: Distance will be greater if face is nearer to camera
      const currLength = metrics.track.position.lengthSq();
      this.motion =
        Math.abs(currLength / this.prevLength - 1) + metrics.mouthOpenness;
      this.prevLength = currLength;
      this.checkTime = elapsedS;
    }

    let easedDrift;

    if (this.motion < 0.1) {
      this.drift = clamp(this.drift + 0.004 * deltaFPS, 0, 1);
      // Quickly hide the mask when we want to slowly melt
      this.mask = clamp(this.mask + 0.04 * deltaFPS, -1, 1);
      easedDrift = easeFunc(this.drift);
    } else {
      // Slowly bring in the mask when we want to fade in the cam
      this.mask = clamp(this.mask - 0.02 * deltaFPS, -1, 1);
      this.drift = clamp(this.drift - 0.01 * deltaFPS, 0, 1);
      easedDrift = this.drift;
    }

    this.driftEffect.uniforms.get('driftAmp').value = easedDrift;
    this.driftEffect.uniforms.get('maskAmp').value = this.mask;
    this.driftEffect.uniforms.get('frame').value = this.frame;

    this.frame++;
  }
}
