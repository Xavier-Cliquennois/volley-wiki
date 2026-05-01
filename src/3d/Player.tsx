import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { ToonMaterial } from './ToonMaterial';

type PlayerProps = {
  color: string;
  position: [number, number, number];
};

export type PlayerRef = {
  group: React.MutableRefObject<THREE.Group>;
  rightShoulder: React.MutableRefObject<THREE.Group>;
  leftShoulder: React.MutableRefObject<THREE.Group>;
};

const OUTLINE_THICKNESS = 0.025;

const OutlinedBox: React.FC<{
  args: [number, number, number];
  color: string;
  position?: [number, number, number];
  castShadow?: boolean;
  children?: React.ReactNode;
}> = ({ args, color, position, castShadow, children }) => {
  const outlineArgs: [number, number, number] = [
    args[0] + OUTLINE_THICKNESS * 2,
    args[1] + OUTLINE_THICKNESS * 2,
    args[2] + OUTLINE_THICKNESS * 2,
  ];
  return (
    <mesh position={position} castShadow={castShadow}>
      <boxGeometry args={args} />
      <ToonMaterial color={color} />
      {children}
      <mesh>
        <boxGeometry args={outlineArgs} />
        <meshBasicMaterial color="#000000" side={THREE.BackSide} />
      </mesh>
    </mesh>
  );
};

export const Player = forwardRef<PlayerRef, PlayerProps>(({ color, position }, ref) => {
  const group = useRef<THREE.Group>(null!);
  const rightShoulder = useRef<THREE.Group>(null!);
  const leftShoulder = useRef<THREE.Group>(null!);

  useImperativeHandle(ref, () => ({ group, rightShoulder, leftShoulder }));

  return (
    <group ref={group} position={position} rotation={[0, Math.PI, 0]}>
      <OutlinedBox args={[0.5, 0.7, 0.3]} color={color} position={[0, 0.85, 0]} castShadow>
        <mesh position={[0, 0, 0.151]}>
          <planeGeometry args={[0.25, 0.35]} />
          <ToonMaterial color="#ffffff" />
        </mesh>
        <group ref={rightShoulder} position={[-0.35, 0.3, 0]}>
          <OutlinedBox args={[0.12, 0.5, 0.12]} color={color} position={[0, -0.25, 0]} />
        </group>
        <group ref={leftShoulder} position={[0.35, 0.3, 0]}>
          <OutlinedBox args={[0.12, 0.5, 0.12]} color={color} position={[0, -0.25, 0]} />
        </group>
      </OutlinedBox>
      <OutlinedBox args={[0.25, 0.25, 0.25]} color="#ffdbac" position={[0, 1.4, 0]}>
        <OutlinedBox args={[0.06, 0.06, 0.06]} color="#e8c39e" position={[0, -0.02, 0.13]} />
      </OutlinedBox>
    </group>
  );
});

Player.displayName = 'Player';
