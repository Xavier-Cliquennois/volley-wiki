import type {
  BallCurve,
  CameraPreset,
  PhaseKind,
  PlayerRole,
  Scenario,
  TeamSize,
} from '../scenarios/types';
import type { BrickAction } from './bricks';

// Tempo for the transition INTO a step (from the previous snapshot to this one).
// 'pause' is for the very first step — no movement, only reading time.
// Standard durations cover the common pacing needs of a tactical scenario:
//   pause    = static intro (or a beat between actions)
//   calme    = unhurried transition (slow setup, repositioning)
//   standard = default action tempo (most steps)
//   rapide   = quick action (smash, dive, fast switch)
export type StepTempo = 'pause' | 'calme' | 'standard' | 'rapide';

export const TEMPO_DURATIONS: Record<StepTempo, number> = {
  pause:    1.0,
  calme:    2.5,
  standard: 1.5,
  rapide:   0.7,
};

// UI metadata for the tempo picker: short label + a subtitle hint.
export const TEMPO_META: Record<StepTempo, { label: string; subtitle: string }> = {
  pause:    { label: 'Pause',    subtitle: '1 s · lecture' },
  calme:    { label: 'Calme',    subtitle: '2.5 s · ample' },
  standard: { label: 'Standard', subtitle: '1.5 s · défaut' },
  rapide:   { label: 'Rapide',   subtitle: '0.7 s · vif' },
};

// Migrate legacy tempo values from a previous version of the editor.
// Returns the closest-equivalent new tempo. Safe to call on already-new values.
export function migrateLegacyTempo(t: string): StepTempo {
  switch (t) {
    case 'intro':  return 'pause';
    case 'normal': return 'calme';   // 2s ≈ calme (2.5s)
    case 'fast':   return 'rapide';
    case 'pause':
    case 'calme':
    case 'standard':
    case 'rapide': return t;
    default:       return 'standard';
  }
}

// Pose names supported by the runtime (mirrors useTactic.ts).
export type PoseName = 'BUMP' | 'SET' | 'SPIKE' | 'ARM_SPIKE' | 'READY' | 'RESET';

export type EditorPlayer = {
  id: string;
  label: string;
  role: PlayerRole;
  color: string;
};

export type EditorSnapshot = {
  positions: Record<string, [number, number, number]>;
  ballPosition: [number, number, number];
  // Optional per-player pose applied at the START of the transition into this step.
  poses?: Record<string, PoseName>;
  // When set, the ball is "carried" by this player: dragging the player also
  // moves the ball, and the canvas draws a link between them. Cleared when the
  // user drags the ball away from the player.
  ballAttachedTo?: string;
};

// Trajectory shape for the ball's flight INTO this step. Matches BallMoveAction.curve.
// `apex` is the peak height in metres for arc/floater curves.
export type BallTrajectory = {
  curve: BallCurve;
  apex?: number;
};

export type EditorStep = {
  id: string;
  title: string;
  description: string;
  tempo: StepTempo;
  snapshot: EditorSnapshot;
  // Composite high-level actions that expand into player_move + player_pose
  // at compile time. They live alongside the snapshot so the author can
  // express "this player smashes" without authoring 4 separate sub-cards.
  actions?: BrickAction[];
  // Explicit ball trajectory for the transition INTO this step.
  // When omitted, compileScenario falls back to a heuristic (existing behaviour).
  ballTrajectory?: BallTrajectory;
  // Exact transition duration in seconds. When set, this wins over `tempo` for
  // timing — used by migrations from legacy scenarios that need to preserve
  // their original pacing exactly. The editor UI may still expose `tempo` as
  // the primary input; `durationOverride` is the escape hatch.
  durationOverride?: number;
};

export type EditorState = {
  metadata: {
    id: string;
    title: string;
    shortDescription: string;
    teamSize: TeamSize;
    phase: PhaseKind;
    contextLabel: string;
    defaultCamera?: CameraPreset;
  };
  players: EditorPlayer[];
  steps: EditorStep[];
  summary: {
    keyPoints: string[];
    commonMistakes: string[];
  };
};

// The compiled scenario is the same shape consumed by ScenarioPlayer.
export type CompiledScenario = Scenario;
