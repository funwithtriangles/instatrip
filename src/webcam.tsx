import * as THREE from 'three';
import { resizeTexture } from './utils/resizeTexture';
import { devMode } from '../settings';

export const video = document.createElement('video');
export const camTexture = new THREE.VideoTexture(video);
export const camTextureFlipped = new THREE.VideoTexture(video);

if (devMode.fakeCam) {
  video.src = devMode.fakeCam;
  video.loop = true;
  video.muted = true;
  video.play();
} else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  const constraints = {
    video: { facingMode: 'user' },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(error) {
      alert(`Unable to access webcam: ${error.message}`);
      console.log(error);
    });
} else {
  alert('No webcam detected!');
}

const resize = () => {
  resizeTexture(
    camTexture,
    window.innerWidth,
    window.innerHeight,
    video.videoWidth,
    video.videoHeight
  );

  resizeTexture(
    camTextureFlipped,
    window.innerWidth,
    window.innerHeight,
    video.videoWidth,
    video.videoHeight
  );

  if (camTextureFlipped.repeat.x > 0) {
    camTextureFlipped.repeat.x *= -1; // Mirror cam
  }
};

window.addEventListener('resize', resize);
video.addEventListener('loadedmetadata', resize);
