uniform sampler2D prevFrameTex;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec2 st = uv;

	st.y += 0.005;

	vec4 col = texture2D(prevFrameTex, st);

	col.a = 0.95;
	
	outputColor = col;
}