// Ball-touch check for the 3D scenarios (`pnpm check:scenarios`).
//
// Every editor scenario is compiled exactly as the site does it
// (`compileScenario`, see src/scenarios/data/index.ts), then the compiled
// timeline is replayed to find, for each step, who touches the ball. Two FIVB
// rules are enforced on the resulting sequence of touches:
//   1. a team plays the ball at most 3 times before sending it over the net;
//   2. a player never plays the ball twice in a row.
// A block is the one exception: it does not count as one of the 3 touches and
// the blocker may play the next touch.
// A third rule is specific to this wiki's 4v4 scenarios: when a team uses its
// 3 touches, they are played by 3 different players (receiver, setter,
// attacker; the fourth player covers). FIVB allows the receiver to attack, but
// the 4v4 formations shown here are built so that he does not.
//
// How a touch is found. The compiled ball flight is a chain of `ball_move`
// segments. The ball is played at every junction between two segments (and at
// the very first departure / the very last arrival): the toucher is the player
// whose contact pose (BUMP, SET, SPIKE, ARM_SPIKE) fires at that moment and who
// stands within reach of the ball. A ball resting on the floor or falling under
// gravity at the end of a scenario is not a touch; a ball that changes its
// course in mid-air with nobody around is reported as an anomaly.
//
// Usage:
//   pnpm check:scenarios            report the faults, exit 1 when there is one
//   pnpm check:scenarios --verbose  also print the touches of every step
//   pnpm check:scenarios <id>...    restrict the check to some scenarios

import { runnerImport } from 'vite';
import type { EditorState } from '../src/editor/types';
import type {
  BallMoveAction,
  PlayerPoseAction,
  Scenario,
  TimelineAction,
} from '../src/scenarios/types';

type Vec3 = [number, number, number];
type Team = 'us' | 'them';

// Contact poses: the moment the ball meets the player (see CONTACT_POSES in
// compileScenario.ts). ARM_SPIKE is also the windup of a smash; it only counts
// when it is the gesture closest in time to the ball.
const TOUCH_POSES = new Set<PlayerPoseAction['pose']>(['BUMP', 'SET', 'SPIKE', 'ARM_SPIKE']);
// A contact pose fires at the start or the end of a ball segment; allow for
// the rounding of the compiled times.
const TIME_TOLERANCE = 0.1;
// Horizontal reach between a player and the ball at contact (SYNC_RADIUS).
const REACH = 1.6;
// A player holding the ball without a gesture (a server before the toss).
const HOLD_REACH = 0.9;
// Below this height the ball is on the floor: the rally is over.
const FLOOR_HEIGHT = 0.5;
// A blocker is in the air, hands above the net, close to it.
const BLOCK_MAX_NET_DISTANCE = 1.5;
const BLOCK_MIN_JUMP = 0.3;

type Touch = {
  time: number;
  playerId: string;
  team: Team;
  gesture: string;
  isBlock: boolean;
  stepIndex: number;
};

type Fault = {
  scenarioId: string;
  stepTitle: string;
  message: string;
};

type ScenarioReport = {
  scenario: Scenario;
  touches: Touch[];
  faults: Fault[];
};

const GESTURE_LABELS: Record<string, string> = {
  BUMP: 'manchette',
  SET: 'passe',
  SPIKE: 'frappe',
  // Not a block: the arm cocked of an attacker the ball reaches before he
  // strikes it. Merged with the strike that follows.
  ARM_SPIKE: 'bras armé',
  HOLD: 'tenue',
};

// ──────────────────────────────────────────────────────────────────────────
// Timeline replay
// ──────────────────────────────────────────────────────────────────────────

// Position of a player at time `t`, replaying its player_move tweens in order.
// The easing does not matter here: only the distance to the ball at contact
// is read, and contacts happen at the start or the end of a tween.
function playerPositionAt(scenario: Scenario, playerId: string, t: number): Vec3 | null {
  const config = scenario.players.find(p => p.id === playerId);
  if (!config) return null;
  let pos: Vec3 = [...config.position];
  const moves = scenario.timeline
    .filter((a): a is Extract<TimelineAction, { type: 'player_move' }> =>
      a.type === 'player_move' && a.id === playerId)
    .sort((a, b) => a.time - b.time);
  for (const move of moves) {
    if (move.time > t) break;
    const progress = move.duration > 0 ? Math.min(1, (t - move.time) / move.duration) : 1;
    pos = [
      pos[0] + (move.to[0] - pos[0]) * progress,
      pos[1] + (move.to[1] - pos[1]) * progress,
      pos[2] + (move.to[2] - pos[2]) * progress,
    ];
  }
  return pos;
}

function horizontalDistance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[2] - b[2]);
}

function teamOf(scenario: Scenario, playerId: string): Team {
  const config = scenario.players.find(p => p.id === playerId);
  return config?.role === 'opponent' ? 'them' : 'us';
}

// Index of the step a time belongs to: a touch at the exact start time of a
// step is the contact that ends the transition into that step.
function stepIndexAt(scenario: Scenario, t: number): number {
  let index = 0;
  for (let i = 0; i < scenario.steps.length; i++) {
    if (scenario.steps[i].startTime < t - 0.001) index = i + 1;
  }
  return Math.min(index, scenario.steps.length - 1);
}

type Toucher = {
  playerId: string;
  gesture: string;
  position: Vec3;
  // Every distinct strike (BUMP, SET, SPIKE) this player fires at this
  // moment, in playing order. Two of them mean two touches in a row merged in
  // one instant: a dig arriving on a player who sets it away at once.
  strikes: string[];
};

const STRIKE_ORDER = ['BUMP', 'SET', 'SPIKE'];

// The player playing the ball at `point` at time `t`: the contact pose closest
// in time, then in distance. Falls back to a player holding the ball.
function findToucher(scenario: Scenario, point: Vec3, t: number): Toucher | null {
  let best: { playerId: string; gesture: string; position: Vec3; score: number } | null = null;
  for (const action of scenario.timeline) {
    if (action.type !== 'player_pose' || !TOUCH_POSES.has(action.pose)) continue;
    const dt = Math.abs(action.time - t);
    if (dt > TIME_TOLERANCE) continue;
    const position = playerPositionAt(scenario, action.id, t);
    if (!position) continue;
    const distance = horizontalDistance(position, point);
    if (distance > REACH) continue;
    const score = dt * 10 + distance;
    if (!best || score < best.score) {
      best = { playerId: action.id, gesture: action.pose, position, score };
    }
  }
  if (best) {
    const playerId = best.playerId;
    const fired = new Set(scenario.timeline
      .filter((a): a is PlayerPoseAction =>
        a.type === 'player_pose' && a.id === playerId && Math.abs(a.time - t) <= TIME_TOLERANCE)
      .map(a => a.pose));
    return { ...best, strikes: STRIKE_ORDER.filter(s => fired.has(s as PlayerPoseAction['pose'])) };
  }

  for (const player of scenario.players) {
    const position = playerPositionAt(scenario, player.id, t);
    if (!position) continue;
    const handHeight = point[1] - position[1];
    if (horizontalDistance(position, point) < HOLD_REACH && handHeight > 0.5 && handHeight < 2.5) {
      return { playerId: player.id, gesture: 'HOLD', position, strikes: [] };
    }
  }
  return null;
}

// Ball flights in time order, without the carried ball (it moves with its
// holder) and with the final gravity drop flagged.
function ballSegments(scenario: Scenario): BallMoveAction[] {
  return scenario.timeline
    .filter((a): a is BallMoveAction => a.type === 'ball_move' && !a.carried)
    .sort((a, b) => a.time - b.time);
}

// A drop: the ball leaves a point in the air and falls vertically on the spot
// (the compiler's ending for a ball nobody plays).
function isGravityDrop(segment: BallMoveAction): boolean {
  return horizontalDistance(segment.from, segment.to) < 0.05 && segment.to[1] < FLOOR_HEIGHT;
}

function pointsEqual(a: Vec3, b: Vec3): boolean {
  return Math.abs(a[0] - b[0]) < 0.01 && Math.abs(a[1] - b[1]) < 0.01 && Math.abs(a[2] - b[2]) < 0.01;
}

// ──────────────────────────────────────────────────────────────────────────
// Touch extraction and rules
// ──────────────────────────────────────────────────────────────────────────

function analyse(scenario: Scenario): ScenarioReport {
  const touches: Touch[] = [];
  const faults: Fault[] = [];
  const segments = ballSegments(scenario);
  const stepTitle = (t: number) => scenario.steps[stepIndexAt(scenario, t)]?.title ?? '?';

  // Junctions where the ball may be played: the departure of each segment,
  // plus the arrival of the last one.
  type Junction = { time: number; point: Vec3; arrival: Vec3 | null; final: boolean };
  const junctions: Junction[] = [];
  segments.forEach((segment, i) => {
    const previous = segments[i - 1];
    if (isGravityDrop(segment)) return;
    junctions.push({
      time: segment.time,
      point: segment.from,
      // When the ball waits between two segments, the arrival of the previous
      // one is the same contact (a setter holding the ball).
      arrival: previous && !isGravityDrop(previous) ? previous.to : null,
      final: false,
    });
  });
  const last = segments.filter(s => !isGravityDrop(s)).at(-1);
  if (last) {
    junctions.push({ time: last.time + last.duration, point: last.to, arrival: null, final: true });
  }

  for (const junction of junctions) {
    if (junction.point[1] < FLOOR_HEIGHT) continue;
    let toucher = findToucher(scenario, junction.point, junction.time);
    // The ball arrived earlier and waited in a player's hands.
    if (!toucher && junction.arrival && pointsEqual(junction.arrival, junction.point)) {
      const arrivalSegment = segments.find(s => pointsEqual(s.to, junction.point) && s.time < junction.time);
      if (arrivalSegment) {
        toucher = findToucher(scenario, junction.point, arrivalSegment.time + arrivalSegment.duration);
      }
    }
    // The last arrival is a touch only when a gesture plays it: a ball merely
    // put back in a player's hands at the end (a reset) is not.
    if (junction.final && toucher?.gesture === 'HOLD') continue;
    if (!toucher) {
      // The last arrival in the air without a contact: the ball just stops
      // there (end of scenario), nobody plays it.
      if (junction.final) continue;
      faults.push({
        scenarioId: scenario.id,
        stepTitle: stepTitle(junction.time),
        message: `la balle change de trajectoire à (${junction.point.map(n => n.toFixed(1)).join(', ')}) sans être touchée`,
      });
      continue;
    }
    const team = teamOf(scenario, toucher.playerId);
    const previous = touches.at(-1);
    const isBlock = toucher.gesture === 'ARM_SPIKE'
      && toucher.position[1] > BLOCK_MIN_JUMP
      && Math.abs(toucher.position[2]) < BLOCK_MAX_NET_DISTANCE
      && previous !== undefined && previous.team !== team;
    // The ball reached an attacker with his arm cocked, and he now strikes
    // it: one single touch.
    if (previous && previous.playerId === toucher.playerId && previous.gesture === GESTURE_LABELS.ARM_SPIKE) {
      touches.pop();
    }
    const gestures = !isBlock && toucher.strikes.length > 1
      ? toucher.strikes
      : [isBlock ? 'BLOCK' : toucher.gesture];
    for (const gesture of gestures) {
      touches.push({
        time: junction.time,
        playerId: toucher.playerId,
        team,
        gesture: isBlock ? 'contre' : GESTURE_LABELS[gesture] ?? gesture,
        isBlock,
        stepIndex: stepIndexAt(scenario, junction.time),
      });
    }
  }

  // A ball on the floor ends the rally: the touch count starts over.
  const rallyBreaks = segments
    .filter(s => s.to[1] < FLOOR_HEIGHT)
    .map(s => s.time + s.duration);

  // Players of the current possession (touches of one team in a row, the
  // block left out), for the 4v4 rule.
  let possession: Touch[] = [];
  let count = 0;
  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];
    const previous = touches[i - 1];
    const newRally = !previous || rallyBreaks.some(t => t > previous.time && t <= touch.time + 0.001);
    if (newRally || touch.isBlock || touch.team !== previous.team) {
      count = touch.isBlock ? 0 : 1;
      possession = touch.isBlock ? [] : [touch];
      continue;
    }
    count += 1;
    possession.push(touch);
    const title = scenario.steps[touch.stepIndex]?.title ?? '?';
    if (scenario.config.teamSize === 4 && possession.length === 3) {
      const ids = possession.map(t => t.playerId);
      if (new Set(ids).size < 3) {
        faults.push({
          scenarioId: scenario.id,
          stepTitle: title,
          message: `4v4 : les 3 touches ne sont pas jouées par 3 joueurs différents (${possession.map(t => `${t.playerId} ${t.gesture}`).join(', ')})`,
        });
      }
    }
    if (touch.playerId === previous.playerId && !previous.isBlock) {
      faults.push({
        scenarioId: scenario.id,
        stepTitle: title,
        message: `${touch.playerId} touche la balle deux fois de suite (${previous.gesture} puis ${touch.gesture})`,
      });
    }
    if (count > 3) {
      faults.push({
        scenarioId: scenario.id,
        stepTitle: title,
        message: `${touch.team === 'us' ? 'notre équipe' : "l'équipe adverse"} joue une ${count}e touche (${touch.playerId}, ${touch.gesture})`,
      });
    }
  }

  return { scenario, touches, faults };
}

// ──────────────────────────────────────────────────────────────────────────
// Entry point
// ──────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const only = args.filter(a => !a.startsWith('--'));

  // Load the scenarios and the compiler through Vite, as the site does, so the
  // TypeScript sources are used as they are.
  const inlineConfig = { configFile: false as const, logLevel: 'error' as const };
  const [{ module: editor }, { module: compiler }] = await Promise.all([
    runnerImport<{ EDITOR_STATES: ReadonlyArray<EditorState> }>(
      './src/scenarios/data/editor/index.ts', inlineConfig),
    runnerImport<{ compileScenario: (state: EditorState) => Scenario }>(
      './src/editor/compileScenario.ts', inlineConfig),
  ]);

  const scenarios = editor.EDITOR_STATES
    .map(compiler.compileScenario)
    .filter(s => only.length === 0 || only.includes(s.id))
    .sort((a, b) => a.id.localeCompare(b.id));

  const reports = scenarios.map(analyse);
  const faults = reports.flatMap(r => r.faults);

  for (const report of reports) {
    if (!verbose && report.faults.length === 0) continue;
    const mark = report.faults.length === 0 ? 'ok ' : 'KO ';
    console.log(`\n${mark} ${report.scenario.id} (${report.scenario.config.teamSize}v${report.scenario.config.teamSize})`);
    if (verbose) {
      report.scenario.steps.forEach((step, index) => {
        const inStep = report.touches.filter(t => t.stepIndex === index);
        if (inStep.length === 0) return;
        const list = inStep.map(t => `${t.playerId} (${t.gesture})`).join(' → ');
        console.log(`     ${step.title} : ${list}`);
      });
    }
    for (const fault of report.faults) {
      console.log(`  ✗  ${fault.stepTitle} : ${fault.message}`);
    }
  }

  const faulty = reports.filter(r => r.faults.length > 0).length;
  console.log(`\n${reports.length} scénarios contrôlés, ${faulty} en défaut, ${faults.length} défaut(s).`);
  if (faults.length > 0) process.exitCode = 1;
}

await main();
