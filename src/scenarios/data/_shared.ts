import type { ScenarioPlayerConfig } from '../types';

// Color palette aligned with role conventions across all scenarios.
// Must match ROLE_COLORS in src/constants/positions.ts and CLAUDE.md.
export const COLORS = {
  setter: '#e74c3c',
  opposite: '#9b59b6',
  middle: '#2ecc71',
  outside: '#3498db',
  libero: '#ec4899',
  opponent: '#7f8c8d',
} as const;

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
