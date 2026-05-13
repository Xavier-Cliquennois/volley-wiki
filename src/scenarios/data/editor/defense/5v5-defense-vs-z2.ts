import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5v5 defense vs Z2 — mirror of Z4. Block: R4 (line) + central (diagonal),
// pointu becomes off-blocker on the right wing, setter (P1) defends the long cross-court.
const STATE: EditorState = {
  metadata: {
    id: '5v5-defense-vs-z2',
    title: '5v5 · Défense Z2',
    shortDescription: 'Miroir parfait de Z4. Système 2-1-2 sur attaque adverse Z2 (sa droite → arrive notre gauche).',
    teamSize: 5,
    phase: 'defense',
    contextLabel: '5v5 · 2-1-2 · Bloc à 2 + off-blocker',
    defaultCamera: 'DEFAULT',
  },
  players: [
    { id: 'C',     label: 'Central (P3)',      role: 'middle',   color: COLORS.middle },
    { id: 'Op',    label: 'Pointu (P2)',       role: 'opposite', color: COLORS.opposite },
    { id: 'R4',    label: 'R4 (P4)',           role: 'outside',  color: COLORS.outside },
    { id: 'L',     label: 'Libéro (P5)',       role: 'libero',   color: COLORS.libero },
    { id: 'P',     label: 'Passeur (P1)',      role: 'setter',   color: COLORS.setter },
    { id: 'OPP_A', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_S', label: 'Passeur adv.',      role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Lecture attaque Z2 adverse',
      description: "Attaque adverse en sa zone 2 (sa droite) → arrive sur notre coin avant-GAUCHE. Miroir parfait de Z4.",
      tempo: 'pause',
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
          OPP_A: [-3, 0, -3],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [1.5, 1.8, -0.8],
        poses: {
          L: 'READY', P: 'READY', C: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Passe haute vers Z2 adverse',
      description: "Distribution vers leur ailier droit. L'attaque arrive sur notre coin avant-GAUCHE.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
          OPP_A: [-3, 0, -1.2],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [-3.0, 3.0, -0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s2-set', playerId: 'OPP_S', impact: [1.5, 0, -0.8] },
      ],
    },
    {
      id: 's3',
      title: '3. Bloc à 2 miroir (R4 + central)',
      description: "R4 contreur ligne + central diagonale côté gauche. Pointu (P2) décroche en off-blocker à droite. Libéro défend la ligne dans l'ombre du bloc, passeur la grande diagonale cross-court.",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          C:     [-2.0, 0, 0.3],
          Op:    [3.0, 0, 1.5],
          R4:    [-3.0, 0, 0.3],
          L:     [-1.0, 0, 5.5],
          P:     [3.0, 0, 5.5],
          OPP_A: [-3, 0, -0.7],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [-3.0, 3.0, -0.8],
      },
    },
    {
      id: 's4',
      title: '4. Smash + bloc à 2',
      description: "L'ailier droit adverse frappe en diagonale longue cross-court. R4 + central sautent.",
      tempo: 'rapide',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          C:     [-2.0, 0, 0.5],
          Op:    [3.0, 0, 1.5],
          R4:    [-3.0, 0, 0.5],
          L:     [-1.0, 0, 5.5],
          P:     [3.0, 0, 5.5],
          OPP_A: [-3, 0, -0.6],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [3.0, 0.8, 5.5],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'OPP_A', impact: [-3, 0, -0.5], jumpHeight: 1.8, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocL', playerId: 'R4',    impact: [-3.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocC', playerId: 'C',     impact: [-2.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's5',
      title: '5. Défense du passeur — transition complexe',
      description: "Le passeur est sur la trajectoire de la grande diagonale. Manchette défensive — comme il est défenseur primaire, le pointu doit prendre la 2ᵉ touche.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          C:     [-2.0, 0, 0.5],
          Op:    [3.0, 0, 1.5],
          R4:    [-3.0, 0, 0.5],
          L:     [-1.0, 0, 5.5],
          P:     [3.0, 0, 5.5],
          OPP_A: [-3, 0, -0.6],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [-1.0, 2.5, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s5-dig', playerId: 'P', impact: [3.0, 0, 5.5] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET',
      description: "Retour à la base 5v5. Communication impérative entre passeur et pointu pour la séquence suivante.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
          OPP_A: [-3, 0, -3],
          OPP_S: [1.5, 0, -2],
        },
        ballPosition: [-1.0, 2.5, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Miroir parfait de Z4 en 5v5 : système 2-1-2 (bloc à 2 + off-blocker + 2 défenseurs).',
      'Bloc à 2 : R4 (P4) contreur ligne + central (P3) ferme la diagonale.',
      'Le pointu (P2) devient off-blocker côté droit, décroche sur les 3 m.',
      'Le passeur arrière (P1) défend en grande diagonale longue cross-court.',
      'Si le passeur défend → 2ᵉ touche par le pointu (contre-passeur) obligatoire.',
    ],
    commonMistakes: [
      'Pointu qui contre depuis Z2 → off-blocker absent côté droit.',
      'Passeur qui défend ET veut relayer → confusion sur la 2ᵉ touche.',
      'Libéro mal placé sur Z2 (défend ici la LIGNE, pas la grande diagonale).',
      'Communication absente entre passeur et pointu.',
    ],
  },
};

export default STATE;
