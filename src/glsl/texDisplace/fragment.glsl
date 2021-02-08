uniform float time;
uniform sampler2D camTex;

varying vec2 vVideoUv;

void main( void ) {

  gl_FragColor = texture2D(camTex, vVideoUv);

}