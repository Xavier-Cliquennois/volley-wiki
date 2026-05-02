import { Html } from '@react-three/drei';

const ZONES = [
  { number: 4, x: -3, z: 1.5, w: 3, d: 3 },
  { number: 3, x: 0,  z: 1.5, w: 3, d: 3 },
  { number: 2, x: 3,  z: 1.5, w: 3, d: 3 },
  { number: 5, x: -3, z: 6,   w: 3, d: 6 },
  { number: 6, x: 0,  z: 6,   w: 3, d: 6 },
  { number: 1, x: 3,  z: 6,   w: 3, d: 6 },
] as const;

export const CourtZones: React.FC = () => (
  <group>
    {ZONES.map(({ number, x, z, w, d }) => (
      <group key={number}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.018, z]}>
          <planeGeometry args={[w, d]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.07} depthWrite={false} />
        </mesh>
        <Html position={[x, 0.1, z]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <span style={{
            color: '#facc15',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '48px',
            fontWeight: 'bold',
            opacity: 0.4,
            userSelect: 'none',
            lineHeight: 1,
          }}>
            {number}
          </span>
        </Html>
      </group>
    ))}

    {/* Column dividers at X = ±1.5 to separate the 3 zone columns */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.019, 4.5]}>
      <planeGeometry args={[0.05, 9]} />
      <meshBasicMaterial color="white" transparent opacity={0.35} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0.019, 4.5]}>
      <planeGeometry args={[0.05, 9]} />
      <meshBasicMaterial color="white" transparent opacity={0.35} />
    </mesh>
  </group>
);
