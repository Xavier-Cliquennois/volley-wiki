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
    slug: 'techniques-de-base',
    title: 'Techniques de base',
    subtitle: 'Fiches techniques fondamentales — points clés, erreurs, vidéos',
    category: 'Technique',
    description: "Catalogue des gestes fondamentaux du volleyball : manchette, passe, smash, contre, service, défense. Fiches filtrables par catégorie et niveau, avec vidéos.",
    readingTime: '~10 min',
    level: 'Débutant',
  },
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
    slug: 'passe-setter',
    title: 'Guide du passeur',
    subtitle: 'Triangle des mains, footwork et décisions de distribution',
    category: 'Technique',
    description: "Forme des mains, transferts de poids, lecture du bloc et choix de distribution selon la qualité de réception. Drills inclus.",
    readingTime: '~10 min',
    level: 'Intermédiaire',
  },
  {
    slug: 'jeu-collectif',
    title: 'Jeu collectif et transitions',
    subtitle: "Side-out, couverture, transitions et communication",
    category: 'Tactique',
    description: "Les 3 phases du jeu, triangle de couverture, vocabulaire et drills collectifs (pepper, wash, queen of the court).",
    readingTime: '~10 min',
    level: 'Intermédiaire',
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
  {
    slug: 'indoor-vs-beach',
    title: 'Indoor ↔ Beach',
    subtitle: 'Différences, adaptations techniques et tactiques entre les deux disciplines',
    category: 'Tactique',
    description: "Tableau comparatif des règles, adaptations skill par skill, préparation physique, quand passer de l'un à l'autre, pièges typiques et drills.",
    readingTime: '~15 min',
    level: 'Intermédiaire',
  },
  {
    slug: 'signaux-arbitre',
    title: "Signaux d'arbitre",
    subtitle: 'Les 15 signaux FIVB à connaître pour comprendre les décisions',
    category: 'Technique',
    description: "Pictogrammes + descriptions des 15 signaux les plus fréquents : point, ball in/out, faute filet, double, balle tenue, rotation, attaque arrière, etc.",
    readingTime: '~5 min',
    level: 'Débutant',
  },
  {
    slug: 'erreurs-typiques',
    title: 'Erreurs typiques par poste',
    subtitle: 'Les 4 pièges les plus fréquents pour chaque rôle — et comment les corriger',
    category: 'Technique',
    description: "Passeur, pointu, central, aile, libéro : pour chaque poste, 4 erreurs récurrentes avec la solution corrective à drillder.",
    readingTime: '~10 min',
    level: 'Débutant',
  },
];
