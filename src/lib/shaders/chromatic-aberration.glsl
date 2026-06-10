uniform sampler2D tDiffuse;
uniform float uAmount;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 offset = uAmount * (vUv - 0.5) * 2.0;
  
  float r = texture2D(tDiffuse, vUv + offset * 0.5).r;
  float g = texture2D(tDiffuse, vUv).g;
  float b = texture2D(tDiffuse, vUv - offset * 0.5).b;
  
  float vignette = 1.0 - length(vUv - 0.5) * 0.6;
  
  gl_FragColor = vec4(r, g, b, 1.0) * vignette;
}