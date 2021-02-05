uniform sampler2D prevFrameTex;
uniform int frame;
uniform vec3 smokeColorHSL;
uniform float smokeTextureAmp;
uniform vec2 smokeVelocity;
uniform float smokeDecay;
uniform float smokeRot;
uniform vec2 noiseAmp;

#pragma glslify: import('../../glsl/common.glsl')

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	// Remap the space to -1. to 1.
  vec2 st = uv - vec2(0.5);
  st.x *= resolution.x/resolution.y;

	// Send smoke in direction
	st -= smokeVelocity;

	// Generate noise at various scales and speeds
	float noise0base = snoise(vec3(st, time * 0.03) * 2.);
	float noise1base = snoise(vec3(st, time * 0.02) * 8.);
	float noise2base = snoise(vec3(st, time * 0.02) * 16.);

	// Convert noise into angle
	float angle0 = noise0base * PI * 2.;
	float angle1 = noise1base * PI * 2.;
	float angle2 = noise2base * PI * 2.;

	// Use angle to send smoke in random directions
	st.x += cos(angle0) * 0.003 * noiseAmp.x;
	st.y += sin(angle0) * 0.002 * noiseAmp.y;

	st.x += cos(angle1) * 0.003 * noiseAmp.x;
	st.y += sin(angle1) * 0.001 * noiseAmp.y;

	st.x += cos(angle2) * 0.005 * noiseAmp.x;
	st.y += sin(angle2) * 0.002 * noiseAmp.y;

	// rotate smoke a little
	st *= rotate2d(smokeRot);

	// Remap back to UV coords
	st.x /= resolution.x/resolution.y;
	st += vec2(0.5);

	// Add previous frame to this frame
	vec4 col = texture2D(prevFrameTex, st);
	outputColor = col + inputColor;

	// Adjust colour
	outputColor.rgb = hsl2rgb(
		smokeColorHSL +
		vec3(0., 0., noise1base * smokeTextureAmp)
	);
	
	// Only set alpha after some time has passed, because prevFrameTex initiates unpopulated
	if (frame < 2) {
		outputColor.a = inputColor.a;	
	} else {
		outputColor.a -= smokeDecay;
	}
}