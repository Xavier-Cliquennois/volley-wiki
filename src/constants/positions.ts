// Single source of truth for position colours.
// Mirror this palette in CLAUDE.md when changing it.
export const ROLE_COLORS = {
  P1: '#9b59b6',  // opposite — purple
  P2: '#e74c3c',  // setter — red
  P3: '#2ecc71',  // middle (front) — green
  P4: '#3498db',  // outside (front) — blue
  P5: '#f0c84c',  // outside (back) — retro yellow (harmonized with --yellow token)
  P6: '#e67e22',  // middle (back) — orange
  L:  '#ec4899',  // libero — magenta (distinct from team palette)
} as const;

export type RoleColorKey = keyof typeof ROLE_COLORS;

export const ZONE_NUM_TO_ROLE: Record<number, RoleColorKey> = {
  1: 'P1',
  2: 'P2',
  3: 'P3',
  4: 'P4',
  5: 'P5',
  6: 'P6',
};
