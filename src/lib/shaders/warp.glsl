uniform sampler2D tDiffuse;
uniform float uProgress;
uniform vec2 uResolution;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5);
  vec2 dir = uv - center;
  float dist = length(dir);
  
  float warp = uProgress * (1.0 - dist) * 2.0;
  float zoom = 1.0 + uProgress * 3.0;
  
  vec2 warpedUv = center + dir * zoom + dir * warp * 0.5;
  
  float chromatic = uProgress * 0.02;
  float r = texture2D(tDiffuse, warpedUv + vec2(chromatic, 0.0)).r;
  float g = texture2D(tDiffuse, warpedUv).g;
  float b = texture2D(tDiffuse, warpedUv - vec2(chromatic, 0.0)).b;
  
  float vignette = 1.0 - smoothstep(0.5, 1.0, dist * zoom);
  
  gl_FragColor = vec4(r, g, b, 1.0) * vignette;
}