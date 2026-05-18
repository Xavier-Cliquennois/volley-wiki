import type { SystemDef, SystemId } from '../types';
import { SYSTEM_5_1 } from './system-5-1';
import { SYSTEM_6_2 } from './system-6-2';
import { SYSTEM_4_2 } from './system-4-2';
import { SYSTEM_5V5_5_1, SYSTEM_5V5_4_2 } from './system-5v5';
import { SYSTEM_4V4_DIAMANT, SYSTEM_4V4_BOX, SYSTEM_4V4_LIGNE } from './system-4v4';
import { SYSTEM_BEACH } from './system-beach';

// Partial map: only systems with authored content. Hub lists all SystemIds
// but renders a "coming soon" card for entries missing here.
export const SYSTEMS: Partial<Record<SystemId, SystemDef>> = {
  '5-1': SYSTEM_5_1,
  '6-2': SYSTEM_6_2,
  '4-2': SYSTEM_4_2,
  '5v5-5-1': SYSTEM_5V5_5_1,
  '5v5-4-2': SYSTEM_5V5_4_2,
  '4v4-diamant': SYSTEM_4V4_DIAMANT,
  '4v4-box': SYSTEM_4V4_BOX,
  '4v4-ligne': SYSTEM_4V4_LIGNE,
  'beach-classic': SYSTEM_BEACH,
};

export function getSystemById(id: string): SystemDef | undefined {
  return id in SYSTEMS ? SYSTEMS[id as SystemId] : undefined;
}

// IDs in the order we want them displayed on the hub page.
export const SYSTEM_ORDER: readonly SystemId[] = [
  // 6v6 indoor
  '5-1', '6-2', '4-2',
  // 5v5 indoor
  '5v5-5-1', '5v5-4-2',
  // 4v4 indoor
  '4v4-diamant', '4v4-box', '4v4-ligne',
  // Beach 2v2
  'beach-classic',
];
