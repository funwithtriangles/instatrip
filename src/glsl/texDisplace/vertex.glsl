#pragma glslify: import('../../glsl/common.glsl')

const float TAU = 6.2831853071;

uniform float time;
uniform sampler2D dispTex;
uniform vec2 resolution;
uniform vec3 masterNormal;

attribute vec2 videoUv;
varying vec2 vVideoUv;

void main()
{
  vVideoUv = videoUv;

  // Get angle of displacement based on colour of texture
  vec4 dispCol = texture2D(dispTex, uv);
  float dispAngle = -dispCol.r * TAU;

  // Convert angle into X and Y
  vec3 dispDir = vec3(
    sin(dispAngle),
    cos(dispAngle),
    1.
  );

  // Animate bulge
  float noise = (sin(uv.x * 4. + time * 2.) + 1.) * .5;

  // Displace
  float displacement = (30. + 20. * noise) * dispCol.a ;

  vec3 newPosition = position + dispDir * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}