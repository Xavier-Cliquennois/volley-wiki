import type { Scenario } from '../types';
import { ATTACK_SCENARIOS } from './attack';
import { DEFENSE_SCENARIOS } from './defense';
import { RECEPTION_SCENARIOS } from './reception';

export const SCENARIOS: Scenario[] = [
  ...ATTACK_SCENARIOS,
  ...DEFENSE_SCENARIOS,
  ...RECEPTION_SCENARIOS,
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find(s => s.id === id);
}
