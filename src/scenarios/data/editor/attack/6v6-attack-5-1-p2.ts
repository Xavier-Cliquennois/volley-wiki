import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5-1 rotation P2: setter front-right (zone 2), already at the net. No penetration.
// Opposite diagonally across in zone 5 (back row), R4s in zones 3 and 6, middle
// in zone 4, libero in zone 1 (for the back-row middle). Only 2 front-row
// attackers: the R4 and the middle permute so the R4 attacks in zone 4 and the
// middle fixes the block in zone 3.
//
// Labels carry "(zone n)" rather than "(Pn)" on purpose: resolvePlayerColor
// keys on "(Pn)" and would paint each player in its zone colour. Here the
// jersey follows the role (setter red, opposite purple, front/back R4 blue/yellow).
const STATE: EditorState = {
  metadata: {
    id: '6v6-attack-5-1-p2',
    title: 'Attaque · 5-1 rotation P2',
    shortDescription: 'Passeur déjà au filet en P2 : 2 attaquants devant, le R4 et le central permutent, attaque en zone 4.',
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P2 · Passeur avant',
    defaultCamera: 'DEFAULT',
    system: '5-1',
    rotation: 'R6',
  },
  players: [
    { id: 'P',       label: 'Passeur (zone 2)', role: 'setter',   color: COLORS.setter },
    { id: 'R4a',     label: 'R4 (zone 3)',      role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Central (zone 4)', role: 'middle',   color: COLORS.middle },
    { id: 'Pt',      label: 'Pointu (zone 5)',  role: 'opposite', color: COLORS.opposite },
    { id: 'R4b',     label: 'R4 (zone 6)',      role: 'outside',  color: COLORS.outside_back },
    { id: 'L',       label: 'Libéro (zone 1)',  role: 'libero',   color: COLORS.libero },
    { id: 'OPP_SRV', label: 'Serveur adv.',     role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BL',  label: 'Bloc adv. G',      role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BR',  label: 'Bloc adv. D',      role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_D1',  label: 'Déf. cross adv.',  role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Formation de réception',
      description: "Réception à 3 : R4 de la zone 3 reculé à gauche, R4 de la zone 6 au centre, libéro (zone 1) à droite. Le central (zone 4) reste au filet à gauche, le passeur attend déjà au filet en zone 2. Le pointu, arrière en zone 5, se cache au fond à gauche.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [3.3, 0, 0.6],
          R4a:     [-1.8, 0, 3.9],
          C:       [-3.6, 0, 0.6],
          Pt:      [-3.8, 0, 7.0],
          R4b:     [0.4, 0, 5.0],
          L:       [2.8, 0, 5.0],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [2.5, 0, -2.5],
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
      title: '2. Service + réception du libéro',
      description: "Service en cloche vers la zone 1. Le libéro fait manchette précise vers la cible passeur. Dès la frappe, le central glisse au centre du filet et le R4 de la zone 3 se décale vers la zone 4.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [2.6, 0, 0.8],
          R4a:     [-3.4, 0, 3.4],
          C:       [-0.3, 0, 0.6],
          Pt:      [-3.4, 0, 6.2],
          R4b:     [0.4, 0, 5.0],
          L:       [2.4, 0, 4.6],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [2.4, 1.2, 4.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'FLOAT_SERVE', id: 'b-s2-serve', playerId: 'OPP_SRV', impact: [0, 0, -9.5] },
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'L', impact: [2.4, 0, 4.6] },
      ],
    },
    {
      id: 's3',
      title: "3. Passe vers la zone 4 + course d'élan",
      description: "Le passeur, déjà en zone 2, reçoit la balle sans pénétrer. Le R4 lance sa course d'élan en zone 4 pendant que le central fixe au centre. Le bloc adverse glisse vers l'aile.",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          P:       [2.6, 0, 0.8],
          R4a:     [-4.3, 0, 2.6],
          C:       [-0.3, 0, 0.6],
          Pt:      [-3.0, 0, 5.4],
          R4b:     [0.4, 0, 5.0],
          L:       [2.4, 0, 4.6],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-3.6, 0, -0.4],
          OPP_BR:  [-1.7, 0, -0.4],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [2.6, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [2.6, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4a', to: [-4.3, 0, 2.6] },
      ],
    },
    {
      id: 's4',
      title: '4. Smash + double bloc',
      description: "Passe longue vers la zone 4 : le R4 décolle et frappe en diagonale longue, dans l'intervalle du bloc à 2. Le pointu et le R4 arrière couvrent l'attaquant, le passeur reste au filet.",
      tempo: 'standard',
      durationOverride: 1.3,
      snapshot: {
        positions: {
          P:       [2.2, 0, 1.2],
          R4a:     [-3.3, 0, 1.0],
          C:       [-0.6, 0, 1.2],
          Pt:      [-3.0, 0, 3.4],
          R4b:     [-1.2, 0, 3.6],
          L:       [2.0, 0, 4.2],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-3.6, 0, -0.4],
          OPP_BR:  [-1.7, 0, -0.4],
          OPP_D1:  [2.5, 0, -2.5],
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
      description: 'Le défenseur cross adverse plonge sur la diagonale longue pour tenter une manchette de sauvetage.',
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [2.2, 0, 1.2],
          R4a:     [-3.3, 0, 1.0],
          C:       [-0.6, 0, 1.2],
          Pt:      [-3.0, 0, 3.4],
          R4b:     [-1.2, 0, 3.6],
          L:       [2.0, 0, 4.2],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [-3.6, 0, -0.4],
          OPP_BR:  [-1.7, 0, -0.4],
          OPP_D1:  [2.2, 0, -5.8],
        },
        ballPosition: [2, 0.22, -6],
      },
      actions: [
        { kind: 'DEFENSE_PLONGEE', id: 'b-s5-dig', playerId: 'OPP_D1', impact: [2.2, 0, -5.8] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — retour formation',
      description: "Tous reprennent leur position de réception : le central revient en zone 4, le R4 en zone 3. La rotation P2 reste la plus pauvre offensivement : 2 attaquants devant seulement.",
      tempo: 'calme',
      durationOverride: 1.4,
      snapshot: {
        positions: {
          P:       [3.3, 0, 0.6],
          R4a:     [-1.8, 0, 3.9],
          C:       [-3.6, 0, 0.6],
          Pt:      [-3.8, 0, 7.0],
          R4b:     [0.4, 0, 5.0],
          L:       [2.8, 0, 5.0],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [2, 0.22, -6],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Ordre de rotation : passeur en zone 2, pointu à l\'opposé en zone 5, R4 en zones 3 et 6, central en 4, libéro en 1.',
      'Rotation P2 = la plus pauvre offensivement : seulement 2 attaquants devant (R4 + central).',
      'Passeur déjà en place : zéro pénétration, distribution facile.',
      'Le R4 et le central permutent dès le service : le R4 attaque en 4, le central fixe en 3.',
    ],
    commonMistakes: [
      "Passeur qui recule pour aller chercher une réception courte → 2ᵉ touche difficile.",
      'Permutation R4 ↔ central tardive → le central reste en zone 4, inutile au bloc.',
      "Central qui ne fixe pas → bloc à 2 facile pour l'adversaire sur l'aile.",
    ],
  },
};

export default STATE;
