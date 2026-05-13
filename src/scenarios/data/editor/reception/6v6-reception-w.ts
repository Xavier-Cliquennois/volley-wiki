import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 6v6 W formation reception (5 receivers, setter out at the net in 4-2).
// Beginner-friendly: small individual zones, the middle player covers the
// central pocket where the W "opens".
const STATE: EditorState = {
  metadata: {
    id: '6v6-reception-w',
    title: 'Réception · W (5 réceptionneurs)',
    shortDescription: 'Formation en W : 5 joueurs sauf le passeur. Adapté aux débutants et au système 4-2.',
    teamSize: 6,
    phase: 'reception',
    contextLabel: '4-2 · W · Débutants / M13',
    defaultCamera: 'BEHIND_SERVE',
  },
  players: [
    { id: 'P',       label: 'Passeur (sorti)', role: 'setter',   color: COLORS.setter },
    { id: 'R4a',     label: 'Avant G',         role: 'outside',  color: COLORS.outside },
    { id: 'R4b',     label: 'Avant D',         role: 'outside',  color: COLORS.opposite },
    { id: 'C',       label: 'Médian',          role: 'middle',   color: COLORS.middle },
    { id: 'A1',      label: 'Arrière G',       role: 'outside',  color: COLORS.outside_back },
    { id: 'A2',      label: 'Arrière D',       role: 'libero',   color: COLORS.libero },
    { id: 'OPP_SRV', label: 'Serveur adv.',    role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Formation W',
      description: "Disposition en W : 2 avants à mi-terrain, 1 médian au centre, 2 arrières au fond. Le passeur est déjà sorti au filet en P2 (système 4-2). Chaque joueur défend une petite zone bien délimitée.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          R4a:     [-2.8, 0, 3],
          R4b:     [2.8, 0, 3],
          C:       [0, 0, 5],
          A1:      [-2.8, 0, 7],
          A2:      [2.8, 0, 7],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          R4a: 'READY', R4b: 'READY', C: 'READY', A1: 'READY', A2: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + médian annonce',
      description: "Service en cloche dans la zone centrale. Le médian annonce \"J'ai !\" car la balle tombe dans la poche centrale du W, à équidistance des avants.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          R4a:     [-2.8, 0, 3],
          R4b:     [2.8, 0, 3],
          C:       [0, 0, 5.2],
          A1:      [-2.8, 0, 7],
          A2:      [2.8, 0, 7],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [0, 1.2, 5.2],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'C', impact: [0, 0, 5.2] },
      ],
    },
    {
      id: 's3',
      title: '3. Passe haute vers la zone 4',
      description: "Manchette dirigée vers la zone 2 où le passeur attend déjà au filet (pas de pénétration en 4-2). Il distribue en cloche vers la zone 4. L'avant gauche déclenche sa course d'élan.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:       [2.5, 0, 0.8],
          R4a:     [-3, 0, 1.5],
          R4b:     [2.8, 0, 3],
          C:       [0, 0, 5.2],
          A1:      [-2.8, 0, 7],
          A2:      [2.8, 0, 7],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [2.5, 2, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [2.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4a', to: [-3, 0, 1.5] },
      ],
    },
    {
      id: 's4',
      title: "4. Ballon disponible à l'attaquant",
      description: "La balle arrive en zone 4. L'avant gauche prend ses derniers appuis. En 4-2, les options offensives sont limitées (2 attaquants devant), mais la simplicité du système compense.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [2.5, 0, 0.8],
          R4a:     [-3, 0, 1],
          R4b:     [2.8, 0, 3],
          C:       [0, 0, 5.2],
          A1:      [-2.8, 0, 7],
          A2:      [2.8, 0, 7],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: '5. RESET — retour formation W',
      description: "Tout le monde retrouve sa zone dans le W pour le prochain service.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          R4a:     [-2.8, 0, 3],
          R4b:     [2.8, 0, 3],
          C:       [0, 0, 5],
          A1:      [-2.8, 0, 7],
          A2:      [2.8, 0, 7],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Formation W = 5 réceptionneurs, le passeur sort.',
      'Petites zones individuelles → moins de doute, peu de conflits.',
      'Idéal en M13/M15 et en système 4-2 (débutants).',
      'Inconvénient : les attaquants spécialisés sont bridés en réception.',
    ],
    commonMistakes: [
      'Conflit central entre médian et avants → annonce obligatoire.',
      'Joueurs trop figés dans leur zone → balle entre 2 zones perdue.',
      'Passeur qui reste en réception → impossible de faire la 2ᵉ touche.',
    ],
  },
};

export default STATE;
