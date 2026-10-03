import type { Question } from '../types';

// Quick test for the "Erreurs typiques" guide: common mistakes by position.
export const QUESTIONS_ERREURS_TYPIQUES: Question[] = [
  {
    id: 'et-q1',
    type: 'multiple-choice',
    prompt: 'Où le central contreur doit-il avoir les yeux pour lire le passeur adverse ?',
    explanation:
      'Sur les mains du passeur adverse, pas sur la balle : regarder la passe monter arrive trop tard pour bouger. On décide son contre avant la sortie du ballon, et on attend l\'engagement des mains du passeur avant de sauter en quick.',
    options: [
      { id: 'ball', label: 'Sur la balle' },
      { id: 'hands', label: 'Sur les mains du passeur adverse' },
      { id: 'referee', label: 'Sur l\'arbitre' },
      { id: 'floor', label: 'Sur le sol, pour rester prêt' },
    ],
    correctId: 'hands',
  },
  {
    id: 'et-q2',
    type: 'multiple-choice',
    prompt: 'Quelle est l\'erreur du pointu qui "admire son smash" ?',
    explanation:
      'Il ne se met pas en couverture : si le contre adverse renvoie la balle, personne n\'est là pour la défendre. Le réflexe à travailler est "j\'attaque PUIS je descends à la 3 m couvrir".',
    options: [
      { id: 'hit-out', label: 'Il frappe systématiquement hors du terrain' },
      { id: 'cover', label: 'Il ne descend pas couvrir son attaque à la 3 m' },
      { id: 'net', label: 'Il touche le filet à chaque attaque' },
      { id: 'serve', label: 'Il sert trop court' },
    ],
    correctId: 'cover',
  },
  {
    id: 'et-q3',
    type: 'multiple-choice',
    prompt: 'Laquelle de ces actions est interdite au libéro ?',
    explanation:
      'Le libéro ne peut PAS attaquer. Il reste en arrière de la ligne des 3 m pour les passes en suspension, et en réception il a la priorité : il doit appeler fort ("libéro", "moi") pour éviter les collisions.',
    options: [
      { id: 'attack', label: 'Attaquer' },
      { id: 'receive', label: 'Réceptionner le service' },
      { id: 'call', label: 'Appeler la balle à voix haute' },
      { id: 'dig', label: 'Défendre une attaque adverse' },
    ],
    correctId: 'attack',
  },
];
