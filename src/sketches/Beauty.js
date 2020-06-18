import {
  EffectPass,
  SavePass,
  BlurPass,
  KernelSize,
  RenderPass,
  BloomEffect,
  HueSaturationEffect,
  ClearPass,
} from 'postprocessing';

import { Mesh, MeshBasicMaterial, TextureLoader, Scene } from 'three';
import { webcamEffect, renderPass, persCam, orthCam } from '../setup';
import { FaceDetailEffect } from '../effects/FaceDetailEffect';

import { faceGeometry } from '../faceMesh';

import highlightsUrl from '../assets/face_highlights.jpg';
import heartsUrl from '../assets/hearts.png';
import eyesUrl from '../assets/eyes.jpg';

export class Beauty {
  constructor({ composer, scene }) {
    /* Highlights mask */
    const highlightsTex = new TextureLoader().load(highlightsUrl);
    const mat = new MeshBasicMaterial({
      map: highlightsTex,
    });

    this.mesh = new Mesh(faceGeometry, mat);

    scene.add(this.mesh);

    const clearDepthPass = new ClearPass(false, true);

    const highlightsSavePass = new SavePass();

    /* Blurred face */
    const camPass = new EffectPass(null, webcamEffect);
    const blurPass = new BlurPass({
      scale: 0.1,
      kernelSize: KernelSize.SMALL,
    });

    const blurSavePass = new SavePass();

    /* Eyes mask */
    const eyesTex = new TextureLoader().load(eyesUrl);
    const eyesScene = new Scene();
    eyesScene.background = 0x00000;
    const eyesMat = new MeshBasicMaterial({
      map: eyesTex,
    });
    const eyesMesh = new Mesh(faceGeometry, eyesMat);
    eyesScene.add(eyesMesh);

    /* Saturated cam (for eyes) */
    const satCamPass = new EffectPass(null, webcamEffect);
    const satEffect = new HueSaturationEffect({
      saturation: 2,
    });
    const satPass = new EffectPass(null, satEffect);
    const satSavePass = new SavePass();

    const eyesRenderPass = new RenderPass(eyesScene, orthCam);

    const eyesSavePass = new SavePass();

    /* Hearts */
    const heartsTex = new TextureLoader().load(heartsUrl);
    const heartsScene = new Scene();
    const heartsMat = new MeshBasicMaterial({
      transparent: true,
      map: heartsTex,
    });
    const heartsMesh = new Mesh(faceGeometry, heartsMat);
    heartsScene.add(heartsMesh);

    const heartsRenderPass = new RenderPass(heartsScene, orthCam);
    heartsRenderPass.clear = false;

    /* Combining  */
    const highlightsAddEffect = new FaceDetailEffect({
      camTexture: blurSavePass.renderTarget.texture,
      maskTexture: highlightsSavePass.renderTarget.texture,
    });

    const eyesAddEffect = new FaceDetailEffect({
      camTexture: satSavePass.renderTarget.texture,
      maskTexture: eyesSavePass.renderTarget.texture,
      invert: true,
    });

    const bloomEffect = new BloomEffect({
      luminanceThreshold: 0.3,
      luminanceSmoothing: 0.5,
      intensity: 1,
    });

    const hueSaturationEffect = new HueSaturationEffect({
      saturation: 2,
      hue: 2.5,
    });

    const combineTexturesPass = new EffectPass(
      null,
      webcamEffect,
      highlightsAddEffect,
      eyesAddEffect,
      bloomEffect
    );

    const colorsPass = new EffectPass(null, hueSaturationEffect);

    composer.addPass(renderPass);
    composer.addPass(highlightsSavePass);
    // composer.addPass(eyesRenderPass);
    // composer.addPass(eyesSavePass);
    // composer.addPass(satCamPass);
    // composer.addPass(satPass);
    // composer.addPass(satSavePass);
    composer.addPass(camPass);
    composer.addPass(blurPass);
    composer.addPass(blurSavePass);
    composer.addPass(combineTexturesPass);
    composer.addPass(clearDepthPass);
    composer.addPass(heartsRenderPass);
    composer.addPass(colorsPass);
  }

  update() {}
}
