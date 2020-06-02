import {
  BlendFunction,
  EffectPass,
  TextureEffect,
  SavePass,
} from 'postprocessing';

import { Mesh, BackSide, MeshNormalMaterial } from 'three';
import { webcamEffect, renderPass } from '../setup';

import { faceGeometry, metrics } from '../faceMesh';

export class Beauty {
  constructor({ composer, scene }) {
    const shinyMat = new MeshNormalMaterial({
      side: BackSide,
    });

    this.shinyMesh = new Mesh(faceGeometry, shinyMat);

    scene.add(this.shinyMesh);

    const renderSavePass = new SavePass();

    const renderTexture = new TextureEffect({
      texture: renderSavePass.renderTarget.texture,
      blendFunction: BlendFunction.LIGHTEN,
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
    this.shinyMesh.scale.set(s, s, s);
  }
}
