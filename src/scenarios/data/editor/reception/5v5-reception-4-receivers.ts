import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5v5 reception with 4 receivers in a U: 2 on the 3 m line + 2 at the back.
// Setter is out at the net (no penetration in 5v5 — simplified 4-1 system).
const STATE: EditorState = {
  metadata: {
    id: '5v5-reception-4-receivers',
    title: '5v5 · Réception à 4',
    shortDescription: 'Format 5v5 : passeur sorti + 4 réceptionneurs en U ou en ligne.',
    teamSize: 5,
    phase: 'reception',
    contextLabel: '5v5 · 4 réceptionneurs · Format hybride',
    defaultCamera: 'BEHIND_SERVE',
  },
  players: [
    { id: 'P',       label: 'Passeur (sorti)',   role: 'setter',   color: COLORS.setter },
    { id: 'R4a',     label: 'Avant G',           role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Avant D / central', role: 'middle',   color: COLORS.middle },
    { id: 'A1',      label: 'Arrière G',         role: 'libero',   color: COLORS.libero },
    { id: 'A2',      label: 'Arrière D',         role: 'outside',  color: COLORS.outside_back },
    { id: 'OPP_SRV', label: 'Serveur adv.',      role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Configuration 5v5',
      description: "Le passeur (en P2) sort au filet. Les 4 réceptionneurs forment un U : 2 sur la ligne des 3 m, 2 au fond. Le meilleur réceptionneur prend la zone la plus exposée.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          R4a:     [-3, 0, 3],
          C:       [0, 0, 3],
          A1:      [-2.5, 0, 6],
          A2:      [2.5, 0, 6],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          R4a: 'READY', C: 'READY', A1: 'READY', A2: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + manchette arrière',
      description: "Service en cloche dans le couloir arrière gauche. L'arrière gauche annonce et fait manchette dans son couloir.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          R4a:     [-3, 0, 3],
          C:       [0, 0, 3],
          A1:      [-1.5, 0, 5],
          A2:      [2.5, 0, 6],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-1.5, 1.2, 5],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'A1', impact: [-1.5, 0, 5] },
      ],
    },
    {
      id: 's3',
      title: '3. Passe vers la zone 4',
      description: "La balle arrive sur le passeur fixe en zone 2 (pas de pénétration en 5v5). Distribution rapide vers l'aile gauche. L'avant gauche entame sa course d'élan.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:       [2.5, 0, 0.8],
          R4a:     [-3, 0, 1.5],
          C:       [0, 0, 3],
          A1:      [-1.5, 0, 5],
          A2:      [2.5, 0, 6],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [2.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [2.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4a', to: [-3, 0, 1.5] },
      ],
    },
    {
      id: 's4',
      title: "4. Ballon disponible — couverture à 3",
      description: "La passe arrive en zone 4. L'avant gauche prend ses appuis. La couverture en 5v5 se fait à 3 joueurs seulement (pas 5 comme en 6v6) — le central et le passeur restent proches.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [2.5, 0, 0.8],
          R4a:     [-3, 0, 1],
          C:       [0, 0, 2],
          A1:      [-1.5, 0, 5],
          A2:      [2.5, 0, 6],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: '5. RESET — retour U',
      description: "Les 4 réceptionneurs retrouvent leur place dans le U, passeur fixe en P2.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          R4a:     [-3, 0, 3],
          C:       [0, 0, 3],
          A1:      [-2.5, 0, 6],
          A2:      [2.5, 0, 6],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'En 5v5 sans libéro, le meilleur réceptionneur prend la zone la plus exposée.',
      'Formation en U : 2 réceptionneurs sur les 3m + 2 au fond.',
      'Variante en ligne possible (4 alignés à mi-terrain) si moins de niveaux différents.',
      'Pas de pénétration → passeur fixe (système 4-1 simplifié).',
    ],
    commonMistakes: [
      'Forme U trop étroite → grandes diagonales non couvertes.',
      "Joueur faible en réception → l'isoler dans la plus petite zone.",
      'Passeur qui pénètre quand même → confusion avec le 6v6 standard.',
    ],
  },
};

export default STATE;
