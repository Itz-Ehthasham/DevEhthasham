varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv) * 2.0;
  
  float alpha = 1.0 - smoothstep(0.0, 1.0, dist);
  alpha = pow(alpha, 2.0);
  
  vec3 color = vColor;
  
  float cross = 1.0 - abs(uv.x) * 20.0;
  cross = max(0.0, cross) * 0.1;
  cross += 1.0 - abs(uv.y) * 20.0;
  cross = max(0.0, cross) * 0.1;
  
  gl_FragColor = vec4(color + cross, alpha);
}