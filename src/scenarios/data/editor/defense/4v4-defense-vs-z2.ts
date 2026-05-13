import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 4v4 defense vs opponent Z2 — mirror of system A applied to the right-wing attack.
// Central slides left to block solo, R4 off-blocker, A2 covers short cross, lone back covers deep.
const STATE: EditorState = {
  metadata: {
    id: '4v4-defense-vs-z2',
    title: '4v4 · Défense Z2',
    shortDescription: 'Miroir système A : 1 contreur + 3 défenseurs sur attaque adverse Z2 (sa droite → arrive notre gauche).',
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
      title: '1. Lecture attaque Z2 adverse',
      description: "Attaque adverse en sa zone 2 (sa droite) → arrive sur notre coin avant-GAUCHE. Le central va devoir glisser côté gauche pour bloquer.",
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
      description: "Distribution vers leur ailier droit. La défense enclenche son ajustement miroir.",
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
      title: '3. Bloc solo central côté gauche',
      description: "Le central glisse côté gauche et bloque seul. Signal ligne/diagonale obligatoire. R4 (aile gauche) reste off-blocker à 2,5 m, A2 (aile droite) défend la grande diagonale.",
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
      title: '4. Smash diagonal + bloc solo',
      description: "L'attaquant frappe en grande diagonale longue cross-court. Le bloc solo couvre la ligne signalée.",
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
      title: "5. Récupération de l'arrière unique",
      description: "L'arrière P1 (légèrement décalé côté ballon) défend en manchette. Sa lecture compense l'absence d'autres arrières.",
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
        { kind: 'MANCHETTE', id: 'b-s5-dig', playerId: 'A', impact: [1.5, 0, 6.5] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — formation diamant',
      description: "Retour à la formation diamant. Le central revient au centre, prêt à glisser à nouveau si l'adversaire change de côté.",
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
      'Miroir parfait de Z4 en 4v4 : système A (1 contreur + 3 défenseurs).',
      'P3 contreur solo côté gauche, signal ligne/diagonale obligatoire.',
      'P4 (aile gauche) en off-blocker à 3,5-4 m du filet — couverture courte et feintes.',
      'P2 (aile droite) défend la petite diagonale courte (~7 m, ligne droite).',
      "L'arrière unique P1 défend la grande diagonale longue cross-court.",
    ],
    commonMistakes: [
      'Aile gauche P4 qui contre avec le central → off-blocker absent côté gauche.',
      'Arrière unique trop avancé → balle profonde cross-court non couverte.',
      'Contreur sans signal → les 3 défenseurs ne savent pas quoi couvrir.',
      'P2 trop loin du filet → ne couvre pas la diagonale courte.',
    ],
  },
};

export default STATE;
