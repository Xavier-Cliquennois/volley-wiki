import React, { forwardRef, useRef, useMemo, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useToonGradient } from './useToonGradient';

const TRAIL_LENGTH = 15;
const TRAIL_UPDATE_THRESHOLD = 0.02;
const BALL_RADIUS = 0.22;
const OUTLINE_THICKNESS = 0.02;

type BallWithTrailProps = {
  position?: [number, number, number];
  showTrail?: boolean;
  trailColor?: string;
};

export type BallWithTrailRef = {
  mesh: THREE.Mesh | null;
  resetTrail: (position: [number, number, number]) => void;
};

export const BallWithTrail = forwardRef<BallWithTrailRef, BallWithTrailProps>(
  ({ position = [0, 0, 0], showTrail = true, trailColor = '#ffffff' }, ref) => {
    const ballRef = useRef<THREE.Mesh>(null);
    const gradientMap = useToonGradient(4);

    const trailData = useRef({
      positions: Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector3()),
      index: 0,
      count: 0,
      lastPos: new THREE.Vector3(...position),
    });

    const trailSpheres = useMemo(() =>
      Array(TRAIL_LENGTH).fill(null).map((_, i) => ({ ref: React.createRef<THREE.Mesh>(), index: i })),
    []);

    useImperativeHandle(ref, () => ({
      get mesh() { return ballRef.current; },
      resetTrail: (newPosition: [number, number, number]) => {
        trailData.current.positions.forEach(p => p.set(...newPosition));
        trailData.current.lastPos.set(...newPosition);
        trailData.current.index = 0;
        trailData.current.count = 0;
        trailSpheres.forEach(s => { if (s.ref.current) s.ref.current.visible = false; });
      },
    }));

    useFrame(() => {
      if (!ballRef.current || !showTrail) return;
      const currentPos = ballRef.current.position;
      const { positions, lastPos } = trailData.current;
      const distance = currentPos.distanceTo(lastPos);
      if (distance > TRAIL_UPDATE_THRESHOLD) {
        const idx = trailData.current.index;
        positions[idx]?.copy(currentPos);
        trailData.current.index = (idx + 1) % TRAIL_LENGTH;
        trailData.current.count = Math.min(trailData.current.count + 1, TRAIL_LENGTH);
        trailData.current.lastPos.copy(currentPos);
      }
      const { count, index } = trailData.current;
      trailSpheres.forEach((sphere, i) => {
        if (!sphere.ref.current) return;
        if (i < count) {
          const bufferIndex = (index - 1 - i + TRAIL_LENGTH) % TRAIL_LENGTH;
          const bufferPos = positions[bufferIndex];
          if (bufferPos) sphere.ref.current.position.copy(bufferPos);
          sphere.ref.current.visible = true;
          const age = i / TRAIL_LENGTH;
          sphere.ref.current.scale.setScalar(1 - age * 0.6);
          (sphere.ref.current.material as THREE.MeshToonMaterial).opacity = 1 - age * 0.8;
        } else {
          sphere.ref.current.visible = false;
        }
      });
    });

    React.useEffect(() => {
      trailData.current.positions.forEach(p => p.set(...position));
      trailData.current.lastPos.set(...position);
      trailData.current.index = 0;
      trailData.current.count = 0;
    }, [position[0], position[1], position[2]]);

    return (
      <group>
        <mesh ref={ballRef} position={position} castShadow>
          <sphereGeometry args={[BALL_RADIUS, 24, 24]} />
          <meshToonMaterial color={trailColor} gradientMap={gradientMap} />
          <mesh>
            <sphereGeometry args={[BALL_RADIUS + OUTLINE_THICKNESS, 24, 24]} />
            <meshBasicMaterial color="#000000" side={THREE.BackSide} />
          </mesh>
        </mesh>
        {showTrail && trailSpheres.map(sphere => (
          <mesh key={sphere.index} ref={sphere.ref} visible={false}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshToonMaterial color={trailColor} gradientMap={gradientMap} transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    );
  }
);

BallWithTrail.displayName = 'BallWithTrail';
