'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';

export function SunLight() {
  const sunPosition = useMemo(() => new THREE.Vector3(500, 800, 300), []);
  
  const light = useMemo(() => {
    const dirLight = new THREE.DirectionalLight(0xffffee, 3);
    dirLight.position.copy(sunPosition);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 2000;
    dirLight.shadow.camera.left = -500;
    dirLight.shadow.camera.right = 500;
    dirLight.shadow.camera.top = 500;
    dirLight.shadow.camera.bottom = -500;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.1;
    return dirLight;
  }, [sunPosition]);

  const ambient = useMemo(() => new THREE.AmbientLight(0x223344, 0.5), []);
  const hemisphere = useMemo(() => new THREE.HemisphereLight(0x88aacc, 0x332211, 0.8), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    light.position.x = sunPosition.x + Math.sin(time * 0.02) * 100;
    light.position.z = sunPosition.z + Math.cos(time * 0.02) * 100;
    light.target.position.set(0, 0, 0);
  });

  return (
    <>
      <primitive object={light} />
      <primitive object={light.target} />
      <primitive object={ambient} />
      <primitive object={hemisphere} />
    </>
  );
}