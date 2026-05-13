import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5v5 defense vs Z4. System 2-1-2 : block-of-2 (P2 + central) + off-blocker + 2 deep defenders.
// Each defender covers ~30 m² (vs 20 m² in 6v6) — anticipation is critical.
const STATE: EditorState = {
  metadata: {
    id: '5v5-defense-vs-z4',
    title: '5v5 · Défense Z4',
    shortDescription: 'Système 2-1-2 sur attaque adverse Z4 (sa gauche → arrive notre droite) : bloc à 2 + off-blocker + 2 défenseurs.',
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
      title: '1. Lecture attaque Z4 adverse',
      description: "Attaque adverse en sa zone 4 (sa gauche) → arrive sur notre coin avant-DROIT. Lecture séquentielle « ballon → passeur → ballon → attaquant ».",
      tempo: 'pause',
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
          OPP_A: [3, 0, -3],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-1.5, 1.8, -0.8],
        poses: {
          L: 'READY', P: 'READY', C: 'READY', R4: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Passe haute vers Z4 adverse',
      description: "Distribution standard de leur passeur vers l'ailier gauche. Notre ligne avant identifie la zone d'attaque.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
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
      title: '3. Bloc à 2 + off-blocker R4',
      description: "Pointu (P2) + central (P3) montent au bloc côté droit. R4 décroche à 1,5 m du filet en off-blocker. Libéro en grande diagonale, passeur sur la ligne droite — chacun couvre ~30 m².",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          C:     [2.0, 0, 0.3],
          Op:    [3.0, 0, 0.3],
          R4:    [-3.0, 0, 1.5],
          L:     [-1.0, 0, 6],
          P:     [3.0, 0, 6],
          OPP_A: [3, 0, -0.7],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [3.0, 3.0, -0.8],
      },
    },
    {
      id: 's4',
      title: '4. Smash en grande diagonale + bloc',
      description: "L'attaquant frappe en diagonale longue cross-court (trajectoire statistiquement la plus fréquente). Pointu + central sautent.",
      tempo: 'rapide',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          C:     [2.0, 0, 0.5],
          Op:    [3.0, 0, 0.5],
          R4:    [-3.0, 0, 1.5],
          L:     [-1.0, 0, 6],
          P:     [3.0, 0, 6],
          OPP_A: [3, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-1.0, 0.8, 6],
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
      title: '5. Défense du libéro',
      description: "Le libéro est sur la trajectoire principale. Manchette haute vers la cible — transition vers la contre-attaque.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          C:     [2.0, 0, 0.5],
          Op:    [3.0, 0, 0.5],
          R4:    [-3.0, 0, 1.5],
          L:     [-1.0, 0, 6],
          P:     [3.0, 0, 6],
          OPP_A: [3, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s5-dig', playerId: 'L', impact: [-1.0, 0, 6] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — retour à la base 2-1-2',
      description: "Bascule en formation de base. Le passeur revient à sa zone 1, la défense se réorganise pour la séquence suivante.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          Op:    [3, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-2.5, 0, 5],
          P:     [3, 0, 5],
          OPP_A: [3, 0, -3],
          OPP_S: [-1.5, 0, -2],
        },
        ballPosition: [1.5, 2.5, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Système 2-1-2 : 2 contreurs + 1 off-blocker (couvreur tip) + 2 défenseurs profonds.',
      'Recommandation : conserver le 5-1 du 6v6 en retirant un arrière non-passeur (configuration 3F-2B).',
      'Off-blocker à 2-2,5 m du filet, 1 m de la ligne — couvre la zone 3 m derrière le bloc.',
      'Lecture du jeu critique : ~30 m² par défenseur (vs 20 m² en 6v6), sécurité de placement initial réduite.',
      "« Stopped on contact » : arrêté et équilibré à l'instant exact de la frappe.",
    ],
    commonMistakes: [
      'Bloc à 3 → seulement 1 défenseur au sol = point assuré.',
      'Off-blocker qui reste au filet → zone 3 m derrière le bloc à découvert.',
      'Pas de hiérarchie de priorité entre les 2 défenseurs profonds → 2 joueurs sur la même balle.',
      'Reproduire mécaniquement le 6v6 sans adapter les zones (le libéro ici doit couvrir plus large).',
    ],
  },
};

export default STATE;
