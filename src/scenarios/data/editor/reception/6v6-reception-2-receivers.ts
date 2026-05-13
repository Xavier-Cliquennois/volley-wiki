import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// Elite 6v6 reception with only 2 receivers (libero + 1 outside). Used on
// free balls or against predictable serves — maximum offensive variety since
// all other players are available as attackers immediately.
const STATE: EditorState = {
  metadata: {
    id: '6v6-reception-2-receivers',
    title: 'Réception · à 2 (élite)',
    shortDescription: 'Réception ultra-spécialisée à 2 (libéro + R4) : tous les autres prêts à attaquer.',
    teamSize: 6,
    phase: 'reception',
    contextLabel: '5-1 · Réception à 2 · Élite / free balls',
    defaultCamera: 'BEHIND_SERVE',
  },
  players: [
    { id: 'L',       label: 'Libéro',           role: 'libero',   color: COLORS.libero },
    { id: 'R4a',     label: 'R4 réceptionneur', role: 'outside',  color: COLORS.outside_back },
    { id: 'R4b',     label: 'R4 attaquant',     role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Central',          role: 'middle',   color: COLORS.middle },
    { id: 'Op',      label: 'Pointu (caché)',   role: 'opposite', color: COLORS.opposite },
    { id: 'P',       label: 'Passeur (caché)',  role: 'setter',   color: COLORS.setter },
    { id: 'OPP_SRV', label: 'Serveur adv.',     role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Configuration à 2',
      description: "Seulement 2 réceptionneurs : libéro côté gauche, R4 réceptionneur côté droit. Les 4 autres joueurs sont déjà placés en posture d'attaque, prêts à se déclencher dès la frappe.",
      tempo: 'pause',
      snapshot: {
        positions: {
          L:       [-1.5, 0, 5],
          R4a:     [2, 0, 5],
          R4b:     [-3, 0, 0.6],
          C:       [0, 0, 0.6],
          Op:      [3, 0, 0.6],
          P:       [3.5, 0, 2],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          L: 'READY', R4a: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + manchette libéro',
      description: "Service vers la gauche. Le libéro annonce et fait manchette. Avec seulement 2 zones, l'exigence technique est extrême : un libéro exceptionnel est obligatoire. Le passeur déclenche sa pénétration.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          L:       [-1, 0, 5],
          R4a:     [2, 0, 5],
          R4b:     [-3, 0, 0.6],
          C:       [0, 0, 0.6],
          Op:      [3, 0, 0.6],
          P:       [3, 0, 2],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-1, 1.2, 5],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE',   id: 'b-s2-recv', playerId: 'L', impact: [-1, 0, 5] },
        { kind: 'PENETRATION', id: 'b-s2-pen',  playerId: 'P', to: [3, 0, 2] },
      ],
    },
    {
      id: 's3',
      title: '3. Passe + courses simultanées',
      description: "La balle remonte vers la cible. Le passeur distribue en zone 4. Le R4 attaquant, libre de toute réception, lance une course d'élan rapide à grande vitesse — il arrive à pleine puissance.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          L:       [-1, 0, 5],
          R4a:     [2, 0, 5],
          R4b:     [-3.5, 0, 1.5],
          C:       [0, 0, 0.6],
          Op:      [3, 0, 0.6],
          P:       [2.5, 0, 0.8],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [2.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [2.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4b', to: [-3.5, 0, 1.5] },
      ],
    },
    {
      id: 's4',
      title: '4. Ballon disponible — variété maximale',
      description: "La balle arrive en zone 4 pour le R4 attaquant. À ce moment le passeur dispose en parallèle d'un central en rapide et d'un pointu en attaque arrière — combinaisons à 3 attaquants possibles.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          L:       [-1, 0, 5],
          R4a:     [2, 0, 5],
          R4b:     [-3.5, 0, 0.8],
          C:       [0, 0, 0.6],
          Op:      [3, 0, 0.6],
          P:       [2.5, 0, 0.8],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-3.3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: '5. RESET — retour formation à 2',
      description: "Le libéro et le R4 réceptionneur retrouvent leurs zones, les attaquants se replacent prêts à attaquer.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          L:       [-1.5, 0, 5],
          R4a:     [2, 0, 5],
          R4b:     [-3, 0, 0.6],
          C:       [0, 0, 0.6],
          Op:      [3, 0, 0.6],
          P:       [3.5, 0, 2],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Réception à 2 = configuration élite (volley professionnel).',
      'Utilisée sur services faciles ou rotations "passeur avant".',
      'Variété offensive maximale : tous les attaquants disponibles immédiatement.',
      'Exigence technique extrême : 2 réceptionneurs solides obligatoires.',
    ],
    commonMistakes: [
      'Adopter ce système contre un service puissant → réceptions catastrophiques.',
      'R4 attaquant qui ne démarre pas son élan en parallèle → option perdue.',
      "Pas d'annonce → flottement entre les 2 réceptionneurs.",
    ],
  },
};

export default STATE;
