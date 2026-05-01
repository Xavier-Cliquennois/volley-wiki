import { useMemo } from 'react';
import * as THREE from 'three';

export function useToonGradient(steps: number = 4): THREE.DataTexture {
  return useMemo(() => {
    const colors = new Uint8Array(steps);
    for (let i = 0; i < steps; i++) {
      colors[i] = Math.floor(((i + 1) / steps) * 255);
    }
    const texture = new THREE.DataTexture(colors, steps, 1, THREE.RedFormat);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
  }, [steps]);
}
