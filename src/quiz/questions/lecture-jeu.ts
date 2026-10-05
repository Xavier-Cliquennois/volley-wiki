import type { Question } from '../types';

// Quiz "Lecture du jeu / scouting". Pure multiple-choice questions on the
// IF/THEN cues described in the GuideLectureDuJeu — server, opposite setter,
// attacker shoulder angle, block timing.
export const QUESTIONS_LECTURE_JEU: Question[] = [
  {
    id: 'lj-q1',
    type: 'multiple-choice',
    prompt:
      'Le serveur adverse recule de 3 m derrière la ligne de fond, lance la balle haut et démarre une course d\'élan. Que prépares-tu ?',
    explanation:
      'C\'est la signature d\'un jump topspin : élan long, lancer haut, attaque type "smash". La balle arrivera tendue et lourde. Tu dois reculer ta zone de réception, abaisser ta plateforme et te préparer à absorber un service très puissant. Règle : "élan = jump → recule".',
    options: [
      { id: 'jump-topspin', label: 'Un jump topspin → recule ta zone de réception' },
      { id: 'float', label: 'Un float court → avance vers le filet' },
      { id: 'cuillere', label: 'Une cuillère lobée → reste en place' },
      { id: 'skyball', label: 'Un skyball → regarde en l\'air' },
    ],
    correctId: 'jump-topspin',
  },
  {
    id: 'lj-q2',
    type: 'multiple-choice',
    prompt:
      'Le passeur adverse reçoit une balle parfaite, épaules face au filet, et lève les yeux vers son aile droite. Que vas-tu probablement défendre ?',
    explanation:
      'Le regard du passeur est l\'indice le plus fiable de sa direction. S\'il regarde la droite (zone 2 chez lui = ton côté gauche), il distribuera son pointu en aile droite. Ton aile gauche (P4) doit former le contre, et ton défenseur P5 absorbe la diagonale longue. Indice de niveau intermédiaire+.',
    options: [
      { id: 'right-wing', label: 'Une attaque côté aile droite adverse (ton côté gauche)' },
      { id: 'middle', label: 'Un quick central' },
      { id: 'back', label: 'Une pipe arrière' },
      { id: 'no-info', label: 'Impossible à dire, le regard ne donne rien' },
    ],
    correctId: 'right-wing',
  },
  {
    id: 'lj-q3',
    type: 'multiple-choice',
    prompt:
      'Au moment du saut de l\'attaquant adverse, son épaule droite est rétro-pivotée derrière son oreille (rotation forte). Vers où va son tir ?',
    explanation:
      'Une épaule très armée = puissance maximale dans la direction du bras. Le bras gauche (côté guide) pointe vers la cible. Plus l\'épaule est rétro-pivotée, plus l\'attaquant cherche une diagonale longue ou un puissant ligne. À l\'inverse, une épaule peu armée annonce un placement court (cobra, poke). Indice avancé qui se lit dans les 2 dernières foulées.',
    options: [
      { id: 'power', label: 'Un tir puissant en diagonale ou ligne longue' },
      { id: 'tip', label: 'Un placement court (poke ou cobra)' },
      { id: 'sharp', label: 'Une diagonale courte sur la 3 m' },
      { id: 'cant-tell', label: 'On ne peut rien déduire de l\'épaule' },
    ],
    correctId: 'power',
  },
  {
    id: 'lj-q4',
    type: 'multiple-choice',
    prompt:
      'Tu es central défenseur en R1. Le passeur adverse lève des yeux son central avant qui démarre déjà sa course quick. Que fais-tu ?',
    explanation:
      'C\'est le scénario classique du commit block : tu sautes avec le central dès sa course pour bloquer le quick. Risque : si le passeur change de cible en pleine passe (slide vers l\'aile), tu seras déjà retombé. Le commit s\'utilise quand le passeur est très lisible et que tu acceptes le pari. À l\'inverse, le read blocking attend la passe pour réagir.',
    options: [
      { id: 'commit', label: 'Commit block : saute avec le central adverse' },
      { id: 'wait', label: 'Attends la trajectoire de la passe (read)' },
      { id: 'retreat', label: 'Recule en défense pour la pipe' },
      { id: 'spread', label: 'Étire-toi pour bloquer toute la largeur' },
    ],
    correctId: 'commit',
  },
  {
    id: 'lj-q5',
    type: 'multiple-choice',
    prompt:
      'En scouting pré-match, tu apprends que leur n°10 frappe à 95 % en diagonale courte. Comment ajustes-tu ta défense quand il attaque depuis l\'aile gauche ?',
    explanation:
      'Si tu sais qu\'il frappe en diagonale courte (zone proche du filet côté droit chez toi), tu rapproches le défenseur P1 (arrière droit) du filet et tu déplaces le contre pour fermer la ligne courte. C\'est l\'application directe du scouting : on ne défend pas "partout", on défend là où la donnée nous oriente. Indice : "le scouting transforme la défense statistique en défense ciblée".',
    options: [
      { id: 'shift', label: 'Rapproche le défenseur P1 du filet et ferme la diagonale courte' },
      { id: 'symmetric', label: 'Défense symétrique, ignore la stat' },
      { id: 'line', label: 'Bouche la ligne plutôt que la diagonale' },
      { id: 'middle', label: 'Tous les défenseurs reculent en arc' },
    ],
    correctId: 'shift',
  },
  {
    id: 'lj-q6',
    type: 'multiple-choice',
    prompt:
      'La règle d\'or du contre, telle qu\'enseignée par les coachs FIVB : ',
    explanation:
      'La règle d\'or : "Tu ne bloques pas le ballon — tu bloques l\'attaquant". On regarde l\'attaquant (épaule, élan, regard) et on se positionne face à lui pour fermer son angle, pas face à la balle. Le bloqueur qui suit le ballon réagit trop tard ; celui qui anticipe l\'attaquant arrive à temps. Issue du guide Lecture du jeu — section "règle d\'or".',
    options: [
      { id: 'attacker', label: 'On bloque l\'attaquant, pas le ballon' },
      { id: 'ball', label: 'On bloque le ballon, pas l\'attaquant' },
      { id: 'setter', label: 'On bloque le passeur, pas l\'attaquant' },
      { id: 'middle', label: 'On bloque le central, peu importe la passe' },
    ],
    correctId: 'attacker',
  },
];
