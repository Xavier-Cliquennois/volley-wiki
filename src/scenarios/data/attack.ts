import type { Scenario } from '../types';
import { COLORS, opponentBlockers } from './_shared';

// Scenario A1 — 6v6 attack 5-1 rotation P1 (setter back-right, penetrates to 2-3)
const ATTACK_5_1_P1: Scenario = {
  id: '6v6-attack-5-1-p1',
  title: 'Attaque · 5-1 rotation P1',
  shortDescription: 'Réception à 3 → passeur pénètre depuis P1 → attaque en zone 4 par le R4.',
  config: {
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P1 · Service adverse',
  },
  defaultCamera: 'DEFAULT',
  players: [
    // Position de DÉPART = formation de RÉCEPTION à 3.
    // Libéro + R4 P6 + R4 P4 (qui recule sur les 3 m) prennent la largeur.
    // Central et pointu sont "cachés" au filet (sortis de la réception).
    // Le passeur est en P1 arrière, prêt à pénétrer.
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 5] },
    { id: 'R4a', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-2.5, 0, 4] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [1, 0, 5] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'Op', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3.2, 0, 0.6] },
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 4] },
    ...opponentBlockers(),
    // Adversaires explicites : serveur (origine du ballon) + arrière + central pour qu'ils réagissent
    { id: 'OPP_SRV', label: 'Serveur adv.', role: 'opponent', color: COLORS.opponent, position: [0, 0, -8.5] },
    { id: 'OPP_C', label: 'Central adv.', role: 'opponent', color: COLORS.opponent, position: [0, 0, -0.6] },
    { id: 'OPP_S', label: 'Passeur adv.', role: 'opponent', color: COLORS.opponent, position: [3, 0, -4] },
    { id: 'OPP_BC', label: 'Libéro adv.', role: 'opponent', color: COLORS.opponent, position: [0, 0, -6] },
    { id: 'OPP_BL', label: 'Arr. adv. G', role: 'opponent', color: COLORS.opponent, position: [-3, 0, -5.5] },
  ],
  initialBallPosition: [0, 1.5, -8.5],
  timeline: [
    // ── Phase 0 : le serveur adverse vient de frapper (SPIKE pose au moment du contact) ──
    { type: 'player_pose', time: 0, id: 'OPP_SRV', pose: 'SPIKE', duration: 0.2 },
    // Tous nos réceptionneurs en READY (jambes fléchies, plateforme prête)
    { type: 'player_pose', time: 0.05, id: 'L', pose: 'READY', duration: 0.2 },
    { type: 'player_pose', time: 0.05, id: 'R4a', pose: 'READY', duration: 0.2 },
    { type: 'player_pose', time: 0.05, id: 'R4b', pose: 'READY', duration: 0.2, text: "J'ai !" },
    { type: 'player_pose', time: 0.05, id: 'P', pose: 'READY', duration: 0.2 },

    // ── Phase 1 : trajectoire du service vers notre P6 + déclenchement de notre passeur ──
    { type: 'ball_move', time: 0, from: [0, 1.5, -8.5], to: [1, 1.2, 5], duration: 1.0, arc: 3.5 },
    // Le passeur démarre sa pénétration dès la frappe du service (~ t=0.2)
    { type: 'player_move', time: 0.2, id: 'P', to: [3, 0, 2.5], duration: 0.5 },
    // Le serveur retombe dans son terrain et entre en défense
    { type: 'player_move', time: 0.3, id: 'OPP_SRV', to: [0, 0, -7.5], duration: 0.5 },

    // ── Phase 2 : réception + pénétration finale + lecture du contre adverse ──
    { type: 'player_pose', time: 1.0, id: 'R4b', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [1, 1.2, 5], to: [1.5, 1.9, 0.8], duration: 0.9, arc: 4.0 },
    { type: 'player_move', time: 1.0, id: 'P', to: [1.5, 0, 0.8], duration: 0.8 },
    // Le R4 attaquant (R4a) commence sa course d'élan large dès la réception
    // — il PARTAIT en réception, maintenant il enchaîne immédiatement vers la zone d'impact
    { type: 'player_move', time: 1.0, id: 'R4a', to: [-4.5, 0, 2.5], duration: 0.6 },
    // Le central adverse glisse au centre prêt à bloquer
    { type: 'player_move', time: 1.0, id: 'OPP_C', to: [-1, 0, -0.4], duration: 0.5 },
    // Les blockers se positionnent vers la zone 4 (notre gauche, leur droite)
    { type: 'player_move', time: 1.5, id: 'OPP_BL', to: [-2.5, 0, -0.4], duration: 0.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BR', to: [-1.0, 0, -0.4], duration: 0.6 },

    // ── Phase 3 : passe en touche + course d'élan ──
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.9, from: [1.5, 1.9, 0.8], to: [-3.5, 3.6, 0.6], duration: 0.8, arc: 4.5 },
    // R4 finalise sa course vers la zone d'impact
    { type: 'player_move', time: 2.0, id: 'R4a', to: [-3.5, 0, 1.2], duration: 0.4 },
    // Le central adverse saute au bloc juste avant la frappe
    { type: 'player_move', time: 2.4, id: 'OPP_BL', to: [-2.5, 1.6, -0.4], duration: 0.2 },
    { type: 'player_move', time: 2.4, id: 'OPP_BR', to: [-1.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    // Couverture d'attaque : passeur descend en position basse (3 proches), libéro et R4b s'avancent
    { type: 'player_move', time: 2.0, id: 'P', to: [-2, 0, 1.5], duration: 0.4 },
    { type: 'player_move', time: 2.0, id: 'L', to: [-2.5, 0, 3], duration: 0.4 },
    { type: 'player_move', time: 2.0, id: 'R4b', to: [-1, 0, 3.5], duration: 0.4 },

    // ── Phase 4 : armé + frappe ──
    { type: 'player_move', time: 2.4, id: 'R4a', to: [-3.5, 2.0, 0.6], duration: 0.3 },
    { type: 'player_pose', time: 2.5, id: 'R4a', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.7, id: 'R4a', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.7, from: [-3.5, 3.6, 0.6], to: [2, 0, -6], duration: 0.5, arc: false },

    // ── Phase 5 : retombée + recovery ──
    { type: 'player_move', time: 3.0, id: 'R4a', to: [-3.5, 0, 0.4], duration: 0.3 },
    { type: 'player_move', time: 3.0, id: 'OPP_BL', to: [-2.5, 0, -0.4], duration: 0.3 },
    { type: 'player_move', time: 3.0, id: 'OPP_BR', to: [-1.0, 0, -0.4], duration: 0.3 },
    // L'adversaire passe en défense après le block-out
    { type: 'player_move', time: 2.7, id: 'OPP_S', to: [3, 0, -1.5], duration: 0.5 },
    // Libéro dives toward ball landing [2, 0, -6] — arrives 0.1 s late (ball at t=3.2)
    { type: 'player_move', time: 2.7, id: 'OPP_BC', to: [2, 0, -5.8], duration: 0.4 },
    { type: 'player_pose', time: 3.1, id: 'OPP_BC', pose: 'BUMP', duration: 0.2 },
    { type: 'player_move', time: 2.7, id: 'OPP_BL', to: [-2.5, 0, -1.5], duration: 0.5 },

    // ── Phase 6 : RESET — retour à la position de base ──
    { type: 'player_pose', time: 3.5, id: 'L', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.5, id: 'R4a', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.5, id: 'R4b', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.5, id: 'C', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.5, id: 'Op', pose: 'RESET', duration: 0.4 },
    { type: 'player_pose', time: 3.5, id: 'P', pose: 'RESET', duration: 0.4 },
    { type: 'player_move', time: 3.5, id: 'L', to: [-2.5, 0, 5], duration: 0.7 },
    { type: 'player_move', time: 3.5, id: 'R4a', to: [-2.5, 0, 4], duration: 0.7 },
    { type: 'player_move', time: 3.5, id: 'R4b', to: [1, 0, 5], duration: 0.7 },
    { type: 'player_move', time: 3.5, id: 'C', to: [0, 0, 0.6], duration: 0.7 },
    { type: 'player_move', time: 3.5, id: 'Op', to: [3.2, 0, 0.6], duration: 0.7 },
    { type: 'player_move', time: 3.5, id: 'P', to: [3, 0, 4], duration: 0.7 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Formation de réception (départ)', description: "Notre équipe est en formation de RÉCEPTION à 3 : libéro + 2 R4 qui prennent la largeur. Le R4 en P4 a reculé sur les 3 m. Central et pointu sont 'sortis' (cachés au filet). Le passeur en P1 attend la frappe pour pénétrer." },
    { id: 's2', startTime: 1.0, title: '2. Réception + pénétration', description: 'Le R4 en P6 reçoit en manchette précise vers la zone du passeur. Le passeur pénètre vers 2-3, à un bras du filet.' },
    { id: 's3', startTime: 1.0, title: "3. Course d'élan immédiate", description: "Le R4 attaquant (P4) enchaîne sa course d'élan vers la zone 4 SANS attendre — il sortait juste de la réception, il doit rattraper le tempo." },
    { id: 's4', startTime: 1.5, title: '4. Block adverse en place', description: 'Les contreurs adverses se déplacent vers la zone 4 pour fermer diagonale et ligne. Le central glisse au centre.' },
    { id: 's5', startTime: 1.9, title: '5. Passe en touche vers Z4', description: 'Passe haute en cloche. La trajectoire fixe le contre adverse à droite.' },
    { id: 's6', startTime: 2.0, title: "6. Couverture d'attaque", description: "Passeur en position basse à 1-1,5 m, libéro et P6 dans le 1er arc, pointu et central plus loin. 5 joueurs autour de l'attaquant." },
    { id: 's7', startTime: 2.5, title: "7. Armé + fouetté", description: 'Le R4 arme le bras dorsal puis frappe en diagonale longue. Le block adverse saute en parallèle.' },
    { id: 's8', startTime: 3.0, title: '8. Recovery + transition', description: 'Réception équilibrée, le passeur adverse se replie pour défendre.' },
    { id: 's9', startTime: 3.5, title: '9. RESET — retour à la formation de réception', description: "Tout le monde reprend sa position de RÉCEPTION pour le service suivant. C'est ce placement qui détermine la qualité de la prochaine attaque." },
  ],
  summary: {
    keyPoints: [
      'Réception à 3 : libéro + 2 R4 prennent toute la largeur du terrain.',
      'Le passeur pénètre dès la frappe du service depuis P1 vers la zone 2-3.',
      'Trois options offensives : R4 en 4, central en 3 (rapide), pointu en 2, pipe en 6.',
      'Couverture à 5 joueurs (3 proches + 2 éloignés) en position basse.',
    ],
    commonMistakes: [
      'Passeur qui pénètre trop tard → passe forcée en suspension par un autre joueur.',
      'R4 attaquant qui déclenche son élan trop tôt → arrive sous la balle au lieu de fixer.',
      'Couverture oubliée → block adverse réussi = point perdu directement.',
    ],
  },
};

// Scenario A2 — 6v6 attack 5-1 rotation P2 (setter front-right, fewest options)
const ATTACK_5_1_P2: Scenario = {
  id: '6v6-attack-5-1-p2',
  title: 'Attaque · 5-1 rotation P2',
  shortDescription: 'Passeur déjà au filet en P2 : 2 attaquants devant + pointu attaque en 4 exceptionnellement.',
  config: {
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P2 · Passeur avant',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'R4a', label: 'R4 (P5)', role: 'outside', color: COLORS.outside_back, position: [-3, 0, 4] },
    { id: 'L', label: 'Libéro (P6)', role: 'libero', color: COLORS.libero, position: [0, 0, 5] },
    { id: 'R4b', label: 'R4 (P1)', role: 'outside', color: COLORS.outside, position: [3, 0, 4] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'Pt', label: 'Pointu (P4)', role: 'opposite', color: COLORS.opposite, position: [-3, 0, 0.6] },
    { id: 'P', label: 'Passeur (P2)', role: 'setter', color: COLORS.setter, position: [3, 0, 0.6] },
    ...opponentBlockers(),
    { id: 'OPP_D1', label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent, position: [2.5, 0, -2.5] },
  ],
  initialBallPosition: [0, 2.5, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -9], to: [-1.5, 1.2, 4.5], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'L', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'L', to: [-1.5, 0, 4.5], duration: 0.5 },
    { type: 'player_pose', time: 1.0, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [-1.5, 1.2, 4.5], to: [2.5, 1.9, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BL', to: [-1.0, 0, -0.4], duration: 0.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BR', to: [1.0, 0, -0.4], duration: 0.5 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.9, from: [2.5, 1.9, 0.8], to: [-3.2, 3.4, 0.6], duration: 0.8, arc: 4.5 },
    { type: 'player_move', time: 2.0, id: 'Pt', to: [-3.2, 0, 1.5], duration: 0.4 },
    { type: 'player_move', time: 2.4, id: 'Pt', to: [-3.2, 1.8, 0.6], duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'Pt', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.7, id: 'Pt', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.7, from: [-3.2, 3.4, 0.6], to: [2.5, 0, -7], duration: 0.5, arc: false },
    { type: 'player_move', time: 2.4, id: 'OPP_BL', to: [-1.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_move', time: 2.4, id: 'OPP_BR', to: [1.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 2.7, id: 'OPP_D1', to: [2.5, 0, -6.5], duration: 0.4 },
    { type: 'player_pose', time: 3.1, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Service adverse', description: 'Service en zone 5-6. Le libéro annonce et se prépare à la manchette.' },
    { id: 's2', startTime: 1.0, title: '2. Réception du libéro', description: 'Manchette dirigée vers le passeur déjà en P2 — pas de pénétration nécessaire.' },
    { id: 's3', startTime: 1.5, title: '3. Bloc adverse central', description: 'Les contreurs se regroupent au centre car ils savent que le pointu attaquera à gauche dans cette rotation.' },
    { id: 's4', startTime: 1.9, title: '4. Passe vers le pointu', description: 'Le passeur, surpris au filet, distribue exceptionnellement vers la zone 4 où le pointu prend le relais.' },
    { id: 's5', startTime: 2.0, title: "5. Course d'élan du pointu", description: 'Le pointu attaque à gauche pour ne pas bousculer le passeur en zone 2. Configuration rare mais incontournable en P2.' },
    { id: 's6', startTime: 2.5, title: '6. Frappe en diagonale', description: "Frappe puissante en diagonale longue pour exploiter l'espace laissé par le bloc." },
  ],
  summary: {
    keyPoints: [
      'Rotation P2 = la plus pauvre offensivement (seulement 2 attaquants devant).',
      'Passeur déjà en place : zéro pénétration, distribution facile.',
      'Le pointu attaque exceptionnellement à gauche (poste 4) pour libérer le passeur.',
      "Privilégier les ailes et l'attaque arrière des R4 en option.",
    ],
    commonMistakes: [
      "Passeur qui veut faire un set en 2 alors qu'il y est déjà → 2ᵉ touche difficile.",
      'Pointu qui hésite entre 2 et 4 → contre adverse en place.',
      "Centraux qui ne fixent pas → bloc à 2 facile pour l'adversaire.",
    ],
  },
};

// Scenario A3 — 6v6 attack 5-1 rotation P3 (setter front-center, with pipe)
const ATTACK_5_1_P3: Scenario = {
  id: '6v6-attack-5-1-p3',
  title: 'Attaque · 5-1 rotation P3 (pipe)',
  shortDescription: 'Passeur en P3 permute vers 2-3 → pipe par le R4 arrière en zone 6.',
  config: {
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P3 · Attaque arrière',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 4] },
    { id: 'Pt', label: 'Pointu (P6)', role: 'opposite', color: COLORS.opposite, position: [0, 0, 5] },
    { id: 'R4b', label: 'R4 (P1)', role: 'outside', color: COLORS.outside, position: [3, 0, 4] },
    { id: 'R4a', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.6] },
    { id: 'P', label: 'Passeur (P3)', role: 'setter', color: COLORS.setter, position: [0, 0, 0.6] },
    { id: 'C', label: 'Central (P2)', role: 'middle', color: COLORS.middle, position: [3, 0, 0.6] },
    ...opponentBlockers(),
    { id: 'OPP_D1', label: 'Déf. diag. adv.', role: 'opponent', color: COLORS.opponent, position: [0, 0, -4.5] },
  ],
  initialBallPosition: [0, 2.5, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -9], to: [2.0, 1.2, 4.2], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'R4b', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'R4b', to: [2.0, 0, 4.2], duration: 0.5 },
    { type: 'player_pose', time: 1.0, id: 'R4b', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [2.0, 1.2, 4.2], to: [1.0, 1.9, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_move', time: 1.0, id: 'P', to: [1.0, 0, 0.8], duration: 0.8 },
    { type: 'player_move', time: 1.0, id: 'C', to: [3, 0, 0.6], duration: 0.3 },
    { type: 'player_move', time: 1.5, id: 'OPP_BL', to: [-1.5, 0, -0.4], duration: 0.4 },
    { type: 'player_move', time: 1.5, id: 'OPP_BR', to: [1.5, 0, -0.4], duration: 0.4 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    // Pipe attack: setter passes to back-row R4 attacking from zone 6
    { type: 'ball_move', time: 1.9, from: [1.0, 1.9, 0.8], to: [0, 3.2, 3.8], duration: 0.8, arc: 4.0 },
    { type: 'player_move', time: 2.0, id: 'Pt', to: [0, 0, 4.5], duration: 0.4 },
    { type: 'player_move', time: 2.4, id: 'Pt', to: [0, 1.5, 4.0], duration: 0.2 },
    { type: 'player_move', time: 2.4, id: 'OPP_BL', to: [-1.5, 1.6, -0.4], duration: 0.2 },
    { type: 'player_move', time: 2.4, id: 'OPP_BR', to: [1.5, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'Pt', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.7, id: 'Pt', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.7, from: [0, 3.2, 3.8], to: [0, 0, -7], duration: 0.5, arc: false },
    { type: 'player_move', time: 2.7, id: 'OPP_D1', to: [0, 0, -6.8], duration: 0.4 },
    { type: 'player_pose', time: 3.1, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Service côté droit', description: 'Service vers la zone 1. Le R4 en P1 prend la réception.' },
    { id: 's2', startTime: 1.0, title: '2. Réception + permutation', description: 'Pendant la passe, le passeur (P3) glisse vers 2-3 et le central permute vers le centre du filet.' },
    { id: 's3', startTime: 1.5, title: '3. Lecture du bloc adverse', description: 'Les contreurs adverses se concentrent sur les ailes — la zone 6 reste libre.' },
    { id: 's4', startTime: 1.9, title: '4. Passe en pipe', description: 'Le passeur distribue tendue vers le poste 6 : trajectoire rapide, à 2 m du filet.' },
    { id: 's5', startTime: 2.0, title: '5. Course du pointu', description: 'Le pointu, en P6, lance sa course derrière la ligne des 3 m pour la pipe.' },
    { id: 's6', startTime: 2.5, title: '6. Pipe au cœur', description: "Frappe puissante au centre, là où le bloc à 2 ailier ne peut pas former d'écran. Option clé du 5-1 moderne." },
  ],
  summary: {
    keyPoints: [
      'La pipe est la 4ᵉ option offensive en plus des 3 attaques au filet.',
      'Le central permute vers le centre du filet pendant que le passeur glisse en 2-3.',
      'Trajectoire de pipe : tendue, à 2 m du filet, impulsion derrière les 3 m.',
      'Très efficace contre un bloc qui se concentre sur les ailes.',
    ],
    commonMistakes: [
      'Pipe trop haute → bloc adverse a le temps de revenir au centre.',
      "R4 arrière qui décolle dans la zone avant → faute d'attaque arrière.",
      'Permutation trop tardive du central → blocage de la zone 3.',
    ],
  },
};

// Scenario A4 — 6v6 attack 5-1 rotation P4 (setter front-left, permutes right)
const ATTACK_5_1_P4: Scenario = {
  id: '6v6-attack-5-1-p4',
  title: 'Attaque · 5-1 rotation P4',
  shortDescription: 'Passeur avant en P4 permute vers la droite ; R4* attaque en 4, central en 3, pointu arrière en 1.',
  config: {
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P4 · Passeur avant',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 4] },
    { id: 'R4b', label: 'R4 (P6)', role: 'outside', color: COLORS.middle_back, position: [0, 0, 5] },
    { id: 'Pt', label: 'Pointu (P1)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 4] },
    { id: 'P', label: 'Passeur (P4)', role: 'setter', color: COLORS.setter, position: [-3, 0, 0.6] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'R4a', label: 'R4 (P2)', role: 'outside', color: COLORS.outside, position: [3, 0, 0.6] },
    ...opponentBlockers(),
    { id: 'OPP_D1', label: 'Déf. diag. adv.', role: 'opponent', color: COLORS.opponent, position: [3.0, 0, -3.5] },
  ],
  initialBallPosition: [0, 2.5, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -9], to: [0, 1.2, 4.5], duration: 1.0, arc: 3.0 },
    // Setter and central shift left to free zone 6 for the libero
    { type: 'player_move', time: 0.2, id: 'P', to: [-3.5, 0, 0.6], duration: 0.4 },
    { type: 'player_move', time: 0.2, id: 'C', to: [-1.0, 0, 0.6], duration: 0.4 },
    { type: 'player_pose', time: 0.3, id: 'L', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'L', to: [0, 0, 4.5], duration: 0.5 },
    { type: 'player_pose', time: 1.0, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [0, 1.2, 4.5], to: [1.5, 1.9, 0.8], duration: 0.9, arc: 4.0 },
    // Setter permutes from P4 to zone 2-3
    { type: 'player_move', time: 1.0, id: 'P', to: [1.5, 0, 0.8], duration: 0.8 },
    // R4* permutes from P2 to P4 to attack
    { type: 'player_move', time: 1.0, id: 'R4a', to: [-3, 0, 0.6], duration: 0.8 },
    { type: 'player_move', time: 1.0, id: 'C', to: [0, 0, 0.6], duration: 0.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BL', to: [-2.5, 0, -0.4], duration: 0.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BR', to: [-1.0, 0, -0.4], duration: 0.6 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.9, from: [1.5, 1.9, 0.8], to: [-3.3, 3.5, 0.6], duration: 0.8, arc: 4.5 },
    { type: 'player_move', time: 2.0, id: 'R4a', to: [-3.3, 0, 1.2], duration: 0.4 },
    { type: 'player_move', time: 2.4, id: 'R4a', to: [-3.3, 1.9, 0.6], duration: 0.2 },
    { type: 'player_move', time: 2.4, id: 'OPP_BL', to: [-2.5, 1.6, -0.4], duration: 0.2 },
    { type: 'player_move', time: 2.4, id: 'OPP_BR', to: [-1.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'R4a', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.7, id: 'R4a', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.7, from: [-3.3, 3.5, 0.6], to: [2, 0, -6], duration: 0.5, arc: false },
    { type: 'player_move', time: 2.7, id: 'OPP_D1', to: [2, 0, -5.8], duration: 0.4 },
    { type: 'player_pose', time: 3.1, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Configuration P4', description: 'Passeur en zone 4, R4* en zone 2 — placement croisé pour libérer le R4 en réception en zone 6.' },
    { id: 's2', startTime: 0.2, title: '2. Décalage tactique', description: 'Le passeur et le central se placent le plus à gauche possible pour ouvrir la zone de réception au libéro.' },
    { id: 's3', startTime: 1.0, title: '3. Réception du libéro', description: 'Manchette dirigée vers la cible classique (entre P2 et P3).' },
    { id: 's4', startTime: 1.0, title: '4. Permutation P↔R4*', description: 'Le passeur quitte P4 vers 2-3 ; le R4* quitte P2 vers 4 pour attaquer. Croisement essentiel.' },
    { id: 's5', startTime: 1.9, title: '5. Passe en zone 4', description: "Passe haute vers l'aile gauche où le R4* est arrivé." },
    { id: 's6', startTime: 2.5, title: "6. Attaque sur l'aile", description: "Frappe en diagonale longue. Avec un passeur avant (donc petit au bloc), l'attaque doit conclure rapidement." },
  ],
  summary: {
    keyPoints: [
      'Rotation P4 = passeur avant. Permutation P↔R4* obligatoire.',
      '2 attaquants devant : R4* en 4, central en 3. Pipe ou pointu arrière en option.',
      'Le passeur et le central se décalent à gauche au service pour libérer la zone 6.',
      "Le pointu (en P1) ne réceptionne pas et reste prêt pour l'attaque arrière.",
    ],
    commonMistakes: [
      'Permutation oubliée → le R4* reste à droite, attaquant en mauvaise position.',
      'Passeur et central trop à droite au service → conflit de réception en zone 6.',
      "Bloc adverse non fixé par le central → bloc à 2 facile sur l'aile gauche.",
    ],
  },
};

// Scenario A5 — 6v6 attack 5-1 rotation P5 (longest setter penetration)
const ATTACK_5_1_P5: Scenario = {
  id: '6v6-attack-5-1-p5',
  title: 'Attaque · 5-1 rotation P5',
  shortDescription: 'Pénétration longue depuis P5. C/R4 permutent. Passe vers le pointu en zone 2.',
  config: {
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P5 · Pénétration longue',
  },
  defaultCamera: 'TOP_DOWN',
  players: [
    { id: 'P', label: 'Passeur (P5)', role: 'setter', color: COLORS.setter, position: [-3, 0, 4] },
    { id: 'L', label: 'Libéro (P6)', role: 'libero', color: COLORS.libero, position: [0, 0, 5] },
    { id: 'R4b', label: 'R4 (P1)', role: 'outside', color: COLORS.outside, position: [3, 0, 4] },
    { id: 'C', label: 'Central (P4)', role: 'middle', color: COLORS.middle, position: [-3, 0, 0.6] },
    { id: 'R4a', label: 'R4 (P3)', role: 'outside', color: COLORS.outside, position: [0, 0, 0.6] },
    { id: 'Pt', label: 'Pointu (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.6] },
    ...opponentBlockers(),
    { id: 'OPP_D1', label: 'Déf. diag. adv.', role: 'opponent', color: COLORS.opponent, position: [0, 0, -4.5] },
  ],
  initialBallPosition: [0, 2.5, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -9], to: [2.0, 1.2, 4.2], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'R4b', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'R4b', to: [2.0, 0, 4.2], duration: 0.5 },
    // C/R4 permute after the serve so central is centered
    { type: 'player_move', time: 0.4, id: 'C', to: [0, 0, 0.6], duration: 0.6 },
    { type: 'player_move', time: 0.4, id: 'R4a', to: [-3, 0, 0.6], duration: 0.6 },
    { type: 'player_pose', time: 1.0, id: 'R4b', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [2.0, 1.2, 4.2], to: [1.5, 2.0, 0.8], duration: 1.1, arc: 4.5 },
    // Long penetration from P5 across the court
    { type: 'player_move', time: 1.0, id: 'P', to: [1.5, 0, 0.8], duration: 1.1 },
    { type: 'player_move', time: 1.5, id: 'OPP_BL', to: [1.0, 0, -0.4], duration: 0.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BR', to: [2.5, 0, -0.4], duration: 0.5 },
    { type: 'player_pose', time: 2.1, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 2.1, from: [1.5, 2.0, 0.8], to: [3.3, 3.5, 0.6], duration: 0.6, arc: 4.0 },
    { type: 'player_move', time: 2.2, id: 'Pt', to: [3.3, 0, 1.2], duration: 0.3 },
    { type: 'player_move', time: 2.5, id: 'Pt', to: [3.3, 1.9, 0.6], duration: 0.2 },
    { type: 'player_pose', time: 2.6, id: 'Pt', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.8, id: 'Pt', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.8, from: [3.3, 3.5, 0.6], to: [-2.5, 0, -6], duration: 0.5, arc: false },
    { type: 'player_move', time: 2.5, id: 'OPP_BL', to: [1.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_move', time: 2.5, id: 'OPP_BR', to: [2.5, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 2.8, id: 'OPP_D1', to: [-2.5, 0, -5.8], duration: 0.4 },
    { type: 'player_pose', time: 3.2, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Service côté droit', description: 'Le service vise la zone 1 où le R4 prend la réception.' },
    { id: 's2', startTime: 0.4, title: '2. Permutation C↔R4', description: 'Le central glisse au centre du filet, le R4 attaquant prend la zone 4.' },
    { id: 's3', startTime: 1.0, title: '3. Pénétration longue', description: 'Le passeur traverse tout le terrain depuis P5 — la plus longue pénétration. Réception très propre obligatoire.' },
    { id: 's4', startTime: 1.5, title: '4. Bloc adverse à droite', description: 'Les contreurs se déplacent vers leur côté gauche (notre droite) pour fermer le pointu.' },
    { id: 's5', startTime: 2.1, title: '5. Passe courte au pointu', description: 'Passe courte en zone 2 pour le pointu : la passe la plus simple depuis cette pénétration.' },
    { id: 's6', startTime: 2.6, title: '6. Frappe en diagonale', description: 'Le pointu frappe en diagonale longue. Combinaison classique sur cette rotation.' },
  ],
  summary: {
    keyPoints: [
      'P5 = pénétration la plus longue. Exige une réception parfaite.',
      'Le central et le R4 permutent dès le service pour replacer C en zone 3.',
      'Le pointu en zone 2 est la cible la plus accessible pour le passeur.',
      'Pipe possible en option si la passe est tendue et rapide.',
    ],
    commonMistakes: [
      'Passe trop tendue avec une pénétration en cours → passeur sous la balle.',
      'Permutation tardive C↔R4 → central en zone 4 = inutile au bloc.',
      'Réception courte → passeur arrive trop loin du filet.',
    ],
  },
};

// Scenario A6 — 6v6 attack 5-1 rotation P6 (setter back-center, fast central attack)
const ATTACK_5_1_P6: Scenario = {
  id: '6v6-attack-5-1-p6',
  title: 'Attaque · 5-1 rotation P6 (rapide)',
  shortDescription: 'Pénétration médiane depuis P6 → attaque rapide au centre par le central.',
  config: {
    teamSize: 6,
    phase: 'attack',
    contextLabel: '5-1 · Rotation P6 · Combinaison rapide',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 4] },
    { id: 'P', label: 'Passeur (P6)', role: 'setter', color: COLORS.setter, position: [0, 0, 5] },
    { id: 'R4b', label: 'R4 (P1)', role: 'outside', color: COLORS.outside, position: [3, 0, 4] },
    { id: 'R4a', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.6] },
    { id: 'Pt', label: 'Pointu (P3)', role: 'opposite', color: COLORS.opposite, position: [0, 0, 0.6] },
    { id: 'C', label: 'Central (P2)', role: 'middle', color: COLORS.middle, position: [3, 0, 0.6] },
    ...opponentBlockers(),
    { id: 'OPP_D1', label: 'Déf. centrale adv.', role: 'opponent', color: COLORS.opponent, position: [0, 0, -3.5] },
  ],
  initialBallPosition: [0, 2.5, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -9], to: [-1.8, 1.2, 4.2], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'L', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'L', to: [-1.8, 0, 4.2], duration: 0.5 },
    // Pointu permutes from P3 to P2 ; central glides to P3 center
    { type: 'player_move', time: 0.4, id: 'Pt', to: [3, 0, 0.6], duration: 0.6 },
    { type: 'player_move', time: 0.4, id: 'C', to: [0, 0, 0.6], duration: 0.6 },
    { type: 'player_pose', time: 1.0, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [-1.8, 1.2, 4.2], to: [1.0, 2.0, 0.8], duration: 0.9, arc: 3.5 },
    // Penetration from P6 (medium distance)
    { type: 'player_move', time: 1.0, id: 'P', to: [1.0, 0, 0.8], duration: 0.9 },
    // Central pre-jumps for tempo 1
    { type: 'player_move', time: 1.6, id: 'C', to: [0, 1.2, 0.5], duration: 0.3 },
    { type: 'player_pose', time: 1.7, id: 'C', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.1 },
    // Tempo 1 : ball goes flat to central immediately
    { type: 'ball_move', time: 1.9, from: [1.0, 2.0, 0.8], to: [0, 2.8, 0.4], duration: 0.2, arc: false },
    { type: 'player_pose', time: 2.0, id: 'C', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.1, from: [0, 2.8, 0.4], to: [0, 0, -5], duration: 0.4, arc: false },
    { type: 'player_move', time: 2.5, id: 'C', to: [0, 0, 0.5], duration: 0.3 },
    // Rapide: blockers react too late — shows why tempo 1 is so effective
    { type: 'player_move', time: 2.0, id: 'OPP_BL', to: [-1.5, 1.0, -0.5], duration: 0.15 },
    { type: 'player_pose', time: 2.0, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 2.0, id: 'OPP_BR', to: [1.5, 1.0, -0.5], duration: 0.15 },
    { type: 'player_pose', time: 2.0, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 2.1, id: 'OPP_D1', to: [0, 0, -4.8], duration: 0.35 },
    { type: 'player_pose', time: 2.4, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Service côté gauche', description: 'Service vers la zone 5. Le libéro réceptionne dans son couloir.' },
    { id: 's2', startTime: 0.4, title: '2. Permutation Pt↔C', description: 'Le pointu glisse en zone 2 ; le central prend le centre du filet pour préparer la rapide.' },
    { id: 's3', startTime: 1.0, title: '3. Pénétration médiane', description: 'Le passeur traverse depuis P6 vers la zone 2-3 (trajet médian, plus court que P5).' },
    { id: 's4', startTime: 1.6, title: '4. Pré-saut du central', description: "Le central décolle déjà avant la passe — c'est le tempo 1 (rapide tendue)." },
    { id: 's5', startTime: 1.9, title: '5. Passe rapide tendue', description: "Le passeur envoie une balle rapide à 1 m, juste devant lui. Le central est déjà en l'air." },
    { id: 's6', startTime: 2.0, title: '6. Frappe au centre', description: "Frappe rapide centrale qui surprend le contre adverse avant qu'il ne soit en place." },
  ],
  summary: {
    keyPoints: [
      'P6 = pénétration médiane. Idéal pour les combinaisons rapides.',
      "Tempo 1 : central déjà en l'air au moment où le passeur touche le ballon.",
      'Le central fixe le contre adverse central : libère les ailes pour les R4.',
      'Permutation Pt↔C systématique pour replacer le central au centre.',
    ],
    commonMistakes: [
      'Central qui décolle trop tard → balle passe au-dessus de sa main.',
      'Passe trop haute pour le tempo 1 → contre adverse en place.',
      'Pointu qui ne permute pas → central bloqué en zone 2.',
    ],
  },
};

// Scenario A7 — 6v6 attack 4-2 system (2 setters in opposition, beginner-friendly)
const ATTACK_4_2: Scenario = {
  id: '6v6-attack-4-2',
  title: 'Attaque · Système 4-2',
  shortDescription: 'Système 4-2 débutant : passeur avant fixe en zone 2, 2 attaquants disponibles.',
  config: {
    teamSize: 6,
    phase: 'attack',
    contextLabel: '4-2 · 2 passeurs en opposition · M13/M15',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'R4a', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.6] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'P1', label: 'Passeur 1 (P2)', role: 'setter', color: COLORS.setter, position: [3, 0, 0.6] },
    { id: 'P2', label: 'Passeur 2 (P5)', role: 'setter', color: COLORS.setter, position: [-3, 0, 4] },
    { id: 'C2', label: 'Central 2 (P6)', role: 'middle', color: COLORS.middle_back, position: [0, 0, 5] },
    { id: 'R4b', label: 'R4 (P1)', role: 'outside', color: COLORS.outside, position: [3, 0, 4] },
    ...opponentBlockers(),
    { id: 'OPP_D1', label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent, position: [3.0, 0, -3.5] },
  ],
  initialBallPosition: [0, 2.5, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -9], to: [0, 1.2, 4.5], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'C2', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'C2', to: [0, 0, 4.5], duration: 0.5 },
    { type: 'player_pose', time: 1.0, id: 'C2', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [0, 1.2, 4.5], to: [2.5, 1.9, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BL', to: [-2.5, 0, -0.4], duration: 0.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BR', to: [-1.0, 0, -0.4], duration: 0.6 },
    { type: 'player_pose', time: 1.9, id: 'P1', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.9, from: [2.5, 1.9, 0.8], to: [-3.2, 3.5, 0.6], duration: 0.8, arc: 4.5 },
    { type: 'player_move', time: 2.0, id: 'R4a', to: [-3.2, 0, 1.2], duration: 0.4 },
    { type: 'player_move', time: 2.4, id: 'R4a', to: [-3.2, 1.9, 0.6], duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'R4a', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.7, id: 'R4a', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.7, from: [-3.2, 3.5, 0.6], to: [2, 0, -6], duration: 0.5, arc: false },
    { type: 'player_move', time: 2.4, id: 'OPP_BL', to: [-2.5, 1.6, -0.4], duration: 0.2 },
    { type: 'player_move', time: 2.4, id: 'OPP_BR', to: [-1.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 2.7, id: 'OPP_D1', to: [2, 0, -5.8], duration: 0.4 },
    { type: 'player_pose', time: 3.1, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Configuration 4-2', description: '2 passeurs en opposition diagonale (P2 et P5). Le passeur en avant (P1) fait toujours la 2ᵉ touche.' },
    { id: 's2', startTime: 1.0, title: '2. Réception centrale', description: 'Le central arrière fait la première touche dans une réception en W classique.' },
    { id: 's3', startTime: 1.5, title: '3. Bloc adverse', description: "Bloc à 2 sur la zone 4 — l'adversaire sait qu'il n'y a que 2 attaquants devant." },
    { id: 's4', startTime: 1.9, title: '4. Passe directe', description: "Le passeur avant n'a qu'à distribuer : pas de pénétration, pas de permutation." },
    { id: 's5', startTime: 2.5, title: "5. Attaque sur l'aile", description: "Le R4 attaque en zone 4. Pas d'option centrale puisque le central a réceptionné." },
  ],
  summary: {
    keyPoints: [
      '4-2 : 2 passeurs + 2 centraux + 2 R4. Toujours 2 attaquants devant.',
      'Le passeur avant (en P2 ou P3 selon variante) fait systématiquement la 2ᵉ touche.',
      'Pas de pénétration, pas de permutation : système le plus simple à apprendre.',
      "Idéal en M13/M15 ou en initiation adulte. Favorise l'apprentissage des rotations.",
    ],
    commonMistakes: [
      'Passeur avant qui réceptionne aussi → impossible de faire la 2ᵉ touche.',
      'Passeur arrière qui veut faire la passe → règle du passeur avant non respectée.',
      'Central qui ne fixe pas → bloc à 2 facile.',
    ],
  },
};

// Scenario A8 — 6v6 attack 6-2 system (2 setters double as attackers)
const ATTACK_6_2: Scenario = {
  id: '6v6-attack-6-2',
  title: 'Attaque · Système 6-2',
  shortDescription: 'Système 6-2 : passeur arrière pénètre, 3 attaquants devant en permanence.',
  config: {
    teamSize: 6,
    phase: 'attack',
    contextLabel: '6-2 · Passeur pénétrant · Intermédiaire',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'R4a', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.6] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'PA', label: 'Passeur-Att (P2)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.6] },
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 4] },
    { id: 'C2', label: 'Central (P6)', role: 'middle', color: COLORS.middle_back, position: [0, 0, 5] },
    { id: 'R4b', label: 'R4 (P5)', role: 'outside', color: COLORS.outside_back, position: [-3, 0, 4] },
    ...opponentBlockers(),
    { id: 'OPP_D1', label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent, position: [-3.0, 0, -3.5] },
  ],
  initialBallPosition: [0, 2.5, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -9], to: [0, 1.2, 4.5], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'C2', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'C2', to: [0, 0, 4.5], duration: 0.5 },
    { type: 'player_pose', time: 1.0, id: 'C2', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [0, 1.2, 4.5], to: [1.5, 1.9, 0.8], duration: 0.9, arc: 4.0 },
    { type: 'player_move', time: 1.0, id: 'P', to: [1.5, 0, 0.8], duration: 0.8 },
    { type: 'player_move', time: 1.5, id: 'OPP_BL', to: [1.0, 0, -0.4], duration: 0.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BR', to: [2.5, 0, -0.4], duration: 0.5 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    // Passe vers le pointu (qui est aussi passeur-attaquant en 6-2) en zone 2
    { type: 'ball_move', time: 1.9, from: [1.5, 1.9, 0.8], to: [3.2, 3.4, 0.6], duration: 0.7, arc: 4.0 },
    { type: 'player_move', time: 2.0, id: 'PA', to: [3.2, 0, 1.2], duration: 0.4 },
    { type: 'player_move', time: 2.4, id: 'PA', to: [3.2, 1.9, 0.6], duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'PA', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.6, id: 'PA', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.6, from: [3.2, 3.4, 0.6], to: [-2.5, 0, -6], duration: 0.5, arc: false },
    { type: 'player_move', time: 2.4, id: 'OPP_BL', to: [1.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_move', time: 2.4, id: 'OPP_BR', to: [2.5, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 2.6, id: 'OPP_D1', to: [-2.5, 0, -5.8], duration: 0.4 },
    { type: 'player_pose', time: 3.0, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Configuration 6-2', description: '2 passeurs polyvalents : celui en avant attaque, celui en arrière distribue (et pénètre).' },
    { id: 's2', startTime: 1.0, title: '2. Réception du central', description: 'Réception classique au centre. Le passeur arrière déclenche sa pénétration.' },
    { id: 's3', startTime: 1.5, title: '3. 3 attaquants prêts', description: 'R4 en zone 4, central en 3, passeur-attaquant en 2 — toujours 3 options devant.' },
    { id: 's4', startTime: 1.9, title: '4. Passe en zone 2', description: 'Distribution vers le passeur-attaquant en zone 2. Variété maximale.' },
    { id: 's5', startTime: 2.5, title: '5. Attaque diagonale', description: 'Frappe en diagonale longue. Le 6-2 garantit toujours 3 menaces offensives.' },
  ],
  summary: {
    keyPoints: [
      '6-2 : 2 passeurs polyvalents en opposition diagonale.',
      'Toujours 3 attaquants devant (le passeur avant attaque, le passeur arrière distribue).',
      'Pénétration systématique, comme en 5-1, mais avec 2 distributeurs alternés.',
      'Excellent pour développer la polyvalence avant de basculer en 5-1.',
    ],
    commonMistakes: [
      'Différence de style entre les 2 passeurs → distribution incohérente.',
      'Passeur avant qui ne se présente pas en attaque → 2 options seulement.',
      'Pénétration trop tardive → recours à un autre joueur pour la passe.',
    ],
  },
};

// Scenario A9 — 5v5 attack in pentagon formation (4-1 system)
const ATTACK_5V5_PENTAGON: Scenario = {
  id: '5v5-attack-pentagon',
  title: '5v5 · Attaque pentagone',
  shortDescription: 'Format 5v5 : 1 passeur unique + 1 central + 2 ailiers + 1 arrière. Attaque en zone 4.',
  config: {
    teamSize: 5,
    phase: 'attack',
    contextLabel: '5v5 · Système 4-1 · Format hybride',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'R4', label: 'Aile gauche', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.6] },
    { id: 'C', label: 'Central', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'P', label: 'Passeur (P2)', role: 'setter', color: COLORS.setter, position: [3, 0, 0.6] },
    { id: 'A1', label: 'Arrière G (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 5] },
    { id: 'A2', label: 'Arrière D (P1)', role: 'outside', color: COLORS.outside, position: [2.5, 0, 5] },
    ...opponentBlockers(),
    { id: 'OPP_D1', label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent, position: [2.5, 0, -2.5] },
  ],
  initialBallPosition: [0, 2.5, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -9], to: [-1.0, 1.2, 4.8], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'A1', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'A1', to: [-1.0, 0, 4.8], duration: 0.5 },
    { type: 'player_pose', time: 1.0, id: 'A1', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [-1.0, 1.2, 4.8], to: [2.8, 1.9, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BL', to: [-2.5, 0, -0.4], duration: 0.5 },
    { type: 'player_move', time: 1.5, id: 'OPP_BR', to: [-1.0, 0, -0.4], duration: 0.6 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.9, from: [2.8, 1.9, 0.8], to: [-3.2, 3.4, 0.6], duration: 0.7, arc: 4.5 },
    { type: 'player_move', time: 2.0, id: 'R4', to: [-3.2, 0, 1.2], duration: 0.4 },
    { type: 'player_move', time: 2.4, id: 'R4', to: [-3.2, 1.8, 0.6], duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'R4', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.6, id: 'R4', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.6, from: [-3.2, 3.4, 0.6], to: [2, 0, -6], duration: 0.5, arc: false },
    { type: 'player_move', time: 2.4, id: 'OPP_BL', to: [-2.5, 1.6, -0.4], duration: 0.2 },
    { type: 'player_move', time: 2.4, id: 'OPP_BR', to: [-1.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 2.6, id: 'OPP_D1', to: [2, 0, -5.8], duration: 0.4 },
    { type: 'player_pose', time: 3.0, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Pentagone offensif', description: '5 joueurs en pentagone : 3 devant (R4, C, P) + 2 arrière. Couverture régulière.' },
    { id: 's2', startTime: 1.0, title: '2. Réception arrière', description: "L'arrière gauche prend la première balle. Sans libéro, l'arrière le plus solide en réception." },
    { id: 's3', startTime: 1.5, title: '3. Bloc adverse à 2', description: "Le bloc adverse en pentagone aussi : 2 contreurs sur l'aile." },
    { id: 's4', startTime: 1.9, title: '4. Passe en zone 4', description: 'Le passeur, déjà au filet, distribue facilement. Pas de pénétration en 5v5.' },
    { id: 's5', startTime: 2.5, title: "5. Attaque sur l'aile", description: "L'aile gauche conclut. La défense au sol est plus rare avec un seul arrière par couloir." },
  ],
  summary: {
    keyPoints: [
      '5v5 = format hybride (entraînement, manque de joueur). Pas de règlement officiel FFVB.',
      'Pentagone : 1 joueur par zone clé, couverture régulière de tout le terrain.',
      'Système 4-1 = équivalent du 5-1 mais avec un attaquant en moins.',
      'Recommandation : conserver le système 5-1 du 6v6 en retirant un arrière non-passeur.',
    ],
    commonMistakes: [
      'Pas de libéro en 5v5 → tous les arrières doivent savoir réceptionner.',
      'Vouloir bloquer à 3 → seulement 2 défenseurs au sol restants.',
      "Oublier la couverture d'attaque → un joueur en moins en couverture.",
    ],
  },
};

// Scenario A10 — 4v4 attack from losange (diamond) with attack on wing
const ATTACK_4V4_LOSANGE: Scenario = {
  id: '4v4-attack-losange',
  title: '4v4 · Attaque losange',
  shortDescription: 'Losange canonique : passeur en P3 + 2 ailes sur les 3 m + arrière. Réception → attaque en zone 4.',
  config: {
    teamSize: 4,
    phase: 'attack',
    contextLabel: '4v4 · Losange (1-2-1) · UNSS / loisir',
  },
  defaultCamera: 'DEFAULT',
  players: [
    // DÉPART = formation losange (matche /positions). Personne au net pour attaquer encore.
    { id: 'P', label: 'Passeur (P3)', role: 'setter', color: COLORS.setter, position: [0, 0, 0.6] },
    { id: 'R4', label: 'Aile G (P4)', role: 'outside', color: COLORS.outside, position: [-2.5, 0, 2.5] },
    { id: 'A2', label: 'Aile D (P2)', role: 'outside', color: COLORS.outside, position: [2.5, 0, 2.5] },
    { id: 'A', label: 'Arrière (P1)', role: 'libero', color: COLORS.libero, position: [0, 0, 5.5] },
    // 4v4 defense: block on their right (our Z4 attacker at x=-3), cross defender covers diagonal
    { id: 'OPP_B',   label: 'Bloc adverse',    role: 'opponent', color: COLORS.opponent, position: [-2.5, 0, -0.5] },
    { id: 'OPP_OFF', label: 'Off-blocker adv.', role: 'opponent', color: COLORS.opponent, position: [-3.0, 0, -2.0] },
    { id: 'OPP_D1',  label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent, position: [2.5, 0, -2.5] },
    { id: 'OPP_D2',  label: 'Arrière adv.',    role: 'opponent', color: COLORS.opponent, position: [0, 0, -5.5] },
  ],
  initialBallPosition: [0, 2.5, -7],
  timeline: [
    // ── Phase 1 : service adverse + lecture en READY ──
    { type: 'ball_move', time: 0, from: [0, 2.5, -7], to: [0, 1.2, 4.5], duration: 0.9, arc: 3.0 },
    { type: 'player_pose', time: 0.05, id: 'R4', pose: 'READY', duration: 0.2 },
    { type: 'player_pose', time: 0.05, id: 'A2', pose: 'READY', duration: 0.2 },
    { type: 'player_pose', time: 0.05, id: 'A', pose: 'READY', duration: 0.2, text: "J'ai !" },
    { type: 'player_move', time: 0.3, id: 'A', to: [0, 0, 4.5], duration: 0.4 },

    // ── Phase 2 : réception + transition vers l'attaque ──
    { type: 'player_pose', time: 0.9, id: 'A', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.9, from: [0, 1.2, 4.5], to: [0, 1.9, 0.8], duration: 0.9, arc: 3.5 },
    // R4 enchaîne sa course d'élan vers la zone 4 (départ depuis la position losange)
    { type: 'player_move', time: 0.9, id: 'R4', to: [-3.5, 0, 1.5], duration: 0.7 },

    // ── Phase 3 : passe en touche + défense adverse en place ──
    // Bloc glisse face à l'attaquant; off-blocker couvre la ligne; cross defender prend son couloir
    { type: 'player_move', time: 1.5, id: 'OPP_B',   to: [-3.0, 0, -0.4], duration: 0.3 },
    { type: 'player_move', time: 1.5, id: 'OPP_OFF', to: [-3.0, 0, -3.0], duration: 0.4 },
    { type: 'player_move', time: 1.5, id: 'OPP_D1',  to: [2.5, 0, -4.0], duration: 0.5 },
    { type: 'player_pose', time: 1.8, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.8, from: [0, 1.9, 0.8], to: [-3.0, 3.4, 0.6], duration: 0.7, arc: 4.0 },

    // Couverture : passeur, A2 et A se rapprochent en triangle
    { type: 'player_move', time: 1.9, id: 'P', to: [-1.5, 0, 1.5], duration: 0.4 },
    { type: 'player_move', time: 1.9, id: 'A2', to: [-0.5, 0, 2.0], duration: 0.4 },
    { type: 'player_move', time: 1.9, id: 'A', to: [-1, 0, 3.5], duration: 0.4 },

    // ── Phase 4 : armé + frappe ──
    { type: 'player_move', time: 2.3, id: 'R4', to: [-3.0, 1.8, 0.6], duration: 0.2 },
    { type: 'player_move', time: 2.3, id: 'OPP_B', to: [-3.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.3, id: 'OPP_B', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'R4', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'R4', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.5, from: [-3.0, 3.4, 0.6], to: [2, 0, -5], duration: 0.5, arc: false },
    // Cross defender plonge sur la diagonale — arrive 0.1 s trop tard (balle à t=3.0)
    { type: 'player_move', time: 2.5, id: 'OPP_D1', to: [2.0, 0, -4.8], duration: 0.4 },
    { type: 'player_pose', time: 2.9, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },

    // ── Phase 5 : RESET — retour à la formation losange ──
    { type: 'player_move', time: 3.2, id: 'P', to: [0, 0, 0.6], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'R4', to: [-2.5, 0, 2.5], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'A2', to: [2.5, 0, 2.5], duration: 0.7 },
    { type: 'player_move', time: 3.2, id: 'A', to: [0, 0, 5.5], duration: 0.7 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Formation losange (départ)', description: 'Disposition canonique : passeur AU CENTRE du filet (P3) + 2 ailes sur les 3 m + arrière au fond.' },
    { id: 's2', startTime: 0.3, title: "2. Réception de l'arrière", description: "L'arrière unique avance et reçoit (BUMP). Trajectoire haute vers le passeur au filet." },
    { id: 's3', startTime: 0.9, title: "3. Course d'élan + passe", description: "R4 enchaîne sa course d'élan vers la zone 4. Le passeur prépare sa passe." },
    { id: 's4', startTime: 1.5, title: '4. Bloc adverse en place', description: 'Le bloc adverse glisse vers la zone 4 pour fermer l\'angle.' },
    { id: 's5', startTime: 1.8, title: '5. Passe en cloche + couverture', description: 'Passe haute vers le R4. Passeur, A2 et A forment une couverture en triangle.' },
    { id: 's6', startTime: 2.4, title: '6. Frappe en diagonale', description: "Frappe puissante. Avec un bloc à 1, l'angle est large." },
    { id: 's7', startTime: 3.2, title: '7. RESET — retour au losange', description: "Tout le monde reprend sa position dans le losange pour le coup suivant." },
  ],
  summary: {
    keyPoints: [
      'Losange canonique = formation 4v4 la plus utilisée.',
      'Variante "passeur centre" : passeur en P3, distribue à gauche ou à droite.',
      "Bloc adverse à 1 standard en 4v4 : angle d'attaque large.",
      "Couverture limitée : 3 joueurs autour de l'attaquant.",
    ],
    commonMistakes: [
      'Passeur qui réceptionne aussi → impossible de passer derrière.',
      'Ailes trop reculées → passe difficile pour le passeur central.',
      'Arrière trop reculé → pas de couverture du contre court.',
    ],
  },
};

// Scenario A11 — 4v4 attack with 2-2 square configuration
const ATTACK_4V4_SQUARE: Scenario = {
  id: '4v4-attack-square',
  title: '4v4 · Attaque carré',
  shortDescription: 'Formation carré (2 avant / 2 arrière) : 2 contreurs + 2 défenseurs équilibrés.',
  config: {
    teamSize: 4,
    phase: 'attack',
    contextLabel: '4v4 · Carré · Bloc à 2 possible',
  },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'P', label: 'Passeur-Att (P2)', role: 'setter', color: COLORS.setter, position: [3, 0, 0.6] },
    { id: 'R4', label: 'Attaquant (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.6] },
    { id: 'A1', label: 'Arrière G (P5)', role: 'outside', color: COLORS.outside_back, position: [-2.5, 0, 5] },
    { id: 'A2', label: 'Arrière D (P1)', role: 'libero', color: COLORS.libero, position: [2.5, 0, 5] },
    // 4v4 defense: 2-blocker wall + 2 floor defenders covering diagonal and deep center
    ...opponentBlockers(),
    { id: 'OPP_D1', label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent, position: [2.5, 0, -2.5] },
    { id: 'OPP_D2', label: 'Arrière adv.',    role: 'opponent', color: COLORS.opponent, position: [0, 0, -5.5] },
  ],
  initialBallPosition: [0, 2.5, -7],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -7], to: [-1.5, 1.2, 5], duration: 0.9, arc: 3.0 },
    { type: 'player_pose', time: 0.2, id: 'A1', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.3, id: 'A1', to: [-1.5, 0, 5], duration: 0.4 },
    { type: 'player_pose', time: 0.9, id: 'A1', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.9, from: [-1.5, 1.2, 5], to: [2.5, 1.9, 0.8], duration: 0.9, arc: 3.5 },
    // Bloc à 2 slides left to face attacker; floor defenders position behind
    { type: 'player_move', time: 1.4, id: 'OPP_BL', to: [-2.5, 0, -0.4], duration: 0.5 },
    { type: 'player_move', time: 1.4, id: 'OPP_BR', to: [-1.0, 0, -0.4], duration: 0.6 },
    { type: 'player_move', time: 1.4, id: 'OPP_D1', to: [2.5, 0, -4.0], duration: 0.5 },
    { type: 'player_pose', time: 1.8, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.8, from: [2.5, 1.9, 0.8], to: [-3.0, 3.4, 0.6], duration: 0.7, arc: 4.0 },
    { type: 'player_move', time: 1.9, id: 'R4', to: [-3.0, 0, 1.2], duration: 0.4 },
    // Bloc à 2 jumps together
    { type: 'player_move', time: 2.3, id: 'OPP_BL', to: [-2.5, 1.6, -0.4], duration: 0.2 },
    { type: 'player_move', time: 2.3, id: 'OPP_BR', to: [-1.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.3, id: 'OPP_BL', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.3, id: 'OPP_BR', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 2.3, id: 'R4', to: [-3.0, 1.8, 0.6], duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'R4', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'R4', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.5, from: [-3.0, 3.4, 0.6], to: [2.5, 0, -6], duration: 0.5, arc: false },
    // Cross defender dives on the diagonal — blocked shot passes over the 2-blocker wall
    { type: 'player_move', time: 2.5, id: 'OPP_D1', to: [2.5, 0, -5.8], duration: 0.4 },
    { type: 'player_pose', time: 2.9, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Configuration carré', description: '2 joueurs au filet (P2 et P4), 2 joueurs au fond. Couverture équilibrée.' },
    { id: 's2', startTime: 0.9, title: '2. Réception haute', description: 'Manchette en cloche vers le passeur-attaquant en zone 2.' },
    { id: 's3', startTime: 1.4, title: '3. Bloc adverse à 2', description: 'Bloc à 2 adverse possible avec 2 contreurs au filet — défense plus difficile.' },
    { id: 's4', startTime: 1.8, title: "4. Passe vers l'aile", description: "Le passeur distribue vers l'attaquant en zone 4. Pas d'option centrale (pas de central spécialisé)." },
    { id: 's5', startTime: 2.4, title: '5. Frappe contre bloc à 2', description: "L'attaquant doit choisir : ligne courte, diagonale longue ou tip dans le couloir laissé." },
  ],
  summary: {
    keyPoints: [
      'Formation carré : équilibre attaque/défense, 2 zones avant + 2 zones arrière.',
      'Permet le bloc à 2 (vs bloc à 1 du losange) — meilleure défense au filet.',
      'Mais seulement 2 joueurs au sol → vulnérable aux grandes diagonales.',
      'Bonne pour des équipes avec 2 contreurs forts et 2 défenseurs forts.',
    ],
    commonMistakes: [
      'Joueurs au filet trop éloignés du centre → bloc adverse facile.',
      'Arrières figés au fond → pas de couverture courte.',
      'Confusion sur qui passe : le passeur-attaquant doit toujours être en avant.',
    ],
  },
};

// Scenario A12 — 4v4 attack with back-row penetrating setter (3-1 system)
const ATTACK_4V4_PEN: Scenario = {
  id: '4v4-attack-penetrant',
  title: '4v4 · Passeur pénétrant',
  shortDescription: 'Système 3-1 simplifié : passeur unique en P1 pénètre vers la zone 2, libère 3 attaquants devant.',
  config: { teamSize: 4, phase: 'attack', contextLabel: '4v4 · Passeur arrière · 3 attaquants' },
  defaultCamera: 'DEFAULT',
  players: [
    { id: 'R4', label: 'Aile G (P4)', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.6] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'A2', label: 'Aile D (P2)', role: 'outside', color: COLORS.outside, position: [3, 0, 0.6] },
    { id: 'P', label: 'Passeur (P1)', role: 'setter', color: COLORS.setter, position: [3, 0, 5] },
    // 4v4 defense: block on their right (Z4 attacker), off-blocker line, cross defender, deep back
    { id: 'OPP_B',   label: 'Bloc adverse',    role: 'opponent', color: COLORS.opponent, position: [-2.5, 0, -0.5] },
    { id: 'OPP_OFF', label: 'Off-blocker adv.', role: 'opponent', color: COLORS.opponent, position: [-3.0, 0, -2.0] },
    { id: 'OPP_D1',  label: 'Déf. cross adv.', role: 'opponent', color: COLORS.opponent, position: [2.5, 0, -2.5] },
    { id: 'OPP_D2',  label: 'Arrière adv.',    role: 'opponent', color: COLORS.opponent, position: [0, 0, -5.5] },
  ],
  initialBallPosition: [0, 2.5, -7],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -7], to: [-1, 1.2, 4.5], duration: 0.9, arc: 3.0 },
    { type: 'player_pose', time: 0.2, id: 'R4', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.3, id: 'R4', to: [-1, 0, 4.5], duration: 0.4 },
    { type: 'player_pose', time: 0.9, id: 'R4', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.9, from: [-1, 1.2, 4.5], to: [2.0, 1.9, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_move', time: 0.9, id: 'P', to: [2.0, 0, 0.8], duration: 0.9 },
    { type: 'player_pose', time: 1.8, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.8, from: [2.0, 1.9, 0.8], to: [-3.0, 3.4, 0.6], duration: 0.7, arc: 4.0 },
    { type: 'player_move', time: 1.0, id: 'R4', to: [-3.0, 0, 1.5], duration: 0.7 },
    { type: 'player_move', time: 2.2, id: 'R4', to: [-3.0, 1.8, 0.6], duration: 0.2 },
    // Bloc glisse face à R4; off-blocker décroche; cross defender se positionne
    { type: 'player_move', time: 1.6, id: 'OPP_B',   to: [-3.0, 0, -0.4], duration: 0.3 },
    { type: 'player_move', time: 1.6, id: 'OPP_OFF', to: [-3.0, 0, -3.0], duration: 0.4 },
    { type: 'player_move', time: 1.6, id: 'OPP_D1',  to: [2.5, 0, -4.0], duration: 0.5 },
    { type: 'player_pose', time: 2.3, id: 'R4', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_move', time: 2.3, id: 'OPP_B', to: [-3.0, 1.6, -0.4], duration: 0.2 },
    { type: 'player_pose', time: 2.3, id: 'OPP_B', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'R4', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.5, from: [-3.0, 3.4, 0.6], to: [2, 0, -5], duration: 0.5, arc: false },
    // Cross defender dives for the diagonal — arrives 0.1 s late (ball lands at t=3.0)
    { type: 'player_move', time: 2.5, id: 'OPP_D1', to: [2.0, 0, -4.8], duration: 0.4 },
    { type: 'player_pose', time: 2.9, id: 'OPP_D1', pose: 'BUMP', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Configuration 3-1', description: 'Passeur unique en P1 (arrière). 3 attaquants devant en P2, P3, P4.' },
    { id: 's2', startTime: 0.9, title: '2. Réception + course', description: "L'aile gauche réceptionne, le passeur démarre sa pénétration vers P2." },
    { id: 's3', startTime: 1.0, title: '3. Pénétration', description: "Le passeur traverse depuis P1 vers la zone 2 — équivalent simplifié du 5-1." },
    { id: 's4', startTime: 1.8, title: '4. Distribution', description: "Passe vers l'aile gauche après la course de réception." },
    { id: 's5', startTime: 2.5, title: '5. Attaque + couverture limitée', description: "Frappe en diagonale. Avec 3 couvreurs seulement, ils forment un triangle court autour de l'attaquant." },
  ],
  summary: {
    keyPoints: [
      'Système 3-1 = équivalent du 5-1 en 4v4. 1 passeur dédié pénétrant.',
      'Avantage : 3 attaquants devant en permanence, comme en 6v6.',
      "Inconvénient : exige une réception très propre car le passeur n'est pas au filet.",
      'Pas de libéro : le réceptionneur enchaîne aussi sa course d\'élan.',
    ],
    commonMistakes: [
      'Pénétration trop tardive → un autre joueur doit faire la passe.',
      "Réception trop courte → passeur arrive trop loin du filet.",
      "Couverture oubliée — block-out adverse = point.",
    ],
  },
};

export const ATTACK_SCENARIOS: Scenario[] = [
  ATTACK_5_1_P1,
  ATTACK_5_1_P2,
  ATTACK_5_1_P3,
  ATTACK_5_1_P4,
  ATTACK_5_1_P5,
  ATTACK_5_1_P6,
  ATTACK_4_2,
  ATTACK_6_2,
  ATTACK_5V5_PENTAGON,
  ATTACK_4V4_LOSANGE,
  ATTACK_4V4_SQUARE,
  ATTACK_4V4_PEN,
];
