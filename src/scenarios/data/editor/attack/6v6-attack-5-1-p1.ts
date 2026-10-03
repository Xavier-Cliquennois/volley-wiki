import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5-1 rotation P1: setter back-right (zone 1), opposite diagonally across in
// zone 4, R4s in zones 2 and 5, middle in zone 3, libero in zone 6 (for the
// back-row middle). Reception at 3 (libero + both R4s); the setter penetrates
// from zone 1 while the front R4 crosses to zone 4 and the opposite to zone 2.
//
// Labels carry "(zone n)" rather than "(Pn)" on purpose: resolvePlayerColor
// keys on "(Pn)" and would paint the setter in the zone-1 purple. Here the
// jersey follows the role (setter red, opposite purple, front/back R4 blue/yellow).
const STATE: EditorState = {
  metadata: {
    id: '6v6-attack-5-1-p1',
    title: 'Attaque · 5-1 rotation P1',
    shortDescription: 'Réception à 3 → passeur pénètre depuis P1 → le R4 avant permute et attaque en zone 4.',
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P1 · Service adverse',
    system: '5-1',
    rotation: 'R1',
    defaultCamera: 'DEFAULT',
  },
  players: [
    { id: 'P',       label: 'Passeur (zone 1)', role: 'setter',   color: COLORS.setter },
    { id: 'R4a',     label: 'R4 (zone 2)',      role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Central (zone 3)', role: 'middle',   color: COLORS.middle },
    { id: 'Op',      label: 'Pointu (zone 4)',  role: 'opposite', color: COLORS.opposite },
    { id: 'R4b',     label: 'R4 (zone 5)',      role: 'outside',  color: COLORS.outside_back },
    { id: 'L',       label: 'Libéro (zone 6)',  role: 'libero',   color: COLORS.libero },
    { id: 'OPP_SRV', label: 'Serveur adv.',     role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BL',  label: 'Bloc adv. G',      role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BR',  label: 'Bloc adv. D',      role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_C',   label: 'Central adv.',     role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_S',   label: 'Passeur adv.',     role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BC',  label: 'Libéro adv.',      role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Formation de réception',
      description: "Réception à 3 : R4 de la zone 5 à gauche, libéro (zone 6) au centre, R4 de la zone 2 reculé à droite. Le pointu (zone 4) et le central (zone 3) restent au filet. Le passeur, en zone 1, se cache derrière le R4 de la zone 2, prêt à pénétrer.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [3.6, 0, 6.0],
          R4a:     [2.3, 0, 4.2],
          C:       [-0.5, 0, 0.6],
          Op:      [-3.5, 0, 0.6],
          R4b:     [-2.6, 0, 4.8],
          L:       [0, 0, 5.2],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_C:   [0, 0, -0.6],
          OPP_S:   [3, 0, -4],
          OPP_BC:  [0, 0, -6],
        },
        ballPosition: [0, 2, -9.2],
        poses: {
          OPP_SRV: 'ARM_SPIKE',
          L: 'READY', R4a: 'READY', R4b: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + réception',
      description: "Service adverse en cloche vers la zone 5 : le R4 arrière fait manchette. Dès la frappe, le passeur pénètre depuis la zone 1, le pointu passe derrière le central vers la droite et le R4 de la zone 2 commence à glisser vers la gauche.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [1.8, 0, 1.2],
          R4a:     [1.2, 0, 3.9],
          C:       [-0.5, 0, 0.6],
          Op:      [0.3, 0, 1.9],
          R4b:     [-2.2, 0, 4.6],
          L:       [0, 0, 5.2],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_C:   [0, 0, -0.6],
          OPP_S:   [3, 0, -4],
          OPP_BC:  [0, 0, -6],
        },
        ballPosition: [-2.2, 1.2, 4.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'FLOAT_SERVE', id: 'b-s2-serve', playerId: 'OPP_SRV', impact: [0, 0, -9.5] },
        { kind: 'MANCHETTE',   id: 'b-s2-recv', playerId: 'R4b', impact: [-2.2, 0, 4.6] },
        { kind: 'PENETRATION', id: 'b-s2-pen',  playerId: 'P',   to: [1.8, 0, 1.2] },
      ],
    },
    {
      id: 's3',
      title: "3. Permutations + course d'élan",
      description: "La réception remonte vers le passeur arrivé au filet. Le R4 de la zone 2 termine sa traversée et lance sa course d'élan en zone 4 ; le pointu prend la zone 2 et le central fixe au centre.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [1.5, 0, 0.8],
          R4a:     [-4.3, 0, 2.6],
          C:       [0, 0, 0.6],
          Op:      [3.4, 0, 2.0],
          R4b:     [-2.2, 0, 4.6],
          L:       [0, 0, 5.0],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-3.8, 0, -0.4],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_C:   [-1.9, 0, -0.4],
          OPP_S:   [3, 0, -4],
          OPP_BC:  [0, 0, -6],
        },
        ballPosition: [1.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [1.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4a', to: [-4.3, 0, 2.6] },
      ],
    },
    {
      id: 's4',
      title: '4. Smash + double bloc',
      description: "Passe haute vers la zone 4 : le R4 décolle et frappe en diagonale longue vers le fond du terrain adverse. Les deux contreurs ferment la ligne, la frappe passe dans l'intervalle. Le passeur, le R4 arrière et le libéro couvrent l'attaquant.",
      tempo: 'standard',
      durationOverride: 1.3,
      snapshot: {
        positions: {
          P:       [-1.3, 0, 2.4],
          R4a:     [-3.5, 0, 1.0],
          C:       [0, 0, 0.6],
          Op:      [2.2, 0, 2.4],
          R4b:     [-3.2, 0, 3.2],
          L:       [-1.2, 0, 3.8],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-3.8, 0, -0.4],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_C:   [-1.9, 0, -0.4],
          OPP_S:   [3, 0, -4],
          OPP_BC:  [0, 0, -6],
        },
        ballPosition: [2, 0.22, -6],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'R4a',    impact: [-3.5, 0, 0.6], jumpHeight: 1.6, contactAtRatio: 0.65 },
        { kind: 'BLOC',  id: 'b-s4-blocL', playerId: 'OPP_BL', impact: [-3.8, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.65 },
        { kind: 'BLOC',  id: 'b-s4-blocR', playerId: 'OPP_C', impact: [-1.9, 0, -0.4],   jumpHeight: 1.5, contactAtRatio: 0.65 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération adverse',
      description: "Le libéro adverse plonge sur la diagonale longue pour tenter une manchette désespérée. Le passeur adverse remonte vers la zone 2 pour relayer si la défense touche la balle.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [-1.3, 0, 2.4],
          R4a:     [-3.5, 0, 1.0],
          C:       [0, 0, 0.6],
          Op:      [2.2, 0, 2.4],
          R4b:     [-3.2, 0, 3.2],
          L:       [-1.2, 0, 3.8],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-3.8, 0, -0.4],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_C:   [-1.9, 0, -0.4],
          OPP_S:   [3, 0, -1.5],
          OPP_BC:  [2, 0, -5.8],
        },
        ballPosition: [2, 0.22, -6],
      },
      actions: [
        { kind: 'DEFENSE_PLONGEE', id: 'b-s5-dig', playerId: 'OPP_BC', impact: [2, 0, -5.8] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — retour formation',
      description: "Toute l'équipe reprend sa position de réception pour le service suivant : le R4 retourne en zone 2, le pointu en zone 4. C'est ce placement qui détermine la qualité de la prochaine attaque.",
      tempo: 'calme',
      durationOverride: 1.4,
      snapshot: {
        positions: {
          P:       [3.6, 0, 6.0],
          R4a:     [2.3, 0, 4.2],
          C:       [-0.5, 0, 0.6],
          Op:      [-3.5, 0, 0.6],
          R4b:     [-2.6, 0, 4.8],
          L:       [0, 0, 5.2],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_C:   [0, 0, -0.6],
          OPP_S:   [3, 0, -4],
          OPP_BC:  [0, 0, -6],
        },
        ballPosition: [2, 0.22, -6],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Ordre de rotation : passeur en zone 1, pointu à l\'opposé en zone 4, R4 en zones 2 et 5, central en 3, libéro en 6.',
      'Réception à 3 : libéro + 2 R4 prennent toute la largeur du terrain.',
      'Le passeur pénètre dès la frappe du service depuis la zone 1 vers la zone 2-3.',
      'Après la réception, le R4 avant traverse vers la zone 4 et le pointu prend la zone 2.',
    ],
    commonMistakes: [
      "Passeur qui pénètre trop tard → passe forcée en suspension par un autre joueur.",
      "Passeur placé devant le R4 de la zone 2 au service → faute de position.",
      "Couverture oubliée → block adverse réussi = point perdu directement.",
    ],
  },
};

export default STATE;
