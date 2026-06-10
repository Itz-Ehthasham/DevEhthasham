uniform float uTime;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vWorldPosition;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise3d(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
      mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
      mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
      f.y
    ),
    f.z
  );
}

void main() {
  vNormal = normalMatrix * normal;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  
  float breathe = sin(uTime * 0.8) * 0.5 + 0.5;
  float breatheSlow = sin(uTime * 0.3) * 0.5 + 0.5;
  
  float noise = noise3d(vWorldPosition * 0.02 + uTime * 0.1);
  float displacement = (breathe * 0.015 + breatheSlow * 0.008 + noise * 0.005) * uIntensity;
  
  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
}