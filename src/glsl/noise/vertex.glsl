varying vec2 vUv;

void main()
{
  // We have to give the UV from vertex to fragment shader, using a "varying"
  vUv = uv; 
  
  // Usual vertex shader projection stuff
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}