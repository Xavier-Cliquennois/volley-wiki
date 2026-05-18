import type { AttackOption, SystemDef, Rotation, PlayerSlot } from '../types';

// Beach 2v2 — no rotation rules (just service order). The system is a static
// formation: 2 players sharing the court left/right for reception, then
// switching to "blocker / defender" roles on the opponent's attack.

const ATTACK_TARGET = {
  outsideLeft: { x: 18, y: 6 },
  outsideRight: { x: 82, y: 6 },
};

// Reception formation: 2 players side-by-side, splitting the court in half.
// Player 1 covers the left half (and will attack from the left antenna).
// Player 2 covers the right half (and will attack from the right antenna).
const BEACH_SLOTS: PlayerSlot[] = [
  { role: 'B1', color: 'P4', servePosition: { x: 30, y: 55 }, receives: true },
  { role: 'B2', color: 'P5', servePosition: { x: 70, y: 55 }, receives: true },
];

const BEACH_ATTACKS: AttackOption[] = [
  { id: 'beach-left', attacker: 'B1', zone: 'A', label: 'Aile gauche', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideLeft },
  { id: 'beach-right', attacker: 'B2', zone: 'B', label: 'Aile droite', risk: 'medium', tempo: 2, target: ATTACK_TARGET.outsideRight },
];

const BEACH_ROTATION: Rotation = {
  id: 'R1',
  setterAt: 'back',
  slots: BEACH_SLOTS,
  attacks: BEACH_ATTACKS,
  summary: '2 joueurs côte à côte en réception — chacun couvre sa moitié du terrain.',
  details: [
    {
      id: 'beach-beginner',
      requires: 'beginner',
      body:
        "En beach 2v2, les 2 joueurs partagent le terrain en deux : le joueur gauche couvre la moitié gauche, le joueur droit la moitié droite. Quand l'un reçoit le service, l'autre prend la 2ᵉ touche (passe) puis attaque. Après chaque échange, ils peuvent \"switcher\" (changer de côté) selon le bon angle d'attaque.",
    },
    {
      id: 'beach-blocker',
      requires: 'intermediate',
      body:
        "Sur l'attaque adverse : un joueur monte contrer au filet (le \"blocker\"), l'autre recule défendre le tip et les balles longues (le \"defender\"). Les rôles peuvent s'inverser à chaque échange — le blocker signale dans son dos quel côté il va contrer (ligne ou diagonale).",
    },
    {
      id: 'beach-switch',
      requires: 'intermediate',
      body:
        "Le \"switch\" : après le service, les joueurs s'échangent leurs positions pour avoir le bon angle d'attaque (un droitier attaque mieux à gauche du filet, un gaucher à droite). Le switch se fait dès que la balle est en jeu — chaque équipe a sa convention de mouvement.",
    },
    {
      id: 'beach-defense',
      requires: 'advanced',
      body:
        "Systèmes défensifs : (1) \"angle\" — le défenseur couvre la diagonale, le bloc couvre la ligne ; (2) \"line\" — le défenseur couvre la ligne, le bloc couvre la diagonale ; (3) \"no block\" — le blocker descend défendre, formation à 2 défenseurs profonds. Le choix dépend du frappeur adverse et du vent.",
    },
    {
      id: 'beach-signals',
      requires: 'advanced',
      body:
        "Signaux derrière le dos : main ouverte = bloc diagonale ; poing fermé = bloc ligne ; doigts tendus = no block. Communiqués AVANT le service par le contreur, lisibles par son partenaire (défenseur) qui adapte sa position. En conditions de vent fort, signaux verbaux complémentaires.",
    },
  ],
};

export const SYSTEM_BEACH: SystemDef = {
  id: 'beach-classic',
  title: 'Beach 2v2 — Système classique',
  tagline: 'Côte à côte en réception, blocker/defender sur attaque adverse.',
  teamSize: 2,
  discipline: 'beach',
  philosophy:
    "En beach volley, il n'y a pas de rotation FIVB ni de \"système\" au sens indoor. Les 2 joueurs partagent le terrain par moitiés en réception, puis basculent en rôles dynamiques (un contre au filet, l'autre défend en arrière) selon l'attaque adverse. Le \"switch\" permet à chacun d'attaquer de son meilleur côté.",
  recommendedLevel: 'beginner',
  pros: [
    "Couverture équilibrée du terrain en réception.",
    "Rôles flexibles : chaque joueur passe, attaque, contre et défend.",
    "Pas de complexité de rotation — apprentissage rapide des bases.",
  ],
  cons: [
    "Pas de spécialisation — chaque joueur doit tout savoir faire.",
    "La fatigue affecte directement la performance (pas de remplacement).",
    "Communication permanente nécessaire (signaux, switch, défense).",
  ],
  rotations: { R1: BEACH_ROTATION },
};
