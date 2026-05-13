import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 4v4 defense vs central quick. The hardest configuration in 4v4: single blocker on a quick attack.
const STATE: EditorState = {
  metadata: {
    id: '4v4-defense-vs-z3',
    title: '4v4 · Défense Z3 (rapide centrale)',
    shortDescription: 'Attaque rapide centrale adverse en 4v4 : bloc à 1 (read) + 3 défenseurs. La config la plus difficile à défendre.',
    teamSize: 4,
    phase: 'defense',
    contextLabel: '4v4 · Bloc à 1 (read) · Faiblesse structurelle',
    defaultCamera: 'DEFAULT',
  },
  players: [
    { id: 'C',     label: 'Central (P3)',      role: 'middle',   color: COLORS.middle },
    { id: 'R4',    label: 'Aile G (P4)',       role: 'outside',  color: COLORS.outside },
    { id: 'A2',    label: 'Aile D (P2)',       role: 'outside',  color: COLORS.outside },
    { id: 'A',     label: 'Arrière (P1)',      role: 'opposite', color: COLORS.opposite },
    { id: 'OPP_A', label: 'Central adverse',   role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_S', label: 'Passeur adv.',      role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Lecture rapide adverse',
      description: "En 4v4 la rapide centrale (tempo 1) est l'attaque la plus dangereuse car 1 seul contreur disponible. L'arrière unique scrute déjà l'axe profond.",
      tempo: 'pause',
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 1.5],
          A2:    [3, 0, 1.5],
          A:     [0, 0, 6],
          OPP_A: [0, 0, -0.5],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-1.5, 1.8, -0.8],
        poses: {
          C: 'READY', R4: 'READY', A2: 'READY', A: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Passe tendue centrale',
      description: "Le passeur lance tendu vers le central qui a déjà commencé sa course. Nos ailes reculent à mi-terrain pour couvrir les diagonales.",
      tempo: 'rapide',
      durationOverride: 0.6,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 2],
          A2:    [3, 0, 2],
          A:     [0, 0, 6],
          OPP_A: [0, 0, -0.5],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [0, 2.5, -0.5],
      },
      ballTrajectory: { curve: 'arc', apex: 2.5 },
      actions: [
        { kind: 'PASSE_TENDUE', id: 'b-s2-quick', playerId: 'OPP_S', impact: [-1.5, 0, -0.8] },
      ],
    },
    {
      id: 's3',
      title: '3. Bloc à 1 (read) + smash rapide',
      description: "Le central seul saute en LECTURE — pas de commitment possible avec un central défenseur. Le central adverse frappe en plein axe.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 2],
          A2:    [3, 0, 2],
          A:     [0, 0, 6],
          OPP_A: [0, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [0, 0.8, 6.5],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s3-smash', playerId: 'OPP_A', impact: [0, 0, -0.5], jumpHeight: 1.8, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s3-bloc',  playerId: 'C',     impact: [0, 0, 0.3],  jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's4',
      title: "4. Pivot défensif : l'arrière unique",
      description: "L'arrière P1 défend la balle puissante en plein axe — il joue le rôle de Z6 du 6v6. Sa lecture doit être PARFAITE.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 2],
          A2:    [3, 0, 2],
          A:     [0, 0, 6],
          OPP_A: [0, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s4-dig', playerId: 'A', impact: [0, 0, 6.5] },
      ],
    },
    {
      id: 's5',
      title: '5. RESET — formation diamant',
      description: "Retour à la base 4v4. Le central retombe au filet, l'arrière reprend sa position axiale.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 1.5],
          A2:    [3, 0, 1.5],
          A:     [0, 0, 6],
          OPP_A: [0, 0, -0.5],
          OPP_S: [-1.5, 0, -2],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Le doc 4v4 le confirme : la rapide centrale est UNE VRAIE FAIBLESSE du 4v4 (1 seul contreur).',
      'Bloc à 1 en LECTURE : pas de commitment possible avec un central défenseur.',
      'Les 2 ailes couvrent les 2 diagonales courtes à mi-terrain (~3,5-4 m du filet).',
      "L'arrière unique est le pivot défensif — il joue le rôle de Z6 du 6v6 sur l'axe central.",
      "Anticipation = compétence n°1 : avec ~40 m² à couvrir, l'erreur de lecture est non-rattrapable.",
    ],
    commonMistakes: [
      'Bloc à 2 sur rapide → seulement 2 défenseurs au sol, diagonales largement ouvertes.',
      'Arrière qui avance trop tôt → balle profonde tombe derrière lui.',
      'Ailes qui restent au filet sans contrer → trous sur les 3 m derrière le bloc.',
      "Lecture trop tardive du central adverse → on subit l'attaque sans bouger.",
    ],
  },
};

export default STATE;
