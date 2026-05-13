import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// Read defense: reactive positioning. All defenders neutral, then adapt to pass → attacker cues.
// FIVB-elite system, defined less by formation than by reading skill.
const STATE: EditorState = {
  metadata: {
    id: '6v6-defense-read',
    title: 'Défense · de lecture (read)',
    shortDescription: 'Défense réactive haut niveau : positions adaptatives selon passe, élan et bras armé adverse.',
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Read defense · International',
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
      title: '1. Position de base neutre',
      description: "Tous les défenseurs en position de lecture, jambes fléchies, pieds parallèles. Séquence visuelle obligatoire : « ballon → passeur → ballon → attaquant ».",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:     [3, 0, 5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          R4b:   [0, 0, 5],
          OPP_A: [-3, 0, -3],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [1.5, 1.8, -0.8],
        poses: {
          L: 'READY', R4b: 'READY', P: 'READY', R4: 'READY', C: 'READY', Op: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Lecture de la passe (vers Z2 adverse)',
      description: "Dès que le ballon quitte les mains du passeur adverse → ajustement vers la zone d'attaque. Ici Z2 adverse (sa droite = notre gauche).",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:     [3, 0, 5],
          Op:    [3, 0, 0.4],
          C:     [-2.0, 0, 0.3],
          R4:    [-3.0, 0, 0.3],
          L:     [-2.5, 0, 5],
          R4b:   [0, 0, 5],
          OPP_A: [-3, 0, -1.2],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [-3.0, 3.0, -0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s2-set', playerId: 'OPP_S', impact: [1.5, 0, -0.8] },
      ],
    },
    {
      id: 's3',
      title: "3. Lecture de l'attaquant + ajustement",
      description: "Lecture en parallèle de la course d'élan, orientation du bras armé et épaules. Tous se replacent en fonction des indices : épaule haute = smash, rotation = direction probable.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:     [3.5, 0, 6],
          Op:    [3.0, 0, 1.5],
          C:     [-2.0, 0, 0.3],
          R4:    [-3.0, 0, 0.3],
          L:     [3.0, 0, 6],
          R4b:   [0.5, 0, 6],
          OPP_A: [-3, 0, -0.7],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [-3.0, 3.0, -0.8],
      },
    },
    {
      id: 's4',
      title: '4. Smash lu + bloc à 2',
      description: "L'attaquant ouvre vers la diagonale longue. La défense est déjà en place grâce aux indices visuels. Bloc R4 + central. « Stopped on contact » impératif.",
      tempo: 'rapide',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          P:     [3.5, 0, 6],
          Op:    [3.0, 0, 1.5],
          C:     [-2.0, 0, 0.5],
          R4:    [-3.0, 0, 0.5],
          L:     [3.0, 0, 6],
          R4b:   [0.5, 0, 6],
          OPP_A: [-3, 0, -0.6],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [3.0, 0.8, 6],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'OPP_A', impact: [-3, 0, -0.5], jumpHeight: 1.8, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocL', playerId: 'R4',    impact: [-3.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocC', playerId: 'C',     impact: [-2.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération lue par le libéro',
      description: "Anticipation parfaite : le libéro est déjà en grande diagonale, exactement sur la trajectoire. Manchette haute vers la cible.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          P:     [3.5, 0, 6],
          Op:    [3.0, 0, 1.5],
          C:     [-2.0, 0, 0.5],
          R4:    [-3.0, 0, 0.5],
          L:     [3.0, 0, 6],
          R4b:   [0.5, 0, 6],
          OPP_A: [-3, 0, -0.6],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s5-dig', playerId: 'L', impact: [3.0, 0, 6] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — base neutre',
      description: "Retour à la position neutre, prêts à lire la prochaine phase. La lecture redémarre à chaque touche adverse.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          P:     [3, 0, 5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          R4b:   [0, 0, 5],
          OPP_A: [-3, 0, -3],
          OPP_S: [1.5, 0, -2],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      "Read defense = pas de positionnement figé, tout est adaptatif. La défense moderne se définit moins par la formation que par la lecture.",
      "Séquence visuelle « ballon → passeur → ballon → attaquant » (Hebert, Liskevych, FIVB Top Volley).",
      "Phases : base neutre → lecture passe → lecture attaquant → ajustement → « stopped on contact » → pursuit.",
      'Système privilégié au haut niveau international (FIVB seniors).',
      'Plus efficace contre attaquants polyvalents.',
    ],
    commonMistakes: [
      'Bouger AVANT la passe → mauvaise lecture, joueur à contre-pied.',
      'Lecture incomplète : ne lire que la passe, pas le bras armé.',
      "Encore en mouvement à l'instant du contact attaquant (pas « stopped on contact ») → réactivité divisée par 2.",
      'Manque de coordination → 2 défenseurs sur la même balle, trou ailleurs.',
    ],
  },
};

export default STATE;
