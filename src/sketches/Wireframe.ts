import {
  EffectComposer,
  BlendFunction,
  EffectPass,
  TextureEffect,
  SavePass,
} from 'postprocessing';

import {
  Mesh,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  MeshBasicMaterial,
} from 'three';
import { webcamEffect, renderPass } from '../setup';

import { faceGeometry } from '../faceMesh';

interface SketchConstructor {
  composer: EffectComposer;
  scene: Scene;
  persCam: PerspectiveCamera;
  orthCam: OrthographicCamera;
}

export class Wireframe {
  constructor({ composer, scene }: SketchConstructor) {
    const mat = new MeshBasicMaterial({ wireframe: true });
    const mesh = new Mesh(faceGeometry, mat);

    scene.add(mesh);

    const renderSavePass = new SavePass();

    const renderTexture = new TextureEffect({
      texture: renderSavePass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const combineTexturesPass = new EffectPass(
      null,
      webcamEffect,
      renderTexture
    );

    composer.addPass(renderPass);
    composer.addPass(renderSavePass);
    composer.addPass(combineTexturesPass);
  }
}
