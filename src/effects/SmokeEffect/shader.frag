uniform sampler2D prevFrameTex;
uniform int frame;

#pragma glslify: import('../../glsl/common.glsl')

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	// Remap the space to -1. to 1.
  vec2 st = uv - vec2(0.5);
  st.x *= resolution.x/resolution.y;

	// Send smoke upwards
	st.y -= 0.004;

	// Generate noise at various scales and speeds
	float noise0base = snoise(vec3(st, time * 0.03) * 2.);
	float noise1base = snoise(vec3(st, time * 0.02) * 8.);
	float noise2base = snoise(vec3(st, time * 0.02) * 16.);

	// Convert noise into angle
	float angle0 = noise0base * PI * 2.;
	float angle1 = noise1base * PI * 2.;
	float angle2 = noise2base * PI * 2.;

	// Use angle to send smoke in random directions
	st.x += cos(angle0) * 0.003;
	st.y += sin(angle0) * 0.002;

	st.x += cos(angle1) * 0.003;
	st.y += sin(angle1) * 0.001;

	st.x += cos(angle2) * 0.005;
	st.y += sin(angle2) * 0.002;

	// rotate smoke a little
	st *= rotate2d(0.01);

	// Remap back to UV coords
	st.x /= resolution.x/resolution.y;
	st += vec2(0.5);

	// Add previous frame to this frame
	vec4 col = texture2D(prevFrameTex, st);
	outputColor = col + inputColor;

	// Adjust colour
	outputColor.rgb = hsl2rgb(vec3(0.95, 0.9, 0.6 + noise1base * 0.1));
	
	// Only set alpha after some time has passed, because prevFrameTex initiates unpopulated
	if (frame < 2) {
		outputColor.a = inputColor.a;	
	}
}