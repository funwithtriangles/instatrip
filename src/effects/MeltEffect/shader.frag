uniform sampler2D prevFrameTex;
uniform sampler2D featuresTex;
uniform float noiseStrength;
uniform float featuresStrength;
uniform int frame;

#pragma glslify: import('../../glsl/common.glsl')

#pragma glslify: worley2x2x2 = require(glsl-worley/worley2x2x2.glsl)

float crush(float val, float c) {
	return floor(val / c) * c;
}

void mainImage(const in vec4 headCol, const in vec2 uv, out vec4 outputColor) {
	// Remap the space to -1. to 1.
  vec2 st = uv - vec2(0.5);
  st.x *= resolution.x/resolution.y;

	// generate noise
	vec2 F = worley2x2x2(vec3(st, time * 0.1) * 5., 1., true);
	float noise0 = F.y - F.x;
	// Bitcrushing the angle to make it more jagged
	float angle0 = crush(F.y * PI * 2., 1.);

	// scale based on input
	st *= 1. - (featuresStrength * 0.05);
	
	// rotate based on input
	st *= rotate2d(featuresStrength * -0.04);

	// Send face upwards and wiggle
	st.y -= 0.002;
	st.x += sin(angle0) * 0.01;

	// Remap back to UV coords
	st.x /= resolution.x/resolution.y;
	st += vec2(0.5);
	
	vec4 col = texture2D(prevFrameTex, st);
	vec4 featuresCol = texture2D(featuresTex, uv);

	float mixBoost = 1. + featuresStrength * 0.5;
	float crushAmp = .2;
	float crushedNoise = abs(crush(noise0, crushAmp));
	float mixVal = crushedNoise * noiseStrength * mixBoost;

	// Mix prev frame and clean face based on various inputs and noise
	col = mix(col, headCol, mixVal + featuresCol * featuresStrength);

	vec3 newCol = rgb2hsl(col.rgb);

	// Adjust hue based on input
	newCol.r -= featuresStrength * 0.01;

	col = vec4(hsl2rgb(newCol.rgb), col.a);

	// Do the feedback only after 1st frame has passed
	if (frame < 2) {
		outputColor = headCol;
	} else {
		// Alpha blend prev frame with current
		outputColor = vec4(1.0) * col + vec4(1.0 - col.a) * headCol;
		
		// Debug: noise test
		// outputColor = vec4(crushedNoise * noiseStrength, 0., 0., 1.);
	}
}