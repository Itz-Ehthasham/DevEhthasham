'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '@/store/usePortfolioStore';

const SKILL_DATA = [
  { name: 'React', category: 'frontend', color: 0x61dafb, position: [15, 5, -10] },
  { name: 'TypeScript', category: 'frontend', color: 0x3178c6, position: [-12, 8, -5] },
  { name: 'Next.js', category: 'frontend', color: 0x000000, position: [8, 12, -15] },
  { name: 'Tailwind', category: 'frontend', color: 0x38bdf8, position: [-18, 3, -8] },
  { name: 'Three.js', category: 'frontend', color: 0x000000, position: [20, 6, 5] },
  { name: 'GSAP', category: 'frontend', color: 0x88ce02, position: [-8, 15, 2] },
  { name: 'Node.js', category: 'backend', color: 0x68a063, position: [10, -5, 12] },
  { name: 'PostgreSQL', category: 'backend', color: 0x336791, position: [-15, -2, 18] },
  { name: 'GraphQL', category: 'backend', color: 0xe10098, position: [5, -8, 20] },
  { name: 'Docker', category: 'devops', color: 0x2496ed, position: [-20, 0, 10] },
  { name: 'AWS', category: 'devops', color: 0xff9900, position: [12, -10, -12] },
  { name: 'CI/CD', category: 'devops', color: 0x2088ff, position: [-10, 5, 15] },
  { name: 'Figma', category: 'design', color: 0xf24e1e, position: [18, -3, -8] },
  { name: 'Blender', category: 'design', color: 0xf5792a, position: [-5, 10, 12] },
];

const CATEGORY_COLORS: Record<string, number> = {
  frontend: 0x61dafb,
  backend: 0x68a063,
  devops: 0x2496ed,
  design: 0xf24e1e,
};

export function SkillNodes() {
  const { performanceMode, currentSection } = usePortfolioStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const hoveredIndex = useRef<number | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2(-100, -100));

  const count = SKILL_DATA.length;

  useEffect(() => {
    if (!meshRef.current) return;

    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1f2e,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x000000,
      emissiveIntensity: 0,
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    meshRef.current = mesh;

    SKILL_DATA.forEach((skill, i) => {
      dummy.current.position.set(skill.position[0], skill.position[1], skill.position[2]);
      dummy.current.scale.setScalar(1);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
      mesh.setColorAt(i, new THREE.Color(skill.color));
    });

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, []);

  useFrame(({ camera, scene, gl }) => {
    if (currentSection !== 'skills') return;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObject(meshRef.current!);

    if (intersects.length > 0) {
      const index = intersects[0].instanceId!;
      if (hoveredIndex.current !== index) {
        hoveredIndex.current = index;
        const skill = SKILL_DATA[index];
        const color = new THREE.Color(skill.color);
        meshRef.current!.setColorAt(index, color);
        meshRef.current!.instanceColor!.needsUpdate = true;
      }
    } else if (hoveredIndex.current !== null) {
      const index = hoveredIndex.current;
      const skill = SKILL_DATA[index];
      const color = new THREE.Color(skill.color);
      color.multiplyScalar(0.3);
      meshRef.current!.setColorAt(index, color);
      meshRef.current!.instanceColor!.needsUpdate = true;
      hoveredIndex.current = null;
    }

    const time = performance.now() * 0.001;
    SKILL_DATA.forEach((skill, i) => {
      dummy.current.position.set(skill.position[0], skill.position[1], skill.position[2]);
      dummy.current.position.y += Math.sin(time * 1.5 + i) * 0.3;
      dummy.current.rotation.y = time * 0.1;
      dummy.current.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.05);
      dummy.current.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.current.matrix);
    });
    meshRef.current!.instanceMatrix.needsUpdate = true;
  });

  const handleMouseMove = (e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <instancedMesh ref={meshRef} args={[new THREE.SphereGeometry(1, 16, 16), new THREE.MeshStandardMaterial(), count]} />;
}