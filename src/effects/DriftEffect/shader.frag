uniform sampler2D prevFrameTex;
uniform sampler2D featuresTex;
uniform float driftAmp;
uniform int frame;

#pragma glslify: import('../../glsl/common.glsl')

float crush(float val, float c) {
	return floor(val / c) * c;
}

void mainImage(const in vec4 headCol, const in vec2 uv, out vec4 outputColor) {
	// Remap the space to -1. to 1.
  vec2 st = uv - vec2(0.5);
  st.x *= resolution.x/resolution.y;

	// generate noise
	float noise0 = snoise(vec3(st, time * 0.01) * 5.);
	// Bitcrushing the angle to make it more jagged
	float angle0 = noise0 * PI * 2.;

	// Remap back to UV coords
	st.x /= resolution.x/resolution.y;
	st += vec2(0.5);

	vec2 vel = vec2(
		sin(angle0),
		cos(angle0)
	);
	
	st += vel * .0003;
	
	vec4 col = texture2D(prevFrameTex, st);

	// Mix prev frame and clean face based on various inputs and noise
	col = mix(headCol, col, driftAmp);

	vec3 newCol = rgb2hsl(col.rgb);

	// Adjust hue
	newCol.r -= 0.001;

	col = vec4(hsl2rgb(newCol.rgb), col.a);

	// Do the feedback only after 1st frame has passed
	if (frame < 2) {
		outputColor = headCol;
	} else {
		// Alpha blend prev frame with current
		outputColor = vec4(1.0) * col + vec4(1.0 - col.a) * headCol;
	}
}