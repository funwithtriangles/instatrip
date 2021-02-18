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
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
import { orthCam, renderPass as eyesRenderPass, webcamEffect } from '../setup';

import { faceGeometry, metrics } from '../faceMesh';
import { SmokeEffect } from '../effects/SmokeEffect';

import eyesUrl from '../assets/eyes_inverted.png';
import mouthUrl from '../assets/mouth_bottom_inverted.png';

import hornsUrl from '../assets/horns.jpg';
import hornsColUrl from '../assets/horns_col.png';
import faceEdgeUrl from '../assets/face_edges.jpg';

import vert from '../glsl/faceBulge/vertex.glsl';
import frag from '../glsl/horns/fragment.glsl';
import { camTextureFlipped } from '../webcam';

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

const hornsScene = new Scene();
const hornsRenderPass = new RenderPass(hornsScene, orthCam);

const hornsTex = new TextureLoader().load(hornsUrl);
const hornsColTex = new TextureLoader().load(hornsColUrl);
const faceEdgeTex = new TextureLoader().load(faceEdgeUrl);

export class Devil {
  constructor({ composer, scene: eyesScene }) {
    // Add mesh with horns displacement material
    this.hornsMat = new ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        camTex: { value: camTextureFlipped },
        faceHighlightsTex: { value: hornsTex },
        overlayTex: { value: hornsColTex },
        faceEdgeTex: { value: faceEdgeTex },
        masterNormal: { value: new Vector3() },
        baseDisplacement: { value: 300 },
        animatedDisplacementAmp: { value: 0 },
        animatedNormalAmp: { value: 0 },
      },
      vertexShader: vert,
      fragmentShader: frag,
    });
    const hornsMesh = new Mesh(faceGeometry, this.hornsMat);
    hornsScene.add(hornsMesh);

    // Add mesh with eyes texture
    const eyesMesh = new Mesh(faceGeometry, eyesMat);
    eyesScene.add(eyesMesh);
    // Add mesh with mouth texture
    const mouthMesh = new Mesh(faceGeometry, mouthMat);
    mouthScene.add(mouthMesh);

    // Setup all the passes used below
    const saveEyesSmokePass = new SavePass();
    const saveMouthSmokePass = new SavePass();
    const saveHornsPass = new SavePass();

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

    const hornsTexEffect = new TextureEffect({
      texture: saveHornsPass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const smokeEyesTexEffect = new TextureEffect({
      texture: saveEyesSmokePass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const smokeMouthTexEffect = new TextureEffect({
      texture: saveMouthSmokePass.renderTarget.texture,
      blendFunction: BlendFunction.ALPHA,
    });

    const compositeLayersPass = new EffectPass(
      null,
      webcamEffect,
      hornsTexEffect,
      smokeEyesTexEffect,
      smokeMouthTexEffect
    );

    const blurPass = new BlurPass({
      KernelSize: KernelSize.SMALL,
    });
    blurPass.scale = 0.001;

    // Render face with horns (and skin)
    composer.addPass(hornsRenderPass);
    // Save frame to be composited later
    composer.addPass(saveHornsPass);

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
    composer.addPass(compositeLayersPass);

    this.frame = 0;
  }

  update({ elapsedS }) {
    this.hornsMat.uniforms.time.value = elapsedS;

    this.hornsMat.uniforms.baseDisplacement.value =
      100 * metrics.zed + metrics.mouthOpenness * 200;

    this.eyesSmokeEffect.uniforms.get('frame').value = this.frame;
    this.mouthSmokeEffect.uniforms.get('frame').value = this.frame;

    this.frame++;
  }
}
