#pragma glslify: import('../../glsl/common.glsl')

uniform sampler2D faceHighlightsTex;

uniform float time;
varying vec2 vUv;

void main( void ) {
  // We use this texture to get soft edges of face
  float edgeCol = texture2D(faceHighlightsTex, vUv).r;

  // Get some noise
  float hue = snoise(vec3(vUv * 5., time * 0.5));

  // Multiple edge alpha with noise to get final alpha
  float a = edgeCol * hue;

  // Rainbow colors :P
  vec3 rgb = hsl2rgb(vec3(hue, 1., 0.5));

  gl_FragColor = vec4(rgb, a);
}