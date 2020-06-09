import {
  BlendFunction,
  EffectPass,
  TextureEffect,
  SavePass,
  ScanlineEffect,
  GlitchEffect,
  HueSaturationEffect,
} from 'postprocessing';

import {
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  DirectionalLight,
} from 'three';
import { webcamEffect, renderPass } from '../setup';

import { faceGeometry, metrics } from '../faceMesh';
import { ColorOverlayEffect } from '../effects/ColorOverlayEffect';

export class Cyborg {
  constructor({ composer, scene }) {
    this.dLight = new DirectionalLight();
    this.dLight.position.set(1, 1, 1);
    scene.add(this.dLight);

    const shinyMat = new MeshStandardMaterial({
      metalness: 1,
      roughness: 0.5,
      color: 0xffffff,
    });
    this.wireMat = new MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      opacity: 0.2,
      transparent: true,
    });
    this.shinyMesh = new Mesh(faceGeometry, shinyMat);
    this.wireMesh = new Mesh(faceGeometry, this.wireMat);

    scene.add(this.shinyMesh);
    scene.add(this.wireMesh);

    const renderSavePass = new SavePass();

    const renderTexture = new TextureEffect({
      texture: renderSavePass.renderTarget.texture,
      blendFunction: BlendFunction.LIGHTEN,
    });

    const scanlineEffect = new ScanlineEffect();
    scanlineEffect.blendMode.opacity.value = 0.1;

    const glitchEffect = new GlitchEffect();

    const hueSaturationEffect = new HueSaturationEffect({
      saturation: -1,
    });

    const colorOverlayEffect = new ColorOverlayEffect();

    const combineTexturesPass = new EffectPass(
      null,
      webcamEffect,
      renderTexture,
      hueSaturationEffect,
      colorOverlayEffect,
      glitchEffect,
      scanlineEffect
    );

    composer.addPass(renderPass);
    composer.addPass(renderSavePass);
    composer.addPass(combineTexturesPass);
  }

  update({ elapsedS }) {
    const s = 1 + metrics.mouthOpenness;
    this.wireMesh.scale.set(s, s, s);

    this.dLight.position.y = Math.sin(elapsedS);
    this.dLight.position.x = Math.cos(elapsedS);

    this.wireMat.opacity = metrics.mouthOpenness + 0.2;
  }
}
