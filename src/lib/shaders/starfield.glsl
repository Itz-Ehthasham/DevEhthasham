attribute float aSize;
attribute vec3 color;

uniform float uTime;
uniform float uPixelRatio;

varying vec3 vColor;

void main() {
  vColor = color;
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  
  float dist = length(mvPosition.xyz);
  float size = aSize * (300.0 / dist) * uPixelRatio;
  
  float twinkle = sin(uTime * 2.0 + position.x * 0.01) * 0.3 + 0.7;
  size *= twinkle;
  
  gl_PointSize = size;
  gl_Position = projectionMatrix * mvPosition;
}