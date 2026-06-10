'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '@/store/usePortfolioStore';

const PROJECT_DATA = [
  { title: 'Fintech Dashboard OS', tags: ['React', 'Next.js', 'Tailwind'], color: 0x00d4aa, orbitRadius: 120, orbitSpeed: 0.15, inclination: 0.3 },
  { title: 'Lumina E-Commerce', tags: ['Next.js', 'Stripe'], color: 0xff6b6b, orbitRadius: 150, orbitSpeed: -0.12, inclination: -0.2 },
  { name: 'DataMetrics SaaS', tags: ['TypeScript', 'Framer Motion'], color: 0x4ecdc4, orbitRadius: 180, orbitSpeed: 0.1, inclination: 0.5 },
  { name: 'Aura Wallet', tags: ['React Native', 'Web3'], color: 0xa855f7, orbitRadius: 200, orbitSpeed: -0.08, inclination: -0.4 },
  { name: 'Voxel Engine', tags: ['Rust', 'WebGPU'], color: 0xf97316, orbitRadius: 230, orbitSpeed: 0.06, inclination: 0.6 },
  { name: 'Neural Search', tags: ['Python', 'Vector DB'], color: 0xec4899, orbitRadius: 260, orbitSpeed: -0.05, inclination: -0.3 },
  { name: 'Real-time Collab', tags: ['WebRTC', 'CRDTs'], color: 0x06b6d4, orbitRadius: 140, orbitSpeed: 0.18, inclination: 0.1 },
  { name: 'Game Framework', tags: ['Three.js', 'ECS'], color: 0x84cc16, orbitRadius: 160, orbitSpeed: -0.14, inclination: -0.5 },
];

export function ProjectOrbs() {
  const { performanceMode, currentSection } = usePortfolioStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lineRef = useRef<THREE.Line>(null);
  const dummy = useRef(new THREE.Object3D());
  const count = PROJECT_DATA.length;

  useEffect(() => {
    if (!meshRef.current) return;

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0a0f1a,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x000000,
      emissiveIntensity: 0.5,
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    meshRef.current = mesh;

    PROJECT_DATA.forEach((proj, i) => {
      dummy.current.position.set(0, 0, 0);
      dummy.current.scale.setScalar(proj.orbitRadius * 0.02 + 2);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
      mesh.setColorAt(i, new THREE.Color(proj.color));
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    PROJECT_DATA.forEach((proj) => {
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const x = Math.cos(angle) * proj.orbitRadius;
        const z = Math.sin(angle) * proj.orbitRadius;
        const y = Math.sin(angle * 2) * proj.orbitRadius * Math.sin(proj.inclination);
        linePositions.push(x, y, z);
      }
    });
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x1a2332,
      transparent: true,
      opacity: 0.3,
    });
    lineRef.current = new THREE.Line(lineGeometry, lineMaterial);

    return () => {
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []);

  useFrame(({ clock }) => {
    if (!['skills', 'projects'].includes(currentSection)) return;

    const time = clock.getElapsedTime();
    
    PROJECT_DATA.forEach((proj, i) => {
      const angle = time * proj.orbitSpeed;
      const x = Math.cos(angle) * proj.orbitRadius;
      const z = Math.sin(angle) * proj.orbitRadius;
      const y = Math.sin(angle * 2 + proj.inclination * 10) * proj.orbitRadius * Math.sin(proj.inclination) * 0.5;
      
      dummy.current.position.set(x, y, z);
      dummy.current.lookAt(0, 0, 0);
      const scale = proj.orbitRadius * 0.02 + 2 + Math.sin(time * 3 + i) * 0.3;
      dummy.current.scale.setScalar(scale);
      dummy.current.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.current.matrix);
    });
    meshRef.current!.instanceMatrix.needsUpdate = true;

    if (lineRef.current) {
      lineRef.current.rotation.y = time * 0.02;
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial(), count]} />
      {lineRef.current && <primitive object={lineRef.current} />}
    </group>
  );
}