import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 4v4 losange (1-2-1) reception. Setter at the center of the net (P3),
// two wings on the 3 m line (P4/P2), one back receiver (P1).
// No libero allowed in 4v4 UNSS.
const STATE: EditorState = {
  metadata: {
    id: '4v4-reception-losange',
    title: '4v4 · Réception losange',
    shortDescription: 'Formation losange canonique : passeur en P3 (centre filet) + 2 ailes sur les 3 m + arrière au fond.',
    teamSize: 4,
    phase: 'reception',
    contextLabel: '4v4 · Losange (1-2-1) · Passeur centre',
    defaultCamera: 'BEHIND_SERVE',
  },
  players: [
    { id: 'P',       label: 'Passeur (P3)', role: 'setter',   color: COLORS.setter },
    { id: 'R4',      label: 'Aile G (P4)',  role: 'outside',  color: COLORS.outside },
    { id: 'A2',      label: 'Aile D (P2)',  role: 'outside',  color: COLORS.opposite },
    { id: 'A',       label: 'Arrière (P1)', role: 'libero',   color: COLORS.libero },
    { id: 'OPP_SRV', label: 'Serveur adv.', role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Formation losange',
      description: "Disposition canonique 1-2-1 : passeur AU CENTRE du filet (P3), 2 ailes sur les 3 m (G + D), arrière au fond. Pas de libéro autorisé en 4v4 UNSS. Tous en READY.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [0, 0, 0.6],
          R4:      [-2.5, 0, 2.5],
          A2:      [2.5, 0, 2.5],
          A:       [0, 0, 5.5],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [0, 1.5, -7.5],
        poses: {
          OPP_SRV: 'SPIKE',
          R4: 'READY', A2: 'READY', A: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + manchette arrière',
      description: "Service en cloche dans la zone centrale. L'arrière unique annonce \"J'ai !\" et avance légèrement vers la balle.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [0, 0, 0.6],
          R4:      [-2.5, 0, 2.5],
          A2:      [2.5, 0, 2.5],
          A:       [0, 0, 4.5],
          OPP_SRV: [0, 0, -6.5],
        },
        ballPosition: [0, 1.2, 4.5],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'A', impact: [0, 0, 4.5] },
      ],
    },
    {
      id: 's3',
      title: "3. Passe vers l'aile gauche",
      description: "Manchette haute vers le passeur au centre du filet (pas de pénétration en losange). Il distribue vers la zone 4. L'aile gauche enchaîne sa course d'élan courte.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:       [0, 0, 0.6],
          R4:      [-3, 0, 1.5],
          A2:      [2.5, 0, 2.5],
          A:       [0, 0, 4.5],
          OPP_SRV: [0, 0, -6.5],
        },
        ballPosition: [0, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.8 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',  impact: [0, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4', to: [-3, 0, 1.5] },
      ],
    },
    {
      id: 's4',
      title: "4. Ballon disponible + couverture courte",
      description: "La passe arrive en zone 4. L'aile droite resserre vers le centre pour couvrir, l'arrière remonte légèrement. Avec un seul bloc adverse, l'angle de frappe reste ouvert.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [0, 0, 0.6],
          R4:      [-3, 0, 1],
          A2:      [1.5, 0, 1.5],
          A:       [-1, 0, 3],
          OPP_SRV: [0, 0, -6.5],
        },
        ballPosition: [-3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: '5. RESET — retour au losange',
      description: "Tout le monde reprend sa position dans le losange pour le prochain service.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [0, 0, 0.6],
          R4:      [-2.5, 0, 2.5],
          A2:      [2.5, 0, 2.5],
          A:       [0, 0, 5.5],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [0, 1.5, -7.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Losange canonique (1-2-1) = formation 4v4 la plus utilisée.',
      'Variante "passeur centre" : passeur en P3 au filet, distribue à gauche OU à droite.',
      'Pas de libéro autorisé en 4v4 UNSS — tous doivent savoir réceptionner.',
      'Chaque joueur défend ~30-40 m² (vs ~20 m² en 6v6).',
    ],
    commonMistakes: [
      'Confusion sur les ballons centraux entre 2 zones → annonce obligatoire.',
      'Arrière unique trop reculé → balles courtes après le filet non couvertes.',
      'Passeur qui réceptionne aussi → impossible de faire la 2ᵉ touche derrière.',
    ],
  },
};

export default STATE;
