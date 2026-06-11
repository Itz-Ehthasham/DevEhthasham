'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import breathingVert from '@/lib/shaders/breathing.glsl';
import { usePortfolioStore } from '@/store/usePortfolioStore';

const BREATHING_FRAGMENT = `
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
  vec3 normal = normalize(vNormal);
  vec3 worldPos = vWorldPosition;
  
  vec3 viewDir = normalize(cameraPosition - worldPos);
  
  vec3 baseColor = vec3(0.05, 0.08, 0.15);
  vec3 accentColor = vec3(0.0, 0.3, 0.25);
  vec3 emissiveColor = vec3(0.0, 0.05, 0.1);
  
  float ndotv = max(dot(normal, viewDir), 0.0);
  
  vec3 sunDir = normalize(vec3(0.5, 0.8, 0.3));
  float ndotl = max(dot(normal, sunDir), 0.0);
  
  vec3 diffuse = baseColor * ndotl * 2.0;
  vec3 specular = vec3(0.3) * pow(max(dot(reflect(-sunDir, normal), viewDir), 0.0), 32.0) * ndotl;
  
  float rim = pow(1.0 - ndotv, 3.0);
  vec3 rimColor = accentColor * rim * 0.5;
  
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
  vec3 scanline = vec3(0.02) * sin(worldPos.y * 20.0 + uTime * 5.0) * fresnel;
  
  vec3 outgoingLight = emissiveColor + diffuse + specular + rimColor + scanline;
  
  float fogFactor = smoothstep(100.0, 3000.0, length(worldPos));
  vec3 fogColor = vec3(0.01, 0.02, 0.04);
  outgoingLight = mix(outgoingLight, fogColor, fogFactor);
  
  float gamma = 2.2;
  outgoingLight = pow(outgoingLight, vec3(1.0 / gamma));
  
  gl_FragColor = vec4(outgoingLight, 1.0);
}
`;

export function Character() {
  const { performanceMode } = usePortfolioStore();
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const breathingMaterial = useRef<THREE.ShaderMaterial | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const group = new THREE.Group();
    
    const bodyGeometry = new THREE.CapsuleGeometry(1.5, 4, 8, 16);
    const headGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const limbGeometry = new THREE.CapsuleGeometry(0.3, 2.5, 4, 8);
    
    const suitMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d1426,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x002244,
      emissiveIntensity: 0.2,
    });
    
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4aa,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x00d4aa,
      emissiveIntensity: 0.5,
    });
    
    const visorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x001122,
      metalness: 0.95,
      roughness: 0.05,
      transmission: 0.8,
      thickness: 0.5,
      ior: 1.5,
      envMapIntensity: 2,
    });
    
    const body = new THREE.Mesh(bodyGeometry, suitMaterial);
    body.position.y = 3;
    body.castShadow = true;
    body.receiveShadow = true;
    bodyRef.current = body;
    group.add(body);
    
    const head = new THREE.Mesh(headGeometry, suitMaterial);
    head.position.y = 7.5;
    head.scale.set(1, 1.1, 1);
    head.castShadow = true;
    head.receiveShadow = true;
    headRef.current = head;
    group.add(head);
    
    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 32, 32),
      visorMaterial
    );
    visor.position.y = 7.5;
    visor.scale.set(1, 1.1, 0.95);
    head.add(visor);
    
    const limbPositions = [
      [-1.8, 1.5, 0],   // left arm
      [1.8, 1.5, 0],    // right arm
      [-0.7, -3.5, 0],  // left leg
      [0.7, -3.5, 0],   // right leg
    ];
    
    limbPositions.forEach((pos, i) => {
      const limb = new THREE.Mesh(limbGeometry, suitMaterial);
      limb.position.set(...pos);
      if (i < 2) {
        limb.rotation.z = i === 0 ? 0.3 : -0.3;
      }
      limb.castShadow = true;
      limb.receiveShadow = true;
      group.add(limb);
    });
    
    const chestLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.15, 0.05),
      accentMaterial
    );
    chestLight.position.set(0, 4.5, 1.55);
    body.add(chestLight);
    
    const backPack = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.5, 0.8, 4, 4, 4),
      suitMaterial
    );
    backPack.position.set(0, 2.5, -1.8);
    body.add(backPack);
    
    const thruster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.3, 0.5, 8),
      accentMaterial
    );
    thruster.position.set(0, -1.5, -1.8);
    backPack.add(thruster);
    
    const breathMat = new THREE.ShaderMaterial({
      vertexShader: breathingVert,
      fragmentShader: BREATHING_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: performanceMode === 'low' ? 0 : 1 },
      },
      lights: false,
    });
    
    body.material = breathMat;
    head.material = breathMat;
    breathingMaterial.current = breathMat;
    groupRef.current = group;
    setIsReady(true);
    
    return () => {
      bodyGeometry.dispose();
      headGeometry.dispose();
      limbGeometry.dispose();
      suitMaterial.dispose();
      accentMaterial.dispose();
      visorMaterial.dispose();
      breathMat.dispose();
    };
  }, [performanceMode]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (breathingMaterial.current) {
      breathingMaterial.current.uniforms.uTime.value = time;
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.15;
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.15;
    }
    
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      headRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
    
    if (bodyRef.current) {
      bodyRef.current.rotation.z = Math.sin(time * 0.15) * 0.02;
    }
  });

  if (!isReady || !groupRef.current) {
    return <group position={[0, 0, 0]} />;
  }

  return <primitive object={groupRef.current} position={[0, 0, 0]} />;
}