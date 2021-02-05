import {
  EffectPass,
  BlurPass,
  KernelSize,
  SavePass,
  TextureEffect,
  BlendFunction,
  RenderPass,
} from 'postprocessing';

import {
  Mesh,
  MeshBasicMaterial,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
import { orthCam, renderPass as eyesRenderPass, webcamEffect } from '../setup';

import { faceGeometry } from '../faceMesh';
import { SmokeEffect } from '../effects/SmokeEffect';

import eyesUrl from '../assets/eyes_inverted.png';
import mouthUrl from '../assets/mouth_bottom_inverted.png';

const eyesTex = new TextureLoader().load(eyesUrl);
const eyesMat = new MeshBasicMaterial({
  map: eyesTex,
  transparent: true,
});

const mouthTex = new TextureLoader().load(mouthUrl);
const mouthMat = new MeshBasicMaterial({
  map: mouthTex,
  transparent: true,
});

const mouthScene = new Scene();
const mouthRenderPass = new RenderPass(mouthScene, orthCam);

export class Devil {
  constructor({ composer, scene }) {
    // Add mesh with eyes/mouth/nostrils texture
    const eyesMesh = new Mesh(faceGeometry, eyesMat);
    scene.add(eyesMesh);

    const mouthMesh = new Mesh(faceGeometry, mouthMat);
    mouthScene.add(mouthMesh);

    // Setup all the passes used below
    const saveEyesSmokePass = new SavePass();
    const saveMouthSmokePass = new SavePass();

    this.eyesSmokeEffect = new SmokeEffect({
      prevFrameTex: saveEyesSmokePass.renderTarget.texture,
      smokeColorHSL: new Vector3(1, 1, 1),
      smokeTextureAmp: 0,
      smokeVelocity: new Vector2(0, 0.002),
      smokeDecay: 0.04,
      smokeRot: 0,
    });

    this.mouthSmokeEffect = new SmokeEffect({
      prevFrameTex: saveMouthSmokePass.renderTarget.texture,
      smokeColorHSL: new Vector3(1, 0.8, 0.2),
      smokeTextureAmp: 0.1,
      smokeVelocity: new Vector2(0, -0.005),
      noiseAmp: new Vector2(0.2, 0.5),
      smokeDecay: 0,
      smokeRot: 0,
    });

    const eyesSmokeEffectPass = new EffectPass(null, this.eyesSmokeEffect);
    const mouthSmokeEffectPass = new EffectPass(null, this.mouthSmokeEffect);

    const smokeEyesTexEffect = new TextureEffect({
      texture: saveEyesSmokePass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const smokeMouthTexEffect = new TextureEffect({
      texture: saveMouthSmokePass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const overlaySmokePass = new EffectPass(
      null,
      webcamEffect,
      smokeEyesTexEffect,
      smokeMouthTexEffect
    );

    const blurPass = new BlurPass({
      KernelSize: KernelSize.SMALL,
    });
    blurPass.scale = 0.001;

    // Render eyes
    composer.addPass(eyesRenderPass);
    // Add previous frame and manipulate for smoke effect
    composer.addPass(eyesSmokeEffectPass);
    // Blur each frame
    composer.addPass(blurPass);
    // Save frame to be fed into next frame
    composer.addPass(saveEyesSmokePass);

    // Render mouth
    composer.addPass(mouthRenderPass);
    // Add previous frame and manipulate for smoke effect
    composer.addPass(mouthSmokeEffectPass);
    // Save frame to be fed into next frame
    composer.addPass(saveMouthSmokePass);

    // Render webcam image and overlay smoke
    composer.addPass(overlaySmokePass);

    this.frame = 0;
  }

  update() {
    this.eyesSmokeEffect.uniforms.get('frame').value = this.frame;
    this.mouthSmokeEffect.uniforms.get('frame').value = this.frame;

    this.frame++;
  }
}
