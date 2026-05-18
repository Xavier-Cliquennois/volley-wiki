import type {
  AttackOption,
  RotationId,
  RoleCode,
  SystemDef,
  Rotation,
  PlayerSlot,
} from '../types';
import type { RoleColorKey } from '../../constants/positions';

// Court coordinates use the 'our-side' view of components/court:
// x in [0,100], y in [0,100], y=0 is the net, y=100 is the back line.
//
// Standard FIVB zones on our half:
//   P4 (20,22)   P3 (50,22)   P2 (80,22)   ← front row
//   P5 (20,75)   P6 (50,75)   P1 (80,75)   ← back row
type ZoneKey = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

const ZONES: Record<ZoneKey, { x: number; y: number }> = {
  P1: { x: 80, y: 75 },
  P2: { x: 80, y: 22 },
  P3: { x: 50, y: 22 },
  P4: { x: 20, y: 22 },
  P5: { x: 20, y: 75 },
  P6: { x: 50, y: 75 },
};

// Who occupies each zone in each rotation (5-1 standard, with libero
// substituting whichever middle blocker is in the back row).
// Rotation order is clockwise: P4→P3→P2→P1→P6→P5→P4.
const ROTATION_MAP: Record<RotationId, Record<ZoneKey, RoleCode>> = {
  R1: { P1: 'S',   P2: 'MB1', P3: 'OH1', P4: 'OPP', P5: 'L',   P6: 'OH2' },
  R2: { P1: 'L',   P2: 'OH1', P3: 'OPP', P4: 'MB2', P5: 'OH2', P6: 'S'   },
  R3: { P1: 'OH1', P2: 'OPP', P3: 'MB2', P4: 'OH2', P5: 'S',   P6: 'L'   },
  R4: { P1: 'OPP', P2: 'MB2', P3: 'OH2', P4: 'S',   P5: 'L',   P6: 'OH1' },
  R5: { P1: 'L',   P2: 'OH2', P3: 'S',   P4: 'MB1', P5: 'OH1', P6: 'OPP' },
  R6: { P1: 'OH2', P2: 'S',   P3: 'MB1', P4: 'OH1', P5: 'OPP', P6: 'L'   },
};

// Color palette key for each role — kept stable across rotations.
// Includes codes unused in 5-1 (S2/B1/B2) so the map type stays uniform
// across all system files.
const ROLE_COLOR: Record<RoleCode, RoleColorKey> = {
  S: 'P2',
  S2: 'P1',
  OPP: 'P1',
  MB1: 'P3',
  MB2: 'P3',
  OH1: 'P4',
  OH2: 'P5',
  L: 'L',
  B1: 'P4',
  B2: 'P5',
};

// Target points where each attack is struck on our half. y=0 is the net,
// so front-row strike points are kept just above the net (y~6).
const ATTACK_TARGET = {
  outsideLeft: { x: 8, y: 6 },    // aile gauche du filet (P4 attack)
  centre: { x: 50, y: 6 },        // 1er tempo central (P3 attack)
  outsideRight: { x: 92, y: 6 },  // aile droite du filet (P2 attack)
  pipe: { x: 50, y: 20 },         // pipe (centre, légèrement en retrait)
};

const FRONT_ZONES: ReadonlySet<ZoneKey> = new Set(['P2', 'P3', 'P4']);

// Build the attack options available in a rotation, based on who occupies
// each front-row zone (and whether an OH is in P6 for pipe). Each attacker
// gets a target on the net so the diagram can draw their attack trajectory.
function buildAttacks(id: RotationId): AttackOption[] {
  const mapping = ROTATION_MAP[id];
  const attacks: AttackOption[] = [];

  for (const [zone, role] of Object.entries(mapping) as [ZoneKey, RoleCode][]) {
    if (!FRONT_ZONES.has(zone)) continue;
    if (role === 'S' || role === 'L') continue; // setter and libero do not attack

    if (role === 'MB1' || role === 'MB2') {
      attacks.push({
        id: `${id}-quick`,
        attacker: role,
        zone: 'C',
        label: 'Quick centre (1er tempo)',
        risk: 'low',
        tempo: 1,
        target: ATTACK_TARGET.centre,
      });
    } else if (role === 'OH1' || role === 'OH2') {
      attacks.push({
        id: `${id}-outside-left`,
        attacker: role,
        zone: 'A',
        label: 'Aile gauche (P4)',
        risk: 'medium',
        tempo: 2,
        target: ATTACK_TARGET.outsideLeft,
      });
    } else if (role === 'OPP') {
      attacks.push({
        id: `${id}-opp`,
        attacker: role,
        zone: 'B',
        label: 'Aile droite (Pointu)',
        risk: 'medium',
        tempo: 2,
        target: ATTACK_TARGET.outsideRight,
      });
    }
  }

  // Pipe: an OH in P6 (back-centre) is the canonical pipe attacker in 5-1.
  if (mapping.P6 === 'OH1' || mapping.P6 === 'OH2') {
    attacks.push({
      id: `${id}-pipe`,
      attacker: mapping.P6,
      zone: 'pipe',
      label: 'Pipe (P6)',
      risk: 'medium',
      tempo: 2,
      target: ATTACK_TARGET.pipe,
    });
  }

  return attacks;
}

// R1 shares the standard grid + auto-built attacks with R2-R6.
// Only the rich pedagogical details (overlap, transitions, signals) stay
// hand-authored here.
const R1: Rotation = {
  id: 'R1',
  setterAt: 'back',
  slots: buildSlots('R1'),
  attacks: buildAttacks('R1'),
  summary:
    'La plus offensive du 5-1 : 3 attaquants avant + pipe disponible. Le passeur pénètre depuis P1.',
  details: [
    {
      id: 'overlap',
      requires: 'intermediate',
      body:
        "Règles d'overlap à respecter au moment du contact serveur : le passeur (P1) doit rester derrière P2 (visuel : épaules) et à droite de P6. Le pointu (P4) doit rester devant P5 et à gauche de P3. Le central avant (P3) doit rester entre P4 et P2 sans dépasser. La moindre faute de position est sifflée.",
    },
    {
      id: 'penetration',
      requires: 'intermediate',
      body:
        'Pénétration du passeur : déclenche sur le CONTACT du serveur adverse (pas le coup de sifflet). Trajectoire courbe extérieure — longe la ligne de fond, remonte par la diagonale, arrive à la cible (~1 m du filet entre P2 et P3) épaules parallèles au filet.',
    },
    {
      id: 'transitions',
      requires: 'advanced',
      body:
        "Couverture après attaque : le pointu (P2) et l'aile gauche (P4) descendent à la 3 m pour couvrir le contre adverse. MB1 reste au filet pour le contre. Si l'attaque passe : transition immédiate, le passeur recule à sa position défensive (P1 = défense diagonale courte).",
    },
    {
      id: 'signals',
      requires: 'advanced',
      body:
        "Signaux du passeur : annoncés AVANT le service. Doigts dans le dos pour MB (1 = quick A, 2 = quick C, 3 = slide) ; main ouverte pour aile gauche en haute ; poing fermé pour tendue ; pouce vers l'arrière pour pipe. Les options changent selon la qualité de réception lue en temps réel.",
    },
    {
      id: 'when-strong',
      requires: 'beginner',
      body:
        "Quand cette rotation est forte : trois attaquants au filet + un attaquant arrière en pipe = 4 options offensives. Idéale pour ouvrir un set ou un side-out crucial. À faiblesse : si la réception est molle, le 1er tempo MB devient impossible et les options se réduisent à l'aile.",
    },
  ],
};

// Build the players in their service-whistle positions for a given rotation.
function buildSlots(id: RotationId): PlayerSlot[] {
  const mapping = ROTATION_MAP[id];
  return (Object.entries(mapping) as [ZoneKey, RoleCode][]).map(([zone, role]) => ({
    role,
    color: ROLE_COLOR[role],
    servePosition: ZONES[zone],
    receives: false,
  }));
}

type RotationCopy = {
  summary: string;
  beginner: string;
  overlap: string;
  setterMove: string;
  transitions: string;
  signals: string;
};

function rotation(
  id: RotationId,
  setterAt: 'front' | 'back',
  copy: RotationCopy,
): Rotation {
  return {
    id,
    setterAt,
    slots: buildSlots(id),
    attacks: buildAttacks(id),
    summary: copy.summary,
    details: [
      { id: `${id}-beginner`, requires: 'beginner', body: copy.beginner },
      { id: `${id}-overlap`, requires: 'intermediate', body: copy.overlap },
      { id: `${id}-setter`, requires: 'intermediate', body: copy.setterMove },
      { id: `${id}-transitions`, requires: 'advanced', body: copy.transitions },
      { id: `${id}-signals`, requires: 'advanced', body: copy.signals },
    ],
  };
}

export const SYSTEM_5_1: SystemDef = {
  id: '5-1',
  title: 'Système 5-1',
  tagline: 'Un passeur unique sur les 6 rotations — la référence en compétition.',
  teamSize: 6,
  discipline: 'indoor',
  philosophy:
    "Le 5-1 utilise un seul passeur qui distribue dans toutes les rotations, qu'il soit au filet (rotations 4-5-6) ou en arrière (rotations 1-2-3, avec pénétration). Pour préserver l'équilibre offensif, le pointu (diagonalement opposé au passeur) prend en charge l'attaque quand le passeur est au filet. Le libéro remplace les centraux quand ils sont en arrière. C'est le système qui maximise l'expertise individuelle : un seul passeur à former, des attaquants spécialisés, une distribution constante.",
  recommendedLevel: 'intermediate',
  pros: [
    'Distribution stable : un passeur, un style de jeu.',
    'Attaque variée : 3 attaquants avant + pipe en rotations arrière.',
    'Spécialisation des rôles maximale.',
  ],
  cons: [
    'Nécessite un passeur fiable sur 6 rotations (point faible si remplacé).',
    'Pénétration exigeante dans les rotations arrière.',
    'Faiblesse défensive en P1 quand le passeur pénètre (off-blocker doit compenser).',
  ],
  rotations: {
    R1,
    R2: rotation('R2', 'back', {
      summary: 'Passeur en P6. Pénétration depuis le centre — trajectoire la plus courte.',
      beginner:
        "Forces : pénétration la plus courte du système, idéale pour enchaîner une attaque rapide après réception. Faiblesses : seulement 2 attaquants au filet (le pointu est arrière), les options offensives sont réduites comparé à R1 ou R3.",
      overlap:
        "Règles d'overlap : le passeur (P6) doit rester derrière P3 et entre P5 et P1. Le pointu (P3) au filet centre doit rester devant P6 et entre P4 et P2. Le libéro en P1 doit rester derrière P2 et à droite de P6. Configuration symétrique, plus facile à tenir que R1.",
      setterMove:
        "Pénétration courte : le passeur démarre au centre arrière et remonte en ligne droite vers la cible (entre P2 et P3). Déclenchement au contact du serveur. C'est la trajectoire la plus rapide, le passeur arrive avant la balle dans la majorité des cas.",
      transitions:
        "Couverture après attaque : pointu (P3) et aile (P4) descendent à la 3 m pour couvrir le contre adverse. Central avant (P2) reste au filet pour le contre. Après le set, le passeur recule au centre arrière (P6) — il couvre la zone défensive la plus large.",
      signals:
        "Options offensives : quick central (P2) en 1er tempo, aile gauche (P4) en 2ᵉ tempo, pipe depuis P5 si l'aile arrière est forte. Le pointu n'est pas disponible (arrière, en P1). Le passeur annonce souvent quick + aile pour exploiter la réception centrale.",
    }),
    R3: rotation('R3', 'back', {
      summary: 'Passeur en P5. Pénétration depuis la gauche, doit traverser le terrain.',
      beginner:
        "Forces : 3 attaquants disponibles au filet (pointu en P2 + central en P3 + aile gauche en P4). Faiblesses : pénétration la plus longue du système — si la réception est rapide ou molle, le passeur arrive en retard et un coéquipier doit prendre la 2ᵉ touche.",
      overlap:
        "Règles d'overlap : le passeur (P5) doit rester à gauche de P6 et derrière P4. L'aile gauche (P4) doit rester devant P5 et à gauche de P3. Le pointu (P2) au filet à droite a beaucoup d'espace. C'est la rotation où le passeur doit le plus discipliner sa position avant le service.",
      setterMove:
        "Pénétration longue : trajectoire en diagonale depuis l'arrière gauche jusqu'à la cible droite. Le passeur doit déclencher tôt et accélérer. Variante : pénétration par le couloir extérieur (gauche → ligne de fond → remontée à droite) pour éviter de gêner les receveurs centraux.",
      transitions:
        "Couverture après attaque : aile gauche (P4) et central (P3) couvrent en arc autour de l'attaquant. Le passeur arrière (P5) couvre la diagonale courte gauche. Si la défense récupère, le passeur a la pénétration la plus longue pour la 2ᵉ touche — souvent le libéro ou l'aile prend la passe.",
      signals:
        "Options offensives : aile gauche (P4) en haute si le passeur arrive en retard, quick central (P3) si la réception est parfaite, attaque pointu (P2) sur balle plus haute, pipe depuis P6 (OH2 arrière). La plus offensive en théorie, mais conditionnée par la vitesse du passeur.",
    }),
    R4: rotation('R4', 'front', {
      summary: 'Passeur en P4. Au filet à gauche — distribution rapide vers le centre et la droite.',
      beginner:
        "Forces : pas de pénétration, le passeur est déjà au filet. Distribution stable. Le pointu (arrière en P1) reste prêt à frapper en pipe. Faiblesses : seulement 2 vrais attaquants au filet (central + aile droite — le passeur ne frappe pas), donc le contre adverse anticipe plus facilement.",
      overlap:
        "Règles d'overlap : le passeur (P4) au filet à gauche doit rester devant P5 et à gauche de P3. L'aile gauche (P5) à l'arrière gauche doit rester derrière P4. Le central (P3) doit rester entre P4 et P2 — c'est la rotation où le central doit le plus se discipliner pour éviter la faute.",
      setterMove:
        "Pas de pénétration : le passeur glisse de P4 vers la cible (entre P3 et P2) dès le contact du serveur. Distance courte, trajectoire le long du filet. Doit faire face au filet et basculer rapidement pour ne pas être en retard sur les balles tendues.",
      transitions:
        "Couverture après attaque : le passeur (P4) descend à la 3 m pour couvrir l'aile droite. Le central reste au filet pour le contre. Le pointu en P1 (arrière) prépare la pipe sur transition — c'est l'arme principale de cette rotation pour contourner le bloc adverse.",
      signals:
        "Options offensives : quick central (P3) en 1er tempo, aile droite (P2 où l'OH2 est positionné) en 2ᵉ tempo, pipe depuis l'arrière droite (P1 pointu). Le passeur annonce souvent pipe + quick pour exploiter la défense réduite. Pas d'aile gauche car le passeur occupe P4.",
    }),
    R5: rotation('R5', 'front', {
      summary: 'Passeur en P3. Au filet au centre — meilleur angle de distribution.',
      beginner:
        "Forces : le passeur au centre voit tout le terrain et distribue sur tous les angles. Faiblesses : il doit basculer instantanément de P3 vers la cible (droite du filet) et le central avant (en P4) doit dégager le filet pour attaquer en aile gauche.",
      overlap:
        "Règles d'overlap : le passeur (P3) au filet centre doit rester entre P4 et P2 et devant P6. C'est l'overlap le plus strict du système — pas de marge à gauche ni à droite. Le central en arrière (P6, en réalité remplacé par OPP ici) doit rester derrière le passeur.",
      setterMove:
        "Le passeur glisse de P3 vers la droite (cible entre P2 et P3) dès le contact serveur. Mouvement court mais doit être instantané — le central avant (P4) dégage simultanément vers l'aile gauche pour attaquer. Synchronisation passeur/central cruciale.",
      transitions:
        "Couverture après attaque : le passeur descend à la 3 m sur la diagonale courte. Le central (qui était en P4) revient au filet pour le contre. Le pointu en P6 (arrière) prépare la pipe — c'est une rotation où la pipe est très exploitable grâce à l'angle central du passeur.",
      signals:
        "Options offensives : aile gauche (le central avant qui a basculé), aile droite (OH2 en P2), pipe (pointu arrière P6). Le central avant ne fait pas de quick dans cette rotation (il est en P4 et part attaquer comme une aile). Distribution riche grâce à l'angle central.",
    }),
    R6: rotation('R6', 'front', {
      summary: 'Passeur en P2. Au filet à droite — la rotation la plus stable défensivement.',
      beginner:
        "Forces : le passeur est déjà à sa cible (zone 2 du filet), transition ultra rapide. Le pointu est arrière (P5) prêt pour la pipe. Faiblesses : la défense en P1 (zone diagonale courte derrière le passeur) est plus faible car couverte par le pointu, moins défensif que l'aile.",
      overlap:
        "Règles d'overlap : le passeur (P2) au filet à droite doit rester à droite de P3 et devant P1. Position naturelle, l'overlap se tient sans effort. Le pointu en P5 (arrière gauche) a beaucoup d'espace, pas de contrainte serrée.",
      setterMove:
        "Déplacement minimal : le passeur ajuste de quelques pas vers la cible (entre P2 et P3). C'est la transition la plus rapide du système, idéale pour les side-outs sous pression. Le passeur peut même prendre la 2ᵉ touche sans bouger sur une bonne réception.",
      transitions:
        "Couverture après attaque : le passeur (P2) couvre l'aile droite en arc serré. Le central (P3) bloque l'attaque adverse opposée. Le pointu (P5 arrière) descend à la 3 m gauche pour couvrir le contre. Configuration défensive très équilibrée, la plus solide du système.",
      signals:
        "Options offensives : quick central (P3) en 1er tempo, aile gauche (P4 où l'OH1 est positionné) en 2ᵉ tempo, pipe depuis P5 (pointu arrière). Le passeur exploite la stabilité de sa position pour distribuer plus souvent vers les attaquants les plus dangereux du match.",
    }),
  },
};
