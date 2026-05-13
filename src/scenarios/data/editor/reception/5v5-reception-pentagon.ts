import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5v5 pentagon reception: all 5 players receive, no dedicated setter.
// Whoever touches first leaves the second touch to the player closest to the
// net. Loisir / initiation flavour.
const STATE: EditorState = {
  metadata: {
    id: '5v5-reception-pentagon',
    title: '5v5 · Réception pentagone',
    shortDescription: 'Réception en pentagone (5 joueurs sans passeur sorti) — version débutant ou loisir.',
    teamSize: 5,
    phase: 'reception',
    contextLabel: '5v5 · Pentagone · Sans passeur dédié',
    defaultCamera: 'BEHIND_SERVE',
  },
  players: [
    { id: 'A1',      label: 'Avant G',      role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Centre',       role: 'middle',   color: COLORS.middle },
    { id: 'A2',      label: 'Avant D',      role: 'outside',  color: COLORS.opposite },
    { id: 'A3',      label: 'Arrière G',    role: 'libero',   color: COLORS.libero },
    { id: 'A4',      label: 'Arrière D',    role: 'opposite', color: COLORS.outside_back },
    { id: 'OPP_SRV', label: 'Serveur adv.', role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Pentagone à 5',
      description: "Tous les joueurs réceptionnent. Pas de passeur dédié — qui touche le premier laisse la 2ᵉ touche au joueur le plus proche du filet. Configuration loisir / initiation.",
      tempo: 'pause',
      snapshot: {
        positions: {
          A1:      [-3, 0, 2],
          C:       [0, 0, 4],
          A2:      [3, 0, 2],
          A3:      [-2, 0, 6.5],
          A4:      [2, 0, 6.5],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          A1: 'READY', C: 'READY', A2: 'READY', A3: 'READY', A4: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + centre annonce',
      description: "Service dans la zone centrale moyenne. Le joueur centre annonce et fait manchette — c'est son périmètre dans le pentagone.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          A1:      [-3, 0, 2],
          C:       [0, 0, 4.5],
          A2:      [3, 0, 2],
          A3:      [-2, 0, 6.5],
          A4:      [2, 0, 6.5],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [0, 1.2, 4.5],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'C', impact: [0, 0, 4.5] },
      ],
    },
    {
      id: 's3',
      title: "3. Passe d'opportunité",
      description: "La balle remonte vers le centre du filet. L'avant droit, le plus proche du ballon, s'avance et prend la 2ᵉ touche en passe haute selon la qualité de la réception.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          A1:      [-3, 0, 1.5],
          C:       [0, 0, 4.5],
          A2:      [0.5, 0, 1.5],
          A3:      [-2, 0, 6.5],
          A4:      [2, 0, 6.5],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [0.5, 2, 1.2],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'A2', impact: [0.5, 0, 1.5] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'A1', to: [-3, 0, 1.5] },
      ],
    },
    {
      id: 's4',
      title: "4. Ballon disponible — système simple",
      description: "La passe va vers l'avant gauche. Distribution lisible, idéale en initiation. Tout joueur peut faire la 2ᵉ touche selon l'angle d'arrivée du ballon.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          A1:      [-3, 0, 1],
          C:       [0, 0, 4.5],
          A2:      [0.5, 0, 1.5],
          A3:      [-2, 0, 6.5],
          A4:      [2, 0, 6.5],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: '5. RESET — retour pentagone',
      description: "Les 5 joueurs retrouvent leur place dans le pentagone pour le prochain service.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          A1:      [-3, 0, 2],
          C:       [0, 0, 4],
          A2:      [3, 0, 2],
          A3:      [-2, 0, 6.5],
          A4:      [2, 0, 6.5],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Pentagone sans passeur dédié = configuration loisir ou initiation.',
      '5 joueurs en pentagone : 2 avants, 1 centre, 2 arrières.',
      'Tout joueur peut faire la 2ᵉ touche selon où arrive le ballon.',
      'Avantage : grande adaptabilité. Inconvénient : moins de constance offensive.',
    ],
    commonMistakes: [
      'Pas de hiérarchie sur la 2ᵉ touche → 2 joueurs hésitent.',
      'Centre figé → balles de chaque côté manquent.',
      'Passes hautes systématiques sans distribution claire.',
    ],
  },
};

export default STATE;
