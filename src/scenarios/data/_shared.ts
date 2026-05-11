import type { ScenarioPlayerConfig } from '../types';
import { ROLE_COLORS } from '../../constants/positions';
import type { RoleColorKey } from '../../constants/positions';

// Color palette unified with ROLE_COLORS — single source of truth for all scenarios.
// outside/middle = front-row zones (P4/P3); outside_back/middle_back = back-row zones (P5/P6).
export const COLORS = {
  setter:       ROLE_COLORS.P2,  // red   — P2 zone
  opposite:     ROLE_COLORS.P1,  // purple — P1 zone
  middle:       ROLE_COLORS.P3,  // green  — P3 zone (front)
  outside:      ROLE_COLORS.P4,  // blue   — P4 zone (front)
  outside_back: ROLE_COLORS.P5,  // yellow — P5 zone (back wing)
  middle_back:  ROLE_COLORS.P6,  // orange — P6 zone (back middle)
  libero:       ROLE_COLORS.L,   // magenta — libero jersey
  opponent:     '#7f8c8d',       // grey   — all opponents
} as const;

// Resolve display color for a player.
// Priority: opponents → grey; libero jersey → magenta; label zone "(P1-P6)" → ROLE_COLORS; fallback → explicit color.
export function resolvePlayerColor(player: ScenarioPlayerConfig): string {
  if (player.role === 'opponent') return COLORS.opponent;
  if (player.role === 'libero' && /^Lib[eé]ro/.test(player.label)) return ROLE_COLORS.L;
  const m = player.label.match(/\(P([1-6])\)/);
  if (m) return ROLE_COLORS[`P${m[1]}` as RoleColorKey];
  return player.color;
}

// Standard FIVB position coordinates on our side of the court
// X: lateral (negative = left when facing the net)
// Y: height (always 0 for ground positions)
// Z: depth (positive = our side, 0 = net)
export const POS = {
  P1: [3, 0, 4] as [number, number, number],
  P2: [3, 0, 0.6] as [number, number, number],
  P3: [0, 0, 0.6] as [number, number, number],
  P4: [-3, 0, 0.6] as [number, number, number],
  P5: [-3, 0, 4] as [number, number, number],
  P6: [0, 0, 5] as [number, number, number],
} as const;

// Two opponent blockers at the net to show where the attacker hits
export const opponentBlockers = (): ScenarioPlayerConfig[] => [
  { id: 'OPP_BL', label: 'Bloc adverse G', role: 'opponent', color: COLORS.opponent, position: [-2.5, 0, -0.5] },
  { id: 'OPP_BR', label: 'Bloc adverse D', role: 'opponent', color: COLORS.opponent, position: [2.5, 0, -0.5] },
];

// Single opponent blocker for situations where only one opponent matters
export const opponentSingleBlocker = (x: number = 0): ScenarioPlayerConfig => ({
  id: 'OPP_B', label: 'Bloc adverse', role: 'opponent', color: COLORS.opponent, position: [x, 0, -0.5],
});

// Opponent attacker positioned for spike from given side
export const opponentAttacker = (side: 'left' | 'center' | 'right'): ScenarioPlayerConfig => {
  const x = side === 'left' ? -3.2 : side === 'right' ? 3.2 : 0;
  return { id: 'OPP_A', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [x, 0, -0.6] };
};
