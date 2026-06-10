uniform vec3 uCameraPos;
uniform vec3 uSunDirection;
uniform float uTime;
uniform float uInnerRadius;
uniform float uOuterRadius;

varying vec3 vWorldPosition;
varying vec3 vNormal;

const vec3 K_RAYLEIGH = vec3(5.8e-6, 13.5e-6, 33.1e-6);
const float K_MIE = 21e-6;
const float RAYLEIGH_SCALE_DEPTH = 8000.0;
const float MIE_SCALE_DEPTH = 1200.0;
const float PI = 3.14159265359;

float rayleighPhase(float cosTheta) {
  return 3.0 / (16.0 * PI) * (1.0 + cosTheta * cosTheta);
}

float miePhase(float cosTheta, float g) {
  float g2 = g * g;
  return 1.0 / (2.0 * PI) * (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5);
}

float opticalDepth(float radius, float scaleDepth) {
  return exp(-(radius - uInnerRadius) / scaleDepth);
}

vec3 computeScattering(vec3 viewDir, vec3 worldPos, vec3 normal) {
  float cosSunView = dot(viewDir, uSunDirection);
  float cosSunNormal = dot(normal, uSunDirection);

  float rayleighOD = opticalDepth(length(worldPos), RAYLEIGH_SCALE_DEPTH);
  float mieOD = opticalDepth(length(worldPos), MIE_SCALE_DEPTH);

  vec3 rayleighColor = K_RAYLEIGH * rayleighPhase(cosSunView) * rayleighOD;
  vec3 mieColor = vec3(K_MIE) * miePhase(cosSunView, 0.76) * mieOD;

  float horizonFade = smoothstep(-0.1, 0.3, cosSunNormal);
  vec3 scatter = (rayleighColor + mieColor) * horizonFade;

  float fresnel = pow(1.0 - max(0.0, dot(normal, -viewDir)), 3.0);
  scatter += vec3(0.15, 0.08, 0.03) * fresnel * 0.5;

  return scatter;
}

void main() {
  vec3 viewDir = normalize(vWorldPosition - uCameraPos);
  vec3 color = computeScattering(viewDir, vWorldPosition, vNormal);

  float altitude = length(vWorldPosition) - uInnerRadius;
  float density = smoothstep(0.0, 50000.0, altitude);
  color *= density;

  vec3 sunColor = vec3(1.0, 0.9, 0.7);
  float sunIntensity = pow(max(0.0, dot(viewDir, uSunDirection)), 2000.0);
  color += sunColor * sunIntensity * 2.0;

  float starFade = smoothstep(uInnerRadius + 1000.0, uInnerRadius + 50000.0, length(vWorldPosition));
  color = mix(color, vec3(0.0), starFade);

  gl_FragColor = vec4(color, 1.0);
}