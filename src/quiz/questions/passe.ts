import type { Question } from '../types';

// Quick test for the "Passe" guide: hand shape, footwork, distribution.
export const QUESTIONS_PASSE: Question[] = [
  {
    id: 'ps-q1',
    type: 'multiple-choice',
    prompt: 'Pourquoi un passeur doit-il ajuster ses pieds AVANT le contact plutôt que tourner le buste en l\'air ?',
    explanation:
      'Le bloc adverse lit les pieds, pas les mains. Un passeur qui ajuste ses pieds avant le contact peut distribuer vers 3 options sans donner d\'indice. Un buste qui tourne en l\'air est lisible et se fait bloquer.',
    options: [
      { id: 'balance', label: 'Pour garder l\'équilibre uniquement' },
      { id: 'power', label: 'Pour donner plus de puissance à la passe' },
      { id: 'unreadable', label: 'Pour rester illisible : le bloc lit les pieds, pas les mains' },
      { id: 'rule', label: 'Parce que le règlement l\'impose' },
    ],
    correctId: 'unreadable',
  },
  {
    id: 'ps-q2',
    type: 'multiple-choice',
    prompt: 'La réception arrive à 3 m du filet, parfaite. Quelles options as-tu ?',
    explanation:
      'Sur une passe parfaite, 3 options sont actives : le quick (central), le 2e tempo (aile) et l\'arrière (pointu). On choisit selon le bloc adverse. Plus la réception se dégrade, plus les options se réduisent.',
    options: [
      { id: 'one', label: 'Une seule : l\'aile en zone 4' },
      { id: 'three', label: 'Trois : quick, 2e tempo et attaque arrière' },
      { id: 'none', label: 'Aucune, il faut jouer sécurité' },
      { id: 'two', label: 'Deux : zone 4 haut ou zone 2, sans quick' },
    ],
    correctId: 'three',
  },
  {
    id: 'ps-q3',
    type: 'multiple-choice',
    prompt: 'Comment doivent être tes mains pour une passe à dix doigts ?',
    explanation:
      'Les pouces et index forment une fenêtre triangulaire au-dessus du front. Le ballon est touché par les coussinets des doigts écartés, pas par la paume, et les coudes restent ouverts vers l\'extérieur et le haut.',
    options: [
      { id: 'palms', label: 'Le ballon est touché par les paumes' },
      { id: 'elbows-in', label: 'Les coudes pointent vers l\'avant' },
      { id: 'low', label: 'Les mains restent à hauteur de poitrine' },
      { id: 'triangle', label: 'Un triangle au-dessus du front, contact avec les coussinets des doigts' },
    ],
    correctId: 'triangle',
  },
];
