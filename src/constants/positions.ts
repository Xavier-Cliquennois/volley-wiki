export const ROLE_COLORS = {
  P1: '#9b59b6',  // opposite
  P2: '#e74c3c',  // setter
  P3: '#2ecc71',  // middle
  P4: '#3498db',  // outside
  P5: '#3498db',  // outside (back row)
  P6: '#e67e22',  // middle (back row)
  L:  '#f1c40f',  // libero
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
