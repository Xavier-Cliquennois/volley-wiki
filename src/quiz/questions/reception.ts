import type { Question } from '../types';

// Quick test for the "Réception" guide: ready position, platform, footwork.
export const QUESTIONS_RECEPTION: Question[] = [
  {
    id: 'rc-q1',
    type: 'multiple-choice',
    prompt: 'En position d\'attente, que fais-tu de tes bras avant que le ballon n\'arrive ?',
    explanation:
      'Les bras restent dissociés (non joints), fléchis à hauteur de la taille. Les joindre trop tôt ralentit le déplacement et empêche le choix tardif entre manchette et mains.',
    options: [
      { id: 'joined', label: 'Je les joins déjà en plateforme' },
      { id: 'dissociated', label: 'Je les garde dissociés, fléchis à hauteur de la taille' },
      { id: 'down', label: 'Je les laisse pendre le long du corps' },
      { id: 'raised', label: 'Je les lève au-dessus de la tête' },
    ],
    correctId: 'dissociated',
  },
  {
    id: 'rc-q2',
    type: 'multiple-choice',
    prompt: 'Comment diriger le ballon vers ta cible en manchette ?',
    explanation:
      'Le ballon va où la plateforme regarde : l\'angle de la plateforme commande la direction. La plateforme est passive, ce sont les jambes qui sont actives : on ne balance pas les bras.',
    options: [
      { id: 'swing', label: 'En balançant fort les bras vers la cible' },
      { id: 'shoulders', label: 'En tournant seulement la tête vers la cible' },
      { id: 'platform', label: 'En orientant la plateforme vers la cible' },
      { id: 'wrists', label: 'En cassant les poignets au contact' },
    ],
    correctId: 'platform',
  },
  {
    id: 'rc-q3',
    type: 'multiple-choice',
    prompt: 'Le ballon passe au-dessus de toi, derrière. Que fais-tu ?',
    explanation:
      'On pivote le pied puis on se déplace en pas chassés vers l\'arrière (drop step). Courir en marche arrière fait perdre l\'équilibre. Si c\'est trop tard, on pivote et on crée une plateforme sur le côté.',
    options: [
      { id: 'backwards', label: 'Je cours à reculons le plus vite possible' },
      { id: 'jump', label: 'Je saute pour intercepter le ballon à deux mains' },
      { id: 'drop-step', label: 'Je pivote le pied puis je recule en pas chassés (drop step)' },
      { id: 'let-go', label: 'Je laisse le ballon, c\'est trop tard' },
    ],
    correctId: 'drop-step',
  },
];
