import type { Scenario } from '../types';
import { COLORS } from './_shared';

// Scenario R1 — 5-1 reception with 3 receivers (libero + 2 outsides)
const RECEPTION_5_1_3R: Scenario = {
  id: '5-1-reception-3-receivers',
  title: 'Réception · à 3 (5-1)',
  shortDescription: 'Réception à 3 (libéro + 2 R4) avec passeur sorti et pointu caché — formation moderne standard.',
  config: {
    teamSize: 6,
    phase: 'reception',
    contextLabel: '5-1 · Réception à 3 · Service adverse',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'R4a', label: 'R4 gauche', role: 'outside', color: COLORS.outside, position: [-3.0, 0, 4] },
    { id: 'L', label: 'Libéro', role: 'libero', color: COLORS.libero, position: [0, 0, 5.5] },
    { id: 'R4b', label: 'R4 droit', role: 'outside', color: COLORS.outside, position: [3.0, 0, 4] },
    { id: 'C', label: 'Central', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'Op', label: 'Pointu (caché)', role: 'opposite', color: COLORS.opposite, position: [3.5, 0, 0.6] },
    { id: 'P', label: 'Passeur (caché)', role: 'setter', color: COLORS.setter, position: [3.5, 0, 2.5] },
  ],
  initialBallPosition: [0, 2.8, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.8, -9], to: [-1.8, 1.2, 4.2], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'R4a', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'R4a', to: [-1.8, 0, 4.2], duration: 0.5 },
    { type: 'player_pose', time: 1.0, id: 'R4a', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [-1.8, 1.2, 4.2], to: [2.5, 2.0, 0.8], duration: 0.9, arc: 4.0 },
    { type: 'player_move', time: 1.0, id: 'P', to: [2.5, 0, 0.8], duration: 0.8 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'player_move', time: 2.0, id: 'R4a', to: [-3.0, 0, 1.5], duration: 0.4 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Position de réception', description: 'Trois réceptionneurs en arc : R4 gauche, libéro central, R4 droit. Chacun couvre ~1/3 de la largeur. Passeur et pointu cachés au filet.' },
    { id: 's2', startTime: 0.3, title: '2. Lecture & annonce', description: `Le R4 gauche lit la trajectoire du service, annonce "J'ai !" pour lever le doute.` },
    { id: 's3', startTime: 0.4, title: '3. Déplacement', description: 'Petit déplacement latéral, alignement des appuis, plateforme de manchette préparée à hauteur du nombril.' },
    { id: 's4', startTime: 1.0, title: '4. Manchette précise', description: "Manchette dirigée vers la cible passeur (entre P2 et P3), trajectoire haute permettant au passeur d'arriver." },
    { id: 's5', startTime: 1.0, title: '5. Passeur en course', description: 'Le passeur sort de sa cachette et pénètre vers la zone 2-3.' },
    { id: 's6', startTime: 2.0, title: "6. Repli pour l'attaque", description: "Le R4 récepteur déclenche immédiatement sa course d'élan vers l'aile gauche pour se présenter en attaque." },
  ],
  summary: {
    keyPoints: [
      'Réception à 3 = standard 5-1 moderne. Spécialisation maximale.',
      'Cible : zone 2-3, à un bras du filet, à hauteur ~3 m.',
      "Le passeur reste caché au filet jusqu'à la frappe du serveur, puis pénètre.",
      "Le R4 récepteur enchaîne IMMÉDIATEMENT sa course d'élan d'attaque.",
    ],
    commonMistakes: [
      'Réception trop plate ou trop courte → passeur arrive en retard.',
      'Conflit entre 2 réceptionneurs → annonce vocale obligatoire.',
      'R4 qui reste figé après réception → perd une option offensive en zone 4.',
    ],
  },
};

// Scenario R2 — 6v6 reception in W formation (5 receivers, beginners)
const RECEPTION_W: Scenario = {
  id: '6v6-reception-w',
  title: 'Réception · W (5 réceptionneurs)',
  shortDescription: 'Formation en W : 5 joueurs sauf le passeur. Adapté aux débutants et au système 4-2.',
  config: {
    teamSize: 6,
    phase: 'reception',
    contextLabel: '4-2 · W · Débutants / M13',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'P', label: 'Passeur (sorti)', role: 'setter', color: COLORS.setter, position: [3, 0, 0.6] },
    { id: 'R4a', label: 'Avant G', role: 'outside', color: COLORS.outside, position: [-2.8, 0, 3] },
    { id: 'R4b', label: 'Avant D', role: 'outside', color: COLORS.outside, position: [2.8, 0, 3] },
    { id: 'C', label: 'Médian', role: 'middle', color: COLORS.middle, position: [0, 0, 5] },
    { id: 'A1', label: 'Arrière G', role: 'outside', color: COLORS.outside, position: [-2.8, 0, 7] },
    { id: 'A2', label: 'Arrière D', role: 'libero', color: COLORS.libero, position: [2.8, 0, 7] },
  ],
  initialBallPosition: [0, 2.8, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.8, -9], to: [0, 1.2, 5.2], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'C', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'C', to: [0, 0, 5.2], duration: 0.4 },
    { type: 'player_pose', time: 1.0, id: 'C', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [0, 1.2, 5.2], to: [2.5, 2.0, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.9, from: [2.5, 2.0, 0.8], to: [-3, 3.5, 0.6], duration: 0.7, arc: 4.0 },
    { type: 'player_move', time: 2.0, id: 'R4a', to: [-3, 0, 1], duration: 0.4 },
    { type: 'player_pose', time: 2.4, id: 'R4a', pose: 'ARM_SPIKE', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Formation W', description: 'Disposition en W : 2 avants à mi-terrain, 1 médian, 2 arrières au fond. Le passeur sort.' },
    { id: 's2', startTime: 0.3, title: '2. Médian annonce', description: `Le médian a la zone centrale. Annonce "J'ai !" dès qu'il lit la trajectoire.` },
    { id: 's3', startTime: 0.4, title: '3. Petites zones individuelles', description: "Chaque joueur défend une petite zone (~10-12 m²). Idéal pour les débutants : moins d'erreurs." },
    { id: 's4', startTime: 1.0, title: '4. Manchette vers le passeur', description: 'Cible : zone 2-3. Le passeur, déjà au filet en 4-2, distribue.' },
    { id: 's5', startTime: 1.9, title: '5. Distribution simple', description: "Le passeur distribue vers l'aile gauche pour une attaque classique." },
  ],
  summary: {
    keyPoints: [
      'Formation W = 5 réceptionneurs, le passeur sort.',
      'Petites zones individuelles → moins de doute, peu de conflits.',
      'Idéal en M13/M15 et en système 4-2 (débutants).',
      'Inconvénient : les attaquants spécialisés sont bridés en réception.',
    ],
    commonMistakes: [
      'Conflit central entre médian et avants → annonce obligatoire.',
      'Joueurs trop figés dans leur zone → balle entre 2 zones perdue.',
      'Passeur qui reste en réception → impossible de faire la 2ᵉ touche.',
    ],
  },
};

// Scenario R3 — 6v6 reception semi-circular (transition between W and 3R)
const RECEPTION_SEMI_CIRCLE: Scenario = {
  id: '6v6-reception-semi-circle',
  title: 'Réception · semi-circulaire',
  shortDescription: 'Réception en arc de cercle ouvert vers le serveur, à équidistance. Étape M15-M18.',
  config: {
    teamSize: 6,
    phase: 'reception',
    contextLabel: '5-1 · Semi-circulaire · M15-M18',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'P', label: 'Passeur (sorti)', role: 'setter', color: COLORS.setter, position: [3, 0, 1.5] },
    { id: 'R4a', label: 'R4 G', role: 'outside', color: COLORS.outside, position: [-3.0, 0, 4] },
    { id: 'C', label: 'Central', role: 'middle', color: COLORS.middle, position: [-1.5, 0, 5.5] },
    { id: 'L', label: 'Libéro', role: 'libero', color: COLORS.libero, position: [0, 0, 6] },
    { id: 'R4b', label: 'R4 D', role: 'outside', color: COLORS.outside, position: [1.5, 0, 5.5] },
    { id: 'Op', label: 'Pointu', role: 'opposite', color: COLORS.opposite, position: [3.0, 0, 4] },
  ],
  initialBallPosition: [0, 2.8, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.8, -9], to: [-1.2, 1.2, 5], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'C', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'C', to: [-1.2, 0, 5], duration: 0.4 },
    { type: 'player_pose', time: 1.0, id: 'C', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [-1.2, 1.2, 5], to: [2.5, 2.0, 0.8], duration: 0.9, arc: 4.0 },
    { type: 'player_move', time: 1.0, id: 'P', to: [2.5, 0, 0.8], duration: 0.8 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Arc semi-circulaire', description: 'Les 5 réceptionneurs forment un arc à équidistance du serveur. Tous orientés vers le passeur.' },
    { id: 's2', startTime: 0.3, title: '2. Lecture commune', description: 'Tous regardent dans la même direction. Annonce vocale du joueur le plus proche.' },
    { id: 's3', startTime: 1.0, title: '3. Manchette précise', description: "Cible : zone 2-3 où le passeur est en train d'arriver." },
    { id: 's4', startTime: 1.0, title: '4. Pénétration en parallèle', description: 'Le passeur sort de sa cachette pendant que la réception se fait.' },
    { id: 's5', startTime: 1.9, title: '5. Préparation attaque', description: 'Distribution classique. Le central qui a réceptionné continue son attaque.' },
  ],
  summary: {
    keyPoints: [
      'Arc semi-circulaire = étape intermédiaire entre W et réception à 3.',
      'Les 5 joueurs équidistants du serveur → couverture homogène.',
      'Adapté en formation jeune (M15-M18) qui apprend la spécialisation.',
      'Conserve un central en réception (vs réception à 3 où il est sorti).',
    ],
    commonMistakes: [
      'Arc trop ouvert vers les côtés → trous au centre.',
      'Joueurs trop éloignés du serveur → réaction tardive sur les services rapides.',
      'Conflit avec le passeur qui veut aussi réceptionner.',
    ],
  },
};

// Scenario R4 — 6v6 reception with only 2 receivers (elite, easy serves)
const RECEPTION_2: Scenario = {
  id: '6v6-reception-2-receivers',
  title: 'Réception · à 2 (élite)',
  shortDescription: 'Réception ultra-spécialisée à 2 (libéro + R4) : tous les autres prêts à attaquer.',
  config: {
    teamSize: 6,
    phase: 'reception',
    contextLabel: '5-1 · Réception à 2 · Élite / free balls',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'L', label: 'Libéro', role: 'libero', color: COLORS.libero, position: [-1.5, 0, 5] },
    { id: 'R4a', label: 'R4 réceptionneur', role: 'outside', color: COLORS.outside, position: [2, 0, 5] },
    { id: 'R4b', label: 'R4 attaquant', role: 'outside', color: COLORS.outside, position: [-3, 0, 0.6] },
    { id: 'C', label: 'Central', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'Op', label: 'Pointu (caché)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 0.6] },
    { id: 'P', label: 'Passeur (caché)', role: 'setter', color: COLORS.setter, position: [3.5, 0, 2] },
  ],
  initialBallPosition: [0, 2.8, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.8, -9], to: [-1.0, 1.2, 5], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'L', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'L', to: [-1.0, 0, 5], duration: 0.4 },
    { type: 'player_pose', time: 1.0, id: 'L', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [-1.0, 1.2, 5], to: [2.5, 2.0, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_move', time: 1.0, id: 'P', to: [2.5, 0, 0.8], duration: 0.8 },
    // R4 attacker is already in motion since reception starts
    { type: 'player_move', time: 1.0, id: 'R4b', to: [-3.5, 0, 1.5], duration: 0.5 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.9, from: [2.5, 2.0, 0.8], to: [-3.3, 3.5, 0.6], duration: 0.7, arc: 4.0 },
    { type: 'player_move', time: 2.0, id: 'R4b', to: [-3.3, 1.9, 0.6], duration: 0.4 },
    { type: 'player_pose', time: 2.4, id: 'R4b', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.6, id: 'R4b', pose: 'SPIKE', duration: 0.1 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Configuration à 2', description: 'Seulement 2 réceptionneurs (libéro + R4 droit). Les 4 autres sont prêts à attaquer.' },
    { id: 's2', startTime: 0.3, title: '2. Service facile', description: 'Utilisé sur free balls ou contre un service prévisible. Variété maximale.' },
    { id: 's3', startTime: 1.0, title: '3. Manchette ultra-précise', description: 'Avec seulement 2 zones, exigence technique extrême. Le libéro doit être exceptionnel.' },
    { id: 's4', startTime: 1.0, title: '4. Tous attaquants', description: "Le R4 gauche est DÉJÀ en course d'élan dès la réception → arrive à grande vitesse." },
    { id: 's5', startTime: 1.9, title: '5. Combinaisons rapides', description: 'Le passeur peut tenter une rapide centrale + 2 attaquants en aile + pointu arrière.' },
  ],
  summary: {
    keyPoints: [
      'Réception à 2 = configuration élite (volley professionnel).',
      'Utilisée sur services faciles ou rotations "passeur avant".',
      'Variété offensive maximale : tous les attaquants disponibles immédiatement.',
      'Exigence technique extrême : 2 réceptionneurs solides obligatoires.',
    ],
    commonMistakes: [
      'Adopter ce système contre un service puissant → réceptions catastrophiques.',
      'R4 attaquant qui ne démarre pas son élan en parallèle → option perdue.',
      "Pas d'annonce → flottement entre les 2 réceptionneurs.",
    ],
  },
};

// Scenario R5 — 6v6 reception in 4-2 system (4 receivers, setter front-fixed)
const RECEPTION_4_2: Scenario = {
  id: '6v6-reception-4-2',
  title: 'Réception · 4-2 (4 réceptionneurs)',
  shortDescription: 'Système 4-2 : passeur fixe en P2 + 4 réceptionneurs (les 2 R4 + central + arrière).',
  config: {
    teamSize: 6,
    phase: 'reception',
    contextLabel: '4-2 · 4 réceptionneurs · Passeur avant fixe',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'P', label: 'Passeur (P2 fixe)', role: 'setter', color: COLORS.setter, position: [3, 0, 0.6] },
    { id: 'C2', label: 'Central avant', role: 'middle', color: COLORS.middle, position: [0, 0, 0.6] },
    { id: 'R4a', label: 'R4 G', role: 'outside', color: COLORS.outside, position: [-3, 0, 3.5] },
    { id: 'C', label: 'Central arr.', role: 'middle', color: COLORS.middle, position: [0, 0, 5] },
    { id: 'R4b', label: 'R4 D', role: 'outside', color: COLORS.outside, position: [3, 0, 5.5] },
    { id: 'P2', label: 'Passeur arr.', role: 'setter', color: COLORS.setter, position: [-3, 0, 6] },
  ],
  initialBallPosition: [0, 2.8, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.8, -9], to: [-1.5, 1.2, 4], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'R4a', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'R4a', to: [-1.5, 0, 4], duration: 0.4 },
    { type: 'player_pose', time: 1.0, id: 'R4a', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [-1.5, 1.2, 4], to: [2.5, 2.0, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.9, from: [2.5, 2.0, 0.8], to: [-3, 3.5, 0.6], duration: 0.7, arc: 4.0 },
    { type: 'player_move', time: 2.0, id: 'R4a', to: [-3, 0, 1.5], duration: 0.4 },
    { type: 'player_pose', time: 2.4, id: 'R4a', pose: 'ARM_SPIKE', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Disposition 4-2', description: '2 passeurs en opposition. Le passeur avant (P2) sort de la réception, le central avant aussi. 4 réceptionneurs.' },
    { id: 's2', startTime: 0.3, title: '2. Couverture en trapèze', description: "4 zones plus larges qu'en W. Le R4 gauche prend la balle dans son couloir." },
    { id: 's3', startTime: 1.0, title: '3. Cible passeur fixe', description: 'Pas de pénétration : le passeur en P2 attend la balle.' },
    { id: 's4', startTime: 1.9, title: '4. Distribution', description: "Le passeur distribue. Pas d'option centrale puisque le central arrière n'attaque pas en avant (en 4-2)." },
    { id: 's5', startTime: 2.4, title: '5. Attaque rapide', description: 'Le R4 gauche, déjà avancé, frappe rapidement.' },
  ],
  summary: {
    keyPoints: [
      'Réception à 4 = système 4-2. 2 joueurs avant sortis (passeur + central avant).',
      "Zones plus grandes qu'en W mais moins exigeant que la réception à 3.",
      'Cible facile : le passeur ne bouge pas.',
      'Inconvénient : seulement 2 attaquants devant.',
    ],
    commonMistakes: [
      'Le central avant qui réceptionne aussi → pas de fixation au filet.',
      'Trapèze trop ouvert → balles centrales non couvertes.',
      'Confusion sur la 2ᵉ touche entre les 2 passeurs.',
    ],
  },
};

// Scenario R6 — 6v6 reception 5-1 rotation P4 (special case: setter front-left)
const RECEPTION_P4: Scenario = {
  id: '6v6-reception-rotation-p4',
  title: 'Réception · 5-1 rotation P4',
  shortDescription: 'Cas spécial P4 : le passeur et le central se décalent à gauche pour libérer le R4 en zone 6.',
  config: {
    teamSize: 6,
    phase: 'reception',
    contextLabel: '5-1 · Réception à 3 · Rotation P4 (passeur avant)',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'P', label: 'Passeur (P4)', role: 'setter', color: COLORS.setter, position: [-3.5, 0, 0.6] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [-1.0, 0, 0.6] },
    { id: 'R4b', label: 'R4* (P2)', role: 'outside', color: COLORS.outside, position: [3.0, 0, 0.6] },
    { id: 'L', label: 'Libéro (P5)', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 4] },
    { id: 'R4a', label: 'R4 (P6)', role: 'outside', color: COLORS.outside, position: [0, 0, 5] },
    { id: 'Op', label: 'Pointu (P1)', role: 'opposite', color: COLORS.opposite, position: [3, 0, 4] },
  ],
  initialBallPosition: [0, 2.8, -9],
  timeline: [
    // Setter and central drift left at the moment of serve
    { type: 'player_move', time: 0, id: 'P', to: [-3.8, 0, 0.6], duration: 0.3 },
    { type: 'player_move', time: 0, id: 'C', to: [-1.5, 0, 0.6], duration: 0.3 },
    { type: 'ball_move', time: 0, from: [0, 2.8, -9], to: [0, 1.2, 5], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'R4a', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'R4a', to: [0, 0, 5], duration: 0.4 },
    { type: 'player_pose', time: 1.0, id: 'R4a', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [0, 1.2, 5], to: [1.5, 2.0, 0.8], duration: 0.9, arc: 4.0 },
    // Setter penetrates from P4 to zone 2-3
    { type: 'player_move', time: 1.0, id: 'P', to: [1.5, 0, 0.8], duration: 0.8 },
    // R4* permutes from P2 to P4 to attack
    { type: 'player_move', time: 1.0, id: 'R4b', to: [-3, 0, 0.6], duration: 0.8 },
    { type: 'player_move', time: 1.0, id: 'C', to: [0, 0, 0.6], duration: 0.5 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Décalage à gauche', description: "AVANT la frappe : passeur et central se placent le PLUS À GAUCHE possible, dans les règles d'alignement." },
    { id: 's2', startTime: 0, title: '2. R4 libre en zone 6', description: 'Ce décalage ouvre la zone 6 pour que le R4 puisse y réceptionner sans conflit.' },
    { id: 's3', startTime: 0.3, title: '3. Lecture du service', description: 'Le R4 en P6 annonce sa prise. Trois réceptionneurs : R4 + libéro + pointu (parfois).' },
    { id: 's4', startTime: 1.0, title: '4. Pénétration + permutation', description: 'Le passeur fonce vers 2-3. Simultanément, le R4* en P2 traverse vers P4 pour attaquer.' },
    { id: 's5', startTime: 1.9, title: '5. Distribution', description: 'Avec seulement 2 attaquants devant, la passe va surtout vers le R4* en zone 4 ou le central en 3.' },
  ],
  summary: {
    keyPoints: [
      'En P4, le passeur et le central DOIVENT se décaler à gauche au service.',
      'Ce décalage ouvre la zone 6 pour la réception du R4 en P6.',
      'Permutation P↔R4* obligatoire pendant la passe.',
      "Le pointu (en P1) ne réceptionne pas et reste prêt à l'attaque arrière.",
    ],
    commonMistakes: [
      'Décalage oublié → conflit de réception en zone 6.',
      'Permutation tardive → R4* attaque en P2 (mauvais côté).',
      "Pointu qui réceptionne → perd l'option d'attaque arrière.",
    ],
  },
};

// Scenario R7 — 5v5 reception with 4 receivers (setter front)
const RECEPTION_5V5_4: Scenario = {
  id: '5v5-reception-4-receivers',
  title: '5v5 · Réception à 4',
  shortDescription: 'Format 5v5 : passeur sorti + 4 réceptionneurs en U ou en ligne.',
  config: {
    teamSize: 5,
    phase: 'reception',
    contextLabel: '5v5 · 4 réceptionneurs · Format hybride',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'P', label: 'Passeur (sorti)', role: 'setter', color: COLORS.setter, position: [3, 0, 0.6] },
    { id: 'R4a', label: 'Avant G', role: 'outside', color: COLORS.outside, position: [-3, 0, 3] },
    { id: 'C', label: 'Avant D / central', role: 'middle', color: COLORS.middle, position: [0, 0, 3] },
    { id: 'A1', label: 'Arrière G', role: 'libero', color: COLORS.libero, position: [-2.5, 0, 6] },
    { id: 'A2', label: 'Arrière D', role: 'outside', color: COLORS.outside, position: [2.5, 0, 6] },
  ],
  initialBallPosition: [0, 2.8, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.8, -9], to: [-1.5, 1.2, 5], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'A1', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'A1', to: [-1.5, 0, 5], duration: 0.4 },
    { type: 'player_pose', time: 1.0, id: 'A1', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [-1.5, 1.2, 5], to: [2.5, 2.0, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_pose', time: 1.9, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.9, from: [2.5, 2.0, 0.8], to: [-3, 3.4, 0.6], duration: 0.7, arc: 4.0 },
    { type: 'player_move', time: 2.0, id: 'R4a', to: [-3, 0, 1.2], duration: 0.4 },
    { type: 'player_pose', time: 2.4, id: 'R4a', pose: 'ARM_SPIKE', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Configuration 5v5', description: 'Le passeur (en P2) sort. 4 réceptionneurs forment un U : 2 sur les 3m, 2 au fond.' },
    { id: 's2', startTime: 0.3, title: '2. Annonce arrière', description: "L'arrière gauche annonce sa prise dans son couloir." },
    { id: 's3', startTime: 1.0, title: '3. Manchette précise', description: 'Cible : zone 2, où le passeur attend déjà au filet.' },
    { id: 's4', startTime: 1.9, title: '4. Distribution', description: 'Pas de pénétration en 5v5 (souvent passeur avant fixe). Distribution rapide.' },
    { id: 's5', startTime: 2.4, title: "5. Attaque sur l'aile", description: "L'avant gauche attaque immédiatement. La couverture se fait à 3 (pas 5 comme en 6v6)." },
  ],
  summary: {
    keyPoints: [
      'En 5v5 sans libéro, le meilleur réceptionneur prend la zone la plus exposée.',
      'Formation en U : 2 réceptionneurs sur les 3m + 2 au fond.',
      'Variante en ligne possible (4 alignés à mi-terrain) si moins de niveaux différents.',
      'Pas de pénétration → passeur fixe (système 4-1 simplifié).',
    ],
    commonMistakes: [
      'Forme U trop étroite → grandes diagonales non couvertes.',
      "Joueur faible en réception → l'isoler dans la plus petite zone.",
      'Passeur qui pénètre quand même → confusion avec le 6v6 standard.',
    ],
  },
};

// Scenario R8 — 5v5 reception in pentagon (all 5 receive)
const RECEPTION_5V5_PENTAGON: Scenario = {
  id: '5v5-reception-pentagon',
  title: '5v5 · Réception pentagone',
  shortDescription: 'Réception en pentagone (5 joueurs sans passeur sorti) — version débutant ou loisir.',
  config: {
    teamSize: 5,
    phase: 'reception',
    contextLabel: '5v5 · Pentagone · Sans passeur dédié',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'A1', label: 'Avant G', role: 'outside', color: COLORS.outside, position: [-3, 0, 2] },
    { id: 'C', label: 'Centre', role: 'middle', color: COLORS.middle, position: [0, 0, 4] },
    { id: 'A2', label: 'Avant D', role: 'outside', color: COLORS.outside, position: [3, 0, 2] },
    { id: 'A3', label: 'Arrière G', role: 'libero', color: COLORS.libero, position: [-2, 0, 6.5] },
    { id: 'A4', label: 'Arrière D', role: 'opposite', color: COLORS.opposite, position: [2, 0, 6.5] },
  ],
  initialBallPosition: [0, 2.8, -9],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.8, -9], to: [0, 1.2, 4.5], duration: 1.0, arc: 3.0 },
    { type: 'player_pose', time: 0.3, id: 'C', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.4, id: 'C', to: [0, 0, 4.5], duration: 0.4 },
    { type: 'player_pose', time: 1.0, id: 'C', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 1.0, from: [0, 1.2, 4.5], to: [0, 2.5, 1.2], duration: 0.8, arc: 3.5 },
    // First player closer to net does the 2nd touch (no fixed setter)
    { type: 'player_move', time: 1.0, id: 'A2', to: [0.5, 0, 1.5], duration: 0.6 },
    { type: 'player_pose', time: 1.8, id: 'A2', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.8, from: [0, 2.5, 1.2], to: [-3, 3.0, 0.6], duration: 0.7, arc: 3.5 },
    { type: 'player_move', time: 1.9, id: 'A1', to: [-3, 0, 1], duration: 0.4 },
    { type: 'player_pose', time: 2.3, id: 'A1', pose: 'ARM_SPIKE', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Pentagone à 5', description: 'Tous les joueurs réceptionnent. Pas de passeur dédié — qui touche en 1ère fait la suite.' },
    { id: 's2', startTime: 0.3, title: '2. Centre prend', description: 'Le joueur central a la zone moyenne. Annonce vocale.' },
    { id: 's3', startTime: 1.0, title: '3. 2ᵉ touche par celui qui peut', description: "Le joueur le plus proche du filet (ici l'avant droit) prend la 2ᵉ touche." },
    { id: 's4', startTime: 1.8, title: "4. Passe d'opportunité", description: 'Distribution à 10 doigts ou en manchette selon la qualité de la réception.' },
    { id: 's5', startTime: 2.3, title: '5. Attaque', description: "L'avant gauche conclut. Système simple, lisible, idéal en initiation." },
  ],
  summary: {
    keyPoints: [
      'Pentagone sans passeur dédié = configuration loisir ou initiation.',
      '5 joueurs en pentagone : 2 avants, 1 centre, 2 arrières.',
      'Tout joueur peut faire la 2ᵉ touche selon où arrive le ballon.',
      'Avantage : grande adaptabilité. Inconvénient : moins de constance offensive.',
    ],
    commonMistakes: [
      'Pas de hiérarchie sur la 2ᵉ touche → 2 joueurs hésitent.',
      'Centre figé → balles de chaque côté manquent.',
      'Passes hautes systématiques sans distribution claire.',
    ],
  },
};

// Scenario R9 — 4v4 reception losange (the most common 4v4 formation)
const RECEPTION_4V4_LOSANGE: Scenario = {
  id: '4v4-reception-losange',
  title: '4v4 · Réception losange',
  shortDescription: 'Formation losange (diamant) sur réception, passeur dédié en P2, attaque en zone 4.',
  config: {
    teamSize: 4,
    phase: 'reception',
    contextLabel: '4v4 · Losange · Passeur avant fixe',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'P', label: 'Passeur (P2)', role: 'setter', color: COLORS.setter, position: [2.5, 0, 0.6] },
    { id: 'C', label: 'Central (P3)', role: 'middle', color: COLORS.middle, position: [0, 0, 1.5] },
    { id: 'R4', label: 'R4 (P4)', role: 'outside', color: COLORS.outside, position: [-2.5, 0, 1.5] },
    { id: 'A', label: 'Arrière (P1)', role: 'libero', color: COLORS.libero, position: [0, 0, 5] },
  ],
  initialBallPosition: [0, 2.5, -7],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -7], to: [0, 1.2, 4.5], duration: 0.9, arc: 3.0 },
    { type: 'player_pose', time: 0.2, id: 'A', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.3, id: 'A', to: [0, 0, 4.5], duration: 0.4 },
    { type: 'player_pose', time: 0.9, id: 'A', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.9, from: [0, 1.2, 4.5], to: [2.5, 1.9, 0.8], duration: 0.9, arc: 3.8 },
    { type: 'player_pose', time: 1.8, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.8, from: [2.5, 1.9, 0.8], to: [-3.0, 3.4, 0.6], duration: 0.7, arc: 4.0 },
    { type: 'player_move', time: 1.9, id: 'R4', to: [-3.0, 0, 1.2], duration: 0.4 },
    { type: 'player_move', time: 2.3, id: 'R4', to: [-3.0, 1.8, 0.6], duration: 0.2 },
    { type: 'player_pose', time: 2.4, id: 'R4', pose: 'ARM_SPIKE', duration: 0.2 },
    { type: 'player_pose', time: 2.5, id: 'R4', pose: 'SPIKE', duration: 0.1 },
    { type: 'ball_move', time: 2.5, from: [-3.0, 3.4, 0.6], to: [2, 0, -5], duration: 0.5, arc: false },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Disposition losange', description: '4 zones, 4 joueurs : passeur P2 caché au filet, central P3 et R4 P4 sur les 3 m, arrière unique au fond.' },
    { id: 's2', startTime: 0.2, title: '2. Lecture & annonce', description: "L'arrière lit la trajectoire de service en cloche et annonce sa prise." },
    { id: 's3', startTime: 0.9, title: '3. Réception manchette', description: "Réception dirigée vers le passeur en P2 (avant droit). Trajectoire haute pour compenser l'absence de libéro." },
    { id: 's4', startTime: 1.8, title: '4. Passe en touche', description: 'Le passeur, déjà au filet, distribue vers le R4 en zone 4. Pas de pénétration nécessaire (variante "passeur avant fixe").' },
    { id: 's5', startTime: 1.9, title: "5. Course d'élan", description: "Le R4 quitte sa zone de réception, prend une course rapide de 3 m vers l'aile gauche." },
    { id: 's6', startTime: 2.4, title: '6. Attaque', description: 'Armé court, fouetté en diagonale dans le terrain adverse. Avec un seul arrière, la couverture est limitée.' },
  ],
  summary: {
    keyPoints: [
      'Format losange = formation 4v4 la plus utilisée. Une zone = un joueur.',
      'Variante "passeur avant fixe" : système le plus simple, idéal débutants.',
      'Pas de libéro autorisé en 4v4 UNSS — tous doivent savoir réceptionner.',
      'Chaque joueur défend ~30-40 m² (vs ~20 m² en 6v6).',
    ],
    commonMistakes: [
      'Confusion sur les ballons centraux entre 2 zones → annonce obligatoire.',
      'Arrière unique trop reculé → balles courtes après le filet non couvertes.',
      'Passeur qui réceptionne aussi → impossible de faire la 2ᵉ touche derrière.',
    ],
  },
};

// Scenario R10 — 4v4 reception in U formation (3 receivers + setter at net)
const RECEPTION_4V4_U: Scenario = {
  id: '4v4-reception-u',
  title: '4v4 · Réception en U',
  shortDescription: 'Formation en U : passeur sorti + 3 réceptionneurs (gauche, fond, droite).',
  config: {
    teamSize: 4,
    phase: 'reception',
    contextLabel: '4v4 · U · 4v4 compétitif',
  },
  defaultCamera: 'BEHIND_SERVE',
  players: [
    { id: 'P', label: 'Passeur (caché)', role: 'setter', color: COLORS.setter, position: [3, 0, 0.6] },
    { id: 'R4', label: 'Aile G', role: 'outside', color: COLORS.outside, position: [-3, 0, 4] },
    { id: 'A', label: 'Fond centre', role: 'libero', color: COLORS.libero, position: [0, 0, 6.5] },
    { id: 'A2', label: 'Aile D', role: 'outside', color: COLORS.outside, position: [3, 0, 4] },
  ],
  initialBallPosition: [0, 2.5, -7],
  timeline: [
    { type: 'ball_move', time: 0, from: [0, 2.5, -7], to: [-1.0, 1.2, 4.5], duration: 0.9, arc: 3.0 },
    { type: 'player_pose', time: 0.2, id: 'R4', pose: 'READY', duration: 0.1, text: "J'ai !" },
    { type: 'player_move', time: 0.3, id: 'R4', to: [-1.0, 0, 4.5], duration: 0.4 },
    { type: 'player_pose', time: 0.9, id: 'R4', pose: 'BUMP', duration: 0.2 },
    { type: 'ball_move', time: 0.9, from: [-1.0, 1.2, 4.5], to: [2.5, 1.9, 0.8], duration: 0.9, arc: 3.5 },
    { type: 'player_pose', time: 1.8, id: 'P', pose: 'SET', duration: 0.2 },
    { type: 'ball_move', time: 1.8, from: [2.5, 1.9, 0.8], to: [-3.0, 3.4, 0.6], duration: 0.7, arc: 4.0 },
    { type: 'player_move', time: 1.9, id: 'R4', to: [-3.0, 0, 1.2], duration: 0.4 },
    { type: 'player_pose', time: 2.4, id: 'R4', pose: 'ARM_SPIKE', duration: 0.2 },
  ],
  steps: [
    { id: 's1', startTime: 0, title: '1. Configuration en U', description: 'Le passeur est caché en P2. 3 réceptionneurs en U : aile gauche, fond centre, aile droite.' },
    { id: 's2', startTime: 0.2, title: "2. Annonce de l'aile gauche", description: "L'aile gauche prend la balle dans son couloir. Chaque joueur couvre ~1/3 de la largeur." },
    { id: 's3', startTime: 0.9, title: '3. Manchette précise', description: 'Cible : zone 2 (passeur déjà au filet). Trajectoire haute.' },
    { id: 's4', startTime: 1.8, title: '4. Distribution', description: "Le passeur n'a pas à pénétrer. Distribution rapide vers l'aile gauche." },
    { id: 's5', startTime: 2.4, title: '5. Attaque immédiate', description: "L'aile gauche enchaîne réception + course d'élan + frappe." },
  ],
  summary: {
    keyPoints: [
      'Réception en U = configuration 4v4 compétitive la plus efficace.',
      "3 réceptionneurs spécialisés + passeur sorti = 1 joueur disponible pour l'attaque sans avoir réceptionné.",
      'Cible zone 2 (passeur fixe) → distribution rapide.',
      'Plus exigeant techniquement que le losange mais plus offensif.',
    ],
    commonMistakes: [
      'Aile qui ne couvre pas le couloir entier → balle entre aile et fond perdue.',
      'Fond centre trop avancé → balles longues passent au-dessus.',
      'Passeur qui penche vers la réception → confusion.',
    ],
  },
};

export const RECEPTION_SCENARIOS: Scenario[] = [
  RECEPTION_5_1_3R,
  RECEPTION_W,
  RECEPTION_SEMI_CIRCLE,
  RECEPTION_2,
  RECEPTION_4_2,
  RECEPTION_P4,
  RECEPTION_5V5_4,
  RECEPTION_5V5_PENTAGON,
  RECEPTION_4V4_LOSANGE,
  RECEPTION_4V4_U,
];
