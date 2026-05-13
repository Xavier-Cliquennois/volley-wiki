import { ROLE_COLORS } from '../constants/positions';
import type { PlayerRole, TeamSize } from '../scenarios/types';
import type { EditorPlayer, EditorState } from './types';

// COLORS mirrors src/scenarios/data/_shared.ts so the defaults match the rest
// of the codebase. We keep a local copy to avoid coupling with that module.
const COLORS = {
  setter:       ROLE_COLORS.P2,
  opposite:     ROLE_COLORS.P1,
  middle:       ROLE_COLORS.P3,
  outside:      ROLE_COLORS.P4,
  outside_back: ROLE_COLORS.P5,
  middle_back:  ROLE_COLORS.P6,
  libero:       ROLE_COLORS.L,
  opponent:     '#7f8c8d',
};

export const ROLE_OPTIONS: ReadonlyArray<{ value: PlayerRole; label: string; color: string }> = [
  { value: 'setter',   label: 'Passeur',  color: COLORS.setter },
  { value: 'opposite', label: 'Pointu',   color: COLORS.opposite },
  { value: 'middle',   label: 'Central',  color: COLORS.middle },
  { value: 'outside',  label: 'Aile',     color: COLORS.outside },
  { value: 'libero',   label: 'Libéro',   color: COLORS.libero },
  { value: 'opponent', label: 'Adversaire', color: COLORS.opponent },
  { value: 'generic',  label: 'Générique', color: COLORS.outside_back },
];

const FIVB_DEFAULTS_6: Array<{ id: string; label: string; role: PlayerRole; color: string; pos: [number, number, number] }> = [
  { id: 'P',   label: 'Passeur (P2)',  role: 'setter',   color: COLORS.setter,   pos: [3, 0, 0.6] },
  { id: 'Op',  label: 'Pointu (P1)',   role: 'opposite', color: COLORS.opposite, pos: [3, 0, 4] },
  { id: 'C1',  label: 'Central (P3)',  role: 'middle',   color: COLORS.middle,   pos: [0, 0, 0.6] },
  { id: 'R4a', label: 'R4 (P4)',       role: 'outside',  color: COLORS.outside,  pos: [-3, 0, 0.6] },
  { id: 'L',   label: 'Libéro (P5)',   role: 'libero',   color: COLORS.libero,   pos: [-3, 0, 4] },
  { id: 'R4b', label: 'R4 (P6)',       role: 'outside',  color: COLORS.middle_back, pos: [0, 0, 5] },
];

const FIVB_DEFAULTS_5: typeof FIVB_DEFAULTS_6 = [
  { id: 'P',   label: 'Passeur (P2)', role: 'setter',   color: COLORS.setter,   pos: [3, 0, 0.6] },
  { id: 'Op',  label: 'Pointu (P1)',  role: 'opposite', color: COLORS.opposite, pos: [3, 0, 4] },
  { id: 'C1',  label: 'Central (P3)', role: 'middle',   color: COLORS.middle,   pos: [0, 0, 0.6] },
  { id: 'R4a', label: 'R4 (P4)',      role: 'outside',  color: COLORS.outside,  pos: [-3, 0, 0.6] },
  { id: 'L',   label: 'Libéro (P5)',  role: 'libero',   color: COLORS.libero,   pos: [-3, 0, 4] },
];

const FIVB_DEFAULTS_4: typeof FIVB_DEFAULTS_6 = [
  { id: 'P',  label: 'Passeur',   role: 'setter',   color: COLORS.setter,   pos: [2.5, 0, 0.6] },
  { id: 'Op', label: 'Pointu',    role: 'opposite', color: COLORS.opposite, pos: [2.5, 0, 4] },
  { id: 'A',  label: 'Aile',      role: 'outside',  color: COLORS.outside,  pos: [-2.5, 0, 0.6] },
  { id: 'D',  label: 'Défenseur', role: 'generic', color: COLORS.middle_back, pos: [-2.5, 0, 4] },
];

const OPPONENT_BLOCKERS_6 = [
  { id: 'OPP_BL', label: 'Bloc adverse G',  role: 'opponent' as PlayerRole, color: COLORS.opponent, pos: [-2.5, 0, -0.5] as [number, number, number] },
  { id: 'OPP_BR', label: 'Bloc adverse D',  role: 'opponent' as PlayerRole, color: COLORS.opponent, pos: [2.5, 0, -0.5] as [number, number, number] },
];

function buildDefaultPlayers(teamSize: TeamSize): EditorPlayer[] {
  const our = teamSize === 6 ? FIVB_DEFAULTS_6 : teamSize === 5 ? FIVB_DEFAULTS_5 : FIVB_DEFAULTS_4;
  const opps = teamSize === 4
    ? [{ id: 'OPP_B', label: 'Bloc adverse', role: 'opponent' as PlayerRole, color: COLORS.opponent, pos: [0, 0, -0.5] as [number, number, number] }]
    : OPPONENT_BLOCKERS_6;
  return [...our, ...opps].map(p => ({ id: p.id, label: p.label, role: p.role, color: p.color }));
}

function buildDefaultPositions(teamSize: TeamSize): Record<string, [number, number, number]> {
  const our = teamSize === 6 ? FIVB_DEFAULTS_6 : teamSize === 5 ? FIVB_DEFAULTS_5 : FIVB_DEFAULTS_4;
  const opps = teamSize === 4
    ? [{ id: 'OPP_B', pos: [0, 0, -0.5] as [number, number, number] }]
    : OPPONENT_BLOCKERS_6;
  const out: Record<string, [number, number, number]> = {};
  for (const p of [...our, ...opps]) out[p.id] = p.pos;
  return out;
}

export function buildDefaultEditorState(teamSize: TeamSize = 6): EditorState {
  const players = buildDefaultPlayers(teamSize);
  const positions = buildDefaultPositions(teamSize);
  return {
    metadata: {
      id: `${teamSize}v${teamSize}-attack-nouveau`,
      title: 'Nouveau scénario',
      shortDescription: '',
      teamSize,
      phase: 'attack',
      contextLabel: 'Contexte à préciser',
      defaultCamera: 'DEFAULT',
    },
    players,
    steps: [
      {
        id: 's1',
        title: '1. Position de départ',
        description: 'Décrivez ici la situation initiale.',
        tempo: 'pause',
        snapshot: {
          positions,
          // Y matches the BallTrajectoryEditor's "Hanche" preset (1.0 m) so
          // the picker shows a snapped value out of the box instead of a
          // floating "between two levels" state.
          ballPosition: [0, 1.0, -8.5],
        },
      },
    ],
    summary: { keyPoints: [], commonMistakes: [] },
  };
}
