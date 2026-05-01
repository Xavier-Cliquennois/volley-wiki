import { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface ImpactEffectRef {
  trigger: (position: THREE.Vector3) => void;
}

export const ImpactEffect = forwardRef<ImpactEffectRef, {}>((_, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);

  useImperativeHandle(ref, () => ({
    trigger: (position: THREE.Vector3) => {
      if (meshRef.current) {
        meshRef.current.position.copy(position);
        meshRef.current.scale.set(0, 0, 0);
        (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
        setActive(true);
      }
    },
  }));

  useFrame((_, delta) => {
    if (active && meshRef.current) {
      meshRef.current.scale.x += 5 * delta;
      meshRef.current.scale.y += 5 * delta;
      meshRef.current.scale.z += 5 * delta;
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity -= 3 * delta;
      if (mat.opacity <= 0) {
        setActive(false);
        meshRef.current.scale.set(0, 0, 0);
      }
    }
  });

  return (
    <mesh ref={meshRef} visible={active} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.5, 32]} />
      <meshBasicMaterial color="white" transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
});

ImpactEffect.displayName = 'ImpactEffect';
