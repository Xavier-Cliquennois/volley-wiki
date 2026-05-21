import type { Drill } from './types';

// Catalogue of 30 drills covering 7 skills (reception, set, attack, defense,
// serve, block, team-play). FR content embedded — i18n extraction is a future
// iteration (see wiki-roadmap.md).
//
// Each drill follows the roadmap format: goal / setup / level variants /
// success criteria, plus optional coaching cues and sources.
export const DRILLS: Drill[] = [
  // ─────────────────────────── RÉCEPTION (×4) ───────────────────────────
  {
    id: 'wall-pass-ladder',
    skill: 'reception',
    title: 'Échelle au mur',
    goal: "Construire une plateforme silencieuse et la sensation du contact propre, sans dépendre d'un partenaire.",
    setup: {
      duration: '5-10 min',
      minPlayers: 1,
      equipment: ['1 ballon', '1 mur', 'ruban adhésif (optionnel)'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: "À 2 m du mur, passer 10 fois d'affilée à hauteur de filet (~2,20 m). Compter à voix haute." },
      { level: 'intermediate', description: 'Tracer au mur une cible 30×30 cm. Toucher 5 fois consécutives la cible sans pas latéral.' },
      { level: 'advanced', description: '2 cibles (haute / basse) — alterner haute, basse, haute, basse sur 10 passes consécutives.' },
    ],
    successCriteria: [
      "10 passes propres sans casser le rythme",
      "Pieds qui restent au sol entre les passes",
      "Contact toujours sur les bras tendus, pas d'effet de pompe",
    ],
    coachingCues: ['Plateforme silencieuse', 'Les épaules font le travail, pas les bras'],
    sources: ['JVA — Passing Progression'],
  },
  {
    id: 'triangle-drift-control',
    skill: 'reception',
    title: 'Triangle — dérive contrôlée',
    goal: 'Contrôler la trajectoire latérale du ballon vers la cible passeur malgré une dérive volontaire imposée par le tosser.',
    setup: {
      duration: '8-12 min',
      minPlayers: 4,
      equipment: ['2 ballons', '4 plots (zones cibles)'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Tosser lance haute sur le passeur, qui pose le ballon dans la zone 3 (cible plot). 8 passes par passeur.' },
      { level: 'intermediate', description: 'Tosser introduit une dérive 1 m gauche ou droite. Le passeur doit toujours servir la cible.' },
      { level: 'advanced', description: 'Tosser ajoute balles courtes / longues + dérive latérale. Conserver l\'angle vers la cible.' },
    ],
    successCriteria: [
      '6/8 passes dans la cible (zone 3-4 au filet)',
      'Plateforme orientée vers la cible AVANT le contact',
      "Finition d'épaule visible, pas de bras qui pompe",
    ],
    coachingCues: ["Angle d'épaule en premier, ballon en second"],
  },
  {
    id: 'server-vs-passer-ladder',
    skill: 'reception',
    title: 'Ladder 1v1 serveur / passeur',
    goal: "Tester la passe sous pression réelle d'un service, avec un système de score qui récompense la précision.",
    setup: {
      duration: '10-15 min',
      minPlayers: 2,
      equipment: ['4-8 ballons', '1 filet', '1 cible (cerceau ou plot)'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: '8 services. Comptage : parfait (+3), correct (+1), mauvais (-1). Pas de bonus serveur.' },
      { level: 'intermediate', description: 'Ace serveur = -2 pour le passeur. Le passeur monte d\'un terrain si total > 12.' },
      { level: 'advanced', description: 'Serveur cible une zone annoncée (1-6). Score doublé si la passe arrive à 3 m du filet.' },
    ],
    successCriteria: [
      'Passeur > 12 points sur 8 services en mode intermédiaire',
      'Pas de double pas après le contact',
      'Visage vers la cible à la finition',
    ],
    sources: ['Coaching Volleyball — Passing Ladder'],
  },
  {
    id: 'read-reach-receiver',
    skill: 'reception',
    title: 'Lire et atteindre',
    goal: "Lire les indices du serveur dès la phase de lancer et arriver freezé sous le ballon avant l'impact.",
    setup: {
      duration: '10 min',
      minPlayers: 3,
      equipment: ['6 ballons', '6 plots (zones cibles 1-6)'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'intermediate', description: 'Le serveur annonce sa zone (1-6) AVANT son service. Le passeur s\'avance dès l\'annonce.' },
      { level: 'advanced', description: 'Pas d\'annonce. Le passeur lit les indices (épaule, hauteur lancer) et démarre dès la phase de lancer.' },
      { level: 'advanced', description: 'Ajouter une seconde balle envoyée 1,5 s après la première — enchaîner réception puis couverture.' },
    ],
    successCriteria: [
      'Pieds posés (freeze) avant l\'impact sur 6/8 services',
      'Passe à 3 m du filet',
      'Lecture annoncée à voix haute ("Court !", "Long !")',
    ],
    coachingCues: ['Premier pas dès le lancer', 'Freeze avant l\'impact'],
    sources: ['Mark Lebedew — Reading the Serve'],
  },

  // ─────────────────────────── SET / PASSEUR (×4) ───────────────────────────
  {
    id: 'wall-set-target',
    skill: 'set',
    title: 'Sets au mur sur cible',
    goal: 'Construire le triangle de mains et reproduire le même point de contact sur une cible fixe.',
    setup: {
      duration: '5-10 min',
      minPlayers: 1,
      equipment: ['1 ballon', '1 mur', 'ruban adhésif'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Cible 30×30 cm marquée au mur à hauteur d\'antenne. 10 sets consécutifs, ≥ 7 dans la cible.' },
      { level: 'intermediate', description: 'Alterner sets hauts (3e tempo) et sets bas (2e tempo) sur 2 cibles distinctes.' },
      { level: 'advanced', description: 'Au signal, set arrière (reculer le bassin, finition au-dessus de la tête). Cible derrière à 1 m.' },
    ],
    successCriteria: [
      '7/10 sets dans la cible',
      'Triangle des mains visible AVANT le contact',
      'Pieds toujours sous le bassin (pas d\'extension arrière non contrôlée)',
    ],
    coachingCues: ['Triangle haut', 'Coudes ouverts vers la cible'],
  },
  {
    id: 'move-stop-set',
    skill: 'set',
    title: 'Move – stop – set',
    goal: "Apprendre à s'arrêter et squarer les épaules vers la cible AVANT le contact.",
    setup: {
      duration: '10-12 min',
      minPlayers: 3,
      equipment: ['2 ballons', '3 plots', '1 cible attaquante (cerceau)'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Passeur démarre depuis un plot, court 2 m vers une balle tossée, s\'arrête et set vers la cible.' },
      { level: 'intermediate', description: 'Tosser varie la zone d\'arrivée (gauche / droite / court / long). Le passeur ajuste ses pas.' },
      { level: 'advanced', description: 'Ajouter contrainte : 2 touches max au sol entre la fin de la course et le contact (équilibre dynamique).' },
    ],
    successCriteria: [
      '6/8 sets posés dans la zone outside (4)',
      'Nez derrière le ballon au contact',
      'Arrêt complet AVANT le contact',
    ],
    coachingCues: ['Move – stop – set (verbalisé à voix haute)', 'Nez derrière le ballon'],
    sources: ['The Art of Coaching Volleyball'],
  },
  {
    id: 'setter-on-the-run',
    skill: 'set',
    title: 'Set en mouvement latéral',
    goal: 'Maintenir la précision du set quand la passe oblige à un déplacement latéral significatif (> 2 m).',
    setup: {
      duration: '10 min',
      minPlayers: 3,
      equipment: ['3 ballons'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'intermediate', description: 'Tosser envoie 5 balles à 2 m de la position du passeur. Set en zone 4 à chaque fois.' },
      { level: 'intermediate', description: 'Ajouter set arrière en zone 2 (alternance avant / arrière).' },
      { level: 'advanced', description: 'Cible attaquant qui se déplace — communication verbale "Hut !" ou "Go !" avant le set.' },
    ],
    successCriteria: [
      '4/5 sets dans une zone de 1,5 m de diamètre',
      'Pieds tournés vers la cible AVANT les mains',
      'Pas de tour de buste en l\'air',
    ],
    coachingCues: ['Pieds tournent en premier'],
  },
  {
    id: 'decoy-and-back-set',
    skill: 'set',
    title: 'Décoy + set arrière',
    goal: 'Décider entre avant et arrière selon un signal tardif, pour masquer la distribution au bloc adverse.',
    setup: {
      duration: '12-15 min',
      minPlayers: 5,
      equipment: ['4 ballons', '1 mannequin bloc (ou coach côté adverse)'],
      teamSizes: [5, 6],
    },
    variants: [
      { level: 'advanced', description: 'Coach donne le signal "AV" ou "AR" 0,5 s avant le contact. Passeur exécute.' },
      { level: 'advanced', description: 'Signal supprimé — passeur lit la position du bloc fantôme et distribue à l\'opposé.' },
      { level: 'advanced', description: 'Ajouter l\'option Pipe (set arrière long) — 3 options de distribution simultanées.' },
    ],
    successCriteria: [
      '4/5 décisions correctes (set vers la zone non-bloquée)',
      'Même geste préparatoire pour avant et arrière',
      'Vitesse de set constante entre les variantes',
    ],
    coachingCues: ['Mêmes pieds avant et arrière', 'Lecture du blocker, pas du ballon'],
  },

  // ─────────────────────────── ATTAQUE (×5) ───────────────────────────
  {
    id: 'approach-shadow',
    skill: 'attack',
    title: "Course d'approche fantôme",
    goal: "Internaliser le rythme slow→fast de la course d'approche, sans ballon ni saut.",
    setup: {
      duration: '5-8 min',
      minPlayers: 1,
      equipment: ['Aucun (idéalement 1 filet pour la référence)'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: '3 pas (G-D-G pour droitier), 10 répétitions. Coach compte "un... deux-trois !" pour marquer le slow→fast.' },
      { level: 'intermediate', description: '4 pas (D-G-D-G), bras armé au power step, saut vertical + claquement de main au 4e pas.' },
      { level: 'advanced', description: 'Approche 4 pas + sortie de bloc (depuis position bloqueur central, repli 2 pas, approche zone 4).' },
    ],
    successCriteria: [
      'Les 2 derniers pas sont visuellement plus rapides',
      'Bras armé au power step (pas après)',
      'Saut vertical, pas vers le filet',
    ],
    coachingCues: ['Slow → FAST', 'Power step long et bas'],
    sources: ['Sask Volleyball — Atomic Progression'],
  },
  {
    id: 'box-arm-swing',
    skill: 'attack',
    title: 'Smash sur caisse',
    goal: 'Isoler le snap du poignet et la finition de bras, sans le bruit de course ni de saut.',
    setup: {
      duration: '10-12 min',
      minPlayers: 2,
      equipment: ['1 caisse plyo ou banc', '5 ballons', '1 filet'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Attaquant sur caisse, tosser envoie une balle à 50 cm du filet. Smash main pleine, 10 répétitions.' },
      { level: 'intermediate', description: 'Alterner main pleine / cut shot (angle court) / line shot (ligne) sur signal du tosser.' },
      { level: 'advanced', description: 'Réduire la hauteur de set (set tendu) pour comprimer le temps disponible — entraîner la vitesse de bras.' },
    ],
    successCriteria: [
      '7/10 balles dans le terrain adverse côté annoncé',
      "Coude au-dessus de l'épaule à l'armé",
      'Snap visible (topspin sur la balle)',
    ],
    coachingCues: ["Coude haut, main derrière l'oreille", 'Griffer la balle par-dessus'],
  },
  {
    id: 'approach-toss-hit',
    skill: 'attack',
    title: 'Approche + lancer + attaque',
    goal: "Synchroniser la course d'approche avec une passe simple lancée par un coach ou passeur stable.",
    setup: {
      duration: '12-15 min',
      minPlayers: 3,
      equipment: ['8-10 ballons', '1 filet'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'intermediate', description: 'Tosser à la passe, lance haute en zone 4. Approche complète. 8 balles : 4 cross / 4 line.' },
      { level: 'intermediate', description: 'Ajouter une cible (plot ou cerceau) dans la zone visée — bonus si la balle touche.' },
      { level: 'advanced', description: 'Réduire la hauteur de set (2e tempo / Go) — l\'attaquant doit anticiper plus tôt sa course.' },
    ],
    successCriteria: [
      '6/8 balles dans la zone annoncée',
      'Appel à 30-50 cm du filet',
      'Pas de pieds sous le filet à la réception',
    ],
    coachingCues: ['Sauter vertical, pas vers le filet'],
  },
  {
    id: 'tempo-quick-hut-go',
    skill: 'attack',
    title: 'Tempos Quick / Hut / Go',
    goal: "Distinguer les 3 tempos et démarrer la course au bon moment selon le signal du passeur.",
    setup: {
      duration: '15 min',
      minPlayers: 5,
      equipment: ['8 ballons', '1 filet'],
      teamSizes: [5, 6],
    },
    variants: [
      { level: 'intermediate', description: '3 attaquants (OH4, MB3, OH2). Passeur annonce "Quick" ou "Hut". Les non-appelés font un faux appel.' },
      { level: 'advanced', description: 'Passeur n\'annonce plus — les attaquants démarrent selon la qualité de réception (parfaite = quick possible).' },
      { level: 'advanced', description: 'Ajouter Pipe (back-row OH zone 6) — 4 options simultanées, plus de stress pour le passeur.' },
    ],
    successCriteria: [
      'Timing correct : MB en l\'air AU contact passeur, OH dès que la balle quitte la passe',
      'Pas de collision entre attaquants',
      'Tous courent à fond même sans ballon (ghost middle)',
    ],
    coachingCues: ['Ghost middle à fond, toujours'],
  },
  {
    id: 'read-the-block',
    skill: 'attack',
    title: 'Lire le bloc',
    goal: 'Choisir son tir en fonction de la position et du timing du bloc adverse.',
    setup: {
      duration: '15 min',
      minPlayers: 6,
      equipment: ['6 ballons', '1 filet'],
      teamSizes: [5, 6],
    },
    variants: [
      { level: 'advanced', description: '2 blockers se positionnent ligne ou diagonale (signal coach). L\'attaquant frappe la zone libre.' },
      { level: 'advanced', description: 'Ajouter la feinte (tip) comme 3e option — quand le bloc est trop bien placé.' },
      { level: 'advanced', description: 'Live scrim — l\'attaquant marque uniquement si la balle tombe HORS bloc ET HORS défense.' },
    ],
    successCriteria: [
      '4/6 attaques marquantes',
      'Lecture verbalisée à voix haute ("ligne libre !", "tip !")',
      'Aucune attaque dans le bloc',
    ],
    coachingCues: ['Yeux sur le bloc à l\'armé, pas avant'],
  },

  // ─────────────────────────── DÉFENSE (×5) ───────────────────────────
  {
    id: 'pancake-floor-touch',
    skill: 'defense',
    title: 'Pancake au sol',
    goal: 'Acquérir le réflexe de plonger la main à plat sous le ballon pour les balles courtes basses.',
    setup: {
      duration: '5-8 min',
      minPlayers: 2,
      equipment: ['5 ballons'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Partenaire lâche un ballon à 1 m devant le défenseur. Pancake (main plate au sol, ballon rebondit). 10 répétitions.' },
      { level: 'intermediate', description: 'Partenaire envoie une balle molle courte à 1,5 m. Pancake en mouvement.' },
      { level: 'advanced', description: 'Départ position défensive zone 6, course pancake sur balle envoyée à 2 m + roulade défensive immédiate.' },
    ],
    successCriteria: [
      '8/10 pancakes propres (ballon part vers le haut, pas latéralement)',
      'Pas de bras qui se casse au contact',
      'Relevé immédiat (pas resté au sol)',
    ],
    coachingCues: ['Main plate, dos de main au sol'],
  },
  {
    id: 'three-ball-dig',
    skill: 'defense',
    title: 'Séquence 3 balles',
    goal: 'Enchaîner 3 défenses de natures différentes (courte / mi-distance / longue) sans temps mort.',
    setup: {
      duration: '8-12 min',
      minPlayers: 3,
      equipment: ['5 ballons', '1 cible passeur'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Coach envoie séquence courte / mid / long. Le défenseur défend chaque ballon vers la cible. Pause courte entre.' },
      { level: 'intermediate', description: 'Pas de pause — coach lance dès que le défenseur a touché la précédente.' },
      { level: 'advanced', description: 'Ordre randomisé + ajouter un 4e ballon "feinte" qui tombe juste derrière le défenseur.' },
    ],
    successCriteria: [
      '3/3 balles défendues vers la cible',
      'Déplacement bas — pas debout statique entre les balles',
      'Communication verbale à chaque contact',
    ],
    coachingCues: ['Yeux vers la balle, pas vers la cible avant contact'],
  },
  {
    id: 'rapid-fire-dig',
    skill: 'defense',
    title: 'Tirs rapides en continu',
    goal: "Travailler le temps de réaction sur des attaques continues sans temps de récupération.",
    setup: {
      duration: '6-10 min (séries courtes)',
      minPlayers: 3,
      equipment: ['15 ballons', '1 caisse', '1 filet'],
      teamSizes: [5, 6],
    },
    variants: [
      { level: 'intermediate', description: 'Coach sur caisse attaque down ball en continu (1 balle / 2 s). 10 balles consécutives.' },
      { level: 'advanced', description: 'Vitesse augmentée (1 balle / 1,5 s) + variation de zones (cross / line).' },
      { level: 'advanced', description: '20 balles consécutives + scoring "decision" (1 pt par balle correctement défendue, peu importe le résultat).' },
    ],
    successCriteria: [
      '7/10 balles défendues',
      'Pas de pose debout entre les balles',
      'Relance vers cible (pas n\'importe où)',
    ],
    coachingCues: ['Bas, bas, bas — jambes en feu'],
    sources: ['The Art of Coaching Volleyball — Rapid Fire'],
  },
  {
    id: 'pursuit-and-save',
    skill: 'defense',
    title: 'Poursuite et sauvetage',
    goal: "Travailler la mentalité \"jamais lâcher\" et la course vers les balles hors de la zone défensive.",
    setup: {
      duration: '8-12 min',
      minPlayers: 4,
      equipment: ['6 ballons', '1 cible'],
      teamSizes: [5, 6],
    },
    variants: [
      { level: 'intermediate', description: 'Coach envoie une balle volontairement "hors zone" — 3 m de la position du défenseur. Il court et sauve (tout contact compte).' },
      { level: 'advanced', description: 'Ajouter un relais — 2e joueur récupère le sauvetage et fait une vraie passe. Bonus si 3e touche attaquable.' },
      { level: 'advanced', description: 'À 2 défenseurs — un sauve, l\'autre couvre la "free ball" qui en résulte.' },
    ],
    successCriteria: [
      '3/5 sauvetages aboutissent à une 3e touche jouable',
      'Communication verbale ("Toi !", "Mine !")',
      'Aucun joueur statique pendant la séquence',
    ],
    coachingCues: ['Touche le ballon, n\'importe comment'],
    sources: ['The Art of Coaching Volleyball — Two-Ball Pursuit'],
  },
  {
    id: 'read-hitter-adjust',
    skill: 'defense',
    title: 'Lire l\'attaquant et ajuster',
    goal: "Ajuster sa position défensive AVANT l'impact du smash, en lisant l'approche et le bras de l'attaquant.",
    setup: {
      duration: '12-15 min',
      minPlayers: 6,
      equipment: ['8 ballons', '1 filet'],
      teamSizes: [5, 6],
    },
    variants: [
      { level: 'advanced', description: 'Défenseur démarre en zone 6 neutre. Selon l\'approche (cross / line), il avance ou recule de 1 m AVANT le contact.' },
      { level: 'advanced', description: 'Contrainte : interdiction de bouger APRÈS le contact — pure lecture.' },
      { level: 'advanced', description: 'Scoring : 2 pts si défense vers cible + position correcte, 1 pt si défense désordonnée, 0 si raté.' },
    ],
    successCriteria: [
      '4/6 défenses avec position correcte (dans l\'ombre du bloc)',
      'Pieds posés à l\'impact (pas en mouvement)',
      'Lecture commentée à voix haute',
    ],
    coachingCues: ['Lecture commence à l\'armé, pas au contact'],
  },

  // ─────────────────────────── SERVICE (×4) ───────────────────────────
  {
    id: 'toss-and-drop',
    skill: 'serve',
    title: 'Lancer et déposer',
    goal: 'Régulariser le lancer du service — c\'est 80% de la précision finale.',
    setup: {
      duration: '5 min',
      minPlayers: 1,
      equipment: ['1 ballon', 'ruban adhésif au sol'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Marquer une croix au sol devant l\'épaule frappante. Lancer le ballon en l\'air et le LAISSER tomber sur la croix, 10 fois.' },
      { level: 'intermediate', description: 'Même drill, viser une hauteur constante (toit imaginaire à 2,5 m pour float, 3,5 m pour jump float).' },
      { level: 'advanced', description: 'Lancer en regardant la cible serveur (pas le ballon) — entraîne le timing aveugle.' },
    ],
    successCriteria: [
      '8/10 lancers tombent sur la croix',
      'Hauteur identique sur tous les lancers',
      'Le ballon ne tourne pas (lancer "mort")',
    ],
    coachingCues: ['La main lance, le corps reste immobile'],
    sources: ['The Art of Coaching Volleyball — Toss and Drop'],
  },
  {
    id: 'six-zones-target',
    skill: 'serve',
    title: '6 zones cible',
    goal: 'Couvrir les 6 zones du terrain adverse avec une exécution comparable, pour pouvoir choisir tactiquement.',
    setup: {
      duration: '10-15 min',
      minPlayers: 1,
      equipment: ['6 plots ou cerceaux', '10+ ballons', '1 filet'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Une cible à la fois (zone 1 puis 5 puis 6...). 3 services / zone. Score = nb de zones ≥ 2/3.' },
      { level: 'intermediate', description: 'Cibles aléatoires annoncées par coach AVANT le toss. 12 services, score = zones touchées.' },
      { level: 'advanced', description: 'Ajouter contrainte "ZD" (zone défense entre 2 joueurs, ou contre libéro réel). Score = aces + erreurs réception adverse.' },
    ],
    successCriteria: [
      '4/6 zones avec ≥ 2/3 réussite',
      'Même routine pré-service à chaque tentative',
      'Aucun service dans le filet',
    ],
    sources: ['Volleyball XL — Six Zones'],
  },
  {
    id: 'pressure-serve-game',
    skill: 'serve',
    title: 'Service sous pression',
    goal: 'Servir sous contrainte de score — simuler la fin de set.',
    setup: {
      duration: '10-12 min',
      minPlayers: 2,
      equipment: ['10+ ballons', '1 filet'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'intermediate', description: '5 services consécutifs. Réussi + au-delà de 3 m = +1. Manqué (filet / out) = -1. Score min : +3.' },
      { level: 'intermediate', description: 'Ajouter un service final "match point" — si manqué, retour à 0 et recommencer.' },
      { level: 'advanced', description: 'Jouer à 3 serveurs en compétition. Premier à 10 points gagne.' },
    ],
    successCriteria: [
      'Score ≥ +3 sur 5 services',
      'Même routine pré-service, point critique ou non',
      'Pas de précipitation après un échec',
    ],
    coachingCues: ['Routine identique, point critique ou pas'],
  },
  {
    id: 'tactical-zone-serve',
    skill: 'serve',
    title: 'Zone tactique selon adversaire',
    goal: "Choisir la zone de service en fonction de la faiblesse identifiée chez l'adversaire.",
    setup: {
      duration: '12-15 min',
      minPlayers: 6,
      equipment: ['8 ballons', '1 filet', 'équipe adverse en réception'],
      teamSizes: [5, 6],
    },
    variants: [
      { level: 'advanced', description: 'Avant chaque service, le serveur annonce "ace sur 1" (zone) et l\'identifiant du passeur faible. Exécute.' },
      { level: 'advanced', description: 'Scoring : +3 ace, +1 réception cassée, 0 parfait, -1 erreur.' },
      { level: 'advanced', description: 'Scouting préalable — l\'adversaire joue une manche complète, l\'équipe au service identifie les zones faibles, puis exploite.' },
    ],
    successCriteria: [
      '≥ 2 aces sur 8 services',
      'Choix de zone justifié à voix haute',
      'Pas de service "automatique" (toujours zone 1)',
    ],
  },

  // ─────────────────────────── CONTRE (×4) ───────────────────────────
  {
    id: 'shadow-block-mirror',
    skill: 'block',
    title: 'Bloc miroir',
    goal: 'Synchroniser le déplacement latéral et le saut sans ballon, en miroir d\'un partenaire.',
    setup: {
      duration: '5-8 min',
      minPlayers: 2,
      equipment: ['1 filet'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: '2 joueurs face à face (filet entre eux). L\'un se déplace gauche / droite, l\'autre suit en miroir. Saut au signal "haut !".' },
      { level: 'intermediate', description: 'Ajouter saut + press over net (mains pénètrent côté adverse). 10 répétitions latérales.' },
      { level: 'advanced', description: '3 blockers en ligne (zones 2-3-4). Coach annonce une zone d\'attaque, les 3 se déplacent et forment un bloc à 2 dans la zone annoncée.' },
    ],
    successCriteria: [
      'Pas latéraux fluides (pas de croisement non contrôlé)',
      'Mains au-dessus du filet à l\'apex',
      'Arrivée stable (pas de déséquilibre à l\'atterrissage)',
    ],
    coachingCues: ['Mains hautes en permanence'],
  },
  {
    id: 'footwork-net-touch',
    skill: 'block',
    title: 'Pas latéraux + press net',
    goal: 'Choisir le bon pas (shuffle vs crossover) selon la distance, et finir mains hautes au filet.',
    setup: {
      duration: '8-10 min',
      minPlayers: 2,
      equipment: ['1 filet', '4 plots'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Shuffle 1 m (zone 3 → zone 4), saut, mains hautes. 8 répétitions.' },
      { level: 'intermediate', description: 'Crossover 3 m (zone 4 → zone 2), saut, mains hautes — étudier le timing du dernier pas (pied extérieur).' },
      { level: 'advanced', description: 'Alternance shuffle / crossover selon signal coach (court → shuffle / long → crossover) en < 0,5 s.' },
    ],
    successCriteria: [
      'Dernier pas perpendiculaire au filet (pas de pied de travers)',
      'Mains 30 cm au-dessus de la bande à l\'apex',
      'Pas de saut en arrière',
    ],
    coachingCues: ['Shuffle court, crossover long'],
  },
  {
    id: 'read-setter-block',
    skill: 'block',
    title: 'Lire le passeur (commit vs read)',
    goal: "Décider entre commit (saut anticipé sur 1er tempo) et read (saut sur l'attaquant choisi).",
    setup: {
      duration: '12-15 min',
      minPlayers: 6,
      equipment: ['8 ballons', '1 filet'],
      teamSizes: [6],
    },
    variants: [
      { level: 'intermediate', description: 'Passeur signal sa distribution AVANT le toss (avant / arrière). Central commit, ailes read.' },
      { level: 'advanced', description: 'Pas de signal — central doit lire l\'angle d\'épaule du passeur et décider en < 0,3 s.' },
      { level: 'advanced', description: 'Ajouter Pipe (back-row OH) — 4 options. Le central devient pur "read blocker".' },
    ],
    successCriteria: [
      '4/6 décisions correctes (bloc sur l\'attaquant réel)',
      'Central jamais "perdu" entre 2 attaquants',
      'Communication verbale "AVANT !" ou "ARRIÈRE !"',
    ],
    coachingCues: ['Lecture du passeur, pas du ballon'],
  },
  {
    id: 'seal-the-seam-duo',
    skill: 'block',
    title: 'Fermer le joint à 2',
    goal: '2 bloqueurs (central + aile) ferment soit la ligne soit la diagonale, sans laisser de joint au milieu.',
    setup: {
      duration: '12-15 min',
      minPlayers: 5,
      equipment: ['6 ballons', '1 filet'],
      teamSizes: [5, 6],
    },
    variants: [
      { level: 'advanced', description: 'Bloc "ligne" — central ferme la ligne, aile prend la diagonale. 6 répétitions.' },
      { level: 'advanced', description: 'Bloc "diagonale" — central côté diagonale, aile ferme la ligne. 6 répétitions.' },
      { level: 'advanced', description: 'Décision live — coach annonce "LIGNE" ou "DIAG" 0,5 s avant le set. Les 2 ajustent.' },
    ],
    successCriteria: [
      '5/6 blocs avec mains scellées (pas de joint visible entre les 2 blockers)',
      'Arrivée simultanée des 2 blockers',
      'Pas de translation latérale après le saut',
    ],
    coachingCues: ['Épaule contre épaule à l\'apex'],
  },

  // ─────────────────────────── JEU COLLECTIF (×4) ───────────────────────────
  {
    id: 'pepper-progressive',
    skill: 'team-play',
    title: 'Pepper progressif',
    goal: 'Travailler les 3 contacts en boucle avec un partenaire, en montant en intensité.',
    setup: {
      duration: '5-10 min',
      minPlayers: 2,
      equipment: ['1 ballon / paire'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'beginner', description: 'Pepper classique sans saut. Dig → set → "smash" main souple. Objectif : 10 cycles consécutifs.' },
      { level: 'intermediate', description: '"Down ball pepper" — l\'attaquant frappe en mode downball (debout). Dig → set → downball.' },
      { level: 'advanced', description: 'Pepper avec saut + cibles — l\'attaquant doit toucher une zone annoncée par le passeur (gauche / droite).' },
    ],
    successCriteria: [
      '10 cycles consécutifs sans casser',
      'Communication ("Mine !", "Yours !")',
      'Chaque contact sert le suivant (pas de balle "perso")',
    ],
    coachingCues: ['Sers ton partenaire, pas toi-même'],
  },
  {
    id: 'side-out-wash-3',
    skill: 'team-play',
    title: 'Wash 3 side-outs',
    goal: 'Gagner un point uniquement après avoir réussi 3 side-outs consécutifs — focus sur l\'exécution sans erreur.',
    setup: {
      duration: '15-20 min',
      minPlayers: 8,
      equipment: ['10+ ballons', '1 filet'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'intermediate', description: '3 services consécutifs. 3 side-outs réussis = +1 point. Raté à n\'importe quel moment = recommencer.' },
      { level: 'intermediate', description: 'Après chaque side-out, l\'équipe défensive joue le rally complet (transition). Comptent uniquement les side-outs.' },
      { level: 'advanced', description: 'Scoring inversé — l\'équipe au service marque si elle empêche le 3e side-out. Premier à 5 gagne.' },
    ],
    successCriteria: [
      'Au moins 1 série de 3 side-outs réussie par équipe sur 10 services',
      'Couverture systématique après attaque',
      'Communication continue (R-S-A annoncés)',
    ],
  },
  {
    id: 'triangle-transition',
    skill: 'team-play',
    title: 'Triangle transition',
    goal: 'Enchaîner réception → set → attaque + couverture sans temps mort.',
    setup: {
      duration: '15 min',
      minPlayers: 6,
      equipment: ['8 ballons', '1 filet'],
      teamSizes: [5, 6],
    },
    variants: [
      { level: 'intermediate', description: 'Coach attaque downball, équipe défend (3 contacts). Après l\'attaque, couverture en triangle (passeur + 2 arrières).' },
      { level: 'advanced', description: 'Coach varie cross / line / tip — l\'équipe identifie qui défend et qui couvre.' },
      { level: 'advanced', description: 'Enchaîner 2 transitions consécutives — défense → attaque + couverture → nouvelle défense → nouvelle attaque.' },
    ],
    successCriteria: [
      'Triangle de couverture à chaque attaque (3 joueurs à 2 m de l\'attaquant)',
      'Aucun joueur statique pendant le rally',
      'Communication continue',
    ],
    coachingCues: ['Couverture à chaque attaque, sans exception'],
  },
  {
    id: 'queen-of-the-court',
    skill: 'team-play',
    title: 'Reine du terrain',
    goal: 'Mode jeu compétitif — gagner un rally te promeut au "terrain royal", perdre te rétrograde.',
    setup: {
      duration: '20-30 min',
      minPlayers: 12,
      equipment: ['1 filet', '10+ ballons'],
      teamSizes: [4, 5, 6],
    },
    variants: [
      { level: 'advanced', description: '3 équipes. L\'équipe "reine" reçoit le service. Si elle marque, elle reste. Si elle perd, elle sort et l\'équipe suivante monte.' },
      { level: 'advanced', description: 'Contrainte tactique — la victoire doit venir d\'une attaque 3e tempo (sinon 0 point malgré le rally gagné).' },
      { level: 'advanced', description: 'Bonus : 2 points si la victoire est sur un side-out propre (R-S-A) sans transition.' },
    ],
    successCriteria: [
      'Rotation fluide entre les 3 équipes',
      'Aucune attente entre les rotations',
      'Intensité maintenue sur 20+ min',
    ],
    coachingCues: ['Chaque rally compte'],
    sources: ['Better at Beach — Queen of the Court'],
  },
];

export function drillsBySkill(skill: Drill['skill']): Drill[] {
  return DRILLS.filter(d => d.skill === skill);
}
