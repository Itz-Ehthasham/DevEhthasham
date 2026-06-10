'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { CanvasTexture } from 'three';
import atmosphereVert from '@/lib/shaders/atmosphere.glsl';
import atmosphereFrag from '@/lib/shaders/atmosphere-frag.glsl';
import starVert from '@/lib/shaders/starfield.glsl';
import starFrag from '@/lib/shaders/starfield-frag.glsl';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { createProceduralTexture } from '@/lib/utils/textures';

const PLANET_RADIUS = 500;
const ATMOSPHERE_RADIUS = 550;

export function Environment() {
  const { camera, scene } = useThree();
  const { performanceMode } = usePortfolioStore();
  const [texturesReady, setTexturesReady] = useState(false);
  const [planetTexture, setPlanetTexture] = useState<THREE.Texture | null>(null);
  const [normalTexture, setNormalTexture] = useState<THREE.Texture | null>(null);
  const [roughnessTexture, setRoughnessTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const planetCanvas = createProceduralTexture(1024, 512, 'planet');
    const normalCanvas = createProceduralTexture(1024, 512, 'normal');
    const roughnessCanvas = createProceduralTexture(1024, 512, 'roughness');
    
    const pTex = new CanvasTexture(planetCanvas);
    pTex.wrapS = THREE.RepeatWrapping;
    pTex.wrapT = THREE.RepeatWrapping;
    pTex.colorSpace = THREE.SRGBColorSpace;
    pTex.needsUpdate = true;
    
    const nTex = new CanvasTexture(normalCanvas);
    nTex.wrapS = THREE.RepeatWrapping;
    nTex.wrapT = THREE.RepeatWrapping;
    nTex.needsUpdate = true;
    
    const rTex = new CanvasTexture(roughnessCanvas);
    rTex.wrapS = THREE.RepeatWrapping;
    rTex.wrapT = THREE.RepeatWrapping;
    rTex.needsUpdate = true;
    
    setPlanetTexture(pTex);
    setNormalTexture(nTex);
    setRoughnessTexture(rTex);
    setTexturesReady(true);
  }, []);

  const planetMaterial = useMemo(() => {
    if (!texturesReady || !planetTexture || !normalTexture || !roughnessTexture) {
      return new THREE.MeshStandardMaterial({
        color: 0x1a2a3a,
        roughness: 0.8,
        metalness: 0.1,
      });
    }
    return new THREE.MeshStandardMaterial({
      map: planetTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      roughness: 0.8,
      metalness: 0.1,
    });
  }, [texturesReady, planetTexture, normalTexture, roughnessTexture]);

  const planetGeometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(PLANET_RADIUS, 64);
  }, []);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVert,
      fragmentShader: atmosphereFrag,
      uniforms: {
        uCameraPos: { value: new THREE.Vector3() },
        uSunDirection: { value: new THREE.Vector3(500, 800, 300).normalize() },
        uTime: { value: 0 },
        uInnerRadius: { value: PLANET_RADIUS },
        uOuterRadius: { value: ATMOSPHERE_RADIUS },
      },
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const starGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const starMaterial = useMemo(() => {
    if (performanceMode === 'low') return null;
    
    const count = performanceMode === 'high' ? 10000 : 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const radius = 2000 + Math.random() * 3000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.8;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 0.4;
      }
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    starGeometryRef.current = geometry;
    
    return new THREE.ShaderMaterial({
      vertexShader: starVert,
      fragmentShader: starFrag,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: window.devicePixelRatio },
      },
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [performanceMode]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    atmosphereMaterial.uniforms.uTime.value = time;
    atmosphereMaterial.uniforms.uCameraPos.value.copy(camera.position);
    
    if (starMaterial) {
      starMaterial.uniforms.uTime.value = time;
    }
  });

  return (
    <>
      <group>
        <mesh
          geometry={planetGeometry}
          material={planetMaterial}
          receiveShadow
        />
        
        <mesh
          geometry={new THREE.SphereGeometry(ATMOSPHERE_RADIUS, 64, 64)}
          material={atmosphereMaterial}
        />
      </group>
      
      {starMaterial && starGeometryRef.current && (
        <points geometry={starGeometryRef.current} material={starMaterial} />
      )}
      
      <FogAttach />
    </>
  );
}

function FogAttach() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog(0x03050a, 100, 3000);
  }, [scene]);
  return null;
}