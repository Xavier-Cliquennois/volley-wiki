import type { Question } from '../types';

// Quick test for the "Indoor vs beach" guide: rules and skill adaptations.
export const QUESTIONS_INDOOR_BEACH: Question[] = [
  {
    id: 'ib-q1',
    type: 'multiple-choice',
    prompt: 'Au beach, le contre compte-t-il comme une touche ?',
    explanation:
      'Oui : au beach, le contre est une touche, il ne reste donc que 2 touches à l\'équipe. En indoor, le contre ne compte pas et il reste 3 touches.',
    options: [
      { id: 'no', label: 'Non, comme en indoor' },
      { id: 'yes', label: 'Oui, il ne reste que 2 touches' },
      { id: 'only-first', label: 'Seulement le premier contre du point' },
      { id: 'no-block', label: 'Il n\'y a pas de contre au beach' },
    ],
    correctId: 'yes',
  },
  {
    id: 'ib-q2',
    type: 'multiple-choice',
    prompt: 'Quel coup d\'attaque indoor est interdit au beach quand il est joué du bout des doigts ?',
    explanation:
      'Le tip aux doigts est interdit au beach (poing, paume ou doigts verrouillés seulement). On le remplace par le cut shot, le poke (jointures) ou le roll shot, et il faut diversifier les tirs plutôt que de compter sur la seule puissance.',
    options: [
      { id: 'smash', label: 'Le smash' },
      { id: 'quick', label: 'Le quick' },
      { id: 'tip', label: 'Le tip du bout des doigts' },
      { id: 'serve', label: 'Le service flottant' },
    ],
    correctId: 'tip',
  },
  {
    id: 'ib-q3',
    type: 'multiple-choice',
    prompt: 'Combien de joueurs par équipe au beach, et à quel rythme change-t-on de côté ?',
    explanation:
      'Le beach se joue à 2 par équipe, sans rotation ni remplacement, avec un changement de côté tous les 7 points (5 en tie-break) pour égaliser vent et soleil.',
    options: [
      { id: 'six', label: '6 joueurs, aucun changement de côté pendant le set' },
      { id: 'four', label: '4 joueurs, changement de côté à chaque point' },
      { id: 'two-set', label: '2 joueurs, changement de côté à chaque set uniquement' },
      { id: 'two-seven', label: '2 joueurs, changement de côté tous les 7 points' },
    ],
    correctId: 'two-seven',
  },
];
