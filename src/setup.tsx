import { EffectComposer, TextureEffect, RenderPass } from 'postprocessing';
import Stats from 'stats.js';
import {
  OrthographicCamera,
  WebGLRenderer,
  Clock,
  PerspectiveCamera,
  Scene,
} from 'three';

import { devMode } from '../settings';
import { camTexture, video } from './webcam';
import { getResizeFactors } from './utils/getResizeFactors';
import { faceGeometry, updateFaceMesh, initFaceMesh } from './faceMesh';

export const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});
export const composer = new EffectComposer(renderer, {
  stencilBuffer: true,
});
export const clock = new Clock();
export const stats = new Stats();
export const persCam = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

export const orthCam = new OrthographicCamera(1, 1, 1, 1, -1000, 1000);
export const scene = new Scene();

export const webcamEffect = new TextureEffect({
  texture: camTexture,
});
webcamEffect.uvTransform = true;

export const renderPass = new RenderPass(scene, orthCam);

const resize = () => {
  composer.setSize(window.innerWidth, window.innerHeight, false);

  const { x, y } = getResizeFactors(
    window.innerWidth,
    window.innerHeight,
    video.videoWidth,
    video.videoHeight
  );

  const w = video.videoWidth * x;
  const h = video.videoHeight * y;

  orthCam.left = -0.5 * w;
  orthCam.right = 0.5 * w;
  orthCam.top = 0.5 * h;
  orthCam.bottom = -0.5 * h;
  orthCam.updateProjectionMatrix();

  faceGeometry.setSize(video.videoWidth, video.videoHeight);
};

window.addEventListener('resize', resize);
video.addEventListener('loadedmetadata', resize);

if (devMode.fps) {
  document.body.appendChild(stats.dom);
}

export interface AnimationInfo {
  deltaFPS: number;
  elapsedS: number;
}

export const startAnimation = (cb?: (info: AnimationInfo) => void) => {
  const animate = async () => {
    window.requestAnimationFrame(animate);
    stats.begin();
    const delta = clock.getDelta();
    const elapsedS = clock.getElapsedTime();
    const deltaFPS = delta * 60;

    if (cb) {
      cb({ deltaFPS, elapsedS });
    }

    updateFaceMesh();

    composer.render(delta);

    stats.end();
  };

  animate();
};

resize();
initFaceMesh();
