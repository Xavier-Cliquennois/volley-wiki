import type { Question } from '../types';

// Quick test for the "Jeu collectif" guide: phases, coverage, communication.
export const QUESTIONS_JEU_COLLECTIF: Question[] = [
  {
    id: 'jc-q1',
    type: 'multiple-choice',
    prompt: 'Quelle phase du jeu collectif est la plus difficile ?',
    explanation:
      'La transition : tous les joueurs sont déjà mobilisés ailleurs. Le passeur doit anticiper sa course vers le filet dès la défense, et les attaquants reprennent leur course d\'approche depuis n\'importe quelle position.',
    options: [
      { id: 'side-out', label: 'Le side-out (réception, passe, attaque)' },
      { id: 'transition', label: 'La transition' },
      { id: 'service', label: 'Le service' },
      { id: 'timeout', label: 'Le temps mort' },
    ],
    correctId: 'transition',
  },
  {
    id: 'jc-q2',
    type: 'multiple-choice',
    prompt: 'À quelle distance de l\'attaquant se place la couverture ?',
    explanation:
      'Environ 2 m : la zone d\'or. Trop près, le ballon survole les joueurs ; trop loin, il n\'y a pas le temps de défendre. La couverture se joue bas, plateforme prête, car le ballon renvoyé par le bloc arrive vite et bas.',
    options: [
      { id: 'one', label: 'Collée à lui, à moins de 50 cm' },
      { id: 'five', label: 'Environ 5 m' },
      { id: 'two', label: 'Environ 2 m' },
      { id: 'back', label: 'Au fond du terrain' },
    ],
    correctId: 'two',
  },
  {
    id: 'jc-q3',
    type: 'multiple-choice',
    prompt: 'Deux joueurs se dirigent vers la même balle en réception. Que doit-il se passer ?',
    explanation:
      'Le premier à crier "Mine !" prend la balle. Il n\'y a pas de double cri sur la même balle : la communication continue évite les collisions et les balles qui tombent entre deux joueurs.',
    options: [
      { id: 'both', label: 'Les deux la jouent, le meilleur gagne' },
      { id: 'silent', label: 'Personne ne parle pour ne pas gêner' },
      { id: 'first-call', label: 'Le premier qui crie "Mine !" prend la balle' },
      { id: 'closest-net', label: 'Le plus proche du filet prend toujours la balle' },
    ],
    correctId: 'first-call',
  },
];
