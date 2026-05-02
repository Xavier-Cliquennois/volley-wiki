export type Guide = {
  slug: string;
  title: string;
  subtitle: string;
  category: 'Technique' | 'Tactique';
  description: string;
  readingTime: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
};

export const GUIDES: Guide[] = [
  {
    slug: 'contre',
    title: 'Guide du contre',
    subtitle: 'Maîtriser le timing et la technique du block',
    category: 'Technique',
    description: "Timing, types de contres, technique de saut et exercices pour maîtriser le block.",
    readingTime: '~10 min',
    level: 'Intermédiaire',
  },
  {
    slug: 'positionnement-defense',
    title: 'Positionnement défensif',
    subtitle: 'Se placer selon son poste et la situation',
    category: 'Tactique',
    description: "Zones de responsabilité, positionnement par zone d'attaque adverse, systèmes et communication.",
    readingTime: '~20 min',
    level: 'Intermédiaire',
  },
];
