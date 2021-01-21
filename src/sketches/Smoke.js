import {
  EffectPass,
  ScanlineEffect,
  GlitchEffect,
  HueSaturationEffect,
  ColorDepthEffect,
  MaskPass,
  ClearPass,
  BlurPass,
  KernelSize,
  ClearMaskPass,
  Effect,
  SavePass,
  TextureEffect,
  BlendFunction,
} from 'postprocessing';

import { Mesh, MeshBasicMaterial, Color, Texture } from 'three';
import { renderPass, webcamEffect, orthCam } from '../setup';

import { faceGeometry, metrics } from '../faceMesh';
import { ColorOverlayEffect } from '../effects/ColorOverlayEffect';
import { ShiftEffect } from '../effects/ShiftEffect';
import { camTexture } from '../webcam';
import { FaceDetailEffect } from '../effects/FaceDetailEffect';

const mat = new MeshBasicMaterial({ color: 0x000000 });

export class Smoke {
  constructor({ composer, scene }) {
    /* Mask mesh */
    const mesh = new Mesh(faceGeometry, mat);
    scene.add(mesh);

    const clearPass = new ClearPass();
    const maskPass = new MaskPass(scene, orthCam);
    const clearMaskPass = new ClearMaskPass();

    const saveMaskPass = new SavePass();

    const camPass = new EffectPass(null, webcamEffect);

    const faceSoloEffect = new TextureEffect({
      texture: saveMaskPass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const saveShiftPass = new SavePass();

    const shiftEffect = new ShiftEffect({
      prevFrameTex: saveMaskPass.renderTarget.texture,
    });

    const shiftEffectPass = new EffectPass(null, shiftEffect);

    const tempTexEffect = new TextureEffect({
      texture: saveShiftPass.renderTarget.texture,
    });
    const tempTexPass = new EffectPass(null, tempTexEffect);

    const soloFacePass = new EffectPass(null, faceSoloEffect);

    // Solo out face and save it
    composer.addPass(maskPass);
    composer.addPass(camPass);
    composer.addPass(clearMaskPass);
    composer.addPass(saveMaskPass);

    composer.addPass(clearPass);

    // Render face texture with fading and shifting
    composer.addPass(shiftEffectPass);
    // Paint masked face on top
    composer.addPass(soloFacePass);
  }

  update({ elapsedS }) {}
}
