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

import { faceGeometry, metrics } from '../faceMesh';

interface SketchConstructor {
  composer: EffectComposer;
  scene: Scene;
  persCam: PerspectiveCamera;
  orthCam: OrthographicCamera;
}

export class Wireframe {
  material: MeshBasicMaterial;

  mesh: Mesh;

  constructor({ composer, scene }: SketchConstructor) {
    this.material = new MeshBasicMaterial({ wireframe: true });
    this.mesh = new Mesh(faceGeometry, this.material);

    scene.add(this.mesh);

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

  update() {
    const s = 1 + metrics.mouthOpenness;
    this.mesh.scale.set(s, s, s);
  }
}
