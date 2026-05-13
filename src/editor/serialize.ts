import type { EditorState } from './types';
import { compileScenario } from './compileScenario';

// JSON snapshot of the editor session — round-trips through importJson().
export function exportJson(state: EditorState): string {
  return JSON.stringify(state, null, 2);
}

export function importJson(raw: string): EditorState {
  const parsed = JSON.parse(raw) as EditorState;
  validateState(parsed);
  return parsed;
}

// TypeScript source for the compiled Scenario — paste-ready into
// src/scenarios/data/<file>.ts. Uses the COLORS map from _shared.ts when
// possible so the output matches handwritten scenarios.
export function exportTypescript(state: EditorState): string {
  const scenario = compileScenario(state);
  const constName = toConstName(scenario.id);
  const body = stringifyScenario(scenario);

  return `import type { Scenario } from '../types';
import { COLORS } from './_shared';

const ${constName}: Scenario = ${body};

export default ${constName};
`;
}

function toConstName(id: string): string {
  return id
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase() || 'SCENARIO';
}

function stringifyScenario(scenario: unknown): string {
  return JSON.stringify(scenario, null, 2);
}

function validateState(state: unknown): asserts state is EditorState {
  if (!state || typeof state !== 'object') throw new Error('Configuration invalide (objet attendu).');
  const s = state as Partial<EditorState>;
  if (!s.metadata) throw new Error('Champ "metadata" manquant.');
  if (!Array.isArray(s.players)) throw new Error('Champ "players" doit être un tableau.');
  if (!Array.isArray(s.steps)) throw new Error('Champ "steps" doit être un tableau.');
  if (!s.summary) throw new Error('Champ "summary" manquant.');
}
