import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5v5 attack — pentagon formation (4-1 system). 1 setter at the net + 1 middle
// + 2 wings + 1 deep back. Hybrid format (training, no FFVB rules).
const STATE: EditorState = {
  metadata: {
    id: '5v5-attack-pentagon',
    title: '5v5 · Attaque pentagone',
    shortDescription: 'Format 5v5 : 1 passeur unique + 1 central + 2 ailiers + 1 arrière. Attaque en zone 4.',
    teamSize: 5,
    phase: 'attack',
    contextLabel: '5v5 · Système 4-1 · Format hybride',
    defaultCamera: 'DEFAULT',
  },
  players: [
    { id: 'R4',      label: 'Aile gauche',     role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Central',         role: 'middle',   color: COLORS.middle },
    { id: 'P',       label: 'Passeur (P2)',    role: 'setter',   color: COLORS.setter },
    { id: 'A1',      label: 'Arrière G (P5)',  role: 'libero',   color: COLORS.libero },
    { id: 'A2',      label: 'Arrière D (P1)',  role: 'outside',  color: COLORS.outside },
    { id: 'OPP_SRV', label: 'Serveur adv.',    role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BL',  label: 'Bloc adv. G',     role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BR',  label: 'Bloc adv. D',     role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_D1',  label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Pentagone offensif',
      description: '5 joueurs en pentagone : 3 devant (R4, C, P) + 2 arrière. Couverture régulière du terrain. Pas de libéro, tous les arrières réceptionnent.',
      tempo: 'pause',
      snapshot: {
        positions: {
          R4:      [-3, 0, 0.6],
          C:       [0, 0, 0.6],
          P:       [3, 0, 0.6],
          A1:      [-2.5, 0, 5],
          A2:      [2.5, 0, 5],
          OPP_SRV: [0, 0, -8.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          A1: 'READY', A2: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + réception arrière',
      description: "L'arrière gauche prend la première balle. Sans libéro, c'est l'arrière le plus solide en réception qui prend.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          R4:      [-3, 0, 0.6],
          C:       [0, 0, 0.6],
          P:       [3, 0, 0.6],
          A1:      [-1.0, 0, 4.8],
          A2:      [2.5, 0, 5],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [-1.0, 1.2, 4.8],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'A1', impact: [-1.0, 0, 4.8] },
      ],
    },
    {
      id: 's3',
      title: "3. Passe + course d'élan",
      description: 'Le passeur, déjà au filet, distribue facilement vers la zone 4. Pas de pénétration en 5v5 — il est en P2. Le R4 lance sa course.',
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          R4:      [-3.2, 0, 1.2],
          C:       [0, 0, 0.6],
          P:       [2.8, 0, 0.8],
          A1:      [-1.0, 0, 4.8],
          A2:      [2.5, 0, 5],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-2.5, 0, -0.4],
          OPP_BR:  [-1.0, 0, -0.4],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [2.8, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',  impact: [2.8, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4', to: [-3.2, 0, 1.2] },
      ],
    },
    {
      id: 's4',
      title: "4. Attaque sur l'aile + double bloc",
      description: "L'aile gauche conclut en diagonale longue. Le bloc adverse en pentagone aussi : 2 contreurs sur l'aile.",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          R4:      [-3.2, 0, 1.0],
          C:       [0, 0, 0.6],
          P:       [2.8, 0, 0.8],
          A1:      [-1.0, 0, 4.8],
          A2:      [2.5, 0, 5],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-2.5, 0, -0.4],
          OPP_BR:  [-1.0, 0, -0.4],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [2, 0, -6],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'R4',     impact: [-3.2, 0, 0.6], jumpHeight: 1.6, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocL', playerId: 'OPP_BL', impact: [-2.5, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-blocR', playerId: 'OPP_BR', impact: [-1.0, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération adverse',
      description: 'Le défenseur cross adverse plonge sur la diagonale. La défense au sol est plus rare avec un seul arrière par couloir.',
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          R4:      [-3.2, 0, 0.6],
          C:       [0, 0, 0.6],
          P:       [2.8, 0, 0.8],
          A1:      [-1.0, 0, 4.8],
          A2:      [2.5, 0, 5],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-2.5, 0, -0.4],
          OPP_BR:  [-1.0, 0, -0.4],
          OPP_D1:  [2, 0, -5.8],
        },
        ballPosition: [2, 0, -6],
      },
      actions: [
        { kind: 'DEFENSE_PLONGEE', id: 'b-s5-dig', playerId: 'OPP_D1', impact: [2, 0, -5.8] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — retour formation',
      description: 'Tout le monde reprend le pentagone. Sans libéro, la rotation des arrières est essentielle pour répartir la charge en réception.',
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          R4:      [-3, 0, 0.6],
          C:       [0, 0, 0.6],
          P:       [3, 0, 0.6],
          A1:      [-2.5, 0, 5],
          A2:      [2.5, 0, 5],
          OPP_SRV: [0, 0, -7.5],
          OPP_BL:  [-2.5, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [2.5, 0, -2.5],
        },
        ballPosition: [2, 0, -6],
      },
    },
  ],
  summary: {
    keyPoints: [
      '5v5 = format hybride (entraînement, manque de joueur). Pas de règlement officiel FFVB.',
      'Pentagone : 1 joueur par zone clé, couverture régulière de tout le terrain.',
      'Système 4-1 = équivalent du 5-1 mais avec un attaquant en moins.',
      'Recommandation : conserver le système 5-1 du 6v6 en retirant un arrière non-passeur.',
    ],
    commonMistakes: [
      'Pas de libéro en 5v5 → tous les arrières doivent savoir réceptionner.',
      'Vouloir bloquer à 3 → seulement 2 défenseurs au sol restants.',
      "Oublier la couverture d'attaque → un joueur en moins en couverture.",
    ],
  },
};

export default STATE;
