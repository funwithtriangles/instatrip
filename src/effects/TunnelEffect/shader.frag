#pragma glslify: import('../../glsl/common.glsl')

uniform sampler2D prevFrameTex;

void mainImage(const in vec4 headCol, const in vec2 uv, out vec4 outputColor) {
	// Remap the space to -1. to 1.
  vec2 st = uv - vec2(0.5);
  st.x *= resolution.x/resolution.y;

	// scale
	st *= .95;

	// rotate based on input
	st *= rotate2d(sin(time * 0.6) * .1);

	// Remap back to UV coords
	st.x /= resolution.x/resolution.y;
	st += vec2(0.5);
	
	vec4 col = texture2D(prevFrameTex, st);

	vec3 newHeadCol = rgb2hsl(headCol.rgb);

	// Adjust hue each frame
	newHeadCol.r += mod(time * 0.3, 1.);
	// Boost saturation
	newHeadCol.g = min(newHeadCol.g + .5, 1.); 

	newHeadCol = hsl2rgb(newHeadCol);

	outputColor = vec4(1.0) * vec4(newHeadCol, headCol.a) + vec4(1.0 - headCol.a) * col;
}