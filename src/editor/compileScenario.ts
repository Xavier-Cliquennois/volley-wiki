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
import { DEFAULT_JUMP } from './bricks/expand';
import type {
  BrickAction,
  ExpandContext,
} from './bricks';
import { SYNC_RADIUS, type JumpingBrick } from './smashSync';

const EPSILON = 0.001;
const CONTACT_DURATION = 0.2;

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
  let cumulativeTime = TEMPO_DURATIONS[firstStep.tempo];

  for (let i = 1; i < state.steps.length; i++) {
    const prev = state.steps[i - 1];
    const curr = state.steps[i];
    const transitionDuration = TEMPO_DURATIONS[curr.tempo];
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
        primaryBallAction = segments[0];
        contactArrivalTime = primaryBallAction.time + primaryBallAction.duration;
      } else {
        primaryBallAction = buildBallMove(prev, curr, transitionStart, transitionDuration);
        timeline.push(primaryBallAction);
        contactArrivalTime = primaryBallAction.time + primaryBallAction.duration;
      }
    }

    // 3. Bricks — expand each into sub-actions inside the transition window.
    //    Jumping bricks snap onto the contact arrival (= end of segment 1 when
    //    split, or end of the single ball_move otherwise). Ground bricks still
    //    snap onto the ball's final destination.
    if (curr.actions?.length) {
      for (const brick of curr.actions) {
        const startPos = prev.snapshot.positions[brick.playerId] ?? [0, 0, 0];
        const snapTime = shouldSnap(brick, primaryBallAction, prev.snapshot.ballPosition)
          ? contactArrivalTime
          : undefined;
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

// Decide if a brick should auto-snap onto the ball arrival in its window.
// Only snap if (a) the brick is a contact-flavoured one, and (b) the ball
// actually meets the brick's impact spot at some point during its flight.
//
// For jumping bricks (smash, feinte, jump_serve, bloc), the ball is intercepted
// MID-FLIGHT — so the right proximity check is against the ball's ORIGIN (where
// it comes from in this step). For ground bricks (manchette, set, etc.), the
// ball lands on the player so we check against the destination as before.
function shouldSnap(
  brick: BrickAction,
  ballAction: BallMoveAction | null,
  prevBallPos: [number, number, number],
): boolean {
  if (!ballAction) return false;
  if (!SNAPPING_BRICKS.has(brick.kind)) return false;
  // Movement-only bricks (no `impact`) won't pass the type narrowing; guard.
  if (!('impact' in brick)) return false;

  const isJumping = JUMPING_BRICKS.has(brick.kind);
  // When the ball_move was split, ballAction.to IS the contact point — so
  // checking against ballAction.to works for both jumping and ground bricks.
  // For unsplit jumping bricks, we fall back to the previous position (where
  // the ball is "coming from") since the impact happens mid-flight.
  const refX = isJumping ? prevBallPos[0] : ballAction.to[0];
  const refZ = isJumping ? prevBallPos[2] : ballAction.to[2];
  // For ground bricks, prefer the destination point (where it lands).
  const destX = ballAction.to[0];
  const destZ = ballAction.to[2];

  const distFromOrigin = Math.hypot(refX - brick.impact[0], refZ - brick.impact[2]);
  const distFromDest = Math.hypot(destX - brick.impact[0], destZ - brick.impact[2]);

  // Either origin OR destination near the impact triggers the snap — covers
  // both "ball is here at start of step" (jumping) and "ball lands here" (ground).
  return Math.min(distFromOrigin, distFromDest) < SYNC_RADIUS;
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
  // decoy FEINTEs on Op and C1 to misdirect the block), pick the one whose
  // impact XZ is closest to where the ball is actually going. That's the
  // brick that physically meets the ball — the other jumpers are distractors.
  let best: JumpingBrick | null = null;
  let bestDist = Infinity;
  for (const brick of actions) {
    if (!JUMPING_BRICKS.has(brick.kind)) continue;
    if (!('impact' in brick)) continue;
    const dx = currBallPos[0] - brick.impact[0];
    const dz = currBallPos[2] - brick.impact[2];
    const d = Math.hypot(dx, dz);
    if (d < bestDist) {
      bestDist = d;
      best = brick as JumpingBrick;
    }
  }
  return best;
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

  // Contact point in 3D: XZ from the brick's impact, Y slightly above the
  // jump apex so the ball is at the player's striking hand height.
  const jumpHeight = brick.jumpHeight ?? defaultJumpHeightFor(brick.kind);
  const contactY = Math.max(jumpHeight + 0.5, 2.4);
  const contact: [number, number, number] = [brick.impact[0], contactY, brick.impact[2]];

  const seg1: BallMoveAction = {
    type: 'ball_move',
    time: transitionStart,
    from,
    to: contact,
    duration: seg1Dur,
    // Approach arc — the ball rises from the setter towards the striking zone.
    arc: Math.max(from[1], contactY, 2.5),
    curve: 'arc',
    apex: contactY,
  };

  // Segment 2: the spike. Flat, fast trajectory to the final destination.
  // For BLOC, the "spike" segment is the rebound — still flat but slower.
  const isBloc = brick.kind === 'BLOC';
  const seg2: BallMoveAction = {
    type: 'ball_move',
    time: roundTime(transitionStart + seg1Dur),
    from: contact,
    to,
    duration: seg2Dur,
    arc: false,
    curve: isBloc ? 'arc' : 'flat',
    apex: isBloc ? Math.max(contactY, to[1]) : undefined,
  };

  return [seg1, seg2];
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
