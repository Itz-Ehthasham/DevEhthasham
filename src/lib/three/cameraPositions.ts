import * as THREE from 'three';

export const CAMERA_POSITIONS = {
  hero: {
    start: new THREE.Vector3(0, 800, 1200),
    end: new THREE.Vector3(0, 15, 45),
    target: new THREE.Vector3(0, 5, 0),
    fov: { start: 30, end: 45 },
    duration: 8,
  },
  about: {
    position: new THREE.Vector3(0, 8, 25),
    target: new THREE.Vector3(0, 5, 0),
    fov: 45,
  },
  skills: {
    position: new THREE.Vector3(0, 30, 80),
    target: new THREE.Vector3(0, 10, 0),
    fov: 40,
  },
  projects: {
    position: new THREE.Vector3(0, 100, 200),
    target: new THREE.Vector3(0, 0, 0),
    fov: 35,
  },
  contact: {
    position: new THREE.Vector3(0, 10, 30),
    target: new THREE.Vector3(0, 5, 0),
    fov: 50,
  },
} as const;

export type CameraPositionKey = keyof typeof CAMERA_POSITIONS;

export const SECTION_SCROLLS = {
  hero: { start: 0, end: 1 },
  about: { start: 1, end: 2 },
  skills: { start: 2, end: 3 },
  projects: { start: 3, end: 4 },
  contact: { start: 4, end: 5 },
} as const;