import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 6v6 4-2 system reception: front setter is fixed in P2 (no penetration),
// the front middle steps off the reception line, leaving 4 receivers in a
// trapezoid (2 outsides + back middle + back setter).
const STATE: EditorState = {
  metadata: {
    id: '6v6-reception-4-2',
    title: 'Réception · 4-2 (4 réceptionneurs)',
    shortDescription: 'Système 4-2 : passeur fixe en P2 + 4 réceptionneurs (les 2 R4 + central + arrière).',
    teamSize: 6,
    phase: 'reception',
    contextLabel: '4-2 · 4 réceptionneurs · Passeur avant fixe',
    defaultCamera: 'BEHIND_SERVE',
    system: '4-2',
  },
  players: [
    { id: 'P',       label: 'Passeur (P2 fixe)', role: 'setter',   color: COLORS.setter },
    { id: 'C2',      label: 'Central avant',     role: 'middle',   color: COLORS.middle },
    { id: 'R4a',     label: 'R4 G',              role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Central arr.',      role: 'middle',   color: COLORS.middle_back },
    { id: 'R4b',     label: 'R4 D',              role: 'outside',  color: COLORS.outside_back },
    { id: 'P2',      label: 'Passeur arr.',      role: 'setter',   color: COLORS.opposite },
    { id: 'OPP_SRV', label: 'Serveur adv.',      role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Disposition 4-2',
      description: "Système 4-2 : 2 passeurs opposés. Le passeur avant (P2) et le central avant sortent au filet. 4 réceptionneurs en trapèze : 2 R4 sur la diagonale, central arrière et passeur arrière au fond.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          C2:      [0, 0, 0.6],
          R4a:     [-3, 0, 3.5],
          C:       [0, 0, 5],
          R4b:     [3, 0, 5.5],
          P2:      [-3, 0, 6],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          R4a: 'READY', C: 'READY', R4b: 'READY', P2: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + manchette R4 G',
      description: "Service en cloche vers le couloir gauche. Le R4 gauche annonce et fait manchette. Le passeur est déjà fixe en P2 au filet, pas de pénétration.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          C2:      [0, 0, 0.6],
          R4a:     [-1.5, 0, 4],
          C:       [0, 0, 5],
          R4b:     [3, 0, 5.5],
          P2:      [-3, 0, 6],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-1.5, 1.2, 4],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s2-recv', playerId: 'R4a', impact: [-1.5, 0, 4] },
      ],
    },
    {
      id: 's3',
      title: "3. Passe vers l'aile gauche",
      description: "La balle arrive sur le passeur fixe en P2 (cible facile, aucun déplacement). Il distribue vers l'aile gauche. Le R4 G enchaîne sa course d'élan immédiatement.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          C2:      [0, 0, 0.6],
          R4a:     [-3, 0, 2],
          C:       [0, 0, 5],
          R4b:     [3, 0, 5.5],
          P2:      [-3, 0, 6],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [2.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [2.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4a', to: [-3, 0, 2] },
      ],
    },
    {
      id: 's4',
      title: '4. Ballon disponible en zone 4',
      description: "La passe est en place. En 4-2, seules 2 options offensives existent devant (le central et l'aile) → distribution lisible mais limitée.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          C2:      [0, 0, 0.6],
          R4a:     [-3, 0, 1.5],
          C:       [0, 0, 5],
          R4b:     [3, 0, 5.5],
          P2:      [-3, 0, 6],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: '5. RESET — retour trapèze',
      description: "Toute l'équipe reprend sa position dans le système 4-2.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:       [3, 0, 0.6],
          C2:      [0, 0, 0.6],
          R4a:     [-3, 0, 3.5],
          C:       [0, 0, 5],
          R4b:     [3, 0, 5.5],
          P2:      [-3, 0, 6],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Réception à 4 = système 4-2. 2 joueurs avant sortis (passeur + central avant).',
      "Zones plus grandes qu'en W mais moins exigeant que la réception à 3.",
      'Cible facile : le passeur ne bouge pas.',
      'Inconvénient : seulement 2 attaquants devant.',
    ],
    commonMistakes: [
      'Le central avant qui réceptionne aussi → pas de fixation au filet.',
      'Trapèze trop ouvert → balles centrales non couvertes.',
      'Confusion sur la 2ᵉ touche entre les 2 passeurs.',
    ],
  },
};

export default STATE;
