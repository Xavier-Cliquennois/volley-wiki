import { ToonMaterial } from './ToonMaterial';

export const Court = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[9, 18]} />
      <ToonMaterial color="#e67e22" />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[9, 0.05]} />
      <meshBasicMaterial color="white" />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -3]}>
      <planeGeometry args={[9, 0.05]} />
      <meshBasicMaterial color="white" />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3]}>
      <planeGeometry args={[9, 0.05]} />
      <meshBasicMaterial color="white" />
    </mesh>
    <mesh position={[0, 1.215, 0]}>
      <boxGeometry args={[9, 2.43, 0.02]} />
      <ToonMaterial color="#dddddd" transparent opacity={0.3} />
    </mesh>
    <mesh position={[0, 2.43, 0]}>
      <boxGeometry args={[9, 0.1, 0.02]} />
      <ToonMaterial color="#ffffff" />
    </mesh>
  </group>
);
