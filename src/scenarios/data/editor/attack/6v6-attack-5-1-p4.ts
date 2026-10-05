import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5-1 rotation P4: setter front-left (zone 4), opposite diagonally across in
// zone 1, R4s in zones 2 and 5, middle in zone 3, libero in zone 6 (for the
// back-row middle). The setter permutes from zone 4 to 2-3 while the R4* (zone 2)
// crosses over to attack in zone 4. Crossed placement is essential.
//
// Labels carry "(zone n)" rather than "(Pn)" on purpose: resolvePlayerColor
// keys on "(Pn)" and would paint each player in its zone colour. Here the
// jersey follows the role (setter red, opposite purple, front/back R4 blue/yellow).
const STATE: EditorState = {
  metadata: {
    id: '6v6-attack-5-1-p4',
    title: 'Attaque · 5-1 rotation P4',
    shortDescription: 'Passeur avant en P4 permute vers la droite ; R4* attaque en 4, central en 3, pointu arrière en 1.',
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P4 · Passeur avant',
    defaultCamera: 'DEFAULT',
    system: '5-1',
    rotation: 'R4',
  },
  players: [
    { id: 'P',       label: 'Passeur (zone 4)', role: 'setter',   color: COLORS.setter },
    { id: 'C',       label: 'Central (zone 3)', role: 'middle',   color: COLORS.middle },
    { id: 'R4a',     label: 'R4* (zone 2)',     role: 'outside',  color: COLORS.outside },
    { id: 'Pt',      label: 'Pointu (zone 1)',  role: 'opposite', color: COLORS.opposite },
    { id: 'L',       label: 'Libéro (zone 6)',  role: 'libero',   color: COLORS.libero },
    { id: 'R4b',     label: 'R4 (zone 5)',      role: 'outside',  color: COLORS.outside_back },
    { id: 'OPP_SRV', label: 'Serveur adv.',     role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BL',  label: 'Bloc adv. G',      role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BR',  label: 'Bloc adv. D',      role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_D1',  label: 'Déf. diag. adv.',  role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Configuration P4 + décalage',
      description: "Passeur en zone 4, R4* en zone 2 : placement croisé. Passeur et central se décalent à gauche pour que le R4* puisse reculer en réception à droite. Réception à 3 : R4 (zone 5), libéro (zone 6), R4* (zone 2). Le pointu, en zone 1, se cache au fond à droite.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [-3.8, 0, 0.6],
          C:       [-1.5, 0, 0.6],
          R4a:     [2.4, 0, 4.0],
          Pt:      [3.9, 0, 6.8],
          L:       [0, 0, 5.0],
          R4b:     [-2.6, 0, 4.6],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [0, 0, -0.5],
          OPP_D1:  [3.0, 0, -3.5],
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
      title: '2. Service + réception libéro',
      description: "Le service vise la zone 6. Le libéro avance et fait manchette vers la cible classique (entre zones 2 et 3). Dès la frappe, le passeur quitte la zone 4 en passant derrière le central et le R4* commence sa traversée.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [-1.0, 0, 1.9],
          C:       [-1.5, 0, 0.6],
          R4a:     [1.4, 0, 3.4],
          Pt:      [3.9, 0, 6.8],
          L:       [0, 0, 4.6],
          R4b:     [-2.6, 0, 4.6],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [0, 0, -0.5],
          OPP_D1:  [3.0, 0, -3.5],
        },
        ballPosition: [0, 1.2, 4.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'FLOAT_SERVE', id: 'b-s2-serve', playerId: 'OPP_SRV', impact: [0, 0, -9.5] },
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'L', impact: [0, 0, 4.6] },
      ],
    },
    {
      id: 's3',
      title: '3. Permutation P↔R4* + passe haute',
      description: "Croisement essentiel : le passeur arrive en 2-3 pendant que le R4* termine sa traversée vers la zone 4 et lance sa course d'élan. Le central se replace en zone 3, le pointu avance pour menacer en attaque arrière.",
      tempo: 'standard',
      durationOverride: 1.1,
      snapshot: {
        positions: {
          P:       [1.5, 0, 0.8],
          C:       [0, 0, 0.6],
          R4a:     [-4.2, 0, 2.6],
          Pt:      [3.0, 0, 4.4],
          L:       [0, 0, 4.6],
          R4b:     [-2.6, 0, 4.6],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-3.6, 0, -0.4],
          OPP_BR:  [-1.7, 0, -0.4],
          OPP_D1:  [3.0, 0, -3.5],
        },
        ballPosition: [1.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [1.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4a', to: [-4.2, 0, 2.6] },
      ],
    },
    {
      id: 's4',
      title: "4. Attaque sur l'aile + double bloc",
      description: "Passe haute vers la zone 4 : le R4* frappe en diagonale longue. Avec un passeur avant (donc petit au bloc), l'attaque doit conclure rapidement. Bloc à 2 décalé sur l'aile.",
      tempo: 'standard',
      durationOverride: 1.3,
      snapshot: {
        positions: {
          P:       [-0.6, 0, 2.2],
          C:       [0, 0, 0.6],
          R4a:     [-3.3, 0, 1.0],
          Pt:      [3.0, 0, 4.4],
          L:       [-0.6, 0, 3.8],
          R4b:     [-3.2, 0, 3.6],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-3.6, 0, -0.4],
          OPP_BR:  [-1.7, 0, -0.4],
          OPP_D1:  [3.0, 0, -3.5],
        },
        ballPosition: [2, 0.22, -6],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'R4a',    impact: [-3.3, 0, 0.6], jumpHeight: 1.6, contactAtRatio: 0.65 },
        { kind: 'BLOC',  id: 'b-s4-blocL', playerId: 'OPP_BL', impact: [-3.6, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.65 },
        { kind: 'BLOC',  id: 'b-s4-blocR', playerId: 'OPP_BR', impact: [-1.7, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.65 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération adverse',
      description: "Le défenseur diagonale adverse plonge sur la trajectoire longue pour tenter une manchette désespérée. Notre attaquant retombe et recule déjà vers la défense.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [-0.6, 0, 2.2],
          C:       [0, 0, 0.6],
          R4a:     [-2.6, 0, 2.4],
          Pt:      [3.0, 0, 4.4],
          L:       [-0.6, 0, 3.8],
          R4b:     [-3.2, 0, 3.6],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-3.6, 0, -0.4],
          OPP_BR:  [-1.7, 0, -0.4],
          OPP_D1:  [2, 0, -5.8],
        },
        ballPosition: [2, 0.22, -6],
      },
      actions: [
        { kind: 'DEFENSE_PLONGEE', id: 'b-s5-dig', playerId: 'OPP_D1', impact: [2, 0, -5.8] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — retour formation',
      description: "Tout le monde reprend sa position initiale : le R4* retourne en zone 2, le passeur en zone 4. Le décalage passeur/central à gauche est conservé pour le service suivant.",
      tempo: 'calme',
      durationOverride: 1.4,
      snapshot: {
        positions: {
          P:       [-3.8, 0, 0.6],
          C:       [-1.5, 0, 0.6],
          R4a:     [2.4, 0, 4.0],
          Pt:      [3.9, 0, 6.8],
          L:       [0, 0, 5.0],
          R4b:     [-2.6, 0, 4.6],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [0, 0, -0.5],
          OPP_D1:  [3.0, 0, -3.5],
        },
        ballPosition: [2, 0.22, -6],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Ordre de rotation : passeur en zone 4, pointu à l\'opposé en zone 1, R4 en zones 2 et 5, central en 3, libéro en 6.',
      'Rotation P4 = passeur avant. Permutation P↔R4* obligatoire.',
      '2 attaquants devant : R4* en 4, central en 3. Pipe ou pointu arrière en option.',
      "Le pointu (en zone 1) ne réceptionne pas et reste prêt pour l'attaque arrière.",
    ],
    commonMistakes: [
      'Permutation oubliée → le R4* reste à droite, attaquant en mauvaise position.',
      'Passeur et central trop à droite au service → le R4* ne peut pas reculer en réception.',
      "Bloc adverse non fixé par le central → bloc à 2 facile sur l'aile gauche.",
    ],
  },
};

export default STATE;
