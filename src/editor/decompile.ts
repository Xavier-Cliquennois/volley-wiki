// Inverse of compileScenario: rebuild an editable EditorState from a runtime
// Scenario, by replaying the timeline up to each step.startTime and snapshotting
// the world (player positions, poses, ball position) at that moment.
//
// What's preserved 1:1:
//   - players, summary, metadata, initial ball position
//   - per-step title/description
//   - per-step snapshot (positions/ballPosition/poses), via timeline replay
//   - per-step ballTrajectory (curve + apex), inferred from the ball_move
//     that lands on this step's startTime
//   - tempo (intro/normal/fast), chosen by quantizing the gap between steps
//
// What's NOT preserved:
//   - bricks — we never try to rebuild a SMASH from "approach + jump + pose +
//     land" sub-actions; that inference would be too fragile. The diff between
//     consecutive snapshots produces equivalent low-level moves at compile time
//     anyway, so the playback stays identical. The author can add bricks back
//     in the editor where they want them, replacing the equivalent sub-cards.

import type {
  BallCurve,
  BallMoveAction,
  PlayerMoveAction,
  PlayerPoseAction,
  Scenario,
  TimelineAction,
} from '../scenarios/types';
import { ROLE_OPTIONS } from './defaults';
import { CONTACT_POSES } from './compileScenario';
import type {
  BallTrajectory,
  EditorPlayer,
  EditorSnapshot,
  EditorState,
  EditorStep,
  PoseName,
  StepTempo,
} from './types';
import { TEMPO_DURATIONS } from './types';

// Slack used when matching ball_move arrival to step.startTime — handwritten
// scenarios sometimes round to 0.05s or have intentional 0.1s lag. 0.15s is
// generous enough to catch them all without grabbing unrelated balls.
const ARRIVAL_TOLERANCE = 0.15;

const POSE_NAMES: ReadonlySet<PoseName> = new Set(['BUMP', 'SET', 'SPIKE', 'ARM_SPIKE', 'READY', 'RESET']);

export function decompile(scenario: Scenario): EditorState {
  const players: EditorPlayer[] = scenario.players.map(p => ({
    id: p.id,
    label: p.label,
    role: p.role,
    color: p.color,
  }));

  const initialPositions: Record<string, [number, number, number]> = {};
  for (const p of scenario.players) initialPositions[p.id] = p.position;

  const moveActions = scenario.timeline.filter(isPlayerMove);
  const poseActions = scenario.timeline.filter(isPlayerPose);
  const ballMoves = scenario.timeline.filter(isBallMove)
    .slice()
    .sort((a, b) => a.time - b.time);

  // Snapshot at each step.startTime — the canonical state the editor will edit.
  const steps: EditorStep[] = scenario.steps.map((step, idx) => {
    const isFirst = idx === 0;
    const prevStartTime = isFirst ? 0 : scenario.steps[idx - 1].startTime;
    const transitionDuration = step.startTime - prevStartTime;

    const snapshot: EditorSnapshot = {
      positions: replayPositions(initialPositions, moveActions, step.startTime),
      ballPosition: replayBallPosition(scenario.initialBallPosition, ballMoves, step.startTime),
      poses: replayPosesAt(poseActions, step.startTime, prevStartTime),
    };
    if (!snapshot.poses || Object.keys(snapshot.poses).length === 0) delete snapshot.poses;

    // Map this step's transition duration to the closest standard tempo.
    const tempo: StepTempo = isFirst
      ? 'pause'
      : closestTempo(transitionDuration);

    // ball_move that arrives exactly at this step.startTime drives the
    // step's trajectory. Matched within ARRIVAL_TOLERANCE.
    const ballTrajectory = isFirst
      ? undefined
      : inferBallTrajectory(ballMoves, step.startTime);

    return {
      id: step.id,
      title: step.title,
      description: step.description,
      tempo,
      snapshot,
      ballTrajectory,
    };
  });

  return {
    metadata: {
      id: scenario.id,
      title: scenario.title,
      shortDescription: scenario.shortDescription,
      teamSize: scenario.config.teamSize,
      phase: scenario.config.phase,
      contextLabel: scenario.config.contextLabel,
      defaultCamera: scenario.defaultCamera,
    },
    players,
    steps,
    summary: {
      keyPoints: [...scenario.summary.keyPoints],
      commonMistakes: [...scenario.summary.commonMistakes],
    },
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Timeline replay helpers — pure functions, easy to reason about.
// ──────────────────────────────────────────────────────────────────────────

// World positions at time `t`: take the latest player_move whose end timestamp
// is <= t, fall back to the player's initial position.
function replayPositions(
  initial: Record<string, [number, number, number]>,
  moves: PlayerMoveAction[],
  t: number,
): Record<string, [number, number, number]> {
  const out: Record<string, [number, number, number]> = { ...initial };

  // Group moves by player, keep them sorted by time.
  const byPlayer: Record<string, PlayerMoveAction[]> = {};
  for (const m of moves) (byPlayer[m.id] ||= []).push(m);
  for (const arr of Object.values(byPlayer)) arr.sort((a, b) => a.time - b.time);

  for (const [id, arr] of Object.entries(byPlayer)) {
    let pos = out[id] ?? [0, 0, 0];
    for (const m of arr) {
      // A move with time + duration <= t has fully resolved by t.
      if (m.time + m.duration <= t + 1e-3) pos = m.to;
    }
    out[id] = pos;
  }
  return out;
}

// Ball position at time `t`: same logic as players, but with ball_move actions.
function replayBallPosition(
  initial: [number, number, number],
  moves: BallMoveAction[],
  t: number,
): [number, number, number] {
  let pos = initial;
  for (const m of moves) {
    if (m.time + m.duration <= t + 1e-3) pos = m.to;
  }
  return pos;
}

// Pose state to associate with a step:
//  - contact poses (BUMP/SET/SPIKE/ARM_SPIKE) firing AT step.startTime → that's
//    the canonical "the ball arrives on this player" pose
//  - static poses (READY/RESET) firing AT prevStartTime → that's the "stance
//    held during this transition" — compileScenario does this in reverse.
function replayPosesAt(
  poses: PlayerPoseAction[],
  startTime: number,
  prevStartTime: number,
): Record<string, PoseName> | undefined {
  const out: Record<string, PoseName> = {};
  for (const p of poses) {
    if (!isPoseName(p.pose)) continue;
    const isContact = CONTACT_POSES.has(p.pose);
    if (isContact) {
      if (Math.abs(p.time - startTime) < ARRIVAL_TOLERANCE) out[p.id] = p.pose;
    } else {
      if (Math.abs(p.time - prevStartTime) < ARRIVAL_TOLERANCE) out[p.id] = p.pose;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

// Round a transition duration to one of the supported StepTempo values.
// 'pause' (1s) and 'rapide' (0.7s) overlap on short durations — we prefer
// 'standard' as a sane default by ordering it first so it wins ties.
function closestTempo(duration: number): StepTempo {
  const candidates: Array<{ tempo: StepTempo; d: number }> = [
    { tempo: 'standard', d: TEMPO_DURATIONS.standard },
    { tempo: 'calme',    d: TEMPO_DURATIONS.calme },
    { tempo: 'rapide',   d: TEMPO_DURATIONS.rapide },
    { tempo: 'pause',    d: TEMPO_DURATIONS.pause },
  ];
  let best = candidates[0];
  for (const c of candidates) {
    if (Math.abs(c.d - duration) < Math.abs(best.d - duration)) best = c;
  }
  return best.tempo;
}

// Find the ball_move whose arrival lines up with `arrivalTime`. When found,
// derive its trajectory: explicit curve+apex if the source provided them,
// otherwise translate legacy `arc: number | false` into our new vocabulary.
function inferBallTrajectory(moves: BallMoveAction[], arrivalTime: number): BallTrajectory | undefined {
  for (const m of moves) {
    const arrival = m.time + m.duration;
    if (Math.abs(arrival - arrivalTime) < ARRIVAL_TOLERANCE) {
      if (m.curve) {
        return { curve: m.curve, apex: m.apex };
      }
      // Legacy field — arc=false means flat, arc=number means arc with apex.
      if (m.arc === false) return { curve: 'flat' };
      if (typeof m.arc === 'number') return { curve: 'arc', apex: m.arc };
      return { curve: 'arc' };
    }
  }
  return undefined;
}

// ──────────────────────────────────────────────────────────────────────────
// Type guards — keep the code defensive against malformed timeline entries.
// ──────────────────────────────────────────────────────────────────────────

function isPlayerMove(a: TimelineAction): a is PlayerMoveAction { return a.type === 'player_move'; }
function isPlayerPose(a: TimelineAction): a is PlayerPoseAction { return a.type === 'player_pose'; }
function isBallMove(a: TimelineAction): a is BallMoveAction { return a.type === 'ball_move'; }
function isPoseName(s: string): s is PoseName { return POSE_NAMES.has(s as PoseName); }

// Re-exported so the editor UI can offer a "fill defaults from role" pass on
// imported players that lack the brick-aware metadata.
export { ROLE_OPTIONS };

// Suppress an unused-export lint hint when this module is consumed only by
// ScenarioEditor — but kept explicit because future tests will import it too.
export type { BallCurve };
