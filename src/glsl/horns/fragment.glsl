#pragma glslify: import('../../glsl/common.glsl')

uniform float time;
uniform sampler2D faceHighlightsTex;
uniform sampler2D faceEdgeTex;
uniform sampler2D overlayTex;
uniform sampler2D camTex;

varying vec2 vVideoUv;
varying vec2 vUv;

void main( void ) {

  vec4 headCol = texture2D(camTex, vVideoUv);
  vec4 edgesCol = texture2D(faceEdgeTex, vUv);
  vec4 overlayCol =  texture2D(overlayTex, vUv);
  
  vec3 newHeadCol = rgb2hsl(headCol.rgb);

	// Adjust hue 
	newHeadCol.r = 1.;
	// AdjustBoost saturation
	newHeadCol.g = min(headCol.g + .1, 1.); 
  // AdjustBoost lum
  //newHeadCol.b += 0.2;

	newHeadCol = hsl2rgb(newHeadCol);

  newHeadCol = mix(headCol.rgb, newHeadCol, edgesCol.r);

  vec4 finalHeadCol = vec4(newHeadCol, 1.);

  gl_FragColor = mix(finalHeadCol, overlayCol, overlayCol.a);
}