'use client';

import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { ShaderPass } from 'postprocessing';
import * as THREE from 'three';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import warpVert from '@/lib/shaders/warp.glsl';

const warpFrag = `
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
`;

export function WarpEffect() {
  const { size } = useThree();
  const { currentSection, scrollProgress } = usePortfolioStore();
  
  const progress = useMemo(() => {
    if (currentSection === 'hero') {
      return Math.min(scrollProgress, 1);
    }
    return 0;
  }, [currentSection, scrollProgress]);

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: warpVert,
      fragmentShader: warpFrag,
      uniforms: {
        tDiffuse: { value: null },
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
      },
    });
    return mat;
  }, [size.width, size.height]);

  useEffect(() => {
    material.uniforms.uProgress.value = progress;
  }, [material, progress]);

  return null;
}