import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// Defense vs pipe (back-row Z6 attack). Block-of-1 (central), P6 advances to "cinch the court".
// Z1 and Z5 close in toward the central axis. One of the toughest attacks to defend in 6v6.
const STATE: EditorState = {
  metadata: {
    id: '6v6-defense-vs-pipe',
    title: 'Défense · attaque pipe adverse (BIC)',
    shortDescription: 'Défense face à une pipe adverse (attaque arrière Z6) : bloc à 1 ou 2, P6 avance pour « cinch the court ».',
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Pipe / BIC · P6 avance, périmétrique resserré',
    defaultCamera: 'TOP_DOWN',
  },
  players: [
    { id: 'P',     label: 'Passeur (P1)',  role: 'setter',   color: COLORS.setter },
    { id: 'Op',    label: 'Pointu (P2)',   role: 'opposite', color: COLORS.opposite },
    { id: 'C',     label: 'Central (P3)',  role: 'middle',   color: COLORS.middle },
    { id: 'R4',    label: 'R4 (P4)',       role: 'outside',  color: COLORS.outside },
    { id: 'L',     label: 'Libéro (P5)',   role: 'libero',   color: COLORS.libero },
    { id: 'R4b',   label: 'R4 (P6)',       role: 'outside',  color: COLORS.middle_back },
    { id: 'OPP_A', label: 'Pipe adverse',  role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_S', label: 'Passeur adv.',  role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Lecture de la pipe',
      description: "Leur passeur s'apprête à lancer une passe tendue vers le centre arrière. Notre central scrute simultanément l'éventuel central adverse ET le couloir de pipe. P6 doit se préparer à avancer.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:     [3, 0, 3.5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-3, 0, 7],
          R4b:   [0, 0, 7],
          OPP_A: [0, 0, -4],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [1.5, 1.9, -0.8],
        poses: {
          C: 'READY', L: 'READY', R4b: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Passe tendue centrale + course pipe',
      description: "Le passeur adverse envoie une passe tendue vers l'axe Z6. Le pipe-attaquant entre en course depuis derrière les 3 m, élan long. P6 commence son glissement avant.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:     [3, 0, 3.5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-3, 0, 7],
          R4b:   [0, 0, 6.5],
          OPP_A: [0, 0, -4.5],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [0, 3.0, -3.5],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_TENDUE', id: 'b-s2-set',  playerId: 'OPP_S', impact: [1.5, 0, -0.8] },
        { kind: 'COURSE_ELAN',  id: 'b-s2-elan', playerId: 'OPP_A', to: [0, 0, -4.5] },
      ],
    },
    {
      id: 's3',
      title: '3. Bloc central + ailes resserrées',
      description: "Notre central saute seul sur la pipe. Ailes (R4 + pointu) descendent à ~1,5 m du filet pour couvrir les déviations latérales. Z1 et Z5 sacrifient les lignes pour défendre l'axe.",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          P:     [1.5, 0, 7],
          Op:    [3, 0, 1.5],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 1.5],
          L:     [-1.5, 0, 7],
          R4b:   [0, 0, 6.5],
          OPP_A: [0, 0, -3.7],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [0, 3.0, -3.5],
      },
    },
    {
      id: 's4',
      title: '4. Smash de la pipe + bloc central',
      description: "L'attaquant frappe en plein axe profond. Notre central monte au filet en bloc à 1 — la pipe rapide ne laisse pas le temps de monter deux bloqueurs.",
      tempo: 'rapide',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:     [1.5, 0, 7],
          Op:    [3, 0, 1.5],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 1.5],
          L:     [-1.5, 0, 7],
          R4b:   [0, 0, 6.5],
          OPP_A: [0, 0, -4],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [0, 0.8, 6.5],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'OPP_A', impact: [0, 0, -3.0], jumpHeight: 1.8, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-bloc',  playerId: 'C',     impact: [0, 0, 0.3],  jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération axiale par P6',
      description: "La balle traverse vers l'axe profond — P6 (avancé à 6,5 m) est exactement sur l'impact. Manchette dans son axe vers la zone 2-3 du passeur.",
      tempo: 'rapide',
      durationOverride: 0.6,
      snapshot: {
        positions: {
          P:     [1.5, 0, 1.0],
          Op:    [3, 0, 1.5],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 1.5],
          L:     [-1.5, 0, 7],
          R4b:   [0, 0, 6.5],
          OPP_A: [0, 0, -4],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [1.5, 2.0, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'MANCHETTE',   id: 'b-s5-dig',    playerId: 'R4b', impact: [0, 0, 6.5] },
        { kind: 'PENETRATION', id: 'b-s5-sprint', playerId: 'P',   to: [1.5, 0, 1.0] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — retour à la base resserrée',
      description: "Bascule en position de base pipe-ready : P6 avancé, Z1/Z5 axe central. La configuration restera valable si la rotation de jeu se poursuit.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          P:     [3, 0, 3.5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-3, 0, 7],
          R4b:   [0, 0, 7],
          OPP_A: [0, 0, -4],
          OPP_S: [1.5, 0, -0.8],
        },
        ballPosition: [1.5, 2.0, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      "Pipe = attaque arrière en Z6 (centre arrière) par OH2 ou OPP — vise l'axe central profond.",
      'Bloc à 1 (central) le plus fréquent — bloc à 2 difficile sur tempo rapide.',
      'P6 défensif AVANCE à ~6-7 m du filet, axe exact (« cinch the court »).',
      'Z1 et Z5 se rapprochent du centre (~7 m, 1,5 m des lignes) — sacrifient un peu les lignes.',
      "BIC (pipe rapide) = une des attaques les plus difficiles à défendre car le central ne peut honorer quick + pipe + deux ailes.",
    ],
    commonMistakes: [
      "Bloc à 2 sur pipe → laisse une aile complètement ouverte si l'adversaire change d'attaque.",
      "P6 figé au fond (8 m+) → pipe rapide tombe avant qu'il ne bouge.",
      "Z1/Z5 trop écartés sur les lignes → axe central à découvert.",
      'Pas de communication entre central et ailes sur qui prend la pipe vs la quick.',
    ],
  },
};

export default STATE;
