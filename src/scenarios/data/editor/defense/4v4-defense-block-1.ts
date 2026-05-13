import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 4v4 defense vs Z2 — system A (1 blocker + 3 defenders). The single defender pivot is critical.
// Each defender covers ~30-40 m² — anticipation is skill #1.
const STATE: EditorState = {
  metadata: {
    id: '4v4-defense-block-1',
    title: '4v4 · Défense système A (1 contreur + 3 défenseurs)',
    shortDescription: 'Système A en 4v4 (formation diamant) : 1 contreur solo + tip + cross + ligne. La configuration la plus répandue.',
    teamSize: 4,
    phase: 'defense',
    contextLabel: '4v4 · Système A · 1 contreur + 3 défenseurs',
    defaultCamera: 'DEFAULT',
  },
  players: [
    { id: 'C',     label: 'Central (P3)',      role: 'middle',   color: COLORS.middle },
    { id: 'R4',    label: 'Aile G (P4)',       role: 'outside',  color: COLORS.outside },
    { id: 'A2',    label: 'Aile D (P2)',       role: 'outside',  color: COLORS.outside },
    { id: 'A',     label: 'Arrière (P1)',      role: 'opposite', color: COLORS.opposite },
    { id: 'OPP_A', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_S', label: 'Passeur adv.',      role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Base diamant + lecture',
      description: "Avec 4 joueurs chaque défenseur est crucial. Notre central se prépare à bloquer seul. Lecture obligatoire de la passe adverse.",
      tempo: 'pause',
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 1.5],
          A2:    [3, 0, 1.5],
          A:     [0, 0, 6],
          OPP_A: [-3, 0, -3],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [1.5, 1.8, -0.8],
        poses: {
          C: 'READY', R4: 'READY', A2: 'READY', A: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Passe haute vers Z2 adverse',
      description: "Distribution vers leur ailier droit. L'attaque arrive sur notre coin avant-GAUCHE. Le central doit glisser côté gauche.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 1.5],
          A2:    [3, 0, 1.5],
          A:     [0, 0, 6],
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
      title: '3. Bloc solo central + signal ligne/diagonale',
      description: "Le central glisse à gauche et bloque seul. Signal obligatoire (ligne ou diagonale) pour orienter les 3 défenseurs. Sans signal, ils ne savent pas quoi couvrir.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          C:     [-2.0, 0, 0.3],
          R4:    [-3.0, 0, 2.5],
          A2:    [3.0, 0, 4],
          A:     [1.5, 0, 7],
          OPP_A: [-3, 0, -0.7],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [-3.0, 3.0, -0.8],
      },
    },
    {
      id: 's4',
      title: '4. Smash en grande diagonale + bloc',
      description: "L'attaquant frappe en diagonale longue cross-court. Le bloc solo ferme la ligne, signal annoncé en amont.",
      tempo: 'rapide',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          C:     [-2.0, 0, 0.5],
          R4:    [-3.0, 0, 2.5],
          A2:    [3.0, 0, 4],
          A:     [1.5, 0, 7],
          OPP_A: [-3, 0, -0.6],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [1.5, 0.8, 6.5],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'OPP_A', impact: [-3, 0, -0.5], jumpHeight: 1.8, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-bloc',  playerId: 'C',     impact: [-2.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's5',
      title: "5. Récupération par l'arrière unique",
      description: "L'arrière P1 défend dans son axe — sa lecture doit être parfaite, aucun autre arrière pour compenser. Manchette haute vers la cible.",
      tempo: 'rapide',
      durationOverride: 0.7,
      snapshot: {
        positions: {
          C:     [-2.0, 0, 0.5],
          R4:    [-3.0, 0, 2.5],
          A2:    [3.0, 0, 4],
          A:     [1.5, 0, 7],
          OPP_A: [-3, 0, -0.6],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [0, 2.5, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s5-dig', playerId: 'A', impact: [1.5, 0, 7] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — formation diamant',
      description: "Retour à la formation diamant. La couverture s'adaptera à la prochaine zone d'attaque dès la lecture suivante.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 1.5],
          A2:    [3, 0, 1.5],
          A:     [0, 0, 6],
          OPP_A: [-3, 0, -3],
          OPP_S: [1.5, 0, -2],
        },
        ballPosition: [0, 2.5, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Système A (1 contreur + 3 défenseurs) : la configuration la plus répandue en 4v4 indoor.',
      'Signal contreur ligne/diagonale obligatoire — sans cela, les 3 défenseurs ne savent pas quoi couvrir.',
      'Distances clés : contreur 0,3 m du filet ; défenseurs profonds 7-7,5 m ; tip/arrière-bloc 3,5-4 m.',
      'Chaque défenseur couvre ~30-40 m² (vs 20 m² en 6v6) → anticipation = compétence n°1.',
      'Bloc à 2 (système B) réservé aux gros frappeurs : laisse seulement 2 défenseurs profonds.',
    ],
    commonMistakes: [
      'Contreur isolé sans couverture tip : les 3 défenseurs partent tous en profondeur, laissant la zone 3-5 m vide.',
      '2 défenseurs en ligne droite : côte à côte à la même profondeur → le cut shot tombe entre eux.',
      'Absence de signal entre contreur et défenseurs (ligne vs diagonale).',
      'Défenseur tip trop loin du filet : recule avec les arrières et ne peut plus couvrir les feintes courtes.',
      'Passeur qui court à sa cible avant que la balle soit défendue → trou en défense.',
    ],
  },
};

export default STATE;
