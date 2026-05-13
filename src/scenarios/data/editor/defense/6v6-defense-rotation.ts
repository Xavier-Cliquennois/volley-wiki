import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// Rotational defense (3-2-1 / slide): back-row defenders slide toward the attack side.
// The opposite back defender moves up behind the block to cover tips.
const STATE: EditorState = {
  metadata: {
    id: '6v6-defense-rotation',
    title: 'Défense · en rotation (3-2-1)',
    shortDescription: "Rotation / slide defense : les arrières glissent vers le côté d'attaque, l'arrière opposé monte derrière le bloc.",
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Rotation 3-2-1 · Slide defense',
    defaultCamera: 'TOP_DOWN',
  },
  players: [
    { id: 'P',     label: 'Passeur (P1)',      role: 'setter',   color: COLORS.setter },
    { id: 'Op',    label: 'Pointu (P2)',       role: 'opposite', color: COLORS.opposite },
    { id: 'C',     label: 'Central (P3)',      role: 'middle',   color: COLORS.middle },
    { id: 'R4',    label: 'R4 (P4)',           role: 'outside',  color: COLORS.outside },
    { id: 'L',     label: 'Libéro (P5)',       role: 'libero',   color: COLORS.libero },
    { id: 'R4b',   label: 'R4 (P6)',           role: 'outside',  color: COLORS.middle_back },
    { id: 'OPP_A', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_S', label: 'Passeur adv.',      role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: "1. Base + lecture de la passe Z4",
      description: "Configuration de base avant la rotation. Le passeur adverse pénètre et prépare une passe vers son ailier gauche.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:     [3, 0, 3.5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          R4b:   [0, 0, 5],
          OPP_A: [3, 0, -3],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-1.5, 1.8, -0.8],
        poses: {
          L: 'READY', R4b: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Passe haute vers Z4 adverse',
      description: "Distribution standard. Notre équipe enclenche la rotation : P1 va monter derrière le bloc, P6 glisser vers la ligne droite, libéro maintient la diagonale.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:     [3, 0, 3.5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          R4b:   [0, 0, 5],
          OPP_A: [3, 0, -1.2],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [3.0, 3.0, -0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s2-set', playerId: 'OPP_S', impact: [-1.5, 0, -0.8] },
      ],
    },
    {
      id: 's3',
      title: '3. Rotation 3-2-1 enclenchée',
      description: "Le passeur (P1) MONTE à 3 m derrière le bloc pour couvrir le tip. P6 glisse vers la ligne droite à 8 m. Libéro reste en grande diagonale longue. R4 off-blocker classique côté gauche.",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          P:     [3.0, 0, 3],
          Op:    [3.0, 0, 0.3],
          C:     [2.0, 0, 0.3],
          R4:    [-3.0, 0, 2.0],
          L:     [-1.5, 0, 7.5],
          R4b:   [3.5, 0, 8],
          OPP_A: [3, 0, -0.7],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [3.0, 3.0, -0.8],
      },
    },
    {
      id: 's4',
      title: '4. Smash diagonal + bloc',
      description: "L'attaquant frappe en diagonale longue. Bloc à 2 (pointu + central) — la trajectoire principale est couverte par le libéro.",
      tempo: 'rapide',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          P:     [3.0, 0, 3],
          Op:    [3.0, 0, 0.5],
          C:     [2.0, 0, 0.5],
          R4:    [-3.0, 0, 2.0],
          L:     [-1.5, 0, 7.5],
          R4b:   [3.5, 0, 8],
          OPP_A: [3, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-1.5, 0.8, 7.5],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'OPP_A', impact: [3, 0, -0.5], jumpHeight: 1.8, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocR', playerId: 'Op',    impact: [3.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocC', playerId: 'C',     impact: [2.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's5',
      title: '5. Défense du libéro en diagonale',
      description: "Le libéro est exactement à l'arrivée du coup principal. Manchette haute vers la zone 2-3 — transition fluide vers la contre-attaque.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          P:     [3.0, 0, 3],
          Op:    [3.0, 0, 0.5],
          C:     [2.0, 0, 0.5],
          R4:    [-3.0, 0, 2.0],
          L:     [-1.5, 0, 7.5],
          R4b:   [3.5, 0, 8],
          OPP_A: [3, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s5-dig', playerId: 'L', impact: [-1.5, 0, 7.5] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — base avant nouvelle rotation',
      description: "Retour à la base. La rotation a été efficace : le tip court aurait été pris par le passeur monté, la diagonale longue par le libéro.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          P:     [3, 0, 3.5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          R4b:   [0, 0, 5],
          OPP_A: [3, 0, -3],
          OPP_S: [-1.5, 0, -2],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      "Rotation 3-2-1 (slide defense) : 3 défenseurs arrière glissent vers le côté d'attaque.",
      "L'arrière opposé (souvent le passeur si en P1) MONTE derrière le bloc pour couvrir le tip.",
      'Milieu arrière glisse vers la ligne du côté attaqué (~8,5 m, 1-1,5 m de la ligne).',
      'Excellente couverture de la ligne profonde ET du tip simultanément.',
      'Transition setter rapide si le passeur est le joueur monté.',
      "Variante « counter-rotate » : rotation dans le sens inverse.",
    ],
    commonMistakes: [
      'Rotation incomplète → trous dans la couverture.',
      'Coin diagonal opposé vulnérable (un défenseur en moins en profondeur).',
      "Confusion entre rotate (vers ballon) et counter-rotate (à l'opposé) — exige forte communication.",
      'Joueur monté qui reste figé → ne lit pas les feintes vs smashs.',
    ],
  },
};

export default STATE;
