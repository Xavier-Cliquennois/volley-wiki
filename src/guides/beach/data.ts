export type BeachGuide = {
  slug: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
};

export const BEACH_GUIDES: BeachGuide[] = [
  { slug: 'debutant', level: 'Débutant' },
  { slug: 'transition', level: 'Intermédiaire' },
  { slug: 'tournoi-loisir', level: 'Intermédiaire' },
  { slug: 'lecture-jeu', level: 'Avancé' },
];
