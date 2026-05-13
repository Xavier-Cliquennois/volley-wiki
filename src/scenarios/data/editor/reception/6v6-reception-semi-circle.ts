import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 6v6 semi-circular reception. Transition between W and 3-receivers:
// 5 players spread on an arc at equal distance from the server. Setter is
// hidden in P1, pops out as the server hits.
const STATE: EditorState = {
  metadata: {
    id: '6v6-reception-semi-circle',
    title: 'Réception · semi-circulaire',
    shortDescription: 'Réception en arc de cercle ouvert vers le serveur, à équidistance. Étape M15-M18.',
    teamSize: 6,
    phase: 'reception',
    contextLabel: '5-1 · Semi-circulaire · M15-M18',
    defaultCamera: 'BEHIND_SERVE',
  },
  players: [
    { id: 'P',       label: 'Passeur (caché)', role: 'setter',   color: COLORS.setter },
    { id: 'R4a',     label: 'R4 G',            role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Central',         role: 'middle',   color: COLORS.middle },
    { id: 'L',       label: 'Libéro',          role: 'libero',   color: COLORS.libero },
    { id: 'R4b',     label: 'R4 D',            role: 'outside',  color: COLORS.outside_back },
    { id: 'Op',      label: 'Pointu',          role: 'opposite', color: COLORS.opposite },
    { id: 'OPP_SRV', label: 'Serveur adv.',    role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Arc semi-circulaire',
      description: "Les 5 réceptionneurs forment un arc à équidistance du serveur. Tous orientés vers le passeur caché en P1. Le central reste en réception (vs sorti en formation à 3).",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [3, 0, 1.5],
          R4a:     [-3, 0, 4],
          C:       [-1.5, 0, 5.5],
          L:       [0, 0, 6],
          R4b:     [1.5, 0, 5.5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          R4a: 'READY', C: 'READY', L: 'READY', R4b: 'READY', Op: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + lecture commune',
      description: "Service en cloche vers la zone centrale. Tous les joueurs lisent dans la même direction. Le central annonce sa prise — c'est sa zone dans l'arc.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 1.5],
          R4a:     [-3, 0, 4],
          C:       [-1.2, 0, 5],
          L:       [0, 0, 6],
          R4b:     [1.5, 0, 5.5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-1.2, 1.2, 5],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE',   id: 'b-s2-recv', playerId: 'C', impact: [-1.2, 0, 5] },
        { kind: 'PENETRATION', id: 'b-s2-pen',  playerId: 'P', to: [3, 0, 2] },
      ],
    },
    {
      id: 's3',
      title: '3. Pénétration + passe haute',
      description: "Le passeur sort de sa cachette pendant que la balle remonte. Il arrive à la cible en zone 2-3 et distribue vers l'aile gauche où le R4 G a déjà entamé sa course.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:       [1.5, 0, 0.8],
          R4a:     [-3.5, 0, 2.5],
          C:       [-1.2, 0, 5],
          L:       [0, 0, 6],
          R4b:     [1.5, 0, 5.5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [1.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [1.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4a', to: [-3.5, 0, 2.5] },
      ],
    },
    {
      id: 's4',
      title: "4. Ballon disponible en zone 4",
      description: "La passe arrive en zone 4. Le R4 G est en position pour frapper. Distribution classique, lisible — typique de l'étape d'apprentissage M15-M18.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [1.5, 0, 0.8],
          R4a:     [-3.5, 0, 1.5],
          C:       [-1.2, 0, 5],
          L:       [0, 0, 6],
          R4b:     [1.5, 0, 5.5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: "5. RESET — retour à l'arc",
      description: "Tout le monde retrouve l'arc semi-circulaire pour le prochain service.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 1.5],
          R4a:     [-3, 0, 4],
          C:       [-1.5, 0, 5.5],
          L:       [0, 0, 6],
          R4b:     [1.5, 0, 5.5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Arc semi-circulaire = étape intermédiaire entre W et réception à 3.',
      'Les 5 joueurs équidistants du serveur → couverture homogène.',
      'Adapté en formation jeune (M15-M18) qui apprend la spécialisation.',
      'Conserve un central en réception (vs réception à 3 où il est sorti).',
    ],
    commonMistakes: [
      'Arc trop ouvert vers les côtés → trous au centre.',
      'Joueurs trop éloignés du serveur → réaction tardive sur les services rapides.',
      'Conflit avec le passeur qui veut aussi réceptionner.',
    ],
  },
};

export default STATE;
