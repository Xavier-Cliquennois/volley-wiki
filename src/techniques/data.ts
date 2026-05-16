import type { Discipline } from '../discipline/useDiscipline';

export type TechniqueLevel = 'Débutant' | 'Intermédiaire' | 'Avancé';

export type TechniqueTag =
  | 'Service'
  | 'Réception'
  | 'Passe'
  | 'Attaque'
  | 'Défense'
  | 'Communication'
  | 'Débutant'
  | 'Intermédiaire'
  | 'Avancé';

export type Technique = {
  id: string;
  icon: string;
  level: TechniqueLevel;
  tags: TechniqueTag[];
  discipline: Discipline[];
  videos: { title: string; url: string }[];
};

export const CATEGORY_TAGS_INDOOR: TechniqueTag[] = [
  'Service',
  'Réception',
  'Passe',
  'Attaque',
  'Défense',
];

export const CATEGORY_TAGS_BEACH: TechniqueTag[] = [
  'Service',
  'Réception',
  'Passe',
  'Attaque',
  'Défense',
  'Communication',
];

export const LEVEL_TAGS: TechniqueTag[] = ['Débutant', 'Intermédiaire', 'Avancé'];

export const TECHNIQUES_INDOOR: Technique[] = [
  {
    id: 'reception',
    icon: '🤲',
    level: 'Débutant',
    tags: ['Réception', 'Défense', 'Débutant'],
    discipline: ['indoor'],
    videos: [
      { title: 'Faire une manchette (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
      { title: 'La manchette (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
    ],
  },
  {
    id: 'set',
    icon: '🙌',
    level: 'Débutant',
    tags: ['Passe', 'Débutant'],
    discipline: ['indoor'],
    videos: [
      { title: 'Faire une passe à 10 doigts (Sikana)', url: 'https://www.youtube.com/watch?v=lEaaaxPJ1cQ' },
      { title: 'Exercice passe courte placée (Sikana)', url: 'https://www.youtube.com/watch?v=OERUFSUmFS4' },
    ],
  },
  {
    id: 'spike',
    icon: '✊',
    level: 'Intermédiaire',
    tags: ['Attaque', 'Intermédiaire'],
    discipline: ['indoor'],
    videos: [
      { title: 'Comment attaquer — 3 étapes (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
      { title: 'Le smash au volleyball (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
    ],
  },
  {
    id: 'block',
    icon: '🛡️',
    level: 'Intermédiaire',
    tags: ['Défense', 'Intermédiaire'],
    discipline: ['indoor'],
    videos: [
      { title: 'Apprendre le contre (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
      { title: 'Le bloc (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
    ],
  },
  {
    id: 'serve',
    icon: '🏐',
    level: 'Débutant',
    tags: ['Service', 'Débutant'],
    discipline: ['indoor'],
    videos: [
      { title: 'Servir flottant en 4 minutes', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'Service : flottant + tennis (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
  },
  {
    id: 'defense',
    icon: '🦅',
    level: 'Intermédiaire',
    tags: ['Défense', 'Intermédiaire'],
    discipline: ['indoor'],
    videos: [
      { title: 'Apprendre à défendre (Sikana)', url: 'https://www.youtube.com/watch?v=i0Io4-jeuyQ' },
      { title: 'Comment plonger au volleyball', url: 'https://www.youtube.com/watch?v=okxb3N03UWM' },
    ],
  },
];

export const TECHNIQUES_BEACH: Technique[] = [
  {
    id: 'manchette-beach',
    icon: '🤲',
    level: 'Débutant',
    tags: ['Réception', 'Défense', 'Débutant'],
    discipline: ['beach'],
    videos: [
      { title: 'HOW TO PASS AND HIT IN BEACH VOLLEYBALL — FOR BEGINNERS (Better at Beach)', url: 'https://www.youtube.com/watch?v=8U-A7y50dYQ' },
      { title: 'Beach Volleyball PASSING Technique (Chaim Schalk)', url: 'https://www.youtube.com/watch?v=YRiMhJ7BUcM' },
    ],
  },
  {
    id: 'passe-haute-beach',
    icon: '🙌',
    level: 'Intermédiaire',
    tags: ['Passe', 'Intermédiaire'],
    discipline: ['beach'],
    videos: [
      { title: 'HAND SETTING MECHANICS (Better at Beach)', url: 'https://www.youtube.com/watch?v=QXM4Mm4_3uY' },
      { title: 'TOP 5 HAND SETTING TIPS (Casey Patterson)', url: 'https://www.youtube.com/watch?v=M61cOZFl_aI' },
    ],
  },
  {
    id: 'poke',
    icon: '☝️',
    level: 'Intermédiaire',
    tags: ['Attaque', 'Intermédiaire'],
    discipline: ['beach'],
    videos: [
      { title: 'How To Do A Beach Volleyball Pokey (Sarah Pavan)', url: 'https://www.youtube.com/watch?v=z-32XIfzABk' },
      { title: 'How to Do a Pokey (Howcast)', url: 'https://www.youtube.com/watch?v=4or2CPEdOLk' },
    ],
  },
  {
    id: 'cobra',
    icon: '🐍',
    level: 'Avancé',
    tags: ['Attaque', 'Avancé'],
    discipline: ['beach'],
    videos: [
      { title: 'What is a "COBRA" 🐍 in beach volleyball?', url: 'https://www.youtube.com/watch?v=X5V7gqK4g8o' },
    ],
  },
  {
    id: 'tomahawk',
    icon: '🪓',
    level: 'Intermédiaire',
    tags: ['Défense', 'Intermédiaire'],
    discipline: ['beach'],
    videos: [
      { title: 'Beach Volleyball Tomahawk | Tip of the Week (SR1)', url: 'https://www.youtube.com/watch?v=yZ8AzONa8gU' },
      { title: 'A Better Way To Tomahawk (Better at Beach)', url: 'https://www.youtube.com/watch?v=PjSOWAeLtUE' },
    ],
  },
  {
    id: 'beach-dig',
    icon: '🛡️',
    level: 'Intermédiaire',
    tags: ['Défense', 'Intermédiaire'],
    discipline: ['beach'],
    videos: [
      { title: 'Beach Volleyball DEFENSE Explained (McKibbin Brothers)', url: 'https://www.youtube.com/watch?v=Ivocui43zoQ' },
      { title: 'How to Play Defense Behind the Block', url: 'https://www.youtube.com/watch?v=cbg3rg_MTT0' },
    ],
  },
  {
    id: 'sprawl',
    icon: '🤸',
    level: 'Avancé',
    tags: ['Défense', 'Avancé'],
    discipline: ['beach'],
    videos: [
      { title: 'Side Sprawl Defense', url: 'https://www.youtube.com/watch?v=_eqa2nmo6kA' },
    ],
  },
  {
    id: 'topspin-drive',
    icon: '🎯',
    level: 'Intermédiaire',
    tags: ['Attaque', 'Intermédiaire'],
    discipline: ['beach'],
    videos: [
      { title: 'Match Analysis | Strategy, Tactics (Better at Beach)', url: 'https://www.youtube.com/watch?v=1X_38u8ing8' },
    ],
  },
  {
    id: 'cut-shot',
    icon: '✂️',
    level: 'Intermédiaire',
    tags: ['Attaque', 'Intermédiaire'],
    discipline: ['beach'],
    videos: [
      { title: 'The Secrets to a PERFECT Volleyball Cut Shot (Better at Beach)', url: 'https://www.youtube.com/watch?v=2m0-KM22IDM' },
      { title: 'How to Master a Cut Shot in 4 SIMPLE Steps', url: 'https://www.youtube.com/watch?v=FzVni2adXUQ' },
    ],
  },
  {
    id: 'line-shot',
    icon: '📐',
    level: 'Intermédiaire',
    tags: ['Attaque', 'Intermédiaire'],
    discipline: ['beach'],
    videos: [
      { title: 'How to Defend the High Line and Cut Shots', url: 'https://www.youtube.com/watch?v=avCD4JnaDpY' },
    ],
  },
  {
    id: 'skyball',
    icon: '☁️',
    level: 'Avancé',
    tags: ['Service', 'Avancé'],
    discipline: ['beach'],
    videos: [
      { title: 'The COOLEST Volleyball Serve EVER! (How to Serve a Skyball)', url: 'https://www.youtube.com/watch?v=VyzXcYoquNU' },
      { title: 'Best of Adrian Carambula 🇮🇹 MR. SKYBALL!', url: 'https://www.youtube.com/watch?v=j72CQD9imSY' },
    ],
  },
  {
    id: 'float-serve-beach',
    icon: '🏐',
    level: 'Débutant',
    tags: ['Service', 'Débutant'],
    discipline: ['beach'],
    videos: [
      { title: 'ULTIMATE Guide to Effective Float & Jump Float Serve', url: 'https://www.youtube.com/watch?v=0AZNruT0enw' },
    ],
  },
  {
    id: 'jump-float-beach',
    icon: '🚀',
    level: 'Intermédiaire',
    tags: ['Service', 'Intermédiaire'],
    discipline: ['beach'],
    videos: [
      { title: 'How To JUMP FLOAT SERVE', url: 'https://www.youtube.com/watch?v=TX8a7nWlbiw' },
    ],
  },
  {
    id: 'signaux-mains',
    icon: '✋',
    level: 'Avancé',
    tags: ['Communication', 'Avancé'],
    discipline: ['beach'],
    videos: [
      { title: 'Beach Volleyball Hand Signals Explained (Sarah Pavan)', url: 'https://www.youtube.com/watch?v=rzEZAs_rrVE' },
      { title: 'Beach Volleyball Hand Signals Explained By A Pro! (Tri Bourne)', url: 'https://www.youtube.com/watch?v=26PwKyJRUwo' },
    ],
  },
  {
    id: 'peel-drop',
    icon: '↩️',
    level: 'Avancé',
    tags: ['Défense', 'Avancé'],
    discipline: ['beach'],
    videos: [
      { title: 'Peel Footwork for Blockers (Better at Beach)', url: 'https://www.youtube.com/watch?v=Qlwghcenoyo' },
      { title: 'How and When to Drop (McKibbin Brothers)', url: 'https://www.youtube.com/watch?v=RbNldGLpbVw' },
    ],
  },
];
