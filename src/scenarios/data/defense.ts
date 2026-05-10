import type { Scenario } from '../types';
import { COLORS, opponentAttacker } from './_shared';

// Scenario D1 — 6v6 defense vs opponent zone 4 attack (block à 2 + 6 arrière)
const DEFENSE_VS_Z4: Scenario = {
  id: '6v6-defense-vs-z4',
  title: 'Défense · attaque adverse Z4',
  shortDescription: 'Block à 2 sur attaque adverse depuis la zone 4 (notre côté droit) avec défense au sol en système 6 arrière.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Block à 2 · Défense 6 arrière',
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
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.outside, position: [0, 0, 4.5] },
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
    // Notre block forme : Op (P2) fixe la ligne, C (P3) ferme la diagonale
    { type: 'player_move', time: 0.5, id: 'Op', to: [3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'C', to: [2.0, 0, 0.3], duration: 0.5 },
    // R4 redescend sur les 3 m côté opposé (off-blocker)
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 2.8], duration: 0.5 },
    // Libéro (P5) glisse en grande diagonale (gros déplacement visible)
    { type: 'player_move', time: 0.5, id: 'L', to: [-2.5, 0, 6.5], duration: 0.6 },
    // P6 (R4b) bascule vers l'ombre du block (légèrement à gauche du centre)
    { type: 'player_move', time: 0.5, id: 'R4b', to: [-0.8, 0, 5.5], duration: 0.5 },
    // Passeur (P1) recule sur la ligne droite du fond (grande diag courte)
    { type: 'player_move', time: 0.5, id: 'P', to: [3.8, 0, 7.5], duration: 0.5 },

    // ── Phase 3 : décollage du block + attaquant en l'air ──
    { type: 'player_move', time: 0.85, id: 'Op', to: [3.0, 1.6, 0.3], duration: 0.15 },
    { type: 'player_move', time: 0.85, id: 'C', to: [2.0, 1.6, 0.3], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'Op', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'C', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_move', time: 0.9, id: 'OPP', to: [3.2, 1.8, -0.7], duration: 0.1 },
    { type: 'player_pose', time: 0.9, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.1 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },

    // ── Phase 4 : frappe en grande diagonale longue ──
    { type: 'ball_move', time: 1.0, from: [3.2, 3.0, -0.8], to: [-2.5, 1.0, 6.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'Op', to: [3.0, 0, 0.5], duration: 0.2 },
    { type: 'player_move', time: 1.1, id: 'C', to: [2.0, 0, 0.5], duration: 0.2 },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [3.2, 0, -0.6], duration: 0.3 },

    // ── Phase 5 : défense du libéro + rentrée du passeur ──
    { type: 'player_pose', time: 1.5, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [-2.5, 1.0, 6.5], to: [2.0, 2.5, 1.0], duration: 0.8, arc: 3.5 },
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
    { id: 's1', startTime: 0, title: '1. Réception adverse + pénétration du passeur', description: "Leur arrière reçoit le service (BUMP). Le passeur adverse pénètre vers la zone 2-3. Notre ligne défensive lit la trajectoire (READY, jambes fléchies)." },
    { id: 's2', startTime: 0.4, title: '2. Passe en cloche vers Z4', description: 'Le passeur distribue vers son ailier en zone 4 (notre côté droit). Notre ligne avant identifie la zone d\'attaque.' },
    { id: 's3', startTime: 0.5, title: '3. Block + glissement défensif', description: "P2 (pointu) fixe la ligne, le central (P3) ferme la diagonale. Le R4 redescend sur les 3 m (off-blocker) — le libéro glisse en grande diagonale, le P6 dans l'ombre du block, le passeur recule sur la ligne." },
    { id: 's4', startTime: 0.85, title: '4. Décollage simultané', description: 'Saut du block à 2, mains au-dessus du filet. L\'attaquant arme dans le même temps.' },
    { id: 's5', startTime: 1.0, title: '5. Frappe en diagonale longue', description: "L'attaquant frappe — le ballon traverse en grande diagonale vers notre zone 5. Le block dévie ou laisse passer." },
    { id: 's6', startTime: 1.5, title: '6. Défense du libéro', description: `Le libéro récupère en manchette dans sa zone prioritaire — annonce vocale "J'ai !".` },
    { id: 's7', startTime: 1.5, title: '7. Sprint du passeur au filet', description: "Notre passeur, qui n'a pas contré, arrive vite au filet pour la 2ᵉ touche. Le passeur adverse se replie pour défendre." },
    { id: 's8', startTime: 2.3, title: '8. Distribution & contre-attaque', description: "Passe en suspension. Pointu, central et R4 se présentent en course d'élan pour finir le rally." },
    { id: 's9', startTime: 3.2, title: '9. RESET — retour à la base', description: "Après chaque échange, on REVIENT à sa position de base. Un placement sûr est la condition pour défendre le coup suivant — c'est vital." },
  ],
  summary: {
    keyPoints: [
      'Block à 2 standard : ailier fixe la ligne, central ferme la diagonale.',
      'Off-blocker (R4 côté opposé) recule sur les 3 m pour les feintes courtes.',
      'Système 6 arrière : libéro en grande diagonale, P6 dans l\'ombre du block, P1 sur la ligne droite.',
      'Le libéro a la priorité défensive et coordonne verbalement.',
    ],
    commonMistakes: [
      'Block ouvert non intentionnel → balle passe entre les contreurs.',
      'Off-blocker qui reste au filet → ombre du block non couverte.',
      "Passeur qui contre puis n'arrive pas au filet → 2ᵉ touche par un joueur non spécialisé.",
    ],
  },
};

// Scenario D2 — 6v6 defense vs opponent zone 3 (fast central attack)
const DEFENSE_VS_Z3: Scenario = {
  id: '6v6-defense-vs-z3',
  title: 'Défense · attaque adverse Z3 (rapide)',
  shortDescription: 'Bloc individuel sur attaque rapide centrale adverse — défense en lecture rapide.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Block à 1 · Défense rapide',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    // Notre équipe en positions ready (légèrement spread pour mouvement visible)
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 1.0] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 1.0] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.0] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 4.5] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.outside, position: [0, 0, 5] },
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

    // ── Phase 3 : frappe rapide en diagonale ──
    { type: 'ball_move', time: 0.4, from: [0, 2.5, -0.5], to: [3, 0.8, 4], duration: 0.5, arc: false },
    // Pendant la frappe, les arrières lisent et glissent
    { type: 'player_move', time: 0.4, id: 'P', to: [3.5, 0, 4], duration: 0.5 },
    { type: 'player_move', time: 0.4, id: 'L', to: [-2, 0, 5], duration: 0.5 },
    { type: 'player_move', time: 0.4, id: 'R4b', to: [0, 0, 6], duration: 0.5 },
    // Block + central retombent
    { type: 'player_move', time: 0.5, id: 'C', to: [0, 0, 0.4], duration: 0.3 },
    { type: 'player_move', time: 0.5, id: 'OPP', to: [0, 0, -1], duration: 0.3 },

    // ── Phase 4 : récupération du passeur (P) côté ligne droite ──
    { type: 'player_pose', time: 0.9, id: 'P', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.9, from: [3, 0.8, 4], to: [1.5, 2.2, 1.0], duration: 0.8, arc: 3.5 },
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
    { id: 's1', startTime: 0, title: '1. Réception adverse + pénétration éclair', description: "Leur arrière reçoit (BUMP). Le passeur sprint pour une rapide. Tempo 1 : tout est très rapide. Notre équipe lit en READY position." },
    { id: 's2', startTime: 0.2, title: '2. Passe tendue + central en l\'air', description: "Le passeur lance tendu vers le central, qui a déjà commencé sa course et décolle juste avant la passe." },
    { id: 's3', startTime: 0.2, title: '3. Bloc à 1 + ailes latérales', description: 'Notre central seul saute (commit ou read). R4 et pointu reculent latéralement sur les 3 m pour les diagonales courtes.' },
    { id: 's4', startTime: 0.4, title: '4. Frappe rapide en diagonale', description: "Frappe à plat, peu angulée. Le passeur arrière (P) en lecture avancée se positionne pour récupérer." },
    { id: 's5', startTime: 0.9, title: '5. Manchette défensive', description: 'Le passeur récupère en manchette dans son couloir. Trajectoire haute vers la zone 2-3.' },
    { id: 's6', startTime: 1.5, title: '6. Le pointu prend la 2ᵉ touche', description: 'Comme notre passeur a défendu, le pointu (en P2) prend la 2ᵉ touche pour distribuer la contre-attaque.' },
    { id: 's7', startTime: 2.5, title: '7. RESET — retour à la base', description: "Après chaque échange, retour à la position de base. C'est vital : sans bon placement, on est en retard sur le coup suivant." },
  ],
  summary: {
    keyPoints: [
      'Bloc à 1 sur la rapide centrale : seul le central saute.',
      'Choix tactique : commit block (avec le central adverse) ou read block (attendre la passe).',
      'Les ailiers reculent latéralement sur les 3 m — pas en arrière complet.',
      'Le passeur arrière (P1) est en lecture avancée sur la rapide.',
    ],
    commonMistakes: [
      'Tous les avants sautent → laisse les ailes ouvertes pour la passe suivante.',
      'Bloc trop tardif → balle passe au-dessus des mains.',
      "Défenseurs figés en fond → balle rapide tombe avant qu'ils n'aient bougé.",
    ],
  },
};

// Scenario D3 — 6v6 defense vs opponent zone 2 (mirror of Z4)
const DEFENSE_VS_Z2: Scenario = {
  id: '6v6-defense-vs-z2',
  title: 'Défense · attaque adverse Z2',
  shortDescription: 'Block à 2 sur attaque adverse en zone 2 (notre côté gauche). R4 fixe la ligne, central ferme la diagonale.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Block à 2 · Défense 6 arrière',
  },
  defaultCamera: 'DEFAULT',
  players: [
    // Notre équipe en positions ready spread
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5.5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 1.2] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 1.2] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.2] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 4.5] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.outside, position: [0, 0, 4.5] },
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

    // ── Phase 2 : passe en cloche vers Z2 + glissement défensif ──
    { type: 'player_pose', time: 0.4, id: 'OPP_S', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 0.4, from: [1.8, 1.8, -0.8], to: [-3.2, 3.0, -0.8], duration: 0.6, arc: 4.0 },
    { type: 'player_move', time: 0.4, id: 'OPP', to: [-3.2, 0, -1.5], duration: 0.4 },
    // Notre block : R4 fixe la ligne, C ferme la diagonale (symétrique de Z4)
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'C', to: [-2.0, 0, 0.3], duration: 0.5 },
    // Pointu (Op) recule en off-blocker
    { type: 'player_move', time: 0.5, id: 'Op', to: [3.0, 0, 2.8], duration: 0.5 },
    // Libéro glisse en grande diagonale (gros déplacement vers la droite)
    { type: 'player_move', time: 0.5, id: 'L', to: [-1, 0, 6.5], duration: 0.6 },
    // P6 (R4b) bascule dans l'ombre du block (à droite du centre)
    { type: 'player_move', time: 0.5, id: 'R4b', to: [0.8, 0, 5.5], duration: 0.5 },
    // Passeur (P1) recule sur la ligne droite
    { type: 'player_move', time: 0.5, id: 'P', to: [3.8, 0, 7.5], duration: 0.5 },

    // ── Phase 3 : décollage du block + attaquant en l'air ──
    { type: 'player_move', time: 0.85, id: 'R4', to: [-3.0, 1.6, 0.3], duration: 0.15 },
    { type: 'player_move', time: 0.85, id: 'C', to: [-2.0, 1.6, 0.3], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'R4', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'C', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_move', time: 0.9, id: 'OPP', to: [-3.2, 1.8, -0.7], duration: 0.1 },
    { type: 'player_pose', time: 0.9, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.1 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },

    // ── Phase 4 : frappe en grande diagonale longue ──
    { type: 'ball_move', time: 1.0, from: [-3.2, 3.0, -0.8], to: [3.0, 1.0, 6.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'R4', to: [-3.0, 0, 0.5], duration: 0.2 },
    { type: 'player_move', time: 1.1, id: 'C', to: [-2.0, 0, 0.5], duration: 0.2 },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [-3.2, 0, -0.6], duration: 0.3 },

    // ── Phase 5 : le passeur défend en grande diagonale ──
    { type: 'player_pose', time: 1.5, id: 'P', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [3.0, 1.0, 6.5], to: [-1.0, 2.5, 1.0], duration: 0.8, arc: 3.5 },
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
    { id: 's1', startTime: 0, title: '1. Réception adverse + pénétration', description: "Leur arrière reçoit (BUMP). Le passeur adverse pénètre depuis sa P1 vers la zone 2-3. Notre équipe lit la trajectoire (READY)." },
    { id: 's2', startTime: 0.4, title: '2. Passe en cloche vers Z2', description: "Le passeur distribue vers son R4 en zone 2 — l'attaque arrive sur notre côté gauche." },
    { id: 's3', startTime: 0.5, title: '3. Block + glissement défensif', description: "R4 fixe la ligne, C ferme la diagonale. Pointu off-blocker à droite (3 m). Libéro glisse en grande diag, P6 ombre du block, P1 ligne droite." },
    { id: 's4', startTime: 0.85, title: '4. Décollage simultané', description: 'Bloc à 2 (R4 + C) saute, l\'attaquant arme dans le même temps.' },
    { id: 's5', startTime: 1.0, title: '5. Frappe en diagonale longue', description: "Frappe en grande diagonale vers notre zone 1. Le passeur (en P1) est sur la trajectoire." },
    { id: 's6', startTime: 1.5, title: '6. Le passeur défend', description: 'Manchette défensive — mais maintenant qui fait la 2ᵉ touche ?' },
    { id: 's7', startTime: 1.7, title: '7. Le pointu prend le relais', description: 'Le pointu (P2) sort de l\'off-blocker pour faire la 2ᵉ touche. Communication impérative.' },
    { id: 's8', startTime: 2.3, title: '8. Distribution de secours', description: 'Passe en touche par le pointu — souvent vers le R4 ou central qui sont disponibles.' },
    { id: 's9', startTime: 3.2, title: '9. RESET — retour à la base', description: "Après chaque échange, retour à la position de base. C'est vital : tout dépend du placement initial pour la suite." },
  ],
  summary: {
    keyPoints: [
      'Symétrique du block vs Z4 : R4 fixe la ligne, central ferme la diagonale.',
      'Le pointu (P2) devient off-blocker côté droit.',
      'Le passeur (P1) défend dans la grande diagonale.',
      'Si le passeur défend → 2ᵉ touche par le pointu obligatoire.',
    ],
    commonMistakes: [
      'Pointu qui contre depuis la zone 2 → off-blocker absent.',
      'Central qui ne descend pas assez bas vers la zone 4 → bloc ouvert.',
      'Passeur qui défend ET veut relayer → confusion sur la 2ᵉ touche.',
    ],
  },
};

// Scenario D4 — 6v6 defense vs pipe (back-row attack from zone 6)
const DEFENSE_VS_PIPE: Scenario = {
  id: '6v6-defense-vs-pipe',
  title: 'Défense · attaque pipe adverse',
  shortDescription: 'Défense face à une pipe adverse : bloc central + périmètre profond.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Block central · Défense périmétrique',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 3.5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 7] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.outside, position: [0, 0, 7] },
    { id: 'OPP', label: 'Pipe adverse', role: 'opponent', color: COLORS.opponent, position: [0, 0, -4] },
  ],
  initialBallPosition: [0, 2.0, -2],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -2], to: [0, 3.0, -3.5], duration: 0.5, arc: 3.5 },
    { type: 'player_move', time: 0.2, id: 'C', to: [0, 1.6, 0.3], duration: 0.3 },
    { type: 'player_pose', time: 0.2, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    // Both wings recede to the 3m line
    { type: 'player_move', time: 0.3, id: 'R4', to: [-3, 0, 1.5], duration: 0.4 },
    { type: 'player_move', time: 0.3, id: 'Op', to: [3, 0, 1.5], duration: 0.4 },
    // Libero and R4b spread to deep periphery
    { type: 'player_move', time: 0.3, id: 'L', to: [-3.5, 0, 7.5], duration: 0.4 },
    { type: 'player_move', time: 0.3, id: 'R4b', to: [0, 0, 8], duration: 0.4 },
    { type: 'player_move', time: 0.3, id: 'P', to: [3.5, 0, 7.5], duration: 0.4 },
    // Pipe attacker — back-row attack, jumps from behind 3m line
    { type: 'player_move', time: 0.25, id: 'OPP', to: [0, 0, -4.5], duration: 0.15 },
    { type: 'player_move', time: 0.4, id: 'OPP', to: [0, 1.6, -3.5], duration: 0.1 },
    { type: 'player_pose', time: 0.35, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 0.5, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 0.5, from: [0, 3.0, -3.5], to: [0, 0.8, 7], duration: 0.7, arc: false },
    { type: 'player_move', time: 0.6, id: 'OPP', to: [0, 0, -4], duration: 0.3 },
    { type: 'player_pose', time: 1.2, id: 'R4b', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.2, from: [0, 0.8, 7], to: [1.5, 2.0, 1.0], duration: 0.8, arc: 3.5 },
    { type: 'player_move', time: 1.2, id: 'C', to: [0, 0, 0.4], duration: 0.4 },
    { type: 'player_pose', time: 2.0, id: 'P', pose: 'SET', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Passe adverse en pipe', description: "Trajectoire tendue vers le centre arrière de l'adversaire. Le central de l'attaque adverse entre en course." },
    { id: 's2', startTime: 0.2, title: '2. Bloc central seul', description: 'Notre central saute au centre du filet. Souvent bloc à 1 car les ailiers ne peuvent pas revenir vite.' },
    { id: 's3', startTime: 0.3, title: '3. Off-blockers reculés', description: 'R4 et pointu redescendent sur les 3 m côté opposé pour défendre les balles profondes.' },
    { id: 's4', startTime: 0.3, title: '4. Périmètre profond', description: "Libéro, R4b et passeur s'étalent en triangle profond. La pipe va loin et droit." },
    { id: 's5', startTime: 0.5, title: '5. Frappe profonde', description: 'La pipe est puissante et va profond — le R4b ou le libéro doit défendre droit devant.' },
    { id: 's6', startTime: 1.2, title: '6. Récupération profonde', description: 'Le R4b fait une manchette profonde vers le passeur qui revient au filet.' },
  ],
  summary: {
    keyPoints: [
      'Pipe = attaque arrière au centre, vise le cœur du terrain.',
      'Bloc à 1 (central) ou off-blocker en aide selon élan adverse.',
      'Périmètre profond obligatoire : 3 défenseurs en triangle au fond.',
      "Difficile à défendre car pas d'ombre de bloc protectrice.",
    ],
    commonMistakes: [
      "Bloc à 2 sur pipe → laisse les ailes ouvertes pour l'attaque suivante.",
      'Défenseurs trop avancés sur les 3 m → balle profonde tombe.',
      'Off-blockers qui restent au filet → centre du terrain à découvert.',
    ],
  },
};

// Scenario D5 — 6v6 defense in 6-front (middle-up) system, anti-feinte
const DEFENSE_6_FRONT: Scenario = {
  id: '6v6-defense-6-front',
  title: 'Défense · système 6 avant',
  shortDescription: 'Défense "6 avant" : le P6 avance dans la zone des 3m pour récupérer les feintes courtes.',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Block à 2 · Défense 6 avant (anti-feinte)',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-3, 0, 5] },
    { id: 'R4b', label: 'R4 (P6 avancé)', role: 'outside', color: COLORS.outside, position: [0, 0, 2.5] },
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
    { id: 's1', startTime: 0, title: '1. Passe adverse en Z4', description: "Lecture habituelle. Mais l'adversaire est connu pour ses feintes." },
    { id: 's2', startTime: 0.4, title: '2. Bloc à 2 standard', description: 'Pointu et central forment le bloc comme en 6 arrière.' },
    { id: 's3', startTime: 0.5, title: '3. P6 avance', description: "Différence-clé : le R4 en P6 avance dans la zone des 3 m, dans l'ombre du bloc." },
    { id: 's4', startTime: 0.5, title: '4. Compensation profonde', description: "Libéro et passeur reculent jusqu'à la ligne de fond pour couvrir les balles longues." },
    { id: 's5', startTime: 1.0, title: '5. Feinte adverse', description: "L'attaquant adverse choisit la feinte plutôt que le smash. La balle tombe juste derrière le bloc." },
    { id: 's6', startTime: 1.6, title: '6. Récupération courte', description: 'Le P6 avancé est exactement où la balle tombe. Manchette précise vers le pointu pour relancer.' },
  ],
  summary: {
    keyPoints: [
      'Système "6 avant" (middle-up, 2-1-3) : optimisé contre les feintes.',
      "Le P6 avance dans l'ombre du bloc, à la limite des 3 m.",
      'Libéro et P1/P5 reculent pour couvrir les balles longues.',
      'Adapté contre le volley féminin, jeunes, équipes techniques.',
    ],
    commonMistakes: [
      'Garder le système 6 arrière contre une équipe qui feinte → balles courtes perdues.',
      "P6 trop avancé (au filet) → bloqué dans l'élan du contre.",
      'Libéro qui ne recule pas → trou en arrière.',
    ],
  },
};

// Scenario D6 — 6v6 perimeter defense (all 4 defenders on the lines)
const DEFENSE_PERIMETER: Scenario = {
  id: '6v6-defense-perimeter',
  title: 'Défense · périmétrique',
  shortDescription: 'Les 4 défenseurs sur le périmètre du terrain : "ce qui est sur la ligne est à moi".',
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Block à 2 · Défense périmétrique',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [4, 0, 8] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-4, 0, 8] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.outside, position: [0, 0, 8.5] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 0.3, id: 'Op', to: [3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.4, id: 'C', to: [2.0, 0, 0.3], duration: 0.5 },
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 1.5], duration: 0.5 },
    // All 4 defenders on the perimeter lines
    { type: 'player_move', time: 0.5, id: 'L', to: [-4.4, 0, 8.5], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'R4b', to: [0, 0, 8.8], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'P', to: [4.4, 0, 8.5], duration: 0.4 },
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
    { id: 's1', startTime: 0, title: '1. Configuration périmétrique', description: 'Les 4 défenseurs ont un pied sur les lignes du terrain : grand rectangle.' },
    { id: 's2', startTime: 0.4, title: '2. Bloc à 2 standard', description: 'Le bloc forme le rideau habituel. La défense au sol prend le relais sur ce qui passe.' },
    { id: 's3', startTime: 0.5, title: '3. Tous sur les lignes', description: 'Libéro sur la ligne gauche, P6 sur la ligne de fond, P1 sur la ligne droite. Ils identifient facilement les balles "out".' },
    { id: 's4', startTime: 1.0, title: '4. Block-out long', description: "L'attaque puissante part en diagonale longue qui touche le bloc." },
    { id: 's5', startTime: 1.6, title: '5. Récupération en couloir', description: 'Le libéro récupère sur la ligne — couverture périphérique parfaite.' },
  ],
  summary: {
    keyPoints: [
      'Défense périmétrique : 4 défenseurs sur les lignes (grand rectangle).',
      'Logique : "ce qui est sur la ligne est à moi, ce qui est dedans aussi".',
      'Excellente identification des balles "out" et défense des block-outs.',
      'Centre du terrain et ombre du bloc sont vulnérables aux feintes.',
    ],
    commonMistakes: [
      'Défenseurs qui se replient au centre → ne couvrent plus les lignes.',
      'Système choisi contre une équipe qui feinte → centre du terrain à découvert.',
      'Libéro non habitué → mauvaise lecture des balles "out" sur les côtés.',
    ],
  },
};

// Scenario D7 — 6v6 rotational defense (rotate toward attack zone)
const DEFENSE_ROTATION: Scenario = {
  id: '6v6-defense-rotation',
  title: 'Défense · en rotation',
  shortDescription: "Défense rotationnelle : les défenseurs tournent en arc autour du bloc vers la zone d'attaque.",
  config: {
    teamSize: 6,
    phase: 'defense',
    contextLabel: '5-1 · Block à 2 · Rotational defense',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 3.5] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.4] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 5] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.outside, position: [0, 0, 5] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 0.3, id: 'Op', to: [3.0, 0, 0.3], duration: 0.4 },
    { type: 'player_move', time: 0.4, id: 'C', to: [2.0, 0, 0.3], duration: 0.5 },
    // R4 (off-blocker) descends to 3m line on the line side
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 2.0], duration: 0.4 },
    // Libero rotates from P5 toward the strong diagonal (deep right)
    { type: 'player_move', time: 0.5, id: 'L', to: [-1.0, 0, 7], duration: 0.5 },
    // P6 rotates with the libero
    { type: 'player_move', time: 0.5, id: 'R4b', to: [-3.0, 0, 5.5], duration: 0.5 },
    // P1 stays on the right line
    { type: 'player_move', time: 0.5, id: 'P', to: [3.5, 0, 5], duration: 0.4 },
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
    { type: 'ball_move', time: 1.0, from: [3.0, 3.0, -0.8], to: [-1.0, 0.8, 7], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.5, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [-1.0, 0.8, 7], to: [1.5, 2.5, 1.0], duration: 0.9, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: "1. Lecture de l'attaque Z4", description: "L'attaque arrive à droite de l'adversaire = à droite de notre côté." },
    { id: 's2', startTime: 0.4, title: '2. Bloc à 2 standard', description: 'Pointu et central forment le bloc côté droit.' },
    { id: 's3', startTime: 0.5, title: '3. Rotation côté ballon', description: 'Le R4 redescend en zone 4 sur la ligne courte. Le libéro bascule en grande diagonale (côté ballon).' },
    { id: 's4', startTime: 0.5, title: '4. P6 et P1 ajustent', description: 'Le P6 (R4b) glisse côté gauche pour compenser. Le P1 reste sur la ligne droite.' },
    { id: 's5', startTime: 1.0, title: '5. Frappe diagonale', description: "80% des smashs vont en diagonale forte. Le libéro est exactement à l'arrivée." },
    { id: 's6', startTime: 1.5, title: '6. Récupération en diagonale', description: 'Le libéro défend dans sa zone optimale. Transition fluide vers la contre-attaque.' },
  ],
  summary: {
    keyPoints: [
      "Rotation defense (3-2-1 ou 3-1-2) : tous tournent vers la zone d'attaque.",
      '80 % des smashs vont en diagonale forte → libéro y est placé prioritairement.',
      "L'off-blocker du côté opposé recule sur les 3 m côté opposé.",
      'Système le plus courant chez les jeunes/intermédiaires car simple à enseigner.',
    ],
    commonMistakes: [
      'Rotation incomplète → trous dans la couverture.',
      'Vulnérable aux line shots (changement de direction).',
      "Confusion entre rotate (vers ballon) et counter-rotate (à l'opposé).",
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
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.outside, position: [0, 0, 5] },
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
    { id: 's1', startTime: 0, title: '1. Position de base neutre', description: 'Tous les défenseurs en position de lecture, jambes fléchies, pieds parallèles, regard sur le passeur adverse.' },
    { id: 's2', startTime: 0.3, title: '2. Lecture de la passe', description: "Dès que le ballon quitte les mains du passeur adverse → ajustement vers la zone d'attaque (ici Z2)." },
    { id: 's3', startTime: 0.6, title: "3. Lecture de l'attaquant", description: "Course d'élan + orientation du bras armé + épaules → indices visuels en temps réel." },
    { id: 's4', startTime: 0.6, title: '4. Ajustement final', description: 'Le libéro bascule en grande diagonale, le R4b en milieu profond. Tout le monde lit en parallèle.' },
    { id: 's5', startTime: 1.1, title: '5. Frappe lue', description: "L'attaquant ouvre vers la diagonale longue → la défense est déjà en place." },
    { id: 's6', startTime: 1.6, title: '6. Pursuit acrobatique', description: 'Si la défense est dépassée, plongeon ou roulade pour récupérer la balle → transition.' },
  ],
  summary: {
    keyPoints: [
      'Read defense = pas de positionnement figé, tout est adaptatif.',
      'Phases : base neutre → lecture passe → lecture attaquant → ajustement → pursuit.',
      'Système privilégié au haut niveau international (FIVB seniors).',
      'Plus efficace contre attaquants polyvalents.',
    ],
    commonMistakes: [
      'Bouger AVANT la passe → mauvaise lecture, joueur à contre-pied.',
      'Lecture incomplète → ne lire que la passe, pas le bras armé.',
      'Manque de coordination → 2 défenseurs sur la même balle, trou ailleurs.',
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
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.outside, position: [-1, 0, 5] },
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
    { id: 's1', startTime: 0, title: '1. Attaque en zone 4', description: "Le R4 décolle pour attaquer. Avant même la frappe, la couverture s'organise." },
    { id: 's2', startTime: 0.1, title: '2. Premier arc (3 joueurs)', description: "Passeur + central + libéro forment un demi-cercle à 1,5-2 m de l'attaquant, position TRÈS basse, bras tendus." },
    { id: 's3', startTime: 0.1, title: '3. Deuxième arc (2 joueurs)', description: 'Pointu et R4b se placent à 3-5 m, debout, prêts à récupérer les balles déviées plus loin.' },
    { id: 's4', startTime: 0.4, title: '4. Block adverse réussi', description: "L'attaque touche le bloc adverse et revient dans notre camp." },
    { id: 's5', startTime: 0.55, title: '5. Récupération du passeur', description: "Le passeur (1ᵉʳ soutien proche) relève la balle en manchette à 1 m de l'attaquant." },
    { id: 's6', startTime: 0.95, title: '6. Sauvetage = nouvelle attaque', description: 'La balle remonte vers une nouvelle distribution. Sans cette couverture = point perdu.' },
  ],
  summary: {
    keyPoints: [
      'Couverture à 5 = standard haut niveau. Dispositif 3-2 (3 proches + 2 éloignés).',
      "Le passeur est TOUJOURS le 1ᵉʳ soutien proche, à 1-1,5 m de l'attaquant.",
      'Position TRÈS basse pour les 3 proches, bras tendus en avant.',
      'Sans couverture, un block adverse réussi = point perdu directement.',
    ],
    commonMistakes: [
      'Couverture absente → block adverse = point.',
      'Passeur qui reste au filet après sa passe → 1ᵉʳ soutien manquant.',
      'Couvreurs debout ou trop éloignés → balles courtes non relevées.',
    ],
  },
};

// Scenario D10 — 5v5 defense vs zone 4 attack
const DEFENSE_5V5_VS_Z4: Scenario = {
  id: '5v5-defense-vs-z4',
  title: '5v5 · Défense Z4',
  shortDescription: 'Défense 5v5 face à attaque zone 4 : block à 2 + 3 défenseurs au sol.',
  config: {
    teamSize: 5,
    phase: 'defense',
    contextLabel: '5v5 · Block à 2 · 3 défenseurs au sol',
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
    { id: 's1', startTime: 0, title: '1. Lecture attaque Z4', description: "L'attaque adverse est en zone 4 — symétrique du 6v6 mais avec un défenseur en moins." },
    { id: 's2', startTime: 0.4, title: '2. Bloc à 2 standard', description: 'Pointu fixe la ligne, central ferme la diagonale. Pas de différence avec le 6v6.' },
    { id: 's3', startTime: 0.5, title: '3. Off-blocker R4', description: 'Le R4 redescend sur les 3 m côté ligne pour les feintes courtes.' },
    { id: 's4', startTime: 0.5, title: '4. Couloirs profonds', description: 'Libéro en diagonale forte, passeur sur la ligne droite. Seulement 2 défenseurs en arrière.' },
    { id: 's5', startTime: 1.0, title: '5. Frappe diagonale', description: 'Le libéro est sur la trajectoire la plus probable.' },
    { id: 's6', startTime: 1.5, title: '6. Récupération + transition', description: 'Le libéro défend, le passeur arrive vite au filet pour la 2ᵉ touche.' },
  ],
  summary: {
    keyPoints: [
      'En 5v5, on perd un arrière → seulement 2 défenseurs en fond après le block.',
      "Le block à 2 reste la norme malgré la perte d'un défenseur.",
      'Recommandation : conserver le système 5-1 du 6v6 en retirant un arrière non-passeur.',
      'Lecture du jeu encore plus importante (~30 m² par défenseur vs 20 m² en 6v6).',
    ],
    commonMistakes: [
      'Bloc à 3 → seulement 1 défenseur au sol = point assuré.',
      'Off-blocker qui reste au filet → centre 3m vide.',
      'Pas de hiérarchie de priorité → 2 joueurs sur la même balle.',
    ],
  },
};

// Scenario D11 — 4v4 defense with single blocker (standard 4v4)
const DEFENSE_4V4_BLOCK_1: Scenario = {
  id: '4v4-defense-block-1',
  title: '4v4 · Défense bloc à 1',
  shortDescription: 'Configuration 4v4 standard : bloc à 1 (le central) + 3 défenseurs au sol.',
  config: {
    teamSize: 4,
    phase: 'defense',
    contextLabel: '4v4 · Block à 1 · 3 défenseurs',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'Aile G (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.5] },
    { id: 'A2', label: 'Aile D (P2)', role: 'outside', color: COLORS.outside, position: [3, 0, 1.5] },
    { id: 'A', label: 'Arrière (P1)', role: 'libero', color: COLORS.libero, position: [0, 0, 6] },
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
    { id: 's1', startTime: 0, title: '1. Lecture attaque Z4 adverse', description: "L'attaque arrive côté gauche pour le défenseur. Avec 4 joueurs seulement, chacun est crucial." },
    { id: 's2', startTime: 0.4, title: '2. Block à 1 du central', description: "Le central seul saute sur l'attaquant. Configuration STANDARD en 4v4." },
    { id: 's3', startTime: 0.5, title: '3. Ailes en couverture courte', description: 'Aile gauche couvre la petite diagonale (3 m), aile droite la grande diagonale (mi-terrain).' },
    { id: 's4', startTime: 0.5, title: '4. Arrière unique au fond', description: "L'arrière unique se place en fond, là où la balle ira si l'attaque est puissante." },
    { id: 's5', startTime: 1.0, title: '5. Frappe puissante', description: "L'attaquant adverse frappe en diagonale longue." },
    { id: 's6', startTime: 1.5, title: '6. Récupération arrière', description: "L'arrière unique fait la défense profonde. Sa lecture doit être parfaite — il n'y a personne pour compenser." },
  ],
  summary: {
    keyPoints: [
      'En 4v4 le block à 1 est la norme : libère 3 défenseurs au sol.',
      'Block à 2 réservé aux gros attaquants en fin de set.',
      'Chaque défenseur défend ~30-40 m² (vs 20 m² en 6v6).',
      'Anticipation = compétence n°1 en 4v4.',
    ],
    commonMistakes: [
      'Block à 2 systématique → 2 défenseurs au sol, diagonales largement ouvertes.',
      'Arrière unique trop proche du filet → balles longues perdues.',
      'Ailes qui restent au filet sans contrer → trous sur les 3 m.',
    ],
  },
};

// Scenario D12 — 5v5 defense vs zone 3 (central rapide)
const DEFENSE_5V5_VS_Z3: Scenario = {
  id: '5v5-defense-vs-z3',
  title: '5v5 · Défense Z3 (rapide)',
  shortDescription: 'Défense 5v5 face à attaque centrale rapide : block individuel, latéraux en couverture.',
  config: { teamSize: 5, phase: 'defense', contextLabel: '5v5 · Block à 1 · Lecture rapide' },
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
    { id: 's1', startTime: 0, title: '1. Passe rapide adverse', description: 'Distribution tendue vers le central pour une rapide.' },
    { id: 's2', startTime: 0.2, title: '2. Block individuel', description: 'Le central seul saute. Les ailiers reculent latéralement sur les 3 m.' },
    { id: 's3', startTime: 0.4, title: '3. Frappe centrale', description: "L'attaque rapide va plutôt en diagonale courte. Le libéro lit en grande diag." },
    { id: 's4', startTime: 0.9, title: '4. Récupération + transition', description: 'Le libéro (en P5) fait la défense, le passeur revient au filet pour la 2ᵉ touche.' },
  ],
  summary: {
    keyPoints: [
      'Block à 1 sur la rapide centrale, comme en 6v6.',
      'Les ailiers latéralisés couvrent les diagonales courtes.',
      'Avec 2 défenseurs en fond seulement, la lecture est primordiale.',
    ],
    commonMistakes: [
      'Bloc à 2 sur rapide → trop tard, et laisse 1 défenseur au sol.',
      'Défenseurs figés au fond → balle rapide tombe avant de bouger.',
    ],
  },
};

// Scenario D13 — 5v5 defense vs zone 2 (mirror of Z4)
const DEFENSE_5V5_VS_Z2: Scenario = {
  id: '5v5-defense-vs-z2',
  title: '5v5 · Défense Z2',
  shortDescription: 'Défense 5v5 face à attaque zone 2 (notre côté gauche) : block à 2 + 3 défenseurs reculés.',
  config: { teamSize: 5, phase: 'defense', contextLabel: '5v5 · Block à 2 · 3 défenseurs au sol' },
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
    { id: 's1', startTime: 0, title: '1. Lecture attaque Z2', description: "L'attaque arrive côté gauche défenseur — symétrique du Z4 en 5v5." },
    { id: 's2', startTime: 0.4, title: '2. Block à 2 fermant', description: 'R4 fixe la ligne, central ferme la diagonale.' },
    { id: 's3', startTime: 0.5, title: '3. Off-blocker à droite', description: 'Le pointu (P2) recule sur les 3 m côté droit.' },
    { id: 's4', startTime: 0.5, title: '4. Couloirs profonds', description: 'Libéro en grande diagonale, passeur sur la ligne. 2 défenseurs en fond seulement.' },
    { id: 's5', startTime: 1.0, title: '5. Frappe diagonale', description: "L'attaquant frappe en diagonale longue — le passeur récupère sur la ligne droite." },
    { id: 's6', startTime: 1.5, title: '6. Transition compliquée', description: 'Si le passeur défend, le pointu doit relayer en 2ᵉ touche.' },
  ],
  summary: {
    keyPoints: [
      'Symétrique du block vs Z4 en 5v5.',
      'Le pointu devient off-blocker côté droit.',
      'Le passeur défend en grande diagonale et doit revenir vite au filet.',
    ],
    commonMistakes: [
      'Pointu qui contre depuis Z2 → off-blocker absent.',
      'Passeur qui défend ET relaie → confusion sur la 2ᵉ touche.',
    ],
  },
};

// Scenario D14 — 4v4 defense vs zone 3 (central)
const DEFENSE_4V4_VS_Z3: Scenario = {
  id: '4v4-defense-vs-z3',
  title: '4v4 · Défense Z3',
  shortDescription: 'Défense 4v4 sur attaque centrale : block à 1 (central), 3 défenseurs latéraux + arrière.',
  config: { teamSize: 4, phase: 'defense', contextLabel: '4v4 · Block à 1 · 3 défenseurs' },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'Aile G (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.5] },
    { id: 'A2', label: 'Aile D (P2)', role: 'outside', color: COLORS.outside, position: [3, 0, 1.5] },
    { id: 'A', label: 'Arrière (P1)', role: 'libero', color: COLORS.libero, position: [0, 0, 6] },
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
    { id: 's1', startTime: 0, title: '1. Passe rapide centrale', description: 'En 4v4 la rapide centrale est rare mais possible si le passeur est P3.' },
    { id: 's2', startTime: 0.2, title: '2. Block à 1', description: 'Le central seul saute — block à 1 standard en 4v4.' },
    { id: 's3', startTime: 0.3, title: '3. Ailes latérales', description: 'Les 2 ailes reculent et couvrent chacune une diagonale.' },
    { id: 's4', startTime: 0.4, title: '4. Frappe puissante', description: "L'attaque va profond. L'arrière unique est exactement à l'arrivée." },
    { id: 's5', startTime: 0.9, title: '5. Récupération arrière', description: "L'arrière unique défend en fond. Sa lecture compense l'absence d'autres arrières." },
  ],
  summary: {
    keyPoints: [
      'Block à 1 sur attaque centrale.',
      'Les 2 ailes couvrent les 2 diagonales.',
      "L'arrière unique reste profond — il doit lire la trajectoire parfaitement.",
    ],
    commonMistakes: [
      'Block à 2 sur rapide → 2 défenseurs au sol seulement.',
      "Arrière qui avance trop tôt → balle profonde tombe derrière lui.",
    ],
  },
};

// Scenario D15 — 4v4 defense vs zone 2 (mirror of Z4)
const DEFENSE_4V4_VS_Z2: Scenario = {
  id: '4v4-defense-vs-z2',
  title: '4v4 · Défense Z2',
  shortDescription: 'Défense 4v4 sur attaque adverse en zone 2 (côté gauche) : block à 1 + 3 défenseurs.',
  config: { teamSize: 4, phase: 'defense', contextLabel: '4v4 · Block à 1 · 3 défenseurs' },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.4] },
    { id: 'R4', label: 'Aile G (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 1.5] },
    { id: 'A2', label: 'Aile D (P2)', role: 'outside', color: COLORS.outside, position: [3, 0, 1.5] },
    { id: 'A', label: 'Arrière (P1)', role: 'libero', color: COLORS.libero, position: [0, 0, 6] },
    { id: 'OPP', label: 'Attaquant adverse', role: 'opponent', color: COLORS.opponent, position: [3, 0, -0.6] },
  ],
  initialBallPosition: [0, 2.0, -3],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.0, -3], to: [3.0, 3.0, -0.8], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 0.4, id: 'C', to: [2.0, 0, 0.3], duration: 0.5 },
    { type: 'player_move', time: 0.7, id: 'C', to: [2.0, 1.6, 0.3], duration: 0.2 },
    { type: 'player_pose', time: 0.7, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 0.5, id: 'A2', to: [3.0, 0, 2.5], duration: 0.4 },
    { type: 'player_move', time: 0.5, id: 'R4', to: [-3.0, 0, 4], duration: 0.5 },
    { type: 'player_move', time: 0.5, id: 'A', to: [-1.5, 0, 7], duration: 0.5 },
    { type: 'player_move', time: 0.7, id: 'OPP', to: [3.0, 0, -1.2], duration: 0.2 },
    { type: 'player_move', time: 0.85, id: 'OPP', to: [3.0, 1.8, -0.7], duration: 0.15 },
    { type: 'player_pose', time: 0.85, id: 'OPP', pose: 'ARM_SPIKE', duration: 0.15 },
    { type: 'player_pose', time: 1.0, id: 'OPP', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 1.0, from: [3.0, 3.0, -0.8], to: [-1.5, 0.8, 6.5], duration: 0.5, arc: false },
    { type: 'player_move', time: 1.1, id: 'OPP', to: [3.0, 0, -0.6], duration: 0.3 },
    { type: 'player_pose', time: 1.5, id: 'A', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.5, from: [-1.5, 0.8, 6.5], to: [0, 2.5, 1.0], duration: 0.9, arc: 4.0 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Lecture attaque Z2', description: 'Symétrique du Z4 — attaque adverse côté droit (notre côté gauche défenseur).' },
    { id: 's2', startTime: 0.4, title: '2. Block à 1 du central', description: 'Le central glisse en zone 4 et bloque seul.' },
    { id: 's3', startTime: 0.5, title: '3. Couvertures', description: 'A2 (P2) couvre la petite diagonale court ; R4 et arrière prennent les zones longues.' },
    { id: 's4', startTime: 1.0, title: '4. Frappe diagonale', description: "L'attaque va en diagonale longue, défendue par l'arrière unique en fond." },
    { id: 's5', startTime: 1.5, title: '5. Récupération', description: "L'arrière fait la défense profonde et relaie vers le centre du terrain." },
  ],
  summary: {
    keyPoints: [
      'Block à 1 (central) — symétrique du block vs Z4.',
      'L\'aile droite (P2) devient off-blocker côté ligne.',
      'L\'arrière unique se place sur la grande diagonale.',
    ],
    commonMistakes: [
      'Aile droite qui contre → off-blocker absent.',
      "Arrière trop avancé → balle profonde non couverte.",
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
