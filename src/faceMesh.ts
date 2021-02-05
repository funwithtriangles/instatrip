import * as facemesh from '@tensorflow-models/facemesh';
import { Vector3, Object3D, Matrix4, VideoTexture } from 'three';
import { appState } from './appState';
import { video } from './webcam';

import { FaceMeshFaceGeometry } from './FaceMeshFaceGeometry/face';

let faceMeshModel: facemesh.FaceMesh;
export const faceGeometry = new FaceMeshFaceGeometry({
  useVideoTexture: true,
});

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
  faceMeshModel = await facemesh.load({
    maxFaces: 1,
  });
  appState.faceMeshModelLoaded = true;
};

export const updateFaceMesh = async () => {
  const faces = await faceMeshModel.estimateFaces(video, false, true);
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
};

export const trackFace = (object: Object3D) => {
  object.position.copy(metrics.track.position);
  object.rotation.setFromRotationMatrix(metrics.track.rotation);
};
