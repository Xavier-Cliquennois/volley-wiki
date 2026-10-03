import type {
  BallMoveAction,
  Scenario,
  ScenarioPlayerConfig,
  ScenarioStep,
  TimelineAction,
} from '../scenarios/types';
import type { EditorState, EditorStep, PoseName } from './types';
import { TEMPO_DURATIONS } from './types';
import { expandBrick, BRICK_BY_KIND } from './bricks';
import { DEFAULT_JUMP, HAND_REACH } from './bricks/expand';
import type {
  BrickAction,
  ExpandContext,
} from './bricks';
import { SYNC_RADIUS, type JumpingBrick } from './smashSync';

const EPSILON = 0.001;
const CONTACT_DURATION = 0.2;

// How far above the striking hand a set climbs before coming down onto it.
const SET_LIFT = 0.8;
// A grounded player holds the ball between these heights (hands at the hips
// up to hands above the head); lower, the ball lies on the floor.
const HOLD_MIN_HEIGHT = 0.6;
const HOLD_MAX_HEIGHT = 2.2;
// Horizontal distance under which a grounded player is considered to hold the ball.
const HOLD_RADIUS = 0.8;
// Below this height a ball is resting on (or rolling over) the floor.
const AIRBORNE_MIN_HEIGHT = 0.5;
// Centre height of a ball lying on the floor (BallWithTrail radius).
const BALL_REST_Y = 0.22;
const GRAVITY = 9.81;

// Bricks for which auto-snap on ball arrival makes sense.
const SNAPPING_BRICKS = new Set<BrickAction['kind']>([
  'SMASH', 'BIDOUILLE', 'FEINTE', 'JUMP_SERVE', 'FLOAT_SERVE',
  'PASSE_HAUTE', 'PASSE_TENDUE', 'BLOC', 'MANCHETTE', 'DEFENSE_PLONGEE',
]);

// Jumping bricks intercept the ball IN MID-AIR rather than at its landing spot.
// For these, the snap check looks at where the ball comes FROM (the previous
// step's ballPosition) instead of where it lands — and when contactAtRatio is
// set, the ball_move gets split into two segments at the contact point.
const JUMPING_BRICKS = new Set<BrickAction['kind']>([
  'SMASH', 'FEINTE', 'JUMP_SERVE', 'BLOC',
]);

// Poses that represent a moment of contact with the ball — fired right when the
// ball arrives on the player. READY/RESET are static stances that interpolate
// during the transition. Exported so decompile.ts uses the same definition.
export const CONTACT_POSES: ReadonlySet<PoseName> = new Set(['BUMP', 'SET', 'SPIKE', 'ARM_SPIKE']);

function positionsEqual(a: [number, number, number], b: [number, number, number]): boolean {
  return (
    Math.abs(a[0] - b[0]) < EPSILON &&
    Math.abs(a[1] - b[1]) < EPSILON &&
    Math.abs(a[2] - b[2]) < EPSILON
  );
}

// Compile editor steps into a runnable Scenario by computing the actions
// needed to transition from each snapshot to the next. Bricks attached to
// each step expand into additional sub-actions (jump + pose + landing, etc.)
// after the diff-based actions are emitted.
//
// Timing model:
//   step 0 → state at t=0, shown statically during tempo[0] ("intro" pause)
//   step N (N≥1) → state reached at startTime[N] = previous cumulative + tempo[N]
//   the transition INTO snapshot N runs over [startTime[N] − tempo[N], startTime[N]]
//   contact poses fire AT startTime[N] (= ball arrival), short duration
//   static poses (READY/RESET) fire at transition start, interpolate during transition
export function compileScenario(state: EditorState): Scenario {
  const timeline: TimelineAction[] = [];
  const steps: ScenarioStep[] = [];
  const flights: BallFlight[] = [];

  if (state.steps.length === 0) {
    return buildEmpty(state);
  }

  const firstStep = state.steps[0];

  // Step 0 → initial state at t=0.
  steps.push({
    id: firstStep.id,
    startTime: 0,
    title: firstStep.title,
    description: firstStep.description,
  });
  // Initial poses fire at t=0 with a short duration.
  if (firstStep.snapshot.poses) {
    for (const [id, pose] of Object.entries(firstStep.snapshot.poses)) {
      timeline.push({
        type: 'player_pose',
        time: 0,
        id,
        pose,
        duration: CONTACT_DURATION,
      });
    }
  }
  // Bricks on step 0 expand inside a zero-length window — used rarely (e.g.
  // a serve that already plays during the intro pause). Treat the intro
  // duration as the brick window so the expansion has somewhere to live.
  if (firstStep.actions?.length) {
    const introDuration = TEMPO_DURATIONS[firstStep.tempo];
    for (const brick of firstStep.actions) {
      const startPos = firstStep.snapshot.positions[brick.playerId] ?? [0, 0, 0];
      timeline.push(...expandBrick(brick, {
        windowStart: 0,
        windowDuration: introDuration,
        startPos,
      }));
    }
  }

  // After the step-0 intro pause, transitions begin.
  // `durationOverride` (when set) wins over the discrete tempo bucket so
  // migrated scenarios can preserve their exact original pacing.
  const stepDuration = (step: EditorStep): number =>
    step.durationOverride ?? TEMPO_DURATIONS[step.tempo];
  let cumulativeTime = stepDuration(firstStep);

  for (let i = 1; i < state.steps.length; i++) {
    const prev = state.steps[i - 1];
    const curr = state.steps[i];
    const transitionDuration = stepDuration(curr);
    const transitionStart = roundTime(cumulativeTime);
    const arrivalTime = roundTime(transitionStart + transitionDuration);

    // 1. Player moves — animate over the whole transition window.
    //    Skip players who own a brick this step: bricks own that player's movement.
    const playersOwnedByBricks = new Set(curr.actions?.map(a => a.playerId) ?? []);
    for (const player of state.players) {
      if (playersOwnedByBricks.has(player.id)) continue;
      const prevPos = prev.snapshot.positions[player.id];
      const currPos = curr.snapshot.positions[player.id];
      if (!prevPos || !currPos) continue;
      if (!positionsEqual(prevPos, currPos)) {
        timeline.push({
          type: 'player_move',
          time: transitionStart,
          id: player.id,
          to: currPos,
          duration: transitionDuration,
        });
      }
    }

    // 2. Ball move — emit either a single segment, or a split pair when a
    //    jumping brick intercepts the ball mid-flight. The split lets the ball
    //    physically pass through the player's hand at apex.
    const ballMoved = !positionsEqual(prev.snapshot.ballPosition, curr.snapshot.ballPosition);
    const interceptor = findJumpInterceptor(curr.actions, prev.snapshot.ballPosition, curr.snapshot.ballPosition);

    // The "primary" ball action is the segment that ends at the contact point —
    // its arrival time is what jumping bricks snap onto. For a single-segment
    // ball_move, primary === sole action.
    let primaryBallAction: BallMoveAction | null = null;
    let contactArrivalTime: number | undefined;

    if (ballMoved) {
      // We only split the ball_move into two segments when the ball clearly
      // flies PAST the contact point during this window — i.e. the ball's
      // destination XZ is meaningfully different from the brick's impact XZ.
      // When the ball just arrives ON the contact zone (e.g. a "ball arrives
      // at the smasher's hand" step where the spike itself happens in the
      // next window), splitting would invent a fake second segment. In that
      // case we emit a single ball_move and the contact pose snaps to its end.
      const dxImpact = interceptor
        ? curr.snapshot.ballPosition[0] - interceptor.impact[0]
        : 0;
      const dzImpact = interceptor
        ? curr.snapshot.ballPosition[2] - interceptor.impact[2]
        : 0;
      const ballFliesPastImpact = interceptor
        ? Math.hypot(dxImpact, dzImpact) > SYNC_RADIUS
        : false;

      if (interceptor && interceptor.contactAtRatio !== undefined && ballFliesPastImpact) {
        const segments = buildSplitBallMove(prev, curr, transitionStart, transitionDuration, interceptor);
        timeline.push(...segments);
        flights.push({ action: segments[0], arrivalStep: curr, isApproach: true });
        flights.push({ action: segments[1], arrivalStep: curr, isApproach: false });
        primaryBallAction = segments[0];
        contactArrivalTime = primaryBallAction.time + primaryBallAction.duration;
      } else {
        primaryBallAction = buildBallMove(prev, curr, transitionStart, transitionDuration);
        timeline.push(primaryBallAction);
        flights.push({ action: primaryBallAction, arrivalStep: curr, isApproach: false });
        contactArrivalTime = primaryBallAction.time + primaryBallAction.duration;
      }
    } else {
      // A ball held by a player who walks away goes with him instead of
      // staying in the air where he left it.
      const carriedTo = carriedBallTarget(prev, curr, playersOwnedByBricks);
      if (carriedTo) {
        timeline.push({
          type: 'ball_move',
          time: transitionStart,
          from: prev.snapshot.ballPosition,
          to: carriedTo,
          duration: transitionDuration,
          arc: false,
          curve: 'flat',
          carried: true,
        });
      }
    }

    // 3. Bricks — expand each into sub-actions inside the transition window.
    //    Jumping bricks snap onto the contact arrival (= end of segment 1 when
    //    split, or end of the single ball_move otherwise). Ground bricks still
    //    snap onto the ball's final destination.
    if (curr.actions?.length) {
      for (const brick of curr.actions) {
        const startPos = prev.snapshot.positions[brick.playerId] ?? [0, 0, 0];
        const snapTime = contactTimeFor(
          brick, primaryBallAction, prev.snapshot.ballPosition, transitionStart, contactArrivalTime,
        );
        const ctx: ExpandContext = {
          windowStart: transitionStart,
          windowDuration: transitionDuration,
          startPos,
          ballArrivalTime: snapTime,
        };
        timeline.push(...expandBrick(brick, ctx));
      }
    }

    // 5. Manual poses — contact at arrival, static stances during the transition.
    //    Bricks already produced poses for their owners, so skip those players here.
    if (curr.snapshot.poses) {
      for (const [id, pose] of Object.entries(curr.snapshot.poses)) {
        if (playersOwnedByBricks.has(id)) continue;
        const isContact = CONTACT_POSES.has(pose);
        timeline.push({
          type: 'player_pose',
          time: isContact ? arrivalTime : transitionStart,
          id,
          pose,
          duration: isContact ? CONTACT_DURATION : Math.min(transitionDuration, 0.3),
        });
      }
    }

    steps.push({
      id: curr.id,
      startTime: arrivalTime,
      title: curr.title,
      description: curr.description,
    });

    cumulativeTime = arrivalTime;
  }

  settleAirborneBall(timeline, flights, roundTime(cumulativeTime));

  const players: ScenarioPlayerConfig[] = state.players.map(p => ({
    id: p.id,
    label: p.label,
    role: p.role,
    color: p.color,
    position: firstStep.snapshot.positions[p.id] ?? [0, 0, 0],
  }));

  return {
    id: state.metadata.id || 'editor-scenario',
    title: state.metadata.title || 'Scénario sans titre',
    shortDescription: state.metadata.shortDescription,
    config: {
      teamSize: state.metadata.teamSize,
      phase: state.metadata.phase,
      contextLabel: state.metadata.contextLabel,
      ...(state.metadata.system && { system: state.metadata.system }),
      ...(state.metadata.rotation && { rotation: state.metadata.rotation }),
    },
    defaultCamera: state.metadata.defaultCamera,
    players,
    initialBallPosition: firstStep.snapshot.ballPosition,
    timeline,
    steps,
    summary: {
      keyPoints: state.summary.keyPoints.filter(s => s.trim().length > 0),
      commonMistakes: state.summary.commonMistakes.filter(s => s.trim().length > 0),
    },
  };
}

// Build the ball_move for the transition into `curr`, choosing trajectory
// from explicit ballTrajectory, falling back to the legacy heuristic.
function buildBallMove(
  prev: EditorStep,
  curr: EditorStep,
  transitionStart: number,
  transitionDuration: number,
): BallMoveAction {
  const from = prev.snapshot.ballPosition;
  const to = curr.snapshot.ballPosition;

  if (curr.ballTrajectory) {
    const { curve, apex } = curr.ballTrajectory;
    return {
      type: 'ball_move',
      time: transitionStart,
      from,
      to,
      duration: transitionDuration,
      arc: curve === 'flat' ? false : (apex ?? Math.max(from[1], to[1], 2.5)),
      curve,
      apex,
    };
  }

  // Legacy heuristic: short low travel = flat, otherwise medium arc.
  const heightDelta = Math.abs(to[1] - from[1]);
  const dist = Math.hypot(to[0] - from[0], to[2] - from[2]);
  const arc: number | false = dist < 1.2 && heightDelta < 0.3
    ? false
    : Math.max(from[1], to[1], 2.5);
  return {
    type: 'ball_move',
    time: transitionStart,
    from,
    to,
    duration: transitionDuration,
    arc,
  };
}

// Decide when a contact brick touches the ball in its window, or undefined
// when the ball never comes near the brick's impact spot.
//
// Jumping bricks (smash, feinte, jump_serve, bloc) intercept the ball
// MID-FLIGHT: they snap onto the contact arrival whether the ball comes from
// the impact area or lands on it.
//
// Ground bricks (manchette, set, etc.) touch the ball either when it lands on
// the player (destination near the impact) or when it leaves the player
// (origin near the impact: the step shows the ball flying away after a dig or
// a set). In the second case the contact happens at the very start of the
// window; firing it at the arrival would show the gesture once the ball is
// already far away.
function contactTimeFor(
  brick: BrickAction,
  ballAction: BallMoveAction | null,
  prevBallPos: [number, number, number],
  transitionStart: number,
  contactArrivalTime: number | undefined,
): number | undefined {
  if (!ballAction) return undefined;
  if (!SNAPPING_BRICKS.has(brick.kind)) return undefined;
  // Movement-only bricks (no `impact`) won't pass the type narrowing; guard.
  if (!('impact' in brick)) return undefined;

  // When the ball_move was split, ballAction.to IS the contact point.
  const distFromOrigin = Math.hypot(prevBallPos[0] - brick.impact[0], prevBallPos[2] - brick.impact[2]);
  const distFromDest = Math.hypot(ballAction.to[0] - brick.impact[0], ballAction.to[2] - brick.impact[2]);
  if (Math.min(distFromOrigin, distFromDest) >= SYNC_RADIUS) return undefined;

  if (JUMPING_BRICKS.has(brick.kind)) return contactArrivalTime;
  return distFromOrigin < distFromDest ? transitionStart : contactArrivalTime;
}

// Find a jumping brick that intercepts the ball mid-flight in this step.
// Returns the first matching brick whose `impact` is "between" the ball's
// origin and destination (XZ) — i.e. the ball plausibly passes through it.
function findJumpInterceptor(
  actions: ReadonlyArray<BrickAction> | undefined,
  _prevBallPos: [number, number, number],
  currBallPos: [number, number, number],
): JumpingBrick | null {
  if (!actions || actions.length === 0) return null;
  // When the step has multiple jumping bricks (e.g. a real SMASH on R4a plus
  // BLOC bricks on the opposing blockers), the OFFENSIVE jump (SMASH /
  // JUMP_SERVE / FEINTE) is the one that physically meets the ball — the
  // BLOC bricks are defensive distractors that may or may not touch it.
  // First pass tries offensive bricks only; if none, fall back to any.
  const OFFENSIVE = new Set<BrickAction['kind']>(['SMASH', 'JUMP_SERVE', 'FEINTE']);
  const pickClosest = (filter: (k: BrickAction['kind']) => boolean): JumpingBrick | null => {
    let best: JumpingBrick | null = null;
    let bestDist = Infinity;
    for (const brick of actions) {
      if (!JUMPING_BRICKS.has(brick.kind)) continue;
      if (!('impact' in brick)) continue;
      if (!filter(brick.kind)) continue;
      const dx = currBallPos[0] - brick.impact[0];
      const dz = currBallPos[2] - brick.impact[2];
      const d = Math.hypot(dx, dz);
      if (d < bestDist) {
        bestDist = d;
        best = brick as JumpingBrick;
      }
    }
    return best;
  };
  return pickClosest(k => OFFENSIVE.has(k)) ?? pickClosest(() => true);
}

// Split the step's ball_move into two segments at the brick's contact point.
// Segment 1 = ball travels from previous position to the contact point (arc).
// Segment 2 = ball travels from contact point to its final destination (flat,
// since this models the spike's flat trajectory).
function buildSplitBallMove(
  prev: EditorStep,
  curr: EditorStep,
  transitionStart: number,
  transitionDuration: number,
  brick: JumpingBrick,
): BallMoveAction[] {
  const from = prev.snapshot.ballPosition;
  const to = curr.snapshot.ballPosition;
  const ratio = clamp01(brick.contactAtRatio ?? 0.55);

  // Allocate the two segment durations so their sum equals transitionDuration
  // exactly. The minimum-duration floor would otherwise let seg1+seg2 exceed
  // the window when ratio is extreme (e.g. 0.95 with a 0.15s window). We honor
  // the ratio as best we can while keeping each segment above MIN_SEG.
  const MIN_SEG = 0.1;
  let seg1Dur = transitionDuration * ratio;
  let seg2Dur = transitionDuration - seg1Dur;
  if (transitionDuration >= 2 * MIN_SEG) {
    seg1Dur = Math.max(MIN_SEG, Math.min(transitionDuration - MIN_SEG, seg1Dur));
    seg2Dur = transitionDuration - seg1Dur;
  }

  // Contact point in 3D: XZ from the brick's impact, Y at the raised hand of
  // the player at the top of the jump.
  const jumpHeight = brick.jumpHeight ?? defaultJumpHeightFor(brick.kind);
  const contactY = jumpHeight + HAND_REACH;
  const contact: [number, number, number] = [brick.impact[0], contactY, brick.impact[2]];

  // Approach arc: a set climbs above the striking hand and comes down onto it.
  // When the ball already hangs next to the hand (the pass step left it
  // there), it only drifts onto the contact point.
  const approachDist = Math.hypot(contact[0] - from[0], contact[2] - from[2]);
  const approachApex = approachDist < SYNC_RADIUS
    ? Math.max(from[1], contactY)
    : Math.max(from[1], contactY) + SET_LIFT;
  const seg1: BallMoveAction = {
    type: 'ball_move',
    time: transitionStart,
    from,
    to: contact,
    duration: seg1Dur,
    arc: approachApex,
    curve: 'arc',
    apex: approachApex,
  };

  // Segment 2: the spike. Flat, fast trajectory to the final destination,
  // unless the step asks for an arc: a topspin back-row attack dipping over
  // the net, a tip lobbed over the block. For BLOC, the segment is the
  // rebound, always an arc.
  const isArc = brick.kind === 'BLOC' || curr.ballTrajectory?.curve === 'arc';
  const seg2Apex = Math.max(contactY, to[1], curr.ballTrajectory?.apex ?? 0);
  const seg2: BallMoveAction = {
    type: 'ball_move',
    time: roundTime(transitionStart + seg1Dur),
    from: contact,
    to,
    duration: seg2Dur,
    arc: isArc ? seg2Apex : false,
    curve: isArc ? 'arc' : 'flat',
    apex: isArc ? seg2Apex : undefined,
  };

  return [seg1, seg2];
}

type BallFlight = {
  action: BallMoveAction;
  // Step whose snapshot the ball reaches at the end of this flight.
  arrivalStep: EditorStep;
  // First half of a split ball_move: the ball flies to a jumping player's hand.
  isApproach: boolean;
};

// A ball never waits in the air. When a flight ends above the floor, nobody
// holds the ball and nobody touches it on arrival, the flight is adjusted:
//   - the next flight carries the ball to a jumping player's hand: both are
//     merged into one flight that reaches the hand exactly at contact time
//     (typically a set that lands next to the hitter before the smash step);
//   - otherwise, when the ball stays there for a while (the next step does
//     not move it): the flight lasts until the next one starts, so the ball
//     arrives exactly when it is played again, or, when nothing follows, the
//     ball falls to the floor under gravity.
function settleAirborneBall(
  timeline: TimelineAction[],
  flights: BallFlight[],
  scenarioEnd: number,
): void {
  const ordered = [...flights].sort((a, b) => a.action.time - b.action.time);
  for (let i = 0; i < ordered.length; i++) {
    const flight = ordered[i];
    const a = flight.action;
    const end = a.time + a.duration;
    const next = ordered[i + 1];
    const nextStart = next ? next.action.time : scenarioEnd;
    const flowsIntoHit = next !== undefined && next.isApproach && a.curve !== 'flat';
    if (a.to[1] < AIRBORNE_MIN_HEIGHT) continue;
    if (!flowsIntoHit && nextStart - end < 0.05) continue;
    if (isHeld(a.to, flight.arrivalStep)) continue;
    if (isTouchedOnArrival(timeline, a.to, flight.arrivalStep, end)) continue;

    if (next && flowsIntoHit) {
      const b = next.action;
      const apex = Math.max(apexOf(a), b.to[1]);
      a.to = b.to;
      a.duration = roundTime(b.time + b.duration - a.time);
      a.curve = 'arc';
      a.apex = apex;
      a.arc = apex;
      timeline.splice(timeline.indexOf(b), 1);
      ordered.splice(i + 1, 1);
    } else if (next) {
      a.duration = roundTime(nextStart - a.time);
    } else {
      const rest: [number, number, number] = [a.to[0], BALL_REST_Y, a.to[2]];
      timeline.push({
        type: 'ball_move',
        time: roundTime(end),
        from: a.to,
        to: rest,
        duration: roundTime(Math.sqrt((2 * (a.to[1] - BALL_REST_Y)) / GRAVITY)),
        arc: a.to[1],
        curve: 'arc',
        apex: a.to[1],
      });
    }
  }
}

function apexOf(action: BallMoveAction): number {
  return action.apex
    ?? (typeof action.arc === 'number' ? action.arc : Math.max(action.from[1], action.to[1]));
}

// A grounded player standing next to a ball at hands height holds it (a
// server before the toss, a setter about to set).
function isHeld(ball: [number, number, number], step: EditorStep): boolean {
  return holderOf(ball, step) !== null;
}

function holderOf(ball: [number, number, number], step: EditorStep): string | null {
  if (ball[1] > HOLD_MAX_HEIGHT || ball[1] < HOLD_MIN_HEIGHT) return null;
  if (step.snapshot.ballAttachedTo) return step.snapshot.ballAttachedTo;
  let best: string | null = null;
  let bestDist = HOLD_RADIUS;
  for (const [id, p] of Object.entries(step.snapshot.positions)) {
    const d = Math.hypot(p[0] - ball[0], p[2] - ball[2]);
    if (d < bestDist) {
      best = id;
      bestDist = d;
    }
  }
  return best;
}

// Where a held ball goes when its holder moves during a step in which the
// ball itself is not played: it keeps its offset to the holder.
function carriedBallTarget(
  prev: EditorStep,
  curr: EditorStep,
  playersOwnedByBricks: ReadonlySet<string>,
): [number, number, number] | null {
  const ball = prev.snapshot.ballPosition;
  const holder = holderOf(ball, prev);
  if (!holder || playersOwnedByBricks.has(holder)) return null;
  const from = prev.snapshot.positions[holder];
  const to = curr.snapshot.positions[holder];
  if (!from || !to || positionsEqual(from, to)) return null;
  return [ball[0] + to[0] - from[0], ball[1], ball[2] + to[2] - from[2]];
}

// A strike fired at the arrival by a player close to the ball means the ball
// is played right there: its flight is not adjusted. ARM_SPIKE is left out on
// purpose: it is also the windup an attacker takes while jumping to the ball.
const STRIKE_POSES: ReadonlySet<PoseName> = new Set(['BUMP', 'SET', 'SPIKE']);

function isTouchedOnArrival(
  timeline: TimelineAction[],
  ball: [number, number, number],
  step: EditorStep,
  time: number,
): boolean {
  return timeline.some(action => {
    if (action.type !== 'player_pose' || !STRIKE_POSES.has(action.pose)) return false;
    if (Math.abs(action.time - time) > 0.06) return false;
    const pos = step.snapshot.positions[action.id];
    return pos !== undefined && Math.hypot(pos[0] - ball[0], pos[2] - ball[2]) < SYNC_RADIUS;
  });
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

// Look up the canonical jump height for a jumping brick — sourced from the
// expansion module so UI and compiler stay in sync.
function defaultJumpHeightFor(kind: JumpingBrick['kind']): number {
  switch (kind) {
    case 'SMASH':      return DEFAULT_JUMP.smash;
    case 'FEINTE':     return DEFAULT_JUMP.feinte;
    case 'JUMP_SERVE': return DEFAULT_JUMP.jumpServe;
    case 'BLOC':       return DEFAULT_JUMP.bloc;
  }
}

function roundTime(t: number): number {
  return Math.round(t * 1000) / 1000;
}

function buildEmpty(state: EditorState): Scenario {
  return {
    id: state.metadata.id || 'editor-empty',
    title: state.metadata.title || 'Scénario vide',
    shortDescription: state.metadata.shortDescription,
    config: {
      teamSize: state.metadata.teamSize,
      phase: state.metadata.phase,
      contextLabel: state.metadata.contextLabel,
      ...(state.metadata.system && { system: state.metadata.system }),
      ...(state.metadata.rotation && { rotation: state.metadata.rotation }),
    },
    players: [],
    initialBallPosition: [0, 1.0, 5],
    timeline: [],
    steps: [],
    summary: { keyPoints: [], commonMistakes: [] },
  };
}

// Re-exported for use by UI helpers (e.g. "explode brick" button) — not part
// of the public compile API but kept here so callers don't need a deep import.
export { BRICK_BY_KIND };
