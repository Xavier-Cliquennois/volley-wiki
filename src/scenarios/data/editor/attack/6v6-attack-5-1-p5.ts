import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5-1 rotation P5: setter back-left (zone 5) — longest penetration across the
// whole court. Opposite diagonally across in zone 2, R4s in zones 3 and 6,
// middle in zone 4, libero in zone 1 (for the back-row middle). The middle and
// the front R4 permute so the middle is back at zone 3. Attack to the opposite
// in zone 2.
//
// Labels carry "(zone n)" rather than "(Pn)" on purpose: resolvePlayerColor
// keys on "(Pn)" and would paint each player in its zone colour. Here the
// jersey follows the role (setter red, opposite purple, front/back R4 blue/yellow).
const STATE: EditorState = {
  metadata: {
    id: '6v6-attack-5-1-p5',
    title: 'Attaque · 5-1 rotation P5',
    shortDescription: 'Pénétration longue depuis P5. C/R4 permutent. Passe vers le pointu en zone 2.',
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P5 · Pénétration longue',
    defaultCamera: 'TOP_DOWN',
    system: '5-1',
    rotation: 'R3',
  },
  players: [
    { id: 'P',       label: 'Passeur (zone 5)', role: 'setter',   color: COLORS.setter },
    { id: 'C',       label: 'Central (zone 4)', role: 'middle',   color: COLORS.middle },
    { id: 'R4a',     label: 'R4 (zone 3)',      role: 'outside',  color: COLORS.outside },
    { id: 'Pt',      label: 'Pointu (zone 2)',  role: 'opposite', color: COLORS.opposite },
    { id: 'L',       label: 'Libéro (zone 1)',  role: 'libero',   color: COLORS.libero },
    { id: 'R4b',     label: 'R4 (zone 6)',      role: 'outside',  color: COLORS.outside_back },
    { id: 'OPP_SRV', label: 'Serveur adv.',     role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BL',  label: 'Bloc adv. G',      role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BR',  label: 'Bloc adv. D',      role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_D1',  label: 'Déf. diag. adv.',  role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Formation de réception',
      description: "Passeur en zone 5, arrière gauche, derrière le central (zone 4). Réception à 3 : R4 de la zone 3 reculé à gauche, R4 de la zone 6 au centre, libéro (zone 1) à droite. Le pointu attend au filet en zone 2. Le central et le R4 de la zone 3 vont permuter dès le service.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [-3.6, 0, 5.2],
          C:       [-3.5, 0, 0.6],
          R4a:     [-1.8, 0, 3.9],
          Pt:      [3.3, 0, 0.6],
          L:       [3.0, 0, 4.6],
          R4b:     [0.6, 0, 5.0],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [0, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [0, 0, -4.5],
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
      title: '2. Service + réception + permutation C↔R4',
      description: "Le service vise la zone 6 où le R4 arrière prend la réception. En parallèle, le central glisse au centre du filet, le R4 de la zone 3 part en zone 4 et le passeur démarre sa pénétration en passant derrière lui.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [-1.2, 0, 3.4],
          C:       [0, 0, 0.6],
          R4a:     [-4.2, 0, 2.6],
          Pt:      [3.3, 0, 0.6],
          L:       [3.0, 0, 4.6],
          R4b:     [0.6, 0, 4.6],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [0, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [0, 0, -4.5],
        },
        ballPosition: [0.6, 1.2, 4.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'FLOAT_SERVE', id: 'b-s2-serve', playerId: 'OPP_SRV', impact: [0, 0, -9.5] },
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'R4b', impact: [0.6, 0, 4.6] },
      ],
    },
    {
      id: 's3',
      title: "3. Pénétration longue + passe en zone 2",
      description: "Le passeur termine sa traversée depuis la zone 5 — la plus longue pénétration — et reçoit la balle entre les zones 2 et 3. Le pointu lance sa course d'élan en zone 2. Le bloc adverse glisse à droite pour fermer.",
      tempo: 'standard',
      durationOverride: 1.1,
      snapshot: {
        positions: {
          P:       [1.5, 0, 0.8],
          C:       [0, 0, 0.6],
          R4a:     [-4.2, 0, 2.6],
          Pt:      [3.4, 0, 1.6],
          L:       [3.0, 0, 4.6],
          R4b:     [0.6, 0, 4.6],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [1.6, 0, -0.4],
          OPP_BR:  [3.6, 0, -0.4],
          OPP_D1:  [0, 0, -4.5],
        },
        ballPosition: [1.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PENETRATION', id: 'b-s3-pen',  playerId: 'P',  to: [1.5, 0, 0.8] },
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',  impact: [1.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'Pt', to: [3.4, 0, 1.6] },
      ],
    },
    {
      id: 's4',
      title: '4. Smash diagonale + double bloc',
      description: "Passe courte vers la zone 2 : le pointu décolle et frappe en diagonale longue. Le bloc à 2 est en place côté droit. Le libéro, le R4 arrière et le passeur couvrent l'attaquant.",
      tempo: 'standard',
      durationOverride: 1.3,
      snapshot: {
        positions: {
          P:       [0.2, 0, 2.4],
          C:       [0, 0, 0.6],
          R4a:     [-3.6, 0, 2.2],
          Pt:      [3.3, 0, 1.0],
          L:       [2.8, 0, 3.0],
          R4b:     [1.0, 0, 3.4],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [1.6, 0, -0.4],
          OPP_BR:  [3.6, 0, -0.4],
          OPP_D1:  [0, 0, -4.5],
        },
        ballPosition: [-2.5, 0.22, -6],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'Pt',     impact: [3.3, 0, 0.6],  jumpHeight: 1.6, contactAtRatio: 0.65 },
        { kind: 'BLOC',  id: 'b-s4-blocL', playerId: 'OPP_BL', impact: [1.6, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.65 },
        { kind: 'BLOC',  id: 'b-s4-blocR', playerId: 'OPP_BR', impact: [3.6, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.65 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération adverse',
      description: "Le défenseur diagonal adverse plonge sur la balle longue pour tenter de la capter. Notre passeur, arrière, redescend déjà vers sa zone de défense.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [-0.6, 0, 3.4],
          C:       [0, 0, 0.6],
          R4a:     [-3.6, 0, 2.2],
          Pt:      [3.3, 0, 1.0],
          L:       [2.8, 0, 3.0],
          R4b:     [1.0, 0, 3.4],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [1.6, 0, -0.4],
          OPP_BR:  [3.6, 0, -0.4],
          OPP_D1:  [-2.5, 0, -5.8],
        },
        ballPosition: [-2.5, 0.22, -6],
      },
      actions: [
        { kind: 'DEFENSE_PLONGEE', id: 'b-s5-dig', playerId: 'OPP_D1', impact: [-2.5, 0, -5.8] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — retour formation',
      description: "Toute l'équipe reprend sa position de réception : le central revient en zone 4, le R4 en zone 3, le passeur en zone 5.",
      tempo: 'calme',
      durationOverride: 1.4,
      snapshot: {
        positions: {
          P:       [-3.6, 0, 5.2],
          C:       [-3.5, 0, 0.6],
          R4a:     [-1.8, 0, 3.9],
          Pt:      [3.3, 0, 0.6],
          L:       [3.0, 0, 4.6],
          R4b:     [0.6, 0, 5.0],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [0, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [0, 0, -4.5],
        },
        ballPosition: [-2.5, 0.22, -6],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Ordre de rotation : passeur en zone 5, pointu à l\'opposé en zone 2, R4 en zones 3 et 6, central en 4, libéro en 1.',
      'P5 = pénétration la plus longue. Exige une réception parfaite.',
      'Le central et le R4 permutent dès le service pour replacer C en zone 3.',
      'Le pointu en zone 2 est la cible la plus accessible pour le passeur.',
    ],
    commonMistakes: [
      'Passe trop tendue avec une pénétration en cours → passeur sous la balle.',
      'Permutation tardive C↔R4 → central en zone 4 = inutile au bloc.',
      'Passeur placé devant le central (zone 4) au service → faute de position.',
    ],
  },
};

export default STATE;
