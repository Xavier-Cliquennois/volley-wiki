import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5-1 rotation P4 — special case: setter is front-left (zone 4), so he must drift
// as far left as alignment rules allow and permute with the R4* (zone 2) who
// crosses over to attack from zone 4. Opposite diagonally across in zone 1, back
// R4 in zone 5, libero in zone 6 (for the back-row middle), middle in zone 3.
// Reception at 3: back R4 (main receiver here), libero, R4*.
//
// Labels carry "(zone n)" rather than "(Pn)" on purpose: resolvePlayerColor
// keys on "(Pn)" and would paint each player in its zone colour. Here the
// jersey follows the role (setter red, opposite purple, front/back R4 blue/yellow).
const STATE: EditorState = {
  metadata: {
    id: '6v6-reception-rotation-p4',
    title: 'Réception · 5-1 rotation P4',
    shortDescription: 'Cas spécial P4 : le passeur et le central se décalent à gauche pour que le R4* puisse recevoir à droite.',
    teamSize: 6,
    phase: 'reception',
    contextLabel: '5-1 · Réception à 3 · Rotation P4 (passeur avant)',
    defaultCamera: 'BEHIND_SERVE',
    system: '5-1',
    rotation: 'R4',
  },
  players: [
    { id: 'P',       label: 'Passeur (zone 4)', role: 'setter',   color: COLORS.setter },
    { id: 'C',       label: 'Central (zone 3)', role: 'middle',   color: COLORS.middle },
    { id: 'R4b',     label: 'R4* (zone 2)',     role: 'outside',  color: COLORS.outside },
    { id: 'Op',      label: 'Pointu (zone 1)',  role: 'opposite', color: COLORS.opposite },
    { id: 'L',       label: 'Libéro (zone 6)',  role: 'libero',   color: COLORS.libero },
    { id: 'R4a',     label: 'R4 (zone 5)',      role: 'outside',  color: COLORS.outside_back },
    { id: 'OPP_SRV', label: 'Serveur adv.',     role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Décalage à gauche',
      description: "AVANT la frappe : le passeur (zone 4) et le central (zone 3) se placent le PLUS À GAUCHE possible dans les règles d'alignement. Ce décalage permet au R4* (zone 2), qui doit rester à droite du central, de reculer en réception à droite. Réception à 3 : R4 (zone 5), libéro (zone 6), R4*. Le pointu (zone 1) se cache au fond à droite.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [-3.8, 0, 0.6],
          C:       [-1.6, 0, 0.6],
          R4b:     [2.4, 0, 4.0],
          Op:      [3.9, 0, 6.6],
          L:       [0.2, 0, 5.0],
          R4a:     [-2.4, 0, 4.6],
          OPP_SRV: [0, 0, -9.5],
        },
        ballPosition: [0, 2, -9.2],
        poses: {
          OPP_SRV: 'ARM_SPIKE',
          L: 'READY', R4a: 'READY', R4b: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + manchette du R4 en zone 5',
      description: "Service vers la zone 5. Le R4 arrière annonce et fait manchette vers la cible. Dès la frappe, le passeur quitte la zone 4 en passant derrière le central, et le R4* commence sa traversée.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [-1.0, 0, 1.9],
          C:       [-1.6, 0, 0.6],
          R4b:     [1.4, 0, 3.4],
          Op:      [3.9, 0, 6.6],
          L:       [0.2, 0, 5.0],
          R4a:     [-2.0, 0, 4.6],
          OPP_SRV: [0, 0, -8.7],
        },
        ballPosition: [-2.0, 1.2, 4.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'FLOAT_SERVE', id: 'b-s2-serve', playerId: 'OPP_SRV', impact: [0, 0, -9.5] },
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'R4a', impact: [-2.0, 0, 4.6] },
      ],
    },
    {
      id: 's3',
      title: '3. Pénétration + permutation R4*',
      description: "Le passeur arrive en 2-3 et reçoit la balle. Simultanément, le R4* termine sa traversée vers la zone 4 et lance sa course d'élan. Le central se replace en zone 3, le pointu avance pour menacer en attaque arrière.",
      tempo: 'standard',
      durationOverride: 1.1,
      snapshot: {
        positions: {
          P:       [1.5, 0, 0.8],
          C:       [0, 0, 0.6],
          R4b:     [-4.2, 0, 2.6],
          Op:      [3.0, 0, 4.4],
          L:       [0.2, 0, 5.0],
          R4a:     [-2.0, 0, 4.6],
          OPP_SRV: [0, 0, -8.7],
        },
        ballPosition: [1.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [1.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4b', to: [-4.2, 0, 2.6] },
      ],
    },
    {
      id: 's4',
      title: "4. Attaque du R4* en zone 4",
      description: "Passe haute vers le R4* qui a complété sa traversée. Avec seulement 2 attaquants devant (R4* + central), l'option principale est l'aile gauche. L'attaquant saute et frappe en diagonale vers le fond du terrain adverse.",
      tempo: 'rapide',
      durationOverride: 1.3,
      snapshot: {
        positions: {
          P:       [1.2, 0, 1.8],
          C:       [0, 0, 0.6],
          R4b:     [-3.3, 0, 1.0],
          Op:      [3.0, 0, 4.4],
          L:       [-0.6, 0, 3.8],
          R4a:     [-3.2, 0, 3.6],
          OPP_SRV: [0, 0, -8.7],
        },
        ballPosition: [2, 0.22, -6],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'R4b', impact: [-3.3, 0, 0.6], jumpHeight: 1.6, contactAtRatio: 0.65 },
      ],
    },
    {
      id: 's5',
      title: '5. RESET — retour au décalage',
      description: "Tous les joueurs reprennent le décalage à gauche pour le prochain service en rotation P4 : le passeur revient en zone 4 le long du filet, le R4* retourne en zone 2 par l'arrière.",
      tempo: 'calme',
      durationOverride: 1.4,
      snapshot: {
        positions: {
          P:       [-3.8, 0, 0.6],
          C:       [-1.6, 0, 0.6],
          R4b:     [2.4, 0, 4.0],
          Op:      [3.9, 0, 6.6],
          L:       [0.2, 0, 5.0],
          R4a:     [-2.4, 0, 4.6],
          OPP_SRV: [0, 0, -9.5],
        },
        ballPosition: [2, 0.22, -6],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Ordre de rotation : passeur en zone 4, pointu à l\'opposé en zone 1, R4 en zones 2 et 5, central en 3, libéro en 6.',
      'En P4, le passeur et le central DOIVENT se décaler à gauche au service.',
      'Ce décalage laisse au R4* (zone 2) la place de recevoir à droite, à côté du libéro.',
      'Permutation P↔R4* obligatoire pendant la réception.',
      "Le pointu (en zone 1) ne réceptionne pas et reste prêt à l'attaque arrière.",
    ],
    commonMistakes: [
      'Décalage oublié → le R4* ne peut pas reculer en réception sans faute de position.',
      'Permutation tardive → R4* attaque en zone 2 (mauvais côté).',
      "Pointu qui réceptionne → perd l'option d'attaque arrière.",
    ],
  },
};

export default STATE;
