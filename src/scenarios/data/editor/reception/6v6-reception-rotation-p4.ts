import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5-1 rotation P4 — special case: setter is front-left (P4), so he must drift
// as far left as alignment rules allow and permute with the R4* in P2 who
// crosses over to attack from zone 4. The R4 in P6 is the main receiver.
const STATE: EditorState = {
  metadata: {
    id: '6v6-reception-rotation-p4',
    title: 'Réception · 5-1 rotation P4',
    shortDescription: 'Cas spécial P4 : le passeur et le central se décalent à gauche pour libérer le R4 en zone 6.',
    teamSize: 6,
    phase: 'reception',
    contextLabel: '5-1 · Réception à 3 · Rotation P4 (passeur avant)',
    defaultCamera: 'BEHIND_SERVE',
  },
  players: [
    { id: 'P',       label: 'Passeur (P4)',  role: 'setter',   color: COLORS.setter },
    { id: 'C',       label: 'Central (P3)',  role: 'middle',   color: COLORS.middle },
    { id: 'R4b',     label: 'R4* (P2)',      role: 'outside',  color: COLORS.outside },
    { id: 'L',       label: 'Libéro (P5)',   role: 'libero',   color: COLORS.libero },
    { id: 'R4a',     label: 'R4 (P6)',       role: 'outside',  color: COLORS.middle_back },
    { id: 'Op',      label: 'Pointu (P1)',   role: 'opposite', color: COLORS.opposite },
    { id: 'OPP_SRV', label: 'Serveur adv.',  role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Décalage à gauche',
      description: "AVANT la frappe : le passeur (P4) et le central (P3) se placent le PLUS À GAUCHE possible dans les règles d'alignement. Ce décalage libère la zone 6 pour le R4 réceptionneur.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [-3.8, 0, 0.6],
          C:       [-1.5, 0, 0.6],
          R4b:     [3, 0, 0.6],
          L:       [-2.5, 0, 4],
          R4a:     [0, 0, 5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          L: 'READY', R4a: 'READY', Op: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + manchette du R4 en P6',
      description: "Service vers la zone 6 centrale. Le R4 en P6 annonce et fait manchette dans la zone libérée par le décalage du passeur. Trois réceptionneurs : libéro, R4 et pointu (en bord).",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [-3.8, 0, 0.6],
          C:       [-1.5, 0, 0.6],
          R4b:     [3, 0, 0.6],
          L:       [-2.5, 0, 4],
          R4a:     [0, 0, 5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [0, 1.2, 5],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'R4a', impact: [0, 0, 5] },
      ],
    },
    {
      id: 's3',
      title: '3. Pénétration + permutation R4*',
      description: "Le passeur fonce de P4 vers la zone 2-3. Simultanément, le R4* en P2 traverse vers P4 pour s'y présenter à l'attaque. Le central se replace en zone 3.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:       [1.5, 0, 0.8],
          C:       [0, 0, 0.6],
          R4b:     [-3, 0, 0.6],
          L:       [-2.5, 0, 4],
          R4a:     [0, 0, 5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [1.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [1.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4b', to: [-3, 0, 0.6] },
      ],
    },
    {
      id: 's4',
      title: "4. Ballon disponible pour R4* en zone 4",
      description: "La passe arrive vers le R4* qui a complété sa traversée. Avec seulement 2 attaquants devant (R4* + central), l'option principale est l'aile gauche.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [1.5, 0, 0.8],
          C:       [0, 0, 0.6],
          R4b:     [-3, 0, 1],
          L:       [-2.5, 0, 4],
          R4a:     [0, 0, 5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: '5. RESET — retour au décalage',
      description: "Tous les joueurs reprennent le décalage à gauche pour le prochain service en rotation P4.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [-3.8, 0, 0.6],
          C:       [-1.5, 0, 0.6],
          R4b:     [3, 0, 0.6],
          L:       [-2.5, 0, 4],
          R4a:     [0, 0, 5],
          Op:      [3, 0, 4],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'En P4, le passeur et le central DOIVENT se décaler à gauche au service.',
      'Ce décalage ouvre la zone 6 pour la réception du R4 en P6.',
      'Permutation P↔R4* obligatoire pendant la passe.',
      "Le pointu (en P1) ne réceptionne pas et reste prêt à l'attaque arrière.",
    ],
    commonMistakes: [
      'Décalage oublié → conflit de réception en zone 6.',
      'Permutation tardive → R4* attaque en P2 (mauvais côté).',
      "Pointu qui réceptionne → perd l'option d'attaque arrière.",
    ],
  },
};

export default STATE;
