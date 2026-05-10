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
import type { Scenario, ScenarioPlayerConfig } from './types';
import { COLORS } from './data/_shared';

// Generates background opponents so the opposing team is always visible at full size.
// Skips slots that overlap (within 1.5m) with opponents the scenario already animates.
function fillOpposingTeam(scenario: Scenario): ScenarioPlayerConfig[] {
  const existing = scenario.players.filter(p => p.role === 'opponent');
  const needed = scenario.config.teamSize - existing.length;
  if (needed <= 0) return [];

  const fillers: ScenarioPlayerConfig[] = [
    { id: '_fill_S',  label: 'Passeur adv.', role: 'opponent', color: COLORS.opponent, position: [-2.5, 0, -1.0] },
    { id: '_fill_C',  label: 'Central adv.', role: 'opponent', color: COLORS.opponent, position: [0,    0, -0.6] },
    { id: '_fill_R4', label: 'Aile adv.',    role: 'opponent', color: COLORS.opponent, position: [3.0,  0, -0.6] },
    { id: '_fill_BL', label: 'Arr. G adv.',  role: 'opponent', color: COLORS.opponent, position: [-3.0, 0, -5.5] },
    { id: '_fill_BC', label: 'Libéro adv.',  role: 'opponent', color: COLORS.opponent, position: [0,    0, -7.0] },
    { id: '_fill_BR', label: 'Arr. D adv.',  role: 'opponent', color: COLORS.opponent, position: [3.0,  0, -5.5] },
  ];

  const safeFillers = fillers.filter(f =>
    !existing.some(e =>
      Math.abs(e.position[0] - f.position[0]) < 1.5 &&
      Math.abs(e.position[2] - f.position[2]) < 1.5
    )
  );
  return safeFillers.slice(0, needed);
}

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

  const allPlayers = useMemo(
    () => [...scenario.players, ...fillOpposingTeam(scenario)],
    [scenario]
  );

  return (
    <>
      <CameraSetup cameraRef={cameraRef} />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={30} target={[0, 1, 0]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Court />
      {showZones && <CourtZones />}
      {allPlayers.map(player => {
        // Setters on our side face the antenne gauche to mimic real setting orientation.
        const facingRotation = player.role === 'setter' && player.position[2] > 0
          ? -Math.PI / 2
          : undefined;
        return (
          <Player
            key={player.id}
            ref={el => { playerRefs.current[player.id] = el; }}
            color={player.color}
            position={player.position}
            facingRotation={facingRotation}
          />
        );
      })}
      <BallWithTrail ref={ballRef} position={scenario.initialBallPosition} showTrail={showTrail} />
      <ImpactEffect ref={impactRef} />
    </>
  );
};
