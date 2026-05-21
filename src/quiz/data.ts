import type { Quiz } from './types';
import { QUESTIONS_ROTATIONS_5_1 } from './questions/rotations-5-1';
import { QUESTIONS_OPTIONS_ATTAQUE } from './questions/options-attaque';
import { QUESTIONS_PLACEMENT_DEFENSE } from './questions/placement-defense';
import { QUESTIONS_SYSTEMES } from './questions/systemes';
import { QUESTIONS_LECTURE_JEU } from './questions/lecture-jeu';

export const QUIZZES: Quiz[] = [
  {
    slug: 'rotations-5-1',
    title: 'Rotations du 5-1',
    subtitle: 'Reconnaître les 6 rotations à partir du schéma de terrain',
    description:
      'Six questions qui combinent reconnaissance de rotation et placement du passeur, libéro et pointu. Idéal pour mémoriser le cycle R1→R6.',
    category: 'Tactique',
    level: 'Intermédiaire',
    estimatedTime: '~4 min',
    questions: QUESTIONS_ROTATIONS_5_1,
  },
  {
    slug: 'options-attaque',
    title: 'Options offensives',
    subtitle: 'Choisir la bonne attaque selon la qualité de la réception',
    description:
      'Réception parfaite, moyenne ou dégradée : à toi de piloter le quick, la pipe, la bic ou la balle haute. Couvre le 5-1 et la règle d\'or "mauvaise réception → balle haute".',
    category: 'Tactique',
    level: 'Intermédiaire',
    estimatedTime: '~4 min',
    questions: QUESTIONS_OPTIONS_ATTAQUE,
  },
  {
    slug: 'placement-defense',
    title: 'Placement & défense',
    subtitle: 'Libéro, central, aile : où se placer selon la rotation et la phase ?',
    description:
      'Six questions sur le placement des joueurs au service adverse et après attaque. Mélange de placements précis sur le terrain et de logique défensive.',
    category: 'Tactique',
    level: 'Intermédiaire',
    estimatedTime: '~4 min',
    questions: QUESTIONS_PLACEMENT_DEFENSE,
  },
  {
    slug: 'systemes',
    title: 'Reconnaître les systèmes',
    subtitle: '5-1, 6-2, 4-2 : avantages, inconvénients et choix selon le niveau',
    description:
      'Identifier le système à partir d\'une description ou d\'un schéma. Comprendre pourquoi chaque système existe et lequel utiliser selon ton équipe.',
    category: 'Tactique',
    level: 'Débutant',
    estimatedTime: '~3 min',
    questions: QUESTIONS_SYSTEMES,
  },
  {
    slug: 'lecture-jeu',
    title: 'Lecture du jeu',
    subtitle: 'Indices serveur, passeur, attaquant — et règle d\'or du contre',
    description:
      'Six questions sur les indices à lire en temps réel : course du serveur, regard du passeur, épaule de l\'attaquant. Tirées du guide Lecture du jeu.',
    category: 'Tactique',
    level: 'Avancé',
    estimatedTime: '~4 min',
    questions: QUESTIONS_LECTURE_JEU,
  },
];

export function getQuizBySlug(slug: string): Quiz | undefined {
  return QUIZZES.find(q => q.slug === slug);
}

// Special slug for the "draw N random questions from all quizzes" mode.
// Routing: /quiz/random.
export const RANDOM_QUIZ_SLUG = 'random';
export const RANDOM_QUIZ_SIZE = 10;

export function buildRandomQuiz(seed?: number): Quiz {
  const allQuestions = QUIZZES.flatMap(q => q.questions);
  const shuffled = shuffleWithSeed(allQuestions, seed);
  const picked = shuffled.slice(0, Math.min(RANDOM_QUIZ_SIZE, shuffled.length));
  return {
    slug: RANDOM_QUIZ_SLUG,
    title: 'Quiz aléatoire',
    subtitle: `${picked.length} questions tirées au hasard parmi les ${allQuestions.length} disponibles`,
    description:
      'Un mélange de toutes les catégories : rotations, options offensives, placement, systèmes et lecture du jeu. Bonne chance.',
    category: 'Tactique',
    level: 'Avancé',
    estimatedTime: '~6 min',
    questions: picked,
  };
}

// Deterministic shuffle when a seed is provided (useful for reproducible
// random-mode replays). Without seed, uses Math.random().
function shuffleWithSeed<T>(input: T[], seed?: number): T[] {
  const arr = [...input];
  let state = seed ?? Math.floor(Math.random() * 2 ** 31);
  for (let i = arr.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

