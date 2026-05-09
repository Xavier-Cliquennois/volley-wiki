import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

export const CAMERA_PRESETS = {
  DEFAULT: { position: [0, 9, 18] as [number, number, number], lookAt: [0, 1, 0] as [number, number, number], label: 'Large' },
  TOP_DOWN: { position: [0, 18, 0.1] as [number, number, number], lookAt: [0, 0, 0] as [number, number, number], label: 'Dessus' },
  BEHIND_SERVE: { position: [0, 4, 17] as [number, number, number], lookAt: [0, 1, 0] as [number, number, number], label: 'Serveur' },
  ATTACKER_VIEW: { position: [-6, 3, 5] as [number, number, number], lookAt: [0, 1, -3] as [number, number, number], label: 'Attaquant' },
} as const;

export type CameraPresetKey = keyof typeof CAMERA_PRESETS;

export const useCameraControls = (cameraRef: React.RefObject<THREE.PerspectiveCamera | null>) => {
  const currentPreset = useRef<CameraPresetKey>('DEFAULT');
  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));

  const animateToPreset = useCallback((preset: CameraPresetKey, duration = 0.8) => {
    if (!cameraRef.current) return;
    const presetData = CAMERA_PRESETS[preset];
    const camera = cameraRef.current;
    gsap.to(camera.position, { x: presetData.position[0], y: presetData.position[1], z: presetData.position[2], duration, ease: 'power2.inOut' });
    const lookAtTarget = { x: targetLookAt.current.x, y: targetLookAt.current.y, z: targetLookAt.current.z };
    gsap.to(lookAtTarget, {
      x: presetData.lookAt[0], y: presetData.lookAt[1], z: presetData.lookAt[2], duration, ease: 'power2.inOut',
      onUpdate: () => { targetLookAt.current.set(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z); camera.lookAt(targetLookAt.current); },
    });
    currentPreset.current = preset;
  }, [cameraRef]);

  return { animateToPreset, currentPreset };
};
