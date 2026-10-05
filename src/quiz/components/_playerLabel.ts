import type { RoleCode } from '../../systems/types';

// Short pastille labels used inside CourtPlayer circles. Mirrors the
// PASTILLE_LABEL table in src/systems/RotationDiagram.tsx — kept local to
// the quiz module so we don't depend on an internal of that file. If a new
// RoleCode is introduced, add it here.
const PASTILLE: Record<RoleCode, { label: string; sub?: string }> = {
  S: { label: 'S' },
  S2: { label: 'S', sub: '2' },
  OPP: { label: 'OPP' },
  MB1: { label: 'MB', sub: '1' },
  MB2: { label: 'MB', sub: '2' },
  OH1: { label: 'OH', sub: '1' },
  OH2: { label: 'OH', sub: '2' },
  L: { label: 'L' },
  B1: { label: 'J', sub: '1' },
  B2: { label: 'J', sub: '2' },
};

export function pastilleLabel(role: RoleCode): string {
  return PASTILLE[role].label;
}

export function pastilleSub(role: RoleCode): string | undefined {
  return PASTILLE[role].sub;
}
