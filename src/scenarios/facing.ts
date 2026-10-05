import type {
  BallMoveAction,
  PlayerFaceAction,
  ScenarioPlayerConfig,
  TimelineAction,
} from './types';

// ──────────────────────────────────────────────────────────────────────────
// Player orientation in the 3D scenarios
// ──────────────────────────────────────────────────────────────────────────
//
// Rule (see CLAUDE.md, "Coordinate system (3D)"):
//   - Every player faces the net by default: rotation π on our side (looking
//     towards −z), 0 on the opponent side (looking towards +z). Waiting,
//     receiving, defending, blocking, covering: always facing the net.
//   - A player who sets the ball to a teammate (SET gesture, the ball stays on
//     his side of the net) turns towards HIS left antenna while the ball comes
//     to him, sets in that stance, then turns back to the net. This holds for
//     any role (the setter, but also a pointu or an outside who plays the 2nd
//     touch) and for both teams. On our side the left antenna is at x < 0
//     (rotation −π/2); on the opponent side it is at x > 0 (rotation +π/2).
//   - A set played further than NET_SETTING_DEPTH from the net turns the
//     setter towards the spot he sets to instead: he is not at the net, the
//     antenna is no longer his reference.
//
// The turns are emitted as `player_face` actions appended to the timeline.
// A player who holds the ball when the scenario starts and sets it as the
// first touch is already turned at t = 0 (`initial`).

// Rotation of a player looking at the net, from the side he starts on.
export function netFacingRotation(player: ScenarioPlayerConfig): number {
  return player.position[2] < 0 ? 0 : Math.PI;
}

// Rotation of a player looking at his own left antenna.
function leftAntennaRotation(player: ScenarioPlayerConfig): number {
  return player.position[2] < 0 ? Math.PI / 2 : -Math.PI / 2;
}

// Beyond this distance from the net a set is a back-court set.
const NET_SETTING_DEPTH = 3;
// The setter squares up to the antenna at most this long before the contact,
// so he watches the receiver during the first part of the incoming flight.
const TURN_LEAD = 0.6;
const TURN_DURATION = 0.4;
// The setter holds his stance through the follow-through, then turns back
// to the net to cover his attacker. Quick, so that he already faces the net
// when the player pauses on the next step (often 0.3 s after the set).
const HOLD_AFTER_SET = 0.05;
const RETURN_DURATION = 0.25;
// A ball segment starts at the contact within this tolerance (compiled times
// are rounded).
const TIME_TOLERANCE = 0.15;

// The rotation equivalent to `target` (modulo 2π) closest to `current`, so
// the tween always takes the short way round.
function nearestEquivalent(current: number, target: number): number {
  const turns = Math.round((current - target) / (2 * Math.PI));
  return target + turns * 2 * Math.PI;
}

type Turn = { time: number; duration: number; rotation: number };

export type ScenarioFacing = {
  // Starting rotation of the players who do not start facing the net.
  initial: Record<string, number>;
  actions: PlayerFaceAction[];
};

export function computeFacing(
  players: readonly ScenarioPlayerConfig[],
  timeline: readonly TimelineAction[],
): ScenarioFacing {
  const flights = timeline
    .filter((a): a is BallMoveAction => a.type === 'ball_move')
    .sort((a, b) => a.time - b.time);
  const turnsByPlayer = new Map<string, Turn[]>();
  const initial: Record<string, number> = {};

  for (const action of timeline) {
    if (action.type !== 'player_pose' || action.pose !== 'SET') continue;
    const player = players.find(p => p.id === action.id);
    if (!player) continue;
    const setTime = action.time;
    const ourSide = player.position[2] >= 0;

    // The set itself: the ball segment leaving the hands at the contact.
    const set = flights.find(f => Math.abs(f.time - setTime) < TIME_TOLERANCE);
    if (!set) continue;
    // A ball pushed over the net is not a set to a teammate.
    if ((set.to[2] >= 0) !== ourSide) continue;

    // Where the setter looks while setting.
    const fromNet = Math.abs(set.from[2]);
    let setRotation: number;
    if (fromNet <= NET_SETTING_DEPTH) {
      setRotation = leftAntennaRotation(player);
    } else {
      const dx = set.to[0] - set.from[0];
      const dz = set.to[2] - set.from[2];
      if (Math.hypot(dx, dz) < 0.5) continue;
      setRotation = Math.atan2(dx, dz);
    }

    // The ball coming to him: the segment landing on his hands at the contact.
    const incoming = flights.find(
      f => Math.abs(f.time + f.duration - setTime) < TIME_TOLERANCE,
    );
    const turns = turnsByPlayer.get(player.id) ?? [];
    if (!incoming && set === flights[0]) {
      // He holds the ball from the start: already in his setting stance.
      initial[player.id] = setRotation;
    } else {
      const turnStart = Math.max(
        incoming ? incoming.time : setTime - TURN_DURATION,
        setTime - TURN_LEAD,
      );
      turns.push({
        time: turnStart,
        duration: Math.max(0.05, Math.min(TURN_DURATION, setTime - turnStart)),
        rotation: setRotation,
      });
    }
    turns.push({
      time: setTime + HOLD_AFTER_SET,
      duration: RETURN_DURATION,
      rotation: netFacingRotation(player),
    });
    turnsByPlayer.set(player.id, turns);
  }

  const actions: PlayerFaceAction[] = [];
  for (const [id, turns] of turnsByPlayer) {
    const player = players.find(p => p.id === id)!;
    let current = initial[id] ?? netFacingRotation(player);
    for (const turn of turns.sort((a, b) => a.time - b.time)) {
      current = nearestEquivalent(current, turn.rotation);
      actions.push({
        type: 'player_face',
        time: turn.time,
        id,
        rotation: current,
        duration: turn.duration,
      });
    }
  }
  return { initial, actions };
}
