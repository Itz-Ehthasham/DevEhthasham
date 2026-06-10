import { create } from 'zustand';
import { CameraPositionKey } from '@/lib/three/cameraPositions';
import * as THREE from 'three';

interface PortfolioState {
  currentSection: CameraPositionKey;
  scrollProgress: number;
  isLoading: boolean;
  loadingProgress: number;
  audioEnabled: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  cameraFov: number;
  setSection: (section: CameraPositionKey) => void;
  setScrollProgress: (progress: number) => void;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  toggleAudio: () => void;
  setPerformanceMode: (mode: 'high' | 'medium' | 'low') => void;
  setCameraState: (pos: THREE.Vector3, target: THREE.Vector3, fov: number) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  currentSection: 'hero',
  scrollProgress: 0,
  isLoading: true,
  loadingProgress: 0,
  audioEnabled: false,
  performanceMode: 'high',
  cameraPosition: new THREE.Vector3(0, 800, 1200),
  cameraTarget: new THREE.Vector3(0, 5, 0),
  cameraFov: 30,
  
  setSection: (section) => set({ currentSection: section }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  setPerformanceMode: (mode) => set({ performanceMode: mode }),
  setCameraState: (pos, target, fov) => set({ cameraPosition: pos, cameraTarget: target, cameraFov: fov }),
}));