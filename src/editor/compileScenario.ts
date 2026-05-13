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
import type { BrickAction, ExpandContext } from './bricks';

const EPSILON = 0.001;
const CONTACT_DURATION = 0.2;
// Auto-snap radius: if the ball lands within this distance of a player who
// owns a contact-flavoured brick in the same step, the brick's apex pose is
// synchronized with the ball arrival. Larger than 0.9 (auto-pose radius) so
// authors get the snap even when their impact spot is approximate.
const AUTO_SNAP_RADIUS = 1.2;

// Bricks for which auto-snap on ball arrival makes sense.
const SNAPPING_BRICKS = new Set<BrickAction['kind']>([
  'SMASH', 'BIDOUILLE', 'FEINTE', 'JUMP_SERVE', 'FLOAT_SERVE',
  'PASSE_HAUTE', 'PASSE_TENDUE', 'BLOC', 'MANCHETTE', 'DEFENSE_PLONGEE',
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

    // 2. Ball move — same window. Honor explicit ballTrajectory when present.
    let ballAction: BallMoveAction | null = null;
    if (!positionsEqual(prev.snapshot.ballPosition, curr.snapshot.ballPosition)) {
      ballAction = buildBallMove(prev, curr, transitionStart, transitionDuration);
      timeline.push(ballAction);
    }

    // 3. Auto-snap: figure out if the ball lands near a brick owner this step.
    //    When yes, the brick's apex/contact is timed exactly on ball arrival.
    const ballArrivalTime = ballAction ? ballAction.time + ballAction.duration : undefined;

    // 4. Bricks — expand each into sub-actions inside the transition window.
    if (curr.actions?.length) {
      for (const brick of curr.actions) {
        const startPos = prev.snapshot.positions[brick.playerId] ?? [0, 0, 0];
        const snapTime = shouldSnap(brick, ballAction)
          ? ballArrivalTime
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
// actually lands close to the brick's impact spot.
function shouldSnap(brick: BrickAction, ballAction: BallMoveAction | null): boolean {
  if (!ballAction) return false;
  if (!SNAPPING_BRICKS.has(brick.kind)) return false;
  // Movement-only bricks (no `impact`) won't pass the type narrowing; guard.
  if (!('impact' in brick)) return false;
  const dx = ballAction.to[0] - brick.impact[0];
  const dz = ballAction.to[2] - brick.impact[2];
  return Math.hypot(dx, dz) < AUTO_SNAP_RADIUS;
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
