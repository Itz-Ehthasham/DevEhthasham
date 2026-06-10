uniform float uTime;
uniform float uSize;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uOpacity;

attribute float aSize;
attribute float aLife;
attribute float aDelay;
attribute vec3 aVelocity;
attribute vec3 aStartPos;

varying float vLife;
varying vec3 vColor;
varying float vAlpha;

float hash(float n) {
  return fract(sin(n) * 43758.5453);
}

vec3 hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
           dot(p, vec3(269.5, 183.3, 246.1)),
           dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453);
}

void main() {
  float life = aLife;
  float delay = aDelay;
  float localTime = uTime - delay;
  
  if (localTime < 0.0 || localTime > life) {
    gl_Position = vec4(0.0, 0.0, -1000.0, 1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0;
    return;
  }
  
  float progress = localTime / life;
  float easedProgress = 1.0 - pow(1.0 - progress, 2.0);
  
  vec3 pos = aStartPos + aVelocity * localTime;
  pos.y -= 9.8 * localTime * localTime * 0.5;
  
  float turbulence = sin(pos.x * 0.1 + uTime) * cos(pos.z * 0.1 + uTime * 0.7) * 0.5;
  pos.x += turbulence * localTime * 2.0;
  pos.z += turbulence * localTime * 1.5;
  
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  float sizeProgress = 1.0 - progress;
  gl_PointSize = aSize * uSize * sizeProgress * (300.0 / -mvPosition.z);
  
  vColor = mix(uColor2, uColor1, progress);
  vAlpha = uOpacity * (1.0 - easedProgress) * sizeProgress;
  vLife = progress;
}