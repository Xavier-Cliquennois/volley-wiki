// Court coordinate system (matches Court.tsx and existing visualizer)
// - Court: 9m wide (X axis) x 18m long (Z axis)
// - Net at z = 0
// - Our side: z > 0 (positive)
// - Opponent side: z < 0 (negative)
// - Y axis: height
// - Positions 1-6 (FIVB numbering) on our side, viewed from behind:
//     P4 (front-left, x<0)   P3 (front-center)   P2 (front-right, x>0)
//     P5 (back-left)          P6 (back-center)    P1 (back-right)

export type TeamSize = 4 | 5 | 6;
export type PhaseKind = 'attack' | 'defense' | 'reception';

// Optional tactical tags so a scenario can be linked back to a specific
// team system + rotation. Used by the /scenarios filter and by the
// SystemDetail page to show "see related scenarios" links.
export type ScenarioSystemTag = '5-1' | '6-2' | '4-2';
export type ScenarioRotationTag = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6';

export type PlayerRole =
  | 'setter'
  | 'opposite'
  | 'middle'
  | 'outside'
  | 'libero'
  | 'opponent'
  | 'generic';

export type ScenarioPlayerConfig = {
  id: string;
  label: string;
  role: PlayerRole;
  color: string;
  position: [number, number, number];
};

// Trajectory styles for the ball.
// - 'arc'     : symmetric parabola (default — passe haute, smash en cloche)
// - 'flat'    : straight tween (smash tendu, manchette tendue)
// - 'floater' : ease-in then sharp drop (service flottant, balle qui « tombe »)
export type BallCurve = 'arc' | 'flat' | 'floater';

// Action shapes match what useTactic already understands.
// Legacy `arc: number | false` is still accepted for backwards compatibility:
// arc=number → curve='arc' with apex=arc; arc=false → curve='flat'.
export type BallMoveAction = {
  type: 'ball_move';
  time: number;
  from: [number, number, number];
  to: [number, number, number];
  duration: number;
  arc: number | false;
  // Optional explicit trajectory. When provided, takes precedence over `arc`.
  curve?: BallCurve;
  apex?: number;
  description?: string;
};

export type PlayerMoveAction = {
  type: 'player_move';
  time: number;
  id: string;
  to: [number, number, number];
  duration: number;
  description?: string;
};

export type PlayerPoseAction = {
  type: 'player_pose';
  time: number;
  id: string;
  pose: 'BUMP' | 'SET' | 'SPIKE' | 'ARM_SPIKE' | 'READY' | 'RESET';
  duration: number;
  description?: string;
  text?: string;
};

export type TimelineAction = BallMoveAction | PlayerMoveAction | PlayerPoseAction;

// Narrative step shown in the side card / timeline strip
// Multiple actions can map to the same narrative step via stepId
export type ScenarioStep = {
  id: string;
  startTime: number;
  title: string;
  description: string;
};

export type ScenarioConfig = {
  teamSize: TeamSize;
  phase: PhaseKind;
  contextLabel: string;
  // Tactical tags — present only on scenarios that demonstrate a specific
  // system (and optionally a specific rotation within that system).
  system?: ScenarioSystemTag;
  rotation?: ScenarioRotationTag;
};

export type ScenarioSummary = {
  keyPoints: string[];
  commonMistakes: string[];
};

export type CameraPreset = 'DEFAULT' | 'TOP_DOWN' | 'BEHIND_SERVE' | 'ATTACKER_VIEW';

export type Scenario = {
  id: string;
  title: string;
  shortDescription: string;
  config: ScenarioConfig;
  players: ScenarioPlayerConfig[];
  initialBallPosition: [number, number, number];
  timeline: TimelineAction[];
  steps: ScenarioStep[];
  summary: ScenarioSummary;
  defaultCamera?: CameraPreset;
};
