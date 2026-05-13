import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5v5 defense vs central quick. Block-of-1 (central) on read, wings off-blockers on the 3m line.
// Only 2 deep defenders — central axis partially covered.
const STATE: EditorState = {
  metadata: {
    id: '5v5-defense-vs-z3',
    title: '5v5 · Défense Z3 (rapide / tempo 1)',
    shortDescription: 'Bloc à 1 (central) sur attaque rapide centrale adverse en 5v5 — couverture axiale partielle.',
    teamSize: 5,
    phase: 'defense',
    contextLabel: '5v5 · Bloc à 1 (read) · Lecture rapide',
    defaultCamera: 'TOP_DOWN',
  },
  players: [
    { id: 'C',     label: 'Central (P3)',      role: 'middle',   color: COLORS.middle },
    { id: 'Op',    label: 'Pointu (P2)',       role: 'opposite', color: COLORS.opposite },
    { id: 'R4',    label: 'R4 (P4)',           role: 'outside',  color: COLORS.outside },
    { id: 'L',     label: 'Libéro (P5)',       role: 'libero',   color: COLORS.libero },
    { id: 'P',     label: 'Passeur (P1)',      role: 'setter',   color: COLORS.setter },
    { id: 'OPP_A', label: 'Central adverse',   role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_S', label: 'Passeur adv.',      role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Lecture rapide adverse',
      description: "Distribution tendue imminente vers le central. 0,3-0,5 s entre passe et frappe — notre central scrute son homologue, déjà en course.",
      tempo: 'pause',
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
          OPP_A: [0, 0, -0.5],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-1.5, 1.8, -0.8],
        poses: {
          C: 'READY', L: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Passe tendue + ailes off-blockers',
      description: "Le passeur adverse lance tendu vers le central. Nos ailiers reculent à 1,5 m du filet sur la ligne d'attaque pour couvrir les déviations latérales.",
      tempo: 'rapide',
      durationOverride: 0.6,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 1.5],
          R4:    [-3, 0, 1.5],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
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
      description: "Notre central seul saute en lecture. Le central adverse frappe en diagonale courte — angles courts par rapport à une haute balle.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 1.5],
          R4:    [-3, 0, 1.5],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
          OPP_A: [0, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-2.5, 0.8, 5],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s3-smash', playerId: 'OPP_A', impact: [0, 0, -0.5], jumpHeight: 1.8, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s3-bloc',  playerId: 'C',     impact: [0, 0, 0.3],  jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's4',
      title: '4. Défense du libéro',
      description: "Le libéro (avancé à 5 m car angles courts) défend en manchette dans son couloir gauche. Trajectoire haute vers la cible — passeur reviendra au filet.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 1.5],
          R4:    [-3, 0, 1.5],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
          OPP_A: [0, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [1.5, 2.0, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s4-dig', playerId: 'L', impact: [-2.5, 0, 5] },
      ],
    },
    {
      id: 's5',
      title: '5. RESET',
      description: "Retour à la base 5v5 après la séquence. Le central et les ailes se réalignent.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
          OPP_A: [0, 0, -0.5],
          OPP_S: [-1.5, 0, -2],
        },
        ballPosition: [1.5, 2.0, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Bloc à 1 (P3 central) en lecture — pas de commitment possible sur quick.',
      "Ailiers (P4 + P2) à 2 m du filet sur la ligne d'attaque : couvrent déviations de bloc.",
      'Avec seulement 2 défenseurs profonds (P5 + P1), la couverture du fond AXIAL est partielle.',
      "Z1 et Z5 AVANCENT d'1 m (~7 m du filet) car les angles sont plus courts sur quick.",
      "« Stopped on contact » : tous arrêtés à l'instant exact de la frappe.",
    ],
    commonMistakes: [
      'Bloc à 2 sur rapide → trop tard, et laisse 1 seul défenseur au sol.',
      'Défenseurs figés au fond (8 m+) → balle rapide tombe avant de bouger.',
      '« False stepping » (premier appui reculé) → temps perdu sur tempo 1.',
      'Off-blockers qui restent au filet → ne couvrent pas les déviations.',
    ],
  },
};

export default STATE;
