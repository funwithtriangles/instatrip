#pragma glslify: import('../../glsl/common.glsl')

uniform float time;
uniform sampler2D faceHighlightsTex;
uniform vec2 resolution;
uniform vec3 masterNormal;
uniform float baseDisplacement;
uniform float animatedDisplacementAmp;
uniform float animatedNormalAmp;
attribute vec2 videoUv;

varying vec2 vUv;
varying vec2 vVideoUv;

void main()
{
  vUv = uv;
  vVideoUv = videoUv;

  vec4 edgeCol = texture2D(faceHighlightsTex, uv);

  // float displacement = (snoise(vec3(uv * 2., time)) + 0.5) * 100. * edgeCol.r;
  
  float displacement = 
  (
    baseDisplacement + 
    (sin(uv.y * 5. + time * 10.) + 1.) *
    (cos(uv.x * 5. + time * 8.) + 1.) *
    animatedDisplacementAmp
  ) * edgeCol.r;

  vec3 modifiedNormal = normal + vec3(
    sin(time * 1.) - masterNormal.x * 6., 
    cos(time * 1.5) + masterNormal.y * 6., 
    0. 
  ) * animatedNormalAmp;

  vec3 newPosition = position + modifiedNormal * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}