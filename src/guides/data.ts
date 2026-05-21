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
    slug: 'service',
    title: 'Guide du service',
    subtitle: 'Cuillère, float, jump float et jump topspin',
    category: 'Technique',
    description: "Les 4 types de service avec biomécanique, étapes, erreurs fréquentes, exercices et zones tactiques.",
    readingTime: '~15 min',
    level: 'Débutant',
  },
  {
    slug: 'reception',
    title: 'Guide de la réception',
    subtitle: 'Manchette, plateforme, systèmes et lecture du service',
    category: 'Technique',
    description: "Technique de la plateforme, freeze au contact, déplacements, systèmes W/U et lecture du serveur.",
    readingTime: '~15 min',
    level: 'Débutant',
  },
  {
    slug: 'attaque',
    title: "Guide de l'attaque",
    subtitle: "Course d'approche, timing, tirs et postes",
    category: 'Technique',
    description: "Les 5 phases du smash, approche 3-4 pas, timing selon la passe, tirs spéciaux et erreurs.",
    readingTime: '~15 min',
    level: 'Intermédiaire',
  },
  {
    slug: 'contre',
    title: 'Guide du contre',
    subtitle: 'Timing, types de block et lecture du jeu',
    category: 'Technique',
    description: "Timing, types de contres, séquence visuelle élite, read vs commit blocking et exercices.",
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
  {
    slug: 'lecture-du-jeu',
    title: 'Lecture du jeu / scouting',
    subtitle: 'Lire serveur, passeur, attaquant — et scouter l\'adversaire',
    category: 'Tactique',
    description: "Séquence visuelle élite, indices au service / à la passe / à l'attaque, cadre IF/THEN, scouting pré-match et drills.",
    readingTime: '~20 min',
    level: 'Intermédiaire',
  },
];
