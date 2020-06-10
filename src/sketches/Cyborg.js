import {
  EffectPass,
  ScanlineEffect,
  GlitchEffect,
  HueSaturationEffect,
  ColorDepthEffect,
} from 'postprocessing';

import {
  Mesh,
  MeshBasicMaterial,
  DirectionalLight,
  TextureLoader,
  MeshPhongMaterial,
  TetrahedronBufferGeometry,
  Vector3,
  FogExp2,
} from 'three';
import { renderPass } from '../setup';

import { faceGeometry, metrics } from '../faceMesh';
import { ColorOverlayEffect } from '../effects/ColorOverlayEffect';

import eyesUrl from '../assets/eyes.jpg';

const numBgMeshes = 30;
const bgRange = new Vector3(1000, 1000, 1000);

export class Cyborg {
  constructor({ composer, scene }) {
    /* Lights */
    this.dLight = new DirectionalLight();
    this.dLight.position.set(1, 1, 1);
    scene.add(this.dLight);

    scene.fog = new FogExp2(0x000000, 0.001);

    /* Background */
    const bgMat = new MeshPhongMaterial();
    const bgGeom = new TetrahedronBufferGeometry(1000);
    this.bgMeshes = [];

    for (let i = 0; i < numBgMeshes; i++) {
      const mesh = new Mesh(bgGeom, bgMat);
      mesh.position.x = Math.random() * bgRange.x - bgRange.x / 2;
      mesh.position.y = Math.random() * bgRange.y - bgRange.y / 2;
      mesh.position.z = Math.random() * (-bgRange.z * 2) - bgRange.z;
      scene.add(mesh);
      this.bgMeshes.push(mesh);
    }

    /* Face */
    const eyeTex = new TextureLoader().load(eyesUrl);

    const shinyMat = new MeshPhongMaterial({
      alphaMap: eyeTex,
      transparent: true,
      shininess: 1,
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

    /* Post processing */
    const scanlineEffect = new ScanlineEffect();
    scanlineEffect.blendMode.opacity.value = 0.1;

    const glitchEffect = new GlitchEffect();

    const colorDepthEffect = new ColorDepthEffect({
      bits: 8,
    });

    const hueSaturationEffect = new HueSaturationEffect({
      saturation: -1,
    });

    const colorOverlayEffect = new ColorOverlayEffect();

    const effectsPass = new EffectPass(
      null,
      hueSaturationEffect,
      colorDepthEffect,
      colorOverlayEffect,
      glitchEffect,
      scanlineEffect
    );

    composer.addPass(renderPass);
    composer.addPass(effectsPass);
  }

  update({ elapsedS }) {
    const s = 1 + metrics.mouthOpenness;
    this.wireMesh.scale.set(s, s, s);

    this.dLight.position.y = Math.sin(elapsedS);
    this.dLight.position.x = Math.cos(elapsedS);

    this.wireMat.opacity = metrics.mouthOpenness + 0.2;

    this.bgMeshes.forEach(mesh => {
      mesh.rotation.x += 0.02;
      mesh.rotation.y += 0.01;
    });
  }
}
