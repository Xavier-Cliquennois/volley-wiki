import type {
  AttackOption,
  RotationId,
  RoleCode,
  SystemDef,
  Rotation,
  PlayerSlot,
} from '../types';
import type { RoleColorKey } from '../../constants/positions';

type ZoneKey = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

const ZONES: Record<ZoneKey, { x: number; y: number }> = {
  P1: { x: 80, y: 75 },
  P2: { x: 80, y: 22 },
  P3: { x: 50, y: 22 },
  P4: { x: 20, y: 22 },
  P5: { x: 20, y: 75 },
  P6: { x: 50, y: 75 },
};

// In 4-2: 2 setters diagonally opposed, the FRONT setter sets the 2nd touch
// (no penetration). No libero in the basic 4-2. Only 2 attackers at the net.
// Same player layout as 6-2 but the front setter is the distributor.
const ROTATION_MAP: Record<RotationId, Record<ZoneKey, RoleCode>> = {
  R1: { P1: 'S',   P2: 'MB1', P3: 'OH1', P4: 'S2',  P5: 'MB2', P6: 'OH2' },
  R2: { P1: 'MB1', P2: 'OH1', P3: 'S2',  P4: 'MB2', P5: 'OH2', P6: 'S'   },
  R3: { P1: 'OH1', P2: 'S2',  P3: 'MB2', P4: 'OH2', P5: 'S',   P6: 'MB1' },
  R4: { P1: 'S2',  P2: 'MB2', P3: 'OH2', P4: 'S',   P5: 'MB1', P6: 'OH1' },
  R5: { P1: 'MB2', P2: 'OH2', P3: 'S',   P4: 'MB1', P5: 'OH1', P6: 'S2'  },
  R6: { P1: 'OH2', P2: 'S',   P3: 'MB1', P4: 'OH1', P5: 'S2',  P6: 'MB2' },
};

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

const ATTACK_TARGET = {
  outsideLeft: { x: 8, y: 6 },
  centre: { x: 50, y: 6 },
  outsideRight: { x: 92, y: 6 },
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

// In 4-2 the FRONT setter is the distributor. The back setter plays as a
// defender only — no attack.
function frontSetterRole(id: RotationId): 'S' | 'S2' {
  const mapping = ROTATION_MAP[id];
  for (const zone of ['P2', 'P3', 'P4'] as const) {
    if (mapping[zone] === 'S') return 'S';
    if (mapping[zone] === 'S2') return 'S2';
  }
  return 'S';
}

function buildAttacks(id: RotationId): AttackOption[] {
  const mapping = ROTATION_MAP[id];
  const active = frontSetterRole(id);
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
      // OH targets the wing opposite to where the active setter stands so the
      // attack is the most natural angle for them.
      const targetZone = active === 'S2' ? 'outsideLeft' : 'outsideRight';
      attacks.push({
        id: `${id}-outside`,
        attacker: role,
        zone: active === 'S2' ? 'A' : 'B',
        label: active === 'S2' ? 'Aile gauche (P4)' : 'Aile droite (P2)',
        risk: 'medium',
        tempo: 2,
        target: ATTACK_TARGET[targetZone],
      });
    }
  }

  // No pipe in basic 4-2 — back-row attacks are not part of the system.
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
  copy: RotationCopy,
): Rotation {
  return {
    id,
    setterAt: 'front',  // In 4-2 the active setter is always front-row.
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

export const SYSTEM_4_2: SystemDef = {
  id: '4-2',
  title: 'Système 4-2',
  tagline: 'Le plus simple — 2 passeurs avant qui distribuent sans pénétrer.',
  teamSize: 6,
  discipline: 'indoor',
  philosophy:
    "Le 4-2 utilise 2 passeurs en diagonale. À chaque rotation, le passeur AVANT prend la 2ᵉ touche et distribue — pas de pénétration ! C'est le système le plus simple à apprendre : pas de mouvement complexe du passeur, juste 2 attaquants au filet. Idéal pour les débutants, l'éducation, le loisir.",
  recommendedLevel: 'beginner',
  pros: [
    "Aucune pénétration — le passeur avant prend la balle sur place.",
    "Système le plus simple : 2 passeurs polyvalents suffisent.",
    "Excellent pour apprendre les rotations sans complexité tactique.",
  ],
  cons: [
    "Seulement 2 attaquants au filet : moins offensif, contre adverse anticipe.",
    "Le passeur ne peut pas attaquer (il distribue) : 1 joueur \"perdu\" en attaque.",
    "Pas de pipe traditionnellement — options offensives limitées.",
  ],
  rotations: {
    R1: rotation('R1', {
      summary: '2e passeur (S2) avant en P4 — il distribue. 2 attaquants : MB1 quick + OH1 aile.',
      beginner:
        "Forces : la rotation la plus stable du 4-2. Le 2e passeur est déjà au filet à gauche, il prend la 2ᵉ touche sans bouger. Faiblesses : 2 attaquants seulement (le central et l'aile) — le contre adverse anticipe facilement.",
      overlap:
        "Le 2e passeur (P4) au filet à gauche doit rester devant P5 et à gauche de P3. Le passeur 1 (P1) à l'arrière reste défenseur — il ne participe pas à l'attaque.",
      setterMove:
        "Pas de mouvement : le 2e passeur prend la passe sur place. C'est la principale différence avec le 6-2 — pas de pénétration, pas de course.",
      transitions:
        "Après attaque : le 2e passeur descend à la 3 m pour couvrir le contre. Le passeur 1 reste en P1 (défense). Configuration défensive symétrique mais avec un attaquant en moins.",
      signals:
        "Options : quick centre MB1, aile droite par OH1 (puisque le 2e passeur occupe l'aile gauche). Distribution simple, peu d'options — le passeur annonce souvent la même option en répétition.",
    }),
    R2: rotation('R2', {
      summary: '2e passeur en P3 (filet centre) — il distribue. MB2 quick à droite + OH1 aile gauche.',
      beginner:
        "Forces : le 2e passeur au centre voit tout le terrain. 2 attaquants : MB2 (en P4 qui bascule) et OH1 (en P2). Faiblesses : le central doit basculer côté gauche pour attaquer — il n'est pas dans sa zone naturelle.",
      overlap:
        "Le 2e passeur (P3) au filet centre doit rester entre P4 et P2 et devant P6. Overlap strict mais sans difficulté car aucun mouvement.",
      setterMove:
        "Pas de mouvement. Le 2e passeur prend la 2ᵉ touche au centre du filet, distribue à gauche (MB2) ou à droite (OH1).",
      transitions:
        "Couverture centrée. Le 2e passeur descend en P3 à la 3 m. Les attaquants couvrent leur côté.",
      signals:
        "Options : MB2 attaque depuis P4 (aile gauche), OH1 attaque depuis P2 (aile droite). Le 2e passeur choisit selon la qualité de réception.",
    }),
    R3: rotation('R3', {
      summary: '2e passeur en P2 (filet droite) — il distribue. MB2 quick + OH2 aile gauche.',
      beginner:
        "Forces : le 2e passeur est à droite, position naturelle. 2 attaquants : MB2 au centre + OH2 à gauche. Faiblesses : pas de menace côté droit (le passeur ne frappe pas).",
      overlap:
        "Le 2e passeur (P2) doit rester devant P1 et à droite de P3. Position naturelle, overlap facile.",
      setterMove:
        "Pas de mouvement. Le 2e passeur prend la balle à droite du filet et distribue à gauche.",
      transitions:
        "Le 2e passeur couvre la ligne droite. MB2 reste au filet pour contrer. Configuration solide mais peu d'options offensives.",
      signals:
        "Options : MB2 quick centre, OH2 aile gauche. Le 2e passeur ne peut presque que distribuer à gauche — très prévisible.",
    }),
    R4: rotation('R4', {
      summary: 'Passeur 1 (S) avant en P4 — il distribue (les rôles s\'inversent). MB1 quick + OH2 aile droite.',
      beginner:
        "Forces : c'est maintenant au passeur 1 de distribuer. Mêmes principes que R1 mais les rôles sont inversés. Faiblesses : transition mentale — l'équipe doit s'adapter au style du nouveau distributeur.",
      overlap:
        "Le passeur 1 (P4) au filet à gauche doit rester devant P5 et à gauche de P3. Le 2e passeur (P1) à l'arrière joue défenseur uniquement.",
      setterMove:
        "Pas de mouvement. Le passeur 1 prend la balle sur place en P4.",
      transitions:
        "Couverture symétrique à R1. Le passeur 1 descend à la 3 m après distribution. 2e passeur reste en P1.",
      signals:
        "Options : MB1 quick centre, OH2 attaque aile droite (depuis P2). Distribution simple à droite uniquement.",
    }),
    R5: rotation('R5', {
      summary: 'Passeur 1 en P3 (centre filet) — il distribue. MB1 quick à droite + OH2 aile gauche.',
      beginner:
        "Forces : le passeur 1 au centre voit tout. 2 attaquants. Faiblesses : le central doit basculer côté droit pour attaquer.",
      overlap:
        "Le passeur 1 (P3) doit rester entre P4 et P2 et devant P6. Overlap strict.",
      setterMove:
        "Pas de mouvement. Le passeur 1 prend la balle au centre et distribue.",
      transitions:
        "Couverture centrée, symétrique à R2.",
      signals:
        "Options : MB1 depuis P4 (aile gauche bascule), OH2 depuis P2 (aile droite). Distribution centrée.",
    }),
    R6: rotation('R6', {
      summary: 'Passeur 1 en P2 (filet droite) — il distribue. MB1 quick + OH1 aile gauche.',
      beginner:
        "Forces : le passeur 1 est à droite, position naturelle. Mêmes principes que R3 mais inversés. Faiblesses : très prévisible, distribution à gauche uniquement.",
      overlap:
        "Le passeur 1 (P2) doit rester devant P1 et à droite de P3.",
      setterMove:
        "Pas de mouvement. Le passeur 1 prend la balle à droite et distribue.",
      transitions:
        "Couverture droite. Configuration solide mais peu offensive.",
      signals:
        "Options : MB1 quick, OH1 aile gauche. Distribution simple à gauche.",
    }),
  },
};
