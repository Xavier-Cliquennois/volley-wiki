import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Court } from '../3d/Court';
import { CourtZones } from '../3d/CourtZones';
import { Player } from '../3d/Player';
import { BallWithTrail } from '../3d/BallWithTrail';
import type { BallWithTrailRef } from '../3d/BallWithTrail';
import { ImpactEffect } from '../3d/ImpactEffect';
import type { ImpactEffectRef } from '../3d/ImpactEffect';
import { useTactic } from '../3d/useTactic';
import type { Scenario } from './types';

type ScenarioSceneProps = {
  scenario: Scenario;
  playerRefs: React.MutableRefObject<Record<string, any>>;
  controllerRef: React.MutableRefObject<gsap.core.Timeline | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  onUpdate: (progress: number, actionIndex: number) => void;
  showTrail: boolean;
  showZones: boolean;
};

const CameraSetup: React.FC<{ cameraRef: React.RefObject<THREE.PerspectiveCamera | null> }> = ({ cameraRef }) => {
  const { camera } = useThree();
  useEffect(() => {
    (cameraRef as React.MutableRefObject<THREE.PerspectiveCamera | null>).current = camera as THREE.PerspectiveCamera;
  }, [camera, cameraRef]);
  return null;
};

export const ScenarioScene: React.FC<ScenarioSceneProps> = ({
  scenario,
  playerRefs,
  controllerRef,
  cameraRef,
  onUpdate,
  showTrail,
  showZones,
}) => {
  const ballRef = useRef<BallWithTrailRef>(null);
  const impactRef = useRef<ImpactEffectRef>(null);

  const handleImpact = (pos: THREE.Vector3) => {
    impactRef.current?.trigger(pos);
  };

  // Memoize script so useTactic doesn't kill + recreate the GSAP timeline on every parent re-render
  const script = useMemo(
    () => ({ id: scenario.id, timeline: scenario.timeline }),
    [scenario.id, scenario.timeline]
  );
  const timelineRef = useTactic(playerRefs, ballRef, script, onUpdate, handleImpact);

  useEffect(() => {
    if (timelineRef?.current) controllerRef.current = timelineRef.current;
  }, [timelineRef, controllerRef, scenario.id]);

  return (
    <>
      <CameraSetup cameraRef={cameraRef} />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={20} target={[0, 1, 0]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Court />
      {showZones && <CourtZones />}
      {scenario.players.map(player => (
        <Player
          key={player.id}
          ref={el => { playerRefs.current[player.id] = el; }}
          color={player.color}
          position={player.position}
        />
      ))}
      <BallWithTrail ref={ballRef} position={scenario.initialBallPosition} showTrail={showTrail} />
      <ImpactEffect ref={impactRef} />
    </>
  );
};
