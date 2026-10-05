import type { Question } from '../types';

// Quiz "Placement défensif". Focus on 'placement' questions: where does
// player X stand in this scenario? Mix of 5-1 / 6-2 with covered, defending
// and transition contexts.
export const QUESTIONS_PLACEMENT_DEFENSE: Question[] = [
  {
    id: 'pd-q1',
    type: 'placement',
    prompt:
      'En R1 du 5-1, où le libéro est-il positionné au moment du service adverse ?',
    systemId: '5-1',
    rotationId: 'R1',
    hiddenRole: 'L',
    options: ['P5', 'P6', 'P1', 'P4'],
    correctId: 'P5',
    explanation:
      'En R1, le libéro est en P5 (arrière gauche). Il remplace le central qui devrait être en arrière (MB2). Le libéro joue toujours en arrière et couvre les réceptions à 3 — c\'est la position où il peut absorber les services tendus côté gauche tout en restant disponible pour la défense diagonale courte.',
  },
  {
    id: 'pd-q2',
    type: 'placement',
    prompt:
      'En R2 du 5-1, le passeur pénètre depuis l\'arrière centre. Où se place le central avant (MB) pour préparer le contre ?',
    systemId: '5-1',
    rotationId: 'R2',
    hiddenRole: 'MB2',
    options: ['P4', 'P3', 'P2', 'P6'],
    correctId: 'P4',
    explanation:
      'En R2, le central avant MB2 est en P4. Il prend l\'aile gauche pour le contre — couvre l\'attaque adverse en zone 4. Au signal de service, il doit garder sa position d\'overlap (devant P5 et à gauche de P3) puis basculer rapidement vers la cible adverse une fois la balle servie.',
  },
  {
    id: 'pd-q3',
    type: 'multiple-choice',
    prompt:
      'L\'attaque adverse vient de la zone 4 (leur aile gauche, donc côté droit du terrain pour nous). Quel joueur est responsable de la défense diagonale longue ?',
    explanation:
      'La diagonale longue de l\'attaque adverse en zone 4 atterrit côté droit fond chez nous, soit en P1. Le défenseur P1 (chez nous, le pointu ou l\'arrière droit) doit lire l\'angle et reculer à la ligne de fond. Règle : l\'attaquant en zone 4 frappe naturellement en diagonale longue.',
    options: [
      { id: 'p1', label: 'P1 (arrière droit chez nous)' },
      { id: 'p6', label: 'P6 (arrière centre)' },
      { id: 'p5', label: 'P5 (arrière gauche)' },
      { id: 'p4', label: 'P4 (avant gauche)' },
    ],
    correctId: 'p1',
  },
  {
    id: 'pd-q4',
    type: 'placement',
    prompt:
      'En R4 du 5-1 (passeur au filet en P4), où se trouve l\'aile gauche (OH1) au moment du service adverse ?',
    systemId: '5-1',
    rotationId: 'R4',
    hiddenRole: 'OH1',
    options: ['P6', 'P5', 'P1', 'P3'],
    correctId: 'P6',
    explanation:
      'En R4, OH1 est en P6 (arrière centre). Comme le passeur occupe P4 au filet, l\'OH1 est repoussé à l\'arrière — il assure la réception côté gauche du W et prépare la pipe arrière comme arme alternative. La couverture du quick central passe aussi par lui.',
  },
  {
    id: 'pd-q5',
    type: 'multiple-choice',
    prompt:
      'Après une attaque de notre pointu en zone 2, qui doit descendre à la 3 m pour couvrir le contre adverse retour ?',
    explanation:
      'La couverture d\'attaque (cover) se fait par les joueurs proches de l\'attaquant : aile gauche (côté opposé) descend en arc, central avant reste haut pour contre, et le passeur (s\'il est arrière) descend également. Le but : récupérer un ballon contré pour relancer immédiatement. Sans cover, un contre retour = point perdu.',
    options: [
      { id: 'oh-mb', label: 'L\'aile gauche et le central avant' },
      { id: 'libero', label: 'Le libéro uniquement' },
      { id: 'setter-only', label: 'Le passeur uniquement' },
      { id: 'nobody', label: 'Personne — on prépare déjà la défense' },
    ],
    correctId: 'oh-mb',
  },
  {
    id: 'pd-q6',
    type: 'placement',
    prompt:
      'En R3 du 5-1, le pointu (OPP) est au filet. Où se trouve-t-il pour préparer son attaque en zone 2 ?',
    systemId: '5-1',
    rotationId: 'R3',
    hiddenRole: 'OPP',
    options: ['P2', 'P1', 'P3', 'P4'],
    correctId: 'P2',
    explanation:
      'En R3, le pointu est en P2 (avant droit) au filet. C\'est sa zone d\'attaque naturelle — il frappe en aile droite, le plus souvent en diagonale courte ou en ligne. La rotation est offensive : 3 attaquants au filet (pointu P2 + central P3 + aile P4), conditionnée par la pénétration longue du passeur.',
  },
];
