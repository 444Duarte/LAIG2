#ifdef GL_ES
precision highp float;
#endif


varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 color;

void main() {

    vec4 temp = texture2D(uSampler, vTextureCoord);

	if (temp.x == 0.0 && temp.y == 0.0 && temp.z == 0.0)
		gl_FragColor = temp;
	else gl_FragColor = color;

}
