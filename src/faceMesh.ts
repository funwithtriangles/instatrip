import * as facemesh from '@tensorflow-models/facemesh';
import { video } from './webcam';
import { FaceMeshFaceGeometry } from './FaceMeshFaceGeometry/face';

let faceMeshModel: facemesh.FaceMesh;
export const faceGeometry = new FaceMeshFaceGeometry();

export const initFaceMesh = async () => {
  faceMeshModel = await facemesh.load({
    maxFaces: 1,
  });
};

export const updateFaceMesh = async () => {
  if (faceMeshModel) {
    const faces = await faceMeshModel.estimateFaces(video, false, true);
    if (faces.length) {
      faceGeometry.update(faces[0], true);
    }
  }
};
