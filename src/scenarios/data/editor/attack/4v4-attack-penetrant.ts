import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// 4v4 3-1 system: a dedicated setter in P1 penetrates to zone 2, freeing 3
// front-row attackers (P4, P3, P2). Simplified 5-1 equivalent — requires very
// clean reception since the setter starts away from the net.
const STATE: EditorState = {
  metadata: {
    id: '4v4-attack-penetrant',
    title: '4v4 · Passeur pénétrant',
    shortDescription: 'Système 3-1 simplifié : passeur unique en P1 pénètre vers la zone 2, libère 3 attaquants devant.',
    teamSize: 4,
    phase: 'attack',
    contextLabel: '4v4 · Passeur arrière · 3 attaquants',
    defaultCamera: 'DEFAULT',
  },
  players: [
    { id: 'R4',      label: 'Aile G (P4)',     role: 'outside',  color: COLORS.outside },
    { id: 'C',       label: 'Central (P3)',    role: 'middle',   color: COLORS.middle },
    { id: 'A2',      label: 'Aile D (P2)',     role: 'outside',  color: COLORS.outside },
    { id: 'P',       label: 'Passeur (P1)',    role: 'setter',   color: COLORS.setter },
    { id: 'OPP_SRV', label: 'Serveur adv.',    role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_B',   label: 'Bloc adverse',    role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_OFF', label: 'Off-blocker adv.', role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_D1',  label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_D2',  label: 'Arrière adv.',    role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Configuration 3-1',
      description: 'Passeur unique en P1 (arrière). 3 attaquants devant en P2, P3, P4. Pas de libéro : le réceptionneur enchaîne sa course.',
      tempo: 'pause',
      snapshot: {
        positions: {
          R4:      [-3, 0, 0.6],
          C:       [0, 0, 0.6],
          A2:      [3, 0, 0.6],
          P:       [3, 0, 5],
          OPP_SRV: [0, 0, -7],
          OPP_B:   [-2.5, 0, -0.5],
          OPP_OFF: [-3.0, 0, -2.0],
          OPP_D1:  [2.5, 0, -2.5],
          OPP_D2:  [0, 0, -5.5],
        },
        ballPosition: [0, 1.5, -7],
        poses: {
          OPP_SRV: 'SPIKE',
          R4: 'READY', A2: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Service + réception + pénétration',
      description: "L'aile gauche réceptionne en manchette. Le passeur démarre simultanément sa pénétration depuis P1 vers la zone 2.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          R4:      [-1, 0, 4.5],
          C:       [0, 0, 0.6],
          A2:      [3, 0, 0.6],
          P:       [2.0, 0, 0.8],
          OPP_SRV: [0, 0, -6],
          OPP_B:   [-2.5, 0, -0.5],
          OPP_OFF: [-3.0, 0, -2.0],
          OPP_D1:  [2.5, 0, -2.5],
          OPP_D2:  [0, 0, -5.5],
        },
        ballPosition: [-1, 1.2, 4.5],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'MANCHETTE',   id: 'b-s2-recv', playerId: 'R4', impact: [-1, 0, 4.5] },
        { kind: 'PENETRATION', id: 'b-s2-pen',  playerId: 'P',  to: [2.0, 0, 0.8] },
      ],
    },
    {
      id: 's3',
      title: "3. Passe + course d'élan du R4",
      description: "Passe haute vers l'aile gauche après la course de réception du R4. Le bloc adverse glisse face à lui.",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          R4:      [-3.0, 0, 1.5],
          C:       [0, 0, 0.6],
          A2:      [3, 0, 0.6],
          P:       [2.0, 0, 0.8],
          OPP_SRV: [0, 0, -6],
          OPP_B:   [-3.0, 0, -0.4],
          OPP_OFF: [-3.0, 0, -3.0],
          OPP_D1:  [2.5, 0, -4.0],
          OPP_D2:  [0, 0, -5.5],
        },
        ballPosition: [-3.0, 3.4, 0.6],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s3-set',  playerId: 'P',  impact: [2.0, 0, 0.8] },
        { kind: 'COURSE_ELAN', id: 'b-s3-elan', playerId: 'R4', to: [-3.0, 0, 1.5] },
      ],
    },
    {
      id: 's4',
      title: '4. Frappe en diagonale + bloc à 1',
      description: "Frappe puissante en diagonale longue. Avec 3 couvreurs seulement, ils forment un triangle court autour de l'attaquant.",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          R4:      [-3.0, 0, 1.0],
          C:       [0, 0, 0.6],
          A2:      [3, 0, 0.6],
          P:       [2.0, 0, 0.8],
          OPP_SRV: [0, 0, -6],
          OPP_B:   [-3.0, 0, -0.4],
          OPP_OFF: [-3.0, 0, -3.0],
          OPP_D1:  [2.5, 0, -4.0],
          OPP_D2:  [0, 0, -5.5],
        },
        ballPosition: [2, 0, -5],
      },
      ballTrajectory: { curve: 'flat' },
      actions: [
        { kind: 'SMASH', id: 'b-s4-smash', playerId: 'R4',    impact: [-3.0, 0, 0.6], jumpHeight: 1.6, contactAtRatio: 0.45 },
        { kind: 'BLOC',  id: 'b-s4-bloc',  playerId: 'OPP_B', impact: [-3.0, 0, -0.4], jumpHeight: 1.5, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération adverse',
      description: "Le défenseur cross adverse plonge sur la diagonale longue — arrive 0.1 s trop tard sur l'impact.",
      tempo: 'rapide',
      durationOverride: 0.5,
      snapshot: {
        positions: {
          R4:      [-3.0, 0, 0.6],
          C:       [0, 0, 0.6],
          A2:      [3, 0, 0.6],
          P:       [2.0, 0, 0.8],
          OPP_SRV: [0, 0, -6],
          OPP_B:   [-3.0, 0, -0.4],
          OPP_OFF: [-3.0, 0, -3.0],
          OPP_D1:  [2.0, 0, -4.8],
          OPP_D2:  [0, 0, -5.5],
        },
        ballPosition: [2, 0, -5],
      },
      actions: [
        { kind: 'DEFENSE_PLONGEE', id: 'b-s5-dig', playerId: 'OPP_D1', impact: [2.0, 0, -4.8] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — retour formation',
      description: 'Le passeur retourne en P1 arrière, le R4 revient en zone 4. La pénétration doit être anticipée dès le service suivant.',
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          R4:      [-3, 0, 0.6],
          C:       [0, 0, 0.6],
          A2:      [3, 0, 0.6],
          P:       [3, 0, 5],
          OPP_SRV: [0, 0, -6],
          OPP_B:   [-2.5, 0, -0.5],
          OPP_OFF: [-3.0, 0, -2.0],
          OPP_D1:  [2.5, 0, -2.5],
          OPP_D2:  [0, 0, -5.5],
        },
        ballPosition: [2, 0, -5],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Système 3-1 = équivalent du 5-1 en 4v4. 1 passeur dédié pénétrant.',
      'Avantage : 3 attaquants devant en permanence, comme en 6v6.',
      "Inconvénient : exige une réception très propre car le passeur n'est pas au filet.",
      "Pas de libéro : le réceptionneur enchaîne aussi sa course d'élan.",
    ],
    commonMistakes: [
      'Pénétration trop tardive → un autre joueur doit faire la passe.',
      'Réception trop courte → passeur arrive trop loin du filet.',
      'Couverture oubliée — block-out adverse = point.',
    ],
  },
};

export default STATE;
