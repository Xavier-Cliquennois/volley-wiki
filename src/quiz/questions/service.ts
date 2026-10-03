import type { Question } from '../types';

// Quick test for the "Service" guide. Pure multiple-choice questions whose
// answers come from the guide content (toss, float physics, target zones).
export const QUESTIONS_SERVICE: Question[] = [
  {
    id: 'sv-q1',
    type: 'multiple-choice',
    prompt: 'Ton service est irrégulier. Que dois-tu stabiliser en priorité ?',
    explanation:
      'Environ 80 % des erreurs au service viennent du lancer (toss). On stabilise le lancer avant de chercher la puissance : la régularité prime sur la force.',
    options: [
      { id: 'power', label: 'La puissance de frappe' },
      { id: 'toss', label: 'Le lancer de balle (toss)' },
      { id: 'run-up', label: 'La longueur de la course d\'élan' },
      { id: 'spin', label: 'L\'effet de rotation du ballon' },
    ],
    correctId: 'toss',
  },
  {
    id: 'sv-q2',
    type: 'multiple-choice',
    prompt: 'Pourquoi la trajectoire d\'un service flottant est-elle imprévisible ?',
    explanation:
      'Sans rotation, le ballon crée des tourbillons asymétriques à une vitesse critique (~12-13 m/s). Ils génèrent des forces latérales aléatoires : c\'est l\'effet "knuckleball". C\'est le service à maîtriser en priorité.',
    options: [
      { id: 'topspin', label: 'Parce qu\'il tourne très vite sur lui-même' },
      { id: 'knuckleball', label: 'Parce qu\'il est frappé sans rotation, ce qui crée des forces latérales aléatoires' },
      { id: 'height', label: 'Parce qu\'il est frappé le plus haut possible' },
      { id: 'speed', label: 'Parce qu\'il est toujours frappé à pleine vitesse' },
    ],
    correctId: 'knuckleball',
  },
  {
    id: 'sv-q3',
    type: 'multiple-choice',
    prompt: 'Contre une équipe en 5-1, quelle cible bloque la sortie du passeur ?',
    explanation:
      'Servir en zone 1 (arrière droit) gêne la sortie du passeur en système 5-1. Viser l\'espace entre deux réceptionneurs (les seams) reste aussi plus efficace que viser un joueur.',
    options: [
      { id: 'zone-5', label: 'La zone 5 (arrière gauche profond)' },
      { id: 'zone-1', label: 'La zone 1 (arrière droit)' },
      { id: 'zone-6', label: 'La zone 6 (arrière centre profond)' },
      { id: 'zone-4', label: 'La zone 4 (avant gauche court)' },
    ],
    correctId: 'zone-1',
  },
];
