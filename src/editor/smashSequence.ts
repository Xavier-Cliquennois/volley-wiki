// One-click "smash sequence" macro: given an attacker player and the current
// step, generate two consecutive steps that form a complete, well-synced spike:
//   - Step A "Passe": the setter lifts the ball towards the attacker's hitting zone
//   - Step B "Smash":  the attacker jumps, hits the ball, and the ball flies to
//                       the opponent floor — all with contactAtRatio properly set
//
// The macro picks a default setter (the player with role 'setter' closest to
// the net) but works without one (in that case the ball just rises from its
// current position to the contact zone).

import type { BrickAction, SmashBrick } from './bricks';
import { DEFAULT_JUMP } from './bricks/expand';
import type { EditorPlayer, EditorState, EditorStep, BallTrajectory } from './types';
import { defaultSmashLandingFor } from './smashSync';

// Standard jump-apex height for a smash. Sourced from the canonical map so
// the macro stays aligned if defaults are retuned.
const SMASH_JUMP = DEFAULT_JUMP.smash;
// Above-apex height where the ball "meets" the hand.
const BALL_CONTACT_Y = SMASH_JUMP + 0.5;
// Approach offset: the attacker stands a touch behind their impact point at
// the start of the smash card (they then run + jump in).
const APPROACH_BACK_Z = 1.8;

export type SmashSequenceResult = {
  passStep: EditorStep;
  smashStep: EditorStep;
};

// Generate the two steps. Caller is responsible for inserting them into the
// state at the right position and updating activeStepIdx. Brick ids are
// suffixed with the step id so multiple sequences in the same scenario don't
// collide even if a future feature reads brick ids across steps.
export function buildSmashSequence(
  attackerId: string,
  baseStep: EditorStep,
  state: EditorState,
  passStepId: string,
  smashStepId: string,
): SmashSequenceResult {
  const attacker = state.players.find(p => p.id === attackerId);
  const attackerPos = baseStep.snapshot.positions[attackerId] ?? [0, 0, 3];

  // Pick a default setter — closest 'setter'-role player to the net (smallest z).
  const setter = pickDefaultSetter(state.players, baseStep.snapshot.positions);

  // Impact point: just in front of the attacker, near the net.
  // For an outside hitter at x=-3, impact at x=-3, z=0.4 (at the net).
  const impactX = attackerPos[0];
  const impactZ = attackerPos[2] < 0 ? -0.4 : 0.4;
  const impact: [number, number, number] = [impactX, 0, impactZ];

  // Where the ball comes FROM during the smash step (= where it lives at the
  // end of the pass step). This is the contact point's XZ with the ball still
  // up high (apex of the pass).
  const ballContactOrigin: [number, number, number] = [impactX, BALL_CONTACT_Y, impactZ];

  // Where the ball lands AFTER the smash (= ballPosition of the smash step).
  const landing = defaultSmashLandingFor(impact);

  // Attacker starts the smash step a bit behind their impact (approach run).
  const attackerStartPos: [number, number, number] = [
    impactX,
    0,
    impactZ + (impactZ < 0 ? -APPROACH_BACK_Z : APPROACH_BACK_Z),
  ];

  // -- Pass step --------------------------------------------------------
  // The setter (if any) ends up at their canonical penetration spot. The ball
  // ends at the contact origin (high above the impact zone).
  const passPositions: Record<string, [number, number, number]> = { ...baseStep.snapshot.positions };
  if (setter) {
    // Move setter to a canonical 2-3 spot if they're not already there.
    passPositions[setter.id] = [1.5, 0, 0.8];
  }
  // Bring the attacker forward to their approach start.
  passPositions[attackerId] = attackerStartPos;

  const passStep: EditorStep = {
    id: passStepId,
    title: `Passe vers ${attacker?.label ?? attackerId}`,
    description: `${setter?.label ?? 'Le passeur'} envoie une passe haute en zone de frappe.`,
    tempo: 'standard',
    snapshot: {
      positions: passPositions,
      ballPosition: ballContactOrigin,
    },
    ballTrajectory: { curve: 'arc', apex: 4.0 } satisfies BallTrajectory,
    actions: setter ? [{
      kind: 'PASSE_HAUTE',
      id: `b1-${passStepId}`,
      playerId: setter.id,
      impact: [1.5, 0, 0.8],
    } as BrickAction] : undefined,
  };

  // -- Smash step -------------------------------------------------------
  const smashPositions: Record<string, [number, number, number]> = { ...passPositions };
  // Attacker lands a step forward after the spike.
  smashPositions[attackerId] = [impactX, 0, impactZ + (impactZ < 0 ? -0.4 : 0.4)];

  const smashBrick: SmashBrick = {
    kind: 'SMASH',
    id: `b1-${smashStepId}`,
    playerId: attackerId,
    impact,
    jumpHeight: SMASH_JUMP,
    contactAtRatio: 0.55,
  };

  const smashStep: EditorStep = {
    id: smashStepId,
    title: `Smash ${zoneLabel(impactX, impactZ)}`,
    description: `${attacker?.label ?? attackerId} saute et frappe au filet, la balle plonge côté adverse.`,
    tempo: 'rapide',
    snapshot: {
      positions: smashPositions,
      ballPosition: landing,
    },
    ballTrajectory: { curve: 'flat' } satisfies BallTrajectory,
    actions: [smashBrick],
  };

  return { passStep, smashStep };
}

// Closest setter to the net, preferring our side. Returns null when no setter exists.
function pickDefaultSetter(
  players: EditorPlayer[],
  positions: Record<string, [number, number, number]>,
): EditorPlayer | null {
  const setters = players.filter(p => p.role === 'setter');
  if (setters.length === 0) return null;
  if (setters.length === 1) return setters[0];
  let best = setters[0];
  let bestZ = positions[best.id]?.[2] ?? Infinity;
  for (const s of setters.slice(1)) {
    const z = positions[s.id]?.[2] ?? Infinity;
    if (z >= 0 && z < bestZ) {
      best = s;
      bestZ = z;
    }
  }
  return best;
}

function zoneLabel(x: number, _z: number): string {
  if (x < -1.5) return 'zone 4';
  if (x > 1.5) return 'zone 2';
  return 'zone 3';
}
