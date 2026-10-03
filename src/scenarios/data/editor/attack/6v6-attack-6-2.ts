import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 6v6 6-2 system: 2 versatile setters diagonally opposed (zones 1 and 4). The
// back-row one penetrates to distribute, the front-row one becomes the 3rd
// attacker on the right side. R4s in zones 2 and 5, middles in zones 3 and 6.
// After the serve the front R4 (zone 2) and the setter-attacker (zone 4) swap
// sides, so the setter-attacker hits from zone 2. Always 3 options up.
//
// Labels carry "(zone n)" rather than "(Pn)" on purpose: resolvePlayerColor
// keys on "(Pn)" and would paint each player in its zone colour. Here the
// jersey follows the role (setting setter red, setter-attacker purple like an
// opposite, front/back R4 blue/yellow, front/back middle green/orange).
const STATE: EditorState = {
  metadata: {
    id: '6v6-attack-6-2',
    title: 'Attaque · Système 6-2',
    shortDescription: 'Système 6-2 : passeur arrière pénètre, 3 attaquants devant en permanence.',
    teamSize: 6,
    phase: 'attack',
    contextLabel: '6-2 · Passeur pénétrant · Intermédiaire',
    defaultCamera: 'DEFAULT',
    system: '6-2',
  },
  players: [
    { id: 'P',       label: 'Passeur (zone 1)',          role: 'setter',   color: COLORS.setter },
    { id: 'R4a',     label: 'R4 (zone 2)',               role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Central (zone 3)',          role: 'middle',   color: COLORS.middle },
    { id: 'PA',      label: 'Passeur-attaquant (zone 4)', role: 'opposite', color: COLORS.opposite },
    { id: 'R4b',     label: 'R4 (zone 5)',               role: 'outside',  color: COLORS.outside_back },
    { id: 'C2',      label: 'Central (zone 6)',          role: 'middle',   color: COLORS.middle_back },
    { id: 'OPP_SRV', label: 'Serveur adv.',              role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BL',  label: 'Bloc adv. G',               role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_BR',  label: 'Bloc adv. D',               role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_D1',  label: 'Déf. cross adv.',           role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Configuration 6-2',
      description: "2 passeurs polyvalents en diagonale : celui de la zone 4 (avant) attaque, celui de la zone 1 (arrière) distribue et pénètre. Réception par le R4 de la zone 5, le central de la zone 6 et le R4 de la zone 2 reculé à droite ; le passeur arrière se cache derrière lui.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [3.6, 0, 6.0],
          R4a:     [2.3, 0, 4.2],
          C:       [-0.5, 0, 0.6],
          PA:      [-3.5, 0, 0.6],
          R4b:     [-2.6, 0, 4.8],
          C2:      [0, 0, 5.2],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [0, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [-3.0, 0, -3.5],
        },
        ballPosition: [0, 2, -9.2],
        poses: {
          OPP_SRV: 'ARM_SPIKE',
          C2: 'READY', R4a: 'READY', R4b: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + réception du central arrière',
      description: "Réception au centre par le central de la zone 6. Le passeur déclenche sa pénétration depuis la zone 1 ; le passeur-attaquant passe derrière le central vers la droite et le R4 de la zone 2 glisse vers la gauche.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [1.8, 0, 1.2],
          R4a:     [1.2, 0, 3.9],
          C:       [-0.5, 0, 0.6],
          PA:      [0.3, 0, 1.9],
          R4b:     [-2.6, 0, 4.8],
          C2:      [0, 0, 4.8],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [0, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [-3.0, 0, -3.5],
        },
        ballPosition: [0, 1.2, 4.8],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'FLOAT_SERVE', id: 'b-s2-serve', playerId: 'OPP_SRV', impact: [0, 0, -9.5] },
        { kind: 'MANCHETTE',   id: 'b-s2-recv', playerId: 'C2', impact: [0, 0, 4.8] },
        { kind: 'PENETRATION', id: 'b-s2-pen',  playerId: 'P',  to: [1.8, 0, 1.2] },
      ],
    },
    {
      id: 's3',
      title: "3. Permutations + course d'élan en zone 2",
      description: "La réception remonte vers le passeur. Le passeur-attaquant lance sa course d'élan en zone 2, le R4 prend la zone 4 et le central fixe au centre : 3 menaces offensives devant. Le bloc adverse glisse à droite.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [1.5, 0, 0.8],
          R4a:     [-4.0, 0, 2.4],
          C:       [0, 0, 0.6],
          PA:      [3.4, 0, 2.0],
          R4b:     [-2.6, 0, 4.8],
          C2:      [0, 0, 4.8],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [1.5, 0, -0.4],
          OPP_BR:  [3.5, 0, -0.4],
          OPP_D1:  [-3.0, 0, -3.5],
        },
        ballPosition: [1.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',  impact: [1.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'PA', to: [3.4, 0, 2.0] },
      ],
    },
    {
      id: 's4',
      title: '4. Attaque diagonale + double bloc',
      description: "Passe courte vers la zone 2 : le passeur-attaquant frappe en diagonale longue. Le 6-2 garantit toujours 3 menaces offensives — le bloc adverse ne peut pas anticiper. Le passeur et le central arrière couvrent l'attaquant.",
      tempo: 'standard',
      durationOverride: 1.3,
      snapshot: {
        positions: {
          P:       [2.4, 0, 2.6],
          R4a:     [-4.0, 0, 2.4],
          C:       [0, 0, 0.6],
          PA:      [3.2, 0, 1.0],
          R4b:     [-2.6, 0, 4.8],
          C2:      [1.2, 0, 3.4],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [1.5, 0, -0.4],
          OPP_BR:  [3.5, 0, -0.4],
          OPP_D1:  [-3.0, 0, -3.5],
        },
        ballPosition: [-2.5, 0.22, -6],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'PA',     impact: [3.2, 0, 0.6],  jumpHeight: 1.6, contactAtRatio: 0.65 },
        { kind: 'BLOC',  id: 'b-s4-blocL', playerId: 'OPP_BL', impact: [1.5, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.65 },
        { kind: 'BLOC',  id: 'b-s4-blocR', playerId: 'OPP_BR', impact: [3.5, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.65 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération adverse',
      description: "Le défenseur cross plonge sur la trajectoire longue côté gauche adverse — tentative de sauvetage en désespoir. Notre passeur-attaquant retombe et se recentre.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [2.4, 0, 2.6],
          R4a:     [-4.0, 0, 2.4],
          C:       [0, 0, 0.6],
          PA:      [1.6, 0, 1.8],
          R4b:     [-2.6, 0, 4.8],
          C2:      [1.2, 0, 3.4],
          OPP_SRV: [0, 0, -8.7],
          OPP_BL:  [1.5, 0, -0.4],
          OPP_BR:  [3.5, 0, -0.4],
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
      description: "Toute l'équipe reprend sa position : le passeur-attaquant revient en zone 4, le R4 en zone 2 et le passeur retourne en zone 1.",
      tempo: 'calme',
      durationOverride: 1.4,
      snapshot: {
        positions: {
          P:       [3.6, 0, 6.0],
          R4a:     [2.3, 0, 4.2],
          C:       [-0.5, 0, 0.6],
          PA:      [-3.5, 0, 0.6],
          R4b:     [-2.6, 0, 4.8],
          C2:      [0, 0, 5.2],
          OPP_SRV: [0, 0, -9.5],
          OPP_BL:  [0, 0, -0.5],
          OPP_BR:  [2.5, 0, -0.5],
          OPP_D1:  [-3.0, 0, -3.5],
        },
        ballPosition: [-2.5, 0.22, -6],
      },
    },
  ],
  summary: {
    keyPoints: [
      '6-2 : 2 passeurs polyvalents en opposition diagonale (ici zones 1 et 4).',
      'Toujours 3 attaquants devant (le passeur avant attaque, le passeur arrière distribue).',
      'Pénétration systématique, comme en 5-1, mais avec 2 distributeurs alternés.',
      'Excellent pour développer la polyvalence avant de basculer en 5-1.',
    ],
    commonMistakes: [
      'Différence de style entre les 2 passeurs → distribution incohérente.',
      'Passeur avant qui ne se présente pas en attaque → 2 options seulement.',
      'Pénétration trop tardive → recours à un autre joueur pour la passe.',
    ],
  },
};

export default STATE;
