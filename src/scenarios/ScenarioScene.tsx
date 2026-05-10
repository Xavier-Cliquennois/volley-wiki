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
import type { Scenario, ScenarioPlayerConfig, TimelineAction } from './types';
import { COLORS } from './data/_shared';

// ──────────────────────────────────────────────────────────────────────────
// Helpers — injected automatically so every scenario looks consistent
// ──────────────────────────────────────────────────────────────────────────

// Per-team-size opponent layout templates. The auto-filler picks from these
// so a 4v4 doesn't end up with 6v6-style "back centre libéro" placements
// that look out of place.
function fillerTemplates(teamSize: 4 | 5 | 6) {
  if (teamSize === 6) {
    return [
      { id: '_fill_S',  label: 'Passeur adv.',     pos: [-2.5, 0, -1.0] as [number, number, number] },
      { id: '_fill_C',  label: 'Central adv.',    pos: [0,    0, -0.6] as [number, number, number] },
      { id: '_fill_R4', label: 'Aile adv.',       pos: [3.0,  0, -0.6] as [number, number, number] },
      { id: '_fill_BL', label: 'Arr. G adv.',     pos: [-3.0, 0, -5.5] as [number, number, number] },
      { id: '_fill_BC', label: 'Libéro adv.',     pos: [0,    0, -7.0] as [number, number, number] },
      { id: '_fill_BR', label: 'Arr. D adv.',     pos: [3.0,  0, -5.5] as [number, number, number] },
    ];
  }
  if (teamSize === 5) {
    // Pentagon-ish: 3 net + 2 back, no back-centre libero
    return [
      { id: '_fill_S',  label: 'Passeur adv.',  pos: [-2.5, 0, -1.0] as [number, number, number] },
      { id: '_fill_C',  label: 'Central adv.', pos: [0,    0, -0.6] as [number, number, number] },
      { id: '_fill_R4', label: 'Aile adv.',    pos: [3.0,  0, -0.6] as [number, number, number] },
      { id: '_fill_BL', label: 'Arr. G adv.',  pos: [-2.5, 0, -5.0] as [number, number, number] },
      { id: '_fill_BR', label: 'Arr. D adv.',  pos: [2.5,  0, -5.0] as [number, number, number] },
    ];
  }
  // 4v4: 3 net + 1 single back (no libero, no back-centre)
  return [
    { id: '_fill_LD', label: 'Aile G adv.',    pos: [-3.0, 0, -0.6] as [number, number, number] },
    { id: '_fill_C',  label: 'Filet centre adv.', pos: [0,    0, -0.6] as [number, number, number] },
    { id: '_fill_R4', label: 'Aile D adv.',    pos: [3.0,  0, -0.6] as [number, number, number] },
    { id: '_fill_B',  label: 'Arrière adv.',   pos: [0,    0, -5.5] as [number, number, number] },
  ];
}

// If the ball starts mid-air on the opponent's side and no player is under it,
// add an opponent there in BUMP / SPIKE pose so the ball visibly comes from
// someone (the user kept seeing the ball appear from nowhere).
function ballSourceAddition(
  scenario: Scenario,
  filledOpponents: ScenarioPlayerConfig[],
): { player: ScenarioPlayerConfig; pose: TimelineAction } | null {
  const [bx, by, bz] = scenario.initialBallPosition;
  if (by < 0.3) return null; // ball is essentially on the floor — no source needed
  if (bz > -0.5) return null; // ball is on our side — let the scenario handle it

  const allOpponents = [...scenario.players.filter(p => p.role === 'opponent'), ...filledOpponents];
  const underBall = allOpponents.some(
    p => Math.abs(p.position[0] - bx) < 1.8 && Math.abs(p.position[2] - bz) < 1.8,
  );
  if (underBall) return null;

  // A high ball deep in their court = service ; otherwise = reception
  const isServe = bz < -7 && by > 1.0;
  const id = '_fill_BSRC';

  return {
    player: {
      id,
      label: isServe ? 'Serveur adv.' : 'Réceptionneur adv.',
      role: 'opponent',
      color: COLORS.opponent,
      position: [bx, 0, bz + 0.2],
    },
    pose: {
      type: 'player_pose',
      time: 0,
      id,
      pose: isServe ? 'SPIKE' : 'BUMP',
      duration: 0.2,
    },
  };
}

function fillOpposingTeam(scenario: Scenario): ScenarioPlayerConfig[] {
  const existing = scenario.players.filter(p => p.role === 'opponent');
  const needed = scenario.config.teamSize - existing.length;
  if (needed <= 0) return [];

  const templates = fillerTemplates(scenario.config.teamSize);
  const safe = templates.filter(
    t => !existing.some(e => Math.abs(e.position[0] - t.pos[0]) < 1.5 && Math.abs(e.position[2] - t.pos[2]) < 1.5),
  );
  return safe.slice(0, needed).map(t => ({
    id: t.id,
    label: t.label,
    role: 'opponent' as const,
    color: COLORS.opponent,
    position: t.pos,
  }));
}

// Any player whose final scripted position is in the air (y > 0.5) gets an
// implicit landing + RESET pose appended ~0.1s later. This means scenario
// authors don't have to remember to land every blocker / attacker by hand.
function ensureLandings(timeline: TimelineAction[]): TimelineAction[] {
  const movesByPlayer: Record<string, Array<{ time: number; to: [number, number, number]; duration: number }>> = {};
  for (const a of timeline) {
    if (a.type === 'player_move') {
      (movesByPlayer[a.id] ||= []).push({ time: a.time, to: a.to, duration: a.duration });
    }
  }
  const additions: TimelineAction[] = [];
  for (const [id, moves] of Object.entries(movesByPlayer)) {
    moves.sort((a, b) => a.time - b.time);
    const last = moves[moves.length - 1];
    if (last.to[1] > 0.5) {
      const landTime = last.time + last.duration + 0.05;
      additions.push({
        type: 'player_move',
        time: landTime,
        id,
        to: [last.to[0], 0, last.to[2]],
        duration: 0.25,
      });
      additions.push({
        type: 'player_pose',
        time: landTime,
        id,
        pose: 'RESET',
        duration: 0.25,
      });
    }
  }
  return [...timeline, ...additions];
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

  // Compute the augmented player list + timeline once per scenario.
  // - Fill the opposing team
  // - Add a ball source opponent if the ball appears in the air with nobody under it
  // - Append landing actions for any player still in the air at the end of their last scripted move
  const augmented = useMemo(() => {
    const filled = fillOpposingTeam(scenario);
    const ballSrc = ballSourceAddition(scenario, filled);
    const players = ballSrc ? [...scenario.players, ...filled, ballSrc.player] : [...scenario.players, ...filled];
    const baseTimeline = ballSrc ? [ballSrc.pose, ...scenario.timeline] : scenario.timeline;
    const timeline = ensureLandings(baseTimeline);
    return { players, timeline };
  }, [scenario]);

  const script = useMemo(
    () => ({ id: scenario.id, timeline: augmented.timeline }),
    [scenario.id, augmented.timeline],
  );
  const timelineRef = useTactic(playerRefs, ballRef, script, onUpdate, handleImpact);

  useEffect(() => {
    if (timelineRef?.current) controllerRef.current = timelineRef.current;
  }, [timelineRef, controllerRef, scenario.id]);

  return (
    <>
      <CameraSetup cameraRef={cameraRef} />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={30}
        target={[0, 1, 0]}
        maxPolarAngle={Math.PI / 2 - 0.05}
      />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Court />
      {showZones && <CourtZones />}
      {augmented.players.map(player => {
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
