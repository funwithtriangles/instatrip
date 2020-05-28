import { video } from '../webcam';
import { FaceMeshFaceGeometry } from '../FaceMeshFaceGeometry/face';

export class Sketch {
  faceGeometry: FaceMeshFaceGeometry;

  constructor() {
    this.faceGeometry = new FaceMeshFaceGeometry();

    video.addEventListener('loadedmetadata', () => {
      this.faceGeometry.setSize(video.videoWidth, video.videoHeight);
    });
  }
}
