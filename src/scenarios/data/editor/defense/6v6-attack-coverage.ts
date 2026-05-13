import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// Attack coverage: 5 players form two arcs (3 close + 2 deep) behind our Z4 attacker,
// ready to dig a block-rebound back into our own court.
const STATE: EditorState = {
  metadata: {
    id: '6v6-attack-coverage',
    title: 'Couverture · attaque 5-1',
    shortDescription: "Couverture à 5 sur attaque en zone 4 : 2 arcs (3 proches + 2 éloignés) pour relever un éventuel block-out.",
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Couverture à 5 · Dispositif 3-2',
    defaultCamera: 'TOP_DOWN',
  },
  players: [
    { id: 'R4a',    label: 'R4 attaquant (P4)', role: 'outside',  color: COLORS.outside },
    { id: 'C',      label: 'Central (P3)',      role: 'middle',   color: COLORS.middle },
    { id: 'P',      label: 'Passeur (pénétré)', role: 'setter',   color: COLORS.setter },
    { id: 'Op',     label: 'Pointu (P2)',       role: 'opposite', color: COLORS.opposite },
    { id: 'L',      label: 'Libéro (P5)',       role: 'libero',   color: COLORS.libero },
    { id: 'R4b',    label: 'R4 (P6)',           role: 'outside',  color: COLORS.middle_back },
    { id: 'OPP_BL', label: 'Bloc adverse G',    role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BR', label: 'Bloc adverse D',    role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: "1. Préparation de l'attaque Z4",
      description: "Notre R4 est en course d'élan, sur le point de décoller. Avant même la frappe, la couverture s'organise : c'est l'anticipation qui sauve un block-out, pas la réaction.",
      tempo: 'pause',
      snapshot: {
        positions: {
          R4a:    [-3, 0, 1],
          C:      [-1.5, 0, 1.2],
          P:      [-2.0, 0, 1.5],
          Op:     [3, 0, 0.6],
          L:      [-3, 0, 4],
          R4b:    [-1, 0, 5],
          OPP_BL: [-2.5, 0, -0.4],
          OPP_BR: [-1.0, 0, -0.4],
        },
        ballPosition: [-2, 2.5, 0.8],
        poses: {
          R4a: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Premier arc (3 joueurs proches)',
      description: "Passeur + central + libéro forment un demi-cercle à 1-1,5 m de l'attaquant, position TRÈS basse, bras tendus en avant, prêts à manchette courte.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          R4a:    [-3, 0, 0.8],
          C:      [-1.5, 0, 1.5],
          P:      [-2.0, 0, 1.5],
          Op:     [2.5, 0, 4.5],
          L:      [-3.5, 0, 2.5],
          R4b:    [-1, 0, 6],
          OPP_BL: [-2.5, 0, -0.4],
          OPP_BR: [-1.0, 0, -0.4],
        },
        ballPosition: [-2, 2.5, 0.8],
        poses: {
          P: 'READY', C: 'READY', L: 'READY',
        },
      },
    },
    {
      id: 's3',
      title: '3. Smash + double bloc adverse',
      description: "Notre R4 décolle et frappe en diagonale. Les deux bloqueurs adverses sautent en parallèle pour fermer la trajectoire — la couverture est déjà figée en attente.",
      tempo: 'rapide',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          R4a:    [-3, 0, 0.6],
          C:      [-1.5, 0, 1.5],
          P:      [-2.0, 0, 1.5],
          Op:     [2.5, 0, 4.5],
          L:      [-3.5, 0, 2.5],
          R4b:    [-1, 0, 6],
          OPP_BL: [-2.5, 0, -0.4],
          OPP_BR: [-1.0, 0, -0.4],
        },
        ballPosition: [-2.5, 2.5, -0.2],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s3-smash', playerId: 'R4a',    impact: [-3, 0, 0.6],   jumpHeight: 1.7, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s3-blocL', playerId: 'OPP_BL', impact: [-2.5, 0, -0.4], jumpHeight: 1.6, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s3-blocR', playerId: 'OPP_BR', impact: [-1.0, 0, -0.4], jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's4',
      title: '4. Block-out : la balle revient',
      description: "Le bloc adverse touche la balle qui ricoche dans notre camp à 1,5 m de l'attaquant. Sans couverture, c'est un point perdu — ici, le passeur est exactement à l'arrivée.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          R4a:    [-3, 0, 0.6],
          C:      [-1.5, 0, 1.5],
          P:      [-2.0, 0, 1.5],
          Op:     [2.5, 0, 4.5],
          L:      [-3.5, 0, 2.5],
          R4b:    [-1, 0, 6],
          OPP_BL: [-2.5, 0, -0.4],
          OPP_BR: [-1.0, 0, -0.4],
        },
        ballPosition: [-1.5, 1.0, 1.5],
      },
      ballTrajectory: { curve: 'arc', apex: 2.5 },
    },
    {
      id: 's5',
      title: "5. Récupération du passeur (1ᵉʳ soutien)",
      description: "Le passeur (1ᵉʳ soutien proche) relève la balle en manchette à 1 m de l'attaquant. C'est SA responsabilité après une passe en zone 4 — règle non négociable.",
      tempo: 'rapide',
      durationOverride: 0.6,
      snapshot: {
        positions: {
          R4a:    [-3, 0, 0.6],
          C:      [-1.5, 0, 1.5],
          P:      [-2.0, 0, 1.5],
          Op:     [2.5, 0, 4.5],
          L:      [-3.5, 0, 2.5],
          R4b:    [-1, 0, 6],
          OPP_BL: [-2.5, 0, -0.4],
          OPP_BR: [-1.0, 0, -0.4],
        },
        ballPosition: [0, 3.0, 2],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s5-dig', playerId: 'P', impact: [-1.5, 0, 1.5] },
      ],
    },
    {
      id: 's6',
      title: '6. Nouvelle attaque possible',
      description: "Le sauvetage permet de remonter une nouvelle balle au filet. Sans cette couverture à 5 = point perdu directement sur le block-out.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          R4a:    [-3, 0, 0.8],
          C:      [-1.5, 0, 1.5],
          P:      [-2.0, 0, 1.5],
          Op:     [3, 0, 0.6],
          L:      [-3, 0, 4],
          R4b:    [-1, 0, 5],
          OPP_BL: [-2.5, 0, -0.4],
          OPP_BR: [-1.0, 0, -0.4],
        },
        ballPosition: [0, 3.0, 2],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Couverture à 5 = standard haut niveau. Dispositif 3-2 (3 proches + 2 éloignés).',
      "Le passeur est TOUJOURS le 1ᵉʳ soutien proche, à 1-1,5 m de l'attaquant.",
      'Position TRÈS basse pour les 3 proches, bras tendus en avant.',
      'Sans couverture, un block adverse réussi = point perdu directement.',
      "L'anticipation prime sur la réaction : la couverture s'organise AVANT la frappe.",
    ],
    commonMistakes: [
      'Couverture absente → block adverse = point.',
      'Passeur qui reste au filet après sa passe → 1ᵉʳ soutien manquant.',
      'Couvreurs debout ou trop éloignés → balles courtes non relevées.',
      'Seulement 2 ou 3 couvreurs au lieu de 5 → block-outs longs perdus.',
    ],
  },
};

export default STATE;
