import type { Scenario } from '../types';
import { compileScenario } from '../../editor/compileScenario';
import { EDITOR_STATES } from './editor';

// Sources of truth: EditorState files under data/editor/ (one per scenario,
// authored using the brick-based editor format). Compiled at module load —
// the runtime Scenario is what /scenarios renders.
export const SCENARIOS: Scenario[] = EDITOR_STATES
  .map(compileScenario)
  .sort((a, b) => a.id.localeCompare(b.id));

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find(s => s.id === id);
}
