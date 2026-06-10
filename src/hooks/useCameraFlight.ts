import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { CAMERA_POSITIONS } from '@/lib/three/cameraPositions';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export function useCameraFlight(camera: THREE.Camera) {
  const { currentSection, scrollProgress } = usePortfolioStore();
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const targetPos = useRef(new THREE.Vector3());
  const targetTarget = useRef(new THREE.Vector3());
  const targetFov = useRef(45);
  const isAnimating = useRef(false);

  const lerpCamera = (delta: number) => {
    const lerpFactor = 1 - Math.exp(-delta * 8);
    camera.position.lerp(targetPos.current, lerpFactor);
    camera.lookAt(targetTarget.current);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov.current, lerpFactor);
      camera.updateProjectionMatrix();
    }
  };

  useFrame(({ clock }) => {
    if (!isAnimating.current) {
      lerpCamera(clock.getDelta());
    }
  });

  useEffect(() => {
    const config = CAMERA_POSITIONS[currentSection];
    
    if ('start' in config) {
      isAnimating.current = true;
      
      targetPos.current.copy(config.start);
      targetTarget.current.copy(config.target);
      targetFov.current = config.fov.start;
      
      camera.position.copy(config.start);
      camera.lookAt(config.target);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = config.fov.start;
        camera.updateProjectionMatrix();
      }

      animationRef.current = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      animationRef.current
        .to(targetPos.current, {
          x: config.end.x,
          y: config.end.y,
          z: config.end.z,
          duration: config.duration,
          ease: 'power2.inOut',
        }, 0)
        .to(targetFov, {
          value: config.fov.end,
          duration: config.duration,
          ease: 'power2.inOut',
        }, 0)
        .to(
          { progress: 0 },
          {
            progress: 1,
            duration: config.duration,
            ease: 'power2.inOut',
            onUpdate: function() {
              const p = this.targets()[0].progress;
              targetTarget.current.lerpVectors(config.target, new THREE.Vector3(0, 5, 0), p);
            },
          },
          0
        );
    } else {
      isAnimating.current = true;
      
      animationRef.current = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      animationRef.current
        .to(targetPos.current, {
          x: config.position.x,
          y: config.position.y,
          z: config.position.z,
          duration: 2,
          ease: 'power2.inOut',
        }, 0)
        .to(targetTarget.current, {
          x: config.target.x,
          y: config.target.y,
          z: config.target.z,
          duration: 2,
          ease: 'power2.inOut',
        }, 0)
        .to(targetFov, {
          value: config.fov,
          duration: 2,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (camera instanceof THREE.PerspectiveCamera) {
              camera.fov = targetFov.current;
              camera.updateProjectionMatrix();
            }
          },
        }, 0);
    }

    return () => {
      animationRef.current?.kill();
    };
  }, [currentSection, camera]);

  useEffect(() => {
    if (currentSection === 'hero') {
      const config = CAMERA_POSITIONS.hero;
      const progress = THREE.MathUtils.clamp(scrollProgress, 0, 1);
      
      targetPos.current.lerpVectors(config.start, config.end, progress);
      targetFov.current = THREE.MathUtils.lerp(config.fov.start, config.fov.end, progress);
      targetTarget.current.lerpVectors(config.target, new THREE.Vector3(0, 5, 0), progress);
    }
  }, [scrollProgress, currentSection, camera]);
}