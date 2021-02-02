#pragma glslify: import('../../glsl/common.glsl')

uniform sampler2D displacementTex;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec4 disp = texture2D(displacementTex, uv);

	// Remap the space to -1. to 1.
	vec2 st = uv - vec2(0.5);
  st.x *= resolution.x/resolution.y;

	st /= 1. + disp.a * 0.5;

	st.y += 0.02 * disp.a; 

	if (disp.r <.5 ) {
		st.x -= 0.01 * disp.a; 
	} else {
		st.x += 0.01 * disp.a; 
	}


	// // Remap back to UV coords
	st.x /= resolution.x/resolution.y;
	st += vec2(0.5);

	vec4 col = texture2D(inputBuffer, st);

	outputColor = col;
	
	// debug displacement over face
	// outputColor = vec4(1.0) * disp + vec4(1.0 - disp.a) * col;
}