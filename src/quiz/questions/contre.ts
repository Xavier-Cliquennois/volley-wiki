import type { Question } from '../types';

// Quick test for the "Contre" guide: timing, visual sequence, block styles.
export const QUESTIONS_CONTRE: Question[] = [
  {
    id: 'ct-q1',
    type: 'multiple-choice',
    prompt: 'Sur une balle haute en aile, quand sautes-tu par rapport à l\'attaquant ?',
    explanation:
      'Le contreur saute après l\'attaquant, avec un décalage d\'environ 0,2 à 0,3 seconde sur une balle haute (3e tempo). Sauter en même temps ou avant, c\'est redescendre trop tôt. Seul le quick se contre avec ou un poil avant le hitter (commit block).',
    options: [
      { id: 'before', label: 'Avant lui, pour être déjà en haut' },
      { id: 'same', label: 'En même temps que lui' },
      { id: 'after', label: 'Environ 0,2 à 0,3 s après lui' },
      { id: 'no-jump', label: 'Je ne saute pas, je défends' },
    ],
    correctId: 'after',
  },
  {
    id: 'ct-q2',
    type: 'multiple-choice',
    prompt: 'Que doit regarder un contreur élite au moment de l\'attaque ?',
    explanation:
      'La séquence est ballon, passeur, ballon, puis épaule du frappeur. L\'épaule et le bras de l\'attaquant donnent la direction de la frappe avant le contact.',
    options: [
      { id: 'ball', label: 'Uniquement le ballon' },
      { id: 'net', label: 'Le haut du filet' },
      { id: 'coach', label: 'Les consignes du coach' },
      { id: 'shoulder', label: 'L\'épaule et le bras de l\'attaquant' },
    ],
    correctId: 'shoulder',
  },
  {
    id: 'ct-q3',
    type: 'multiple-choice',
    prompt: 'Quel est le risque principal du commit block ?',
    explanation:
      'Le central décide de sauter avant le release du passeur. Si le passeur set ailleurs, le central est complètement hors jeu. Le read blocking, qui attend la décision du passeur, est recommandé à tous les niveaux amateur.',
    options: [
      { id: 'slow', label: 'Il arrive trop tard sur le quick' },
      { id: 'out', label: 'Si le passeur set ailleurs, le central est hors jeu' },
      { id: 'knees', label: 'Il fatigue davantage les genoux' },
      { id: 'net', label: 'Il provoque toujours une faute de filet' },
    ],
    correctId: 'out',
  },
];
