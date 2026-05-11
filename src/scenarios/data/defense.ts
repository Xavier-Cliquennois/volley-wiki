import type { Scenario } from '../types';
import { COLORS, opponentAttacker } from './_shared';

// Scenario D1 — 6v6 defense vs opponent zone 4 attack (block à 2 + perimeter defense)
// Convention FIVB : attaque adverse Z4 (sa gauche) → balle arrive sur NOTRE coin avant-droit.
// Système : 5-1, passeur en P1 (rotation arrière). Bloc à 2 = OPP (P2) ligne + central (P3) diagonale.
// Système défensif appliqué : périmétrique (2-0-4), libéro Z5 en grande diagonale longue.
const DEFENSE_VS_Z4: Scenario = {
  id: '6v6-defense-vs-z4',
  title: 'Défense · attaque adverse Z4',
  shortDescription: 'Bloc à 2 sur attaque adverse depuis la zone 4 (ailier gauche adverse → arrive sur notre droite) en défense périmétrique.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · P1 passeur arrière · Bloc à 2 · Périmétrique',
  },
  defaultCamera: 'DEFAULT',
  players: [
    // Notre équipe — positions de départ "neutres" (ligne de service / ready),
    // les déplacements défensifs viennent ensuite dans la timeline.
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 6.5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 1.2] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 1.2] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.2] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 4] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [0, 0, 4.5] },
    // Adversaires : attaquant Z4 (recule pour la course d'élan) + passeur (penetrera) + réceptionneur (origine du ballon)
    { id: 'OPP', label: 'Attaquant adv. Z4', role: 'opponent', color: COLORS.opponent, position: [3.2, 0, -3] },
    { id: 'OPP_S', label: 'Passeur adverse', role: 'opponent', color: COLORS.opponent, position: [-2.5, 0, -2] },
    { id: 'OPP_R', label: 'Réceptionneur adv.', role: 'opponent', color: COLORS.opponent, position: [0, 0, -3.2] },
  ],
  initialBallPosition: [0, 1.0, -3.2],
  timeline: [
    // ── Phase 0 : le réceptionneur adverse vient de toucher (BUMP) ──
    { type: 'player_pose', time: 0, id: 'OPP_R', pose: 'BUMP', duration: 0.2 },
    // ── Phase 1 : ballon part vers le passeur en pénétration ──
    { type: 'player_move', time: 0, id: 'OPP_S', to: [-1.8, 0, -0.8], duration: 0.4 },
    { type: 'ball_move', time: 0, from: [0, 1.0, -3.2], to: [-1.8, 1.8, -0.8], duration: 0.4, arc: 2.5 },
    { type: 'player_pose', time: 0.1, id: 'L', pose: 'READY', duration: 0.3 },
    { type: 'player_pose', time: 0.1, id: 'R4b', pose: 'READY', duration: 0.3 },
    { type: 'player_pose', time: 0.1, id: 'P', pose: 'READY', duration: 0.3 },
    { type: 'player_pose', time: 0.1, id: 'R4', pose: 'READY', duration: 0.3 },

    // ── Phase 2 : passe haute en Z4 + glissement défensif ──
    { type: 'player_pose', time: 0.4, id: 'OPP_S', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 0.4, from: [-1.8, 1.8, -0.8], to: [3.2, 3.0, -0.8], duration: 0.6, arc: 4.0 },
    { type: 'player_move', time: 0.4, id: 'OPP', to: [3.2, 0, -1.5], duration: 0.4 },
    // Bloc à 2 : Op (P2 = pointu/OPP) contreur ligne, C (P3 = central) ferme la diagonale.
    { type: 'player_move', time: 0.5, id: 'Op', to: [3.2, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'C', to: [2.0, 0, 0.3], duration: 0.5 },
    // R4 (P4 = OH off-blocker) décroche sur la ligne des 3 m côté gauche (couvre cut shot + tip).
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 2.5], duration: 0.5 },
    // Libéro (P5) — grande diagonale longue cross-court : ~7,5 m du filet, 0,5 m de la ligne gauche.
    { type: 'player_move', time: 0.5, id: 'L', to: [-2.5, 0, 7.5], duration: 0.6 },
    // P6 (arrière centre) — axe ~8 m du filet, légèrement décalé côté ballon (à droite).
    { type: 'player_move', time: 0.5, id: 'R4b', to: [0.8, 0, 8], duration: 0.5 },
    // Passeur (P1, arrière droit) — défend la ligne profonde dans l'ombre du bloc : ~7,5 m, 0,5 m de la ligne droite.
    { type: 'player_move', time: 0.5, id: 'P', to: [4, 0, 7.5], duration: 0.5 },

    // ── Phase 3 : décollage du block + attaquant en l'air ──
    { type: 'player_move', time: 0.85, id: 'Op', to: [3.2, 1.6, 0.3], duration: 0.15 },
    { type: 'player_move', time: 0.85, id: 'C', to: [2.0, 1.6, 0.3], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'Op', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'C', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_move', time: 0.9, id: 'OPP', to: [3.2, 1.8, -0.7], duration: 0.1 },
    { type: 'player_pose', time: 0.9, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.1 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },

    // ── Phase 4 : frappe en grande diagonale longue (coup principal sur attaque Z4) ──
    { type: 'ball_move', time: 1.0, from: [3.2, 3.0, -0.8], to: [-2.5, 1.0, 7.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'Op', to: [3.2, 0, 0.5], duration: 0.2 },
    { type: 'player_move', time: 1.1, id: 'C', to: [2.0, 0, 0.5], duration: 0.2 },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [3.2, 0, -0.6], duration: 0.3 },

    // ── Phase 5 : défense du libéro (BUMP) + rentrée du passeur au filet ──
    { type: 'player_pose', time: 1.5, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [-2.5, 1.0, 7.5], to: [2.0, 2.5, 1.0], duration: 0.8, arc: 3.5 },
    // Notre passeur (P) sprint vers la zone 2-3 pour la 2ᵉ touche
    { type: 'player_move', time: 1.5, id: 'P', to: [2.0, 0, 1.0], duration: 0.7 },
    // Le passeur adverse se replie pour défendre la contre-attaque
    { type: 'player_move', time: 1.5, id: 'OPP_S', to: [-1, 0, -2], duration: 0.5 },

    // ── Phase 6 : passe en suspension + course d'élan ──
    { type: 'player_pose', time: 2.3, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'player_move', time: 2.0, id: 'Op', to: [3.0, 0, 1.0], duration: 0.3 },
    { type: 'player_move', time: 2.0, id: 'C', to: [0, 0, 1.0], duration: 0.4 },
    { type: 'player_move', time: 2.0, id: 'R4', to: [-3.0, 0, 1.0], duration: 0.3 },

    // ── Phase 7 : RESET — retour à la position de base ──
    { type: 'player_pose', time: 3.2, id: 'P', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'Op', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'C', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'R4', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'L', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'R4b', pose: 'RESET', duration: 0.4 },
    { type: 'player_move', time: 3.2, id: 'P', to: [3, 0, 6.5], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'Op', to: [3, 0, 1.2], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'C', to: [0, 0, 1.2], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'R4', to: [-3, 0, 1.2], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'L', to: [-3, 0, 4], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'R4b', to: [0, 0, 4.5], duration: 0.7 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Réception adverse + pénétration du passeur', description: "Leur arrière reçoit (BUMP). Le passeur adverse pénètre vers la cible (entre Z2 et Z3 adverses). Lecture séquentielle « ballon → passeur → ballon → attaquant », jambes fléchies, READY." },
    { id: 's2', startTime: 0.4, title: '2. Passe en cloche vers Z4 adverse', description: "Le passeur distribue vers son ailier gauche (sa zone 4) — l'attaque arrivera sur notre coin avant-droit. Notre ligne avant identifie la zone d'attaque." },
    { id: 's3', startTime: 0.5, title: '3. Bloc à 2 + glissement défensif (périmétrique)', description: "Pointu (P2) contreur ligne + central (P3) ferme la diagonale. R4 (P4) off-blocker sur les 3 m côté gauche (cut shot / tip). Libéro en grande diagonale (~7,5 m, ligne gauche). P6 axe à 8 m, décalé côté ballon. P1 dans l'ombre du bloc sur la ligne droite." },
    { id: 's4', startTime: 0.85, title: '4. Décollage + « stopped on contact »', description: "Saut du bloc à 2, mains au-dessus du filet. À l'instant du contact attaquant, tous les défenseurs sont ARRÊTÉS et équilibrés — sinon réactivité divisée par deux." },
    { id: 's5', startTime: 1.0, title: '5. Frappe en grande diagonale longue', description: "Le coup principal sur attaque Z4 est la grande diagonale longue vers notre Z5. Le libéro y est aligné sur l'épaule intérieure du contreur central." },
    { id: 's6', startTime: 1.5, title: '6. Défense du libéro', description: `Manchette dans sa zone prioritaire — annonce vocale "J'ai !". Trajectoire haute vers la zone 2-3 pour la 2ᵉ touche.` },
    { id: 's7', startTime: 1.5, title: '7. Sprint du passeur au filet', description: "Le passeur n'a pas contré (rotation P1, arrière). Il sprint vers la cible. Le passeur adverse se replie pour défendre la contre-attaque." },
    { id: 's8', startTime: 2.3, title: '8. Distribution & contre-attaque', description: "Passe en suspension. 3 attaquants devant disponibles (OH + MB + OPP) + back-row possible." },
    { id: 's9', startTime: 3.2, title: '9. RESET — retour à la base défensive', description: "Bascule en position de base dès que le passeur adverse touche la balle — pas de transition figée en formation de réception." },
  ],
  summary: {
    keyPoints: [
      'Bloc à 2 : pointu (P2) ligne + central (P3) diagonale. C\'est la configuration FIVB standard sur Z4 adverse.',
      'Off-blocker = OH (P4) sur les 3 m côté gauche — couvre cut shot et tip court.',
      "Système périmétrique : libéro (P5) en grande diagonale ~7,5 m, P6 axe ~8 m, P1 ligne profonde dans l'ombre du bloc.",
      'Libéro aligné sur l\'épaule intérieure du central contreur — c\'est sa zone prioritaire.',
      "Coup principal défendu : grande diagonale longue cross-court (l'OH adverse est le plus sollicité).",
    ],
    commonMistakes: [
      "Bloc ouvert non intentionnel (P3 ne se cale pas sur P2) → balle passe entre les contreurs.",
      "Off-blocker qui reste au filet → ombre du bloc à découvert (faute n°1 selon Hebert).",
      "Libéro mal placé (trop près du filet) → smashs profonds tombent.",
      "Passeur qui contre puis n'arrive pas au filet → 2ᵉ touche par un joueur non spécialisé.",
      "Défenseurs qui bougent encore à l'instant du contact attaquant (pas « stopped on contact »).",
    ],
  },
};

// Scenario D2 — 6v6 defense vs opponent zone 3 (fast central attack / quick / tempo 1)
// 0,3-0,5 s entre la sortie de balle du passeur et la frappe. Bloc à 1 (central) en lecture.
// Z1 et Z5 doivent AVANCER d'un mètre (~7,5 m) car les angles sont plus courts qu'en haute balle.
// Règle clé : « stopped on contact » — tous arrêtés et équilibrés à l'instant exact de la frappe.
const DEFENSE_VS_Z3: Scenario = {
  id: '6v6-defense-vs-z3',
  title: 'Défense · attaque adverse Z3 (rapide / tempo 1)',
  shortDescription: 'Bloc à 1 en lecture (central) sur attaque rapide centrale adverse — arrières avancés d\'un mètre.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Bloc à 1 (read) · Stopped on contact',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    // Notre équipe en positions ready (légèrement spread pour mouvement visible)
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 1.0] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 1.0] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.0] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 4.5] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [0, 0, 5] },
    // Adversaires : central attaquant + passeur explicite + R4 + réceptionneur (origine du ballon)
    { id: 'OPP', label: 'Central adverse', role: 'opponent', color: COLORS.opponent, position: [0, 0, -1.5] },
    { id: 'OPP_S', label: 'Passeur adv.', role: 'opponent', color: COLORS.opponent, position: [-2.5, 0, -2] },
    { id: 'OPP_R4', label: 'R4 adverse', role: 'opponent', color: COLORS.opponent, position: [3, 0, -0.6] },
    { id: 'OPP_R', label: 'Réceptionneur adv.', role: 'opponent', color: COLORS.opponent, position: [0, 0, -3.2] },
  ],
  initialBallPosition: [0, 1.0, -3.2],
  timeline: [
    // ── Phase 0 : le réceptionneur adverse a touché (BUMP) ──
    { type: 'player_pose', time: 0, id: 'OPP_R', pose: 'BUMP', duration: 0.15 },
    // ── Phase 1 : pénétration éclair du passeur (la rapide demande une passe rapide) ──
    { type: 'player_move', time: 0, id: 'OPP_S', to: [-1.5, 0, -0.8], duration: 0.2 },
    { type: 'ball_move', time: 0, from: [0, 1.0, -3.2], to: [-1.5, 1.8, -0.8], duration: 0.2, arc: 1.5 },
    // Notre équipe lit la trajectoire (READY)
    { type: 'player_pose', time: 0.05, id: 'C', pose: 'READY', duration: 0.15 },
    { type: 'player_pose', time: 0.05, id: 'L', pose: 'READY', duration: 0.15 },
    { type: 'player_pose', time: 0.05, id: 'P', pose: 'READY', duration: 0.15 },
    { type: 'player_pose', time: 0.05, id: 'R4b', pose: 'READY', duration: 0.15 },

    // ── Phase 2 : passe tendue rapide vers le central (tempo 1) ──
    // Le central adverse a déjà commencé sa course, il décolle au moment de la passe
    { type: 'player_move', time: 0.15, id: 'OPP', to: [0, 0, -1], duration: 0.1 },
    { type: 'player_pose', time: 0.2, id: 'OPP_S', pose: 'SET', duration: 0.1 },
    { type: 'ball_move', time: 0.2, from: [-1.5, 1.8, -0.8], to: [0, 2.5, -0.5], duration: 0.2, arc: 0.8 },
    // Notre central commit-block ou lit puis saute
    { type: 'player_move', time: 0.2, id: 'C', to: [0, 0, 0.3], duration: 0.15 },
    { type: 'player_move', time: 0.35, id: 'C', to: [0, 1.6, 0.3], duration: 0.15 },
    { type: 'player_pose', time: 0.35, id: 'C', pose: 'ARM_SPIKE', duration: 0.15 },
    // Les ailiers reculent latéralement sur les 3 m
    { type: 'player_move', time: 0.2, id: 'R4', to: [-3, 0, 2.2], duration: 0.3 },
    { type: 'player_move', time: 0.2, id: 'Op', to: [3, 0, 2.2], duration: 0.3 },
    // Le central adverse arme et frappe (rapide)
    { type: 'player_move', time: 0.3, id: 'OPP', to: [0, 1.6, -0.6], duration: 0.1 },
    { type: 'player_pose', time: 0.3, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.1 },
    { type: 'player_pose', time: 0.4, id: 'OPP', pose: 'SPIKE', duration: 0.1 },

    // ── Phase 3 : frappe rapide en diagonale courte (angles courts sur quick) ──
    { type: 'ball_move', time: 0.4, from: [0, 2.5, -0.5], to: [2.5, 0.8, 5], duration: 0.5, arc: false },
    // Z1 (P) et Z5 (L) AVANCENT d'1 m : ~7,5 m du filet au lieu de 8-8,5 m.
    { type: 'player_move', time: 0.4, id: 'P', to: [3, 0, 5], duration: 0.5 },
    { type: 'player_move', time: 0.4, id: 'L', to: [-2.5, 0, 5], duration: 0.5 },
    // P6 dans son couloir de frappe, face à l'attaquant central.
    { type: 'player_move', time: 0.4, id: 'R4b', to: [0, 0, 6], duration: 0.5 },
    // Block + central retombent
    { type: 'player_move', time: 0.5, id: 'C', to: [0, 0, 0.4], duration: 0.3 },
    { type: 'player_move', time: 0.5, id: 'OPP', to: [0, 0, -1], duration: 0.3 },

    // ── Phase 4 : récupération du passeur (P) côté ligne droite ──
    { type: 'player_pose', time: 0.9, id: 'P', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.9, from: [2.5, 0.8, 5], to: [1.5, 2.2, 1.0], duration: 0.8, arc: 3.5 },
    // Le passeur adverse se replie en défense de contre-attaque
    { type: 'player_move', time: 0.9, id: 'OPP_S', to: [-1, 0, -3], duration: 0.4 },

    // ── Phase 5 : 2ᵉ touche par le pointu (le passeur a défendu) ──
    { type: 'player_move', time: 1.5, id: 'Op', to: [2.5, 0, 1.0], duration: 0.3 },
    { type: 'player_pose', time: 1.7, id: 'Op', pose: 'SET', duration: 0.2 },
    // Notre R4 prépare une contre-attaque
    { type: 'player_move', time: 1.5, id: 'R4', to: [-3, 0, 1.5], duration: 0.3 },

    // ── Phase 6 : RESET — retour à la position de base ──
    { type: 'player_pose', time: 2.5, id: 'P', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 2.5, id: 'Op', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 2.5, id: 'C', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 2.5, id: 'R4', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 2.5, id: 'L', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 2.5, id: 'R4b', pose: 'RESET', duration: 0.4 },
    { type: 'player_move', time: 2.5, id: 'P', to: [3, 0, 5], duration: 0.7 },
    { type: 'player_move', time: 2.5, id: 'Op', to: [3, 0, 1.0], duration: 0.7 },
    { type: 'player_move', time: 2.5, id: 'C', to: [0, 0, 1.0], duration: 0.7 },
    { type: 'player_move', time: 2.5, id: 'R4', to: [-3, 0, 1.0], duration: 0.7 },
    { type: 'player_move', time: 2.5, id: 'L', to: [-3, 0, 4.5], duration: 0.7 },
    { type: 'player_move', time: 2.5, id: 'R4b', to: [0, 0, 5], duration: 0.7 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Réception adverse + pénétration éclair', description: "Leur arrière reçoit (BUMP). Le passeur sprint pour une rapide. Tempo 1 = 0,3-0,5 s entre passe et frappe. Notre équipe lit en READY position." },
    { id: 's2', startTime: 0.2, title: '2. Passe tendue + central en l\'air', description: "Le passeur lance tendu vers le central, qui a déjà commencé sa course et décolle juste avant la passe." },
    { id: 's3', startTime: 0.2, title: '3. Bloc à 1 (read ou commit)', description: "Notre central seul saute. Choix tactique : commit (saute avec le central adverse) ou read (attend la passe avant de sauter). Les ailes (R4 et pointu) restent latéralement sur les 3 m pour couvrir déviations de bloc." },
    { id: 's4', startTime: 0.4, title: '4. Frappe rapide en diagonale courte', description: "Angles courts par rapport à une haute balle. Z1 et Z5 sont avancés d'un mètre (~7,5 m du filet). P6 est dans le couloir de frappe central." },
    { id: 's5', startTime: 0.9, title: '5. Manchette défensive', description: 'Le passeur (Z1 avancé) récupère en manchette dans son couloir. Trajectoire haute vers la zone 2-3.' },
    { id: 's6', startTime: 1.5, title: '6. Le pointu prend la 2ᵉ touche', description: 'Comme notre passeur a défendu, le pointu (en P2) prend la 2ᵉ touche pour distribuer la contre-attaque.' },
    { id: 's7', startTime: 2.5, title: '7. RESET — retour à la base', description: "Bascule en position de base dès que le passeur adverse touche la balle." },
  ],
  summary: {
    keyPoints: [
      'Bloc à 1 sur la rapide centrale : seul le central saute (read le plus fréquent, commit si scouting fort).',
      'Z1 et Z5 AVANCENT d\'un mètre (~7,5 m) car les angles sont plus courts sur quick.',
      'Les ailiers restent sur les 3 m (~2-2,5 m du filet) pour les déviations de bloc.',
      '« Stopped on contact » : tous arrêtés et équilibrés à l\'instant exact de la frappe.',
    ],
    commonMistakes: [
      'Tous les avants sautent → laisse les ailes ouvertes pour la passe suivante.',
      'Bloc trop tardif → balle passe au-dessus des mains.',
      "« False stepping » (premier appui reculé) → on perd le peu de temps disponible.",
      "Z1/Z5 figés en fond (8 m+) → balle rapide tombe court avant qu'ils n'aient bougé.",
    ],
  },
};

// Scenario D3 — 6v6 defense vs opponent zone 2 (mirror of Z4)
// Convention FIVB : attaque adverse Z2 (sa droite) → balle arrive sur NOTRE coin avant-GAUCHE.
// Configuration en miroir parfait de Z4 : R4 (P4) contreur ligne + central (P3) ferme la diagonale.
// Gestion critique du passeur : s'il est en P2 (avant), c'est LUI qui bloque ligne, transition tendue.
const DEFENSE_VS_Z2: Scenario = {
  id: '6v6-defense-vs-z2',
  title: 'Défense · attaque adverse Z2',
  shortDescription: 'Miroir parfait de Z4. Bloc à 2 (R4 ligne + central diagonale) sur attaque adverse Z2 → arrive sur notre gauche.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · P1 passeur arrière · Bloc à 2 · Périmétrique',
  },
  defaultCamera: 'DEFAULT',
  players: [
    // Notre équipe en positions ready spread
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5.5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 1.2] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 1.2] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.2] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 4.5] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [0, 0, 4.5] },
    // Adversaires : attaquant Z2 (notre gauche) + passeur explicite + réceptionneur (origine du ballon)
    { id: 'OPP', label: 'Attaquant adv. Z2', role: 'opponent', color: COLORS.opponent, position: [-3.2, 0, -3] },
    { id: 'OPP_S', label: 'Passeur adv.', role: 'opponent', color: COLORS.opponent, position: [2.5, 0, -2] },
    { id: 'OPP_R', label: 'Réceptionneur adv.', role: 'opponent', color: COLORS.opponent, position: [0, 0, -3.2] },
  ],
  initialBallPosition: [0, 1.0, -3.2],
  timeline: [
    // ── Phase 0 : le réceptionneur adverse a touché (BUMP) ──
    { type: 'player_pose', time: 0, id: 'OPP_R', pose: 'BUMP', duration: 0.2 },
    // ── Phase 1 : pénétration du passeur adverse (depuis leur back-left = notre back-right) ──
    { type: 'player_move', time: 0, id: 'OPP_S', to: [1.8, 0, -0.8], duration: 0.4 },
    { type: 'ball_move', time: 0, from: [0, 1.0, -3.2], to: [1.8, 1.8, -0.8], duration: 0.4, arc: 2.5 },
    { type: 'player_pose', time: 0.1, id: 'L', pose: 'READY', duration: 0.3 },
    { type: 'player_pose', time: 0.1, id: 'R4b', pose: 'READY', duration: 0.3 },
    { type: 'player_pose', time: 0.1, id: 'P', pose: 'READY', duration: 0.3 },
    { type: 'player_pose', time: 0.1, id: 'Op', pose: 'READY', duration: 0.3 },

    // ── Phase 2 : passe en cloche vers Z2 + glissement défensif (miroir de Z4) ──
    { type: 'player_pose', time: 0.4, id: 'OPP_S', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 0.4, from: [1.8, 1.8, -0.8], to: [-3.2, 3.0, -0.8], duration: 0.6, arc: 4.0 },
    { type: 'player_move', time: 0.4, id: 'OPP', to: [-3.2, 0, -1.5], duration: 0.4 },
    // Bloc à 2 : R4 (P4 = OH) contreur ligne + C (P3) ferme la diagonale.
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.2, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'C', to: [-2.0, 0, 0.3], duration: 0.5 },
    // Pointu (P2 = OPP) — off-blocker côté droit, décroche sur les 3 m.
    { type: 'player_move', time: 0.5, id: 'Op', to: [3.0, 0, 2.5], duration: 0.5 },
    // Libéro (P5) — ligne profonde dans l'ombre du bloc côté gauche : ~7,5 m, 0,5 m de la ligne gauche.
    { type: 'player_move', time: 0.5, id: 'L', to: [-4, 0, 7.5], duration: 0.6 },
    // P6 (arrière centre) — axe ~8 m, décalé côté ballon (à gauche).
    { type: 'player_move', time: 0.5, id: 'R4b', to: [-0.8, 0, 8], duration: 0.5 },
    // Passeur (P1, arrière droit) — défend la grande diagonale longue cross-court.
    { type: 'player_move', time: 0.5, id: 'P', to: [2.5, 0, 7.5], duration: 0.5 },

    // ── Phase 3 : décollage du block + attaquant en l'air ──
    { type: 'player_move', time: 0.85, id: 'R4', to: [-3.2, 1.6, 0.3], duration: 0.15 },
    { type: 'player_move', time: 0.85, id: 'C', to: [-2.0, 1.6, 0.3], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'R4', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'C', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_move', time: 0.9, id: 'OPP', to: [-3.2, 1.8, -0.7], duration: 0.1 },
    { type: 'player_pose', time: 0.9, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.1 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },

    // ── Phase 4 : frappe en grande diagonale longue cross-court (coup principal sur Z2) ──
    { type: 'ball_move', time: 1.0, from: [-3.2, 3.0, -0.8], to: [2.5, 1.0, 7.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'R4', to: [-3.2, 0, 0.5], duration: 0.2 },
    { type: 'player_move', time: 1.1, id: 'C', to: [-2.0, 0, 0.5], duration: 0.2 },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [-3.2, 0, -0.6], duration: 0.3 },

    // ── Phase 5 : le passeur défend en grande diagonale (P1 sur la trajectoire) ──
    { type: 'player_pose', time: 1.5, id: 'P', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [2.5, 1.0, 7.5], to: [-1.0, 2.5, 1.0], duration: 0.8, arc: 3.5 },
    // Le passeur adverse se replie défensivement
    { type: 'player_move', time: 1.5, id: 'OPP_S', to: [1, 0, -2], duration: 0.5 },

    // ── Phase 6 : 2ᵉ touche par le pointu (le passeur a défendu) ──
    { type: 'player_move', time: 1.7, id: 'Op', to: [-1.0, 0, 1.0], duration: 0.5 },
    { type: 'player_pose', time: 2.3, id: 'Op', pose: 'SET', duration: 0.2 },
    // Notre R4 et C se replient pour la contre-attaque
    { type: 'player_move', time: 2.0, id: 'R4', to: [-3.0, 0, 1.0], duration: 0.3 },
    { type: 'player_move', time: 2.0, id: 'C', to: [0, 0, 1.0], duration: 0.4 },

    // ── Phase 7 : RESET — retour à la position de base ──
    { type: 'player_pose', time: 3.2, id: 'P', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'Op', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'C', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'R4', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'L', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'R4b', pose: 'RESET', duration: 0.4 },
    { type: 'player_move', time: 3.2, id: 'P', to: [3, 0, 5.5], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'Op', to: [3, 0, 1.2], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'C', to: [0, 0, 1.2], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'R4', to: [-3, 0, 1.2], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'L', to: [-3, 0, 4.5], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'R4b', to: [0, 0, 4.5], duration: 0.7 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Réception adverse + pénétration', description: "Leur arrière reçoit (BUMP). Le passeur adverse pénètre depuis sa P1 vers la cible. Notre équipe lit en READY." },
    { id: 's2', startTime: 0.4, title: '2. Passe en cloche vers Z2 adverse', description: "Le passeur distribue vers son R4 en sa zone 2 (sa droite) — l'attaque arrive sur notre coin avant-GAUCHE." },
    { id: 's3', startTime: 0.5, title: '3. Bloc à 2 + glissement défensif (miroir Z4)', description: "R4 (P4) contreur ligne + central (P3) ferme la diagonale. Pointu (P2) off-blocker à droite. Libéro (P5) sur la ligne profonde gauche dans l'ombre du bloc. P6 axe à 8 m. P1 défend la grande diagonale longue cross-court." },
    { id: 's4', startTime: 0.85, title: '4. Décollage + stopped on contact', description: "Bloc à 2 (R4 + C) saute. À l'instant du contact attaquant, tous arrêtés et équilibrés." },
    { id: 's5', startTime: 1.0, title: '5. Frappe en grande diagonale longue', description: "Frappe en cross-court vers notre zone 1. Le passeur (en P1) est sur la trajectoire." },
    { id: 's6', startTime: 1.5, title: '6. Le passeur défend', description: "Manchette défensive du passeur. Question immédiate : qui fait la 2ᵉ touche ?" },
    { id: 's7', startTime: 1.7, title: '7. Le pointu prend le relais', description: "Le pointu (P2) sort de l'off-blocker pour faire la 2ᵉ touche. Communication impérative." },
    { id: 's8', startTime: 2.3, title: '8. Distribution de secours', description: 'Passe en touche par le pointu — souvent vers le R4 ou central disponibles.' },
    { id: 's9', startTime: 3.2, title: '9. RESET — retour à la base défensive', description: "Bascule en position de base dès que le passeur adverse touche la balle." },
  ],
  summary: {
    keyPoints: [
      'Miroir parfait de Z4 : R4 (P4 = OH) contreur ligne + central (P3) ferme la diagonale.',
      'Le pointu (P2 = OPP) devient off-blocker côté droit, décroche sur les 3 m.',
      'Le passeur en P1 (arrière) défend la grande diagonale longue cross-court.',
      "Gestion critique : si le passeur est en P2 (avant), c'est LUI qui bloque ligne — transition tendue.",
      "Si le passeur défend en P1 → 2ᵉ touche par le pointu (contre-passeur) obligatoire.",
    ],
    commonMistakes: [
      'Pointu qui contre depuis la zone 2 → off-blocker absent côté droit.',
      'Central qui ne se cale pas sur le R4 → bloc ouvert.',
      'Libéro mal placé sur Z2 — il défend ici la LIGNE profonde, pas la grande diagonale.',
      'Passeur qui défend ET veut relayer → confusion sur la 2ᵉ touche.',
    ],
  },
};

// Scenario D4 — 6v6 defense vs pipe (back-row attack from zone 6)
// Pipe = attaque arrière en Z6 par OH2 ou OPP. Le P6 défensif doit avancer (~6-7 m) — « cinch the court » (Josephson).
// Les arrières latéraux Z1 et Z5 se rapprochent du centre. Une des attaques les plus difficiles à défendre
// car le central ne peut honorer simultanément quick + pipe + deux ailes avec seulement trois bloqueurs.
const DEFENSE_VS_PIPE: Scenario = {
  id: '6v6-defense-vs-pipe',
  title: 'Défense · attaque pipe adverse (BIC)',
  shortDescription: 'Défense face à une pipe adverse (attaque arrière Z6) : bloc à 1 ou 2, P6 avance pour « cinch the court ».',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Pipe / BIC · P6 avance, périmétrique resserré',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 3.5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 7] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [0, 0, 7] },
    { id: 'OPP', label: 'Pipe adverse', role: 'opponent', color: COLORS.opponent, position: [0, 0, -4] },
  ],
  initialBallPosition: [0, 2.0, -2],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -2], to: [0, 3.0, -3.5], duration: 0.5, arc: 3.5 },
    { type: 'player_move', time: 0.2, id: 'C', to: [0, 1.6, 0.3], duration: 0.3 },
    { type: 'player_pose', time: 0.2, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    // Wings stay close to the 3m line (cover pipe deflections).
    { type: 'player_move', time: 0.3, id: 'R4', to: [-3, 0, 1.5], duration: 0.4 },
    { type: 'player_move', time: 0.3, id: 'Op', to: [3, 0, 1.5], duration: 0.4 },
    // P6 AVANCE — « cinch the court » : pivot défensif central à ~6-7 m du filet sur l'axe exact.
    { type: 'player_move', time: 0.3, id: 'R4b', to: [0, 0, 6.5], duration: 0.4 },
    // Z1 et Z5 se rapprochent du centre (sacrifient un peu les lignes pour défendre l'axe).
    { type: 'player_move', time: 0.3, id: 'L', to: [-1.5, 0, 7], duration: 0.4 },
    { type: 'player_move', time: 0.3, id: 'P', to: [1.5, 0, 7], duration: 0.4 },
    // Pipe attacker — back-row attack, jumps from behind 3m line
    { type: 'player_move', time: 0.25, id: 'OPP', to: [0, 0, -4.5], duration: 0.15 },
    { type: 'player_move', time: 0.4, id: 'OPP', to: [0, 1.6, -3.5], duration: 0.1 },
    { type: 'player_pose', time: 0.35, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 0.5, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 0.5, from: [0, 3.0, -3.5], to: [0, 0.8, 6.5], duration: 0.7, arc: false },
    { type: 'player_move', time: 0.6, id: 'OPP', to: [0, 0, -4], duration: 0.3 },
    { type: 'player_pose', time: 1.2, id: 'R4b', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.2, from: [0, 0.8, 6.5], to: [1.5, 2.0, 1.0], duration: 0.8, arc: 3.5 },
    { type: 'player_move', time: 1.2, id: 'C', to: [0, 0, 0.4], duration: 0.4 },
    { type: 'player_pose', time: 2.0, id: 'P', pose: 'SET', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Passe adverse en pipe', description: "Trajectoire tendue vers le centre arrière de l'adversaire. L'attaquant arrière (OH2 ou OPP adverse) entre en course depuis derrière les 3 m." },
    { id: 's2', startTime: 0.2, title: '2. Bloc central (souvent à 1)', description: "Notre central saute au centre. Bloc à 2 difficile car les ailiers défendent simultanément quick + ailes." },
    { id: 's3', startTime: 0.3, title: '3. Ailes restent près du filet', description: "R4 et pointu restent près des 3 m pour couvrir les déviations de bloc, prêts à transitionner vers une attaque rapide." },
    { id: 's4', startTime: 0.3, title: '4. P6 avance — « cinch the court »', description: "Le R4b en P6 AVANCE à ~6-7 m du filet, axe exact (Josephson). Il sacrifie un peu les lignes pour défendre l'axe central, le couloir de la pipe." },
    { id: 's5', startTime: 0.5, title: '5. Z1 / Z5 resserrés au centre', description: "Libéro et passeur se rapprochent du centre à ~7 m du filet, 1,5 m des lignes." },
    { id: 's6', startTime: 1.2, title: '6. Récupération profonde axiale', description: 'Le P6 fait une manchette dans son axe vers le passeur qui revient au filet.' },
  ],
  summary: {
    keyPoints: [
      'Pipe = attaque arrière en Z6 (centre arrière) par OH2 ou OPP — vise l\'axe central profond.',
      'Bloc à 1 (central) le plus fréquent — bloc à 2 difficile sur tempo rapide.',
      'P6 défensif AVANCE à ~6-7 m du filet, axe exact (« cinch the court »).',
      'Z1 et Z5 se rapprochent du centre (~7 m, 1,5 m des lignes) — sacrifient un peu les lignes.',
      "BIC (pipe rapide) = une des attaques les plus difficiles à défendre car le central ne peut honorer quick + pipe + deux ailes.",
    ],
    commonMistakes: [
      "Bloc à 2 sur pipe → laisse une aile complètement ouverte si l'adversaire change d'attaque.",
      'P6 figé au fond (8 m+) → pipe rapide tombe avant qu\'il ne bouge.',
      "Z1/Z5 trop écartés sur les lignes → axe central à découvert.",
      "Pas de communication entre central et ailes sur qui prend la pipe vs la quick.",
    ],
  },
};

// Scenario D5 — 6v6 man-up defense (2-1-3, formerly "défense en W" / red defense)
// IMPORTANT terminologie : on appelle ce système « man-up » ou « 2-1-3 » — PAS « défense en W ».
// La « W-formation » désigne une formation de RÉCEPTION à 5 joueurs, pas un système défensif.
// Principe : un défenseur monté à hauteur de la ligne des 3 m derrière le contre pour intercepter
// feintes, amorties et balles courtes. 2 contreurs + 1 monté + 3 profonds = 2-1-3.
const DEFENSE_6_FRONT: Scenario = {
  id: '6v6-defense-6-front',
  title: 'Défense · man-up (2-1-3)',
  shortDescription: 'Système man-up (2-1-3, anciennement « défense en W ») : un défenseur monté derrière le bloc pour les feintes courtes.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Man-up 2-1-3 · Anti-feinte',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 5] },
    { id: 'R4b', label: 'R4 (P6 avancé)', role: 'outside', color: COLORS.middle_back, position: [0, 0, 2.5] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 0.3, id: 'Op', to: [3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.4, id: 'C', to: [2.0, 0, 0.3], duration: 0.5 },
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 1.5], duration: 0.5 },
    // Key: P6 STAYS or advances toward the 3m line in the bloc shadow
    { type: 'player_move', time: 0.5, id: 'R4b', to: [1.5, 0, 2.5], duration: 0.4 },
    // Libero and P1 recede to compensate
    { type: 'player_move', time: 0.5, id: 'L', to: [-3.0, 0, 6], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'P', to: [3.0, 0, 6], duration: 0.4 },
    { type: 'player_move', time: 0.7, id: 'Op', to: [3.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_move', time: 0.7, id: 'C', to: [2.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'Op', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    // Opponent attacker approaches and jumps, then tips short instead of spiking
    { type: 'player_move', time: 0.7, id: 'OPP', to: [3.0, 0, -1.2], duration: 0.2 },
    { type: 'player_move', time: 0.85, id: 'OPP', to: [3.0, 1.7, -0.7], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SET', duration: 0.1 },
    { type: 'ball_move', time: 1.0, from: [3.0, 3.0, -0.8], to: [1.5, 1.0, 2.5], duration: 0.6, arc: 2.5 },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.6, id: 'R4b', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.6, from: [1.5, 1.0, 2.5], to: [2.0, 2.5, 1.0], duration: 0.7, arc: 3.5 },
    { type: 'player_pose', time: 2.3, id: 'Op', pose: 'SET', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Passe adverse en Z4', description: "Lecture habituelle. Mais l'adversaire est connu pour ses feintes — choix tactique de jouer en man-up." },
    { id: 's2', startTime: 0.4, title: '2. Bloc à 2 standard', description: 'Pointu (P2) ligne + central (P3) diagonale, comme en périmétrique.' },
    { id: 's3', startTime: 0.5, title: '3. Joueur monté derrière le bloc', description: "Différence-clé du man-up : le R4 (en P6 sur ce schéma) AVANCE à hauteur de la ligne des 3 m, dans l'ombre du bloc, pour intercepter feintes et amorties." },
    { id: 's4', startTime: 0.5, title: '4. Compensation profonde', description: "Seulement 3 défenseurs en profondeur (d'où l'appellation 2-1-3). Libéro et passeur reculent jusqu'à la ligne de fond pour couvrir les balles longues." },
    { id: 's5', startTime: 1.0, title: '5. Feinte adverse', description: "L'attaquant adverse choisit la feinte plutôt que le smash. La balle tombe juste derrière le bloc — exactement où est le joueur monté." },
    { id: 's6', startTime: 1.6, title: '6. Récupération courte', description: 'Le joueur monté est exactement où la balle tombe. Manchette précise vers le pointu pour relancer.' },
  ],
  summary: {
    keyPoints: [
      "Man-up = 2-1-3 (Keller / USAV) — anciennement « red defense ».",
      "⚠ NE PAS confondre avec « W-formation » qui est une formation de RÉCEPTION, pas un système défensif.",
      "Couverture exceptionnelle des tips, roll shots et balles « pourries » derrière le bloc.",
      "Mais : seulement 3 défenseurs profonds → vulnérable aux smashs puissants en diagonale serrée.",
      "Indication : équipes jeunes, scolaires, adversaires tactiques jouant beaucoup de feintes ou off-speed.",
    ],
    commonMistakes: [
      'Garder le système périmétrique contre une équipe qui feinte → balles courtes perdues.',
      "Joueur monté trop avancé (au filet) → bloqué dans l'élan du contre.",
      'Libéro qui ne recule pas → trou en arrière sur smash puissant.',
      "Confondre « défense en W » et « man-up » dans le vocabulaire d'équipe — source de malentendus.",
    ],
  },
};

// Scenario D6 — 6v6 perimeter defense (2-0-4 / "white defense")
// Système prédominant en volley masculin moderne et international où la puissance domine.
// Les 4 défenseurs forment un U ouvert vers le filet, presque sur les lignes de touche et de fond
// — « un pied sur la ligne » (Liskevych). Le milieu du terrain est volontairement abandonné.
const DEFENSE_PERIMETER: Scenario = {
  id: '6v6-defense-perimeter',
  title: 'Défense · périmétrique (2-0-4)',
  shortDescription: 'White defense : 4 défenseurs sur les lignes, U ouvert vers le filet. Dominant en haut niveau masculin.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Périmétrique 2-0-4 (white defense)',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [4, 0, 8] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-4, 0, 8] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [0, 0, 8.5] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 0.3, id: 'Op', to: [3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.4, id: 'C', to: [2.0, 0, 0.3], duration: 0.5 },
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 1.5], duration: 0.5 },
    // All 4 defenders on the perimeter lines (« un pied sur la ligne », Liskevych).
    // Capped at x = ±4.3 / z = 8.8 to keep a small margin inside the 9 m × 9 m court.
    { type: 'player_move', time: 0.5, id: 'L', to: [-4.3, 0, 8.5], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'R4b', to: [0, 0, 8.8], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'P', to: [4.3, 0, 8.5], duration: 0.4 },
    { type: 'player_move', time: 0.7, id: 'Op', to: [3.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_move', time: 0.7, id: 'C', to: [2.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'Op', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    // Opponent approaches, jumps and spikes along the line
    { type: 'player_move', time: 0.7, id: 'OPP', to: [3.0, 0, -1.2], duration: 0.2 },
    { type: 'player_move', time: 0.85, id: 'OPP', to: [3.0, 1.8, -0.7], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    // Hard spike along the line
    { type: 'ball_move', time: 1.0, from: [3.0, 3.0, -0.8], to: [-4, 0.8, 7], duration: 0.6, arc: false },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.6, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.6, from: [-4, 0.8, 7], to: [1.5, 2.5, 1.0], duration: 0.9, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Configuration périmétrique (2-0-4)', description: 'Les 4 défenseurs forment un U ouvert vers le filet, presque sur les lignes — « un pied sur la ligne » (Liskevych). Le milieu du terrain est volontairement abandonné.' },
    { id: 's2', startTime: 0.4, title: '2. Bloc à 2 standard', description: 'Bloc à 2 au filet. Aucun défenseur monté derrière le bloc (d\'où le 0 central dans « 2-0-4 »).' },
    { id: 's3', startTime: 0.5, title: '3. Tous sur les lignes', description: "Libéro sur la ligne gauche, P6 sur la ligne de fond, P1 sur la ligne droite. Philosophie : « il est plus efficace de se déplacer vers le centre que de s'en éloigner »." },
    { id: 's4', startTime: 1.0, title: '4. Block-out long', description: "L'attaque puissante part en diagonale longue qui touche le bloc — trajectoire prioritairement défendue." },
    { id: 's5', startTime: 1.6, title: '5. Récupération en couloir', description: "Le libéro récupère sur la ligne — couverture périphérique parfaite. Identifie facilement les balles « out »." },
  ],
  summary: {
    keyPoints: [
      "Périmétrique = 2-0-4 (« white defense ») : 4 défenseurs sur le périmètre, aucun monté.",
      "Système prédominant en volley masculin moderne et international où la puissance domine.",
      "Logique : peupler statistiquement les zones où atterrissent les smashs puissants (lignes et coins profonds).",
      "Excellente identification des balles « out » et défense des block-outs.",
      "⚠ Le milieu du terrain (zone centrale entre 3 et 5 m) est délibérément laissé libre.",
    ],
    commonMistakes: [
      "Défenseurs qui se replient au centre → perdent la logique du système et ne couvrent plus les lignes.",
      "Système choisi contre une équipe qui feinte → centre du terrain à découvert, tips perdus.",
      "Libéro non habitué → mauvaise lecture des balles « out » sur les côtés.",
      "Manque d'athlétisme pour plonger vers l'avant sur tips → faiblesse exploitée.",
    ],
  },
};

// Scenario D7 — 6v6 rotational defense (3-2-1, "slide defense")
// Les 3 défenseurs arrière « glissent » vers le côté d'attaque adverse : l'arrière opposé monte derrière
// le bloc (couverture tip), le milieu glisse vers la ligne du côté attaqué, le défenseur du côté attaqué
// se met en angle court. Variante « counter-rotate » : rotation dans le sens inverse.
const DEFENSE_ROTATION: Scenario = {
  id: '6v6-defense-rotation',
  title: 'Défense · en rotation (3-2-1)',
  shortDescription: 'Rotation / slide defense : les arrières glissent vers le côté d\'attaque, l\'arrière opposé monte derrière le bloc.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Rotation 3-2-1 · Slide defense',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 3.5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 5] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [0, 0, 5] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 0.3, id: 'Op', to: [3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.4, id: 'C', to: [2.0, 0, 0.3], duration: 0.5 },
    // R4 (off-blocker) descends to 3m line on the line side
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 2.0], duration: 0.4 },
    // Variante rotation : passeur (P1) MONTE à ~3-3,5 m du filet sur la ligne d'attaque pour couvrir le tip.
    { type: 'player_move', time: 0.5, id: 'P', to: [3.0, 0, 3], duration: 0.4 },
    // Milieu arrière (P6) GLISSE vers la ligne droite à ~8,5 m du filet, 1-1,5 m de la ligne.
    { type: 'player_move', time: 0.5, id: 'R4b', to: [3.5, 0, 8], duration: 0.5 },
    // Libéro (P5) reste en diagonale longue.
    { type: 'player_move', time: 0.5, id: 'L', to: [-1.5, 0, 7.5], duration: 0.5 },
    { type: 'player_move', time: 0.7, id: 'Op', to: [3.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_move', time: 0.7, id: 'C', to: [2.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'Op', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    // Opponent approaches, jumps, then spikes diagonally
    { type: 'player_move', time: 0.7, id: 'OPP', to: [3.0, 0, -1.2], duration: 0.2 },
    { type: 'player_move', time: 0.85, id: 'OPP', to: [3.0, 1.8, -0.7], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    // Strong diagonal spike — defended by libero in rotation
    { type: 'ball_move', time: 1.0, from: [3.0, 3.0, -0.8], to: [-1.5, 0.8, 7.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.5, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [-1.5, 0.8, 7.5], to: [1.5, 2.5, 1.0], duration: 0.9, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: "1. Lecture de l'attaque Z4 adverse", description: "Attaque adverse en sa zone 4 (sa gauche) → arrive sur notre coin avant-droit." },
    { id: 's2', startTime: 0.4, title: '2. Bloc à 2 standard', description: 'Pointu (P2) ligne + central (P3) diagonale forment le bloc côté droit.' },
    { id: 's3', startTime: 0.5, title: '3. Le passeur (P1) MONTE derrière le bloc', description: "Différence-clé de la rotation : le P1 (passeur arrière) monte à ~3-3,5 m du filet sur la ligne d'attaque pour couvrir le tip. Transition setter rapide ensuite." },
    { id: 's4', startTime: 0.5, title: '4. P6 glisse, libéro maintient diagonale', description: "Le milieu arrière (P6) glisse vers la ligne droite à ~8,5 m. Le R4 (P4) descend off-blocker côté gauche. Le libéro (P5) reste en grande diagonale longue." },
    { id: 's5', startTime: 1.0, title: '5. Frappe diagonale longue', description: "Le libéro est exactement à l'arrivée du coup principal." },
    { id: 's6', startTime: 1.5, title: '6. Récupération en diagonale', description: 'Le libéro défend dans sa zone optimale. Transition fluide vers la contre-attaque.' },
  ],
  summary: {
    keyPoints: [
      "Rotation 3-2-1 (slide defense) : 3 défenseurs arrière glissent vers le côté d'attaque.",
      "L'arrière opposé (souvent le passeur si en P1) MONTE derrière le bloc pour couvrir le tip.",
      "Milieu arrière glisse vers la ligne du côté attaqué (~8,5 m, 1-1,5 m de la ligne).",
      "Excellente couverture de la ligne profonde ET du tip simultanément.",
      "Transition setter rapide si le passeur est le joueur monté.",
      "Variante « counter-rotate » : rotation dans le sens inverse.",
    ],
    commonMistakes: [
      "Rotation incomplète → trous dans la couverture.",
      "Coin diagonal opposé vulnérable (un défenseur en moins en profondeur).",
      "Confusion entre rotate (vers ballon) et counter-rotate (à l'opposé) — exige forte communication.",
      "Joueur monté qui reste figé → ne lit pas les feintes vs smashs.",
    ],
  },
};

// Scenario D8 — 6v6 read defense (reactive positioning based on cues)
const DEFENSE_READ: Scenario = {
  id: '6v6-defense-read',
  title: 'Défense · de lecture (read)',
  shortDescription: 'Défense réactive haut niveau : positions adaptatives selon passe, élan et bras armé adverse.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Read defense · International',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 5] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [0, 0, 5] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [-3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    // Phase 1: neutral position (read)
    { type: 'player_pose', time: 0, id: 'L', pose: 'READY', duration: 0.1 },
    { type: 'player_pose', time: 0, id: 'R4b', pose: 'READY', duration: 0.1 },
    { type: 'player_pose', time: 0, id: 'P', pose: 'READY', duration: 0.1 },
    // Pass goes left side (Z2 attack from opponent perspective)
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [-3.0, 3.0, -0.8], duration: 0.8, arc: 3.5 },
    // Phase 2: defenders ADAPT to ball trajectory
    { type: 'player_move', time: 0.3, id: 'R4', to: [-3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.4, id: 'C', to: [-2.0, 0, 0.3], duration: 0.5 },
    // Phase 3: defenders read attacker's elbow and adjust
    { type: 'player_move', time: 0.6, id: 'L', to: [3.0, 0, 6], duration: 0.5 },
    { type: 'player_move', time: 0.6, id: 'R4b', to: [0.5, 0, 6], duration: 0.5 },
    { type: 'player_move', time: 0.6, id: 'Op', to: [3.0, 0, 1.5], duration: 0.4 },
    { type: 'player_move', time: 0.6, id: 'P', to: [3.5, 0, 6], duration: 0.4 },
    { type: 'player_move', time: 0.8, id: 'R4', to: [-3.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_move', time: 0.8, id: 'C', to: [-2.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_pose', time: 0.8, id: 'R4', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 0.8, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    // Opponent attacker (left side) approaches, jumps, then spikes
    { type: 'player_move', time: 0.8, id: 'OPP', to: [-3.0, 0, -1.2], duration: 0.2 },
    { type: 'player_move', time: 0.95, id: 'OPP', to: [-3.0, 1.8, -0.7], duration: 0.15 },
    { type: 'player_pose', time: 0.95, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 1.1, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    // Diagonal shot
    { type: 'ball_move', time: 1.1, from: [-3.0, 3.0, -0.8], to: [3.0, 0.8, 6], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.2, id: 'OPP', to: [-3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.6, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.6, from: [3.0, 0.8, 6], to: [1.5, 2.5, 1.0], duration: 0.9, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Position de base neutre', description: "Tous les défenseurs en position de lecture, jambes fléchies, pieds parallèles. Séquence visuelle : « ballon → passeur → ballon → attaquant »." },
    { id: 's2', startTime: 0.3, title: '2. Lecture de la passe', description: "Dès que le ballon quitte les mains du passeur adverse → ajustement vers la zone d'attaque (ici Z2 adverse, aile droite adverse = arrive sur notre coin avant-GAUCHE)." },
    { id: 's3', startTime: 0.6, title: "3. Lecture de l'attaquant", description: "Course d'élan + orientation du bras armé + épaules. Épaule haute et en arrière = smash. Épaule basse = feinte. Rotation = direction de la balle." },
    { id: 's4', startTime: 0.6, title: '4. Ajustement final + stopped on contact', description: "Tout le monde lit en parallèle. À l'instant exact du contact attaquant : tous arrêtés et équilibrés (« stopped and balanced at the moment of contact », Hebert)." },
    { id: 's5', startTime: 1.1, title: '5. Frappe lue', description: "L'attaquant ouvre vers la diagonale longue → la défense est déjà en place car elle a anticipé via les indices visuels." },
    { id: 's6', startTime: 1.6, title: '6. Pursuit acrobatique', description: 'Si la défense est dépassée, plongeon ou roulade pour récupérer la balle → transition.' },
  ],
  summary: {
    keyPoints: [
      "Read defense = pas de positionnement figé, tout est adaptatif. La défense moderne se définit moins par la formation que par la lecture.",
      "Séquence visuelle « ballon → passeur → ballon → attaquant » (Hebert, Liskevych, FIVB Top Volley).",
      "Phases : base neutre → lecture passe → lecture attaquant → ajustement → « stopped on contact » → pursuit.",
      'Système privilégié au haut niveau international (FIVB seniors).',
      'Plus efficace contre attaquants polyvalents.',
    ],
    commonMistakes: [
      "Bouger AVANT la passe → mauvaise lecture, joueur à contre-pied.",
      "Lecture incomplète : ne lire que la passe, pas le bras armé.",
      "Encore en mouvement à l'instant du contact attaquant (pas « stopped on contact ») → réactivité divisée par 2.",
      "Manque de coordination → 2 défenseurs sur la même balle, trou ailleurs.",
    ],
  },
};

// Scenario D9 — 6v6 attack coverage (block-out support)
const ATTACK_COVERAGE: Scenario = {
  id: '6v6-attack-coverage',
  title: 'Couverture · attaque 5-1',
  shortDescription: 'Couverture à 5 sur attaque en zone 4 : 2 arcs (3 proches + 2 éloignés) pour relever un éventuel block-out.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Couverture à 5 · Dispositif 3-2',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'R4a', label: 'R4 attaquant (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [-1.5, 0, 1.2] },
    { id: 'P', label: 'Passeur (pénétré)', role: 'setter', color: COLORS.setter, position: [-2.0, 0, 1.5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.6] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 4] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [-1, 0, 5] },
    { id: 'OPP_BL', label: 'Bloc adverse G', role: 'opponent', color: COLORS.opponent, position: [-2.5, 0, -0.4] },
    { id: 'OPP_BR', label: 'Bloc adverse D', role: 'opponent', color: COLORS.opponent, position: [-1.0, 0, -0.4] },
  ],
  initialBallPosition: [-2, 2.5, 0.8],
  timeline: [
    // R4 attacks
    { type: 'player_move', time: 0, id: 'R4a', to: [-3, 1.8, 0.6], duration: 0.3 },
    { type: 'player_pose', time: 0.2, id: 'R4a', pose: 'ARM_SPIKE', duration: 0.2 },
    // Coverage forms: 3 close + 2 deep
    // Close: setter, central, libero coming up
    { type: 'player_move', time: 0.1, id: 'P', to: [-2.0, 0, 1.5], duration: 0.3 },
    { type: 'player_pose', time: 0.4, id: 'P', pose: 'READY', duration: 0.1 },
    { type: 'player_move', time: 0.1, id: 'C', to: [-1.5, 0, 1.5], duration: 0.3 },
    { type: 'player_pose', time: 0.4, id: 'C', pose: 'READY', duration: 0.1 },
    { type: 'player_move', time: 0.1, id: 'L', to: [-3.5, 0, 2.5], duration: 0.4 },
    { type: 'player_pose', time: 0.5, id: 'L', pose: 'READY', duration: 0.1 },
    // Deep: pointu and P6
    { type: 'player_move', time: 0.1, id: 'Op', to: [2.5, 0, 4.5], duration: 0.4 },
    { type: 'player_move', time: 0.1, id: 'R4b', to: [-1, 0, 6], duration: 0.4 },
    // Spike → blocked → ricochet back
    { type: 'player_pose', time: 0.4, id: 'R4a', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 0.4, from: [-2, 2.5, 0.8], to: [-2.5, 2.5, -0.2], duration: 0.15, arc: false },
    // Block ricochet: ball comes back into our court near zone 4-3
    { type: 'ball_move', time: 0.55, from: [-2.5, 2.5, -0.2], to: [-1.5, 1.0, 1.5], duration: 0.4, arc: 2.5 },
    // Setter saves it (closest in coverage)
    { type: 'player_pose', time: 0.95, id: 'P', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.95, from: [-1.5, 1.0, 1.5], to: [0, 3.0, 2], duration: 0.8, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Attaque en zone 4', description: "Notre R4 décolle pour attaquer en zone 4. Avant même la frappe, la couverture s'organise (anticipation = clé)." },
    { id: 's2', startTime: 0.1, title: '2. Premier arc (3 joueurs proches)', description: "Passeur + central + libéro forment un demi-cercle à 1-1,5 m de l'attaquant, position TRÈS basse, bras tendus en avant, prêts à manchette courte." },
    { id: 's3', startTime: 0.1, title: '3. Deuxième arc (2 joueurs éloignés)', description: 'Pointu et P6 (R4b) se placent à 3-5 m, debout, prêts à récupérer les balles déviées plus loin (block-outs longs).' },
    { id: 's4', startTime: 0.4, title: '4. Block adverse réussi', description: "L'attaque touche le bloc adverse et revient dans notre camp — situation typique où la couverture devient cruciale." },
    { id: 's5', startTime: 0.55, title: '5. Récupération du passeur', description: "Le passeur (1ᵉʳ soutien proche) relève la balle en manchette à 1 m de l'attaquant. C'est SA responsabilité après une passe en zone 4." },
    { id: 's6', startTime: 0.95, title: '6. Sauvetage = nouvelle attaque', description: 'La balle remonte vers une nouvelle distribution. Sans cette couverture = point perdu directement.' },
  ],
  summary: {
    keyPoints: [
      'Couverture à 5 = standard haut niveau. Dispositif 3-2 (3 proches + 2 éloignés).',
      "Le passeur est TOUJOURS le 1ᵉʳ soutien proche, à 1-1,5 m de l'attaquant.",
      'Position TRÈS basse pour les 3 proches, bras tendus en avant.',
      'Sans couverture, un block adverse réussi = point perdu directement.',
      "L'anticipation prime sur la réaction : la couverture s'organise AVANT la frappe.",
    ],
    commonMistakes: [
      'Couverture absente → block adverse = point.',
      'Passeur qui reste au filet après sa passe → 1ᵉʳ soutien manquant.',
      'Couvreurs debout ou trop éloignés → balles courtes non relevées.',
      "Seulement 2 ou 3 couvreurs au lieu de 5 → block-outs longs perdus.",
    ],
  },
};

// Scenario D10 — 5v5 defense vs opponent zone 4 attack (système 2-1-2 adapté)
// 5v5 n'est PAS un format codifié FIVB — positions adaptées du 6v6 (Hebert / Liskevych / Volleyball Canada).
// Configuration 3F-2B avec passeur avant : bloc à 2 (P3 + P2 passeur) + 1 off-blocker + 2 défenseurs profonds.
// Système 2-1-2 : 2 contreurs + 1 couvreur tip (off-blocker) + 2 défenseurs profonds.
const DEFENSE_5V5_VS_Z4: Scenario = {
  id: '5v5-defense-vs-z4',
  title: '5v5 · Défense Z4',
  shortDescription: 'Système 2-1-2 sur attaque adverse Z4 (sa gauche → arrive notre droite) : bloc à 2 + off-blocker + 2 défenseurs.',
  config: {
    teamSize: 5,
    phase: 'defense',
    contextLabel: '5v5 · 2-1-2 · Bloc à 2 + off-blocker',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 5] },
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 0.3, id: 'Op', to: [3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.4, id: 'C', to: [2.0, 0, 0.3], duration: 0.5 },
    // R4 becomes off-blocker (3m line)
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 1.5], duration: 0.5 },
    // Libero in strong diagonal
    { type: 'player_move', time: 0.5, id: 'L', to: [-1.0, 0, 6], duration: 0.5 },
    // P1 stays on the line
    { type: 'player_move', time: 0.5, id: 'P', to: [3.0, 0, 6], duration: 0.4 },
    { type: 'player_move', time: 0.7, id: 'Op', to: [3.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_move', time: 0.7, id: 'C', to: [2.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'Op', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    // Opponent attacker approaches, jumps and spikes
    { type: 'player_move', time: 0.7, id: 'OPP', to: [3.0, 0, -1.2], duration: 0.2 },
    { type: 'player_move', time: 0.85, id: 'OPP', to: [3.0, 1.8, -0.7], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 1.0, from: [3.0, 3.0, -0.8], to: [-1.0, 0.8, 6], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.5, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [-1.0, 0.8, 6], to: [1.5, 2.5, 1.0], duration: 0.9, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Lecture attaque Z4 adverse', description: "Attaque adverse en sa zone 4 (sa gauche) → arrive sur notre coin avant-DROIT. Lecture séquentielle « ballon → passeur → ballon → attaquant »." },
    { id: 's2', startTime: 0.4, title: '2. Bloc à 2 (système 2-1-2)', description: 'Pointu/passeur (P2) contreur ligne + central (P3) diagonale. C\'est le bloc à 2 classique adapté au 5v5.' },
    { id: 's3', startTime: 0.5, title: '3. Off-blocker R4 (P4)', description: 'Le R4 (avant gauche) décroche à 2-2,5 m du filet sur la ligne d\'attaque — couvre tip et cut shot courts (anti-feinte).' },
    { id: 's4', startTime: 0.5, title: '4. Couloirs profonds (2 défenseurs)', description: 'Libéro (~7-7,5 m, 0,5 m ligne gauche) défend la grande diagonale longue. Passeur (~7 m, ligne droite) défend la ligne profonde. Inconvénient majeur : seulement 2 arrières → 30+ m² par défenseur.' },
    { id: 's5', startTime: 1.0, title: '5. Frappe en grande diagonale longue', description: 'Coup principal défendu : trajectoire statistiquement la plus fréquente sur attaque Z4. Le libéro y est aligné.' },
    { id: 's6', startTime: 1.5, title: '6. Récupération + transition', description: 'Le libéro défend en manchette, le passeur revient au filet pour la 2ᵉ touche.' },
  ],
  summary: {
    keyPoints: [
      'Système 2-1-2 : 2 contreurs + 1 off-blocker (couvreur tip) + 2 défenseurs profonds.',
      'Recommandation : conserver le 5-1 du 6v6 en retirant un arrière non-passeur (configuration 3F-2B).',
      'Off-blocker à 2-2,5 m du filet, 1 m de la ligne — couvre la zone 3 m derrière le bloc.',
      'Lecture du jeu critique : ~30 m² par défenseur (vs 20 m² en 6v6), sécurité de placement initial réduite.',
      '« Stopped on contact » : arrêté et équilibré à l\'instant exact de la frappe.',
    ],
    commonMistakes: [
      'Bloc à 3 → seulement 1 défenseur au sol = point assuré.',
      'Off-blocker qui reste au filet → zone 3 m derrière le bloc à découvert.',
      'Pas de hiérarchie de priorité entre les 2 défenseurs profonds → 2 joueurs sur la même balle.',
      'Reproduire mécaniquement le 6v6 sans adapter les zones (le libéro ici doit couvrir plus large).',
    ],
  },
};

// Scenario D11 — 4v4 defense with single blocker (système A : 1 contreur + 3 défenseurs)
// 4v4 indoor n'a PAS de règlement FIVB officiel — pratiqué en intramurals, loisir, pédagogie.
// Configuration la plus répandue : 1 contreur + 3 défenseurs (cross, ligne, tip).
// Le bloc à 2 (système B) laisse seulement 2 défenseurs → à réserver aux gros frappeurs.
const DEFENSE_4V4_BLOCK_1: Scenario = {
  id: '4v4-defense-block-1',
  title: '4v4 · Défense système A (1 contreur + 3 défenseurs)',
  shortDescription: 'Système A en 4v4 (formation diamant) : 1 contreur solo + tip + cross + ligne. La configuration la plus répandue.',
  config: {
    teamSize: 4,
    phase: 'defense',
    contextLabel: '4v4 · Système A · 1 contreur + 3 défenseurs',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'Aile G (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.5] },
    { id: 'A2', label: 'Aile D (P2)', role: 'outside', color: COLORS.outside, position: [3, 0, 1.5] },
    { id: 'A', label: 'Arrière (P1)', role: 'opposite', color: COLORS.opposite, position: [0, 0, 6] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [-3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [-3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    // Single block: only the central
    { type: 'player_move', time: 0.4, id: 'C', to: [-2.0, 0, 0.3], duration: 0.5 },
    { type: 'player_move', time: 0.7, id: 'C', to: [-2.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    // Wing defenders cover diagonals
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 2.5], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'A2', to: [3.0, 0, 4], duration: 0.5 },
    // Lone arrière covers the deep zone
    { type: 'player_move', time: 0.5, id: 'A', to: [1.5, 0, 7], duration: 0.5 },
    // Opponent attacker (left side) approaches, jumps, then spikes
    { type: 'player_move', time: 0.7, id: 'OPP', to: [-3.0, 0, -1.2], duration: 0.2 },
    { type: 'player_move', time: 0.85, id: 'OPP', to: [-3.0, 1.8, -0.7], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 1.0, from: [-3.0, 3.0, -0.8], to: [1.5, 0.8, 6.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [-3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.5, id: 'A', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [1.5, 0.8, 6.5], to: [0, 2.5, 1.0], duration: 0.9, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Lecture attaque Z2 adverse', description: "Attaque adverse en sa zone 2 (sa droite) → arrive sur notre coin avant-GAUCHE. Avec 4 joueurs, chaque défenseur est crucial." },
    { id: 's2', startTime: 0.4, title: '2. Bloc solo du central (système A)', description: "Le central monte seul côté gauche, signal ligne ou diagonale obligatoire pour orienter les défenseurs arrière." },
    { id: 's3', startTime: 0.5, title: '3. Aile gauche (P4) : off-blocker / défenseur ligne', description: 'P4 redescend à mi-terrain (~3,5-4 m du filet) — couvre tip et feintes courtes côté gauche.' },
    { id: 's4', startTime: 0.5, title: '4. Aile droite (P2) : défenseur cross', description: 'P2 défend la grande diagonale longue cross-court (~7 m, 1 m de la ligne droite).' },
    { id: 's5', startTime: 0.5, title: '5. Arrière unique : défenseur tip / fond', description: "L'arrière P1 occupe l'axe central à 6-7 m du filet — couvre les feintes profondes ET les balles puissantes axiales." },
    { id: 's6', startTime: 1.0, title: '6. Frappe en grande diagonale longue', description: "Coup principal : la diagonale longue est statistiquement la plus fréquente." },
    { id: 's7', startTime: 1.5, title: '7. Récupération + transition', description: "L'arrière unique défend en manchette. Sa lecture doit être parfaite : aucun autre arrière pour compenser." },
  ],
  summary: {
    keyPoints: [
      'Système A (1 contreur + 3 défenseurs) : la configuration la plus répandue en 4v4 indoor.',
      'Signal contreur ligne/diagonale obligatoire — sans cela, les 3 défenseurs ne savent pas quoi couvrir.',
      'Distances clés : contreur 0,3 m du filet ; défenseurs profonds 7-7,5 m ; tip/arrière-bloc 3,5-4 m.',
      'Chaque défenseur couvre ~30-40 m² (vs 20 m² en 6v6) → anticipation = compétence n°1.',
      'Bloc à 2 (système B) réservé aux gros frappeurs : laisse seulement 2 défenseurs profonds.',
    ],
    commonMistakes: [
      'Contreur isolé sans couverture tip : les 3 défenseurs partent tous en profondeur, laissant la zone 3-5 m vide.',
      '2 défenseurs en ligne droite : côte à côte à la même profondeur → le cut shot tombe entre eux.',
      'Absence de signal entre contreur et défenseurs (ligne vs diagonale).',
      'Défenseur tip trop loin du filet : recule avec les arrières et ne peut plus couvrir les feintes courtes.',
      'Passeur qui court à sa cible avant que la balle soit défendue → trou en défense.',
    ],
  },
};

// Scenario D12 — 5v5 defense vs opponent zone 3 (central quick attack)
// Système 1-1-3 adapté : 1 contreur (central) + ailiers off-blockers + 2 défenseurs profonds.
// Avec seulement 2 défenseurs en fond, la couverture du fond axial (Z6 absent) est critique.
const DEFENSE_5V5_VS_Z3: Scenario = {
  id: '5v5-defense-vs-z3',
  title: '5v5 · Défense Z3 (rapide / tempo 1)',
  shortDescription: 'Bloc à 1 (central) sur attaque rapide centrale adverse en 5v5 — couverture axiale partielle.',
  config: { teamSize: 5, phase: 'defense', contextLabel: '5v5 · Bloc à 1 (read) · Lecture rapide' },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 5] },
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5] },
    { id: 'OPP', label: 'Central adverse', role: 'opponent', color: COLORS.opponent, position: [0, 0, -0.5] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [0, 2.5, -0.5], duration: 0.4, arc: 2.5 },
    { type: 'player_move', time: 0.2, id: 'C', to: [0, 1.6, 0.3], duration: 0.3 },
    { type: 'player_pose', time: 0.2, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 0.3, id: 'R4', to: [-3, 0, 1.5], duration: 0.3 },
    { type: 'player_move', time: 0.3, id: 'Op', to: [3, 0, 1.5], duration: 0.3 },
    { type: 'player_move', time: 0.2, id: 'OPP', to: [0, 1.6, -0.6], duration: 0.2 },
    { type: 'player_pose', time: 0.25, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 0.4, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 0.4, from: [0, 2.5, -0.5], to: [-2.5, 0.8, 5], duration: 0.5, arc: false },
    { type: 'player_move', time: 0.5, id: 'OPP', to: [0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 0.9, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.9, from: [-2.5, 0.8, 5], to: [1.5, 2.0, 1.0], duration: 0.8, arc: 3.5 },
    { type: 'player_move', time: 1.0, id: 'C', to: [0, 0, 0.4], duration: 0.4 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Passe rapide adverse (tempo 1)', description: 'Distribution tendue vers le central. 0,3-0,5 s entre passe et frappe.' },
    { id: 's2', startTime: 0.2, title: '2. Bloc à 1 (read)', description: 'Le central (P3) seul saute en LECTURE. Les ailiers (P4 + P2) reculent à 2 m du filet sur la ligne d\'attaque.' },
    { id: 's3', startTime: 0.4, title: '3. Frappe rapide en diagonale courte', description: "Angles courts par rapport à une haute balle. Le libéro (P5) en grande diagonale, le passeur (P1) sur la ligne droite — tous deux avancés à ~7 m." },
    { id: 's4', startTime: 0.9, title: '4. Récupération + transition', description: 'Le libéro fait la défense, le passeur revient à la cible pour la 2ᵉ touche.' },
  ],
  summary: {
    keyPoints: [
      'Bloc à 1 (P3 central) en lecture — pas de commitment possible sur quick.',
      'Ailiers (P4 + P2) à 2 m du filet sur la ligne d\'attaque : couvrent déviations de bloc.',
      'Avec seulement 2 défenseurs profonds (P5 + P1), la couverture du fond AXIAL est partielle.',
      'Z1 et Z5 AVANCENT d\'1 m (~7 m du filet) car les angles sont plus courts sur quick.',
      '« Stopped on contact » : tous arrêtés à l\'instant exact de la frappe.',
    ],
    commonMistakes: [
      'Bloc à 2 sur rapide → trop tard, et laisse 1 seul défenseur au sol.',
      'Défenseurs figés au fond (8 m+) → balle rapide tombe avant de bouger.',
      '« False stepping » (premier appui reculé) → temps perdu sur tempo 1.',
      'Off-blockers qui restent au filet → ne couvrent pas les déviations.',
    ],
  },
};

// Scenario D13 — 5v5 defense vs opponent zone 2 (mirror of Z4)
// Système 2-1-2 adapté : bloc à 2 (P4 R4 + P3 central) + off-blocker pointu (P2) + 2 défenseurs.
// Gestion critique : si le passeur est avant en P2, il contre puis doit transitionner immédiatement.
const DEFENSE_5V5_VS_Z2: Scenario = {
  id: '5v5-defense-vs-z2',
  title: '5v5 · Défense Z2',
  shortDescription: 'Miroir parfait de Z4. Système 2-1-2 sur attaque adverse Z2 (sa droite → arrive notre gauche).',
  config: { teamSize: 5, phase: 'defense', contextLabel: '5v5 · 2-1-2 · Bloc à 2 + off-blocker' },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 5] },
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [-3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [-3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 0.3, id: 'R4', to: [-3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.4, id: 'C', to: [-2.0, 0, 0.3], duration: 0.5 },
    { type: 'player_move', time: 0.5, id: 'Op', to: [3.0, 0, 1.5], duration: 0.5 },
    { type: 'player_move', time: 0.5, id: 'L', to: [-1.0, 0, 5.5], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'P', to: [3.0, 0, 5.5], duration: 0.4 },
    { type: 'player_move', time: 0.7, id: 'R4', to: [-3.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_move', time: 0.7, id: 'C', to: [-2.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'R4', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 0.7, id: 'OPP', to: [-3.0, 0, -1.2], duration: 0.2 },
    { type: 'player_move', time: 0.85, id: 'OPP', to: [-3.0, 1.8, -0.7], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 1.0, from: [-3.0, 3.0, -0.8], to: [3.0, 0.8, 5.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [-3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.5, id: 'P', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [3.0, 0.8, 5.5], to: [-1.0, 2.5, 1.0], duration: 0.9, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Lecture attaque Z2 adverse', description: "Attaque adverse en sa zone 2 (sa droite) → arrive sur notre coin avant-GAUCHE. Miroir parfait de Z4." },
    { id: 's2', startTime: 0.4, title: '2. Bloc à 2 (système 2-1-2)', description: 'R4 (P4) contreur ligne + central (P3) ferme la diagonale.' },
    { id: 's3', startTime: 0.5, title: '3. Off-blocker pointu (P2)', description: 'Le pointu (P2 = passeur en 5v5 3F-2B) décroche sur la ligne d\'attaque à 2-2,5 m du filet — anti-feinte + transition rapide vers la cible.' },
    { id: 's4', startTime: 0.5, title: '4. Couloirs profonds (2 défenseurs)', description: 'Libéro (~7-7,5 m, ligne gauche) défend la ligne profonde dans l\'ombre du bloc. Passeur arrière (P1, ~7 m) défend la grande diagonale longue cross-court.' },
    { id: 's5', startTime: 1.0, title: '5. Frappe en grande diagonale longue', description: "L'attaquant frappe en diagonale longue — le passeur (P1) récupère sur la trajectoire." },
    { id: 's6', startTime: 1.5, title: '6. Transition complexe', description: 'Si le passeur (P1) défend, le pointu (P2) doit relayer en 2ᵉ touche — communication impérative.' },
  ],
  summary: {
    keyPoints: [
      'Miroir parfait de Z4 en 5v5 : système 2-1-2 (bloc à 2 + off-blocker + 2 défenseurs).',
      'Bloc à 2 : R4 (P4) contreur ligne + central (P3) ferme la diagonale.',
      'Le pointu (P2) devient off-blocker côté droit, décroche sur les 3 m.',
      'Le passeur arrière (P1) défend en grande diagonale longue cross-court.',
      'Si le passeur défend → 2ᵉ touche par le pointu (contre-passeur) obligatoire.',
    ],
    commonMistakes: [
      'Pointu qui contre depuis Z2 → off-blocker absent côté droit.',
      'Passeur qui défend ET veut relayer → confusion sur la 2ᵉ touche.',
      'Libéro mal placé sur Z2 (défend ici la LIGNE, pas la grande diagonale).',
      'Communication absente entre passeur et pointu.',
    ],
  },
};

// Scenario D14 — 4v4 defense vs opponent zone 3 (central quick attack)
// Configuration la plus difficile en 4v4 : 1 seul contreur face à une attaque rapide centrale.
// Le contreur central doit être en LECTURE permanente (pas de commitment possible).
// Le doc 4v4 note que la rapide centrale est « une vraie faiblesse du 4v4 ».
const DEFENSE_4V4_VS_Z3: Scenario = {
  id: '4v4-defense-vs-z3',
  title: '4v4 · Défense Z3 (rapide centrale)',
  shortDescription: 'Attaque rapide centrale adverse en 4v4 : bloc à 1 (read) + 3 défenseurs. La config la plus difficile à défendre.',
  config: { teamSize: 4, phase: 'defense', contextLabel: '4v4 · Bloc à 1 (read) · Faiblesse structurelle' },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'Aile G (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.5] },
    { id: 'A2', label: 'Aile D (P2)', role: 'outside', color: COLORS.outside, position: [3, 0, 1.5] },
    { id: 'A', label: 'Arrière (P1)', role: 'opposite', color: COLORS.opposite, position: [0, 0, 6] },
    { id: 'OPP', label: 'Central adverse', role: 'opponent', color: COLORS.opponent, position: [0, 0, -0.5] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [0, 2.5, -0.5], duration: 0.4, arc: 2.5 },
    { type: 'player_move', time: 0.2, id: 'C', to: [0, 1.6, 0.3], duration: 0.3 },
    { type: 'player_pose', time: 0.2, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 0.3, id: 'R4', to: [-3, 0, 2], duration: 0.3 },
    { type: 'player_move', time: 0.3, id: 'A2', to: [3, 0, 2], duration: 0.3 },
    { type: 'player_move', time: 0.2, id: 'OPP', to: [0, 1.6, -0.6], duration: 0.2 },
    { type: 'player_pose', time: 0.25, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 0.4, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 0.4, from: [0, 2.5, -0.5], to: [0, 0.8, 6.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 0.5, id: 'OPP', to: [0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 0.9, id: 'A', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.9, from: [0, 0.8, 6.5], to: [1.5, 2.5, 1.0], duration: 0.8, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Passe rapide centrale adverse', description: 'En 4v4 la rapide centrale (tempo 1) est l\'attaque la plus dangereuse car 1 seul contreur disponible.' },
    { id: 's2', startTime: 0.2, title: '2. Bloc à 1 en lecture', description: 'Le central (P3) seul saute. LECTURE obligatoire — pas de commitment block en 4v4 (le central est aussi notre meilleur défenseur tip).' },
    { id: 's3', startTime: 0.3, title: '3. Ailes latérales en couverture courte', description: 'Les 2 ailes (P4 + P2) reculent à mi-terrain (~3,5-4 m) et couvrent chacune une diagonale courte.' },
    { id: 's4', startTime: 0.4, title: '4. Frappe puissante axiale', description: "L'attaque rapide va plutôt en axe central profond car le bloc à 1 ne couvre que le centre étroit." },
    { id: 's5', startTime: 0.9, title: '5. Arrière unique : pivot défensif', description: "L'arrière P1 (idéalement à 7-8 m, axe central) défend la balle puissante traversant le bloc — sa lecture doit être PARFAITE." },
  ],
  summary: {
    keyPoints: [
      "Le doc 4v4 le confirme : la rapide centrale est UNE VRAIE FAIBLESSE du 4v4 (1 seul contreur).",
      'Bloc à 1 en LECTURE : pas de commitment possible avec un central défenseur.',
      "Les 2 ailes couvrent les 2 diagonales courtes à mi-terrain (~3,5-4 m du filet).",
      "L'arrière unique est le pivot défensif — il joue le rôle de Z6 du 6v6 sur l'axe central.",
      "Anticipation = compétence n°1 : avec ~40 m² à couvrir, l'erreur de lecture est non-rattrapable.",
    ],
    commonMistakes: [
      'Bloc à 2 sur rapide → seulement 2 défenseurs au sol, diagonales largement ouvertes.',
      "Arrière qui avance trop tôt → balle profonde tombe derrière lui.",
      "Ailes qui restent au filet sans contrer → trous sur les 3 m derrière le bloc.",
      "Lecture trop tardive du central adverse → on subit l'attaque sans bouger.",
    ],
  },
};

// Scenario D15 — 4v4 defense vs opponent zone 2 (mirror of D11/Z4 example)
// Convention FIVB : attaque adverse Z2 (sa droite) → balle arrive sur NOTRE coin avant-GAUCHE.
// Système A miroir : C glisse à gauche pour bloquer, R4 (aile gauche) off-blocker, A2 (aile droite) défenseur cross.
const DEFENSE_4V4_VS_Z2: Scenario = {
  id: '4v4-defense-vs-z2',
  title: '4v4 · Défense Z2',
  shortDescription: 'Miroir système A : 1 contreur + 3 défenseurs sur attaque adverse Z2 (sa droite → arrive notre gauche).',
  config: { teamSize: 4, phase: 'defense', contextLabel: '4v4 · Système A · 1 contreur + 3 défenseurs' },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'Aile G (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.5] },
    { id: 'A2', label: 'Aile D (P2)', role: 'outside', color: COLORS.outside, position: [3, 0, 1.5] },
    { id: 'A', label: 'Arrière (P1)', role: 'opposite', color: COLORS.opposite, position: [0, 0, 6] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [-3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [-3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 0.4, id: 'C', to: [-2.0, 0, 0.3], duration: 0.5 },
    { type: 'player_move', time: 0.7, id: 'C', to: [-2.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 2.5], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'A2', to: [3.0, 0, 4], duration: 0.5 },
    { type: 'player_move', time: 0.5, id: 'A', to: [1.5, 0, 7], duration: 0.5 },
    { type: 'player_move', time: 0.7, id: 'OPP', to: [-3.0, 0, -1.2], duration: 0.2 },
    { type: 'player_move', time: 0.85, id: 'OPP', to: [-3.0, 1.8, -0.7], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 1.0, from: [-3.0, 3.0, -0.8], to: [1.5, 0.8, 6.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [-3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.5, id: 'A', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [1.5, 0.8, 6.5], to: [0, 2.5, 1.0], duration: 0.9, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Lecture attaque Z2 adverse', description: "Attaque adverse en sa zone 2 (sa droite) → arrive sur notre coin avant-GAUCHE. Miroir de D11 (qui est aussi Z2)." },
    { id: 's2', startTime: 0.4, title: '2. Bloc solo central', description: 'Le central (P3) glisse côté gauche et bloque seul face à l\'attaquant. Signal ligne/diagonale obligatoire.' },
    { id: 's3', startTime: 0.5, title: '3. Aile gauche (P4) : off-blocker / défenseur ligne', description: 'P4 décroche sur les 3 m à 2-2,5 m du filet — couvre tip et feintes côté gauche.' },
    { id: 's4', startTime: 0.5, title: '4. Aile droite (P2) : défenseur grande diagonale', description: 'P2 défend la grande diagonale longue cross-court (~7 m, 1 m de la ligne droite).' },
    { id: 's5', startTime: 1.0, title: '5. Frappe en grande diagonale longue', description: "L'attaque va en cross-court vers notre coin arrière-droit." },
    { id: 's6', startTime: 1.5, title: '6. Arrière unique : axe central', description: "L'arrière P1 (sur l'axe, légèrement décalé côté ballon) défend en manchette — sa lecture compense l'absence d'autres arrières." },
  ],
  summary: {
    keyPoints: [
      'Miroir parfait de Z4 en 4v4 : système A (1 contreur + 3 défenseurs).',
      'P3 contreur solo côté gauche, signal ligne/diagonale obligatoire.',
      "P4 (aile gauche) en off-blocker à 3,5-4 m du filet — couverture courte et feintes.",
      "P2 (aile droite) défend la petite diagonale courte (~7 m, ligne droite).",
      "L'arrière unique P1 défend la grande diagonale longue cross-court.",
    ],
    commonMistakes: [
      'Aile gauche P4 qui contre avec le central → off-blocker absent côté gauche.',
      "Arrière unique trop avancé → balle profonde cross-court non couverte.",
      "Contreur sans signal → les 3 défenseurs ne savent pas quoi couvrir.",
      "P2 trop loin du filet → ne couvre pas la diagonale courte.",
    ],
  },
};

export const DEFENSE_SCENARIOS: Scenario[] = [
  DEFENSE_VS_Z4,
  DEFENSE_VS_Z3,
  DEFENSE_VS_Z2,
  DEFENSE_VS_PIPE,
  DEFENSE_6_FRONT,
  DEFENSE_PERIMETER,
  DEFENSE_ROTATION,
  DEFENSE_READ,
  ATTACK_COVERAGE,
  DEFENSE_5V5_VS_Z4,
  DEFENSE_5V5_VS_Z3,
  DEFENSE_5V5_VS_Z2,
  DEFENSE_4V4_BLOCK_1,
  DEFENSE_4V4_VS_Z3,
  DEFENSE_4V4_VS_Z2,
];

export { opponentAttacker };
