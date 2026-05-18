import type {
  AttackOption,
  RotationId,
  RoleCode,
  SystemDef,
  Rotation,
  PlayerSlot,
} from '../types';
import type { RoleColorKey } from '../../constants/positions';

// Court coordinates: 'our-side' view. x in [0,100], y in [0,100], y=0 = net.
type ZoneKey = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

const ZONES: Record<ZoneKey, { x: number; y: number }> = {
  P1: { x: 80, y: 75 },
  P2: { x: 80, y: 22 },
  P3: { x: 50, y: 22 },
  P4: { x: 20, y: 22 },
  P5: { x: 20, y: 75 },
  P6: { x: 50, y: 75 },
};

// In 6-2, two setters are diagonally opposed. The BACK setter penetrates
// and distributes (2nd touch); the FRONT setter acts as a third front-row
// attacker. After 3 rotations, the active back setter swaps.
// Libero replaces whichever MB is in the back row.
const ROTATION_MAP: Record<RotationId, Record<ZoneKey, RoleCode>> = {
  // S = "primary setter" (the team's first listed setter); S2 = the other.
  R1: { P1: 'S',   P2: 'MB1', P3: 'OH1', P4: 'S2',  P5: 'L',   P6: 'OH2' },
  R2: { P1: 'L',   P2: 'OH1', P3: 'S2',  P4: 'MB2', P5: 'OH2', P6: 'S'   },
  R3: { P1: 'OH1', P2: 'S2',  P3: 'MB2', P4: 'OH2', P5: 'S',   P6: 'L'   },
  R4: { P1: 'S2',  P2: 'MB2', P3: 'OH2', P4: 'S',   P5: 'L',   P6: 'OH1' },
  R5: { P1: 'L',   P2: 'OH2', P3: 'S',   P4: 'MB1', P5: 'OH1', P6: 'S2'  },
  R6: { P1: 'OH2', P2: 'S',   P3: 'MB1', P4: 'OH1', P5: 'S2',  P6: 'L'   },
};

const ROLE_COLOR: Record<RoleCode, RoleColorKey> = {
  S: 'P2',
  S2: 'P1',    // Differentiate visually: 2nd setter takes the opposite/purple slot
  OPP: 'P1',
  MB1: 'P3',
  MB2: 'P3',
  OH1: 'P4',
  OH2: 'P5',
  L: 'L',
  B1: 'P4',
  B2: 'P5',
};

const ATTACK_TARGET = {
  outsideLeft: { x: 8, y: 6 },
  centre: { x: 50, y: 6 },
  outsideRight: { x: 92, y: 6 },
  pipe: { x: 50, y: 20 },
};

const FRONT_ZONES: ReadonlySet<ZoneKey> = new Set(['P2', 'P3', 'P4']);

function buildSlots(id: RotationId): PlayerSlot[] {
  const mapping = ROTATION_MAP[id];
  return (Object.entries(mapping) as [ZoneKey, RoleCode][]).map(([zone, role]) => ({
    role,
    color: ROLE_COLOR[role],
    servePosition: ZONES[zone],
    receives: false,
  }));
}

// Which setter is in the back row this rotation = the one who distributes.
function backSetterRole(id: RotationId): 'S' | 'S2' {
  const mapping = ROTATION_MAP[id];
  if (mapping.P1 === 'S' || mapping.P6 === 'S' || mapping.P5 === 'S') return 'S';
  return 'S2';
}

// In 6-2 the front setter is the 3rd attacker (typically from the right side,
// since setters often play P2 in their attacking rotations). The back setter
// distributes — no arrow needed for them; their job is in the textual detail.
function buildAttacks(id: RotationId): AttackOption[] {
  const mapping = ROTATION_MAP[id];
  const active = backSetterRole(id);
  const frontSetter: RoleCode = active === 'S' ? 'S2' : 'S';
  const attacks: AttackOption[] = [];

  for (const [zone, role] of Object.entries(mapping) as [ZoneKey, RoleCode][]) {
    if (!FRONT_ZONES.has(zone)) continue;
    if (role === active || role === 'L') continue;

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
    } else if (role === frontSetter) {
      attacks.push({
        id: `${id}-setter-attack`,
        attacker: role,
        zone: 'B',
        label: 'Aile droite (passeur attaquant)',
        risk: 'medium',
        tempo: 2,
        target: ATTACK_TARGET.outsideRight,
      });
    }
  }

  // Pipe: only if an OH is in P6.
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

export const SYSTEM_6_2: SystemDef = {
  id: '6-2',
  title: 'Système 6-2',
  tagline: '2 passeurs en diagonale — toujours 3 attaquants au filet.',
  teamSize: 6,
  discipline: 'indoor',
  philosophy:
    "Le 6-2 place 2 passeurs diagonalement opposés. À chaque rotation, l'un est arrière (il pénètre et distribue) et l'autre est avant (il joue comme un 3e attaquant, généralement en aile droite). Résultat : 3 attaquants au filet en permanence, contre 2 en 5-1. C'est un système exigeant qui demande aux passeurs d'être polyvalents (passer ET attaquer), mais qui maximise les options offensives.",
  recommendedLevel: 'advanced',
  pros: [
    "3 attaquants au filet à chaque rotation : pression offensive constante.",
    "Pas de pénétration longue : le passeur arrière reste à droite.",
    "Permet la spécialisation par côté (un passeur droitier, un gaucher idéal).",
  ],
  cons: [
    "Les 2 passeurs doivent être bons attaquants (côté droit) — formation rare.",
    "Distribution moins stable : 2 styles de passe différents selon la rotation.",
    "Pas d'attaque côté gauche par le passeur ; trop prévisible côté droit.",
  ],
  rotations: {
    R1: rotation('R1', 'back', {
      summary: 'Passeur 1 arrière en P1, 2e passeur avant en P4 — il attaque comme un OH.',
      beginner:
        "Forces : 3 attaquants au filet (le 2e passeur attaque depuis P4 + central + aile droite). La pénétration du passeur arrière est courte (depuis P1). Faiblesses : le 2e passeur en P4 doit savoir attaquer une balle haute — exigeant techniquement.",
      overlap:
        "Le passeur 1 (P1) doit rester derrière P2 et à droite de P6. Le 2e passeur (P4) doit rester devant P5 et à gauche de P3. Pas de pointu à gérer (les passeurs prennent les rôles d'attaque côté droit/gauche selon rotation).",
      setterMove:
        "Pénétration courte : le passeur 1 part de P1 et remonte vers la cible (entre P2 et P3). Distance comparable au R1 du 5-1. Le 2e passeur reste au filet et bascule en attaquant après la distribution.",
      transitions:
        "Après attaque : le passeur 1 recule en P1 (défense diagonale courte). Le 2e passeur descend à la 3 m pour couvrir le contre adverse. Central et aile gauche bloquent. Transition rapide vers la couverture défensive.",
      signals:
        "Options : quick MB1 (centre), aile gauche OH1, aile droite par le 2e passeur (P4 vers la zone 2), pipe OH2 depuis P6. Distribution en éventail : tous les angles disponibles, idéal pour confondre le contre adverse.",
    }),
    R2: rotation('R2', 'back', {
      summary: 'Passeur 1 toujours arrière (P6), 2e passeur avant en P3 — attaque rapide ou aile droite.',
      beginner:
        "Forces : pénétration courte depuis le centre, 3 attaquants au filet. Le 2e passeur en P3 peut faire un quick centre ou basculer en aile droite. Faiblesses : le 2e passeur doit choisir vite entre quick et aile — la lecture du contre adverse est cruciale.",
      overlap:
        "Le passeur 1 (P6) doit rester derrière P3 et entre P5 et P1. Le 2e passeur (P3) au filet centre doit rester entre P4 et P2 et devant P6. Configuration symétrique facile à tenir.",
      setterMove:
        "Pénétration la plus courte du système : ligne droite depuis le centre arrière. Le 2e passeur reste en P3 et attaque ou bascule selon l'option choisie. Mouvement minimal pour les deux setters.",
      transitions:
        "Après attaque : passeur 1 retourne en P6 (couvre la zone centrale arrière). 2e passeur descend à la 3 m centre. Le MB front reste au filet pour contrer. Transition centrée — pas d'angle mort.",
      signals:
        "Options : quick MB2 (centre), aile gauche OH1, le 2e passeur peut frapper sur place (P3) ou bascule en P2 pour attaquer en aile droite. Pipe OH2 depuis P5. Variété maximale.",
    }),
    R3: rotation('R3', 'back', {
      summary: 'Passeur 1 arrière en P5, 2e passeur avant en P2 — la rotation la plus offensive du 6-2.',
      beginner:
        "Forces : 3 attaquants au filet, le 2e passeur attaque en aile droite (sa zone naturelle) — option la plus stable. Faiblesses : pénétration longue du passeur 1 (depuis P5 jusqu'à la cible droite) — exige un déclenchement précoce.",
      overlap:
        "Le passeur 1 (P5) doit rester à gauche de P6 et derrière P4. Le 2e passeur (P2) au filet à droite doit rester devant P1 et à droite de P3. Configuration où le 2e passeur est en position d'attaque naturelle.",
      setterMove:
        "Pénétration longue (depuis P5) : trajectoire diagonale vers la cible droite. Doit déclencher tôt sinon retard. Le 2e passeur en P2 attaque sans bouger — sa cible est juste devant lui.",
      transitions:
        "Après attaque : passeur 1 recule en P5 (défense diagonale gauche profonde). 2e passeur couvre la ligne après son attaque. Central et aile gauche bloquent. Configuration solide défensivement.",
      signals:
        "Options : quick MB2 (centre), aile gauche OH2, aile droite par le 2e passeur (attaque naturelle en P2), pipe OH1 depuis P6. La rotation la plus offensive grâce à la position naturelle du 2e passeur.",
    }),
    R4: rotation('R4', 'back', {
      summary: '2e passeur arrière en P1, passeur 1 avant en P4 — les rôles s\'inversent.',
      beginner:
        "Forces : le 2e passeur prend la distribution (rotation jumelle de R1 mais avec les rôles inversés). 3 attaquants au filet. Le passeur 1 attaque depuis P4. Faiblesses : si les 2 passeurs ont des styles très différents, l'équipe doit s'adapter — moment de transition tactique.",
      overlap:
        "Identique à R1 mais avec les rôles inversés : 2e passeur (P1) derrière P2 et à droite de P6 ; passeur 1 (P4) devant P5 et à gauche de P3.",
      setterMove:
        "Pénétration courte par le 2e passeur (depuis P1). Le passeur 1 attaque depuis P4 comme un OH. Bascule complète des responsabilités.",
      transitions:
        "Couverture identique à R1 mais inversée. 2e passeur retourne en P1, passeur 1 descend à la 3 m. Continuité défensive assurée.",
      signals:
        "Options : quick MB1 (centre), aile droite OH1, aile gauche par le passeur 1 attaquant depuis P4, pipe OH2 depuis P6. Le passeur 1 doit choisir son angle d'attaque en aile gauche.",
    }),
    R5: rotation('R5', 'back', {
      summary: '2e passeur arrière en P6, passeur 1 avant en P3 — pénétration centrale.',
      beginner:
        "Forces : pénétration la plus courte (centre arrière), 3 attaquants au filet. Le passeur 1 en P3 peut quick ou aile. Faiblesses : le passeur 1 doit être plus polyvalent encore — il joue au centre du filet, position exigeante techniquement.",
      overlap:
        "2e passeur (P6) derrière P3 et entre P5 et P1. Passeur 1 (P3) au filet centre — overlap strict, entre P4 et P2 et devant P6.",
      setterMove:
        "Pénétration la plus courte du système — ligne droite depuis P6. Le passeur 1 reste en P3 et attaque centre ou bascule en P2.",
      transitions:
        "2e passeur retourne au centre arrière (P6). Passeur 1 descend à la 3 m centre après son attaque. Configuration symétrique très stable.",
      signals:
        "Options : quick MB1 (centre), aile gauche OH1, attaque centre ou aile droite par le passeur 1 depuis P3, pipe OH2 depuis P5. Distribution centrée idéale pour exploiter une réception parfaite.",
    }),
    R6: rotation('R6', 'back', {
      summary: '2e passeur arrière en P5, passeur 1 avant en P2 — attaque aile droite naturelle.',
      beginner:
        "Forces : le passeur 1 attaque dans sa zone naturelle (P2). 3 attaquants au filet. Faiblesses : pénétration longue du 2e passeur (depuis P5) — équivalente à R3 mais inversée.",
      overlap:
        "Identique à R3 mais inversé. 2e passeur (P5) à gauche de P6 et derrière P4. Passeur 1 (P2) devant P1 et à droite de P3.",
      setterMove:
        "Pénétration longue par le 2e passeur en diagonale. Le passeur 1 attaque depuis P2 sans bouger.",
      transitions:
        "2e passeur recule en P5 (défense diagonale gauche). Passeur 1 couvre l'aile droite après son attaque.",
      signals:
        "Options : quick MB1 (centre), aile gauche OH1, aile droite par le passeur 1 (attaque naturelle en P2), pipe OH2 depuis P6. La rotation la plus solide pour finir un cycle.",
    }),
  },
};
