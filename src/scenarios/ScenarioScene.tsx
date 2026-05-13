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
import { COLORS, resolvePlayerColor } from './data/_shared';

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

// If the ball starts mid-air on the opponent's side and no explicit scenario
// opponent is under it, return a "ball source" filler we'll place there.
// We check ONLY scenario.players here (not the templated fillers) because
// the ball-source filler counts against the teamSize budget the same way.
function ballSourceCandidate(scenario: Scenario): { player: ScenarioPlayerConfig; pose: TimelineAction } | null {
  const [bx, by, bz] = scenario.initialBallPosition;
  if (by < 0.3) return null; // ball is essentially on the floor
  if (bz > -0.5) return null; // ball is on our side — let the scenario handle it

  const existingOpps = scenario.players.filter(p => p.role === 'opponent');
  const underBall = existingOpps.some(
    p => Math.abs(p.position[0] - bx) < 1.8 && Math.abs(p.position[2] - bz) < 1.8,
  );
  if (underBall) return null;

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

function pickTemplateFillers(
  scenario: Scenario,
  count: number,
  ballSrcPlayer: ScenarioPlayerConfig | null,
): ScenarioPlayerConfig[] {
  if (count <= 0) return [];
  const existing = scenario.players.filter(p => p.role === 'opponent');
  const blockers: Array<{ x: number; z: number }> = [
    ...existing.map(p => ({ x: p.position[0], z: p.position[2] })),
    ...(ballSrcPlayer ? [{ x: ballSrcPlayer.position[0], z: ballSrcPlayer.position[2] }] : []),
  ];

  const templates = fillerTemplates(scenario.config.teamSize);
  const safe = templates.filter(
    t => !blockers.some(b => Math.abs(b.x - t.pos[0]) < 1.5 && Math.abs(b.z - t.pos[2]) < 1.5),
  );
  return safe.slice(0, count).map(t => ({
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
  // Used by the editor preview to render exactly the authored roster —
  // no template opponents, no implicit "ball source" filler.
  disableAutoFill?: boolean;
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
  disableAutoFill = false,
}) => {
  const ballRef = useRef<BallWithTrailRef>(null);
  const impactRef = useRef<ImpactEffectRef>(null);

  const handleImpact = (pos: THREE.Vector3) => {
    impactRef.current?.trigger(pos);
  };

  // Compute the augmented player list + timeline once per scenario.
  // - Decide if we need a ball source opponent (counts against teamSize budget)
  // - Fill remaining slots with template opponents
  // - Hard-cap each side at `teamSize` so we never end up with 5 opponents in 4v4
  // - Append landing actions for any player still in the air at the end of their last scripted move
  //
  // When `disableAutoFill` is set (editor preview), every step above is skipped:
  // we render exactly the authored roster so the WYSIWYG promise holds.
  const augmented = useMemo(() => {
    if (disableAutoFill) {
      return {
        players: scenario.players,
        timeline: ensureLandings(scenario.timeline),
      };
    }

    const teamSize = scenario.config.teamSize;
    const existingOpps = scenario.players.filter(p => p.role === 'opponent');
    const ourTeam = scenario.players.filter(p => p.role !== 'opponent');

    const ballSrc = ballSourceCandidate(scenario);
    const ballSrcCount = ballSrc ? 1 : 0;
    const fillerCount = Math.max(0, teamSize - existingOpps.length - ballSrcCount);
    const filled = pickTemplateFillers(scenario, fillerCount, ballSrc?.player ?? null);

    // Defensive: hard-cap each side at teamSize regardless of upstream data.
    const opponents = [
      ...existingOpps,
      ...filled,
      ...(ballSrc ? [ballSrc.player] : []),
    ].slice(0, teamSize);
    const ours = ourTeam.slice(0, teamSize);

    const players = [...ours, ...opponents];
    const baseTimeline = ballSrc && opponents.includes(ballSrc.player)
      ? [ballSrc.pose, ...scenario.timeline]
      : scenario.timeline;
    const timeline = ensureLandings(baseTimeline);
    return { players, timeline };
  }, [scenario, disableAutoFill]);

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
            color={resolvePlayerColor(player)}
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
