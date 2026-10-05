import type { Question } from '../types';

// Quiz "Reconnaître les 6 rotations du 5-1". Mix of:
// - 4 'rotation' questions (show diagram → guess RotationId)
// - 2 'placement' questions (where does the setter / libero stand?)
export const QUESTIONS_ROTATIONS_5_1: Question[] = [
  {
    id: 'r51-q1',
    type: 'rotation',
    prompt:
      'Le passeur est en P1 (arrière droit) et doit pénétrer depuis le coin droit du terrain. Trois attaquants sont au filet, dont le pointu en P4. De quelle rotation s\'agit-il ?',
    systemId: '5-1',
    rotationId: 'R1',
    options: ['R1', 'R2', 'R3', 'R6'],
    correctId: 'R1',
    explanation:
      'C\'est la rotation R1 : passeur en P1, pénétration depuis l\'arrière droit. Trois attaquants au filet (pointu P4 + central P2 + aile P3) + pipe disponible. C\'est la rotation la plus offensive du 5-1.',
  },
  {
    id: 'r51-q2',
    type: 'rotation',
    prompt:
      'Le passeur est au filet à droite (P2), prêt à distribuer sans pénétration. Le pointu se trouve à l\'arrière gauche (P5), prêt pour la pipe. Quelle rotation ?',
    systemId: '5-1',
    rotationId: 'R6',
    options: ['R4', 'R5', 'R6', 'R1'],
    correctId: 'R6',
    explanation:
      'C\'est R6 : passeur en P2, déjà à sa cible de distribution. La rotation la plus stable défensivement — le passeur transite très peu et le pointu en P5 prépare la pipe pour contourner le bloc adverse.',
  },
  {
    id: 'r51-q3',
    type: 'placement',
    prompt:
      'En rotation R3 du 5-1, où se trouve le passeur au moment du service adverse ?',
    systemId: '5-1',
    rotationId: 'R3',
    hiddenRole: 'S',
    options: ['P5', 'P6', 'P1', 'P3'],
    correctId: 'P5',
    explanation:
      'En R3, le passeur est en P5 (arrière gauche). C\'est la pénétration la plus longue du système — il doit traverser tout le terrain en diagonale pour rejoindre sa cible entre P2 et P3. La rotation la plus exigeante physiquement pour le passeur.',
  },
  {
    id: 'r51-q4',
    type: 'rotation',
    prompt:
      'Le passeur pénètre depuis le centre du terrain (P6), trajectoire la plus courte du système. Pointu et libéro sont en P3 et P1. Quelle rotation ?',
    systemId: '5-1',
    rotationId: 'R2',
    options: ['R1', 'R2', 'R3', 'R5'],
    correctId: 'R2',
    explanation:
      'C\'est R2 : passeur en P6, pénétration centrale en ligne droite — la trajectoire la plus rapide. Seulement 2 attaquants au filet (le pointu est en P3 centre, mais l\'aile gauche reste arrière), donc les options offensives sont plus limitées.',
  },
  {
    id: 'r51-q5',
    type: 'placement',
    prompt:
      'En rotation R4 du 5-1 (passeur au filet en P4), où se trouve le pointu pour préparer son attaque arrière ?',
    systemId: '5-1',
    rotationId: 'R4',
    hiddenRole: 'OPP',
    options: ['P1', 'P2', 'P6', 'P5'],
    correctId: 'P1',
    explanation:
      'En R4, le pointu est en P1 (arrière droit), prêt à frapper en pipe ou bic D. C\'est l\'arme principale de cette rotation : avec seulement 2 vrais attaquants au filet (le passeur ne frappe pas), la pipe du pointu permet de contourner le bloc adverse.',
  },
  {
    id: 'r51-q6',
    type: 'rotation',
    prompt:
      'Le passeur est au filet centre (P3), le pointu à l\'arrière en P6. Le central avant doit dégager vers l\'aile gauche pour attaquer. Quelle rotation ?',
    systemId: '5-1',
    rotationId: 'R5',
    options: ['R3', 'R4', 'R5', 'R6'],
    correctId: 'R5',
    explanation:
      'C\'est R5 : passeur en P3 (filet centre), meilleur angle de distribution du système. La synchronisation est cruciale — le passeur glisse vers la droite tandis que le central avant (en P4) dégage vers la gauche pour attaquer comme une aile.',
  },
];
