# Instatrip
A demo showcasing what's possible with face filters on the web. Built completely with free and open-source libraries. These ones in particular:

- [three.js](https://github.com/mrdoob/three.js/)
- [postprocessing](https://github.com/vanruesc/postprocessing)
- [FaceMeshFaceGeometry](https://github.com/spite/FaceMeshFaceGeometry)
- [MediaPipe Facemesh](https://github.com/tensorflow/tfjs-models/tree/master/facemesh)

## Dev notes
These are more for myself, but might be useful for anyone who wants to fork and have a play!

### JS vs TS
This project is mostly Typescript, but the sketch files are Javascript. This is just to allow for quick and creative development for the fun parts of the code. :)

### Test videos
Rather than constantly pulling faces on a webcam while developing, you can choose to load in a video instead. These are not included in the repo and must be added to a directory in the root named `test-video`. In `settings.ts` these can be referenced in the `fakeCam` property, with the file name (no need to include the whole path).

### Testing iOS
When testing iOS, you'll need to make some changes to the setup. Details are mentioned in this [Github comment](https://github.com/webpack/webpack-dev-server/issues/1796#issuecomment-497687804).

- Use `inline: false` in the `devServer` webpack settings.
- Make sure you have SSL certificates generated