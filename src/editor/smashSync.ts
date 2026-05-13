// Auto-alignment helpers for jumping bricks (smash, feinte, jump serve, bloc).
//
// The pipeline problem these helpers solve: a jumping brick visually "catches"
// the ball in mid-air, but the editor's snapshot model places the ball only at
// the START and END of each step. Without help, the author has to manually
// position the previous step's ball XZ near the impact point — a milimetric
// alignment that nobody wants to do on a whiteboard-like tool.
//
// applySmashAutoSync handles that for them: when a jumping brick is created on
// step N, the ball position of step N-1 is gently snapped so the ball comes
// from a point that lines up with the impact's XZ.

import type {
  BrickAction,
  SmashBrick,
  FeinteBrick,
  JumpServeBrick,
  BlocBrick,
} from './bricks';
import { DEFAULT_JUMP } from './bricks/expand';
import type { EditorStep } from './types';

export type JumpingBrick = SmashBrick | FeinteBrick | JumpServeBrick | BlocBrick;

export function isJumpingBrick(brick: BrickAction): brick is JumpingBrick {
  return brick.kind === 'SMASH' || brick.kind === 'FEINTE'
      || brick.kind === 'JUMP_SERVE' || brick.kind === 'BLOC';
}

// Single source of truth for the XZ distance at which a ball/impact pair is
// considered "in sync". Imported by both:
//   - the canvas (this module's computeSyncStatuses → SmashSyncIndicator.isSynced)
//   - the compiler (compileScenario.ts → shouldSnap → AUTO_SNAP_RADIUS)
// so the green "✓ SYNCHRO" badge matches what the compiler actually wires up.
export const SYNC_RADIUS = 1.5;

// How far behind the impact (along Z, on our side) the ball "comes from".
// Just enough so the trajectory reads as an approach, not a teleport.
const BALL_ORIGIN_OFFSET_Z = 0.6;

// Returns a patched prevStep.snapshot.ballPosition that lines up with the
// brick's impact XZ, OR null when no patch is needed (already aligned, or the
// author has deliberately attached the ball to a player).
//
// The Y coordinate is preserved (the author may have set it via the BallPanel
// for the setter's hand height). Only XZ is realigned.
export function computeBallSnapForJumpingBrick(
  brick: JumpingBrick,
  prevStep: EditorStep,
): [number, number, number] | null {
  // Respect the author's intent: if the previous step's ball is attached to a
  // player (typically the setter who'll send the pass), we don't move it.
  // The author placed it there on purpose.
  if (prevStep.snapshot.ballAttachedTo) return null;

  const prevBall = prevStep.snapshot.ballPosition;
  const dx = prevBall[0] - brick.impact[0];
  const dz = prevBall[2] - brick.impact[2];
  const dist = Math.hypot(dx, dz);
  if (dist < SYNC_RADIUS) return null;

  // Snap to "behind the impact, our side" so the ball flies forward.
  // For a smash near the net (impact.z ≈ 0), origin sits just behind at
  // z = impact.z + 0.6. For a block (impact.z < 0), keep the origin on our
  // side too (the ball comes from the opponent on the next step, but the
  // PREVIOUS ball position is whatever the author placed — only realign if
  // it's wildly off).
  const targetZ = brick.kind === 'BLOC'
    ? Math.min(-0.3, brick.impact[2] - BALL_ORIGIN_OFFSET_Z) // ball comes from opponent side
    : brick.impact[2] + BALL_ORIGIN_OFFSET_Z;                // ball comes from behind on our side

  return [brick.impact[0], prevBall[1], targetZ];
}

// Same idea but for the CURRENT step's ball destination — only used for
// dialog-driven macros (insertSmashSequence), not on every brick add.
// Returns where the ball should land after the spike.
export function defaultSmashLandingFor(impact: [number, number, number]): [number, number, number] {
  // Spikes typically land deep on the opponent court, on the same side line
  // as the attacker. Place at z = -6 (3m from the back line) and keep x.
  const targetX = Math.sign(impact[0]) === 0 ? 0 : impact[0] * 0.6;
  return [targetX, 0.1, -6];
}

// ──────────────────────────────────────────────────────────────────────────
// Smash sync indicator — drives the canvas overlay
// ──────────────────────────────────────────────────────────────────────────

export type SmashSyncStatus = {
  brickId: string;
  playerId: string;
  // Contact point in court coords [x, apexY, z].
  contactPoint: [number, number, number];
  // True when the previous step's ball XZ is within sync radius of the impact.
  isSynced: boolean;
  // Distance in metres between the ball's origin and the impact (for UI hint).
  distance: number;
};

// Inspect the active step's jumping bricks and the previous step's ball
// position to build a per-brick sync report. Returns [] when there's nothing
// to display (step 0, no jumping brick, etc.).
export function computeSyncStatuses(
  activeStep: EditorStep | null,
  prevStep: EditorStep | null,
): SmashSyncStatus[] {
  if (!activeStep?.actions || !prevStep) return [];
  const out: SmashSyncStatus[] = [];
  for (const brick of activeStep.actions) {
    if (!isJumpingBrick(brick)) continue;
    const prevBall = prevStep.snapshot.ballPosition;
    const dist = Math.hypot(
      prevBall[0] - brick.impact[0],
      prevBall[2] - brick.impact[2],
    );
    const apexY = (brick.jumpHeight ?? jumpHeightFor(brick.kind)) + 0.5;
    out.push({
      brickId: brick.id,
      playerId: brick.playerId,
      contactPoint: [brick.impact[0], apexY, brick.impact[2]],
      isSynced: dist < SYNC_RADIUS,
      distance: dist,
    });
  }
  return out;
}

function jumpHeightFor(kind: JumpingBrick['kind']): number {
  switch (kind) {
    case 'SMASH':      return DEFAULT_JUMP.smash;
    case 'FEINTE':     return DEFAULT_JUMP.feinte;
    case 'JUMP_SERVE': return DEFAULT_JUMP.jumpServe;
    case 'BLOC':       return DEFAULT_JUMP.bloc;
  }
}
