'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ChromaticAberration } from '@/components/canvas/ChromaticAberration';
import { WarpEffect } from '@/components/canvas/WarpEffect';
import { Scene } from '@/components/canvas/Scene';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useCameraFlight } from '@/hooks/useCameraFlight';
import { useEffect, Suspense } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

function CameraController() {
  const camera = useThree((state) => state.camera);
  useCameraFlight(camera);
  return null;
}

function ScrollListener() {
  useScrollProgress();
  return null;
}

function CanvasInner() {
  const { performanceMode } = usePortfolioStore();
  
  return (
    <>
      <Canvas
        camera={{ position: [0, 800, 1200], fov: 30, near: 0.1, far: 5000 }}
        shadows
        dpr={[1, 2]}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          
          if (performanceMode === 'low') {
            gl.setPixelRatio(1);
            gl.shadowMap.enabled = false;
          } else if (performanceMode === 'medium') {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            gl.shadowMap.enabled = true;
          } else {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.shadowMap.enabled = true;
          }
        }}
      >
        <fog attach="fog" args={['#03050a', 100, 3000]} />
        
        <Suspense fallback={null}>
          <Scene />
          <CameraController />
        </Suspense>
        
        <ScrollListener />
        
        <EffectComposer multisampling={8} enableNormalPass={false}>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.025}
            height={480}
          />
          <ChromaticAberration />
          <WarpEffect />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export function CanvasProvider() {
  const { isLoading } = usePortfolioStore();
  
  return (
    <>
      <CanvasInner />
      {isLoading && <LoadingScreen />}
    </>
  );
}