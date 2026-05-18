import type { AttackOption, SystemDef, Rotation, PlayerSlot } from '../types';

// 5v5 indoor — non-standard format, no FIVB rotation rules. We expose each
// variant as a single static formation (no 6 rotations) rather than inventing
// them. Players are placed using the same coordinate system as 6v6.

const ATTACK_TARGET = {
  outsideLeft: { x: 8, y: 6 },
  centre: { x: 50, y: 6 },
  outsideRight: { x: 92, y: 6 },
};

// 5v5 — 5-1 variant: penetrating setter from back-right.
// 3 front-row attackers + 2 back-row (setter + libero).
const SYSTEM_5V5_5_1_SLOTS: PlayerSlot[] = [
  { role: 'OH1', color: 'P4', servePosition: { x: 20, y: 22 }, receives: false },
  { role: 'MB1', color: 'P3', servePosition: { x: 50, y: 22 }, receives: false },
  { role: 'OPP', color: 'P1', servePosition: { x: 80, y: 22 }, receives: false },
  { role: 'L',   color: 'L',  servePosition: { x: 30, y: 75 }, receives: true },
  { role: 'S',   color: 'P2', servePosition: { x: 70, y: 75 }, receives: false },
];

const SYSTEM_5V5_5_1_ATTACKS: AttackOption[] = [
  { id: '5v5-5-1-quick', attacker: 'MB1', zone: 'C', label: 'Quick centre (1er tempo)', risk: 'low', tempo: 1, target: ATTACK_TARGET.centre },
  { id: '5v5-5-1-outside', attacker: 'OH1', zone: 'A', label: 'Aile gauche (P4)', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideLeft },
  { id: '5v5-5-1-opp', attacker: 'OPP', zone: 'B', label: 'Aile droite (Pointu)', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideRight },
];

const ROTATION_5V5_5_1: Rotation = {
  id: 'R1',
  setterAt: 'back',
  slots: SYSTEM_5V5_5_1_SLOTS,
  attacks: SYSTEM_5V5_5_1_ATTACKS,
  summary: '3 attaquants au filet + passeur arrière qui pénètre — le 5-1 condensé à 5 joueurs.',
  details: [
    {
      id: '5v5-5-1-beginner',
      requires: 'beginner',
      body:
        "Le passeur pénètre depuis l'arrière droite vers la cible (entre P2 et P3). 3 attaquants au filet : aile gauche, central, pointu en aile droite. Le libéro réceptionne et défend en arrière gauche. Configuration équivalente au R1 du 6v6 sans le central arrière.",
    },
    {
      id: '5v5-5-1-overlap',
      requires: 'intermediate',
      body:
        "Pas de règles d'overlap strictes en 5v5 (format non-FIVB), mais les principes s'appliquent : le passeur doit rester derrière les attaquants avant le service. Le libéro respecte la zone arrière (ne franchit pas la ligne d'attaque pour passer en chandelle).",
    },
    {
      id: '5v5-5-1-pen',
      requires: 'intermediate',
      body:
        "Pénétration du passeur : déclenche au contact du serveur adverse. Trajectoire courbe depuis la zone arrière droite vers la cible (~1 m du filet entre P2 et P3). Plus rapide qu'en 6v6 car la distance est plus courte.",
    },
    {
      id: '5v5-5-1-transitions',
      requires: 'advanced',
      body:
        "Couverture : le passeur recule en arrière droite après distribution. Le pointu et l'aile gauche descendent à la 3 m pour couvrir le contre adverse. Le central reste au filet pour le contre. La défense de fond repose entièrement sur le libéro — il doit couvrir une grande zone.",
    },
    {
      id: '5v5-5-1-signals',
      requires: 'advanced',
      body:
        "Options offensives : quick central, aile gauche, aile droite. Pas de pipe (le libéro ne peut pas attaquer au-dessus du filet en zone avant). Le passeur annonce le 1er tempo si la réception est nette, sinon balle haute en aile.",
    },
  ],
};

export const SYSTEM_5V5_5_1: SystemDef = {
  id: '5v5-5-1',
  title: '5v5 — 5-1 (3 avant)',
  tagline: 'Le 5-1 condensé à 5 joueurs : 3 attaquants + passeur pénétrant + libéro.',
  teamSize: 5,
  discipline: 'indoor',
  philosophy:
    "En 5v5, le format le plus offensif est la version simplifiée du 5-1 du 6v6. Un passeur unique pénètre depuis l'arrière, le libéro réceptionne et défend. 3 attaquants au filet en permanence. Idéal pour préparer la transition vers le 6v6 ou jouer en format compétition rapide.",
  recommendedLevel: 'intermediate',
  pros: [
    "3 attaquants au filet en permanence — pression offensive constante.",
    "Passeur unique : distribution stable.",
    "Bonne préparation au 6v6 (mêmes principes tactiques).",
  ],
  cons: [
    "Défense de fond limitée : le libéro couvre seul une grande zone.",
    "Pénétration sur chaque échange — exigeant physiquement pour le passeur.",
    "Pas de pipe (back-row attack interdite au libéro).",
  ],
  rotations: { R1: ROTATION_5V5_5_1 },
};

// 5v5 — 4-2 variant: 2 setters in opposition, front setter distributes.
// Static formation, 2 attackers at the net + 3 in back row.
const SYSTEM_5V5_4_2_SLOTS: PlayerSlot[] = [
  { role: 'OH1', color: 'P4', servePosition: { x: 20, y: 22 }, receives: false },
  { role: 'S',   color: 'P2', servePosition: { x: 50, y: 22 }, receives: false }, // front setter
  { role: 'MB1', color: 'P3', servePosition: { x: 80, y: 22 }, receives: false },
  { role: 'OH2', color: 'P5', servePosition: { x: 20, y: 75 }, receives: true },
  { role: 'S2',  color: 'P1', servePosition: { x: 80, y: 75 }, receives: true }, // back setter (defender)
];

const SYSTEM_5V5_4_2_ATTACKS: AttackOption[] = [
  { id: '5v5-4-2-quick', attacker: 'MB1', zone: 'C', label: 'Quick centre (1er tempo)', risk: 'low', tempo: 1, target: ATTACK_TARGET.centre },
  { id: '5v5-4-2-outside', attacker: 'OH1', zone: 'A', label: 'Aile gauche (P4)', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideLeft },
];

const ROTATION_5V5_4_2: Rotation = {
  id: 'R1',
  setterAt: 'front',
  slots: SYSTEM_5V5_4_2_SLOTS,
  attacks: SYSTEM_5V5_4_2_ATTACKS,
  summary: '2 passeurs en diagonale — le passeur avant distribue sans bouger. 2 attaquants.',
  details: [
    {
      id: '5v5-4-2-beginner',
      requires: 'beginner',
      body:
        "Le passeur avant prend la 2ᵉ touche au centre du filet et distribue. Pas de pénétration. 2 attaquants : aile gauche + central. Le 2e passeur reste arrière et joue défenseur. Le 3e joueur arrière (OH2) réceptionne et peut attaquer en transition arrière.",
    },
    {
      id: '5v5-4-2-overlap',
      requires: 'intermediate',
      body:
        "Pas de règles strictes en 5v5. Principes : les passeurs restent en diagonale (front + back). Le central avant ne doit pas dépasser le passeur avant côté droit.",
    },
    {
      id: '5v5-4-2-pen',
      requires: 'intermediate',
      body:
        "Pas de mouvement du passeur — il prend la balle sur place au filet. C'est l'avantage du 4-2 : aucune pénétration à organiser.",
    },
    {
      id: '5v5-4-2-transitions',
      requires: 'advanced',
      body:
        "Couverture après attaque : le passeur descend à la 3 m, le central reste au filet pour contrer. Le 2e passeur en P1 défend la diagonale courte droite. OH2 défend l'aile gauche profonde.",
    },
    {
      id: '5v5-4-2-signals',
      requires: 'advanced',
      body:
        "Options : quick MB1 si réception nette, aile gauche OH1 sinon. Pas de pipe. Distribution simple — convient pour des équipes débutantes ou des matchs avec rotation rapide.",
    },
  ],
};

export const SYSTEM_5V5_4_2: SystemDef = {
  id: '5v5-4-2',
  title: '5v5 — 4-2 (2 avant)',
  tagline: 'Version simple : 2 passeurs diagonale, distribution sur place, 2 attaquants.',
  teamSize: 5,
  discipline: 'indoor',
  philosophy:
    "Le 4-2 adapté au 5v5 : 2 passeurs diagonalement opposés, le passeur avant distribue toujours, le passeur arrière joue défenseur. Aucune pénétration. C'est la formation d'apprentissage en 5v5 — simple à comprendre, facile à exécuter.",
  recommendedLevel: 'beginner',
  pros: [
    "Aucune pénétration — système le plus simple.",
    "Distribution immédiate au filet, transition rapide vers l'attaque.",
    "Idéal pour l'apprentissage des bases.",
  ],
  cons: [
    "Seulement 2 attaquants — contre adverse anticipe facilement.",
    "1 joueur (le 2e passeur) ne participe pas à l'attaque.",
    "Configuration prévisible offensivement.",
  ],
  rotations: { R1: ROTATION_5V5_4_2 },
};
