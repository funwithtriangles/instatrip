uniform sampler2D camTexture;
uniform sampler2D maskTexture;
uniform bool invert;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 st = uv ;
  st.x = (st.x - 0.5) + 0.5;

  float mask = texture2D(maskTexture, uv).r;
    
  vec3 col = texture2D(camTexture, st).rgb;

	outputColor = vec4(col, mask);
}