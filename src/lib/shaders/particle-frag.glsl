uniform float uTime;

varying float vLife;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv) * 2.0;
  
  float core = 1.0 - smoothstep(0.0, 0.5, dist);
  float glow = 1.0 - smoothstep(0.5, 1.0, dist);
  float ring = 1.0 - abs(dist - 0.7) * 5.0;
  ring = max(0.0, ring);
  
  float alpha = (core * 1.0 + glow * 0.3 + ring * 0.2) * vAlpha;
  
  vec3 color = vColor * (core + glow * 0.5);
  color += vec3(1.0, 0.8, 0.4) * ring * 0.3;
  
  float flicker = sin(vLife * 50.0 + uTime * 20.0) * 0.05 + 0.95;
  alpha *= flicker;
  
  gl_FragColor = vec4(color, alpha);
}