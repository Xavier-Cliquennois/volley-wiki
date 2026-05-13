import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 4v4 U-formation reception: setter hidden at the net (P2), 3 receivers in a
// U shape (left wing, back center, right wing). More demanding than the
// losange but more offensive (the setter never receives).
const STATE: EditorState = {
  metadata: {
    id: '4v4-reception-u',
    title: '4v4 · Réception en U',
    shortDescription: 'Formation en U : passeur sorti + 3 réceptionneurs (gauche, fond, droite).',
    teamSize: 4,
    phase: 'reception',
    contextLabel: '4v4 · U · 4v4 compétitif',
    defaultCamera: 'BEHIND_SERVE',
  },
  players: [
    { id: 'P',       label: 'Passeur (caché)', role: 'setter',   color: COLORS.setter },
    { id: 'R4',      label: 'Aile G',          role: 'outside',  color: COLORS.outside },
    { id: 'A',       label: 'Fond centre',     role: 'libero',   color: COLORS.libero },
    { id: 'A2',      label: 'Aile D',          role: 'outside',  color: COLORS.opposite },
    { id: 'OPP_SRV', label: 'Serveur adv.',    role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Configuration en U',
      description: "Le passeur est caché en P2 au filet. 3 réceptionneurs en U : aile gauche, fond centre, aile droite. Chaque joueur couvre environ 1/3 de la largeur.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          R4:      [-3, 0, 4],
          A:       [0, 0, 6.5],
          A2:      [3, 0, 4],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [0, 1.5, -7.5],
        poses: {
          OPP_SRV: 'SPIKE',
          R4: 'READY', A: 'READY', A2: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: "2. Service + manchette de l'aile gauche",
      description: "Service en cloche vers le couloir gauche. L'aile gauche annonce et prend la balle dans son couloir. Trajectoire haute pour donner du temps au passeur.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          R4:      [-1, 0, 4.5],
          A:       [0, 0, 6.5],
          A2:      [3, 0, 4],
          OPP_SRV: [0, 0, -6.5],
        },
        ballPosition: [-1, 1.2, 4.5],
      },
      ballTrajectory: { curve: 'arc', apex: 3.8 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'R4', impact: [-1, 0, 4.5] },
      ],
    },
    {
      id: 's3',
      title: "3. Distribution vers l'aile gauche",
      description: "La balle arrive sur le passeur fixe en zone 2 (pas de pénétration en 4v4). Distribution rapide vers l'aile gauche qui enchaîne sa course d'élan immédiatement.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:       [2.5, 0, 0.8],
          R4:      [-3, 0, 2],
          A:       [0, 0, 6.5],
          A2:      [3, 0, 4],
          OPP_SRV: [0, 0, -6.5],
        },
        ballPosition: [2.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',  impact: [2.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4', to: [-3, 0, 2] },
      ],
    },
    {
      id: 's4',
      title: "4. Ballon disponible en zone 4",
      description: "La passe arrive en zone 4 pour l'aile gauche. Système plus offensif que le losange : le passeur n'a pas réceptionné, l'attaque est rapide et lisible.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [2.5, 0, 0.8],
          R4:      [-3, 0, 1.2],
          A:       [0, 0, 6.5],
          A2:      [3, 0, 4],
          OPP_SRV: [0, 0, -6.5],
        },
        ballPosition: [-3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: '5. RESET — retour au U',
      description: "Les 3 réceptionneurs retrouvent le U et le passeur retrouve sa cachette en P2.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          R4:      [-3, 0, 4],
          A:       [0, 0, 6.5],
          A2:      [3, 0, 4],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [0, 1.5, -7.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Réception en U = configuration 4v4 compétitive la plus efficace.',
      "3 réceptionneurs spécialisés + passeur sorti = 1 joueur disponible pour l'attaque sans avoir réceptionné.",
      'Cible zone 2 (passeur fixe) → distribution rapide.',
      'Plus exigeant techniquement que le losange mais plus offensif.',
    ],
    commonMistakes: [
      'Aile qui ne couvre pas le couloir entier → balle entre aile et fond perdue.',
      'Fond centre trop avancé → balles longues passent au-dessus.',
      'Passeur qui penche vers la réception → confusion.',
    ],
  },
};

export default STATE;
