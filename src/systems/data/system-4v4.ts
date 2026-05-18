import type { AttackOption, SystemDef, Rotation, PlayerSlot } from '../types';

// 4v4 indoor — no FIVB rotation rules. Each formation is exposed as a static
// snapshot. Players are placed on a 6v6 grid for visual consistency.

const ATTACK_TARGET = {
  outsideLeft: { x: 8, y: 6 },
  centre: { x: 50, y: 6 },
  outsideRight: { x: 92, y: 6 },
};

// ─── Diamant (the most common 4v4 formation) ────────────────────────────────
const DIAMANT_SLOTS: PlayerSlot[] = [
  { role: 'OH1', color: 'P4', servePosition: { x: 22, y: 38 }, receives: false }, // wing-left forward
  { role: 'S',   color: 'P2', servePosition: { x: 50, y: 22 }, receives: false }, // front-center setter
  { role: 'OH2', color: 'P5', servePosition: { x: 78, y: 38 }, receives: false }, // wing-right forward
  { role: 'L',   color: 'L',  servePosition: { x: 50, y: 75 }, receives: true  }, // back defender (de-facto libero)
];

const DIAMANT_ATTACKS: AttackOption[] = [
  { id: 'diamant-left', attacker: 'OH1', zone: 'A', label: 'Aile gauche (P4)', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideLeft },
  { id: 'diamant-right', attacker: 'OH2', zone: 'B', label: 'Aile droite (P2)', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideRight },
];

const DIAMANT_ROTATION: Rotation = {
  id: 'R1',
  setterAt: 'front',
  slots: DIAMANT_SLOTS,
  attacks: DIAMANT_ATTACKS,
  summary: '"Diamant" : passeur au centre, 2 ailes à mi-terrain, 1 défenseur arrière.',
  details: [
    {
      id: 'diamant-beginner',
      requires: 'beginner',
      body:
        "La formation la plus utilisée en 4v4 indoor. 1 passeur au filet centre, 2 ailes en milieu de terrain (P4 et P2 vers la ligne des 3 m), 1 défenseur arrière qui couvre tout le fond. Le passeur prend la 2ᵉ touche et distribue aux ailes — pas de pénétration.",
    },
    {
      id: 'diamant-defense',
      requires: 'intermediate',
      body:
        "Défense type : système A (1 contreur central + 3 défenseurs). Le passeur contre au filet, les 2 ailes descendent à la 3 m après l'attaque pour couvrir, le défenseur arrière reste en fond. Zone la plus vulnérable : la grande diagonale longue — manque de monde au fond.",
    },
    {
      id: 'diamant-transitions',
      requires: 'advanced',
      body:
        "Couverture après attaque : 1 attaquant couvre court (3 m derrière le frappeur), 2 joueurs au fond. Le passeur reste au filet pour contrer la 2ᵉ vague. Transition rapide vers la prochaine attaque — peu de mouvement à gérer.",
    },
    {
      id: 'diamant-signals',
      requires: 'advanced',
      body:
        "Options : aile gauche ou aile droite uniquement (pas de central, le passeur occupe la zone 3). Le passeur peut feinter aux deux côtés pour confondre le contre adverse. Possibilité de tip 2e touche du passeur si l'adversaire avance.",
    },
  ],
};

export const SYSTEM_4V4_DIAMANT: SystemDef = {
  id: '4v4-diamant',
  title: '4v4 — Diamant',
  tagline: 'La formation la plus utilisée — passeur centre, 2 ailes, 1 fond.',
  teamSize: 4,
  discipline: 'indoor',
  philosophy:
    "Le \"Diamant\" est la formation 4v4 indoor la plus jouée. Le passeur reste au filet centre, deux ailes occupent les positions P4 et P2 vers la ligne des 3 m, un défenseur unique couvre tout le fond. Simple à mettre en place, bonne couverture défensive courte, mais faible au fond du terrain.",
  recommendedLevel: 'beginner',
  pros: [
    "Le plus utilisé en 4v4 indoor — référence du format.",
    "Bonne couverture courte (passeur + 2 ailes à 3 m).",
    "Distribution stable, pas de pénétration.",
  ],
  cons: [
    "1 seul défenseur arrière — diagonale longue très vulnérable.",
    "Pas de quick central (zone 3 occupée par le passeur).",
    "Options offensives limitées à 2 ailes.",
  ],
  rotations: { R1: DIAMANT_ROTATION },
};

// ─── Box (2-2) ──────────────────────────────────────────────────────────────
const BOX_SLOTS: PlayerSlot[] = [
  { role: 'OH1', color: 'P4', servePosition: { x: 22, y: 22 }, receives: false },
  { role: 'OH2', color: 'P5', servePosition: { x: 78, y: 22 }, receives: false },
  { role: 'S',   color: 'P2', servePosition: { x: 22, y: 75 }, receives: true  }, // back-left defender (often the setter)
  { role: 'L',   color: 'L',  servePosition: { x: 78, y: 75 }, receives: true  },
];

const BOX_ATTACKS: AttackOption[] = [
  { id: 'box-left', attacker: 'OH1', zone: 'A', label: 'Aile gauche', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideLeft },
  { id: 'box-right', attacker: 'OH2', zone: 'B', label: 'Aile droite', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideRight },
];

const BOX_ROTATION: Rotation = {
  id: 'R1',
  setterAt: 'back',
  slots: BOX_SLOTS,
  attacks: BOX_ATTACKS,
  summary: '"Box" 2-2 : 2 attaquants au filet + 2 défenseurs arrière. Permet le bloc à 2.',
  details: [
    {
      id: 'box-beginner',
      requires: 'beginner',
      body:
        "2 joueurs au filet (P4 et P2) + 2 arrière (P5 et P1). Le passeur est souvent l'un des deux arrière qui pénètre depuis l'arrière gauche. Permet le bloc à 2 sur l'attaque adverse — utile contre des frappeurs puissants. Mais seulement 2 défenseurs au fond, le tip est mal couvert.",
    },
    {
      id: 'box-defense',
      requires: 'intermediate',
      body:
        "Défense type : système B (2 contreurs + 2 défenseurs). À utiliser uniquement contre des frappeurs puissants sans finesse. Les 2 ailes au filet contrent ensemble, les 2 arrière défendent les diagonales. Vulnérable aux feintes courtes.",
    },
    {
      id: 'box-transitions',
      requires: 'advanced',
      body:
        "Le passeur arrière pénètre depuis l'arrière gauche vers la cible (centre filet). Distance courte (plus rapide qu'en 6v6). Après distribution, retour à l'arrière gauche pour la défense.",
    },
    {
      id: 'box-signals',
      requires: 'advanced',
      body:
        "Options : aile gauche ou aile droite. Plus souvent joué en système A (un seul contreur, 3 défenseurs) qu'en système B — sauf besoin spécifique d'un double contre.",
    },
  ],
};

export const SYSTEM_4V4_BOX: SystemDef = {
  id: '4v4-box',
  title: '4v4 — Box',
  tagline: '2 au filet + 2 arrière — pour bloc à 2 contre des attaques puissantes.',
  teamSize: 4,
  discipline: 'indoor',
  philosophy:
    "La \"Box\" place 2 joueurs au filet et 2 arrière, formant un carré. Permet le bloc à 2 sur l'attaque adverse — utile contre des frappeurs très puissants. Mais avec seulement 2 défenseurs au fond, c'est plus risqué que le Diamant.",
  recommendedLevel: 'intermediate',
  pros: [
    "Bloc à 2 possible — défense efficace contre les puncheurs.",
    "2 attaquants au filet directement disponibles.",
    "Configuration symétrique facile à mémoriser.",
  ],
  cons: [
    "Seulement 2 défenseurs au fond — tip non couvert.",
    "Pas de couverture courte centrale.",
    "Demande des joueurs polyvalents en attaque et en défense.",
  ],
  rotations: { R1: BOX_ROTATION },
};

// ─── Ligne 3-1 (penetrating setter) ─────────────────────────────────────────
const LIGNE_SLOTS: PlayerSlot[] = [
  { role: 'OH1', color: 'P4', servePosition: { x: 22, y: 22 }, receives: false },
  { role: 'MB1', color: 'P3', servePosition: { x: 50, y: 22 }, receives: false },
  { role: 'OPP', color: 'P1', servePosition: { x: 78, y: 22 }, receives: false },
  { role: 'S',   color: 'P2', servePosition: { x: 78, y: 75 }, receives: false }, // back-right penetrating setter
];

const LIGNE_ATTACKS: AttackOption[] = [
  { id: 'ligne-quick', attacker: 'MB1', zone: 'C', label: 'Quick centre (1er tempo)', risk: 'low', tempo: 1, target: ATTACK_TARGET.centre },
  { id: 'ligne-left', attacker: 'OH1', zone: 'A', label: 'Aile gauche', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideLeft },
  { id: 'ligne-right', attacker: 'OPP', zone: 'B', label: 'Aile droite', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideRight },
];

const LIGNE_ROTATION: Rotation = {
  id: 'R1',
  setterAt: 'back',
  slots: LIGNE_SLOTS,
  attacks: LIGNE_ATTACKS,
  summary: '"Ligne 3-1" : 3 attaquants au filet + passeur pénétrant — équivalent simplifié du 5-1.',
  details: [
    {
      id: 'ligne-beginner',
      requires: 'beginner',
      body:
        "Le passeur unique en arrière droite (P1) pénètre dès la frappe vers la zone 2. Cela libère 3 attaquants devant : aile gauche, central, aile droite (souvent un pointu). Équivalent simplifié du 5-1 du 6v6 — exigeant pour la réception et la rapidité du passeur, mais le plus offensif des 3 systèmes 4v4.",
    },
    {
      id: 'ligne-defense',
      requires: 'intermediate',
      body:
        "Défense type : système A (1 contreur central + 3 défenseurs). Le central reste au filet pour contrer, les 2 ailes descendent à la 3 m, le passeur récupère sa position arrière droite pour défendre la diagonale courte.",
    },
    {
      id: 'ligne-transitions',
      requires: 'advanced',
      body:
        "Pénétration courte mais critique : si la réception est molle, le passeur arrive en retard et un autre joueur doit prendre la 2ᵉ touche. Système exigeant techniquement — réservé aux équipes avec un bon passeur.",
    },
    {
      id: 'ligne-signals',
      requires: 'advanced',
      body:
        "Options : quick central (1er tempo), aile gauche, aile droite. Pas de pipe (pas de joueur arrière disponible). Distribution sur 3 angles — le contre adverse a du mal à anticiper.",
    },
  ],
};

export const SYSTEM_4V4_LIGNE: SystemDef = {
  id: '4v4-ligne',
  title: '4v4 — Ligne 3-1',
  tagline: '3 attaquants au filet + passeur pénétrant — la plus offensive du 4v4.',
  teamSize: 4,
  discipline: 'indoor',
  philosophy:
    "La \"Ligne 3-1\" reprend le principe du 5-1 du 6v6 : passeur unique arrière qui pénètre, 3 attaquants au filet. C'est la formation 4v4 la plus offensive — mais elle exige une réception très propre et un passeur rapide. Idéal comme transition vers le 6v6.",
  recommendedLevel: 'advanced',
  pros: [
    "3 attaquants au filet — pression offensive constante.",
    "Quick central disponible (1er tempo).",
    "Préparation idéale au 6v6.",
  ],
  cons: [
    "Exige une bonne réception et un passeur rapide.",
    "1 seul défenseur après pénétration (le passeur).",
    "Trop complexe pour des débutants.",
  ],
  rotations: { R1: LIGNE_ROTATION },
};
