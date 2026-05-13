import type { EditorState } from '../../../../editor/types';
import { COLORS } from '../../_shared';

// Man-up defense (2-1-3): a defender pulls up to the 3m line in the block shadow to read tips,
// roll shots, and any short "junk ball". Only 3 deep defenders — vulnerable to power shots.
const STATE: EditorState = {
  metadata: {
    id: '6v6-defense-6-front',
    title: 'Défense · man-up (2-1-3)',
    shortDescription: 'Système man-up (2-1-3, anciennement « défense en W ») : un défenseur monté derrière le bloc pour les feintes courtes.',
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Man-up 2-1-3 · Anti-feinte',
    defaultCamera: 'TOP_DOWN',
  },
  players: [
    { id: 'P',     label: 'Passeur (P1)',       role: 'setter',   color: COLORS.setter },
    { id: 'Op',    label: 'Pointu (P2)',        role: 'opposite', color: COLORS.opposite },
    { id: 'C',     label: 'Central (P3)',       role: 'middle',   color: COLORS.middle },
    { id: 'R4',    label: 'R4 (P4)',            role: 'outside',  color: COLORS.outside },
    { id: 'L',     label: 'Libéro (P5)',        role: 'libero',   color: COLORS.libero },
    { id: 'R4b',   label: 'R4 (P6 avancé)',     role: 'outside',  color: COLORS.middle_back },
    { id: 'OPP_A', label: 'Attaquant adverse',  role: 'opponent', color: COLORS.opponent },
    { id: 'OPP_S', label: 'Passeur adv.',       role: 'opponent', color: COLORS.opponent },
  ],
  steps: [
    {
      id: 's1',
      title: '1. Base man-up',
      description: "L'adversaire est connu pour ses feintes — choix tactique du man-up. Le R4 (en P6) est déjà avancé à 2,5 m, prêt à monter derrière le bloc.",
      tempo: 'pause',
      snapshot: {
        positions: {
          P:     [3, 0, 5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-3, 0, 5],
          R4b:   [0, 0, 2.5],
          OPP_A: [3, 0, -3],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [-1.5, 1.8, -0.8],
        poses: {
          C: 'READY', L: 'READY', R4b: 'READY', P: 'READY',
        },
      },
    },
    {
      id: 's2',
      title: '2. Passe haute adverse Z4',
      description: "Distribution standard vers Z4 adverse. La défense reconnaît la configuration et se met en place.",
      tempo: 'standard',
      durationOverride: 1.0,
      snapshot: {
        positions: {
          P:     [3, 0, 5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-3, 0, 5],
          R4b:   [0, 0, 2.5],
          OPP_A: [3, 0, -1.2],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [3.0, 3.0, -0.8],
      },
      ballTrajectory: { curve: 'arc', apex: 4 },
      actions: [
        { kind: 'PASSE_HAUTE', id: 'b-s2-set', playerId: 'OPP_S', impact: [-1.5, 0, -0.8] },
      ],
    },
    {
      id: 's3',
      title: "3. Joueur monté derrière le bloc",
      description: "Différence-clé du man-up : R4b avance à 2,5 m du filet, dans l'ombre du bloc. Libéro et passeur reculent à 6 m pour compenser. Bloc à 2 standard (pointu + central).",
      tempo: 'standard',
      durationOverride: 0.9,
      snapshot: {
        positions: {
          P:     [3.0, 0, 6],
          Op:    [3.0, 0, 0.3],
          C:     [2.0, 0, 0.3],
          R4:    [-3.0, 0, 1.5],
          L:     [-3.0, 0, 6],
          R4b:   [1.5, 0, 2.5],
          OPP_A: [3, 0, -0.7],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [3.0, 3.0, -0.8],
      },
    },
    {
      id: 's4',
      title: '4. Feinte adverse en suspension',
      description: "L'attaquant choisit la feinte plutôt que le smash. La balle pose juste derrière le bloc — exactement où est le joueur monté.",
      tempo: 'rapide',
      durationOverride: 0.8,
      snapshot: {
        positions: {
          P:     [3.0, 0, 6],
          Op:    [3.0, 0, 0.5],
          C:     [2.0, 0, 0.5],
          R4:    [-3.0, 0, 1.5],
          L:     [-3.0, 0, 6],
          R4b:   [1.5, 0, 2.5],
          OPP_A: [3, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [1.5, 1.0, 2.5],
      },
      ballTrajectory: { curve: 'arc', apex: 2.5 },
      actions: [
        { kind: 'FEINTE', id: 'b-s4-tip',   playerId: 'OPP_A', impact: [3, 0, -0.5], jumpHeight: 1.7, contactAtRatio: 0.45 },
        { kind: 'BLOC',   id: 'b-s4-blocR', playerId: 'Op',    impact: [3.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
        { kind: 'BLOC',   id: 'b-s4-blocC', playerId: 'C',     impact: [2.0, 0, 0.3], jumpHeight: 1.6, contactAtRatio: 0.45 },
      ],
    },
    {
      id: 's5',
      title: '5. Récupération courte par le joueur monté',
      description: "Le joueur monté est exactement où la balle tombe. Manchette précise vers le pointu pour relancer une 2ᵉ touche en suspension.",
      tempo: 'rapide',
      durationOverride: 0.6,
      snapshot: {
        positions: {
          P:     [3.0, 0, 6],
          Op:    [3.0, 0, 0.5],
          C:     [2.0, 0, 0.5],
          R4:    [-3.0, 0, 1.5],
          L:     [-3.0, 0, 6],
          R4b:   [1.5, 0, 2.5],
          OPP_A: [3, 0, -0.6],
          OPP_S: [-1.5, 0, -0.8],
        },
        ballPosition: [2.0, 2.5, 1.0],
      },
      ballTrajectory: { curve: 'arc', apex: 3.5 },
      actions: [
        { kind: 'MANCHETTE', id: 'b-s5-dig', playerId: 'R4b', impact: [1.5, 0, 2.5] },
      ],
    },
    {
      id: 's6',
      title: '6. RESET — base man-up',
      description: "Retour à la position de base 2-1-3. R4b re-positionné à 2,5 m, libéro et passeur en fond.",
      tempo: 'calme',
      durationOverride: 1.2,
      snapshot: {
        positions: {
          P:     [3, 0, 5],
          Op:    [3, 0, 0.4],
          C:     [0, 0, 0.4],
          R4:    [-3, 0, 0.4],
          L:     [-3, 0, 5],
          R4b:   [0, 0, 2.5],
          OPP_A: [3, 0, -3],
          OPP_S: [-1.5, 0, -2.5],
        },
        ballPosition: [2.0, 2.5, 1.0],
      },
    },
  ],
  summary: {
    keyPoints: [
      'Man-up = 2-1-3 (Keller / USAV) — anciennement « red defense ».',
      '⚠ NE PAS confondre avec « W-formation » qui est une formation de RÉCEPTION, pas un système défensif.',
      'Couverture exceptionnelle des tips, roll shots et balles « pourries » derrière le bloc.',
      'Mais : seulement 3 défenseurs profonds → vulnérable aux smashs puissants en diagonale serrée.',
      'Indication : équipes jeunes, scolaires, adversaires tactiques jouant beaucoup de feintes ou off-speed.',
    ],
    commonMistakes: [
      'Garder le système périmétrique contre une équipe qui feinte → balles courtes perdues.',
      "Joueur monté trop avancé (au filet) → bloqué dans l'élan du contre.",
      'Libéro qui ne recule pas → trou en arrière sur smash puissant.',
      "Confondre « défense en W » et « man-up » dans le vocabulaire d'équipe — source de malentendus.",
    ],
  },
};

export default STATE;
