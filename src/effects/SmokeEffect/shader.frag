uniform sampler2D prevFrameTex;

#pragma glslify: import('../../glsl/common.glsl')

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	// Remap the space to -1. to 1.
  vec2 st = uv - vec2(0.5);
  st.x *= resolution.x/resolution.y;

	st.y -= 0.004;

	float noise = snoise(vec3(st, time * 0.01) * 20.) * PI * 2.;

	st.x += cos(noise) * 0.002;
	st.y += sin(noise) * 0.003;

	st *= rotate2d(0.01);


	// Remap back to UV coords
	st.x /= resolution.x/resolution.y;
	st += vec2(0.5);

	vec4 col = texture2D(prevFrameTex, st);

	
	outputColor = col + inputColor;
	outputColor.a = outputColor.r;
}