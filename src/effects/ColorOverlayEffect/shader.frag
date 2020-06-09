uniform sampler2D camTexture;
uniform sampler2D maskTexture;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {   
	outputColor = vec4(0., inputColor.r, 0., 1.);
}