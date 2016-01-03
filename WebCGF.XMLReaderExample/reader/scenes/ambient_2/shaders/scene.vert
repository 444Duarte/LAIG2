#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uHeightRange;
uniform sampler2D uHeightMap;

varying vec2 vTextureCoord;

void main(){
    vec4 offset = vec4(0.0,0.0,0.0,0.0);
    float height = texture2D(uHeightMap, aTextureCoord).r * uHeightRange;
    offset = vec4(aVertexPosition.x, aVertexPosition.y + height, aVertexPosition.z, 1.0);
    gl_Position = uPMatrix *uMVMatrix * offset;
    vTextureCoord = aTextureCoord;
}