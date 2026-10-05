import type { Level } from '../userLevel/useUserLevel';
import type { Drill, TeamSize } from './types';

export type LevelFilter = Level | 'all';
export type TeamSizeFilter = TeamSize | 'all';

// A drill matches a level filter if any variant targets that level (or below).
// "All" disables the level filter.
export function matchesLevel(drill: Drill, filter: LevelFilter): boolean {
  if (filter === 'all') return true;
  return drill.variants.some(v => v.level === filter);
}

export function matchesTeamSize(drill: Drill, filter: TeamSizeFilter): boolean {
  if (filter === 'all') return true;
  return drill.setup.teamSizes.includes(filter);
}

export function filterDrills(
  drills: Drill[],
  level: LevelFilter,
  teamSize: TeamSizeFilter,
): Drill[] {
  return drills.filter(d => matchesLevel(d, level) && matchesTeamSize(d, teamSize));
}
