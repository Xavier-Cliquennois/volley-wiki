import type { Question } from '../types';

// Quiz "Choisir la bonne option offensive". Focus on 'attack' questions where
// the reception quality dictates which tempos are viable.
export const QUESTIONS_OPTIONS_ATTAQUE: Question[] = [
  {
    id: 'oa-q1',
    type: 'attack',
    prompt:
      'En R1 du 5-1, ta réception est parfaite : le passeur reçoit la balle à 1 m du filet, épaules parallèles. Quelle option a la priorité ?',
    systemId: '5-1',
    rotationId: 'R1',
    receptionQuality: 'perfect',
    options: [
      { id: 'quick', label: 'Quick centre (1er tempo) au central' },
      { id: 'pipe', label: 'Pipe en P6' },
      { id: 'high-outside', label: 'Balle haute à l\'aile gauche' },
      { id: 'bic', label: 'Bic D du pointu' },
    ],
    correctId: 'quick',
    explanation:
      'Sur une réception parfaite, le 1er tempo central est l\'option prioritaire : il fixe le bloc adverse au centre, ouvre les ailes pour les balles suivantes et offre le tempo le plus rapide. La pipe et la bic deviennent intéressantes en alternance pour casser le rythme, mais le quick reste la base.',
  },
  {
    id: 'oa-q2',
    type: 'attack',
    prompt:
      'En R3 du 5-1, la réception est dégradée — le passeur arrive en retard car la pénétration est la plus longue du système. Quelle option garde le plus de marge ?',
    systemId: '5-1',
    rotationId: 'R3',
    receptionQuality: 'poor',
    options: [
      { id: 'quick', label: 'Quick centre en 1er tempo' },
      { id: 'high-outside', label: 'Balle haute à l\'aile gauche (P4)' },
      { id: 'bic', label: 'Bic centre du pointu' },
      { id: 'pipe', label: 'Pipe arrière en P6' },
    ],
    correctId: 'high-outside',
    explanation:
      'Sur une réception dégradée, on remonte le tempo : balle haute à l\'aile gauche pour laisser à l\'attaquant le temps de prendre son élan. Le quick devient impossible (passe trop basse/loin) et les balles arrière sont trop risquées. Règle d\'or : "mauvaise réception → balle haute aux antennes".',
  },
  {
    id: 'oa-q3',
    type: 'attack',
    prompt:
      'En R4 du 5-1 (passeur au filet en P4), la réception est correcte. Le central et l\'aile droite sont au filet, le pointu en arrière. Quel est le bon choix offensif ?',
    systemId: '5-1',
    rotationId: 'R4',
    receptionQuality: 'medium',
    options: [
      { id: 'quick', label: 'Quick centre + pipe du pointu en menace' },
      { id: 'left-wing', label: 'Aile gauche (le passeur frappe)' },
      { id: 'opp-front', label: 'Aile droite au pointu (qui est arrière)' },
      { id: 'bic-left', label: 'Bic A à gauche par le central' },
    ],
    correctId: 'quick',
    explanation:
      'En R4, seulement 2 attaquants vrais au filet (central + aile droite). Pour contourner cette limitation, on combine quick central + pipe du pointu arrière. Le passeur ne frappe pas (il distribue), et le pointu en P1 est l\'arme cachée pour ouvrir le bloc adverse.',
  },
  {
    id: 'oa-q4',
    type: 'attack',
    prompt:
      'Le bloc adverse a un central très mobile qui suit la balle. La réception est parfaite. Comment exploiter cette information ?',
    systemId: '5-1',
    rotationId: 'R1',
    receptionQuality: 'perfect',
    options: [
      { id: 'quick-only', label: 'Multiplier les quicks au central' },
      { id: 'fake-quick', label: 'Quick en menace + balle à l\'aile à 2 tempos' },
      { id: 'slide', label: 'Slide derrière le passeur' },
      { id: 'bic-only', label: 'Bic systématique du pointu' },
    ],
    correctId: 'fake-quick',
    explanation:
      'Si le central adverse suit le ballon (read blocking), on l\'attire avec un appel quick fictif puis on envoie l\'aile en 2ᵉ tempo : le bloqueur central est en retard sur sa course latérale, laissant l\'aile en duel contre un seul contre. Principe : "le central adverse est ton point d\'appui".',
  },
  {
    id: 'oa-q5',
    type: 'attack',
    prompt:
      'En R6 du 5-1, le passeur est au filet en P2. La réception est moyenne mais utilisable. Quelle option exploite le mieux la rotation ?',
    systemId: '5-1',
    rotationId: 'R6',
    receptionQuality: 'medium',
    options: [
      { id: 'pipe', label: 'Pipe depuis P5 (pointu arrière gauche)' },
      { id: 'bic', label: 'Bic A du pointu' },
      { id: 'quick-only', label: 'Quick central uniquement' },
      { id: 'wing-only', label: 'Aile gauche uniquement' },
    ],
    correctId: 'pipe',
    explanation:
      'En R6, le pointu est en P5 (arrière gauche) — c\'est la rotation où la pipe est la plus naturelle. Avec une réception moyenne, la pipe garde un tempo intermédiaire qui prend de vitesse le bloc adverse, surtout combiné au quick central en menace.',
  },
  {
    id: 'oa-q6',
    type: 'attack',
    prompt:
      'La réception est très mauvaise : la balle part loin de la cible passeur, dans une zone défensive. Quel est le bon réflexe collectif ?',
    systemId: '5-1',
    rotationId: 'R1',
    receptionQuality: 'poor',
    options: [
      { id: 'free-ball', label: 'Free ball haute aux antennes, accepter la balle facile' },
      { id: 'quick-anyway', label: 'Forcer le quick central malgré tout' },
      { id: 'block', label: 'Annuler l\'attaque et préparer le contre' },
      { id: 'jump-set', label: 'Jump-set forcé pour gagner du tempo' },
    ],
    correctId: 'free-ball',
    explanation:
      'Sur une réception "non-jouable", la règle est : envoyer une balle haute jouable aux antennes, accepter de rendre une "free ball" plutôt que d\'envoyer une balle gratuite sous le filet. L\'objectif est de remettre en jeu sans donner un point gratuit à l\'adversaire — mieux vaut défendre un side-out adverse que perdre direct.',
  },
];
