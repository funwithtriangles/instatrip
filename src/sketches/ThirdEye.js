import {
  EffectPass,
  SavePass,
  TextureEffect,
  BlendFunction,
  MaskPass,
  ClearMaskPass,
} from 'postprocessing';

import {
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
import { orthCam, renderPass, webcamEffect } from '../setup';

import { faceGeometry, metrics } from '../faceMesh';
import { DriftEffect } from '../effects/DriftEffect';

import eyesMouthUrl from '../assets/eyes_mouth_inverted.png';

const eyesMouthTex = new TextureLoader().load(eyesMouthUrl);
const mat = new MeshBasicMaterial({
  map: eyesMouthTex,
  transparent: true,
});

export class ThirdEye {
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

    this.meltEffect = new DriftEffect({
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
    // Render camera
    composer.addPass(camPass);
    // Do melt effect
    composer.addPass(meltEffectPass);
    // Save frame to be fed into next frame
    composer.addPass(saveMeltPass);
    // Render webcam image and overlay melt
    composer.addPass(overlayMeltPass);

    this.frame = 0;
    this.checkFrame = 0;
    this.prevLength = metrics.track.position.lengthSq();
    this.motion = 1;
  }

  update({ elapsedS }) {
    if (this.checkFrame > 10) {
      const currLength = metrics.track.position.lengthSq();
      this.motion =
        Math.abs(currLength / this.prevLength - 1) + metrics.mouthOpenness;
      this.prevLength = currLength;
      this.checkFrame = 0;
    }

    if (this.motion > 0.2) {
      if (this.moveStartTime === undefined) {
        // If motion is above threshold, start timer
        this.moveStartTime = elapsedS;
      } else if (elapsedS - this.moveStartTime > 1) {
        const m = (elapsedS - this.moveStartTime - 1) / 10;
        // If movement is longer than a second, stop drift
        this.meltEffect.uniforms.get('driftAmp').value = Math.max(1 - m, 0);
        // also need to cancel freeze timer
        this.freezeStartTime = undefined;
      }
    } else {
      // if motion is below threshold, cancel movement timer
      this.moveStartTime = undefined;
      if (this.freezeStartTime === undefined) {
        // start freeze timer
        this.freezeStartTime = elapsedS;
      } else if (elapsedS - this.freezeStartTime > 2) {
        const drift = (elapsedS - this.freezeStartTime - 2) / 10;
        // If frozen for longer than X seconds, start drift
        this.meltEffect.uniforms.get('driftAmp').value = Math.min(
          0.6 + drift,
          1
        );
      }
    }

    this.meltEffect.uniforms.get('frame').value = this.frame;

    this.checkFrame++;
    this.frame++;
  }
}
