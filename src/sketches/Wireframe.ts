import {
  EffectComposer,
  BlendFunction,
  EffectPass,
  TextureEffect,
  SavePass,
} from 'postprocessing';

import {
  Mesh,
  MeshNormalMaterial,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  BoxBufferGeometry,
  DoubleSide,
  MeshBasicMaterial,
} from 'three';
import { Sketch } from './Sketch';

import { webcamEffect, renderPass, faceGeometry } from '../setup';

import { video } from '../webcam';

interface SketchConstructor {
  composer: EffectComposer;
  scene: Scene;
  persCam: PerspectiveCamera;
  orthCam: OrthographicCamera;
}

export class Wireframe {
  constructor({ composer, scene, orthCam }: SketchConstructor) {
    const mat = new MeshBasicMaterial({ wireframe: true });
    const mesh = new Mesh(faceGeometry, mat);

    const cube = new Mesh(new BoxBufferGeometry(), mat);
    scene.add(mesh);
    // scene.add(cube);

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
