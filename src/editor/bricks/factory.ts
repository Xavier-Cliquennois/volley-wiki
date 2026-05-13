// Sensible defaults for each brick kind, used when the user clicks "add SMASH"
// in the toolbar. Defaults aim at the most common case so the brick is
// usable as-is without further parameter tweaking.

import type { BrickAction, BrickKind } from './types';

// Build a fresh brick with reasonable defaults relative to a player's current
// XZ position. Caller is responsible for the unique id.
export function createBrickWithDefaults(
  kind: BrickKind,
  brickId: string,
  playerId: string,
  playerPos: [number, number, number],
): BrickAction {
  const [px, , pz] = playerPos;
  switch (kind) {
    case 'SMASH':
    case 'FEINTE':
    case 'JUMP_SERVE':
      // Default impact = 0.4 m closer to the net than the player. Hits at the
      // player's lateral position. contactAtRatio=0.55 means the ball arrives
      // a bit past mid-window so the jump apex and the contact are aligned.
      return {
        kind,
        id: brickId,
        playerId,
        impact: [px, 0, pz < 0 ? pz + 0.4 : Math.max(0.4, pz - 0.4)],
        contactAtRatio: 0.55,
      };
    case 'BIDOUILLE':
    case 'FLOAT_SERVE':
    case 'PASSE_HAUTE':
    case 'PASSE_TENDUE':
    case 'MANCHETTE':
      return {
        kind,
        id: brickId,
        playerId,
        impact: [px, 0, pz],
      };
    case 'BLOC':
      // Block goes UP at the net, on the player's lateral side.
      // contactAtRatio=0.5 (mid-window) is the natural moment a blocker meets
      // the incoming spike.
      return {
        kind,
        id: brickId,
        playerId,
        impact: [px, 0, pz < 0 ? -0.4 : 0.4],
        contactAtRatio: 0.5,
      };
    case 'DEFENSE_PLONGEE':
      // Default plunge target ≈ 1.5 m towards the net (room to dive forward).
      return {
        kind,
        id: brickId,
        playerId,
        impact: [px, 0, pz < 0 ? pz + 1.5 : pz - 1.5],
      };
    case 'COURSE_ELAN':
      return {
        kind,
        id: brickId,
        playerId,
        // Default destination = a metre closer to the net.
        to: [px, 0, pz < 0 ? pz + 1 : Math.max(0.4, pz - 1)],
      };
    case 'PENETRATION':
      // Setter penetrates to the canonical 2-3 spot near the net.
      return {
        kind,
        id: brickId,
        playerId,
        to: [1.5, 0, 0.8],
      };
    case 'RECUL_3M':
      // Pulling back to the 3 m line on the player's own side.
      return {
        kind,
        id: brickId,
        playerId,
        to: [px, 0, pz < 0 ? -3.5 : 3.5],
      };
  }
}

// Anchor points shown as draggable markers on the 2D canvas. Each brick
// variant exposes one of `impact` (jump/contact bricks) or `to` (movement
// bricks) — never both.
export function brickAnchorPoints(brick: BrickAction): Array<{ key: 'impact' | 'to'; pos: [number, number, number] }> {
  if ('impact' in brick) return [{ key: 'impact', pos: brick.impact }];
  if ('to' in brick) return [{ key: 'to', pos: brick.to }];
  return [];
}
