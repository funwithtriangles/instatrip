# Instatrip
A demo showcasing what's possible with face filters on the web. Built completely with free and open-source libraries. These ones in particular:

- [three.js](https://github.com/mrdoob/three.js/)
- [postprocessing](https://github.com/vanruesc/postprocessing)
- [FaceMeshFaceGeometry](https://github.com/spite/FaceMeshFaceGeometry)
- [MediaPipe Facemesh](https://github.com/tensorflow/tfjs-models/tree/master/facemesh)

## Dev notes
These are more for myself, but might be useful for anyone who wants to fork and have a play!

### Setup
* Clone the repo
* Install dependencies with `npm install`
* Make sure you have a test video in place (see below)
* Make sure you have SSL certificates in place (or bypass them, see below)

### Scripts
* `npm run dev`: Start development server
* `npm run build`: Package up the app (will appear in `dist`)
* `npm run deploy`: Uses [gh-pages](https://github.com/tschaub/gh-pages) to automatically deploy to Github Pages.

### JS vs TS
This project is mostly Typescript, but the sketch files are Javascript. This is just to allow for quick and creative development for the fun parts of the code. :)

### Test videos
Rather than constantly pulling faces on a webcam while developing, you can choose to load in a video instead. These are not included in the repo and must be added to a directory in the root named `test-video`. You'll need to reference this video `settings.ts` (e.g. `fakeCam: myCoolTestVideo.mp4`). Set `fakeCam` to `false` if you don't want to use the test video. Please note, that **things break if there isn't some sort of video to use** (even if you've disabled it).

### Testing iOS / SSL Certificates
The dev server needs to run as HTTPS for webcam access. Unfortunately iOS is quite fussy with this and just simply enabling `https: true` for Webpack dev server isn't enough. Therefore, when testing iOS, you'll need to make some changes to the setup. Details are mentioned in this [Github comment](https://github.com/webpack/webpack-dev-server/issues/1796#issuecomment-497687804).

- Use `inline: false` in the `devServer` webpack settings (`webpack.dev.js`).
- Make sure you have SSL certificates generated

If you're not worried about iOS, just set `https` to `true` in `webpack.dev.js`, rather than referencing the certificates.
