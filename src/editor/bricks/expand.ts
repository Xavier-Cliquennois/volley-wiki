// Brick expansion — turns a high-level BrickAction into a flat list of
// TimelineActions (player_move + player_pose) ready for useTactic.
//
// All bricks share the same contract:
//   expand(brick, ctx) → TimelineAction[]
// where ctx exposes the player's start position, the duration window the
// brick lives in, and the ball's arrival time inside that window (when
// auto-snap detected one). All produced timestamps are relative to ctx.windowStart.

import type { PlayerPoseAction, PlayerMoveAction, TimelineAction } from '../../scenarios/types';
import type {
  BrickAction,
  SmashBrick,
  BidouilleBrick,
  FeinteBrick,
  JumpServeBrick,
  FloatServeBrick,
  PasseHauteBrick,
  PasseTendueBrick,
  BlocBrick,
  ManchetteBrick,
  DefensePlongeeBrick,
  CourseElanBrick,
  PenetrationBrick,
  Recul3mBrick,
} from './types';

export type ExpandContext = {
  // Absolute time at which the transition into the current step begins.
  windowStart: number;
  // Total duration of the transition (= step.tempo seconds).
  windowDuration: number;
  // Player's starting position (= previous step's snapshot.positions[playerId]).
  // Used as the launch pad for movement-flavoured bricks.
  startPos: [number, number, number];
  // Ball arrival time (absolute). Set when the ball_move emitted for this
  // step lands within ~1.2 m of the player — see compileScenario.ts.
  ballArrivalTime?: number;
};

// Default jump heights per brick — tuned to look right against the 2.43 m net.
// Exported so the UI's "jump height" slider can show the same default value
// the runtime will use when the brick has no explicit jumpHeight.
export const DEFAULT_JUMP = {
  smash: 1.6,
  feinte: 1.4,
  jumpServe: 2.0,
  bloc: 1.4,
};

// Minimum duration we'll allow for a sub-action — gsap is fine with very short
// tweens but anything below ~0.05s reads as a teleport.
const MIN_DUR = 0.1;

function clampDur(d: number): number {
  return Math.max(MIN_DUR, d);
}

// ──────────────────────────────────────────────────────────────────────────
// Entry point
// ──────────────────────────────────────────────────────────────────────────

export function expandBrick(brick: BrickAction, ctx: ExpandContext): TimelineAction[] {
  switch (brick.kind) {
    case 'SMASH':           return expandSmash(brick, ctx);
    case 'BIDOUILLE':       return expandBidouille(brick, ctx);
    case 'FEINTE':          return expandFeinte(brick, ctx);
    case 'JUMP_SERVE':      return expandJumpServe(brick, ctx);
    case 'FLOAT_SERVE':     return expandFloatServe(brick, ctx);
    case 'PASSE_HAUTE':     return expandPasseHaute(brick, ctx);
    case 'PASSE_TENDUE':    return expandPasseTendue(brick, ctx);
    case 'BLOC':            return expandBloc(brick, ctx);
    case 'MANCHETTE':       return expandManchette(brick, ctx);
    case 'DEFENSE_PLONGEE': return expandDefensePlongee(brick, ctx);
    case 'COURSE_ELAN':     return expandCourseElan(brick, ctx);
    case 'PENETRATION':     return expandPenetration(brick, ctx);
    case 'RECUL_3M':        return expandRecul3m(brick, ctx);
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Jumping bricks — share a "approach → jump → contact → land" skeleton.
// ──────────────────────────────────────────────────────────────────────────

type JumpPlan = {
  // Pose to fire at the apex (synchronized with ball arrival when possible).
  apexPose: 'SPIKE' | 'ARM_SPIKE' | 'SET';
  // How long the jump (going up + coming down) takes.
  jumpDuration: number;
  // Approach duration — capped to 60 % of the window so jump + land have room.
  approachDuration: number;
};

function approachJumpLand(
  brick: SmashBrick | FeinteBrick | JumpServeBrick | BlocBrick,
  ctx: ExpandContext,
  plan: JumpPlan,
  defaultJumpHeight: number,
): TimelineAction[] {
  const { windowStart, windowDuration, startPos, ballArrivalTime } = ctx;
  const jumpHeight = brick.jumpHeight ?? defaultJumpHeight;
  const landing = brick.landing ?? [brick.impact[0], 0, brick.impact[2] + 0.4];
  const windowEnd = windowStart + windowDuration;

  // When contactAtRatio is set, the ball_move was split at the contact point —
  // ballArrivalTime is now in the middle of the window, not at its end. The
  // player's apex must land EXACTLY on the ball arrival, without the legacy
  // "leave room for landing" clamp (which forced the apex back towards mid-window).
  // The landing then runs from apex to windowEnd naturally.
  const hasExplicitContact = brick.contactAtRatio !== undefined && ballArrivalTime !== undefined;

  // Apex time:
  //  - when contactAtRatio is set: apex = ballArrivalTime (no clamp)
  //  - when ballArrivalTime is set (legacy snap): clamp to leave landing room
  //  - otherwise: default to 70% through the window
  const landDurTarget = plan.jumpDuration / 2;
  const apexLatest = windowEnd - landDurTarget;
  const physicalApexAt = hasExplicitContact
    ? ballArrivalTime
    : ballArrivalTime !== undefined
      ? Math.min(ballArrivalTime, apexLatest)
      : windowStart + windowDuration * 0.7;
  const apexAt = Math.max(windowStart, physicalApexAt);
  const contactAt = ballArrivalTime ?? apexAt;

  const jumpUpDur = clampDur(plan.jumpDuration / 2);
  const jumpStartAt = Math.max(windowStart, apexAt - jumpUpDur);
  const approachDur = jumpStartAt - windowStart;
  // Landing duration grows naturally when the contact happens mid-window —
  // the player has all the time from apex to windowEnd to come back down.
  const landDur = clampDur(Math.min(plan.jumpDuration, windowEnd - apexAt));

  const actions: TimelineAction[] = [];

  // 1. Approach run — only emit if the player actually has to move AND we have
  //    real time for it. When the window is tight, the approach is folded into
  //    the jump-up itself (the jump-up's `to` is the impact spot).
  const approachTo: [number, number, number] = [brick.impact[0], 0, brick.impact[2] + 0.3];
  const moved = Math.hypot(approachTo[0] - startPos[0], approachTo[2] - startPos[2]) > 0.05;
  if (moved && approachDur >= MIN_DUR) {
    const approach: PlayerMoveAction = {
      type: 'player_move',
      time: windowStart,
      id: brick.playerId,
      to: approachTo,
      duration: approachDur,
    };
    actions.push(approach);
  }

  // 2. Jump up to apex (Y > 0 = airborne).
  const jumpUp: PlayerMoveAction = {
    type: 'player_move',
    time: jumpStartAt,
    id: brick.playerId,
    to: [brick.impact[0], jumpHeight, brick.impact[2]],
    duration: jumpUpDur,
  };
  actions.push(jumpUp);

  // 3. Contact pose at ball arrival.
  const pose: PlayerPoseAction = {
    type: 'player_pose',
    time: contactAt,
    id: brick.playerId,
    pose: plan.apexPose,
    duration: 0.2,
  };
  actions.push(pose);

  // 4. Landing — fits inside the window thanks to the apex clamp above.
  const land: PlayerMoveAction = {
    type: 'player_move',
    time: apexAt,
    id: brick.playerId,
    to: landing,
    duration: landDur,
  };
  actions.push(land);

  // 5. Reset stance after landing.
  const reset: PlayerPoseAction = {
    type: 'player_pose',
    time: apexAt + landDur,
    id: brick.playerId,
    pose: 'RESET',
    duration: 0.2,
  };
  actions.push(reset);

  return actions;
}

function expandSmash(brick: SmashBrick, ctx: ExpandContext): TimelineAction[] {
  return approachJumpLand(brick, ctx, {
    apexPose: 'SPIKE',
    jumpDuration: 0.7,
    approachDuration: 0.6,
  }, DEFAULT_JUMP.smash);
}

function expandFeinte(brick: FeinteBrick, ctx: ExpandContext): TimelineAction[] {
  // Same skeleton as smash but lower jump and SET pose (the "main posée" gesture).
  return approachJumpLand(brick, ctx, {
    apexPose: 'SET',
    jumpDuration: 0.6,
    approachDuration: 0.5,
  }, DEFAULT_JUMP.feinte);
}

function expandJumpServe(brick: JumpServeBrick, ctx: ExpandContext): TimelineAction[] {
  return approachJumpLand(brick, ctx, {
    apexPose: 'SPIKE',
    jumpDuration: 0.8,
    approachDuration: 0.7,
  }, DEFAULT_JUMP.jumpServe);
}

function expandBloc(brick: BlocBrick, ctx: ExpandContext): TimelineAction[] {
  return approachJumpLand(brick, ctx, {
    apexPose: 'ARM_SPIKE',
    jumpDuration: 0.6,
    approachDuration: 0.4,
  }, DEFAULT_JUMP.bloc);
}

// ──────────────────────────────────────────────────────────────────────────
// Ground-bound contact bricks — no jump, just stance + pose at impact.
// ──────────────────────────────────────────────────────────────────────────

function groundContact(
  playerId: string,
  pose: PlayerPoseAction['pose'],
  impact: [number, number, number],
  ctx: ExpandContext,
): TimelineAction[] {
  const { windowStart, windowDuration, startPos, ballArrivalTime } = ctx;
  const contactAt = ballArrivalTime ?? windowStart + windowDuration * 0.8;
  const moveDur = clampDur(contactAt - windowStart);

  const actions: TimelineAction[] = [];
  const target: [number, number, number] = [impact[0], 0, impact[2]];
  const moved = Math.hypot(target[0] - startPos[0], target[2] - startPos[2]) > 0.05;
  if (moved) {
    actions.push({
      type: 'player_move',
      time: windowStart,
      id: playerId,
      to: target,
      duration: moveDur,
    });
  }
  actions.push({
    type: 'player_pose',
    time: contactAt,
    id: playerId,
    pose,
    duration: 0.2,
  });
  return actions;
}

function expandBidouille(brick: BidouilleBrick, ctx: ExpandContext): TimelineAction[] {
  // « Bidouille » = poke with the fingertips at net height — no real jump,
  // visualized as SET pose (open hands above head).
  return groundContact(brick.playerId, 'SET', brick.impact, ctx);
}

function expandFloatServe(brick: FloatServeBrick, ctx: ExpandContext): TimelineAction[] {
  return groundContact(brick.playerId, 'SPIKE', brick.impact, ctx);
}

function expandPasseHaute(brick: PasseHauteBrick, ctx: ExpandContext): TimelineAction[] {
  return groundContact(brick.playerId, 'SET', brick.impact, ctx);
}

function expandPasseTendue(brick: PasseTendueBrick, ctx: ExpandContext): TimelineAction[] {
  return groundContact(brick.playerId, 'SET', brick.impact, ctx);
}

function expandManchette(brick: ManchetteBrick, ctx: ExpandContext): TimelineAction[] {
  return groundContact(brick.playerId, 'BUMP', brick.impact, ctx);
}

function expandDefensePlongee(brick: DefensePlongeeBrick, ctx: ExpandContext): TimelineAction[] {
  // The plunge is just a fast move to the impact spot + BUMP pose at arrival.
  // We can't render a proper "dive" (no animation rig for it) — the speed sells it.
  return groundContact(brick.playerId, 'BUMP', brick.impact, ctx);
}

// ──────────────────────────────────────────────────────────────────────────
// Movement-only bricks — single player_move, no pose change.
// ──────────────────────────────────────────────────────────────────────────

function moveOnly(
  playerId: string,
  to: [number, number, number],
  ctx: ExpandContext,
): TimelineAction[] {
  const { windowStart, windowDuration } = ctx;
  return [{
    type: 'player_move',
    time: windowStart,
    id: playerId,
    to: [to[0], 0, to[2]],
    duration: clampDur(windowDuration),
  }];
}

function expandCourseElan(brick: CourseElanBrick, ctx: ExpandContext): TimelineAction[] {
  return moveOnly(brick.playerId, brick.to, ctx);
}

function expandPenetration(brick: PenetrationBrick, ctx: ExpandContext): TimelineAction[] {
  return moveOnly(brick.playerId, brick.to, ctx);
}

function expandRecul3m(brick: Recul3mBrick, ctx: ExpandContext): TimelineAction[] {
  return moveOnly(brick.playerId, brick.to, ctx);
}
