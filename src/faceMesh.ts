import * as tf from '@tensorflow/tfjs';

import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { Vector3, Object3D, Matrix4 } from 'three';
import { video } from './webcam';
import { FaceMeshFaceGeometry } from './FaceMeshFaceGeometry/face';

import '@tensorflow/tfjs-backend-wasm';

let faceMeshModel: faceLandmarksDetection.FaceLandmarksPackage;
export const faceGeometry = new FaceMeshFaceGeometry();

export const metrics = {
  mouthOpenness: 0,
  track: {
    position: new Vector3(),
    normal: new Vector3(),
    rotation: new Matrix4(),
  },
};

const lipTop = new Vector3();
const lipBot = new Vector3();

export const initFaceMesh = async () => {
  await tf.setBackend('wasm');
  faceMeshModel = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    {
      shouldLoadIrisModel: true,
      maxFaces: 1,
    }
  );
};

export const updateFaceMesh = async () => {
  if (faceMeshModel) {
    const faces = await faceMeshModel.estimateFaces({
      input: video,
      returnTensors: false,
      flipHorizontal: true,
    });
    if (faces.length) {
      const face = faces[0];
      faceGeometry.update(face, true);

      // eslint-disable-next-line
      // @ts-ignore
      const top = face.mesh[13];
      // eslint-disable-next-line
      // @ts-ignore
      const bot = face.mesh[14];

      lipTop.set(top[0], top[1], top[2]);
      lipBot.set(top[0], bot[1], bot[2]);

      metrics.mouthOpenness = lipBot.distanceTo(lipTop) / 25;

      metrics.track = faceGeometry.track(5, 45, 275);
    }
  }
};

export const trackFace = (object: Object3D) => {
  object.position.copy(metrics.track.position);
  object.rotation.setFromRotationMatrix(metrics.track.rotation);
};
