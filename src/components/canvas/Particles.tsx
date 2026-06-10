'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import particleVert from '@/lib/shaders/particle.glsl';
import particleFrag from '@/lib/shaders/particle-frag.glsl';
import { usePortfolioStore } from '@/store/usePortfolioStore';

const PARTICLE_COUNT = 2000;

interface ParticleData {
  startPos: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  delay: number;
  size: number;
}

export function Particles({ type }: { type: 'dust' | 'warp' | 'impact' }) {
  const { performanceMode } = usePortfolioStore();
  const { scene } = useThree();
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<ParticleData[]>([]);
  const clockRef = useRef(0);

  useEffect(() => {
    if (performanceMode === 'low') return;

    const geometry = new THREE.BufferGeometry();
    const count = type === 'impact' ? 500 : PARTICLE_COUNT;

    const positions = new Float32Array(count * 3);
    const aSize = new Float32Array(count);
    const aLife = new Float32Array(count);
    const aDelay = new Float32Array(count);
    const aVelocity = new Float32Array(count * 3);
    const aStartPos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      let data: ParticleData;
      
      if (type === 'dust') {
        data = {
          startPos: new THREE.Vector3(
            (Math.random() - 0.5) * 100,
            Math.random() * 50,
            (Math.random() - 0.5) * 100
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            Math.random() * 0.2,
            (Math.random() - 0.5) * 0.5
          ),
          life: 20 + Math.random() * 30,
          delay: Math.random() * 10,
          size: 0.5 + Math.random() * 1.5,
        };
      } else if (type === 'warp') {
        data = {
          startPos: new THREE.Vector3(0, 0, 0),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 50
          ),
          life: 3 + Math.random() * 2,
          delay: Math.random() * 1,
          size: 2 + Math.random() * 3,
        };
      } else {
        data = {
          startPos: new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            0.5,
            (Math.random() - 0.5) * 10
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 15,
            5 + Math.random() * 10,
            (Math.random() - 0.5) * 15
          ),
          life: 2 + Math.random() * 1.5,
          delay: 0,
          size: 1 + Math.random() * 2,
        };
      }

      particlesRef.current[i] = data;
      positions[i * 3] = data.startPos.x;
      positions[i * 3 + 1] = data.startPos.y;
      positions[i * 3 + 2] = data.startPos.z;
      aSize[i] = data.size;
      aLife[i] = data.life;
      aDelay[i] = data.delay;
      aVelocity[i * 3] = data.velocity.x;
      aVelocity[i * 3 + 1] = data.velocity.y;
      aVelocity[i * 3 + 2] = data.velocity.z;
      aStartPos[i * 3] = data.startPos.x;
      aStartPos[i * 3 + 1] = data.startPos.y;
      aStartPos[i * 3 + 2] = data.startPos.z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
    geometry.setAttribute('aLife', new THREE.BufferAttribute(aLife, 1));
    geometry.setAttribute('aDelay', new THREE.BufferAttribute(aDelay, 1));
    geometry.setAttribute('aVelocity', new THREE.BufferAttribute(aVelocity, 3));
    geometry.setAttribute('aStartPos', new THREE.BufferAttribute(aStartPos, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: type === 'dust' ? 1 : type === 'warp' ? 3 : 2 },
        uColor1: { value: new THREE.Color(type === 'dust' ? 0x3a4a5a : type === 'warp' ? 0x00d4aa : 0xff8844) },
        uColor2: { value: new THREE.Color(type === 'dust' ? 0x1a2332 : type === 'warp' ? 0x8844ff : 0xff4400) },
        uOpacity: { value: type === 'dust' ? 0.4 : type === 'warp' ? 0.8 : 0.6 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    geometryRef.current = geometry;
    materialRef.current = material;
    pointsRef.current = points;

    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, type, performanceMode]);

  useFrame(({ clock }) => {
    if (!materialRef.current || performanceMode === 'low') return;
    
    clockRef.current = clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = clockRef.current;
  });

  return null;
}