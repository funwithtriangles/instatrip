#pragma glslify: import('../../glsl/common.glsl')

uniform float time;
uniform sampler2D fadeHighlightsTex;
uniform vec2 resolution;

attribute vec2 videoUv;
varying vec2 vVideoUv;

void main()
{
  vVideoUv = videoUv;


  vec4 edgeCol = texture2D(fadeHighlightsTex, uv);

  // float displacement = (snoise(vec3(uv * 2., time)) + 0.5) * 100. * edgeCol.r;
  
  float displacement = 
  (sin(uv.y * 5. + time * 10.) + 1.) *
  (cos(uv.x * 5. + time * 8.) + 1.) *
  70. * edgeCol.r;

  vec3 modifiedNormal = normal + vec3(
    sin(time * 5.) * 3., 
    cos(time * 3.) * 3., 
    0. 
  );

  vec3 newPosition = position + modifiedNormal * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}