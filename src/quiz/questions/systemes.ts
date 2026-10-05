import type { Question } from '../types';

// Quiz "Reconnaître les 3 systèmes (5-1 / 6-2 / 4-2)". Mix of 'multiple-choice'
// and 'rotation' questions to identify the system from a snapshot or
// description.
export const QUESTIONS_SYSTEMES: Question[] = [
  {
    id: 'sys-q1',
    type: 'multiple-choice',
    prompt:
      'Un seul joueur distribue sur les 6 rotations. Quand il est au filet, le pointu prend la moitié des attaques pour préserver l\'équilibre offensif. De quel système s\'agit-il ?',
    explanation:
      'C\'est le 5-1 : un passeur (S) + un pointu (OPP) diagonalement opposés. Le pointu compense l\'attaque quand le passeur est avant (rotations 4-5-6). C\'est la référence en compétition car elle maximise la spécialisation des rôles.',
    options: [
      { id: '5-1', label: 'Système 5-1' },
      { id: '6-2', label: 'Système 6-2' },
      { id: '4-2', label: 'Système 4-2' },
      { id: '4v4', label: 'Système 4v4 Diamant' },
    ],
    correctId: '5-1',
  },
  {
    id: 'sys-q2',
    type: 'multiple-choice',
    prompt:
      'Deux passeurs sur le terrain, diagonalement opposés. Le passeur arrière distribue (2e touche après pénétration), le passeur avant joue comme 3e attaquant. Quel système ?',
    explanation:
      'C\'est le 6-2 : 2 passeurs (S + S2), 6 attaquants (les 2 passeurs comprennent leur tour en attaque quand ils sont avant). Idéal pour les équipes qui veulent toujours 3 attaquants au filet, au prix d\'avoir 2 passeurs à former.',
    options: [
      { id: '5-1', label: 'Système 5-1' },
      { id: '6-2', label: 'Système 6-2' },
      { id: '4-2', label: 'Système 4-2' },
      { id: '5v5', label: 'Système 5v5' },
    ],
    correctId: '6-2',
  },
  {
    id: 'sys-q3',
    type: 'multiple-choice',
    prompt:
      'Deux passeurs diagonalement opposés, mais c\'est le passeur AVANT qui distribue. Seulement 2 attaquants au filet par rotation. Pas de libéro classique. Quel système ?',
    explanation:
      'C\'est le 4-2 : le passeur avant distribue (pas de pénétration), le passeur arrière joue uniquement en défense. Système simple, idéal pour débutants ou loisirs — moins offensif (2 attaquants au filet seulement) mais facile à mettre en place.',
    options: [
      { id: '5-1', label: 'Système 5-1' },
      { id: '6-2', label: 'Système 6-2' },
      { id: '4-2', label: 'Système 4-2' },
      { id: 'libre', label: 'Système libre' },
    ],
    correctId: '4-2',
  },
  {
    id: 'sys-q4',
    type: 'multiple-choice',
    prompt:
      'Une équipe de cadets découvre le volley en club. Quel système est le plus adapté pour leur première saison ?',
    explanation:
      'Le 4-2 est le système d\'entrée : peu d\'overlap à mémoriser, pas de pénétration, le passeur avant prend toutes les 2es touches. Les jeunes peuvent se concentrer sur les fondamentaux (réception, passe haute, attaque) sans la complexité du 5-1. La transition vers le 5-1 se fait ensuite naturellement.',
    options: [
      { id: '4-2', label: 'Le 4-2 (pas de pénétration)' },
      { id: '5-1', label: 'Le 5-1 (référence compétition)' },
      { id: '6-2', label: 'Le 6-2 (2 passeurs)' },
      { id: 'libre', label: 'Système libre avec passeur tournant' },
    ],
    correctId: '4-2',
  },
  {
    id: 'sys-q5',
    type: 'rotation',
    prompt:
      'Sur ce schéma, le passeur principal (S) est au filet en P2 à droite, et le 2ᵉ passeur (S2) est en arrière gauche en P5. C\'est la rotation où le pointu n\'existe pas comme rôle distinct. Quel système ?',
    systemId: '6-2',
    rotationId: 'R6',
    options: ['R4', 'R5', 'R6', 'R1'],
    correctId: 'R6',
    explanation:
      'C\'est R6 du 6-2 : passeur principal au filet à droite (P2), 2ᵉ passeur en arrière gauche. Note : les 2 passeurs (en violet et rouge) remplacent visuellement le rôle de "pointu" du 5-1. En 6-2 c\'est le passeur avant (en P2 ici) qui frappe la 3ᵉ attaque comme un pointu.',
  },
  {
    id: 'sys-q6',
    type: 'multiple-choice',
    prompt:
      'Avantage clé du 5-1 par rapport au 6-2 : ',
    explanation:
      'Le 5-1 maximise la spécialisation : un seul passeur à former (un seul style de distribution à apprendre), des attaquants spécialisés à chaque poste. Le 6-2 demande 2 passeurs aux standards comparables. C\'est pour cela que le 5-1 est la référence dès qu\'on cherche la performance — au prix d\'une dépendance forte à ce passeur unique.',
    options: [
      { id: 'specialisation', label: 'Spécialisation maximale (un passeur, un style)' },
      { id: 'attackers', label: '3 attaquants au filet à chaque rotation' },
      { id: 'no-pen', label: 'Pas de pénétration nécessaire' },
      { id: 'libero', label: 'Pas besoin de libéro' },
    ],
    correctId: 'specialisation',
  },
];
