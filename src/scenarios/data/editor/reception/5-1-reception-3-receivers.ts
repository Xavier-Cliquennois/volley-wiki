import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 5-1 reception with 3 receivers (libero + 2 outsides). Setter hides at the net
// in P1 area, opposite hides at the net in P2 — both ready for second touch.
const STATE: EditorState = {
  metadata: {
    id: '5-1-reception-3-receivers',
    title: 'Réception · à 3 (5-1)',
    shortDescription: 'Réception à 3 (libéro + 2 R4) avec passeur sorti et pointu caché — formation moderne standard.',
    teamSize: 6,
    phase: 'reception',
    contextLabel: '5-1 · Réception à 3 · Service adverse',
    defaultCamera: 'BEHIND_SERVE',
  },
  players: [
    { id: 'R4a',     label: 'R4 gauche',       role: 'outside',  color: COLORS.outside },
    { id: 'L',       label: 'Libéro',          role: 'libero',   color: COLORS.libero },
    { id: 'R4b',     label: 'R4 droit',        role: 'outside',  color: COLORS.outside_back },
    { id: 'C',       label: 'Central',         role: 'middle',   color: COLORS.middle },
    { id: 'Op',      label: 'Pointu (caché)',  role: 'opposite', color: COLORS.opposite },
    { id: 'P',       label: 'Passeur (caché)', role: 'setter',   color: COLORS.setter },
    { id: 'OPP_SRV', label: 'Serveur adv.',    role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Position de réception',
      description: "Trois réceptionneurs en arc : R4 gauche, libéro central, R4 droit. Chacun couvre ~1/3 de la largeur. Le passeur et le pointu se cachent au filet, prêts à intervenir dès la frappe du serveur.",
      tempo: 'pause',
      snapshot: {
        positions: {
          R4a:     [-3, 0, 4],
          L:       [0, 0, 5.5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Op:      [3.5, 0, 0.6],
          P:       [3.5, 0, 2.5],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
        poses: {
          OPP_SRV: 'SPIKE',
          R4a: 'READY', L: 'READY', R4b: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + manchette',
      description: "Service en cloche vers le R4 gauche qui annonce \"J'ai !\" et fait manchette. En parallèle, le passeur déclenche sa pénétration depuis sa cachette en P1 vers la zone 2-3.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          R4a:     [-1.8, 0, 4.2],
          L:       [0, 0, 5.5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Op:      [3.5, 0, 0.6],
          P:       [3, 0, 2],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-1.8, 1.2, 4.2],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE',   id: 'b-s2-recv', playerId: 'R4a', impact: [-1.8, 0, 4.2] },
        { kind: 'PENETRATION', id: 'b-s2-pen',  playerId: 'P',   to: [3, 0, 2] },
      ],
    },
    {
      id: 's3',
      title: '3. Passe haute vers la zone 4',
      description: "La balle remonte vers la cible (entre P2 et P3) où le passeur arrive juste à temps. Il distribue en cloche vers la zone 4. Le R4 récepteur a déjà déclenché son repli sur la ligne des 3 m.",
      tempo: 'standard',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          R4a:     [-3, 0, 2.5],
          L:       [0, 0, 5.5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Op:      [3.5, 0, 0.6],
          P:       [1.5, 0, 0.8],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [1.5, 1.9, 0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',   impact: [1.5, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4a', to: [-3, 0, 2.5] },
      ],
    },
    {
      id: 's4',
      title: "4. Ballon disponible à l'attaquant",
      description: "La balle arrive en zone 4 à hauteur d'attaque. Le R4 prend les derniers appuis avant son saut. La qualité de la passe valide la qualité de la réception initiale.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          R4a:     [-3.5, 0, 1.5],
          L:       [0, 0, 5.5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Op:      [3.5, 0, 0.6],
          P:       [1.5, 0, 0.8],
          OPP_SRV: [0, 0, -7.5],
        },
        ballPosition: [-3, 3, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
    },
    {
      id: 's5',
      title: '5. RESET — retour formation',
      description: "Toute l'équipe reprend sa position de réception pour le service suivant.",
      tempo: 'calme',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          R4a:     [-3, 0, 4],
          L:       [0, 0, 5.5],
          R4b:     [3, 0, 4],
          C:       [0, 0, 0.6],
          Op:      [3.5, 0, 0.6],
          P:       [3.5, 0, 2.5],
          OPP_SRV: [0, 0, -8.5],
        },
        ballPosition: [0, 1.5, -8.5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Réception à 3 = standard 5-1 moderne. Spécialisation maximale.',
      'Cible : zone 2-3, à un bras du filet, à hauteur ~3 m.',
      "Le passeur reste caché au filet jusqu'à la frappe du serveur, puis pénètre.",
      "Le R4 récepteur enchaîne IMMÉDIATEMENT sa course d'élan d'attaque.",
    ],
    commonMistakes: [
      'Réception trop plate ou trop courte → passeur arrive en retard.',
      'Conflit entre 2 réceptionneurs → annonce vocale obligatoire.',
      'R4 qui reste figé après réception → perd une option offensive en zone 4.',
    ],
  },
};

export default STATE;
