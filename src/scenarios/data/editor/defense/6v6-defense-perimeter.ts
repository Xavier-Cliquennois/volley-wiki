import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// Perimeter defense (2-0-4 / white defense): 4 defenders form a U along the lines and back baseline,
// the middle of the court is deliberately left open. Dominant in elite men's volleyball.
const STATE: EditorState = {
  metadata: {
    id: '6v6-defense-perimeter',
    title: 'Défense · périmétrique (2-0-4)',
    shortDescription: 'White defense : 4 défenseurs sur les lignes, U ouvert vers le filet. Dominant en haut niveau masculin.',
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Périmétrique 2-0-4 (white defense)',
    defaultCamera: 'TOP_DOWN',
  },
  players: [
    { id: 'P',     label: 'Passeur (P1)',      role: 'setter',   color: COLORS.setter },
    { id: 'Op',    label: 'Pointu (P2)',       role: 'opposite', color: COLORS.opposite },
    { id: 'C',     label: 'Central (P3)',      role: 'middle',   color: COLORS.middle },
    { id: 'R4',    label: 'R4 (P4)',           role: 'outside',  color: COLORS.outside },
    { id: 'L',     label: 'Libéro (P5)',       role: 'libero',   color: COLORS.libero },
    { id: 'R4b',   label: 'R4 (P6)',           role: 'outside',  color: COLORS.middle_back },
    { id: 'OPP_A', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_S', label: 'Passeur adv.',      role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Configuration périmétrique (2-0-4)',
      description: "Les 4 défenseurs forment un U ouvert vers le filet, presque sur les lignes — « un pied sur la ligne » (Liskevych). Le milieu du terrain est volontairement abandonné.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:     [4, 0, 8],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-4, 0, 8],
          R4b:   [0, 0, 8.5],
          OPP_A: [3, 0, -3],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-1.5, 1.8, -0.8],
        poses: {
          L: 'READY', R4b: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Passe haute Z4 adverse',
      description: "Passe vers leur ailier gauche. Notre ligne avant identifie la zone, les périphériques restent strictement sur les lignes.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:     [4, 0, 8],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-4, 0, 8],
          R4b:   [0, 0, 8.5],
          OPP_A: [3, 0, -1.2],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [3.0, 3.0, -0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s2-set', playerId: 'OPP_S', impact: [-1.5, 0, -0.8] },
      ],
    },
    {
      id: 's3',
      title: '3. Bloc à 2 + 4 défenseurs sur le périmètre',
      description: "Bloc à 2 standard (pointu ligne + central diagonale). Aucun défenseur monté derrière le bloc (d'où le 0 central). Libéro sur la ligne gauche, P6 sur la baseline, P1 sur la ligne droite.",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          P:     [4.3, 0, 8.5],
          Op:    [3.0, 0, 0.3],
          C:     [2.0, 0, 0.3],
          R4:    [-3.0, 0, 1.5],
          L:     [-4.3, 0, 8.5],
          R4b:   [0, 0, 8.8],
          OPP_A: [3, 0, -0.7],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [3.0, 3.0, -0.8],
      },
    },
    {
      id: 's4',
      title: '4. Smash en ligne puissant + bloc',
      description: "L'attaquant frappe en ligne sur notre coin arrière-gauche. La trajectoire passe à proximité du bloc — un block-out long est probable.",
      tempo: 'rapide',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          P:     [4.3, 0, 8.5],
          Op:    [3.0, 0, 0.5],
          C:     [2.0, 0, 0.5],
          R4:    [-3.0, 0, 1.5],
          L:     [-4.3, 0, 8.5],
          R4b:   [0, 0, 8.8],
          OPP_A: [3, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-4, 0.8, 7],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'OPP_A', impact: [3, 0, -0.5], jumpHeight: 1.8, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocR', playerId: 'Op',    impact: [3.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocC', playerId: 'C',     impact: [2.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération en couloir',
      description: "Le libéro récupère sur la ligne — couverture périphérique parfaite. Identifie facilement les balles « out ». Manchette haute vers la zone 2-3.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          P:     [4.3, 0, 8.5],
          Op:    [3.0, 0, 0.5],
          C:     [2.0, 0, 0.5],
          R4:    [-3.0, 0, 1.5],
          L:     [-4.3, 0, 8.5],
          R4b:   [0, 0, 8.8],
          OPP_A: [3, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s5-dig', playerId: 'L', impact: [-4, 0, 7] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — périmètre',
      description: "Retour à la formation périmétrique pure : tous les arrières sur les lignes, milieu central abandonné par convention tactique.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          P:     [4, 0, 8],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-4, 0, 8],
          R4b:   [0, 0, 8.5],
          OPP_A: [3, 0, -3],
          OPP_S: [-1.5, 0, -2],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      "Périmétrique = 2-0-4 (« white defense ») : 4 défenseurs sur le périmètre, aucun monté.",
      "Système prédominant en volley masculin moderne et international où la puissance domine.",
      "Logique : peupler statistiquement les zones où atterrissent les smashs puissants (lignes et coins profonds).",
      "Excellente identification des balles « out » et défense des block-outs.",
      "⚠ Le milieu du terrain (zone centrale entre 3 et 5 m) est délibérément laissé libre.",
    ],
    commonMistakes: [
      'Défenseurs qui se replient au centre → perdent la logique du système et ne couvrent plus les lignes.',
      "Système choisi contre une équipe qui feinte → centre du terrain à découvert, tips perdus.",
      "Libéro non habitué → mauvaise lecture des balles « out » sur les côtés.",
      "Manque d'athlétisme pour plonger vers l'avant sur tips → faiblesse exploitée.",
    ],
  },
};

export default STATE;
