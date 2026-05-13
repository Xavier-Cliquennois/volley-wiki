import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5-1 rotation P2: setter is front-right (P2), already at the net. No penetration.
// Only 2 front-row attackers (C + Op). The opposite exceptionally attacks in zone 4
// so the setter (in zone 2) is not forced to back away from the net.
const STATE: EditorState = {
  metadata: {
    id: '6v6-attack-5-1-p2',
    title: 'Attaque · 5-1 rotation P2',
    shortDescription: 'Passeur déjà au filet en P2 : 2 attaquants devant + pointu attaque en 4 exceptionnellement.',
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P2 · Passeur avant',
    defaultCamera: 'DEFAULT',
  },
  players: [
    { id: 'R4a',     label: 'R4 (P5)',        role: 'outside',  color: COLORS.outside_back },
    { id: 'L',       label: 'Libéro (P6)',    role: 'libero',   color: COLORS.libero },
    { id: 'R4b',     label: 'R4 (P1)',        role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Central (P3)',   role: 'middle',   color: COLORS.middle },
    { id: 'Pt',      label: 'Pointu (P4)',    role: 'opposite', color: COLORS.opposite },
    { id: 'P',       label: 'Passeur (P2)',   role: 'setter',   color: COLORS.setter },
    { id: 'OPP_SRV', label: 'Serveur adv.',   role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BL',  label: 'Bloc adv. G',    role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BR',  label: 'Bloc adv. D',    role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_D1',  label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Service adverse',
      description: 'Service en zone 5-6. Le libéro annonce et se prépare à la manchette. Le passeur attend déjà au filet en P2.',
      tempo: 'pause',
      snapshot: {
        positions: {
          R4a:     [-3, 0, 4],
          L:       [0, 0, 5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Pt:      [-3, 0, 0.6],
          P:       [3, 0, 0.6],
          OPP_SRV: [0, 0, -8.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          L: 'READY', R4a: 'READY', R4b: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + réception du libéro',
      description: 'Service en cloche vers la zone 6. Le libéro avance et fait manchette précise vers la cible passeur (zone 2).',
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          R4a:     [-3, 0, 4],
          L:       [-1.5, 0, 4.5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Pt:      [-3, 0, 0.6],
          P:       [3, 0, 0.6],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [-1.5, 1.2, 4.5],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'L', impact: [-1.5, 0, 4.5] },
      ],
    },
    {
      id: 's3',
      title: "3. Passe vers le pointu + course d'élan",
      description: "Le passeur, déjà en P2, distribue exceptionnellement vers la zone 4 où le pointu lance sa course d'élan. Le bloc adverse se regroupe au centre.",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          R4a:     [-3, 0, 4],
          L:       [-1.5, 0, 4.5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Pt:      [-3.2, 0, 1.5],
          P:       [2.5, 0, 0.8],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-1, 0, -0.4],
          OPP_BR:  [1, 0, -0.4],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [2.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',  impact: [2.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'Pt', to: [-3.2, 0, 1.5] },
      ],
    },
    {
      id: 's4',
      title: '4. Smash + double bloc',
      description: 'Le pointu décolle à gauche et frappe en diagonale longue. Configuration rare mais incontournable en P2 — le passeur reste sur place.',
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          R4a:     [-3, 0, 4],
          L:       [-1.5, 0, 4.5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Pt:      [-3.2, 0, 1.0],
          P:       [2.5, 0, 0.8],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-1, 0, -0.4],
          OPP_BR:  [1, 0, -0.4],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [2.5, 0, -7],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'Pt',     impact: [-3.2, 0, 0.6], jumpHeight: 1.6, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocL', playerId: 'OPP_BL', impact: [-1, 0, -0.4],  jumpHeight: 1.5, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocR', playerId: 'OPP_BR', impact: [1, 0, -0.4],   jumpHeight: 1.5, contactAtRatio: 0.45 },
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
          R4a:     [-3, 0, 4],
          L:       [-1.5, 0, 4.5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Pt:      [-3.2, 0, 0.6],
          P:       [2.5, 0, 0.8],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-1, 0, -0.4],
          OPP_BR:  [1, 0, -0.4],
          OPP_D1:  [2.5, 0, -6.5],
        },
        ballPosition: [2.5, 0, -7],
      },
      actions: [
        { kind: 'DEFENSE_PLONGEE', id: 'b-s5-dig', playerId: 'OPP_D1', impact: [2.5, 0, -6.5] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — retour formation',
      description: "Tous reprennent leur position de réception. La rotation P2 reste la plus pauvre offensivement : 2 attaquants devant seulement.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          R4a:     [-3, 0, 4],
          L:       [0, 0, 5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Pt:      [-3, 0, 0.6],
          P:       [3, 0, 0.6],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [2.5, 0, -7],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Rotation P2 = la plus pauvre offensivement (seulement 2 attaquants devant).',
      'Passeur déjà en place : zéro pénétration, distribution facile.',
      'Le pointu attaque exceptionnellement à gauche (poste 4) pour libérer le passeur.',
      "Privilégier les ailes et l'attaque arrière des R4 en option.",
    ],
    commonMistakes: [
      "Passeur qui veut faire un set en 2 alors qu'il y est déjà → 2ᵉ touche difficile.",
      'Pointu qui hésite entre 2 et 4 → contre adverse en place.',
      "Centraux qui ne fixent pas → bloc à 2 facile pour l'adversaire.",
    ],
  },
};

export default STATE;
