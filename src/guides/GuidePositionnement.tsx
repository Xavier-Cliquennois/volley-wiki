import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Court, type CourtLayout } from '../components/court';
import type { RoleColorKey } from '../constants/positions';
import { CONFIGURATIONS, type TeamSize } from '../pages/Positions';
import { S } from './styles';
import { TEAM_SIZES, type TeamSizeSlug } from '../seo/constants';

const SLUG_TO_SIZE: Record<TeamSizeSlug, TeamSize> = { '4v4': 4, '5v5': 5, '6v6': 6 };
const SIZE_TO_SLUG: Record<TeamSize, TeamSizeSlug> = { 4: '4v4', 5: '5v5', 6: '6v6' };

type ZoneTab = 'zone4' | 'zone3' | 'zone2';
type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

type DefensePlayer = {
  zoneId: ZoneId;
  x: number;
  y: number;
  sub?: string;
  // Optional overrides for the colour and label shown.
  role?: RoleColorKey;
  label?: string;
};

type DefenseZone = {
  x: number; y: number; w: number; h: number;
  posNumber: ZoneId;
  label: string;
  // Optional override of the zone fill colour (defaults to posNumber's role).
  role?: RoleColorKey;
  // Optional manual label colour (defaults to neutral fallback).
  labelRole?: RoleColorKey;
  // Optional manual label position (already final; no auto-offset).
  labelPos?: { x: number; y: number };
};

type Shot = {
  toX: number;
  toY: number;
};

type DefenseNote = string | { label: string; text: string };

type DefenseLayout = {
  ballX: number;
  ballY: number;
  players: DefensePlayer[];
  zones: DefenseZone[];
  mainShot: Shot;
  altShots: Shot[];
  notes: DefenseNote[];
};

const Z = (zoneId: ZoneId, x: number, y: number, w: number, h: number, label: string): DefenseZone =>
  ({ x, y, w, h, posNumber: zoneId, label });

function defenseToCourtLayout(layout: DefenseLayout): CourtLayout {
  return {
    ball: { x: layout.ballX, y: layout.ballY },
    players: layout.players.map((p, i) => ({
      id: `${p.zoneId}-${i}`,
      x: p.x,
      y: p.y,
      label: p.label ?? p.zoneId.slice(1),
      role: p.role ?? p.zoneId,
      sub: p.sub,
    })),
    zones: layout.zones.map((z, i) => ({
      id: `${z.posNumber}-${i}`,
      x: z.x,
      y: z.y,
      w: z.w,
      h: z.h,
      role: z.role ?? z.posNumber,
      label: z.label,
      labelRole: z.labelRole,
      labelPos: z.labelPos,
    })),
    arrows: [
      {
        id: 'main',
        kind: 'main',
        from: { x: layout.ballX, y: layout.ballY },
        to: { x: layout.mainShot.toX, y: layout.mainShot.toY },
      },
      ...layout.altShots.map((s, i) => ({
        id: `alt-${i}`,
        kind: 'alt' as const,
        from: { x: layout.ballX, y: layout.ballY },
        to: { x: s.toX, y: s.toY },
      })),
    ],
  };
}

// Convention FIVB : Z4 adverse (sa gauche) → balle arrive sur notre côté DROIT (ballX ~85).
// Z2 adverse (sa droite) → balle arrive sur notre côté GAUCHE (ballX ~15).
//
// 5v5 et 4v4 ne sont PAS des formats codifiés par la FIVB. Les positions ci-dessous sont
// des adaptations logiques des principes 6v6 (Hebert, Liskevych, Volleyball Canada).
// Le doc de référence 4v4/5v5 décrit 3 systèmes principaux :
//   • 5v5 1-1-3 : 1 contreur + 1 couvreur tip + 3 défenseurs profonds (recommandé en 2-3)
//   • 5v5 2-1-2 : 2 contreurs + 1 tip + 2 défenseurs profonds (recommandé en 3-2 puissant)
//   • 5v5 1-2-2 : man-up adapté (1 contreur + 2 couvreurs + 2 défenseurs profonds)
//   • 4v4 « système A » : 1 contreur + 3 défenseurs (le plus répandu, distances 7-7,5 m)
//   • 4v4 « système B » : 2 contreurs + 2 défenseurs (équipes très puissantes uniquement)
const LAYOUTS_5V5_PENTAGON: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P3', x: 72, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 20, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 67 },
      { zoneId: 'P1', x: 78, y: 70 },
    ],
    zones: [
      Z('P1', 65, 40, 35, 60, 'Z1 court'),
      Z('P5', 0, 43, 50, 57, 'Grande diag.'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Attaque Z4 adverse (aile gauche adverse) → balle arrive sur notre droite.',
      'Système 2-1-2 : bloc à 2 (P2 pointu ligne + P3 diagonale) + 2 défenseurs profonds.',
      'P4 (aile gauche) en off-blocker à 2-2,5 m du filet, 1 m de la ligne — couvre tip et cut shot.',
      'P5 (~7-7,5 m, 0,5 m ligne gauche) défend la grande diagonale longue cross-court.',
      'P1 (~7-7,5 m, 0,5 m ligne droite) défend la ligne profonde, dans l\'ombre du bloc.',
      'Coup principal défendu : diagonale longue cross-court (trajectoire statistiquement la plus fréquente).',
    ],
  },
  zone3: {
    ballX: 50, ballY: 19,
    players: [
      { zoneId: 'P3', x: 50, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 25, y: 47.5, sub: 'OFF' },
      { zoneId: 'P2', x: 75, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 70 },
      { zoneId: 'P1', x: 75, y: 70 },
    ],
    zones: [
      Z('P5', 0, 40, 50, 60, 'Diag G'),
      Z('P1', 50, 40, 50, 60, 'Diag D'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 82 }],
    notes: [
      'Attaque rapide centrale (Z3) — angles courts, peu de temps de réaction.',
      'Bloc à 1 : P3 (central) en lecture (read), pas de commitment possible.',
      'P4 et P2 (off-blockers) à 2 m du filet sur la ligne d\'attaque — couvrent déviations.',
      'P5 et P1 avancés d\'1 m (~7 m du filet) — angles plus courts qu\'en haute balle.',
      'Faiblesse : pas de défenseur fond central dédié (seulement 2 arrières en 5v5).',
      'Règle clé : « stopped on contact » — tous arrêtés et équilibrés à l\'instant du contact.',
    ],
  },
  zone2: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P3', x: 28, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 80, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 70 },
      { zoneId: 'P1', x: 75, y: 67 },
    ],
    zones: [
      Z('P5', 0, 40, 35, 60, 'Z5 court'),
      Z('P1', 50, 43, 50, 57, 'Grande diag.'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Attaque Z2 adverse (aile droite adverse) → balle arrive sur notre gauche. Miroir parfait de Z4.',
      'Bloc à 2 : P4 (R4 ligne) + P3 (central diagonale).',
      'P2 (pointu / passeur) en off-blocker à 2-2,5 m du filet côté droit.',
      'P1 (~7-7,5 m, 1 m ligne droite) défend la grande diagonale longue.',
      'P5 (~7-7,5 m, 0,5 m ligne gauche) défend la ligne profonde dans l\'ombre du bloc.',
    ],
  },
};

const LAYOUTS_5V5_3F2B: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P3', x: 72, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 20, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 35, y: 70 },
      { zoneId: 'P1', x: 78, y: 70 },
    ],
    zones: [
      Z('P1', 65, 40, 35, 60, 'Z1 court'),
      Z('P5', 0, 43, 50, 57, 'Grande diag.'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 35, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Attaque Z4 adverse → balle arrive sur notre côté droit.',
      'Configuration 3F-2B : 3 avants → bloc à 2 favorable (P3 + P2 passeur-contreur).',
      'P4 (R4) off-blocker court côté gauche sur la ligne d\'attaque (~2-2,5 m du filet).',
      'P5 défend la grande diagonale longue cross-court (~7 m, 0,5 m ligne gauche).',
      'P1 défend la ligne profonde droite dans l\'ombre du bloc (~7 m, 0,5 m ligne droite).',
      'Inconvénient : seulement 2 défenseurs en fond → 30+ m² par défenseur (vs 20 m² en 6v6).',
    ],
  },
  zone3: {
    ballX: 50, ballY: 19,
    players: [
      { zoneId: 'P4', x: 40, y: 29.5, sub: 'BLK' },
      { zoneId: 'P3', x: 50, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 60, y: 29.5, sub: 'BLK' },
      { zoneId: 'P5', x: 25, y: 70 },
      { zoneId: 'P1', x: 75, y: 70 },
    ],
    zones: [
      Z('P5', 0, 40, 50, 60, 'Diag G'),
      Z('P1', 50, 40, 50, 60, 'Diag D'),
    ],
    mainShot: { toX: 50, toY: 82 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 75, toY: 70 }],
    notes: [
      'Attaque rapide centrale (Z3) — angles courts.',
      'Avec 3 avants, bloc à 3 possible mais laisse seulement 2 défenseurs au sol — déconseillé.',
      'Recommandé : bloc à 2 (P3 + aile la plus proche du couloir de frappe).',
      'P5 et P1 avancés d\'1 m (~7 m) car les angles sont plus courts sur quick.',
      'Faiblesse : balle profonde axiale non couverte (pas de Z6 défenseur en 5v5 3F-2B).',
    ],
  },
  zone2: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P3', x: 28, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 80, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 70 },
      { zoneId: 'P1', x: 75, y: 70 },
    ],
    zones: [
      Z('P5', 0, 43, 35, 57, 'Z5 court'),
      Z('P1', 50, 43, 50, 57, 'Grande diag.'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Attaque Z2 adverse → balle arrive sur notre côté gauche. Miroir parfait de Z4.',
      'Bloc à 2 : P4 (R4 ligne) + P3 (central diagonale).',
      'Le passeur (P2) en off-blocker à 2-2,5 m du filet côté droit (anti-feinte + transition rapide vers la cible).',
      'P1 défend la grande diagonale longue (~7-7,5 m).',
      'P5 défend la ligne profonde gauche dans l\'ombre du bloc.',
    ],
  },
};

const LAYOUTS_4V4_LOSANGE: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P3', x: 78, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 55, sub: 'OFF' },
      { zoneId: 'P4', x: 20, y: 47.5, sub: 'DÉF' },
      { zoneId: 'P1', x: 50, y: 73 },
    ],
    zones: [
      Z('P2', 65, 34, 35, 66, 'Court ligne'),
      Z('P4', 0, 25, 35, 45, 'Diag G'),
      Z('P1', 25, 62.5, 45, 37.5, 'Fond'),
    ],
    mainShot: { toX: 20, toY: 55 },
    altShots: [{ toX: 82, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 70, toY: 47.5 }],
    notes: [
      'Attaque Z4 adverse → balle arrive sur notre côté droit.',
      'Formation losange (1-2-1) → système A : 1 contreur (P3) + 3 défenseurs.',
      'P3 monte en bloc solo côté droit (face à l\'attaquant adverse).',
      'P2 (avant droit) redescend sur les 3 m à 3,5-4 m du filet — couvre tip et feintes derrière le bloc.',
      'P4 (avant gauche) recule à mi-terrain côté gauche — couverture petite diagonale courte.',
      'P1 (arrière unique) défend la grande diagonale longue cross-court (~7-7,5 m, 1 m ligne droite).',
      'Anticipation = compétence n°1 : 1 seul arrière → ~40 m² à couvrir.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 19,
    players: [
      { zoneId: 'P3', x: 50, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 47.5, sub: 'DÉF' },
      { zoneId: 'P2', x: 80, y: 47.5, sub: 'DÉF' },
      { zoneId: 'P1', x: 50, y: 73 },
    ],
    zones: [
      Z('P4', 0, 32.5, 35, 52.5, 'Diag G'),
      Z('P2', 65, 32.5, 35, 52.5, 'Diag D'),
      Z('P1', 30, 62.5, 45, 37.5, 'Fond'),
    ],
    mainShot: { toX: 50, toY: 77.5 },
    altShots: [{ toX: 18, toY: 55 }, { toX: 80, toY: 55 }],
    notes: [
      'Attaque rapide centrale (Z3) — config la plus difficile en 4v4 : peu de temps, 1 seul contreur.',
      'Bloc à 1 (P3 seul) en LECTURE permanente (pas de commitment possible).',
      'P4 et P2 reculent à mi-terrain (~3,5-4 m du filet, couvrent les deux diagonales courtes).',
      "L'arrière unique P1 fait office de Z6 défenseur (axe central, 7-8 m du filet).",
      'Coup principal : balle puissante axiale (vers P1) car le bloc à 1 ne couvre que le centre.',
    ],
  },
  zone2: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P3', x: 22, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 55, sub: 'OFF' },
      { zoneId: 'P2', x: 80, y: 47.5, sub: 'DÉF' },
      { zoneId: 'P1', x: 50, y: 73 },
    ],
    zones: [
      Z('P4', 0, 34, 35, 66, 'Court ligne'),
      Z('P2', 60, 25, 40, 45, 'Diag D'),
      Z('P1', 30, 62.5, 45, 37.5, 'Fond'),
    ],
    mainShot: { toX: 80, toY: 55 },
    altShots: [{ toX: 18, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 30, toY: 55 }],
    notes: [
      'Attaque Z2 adverse → balle arrive sur notre côté gauche. Miroir parfait de Z4.',
      'Système A : 1 contreur (P3) + 3 défenseurs.',
      'P4 (avant gauche) redescend sur les 3 m à 3,5-4 m — couvre tip et feintes côté gauche.',
      'P2 (avant droit) recule à mi-terrain côté droit — couvre petite diagonale courte.',
      "L'arrière unique P1 défend la grande diagonale longue cross-court (~7-7,5 m, 1 m ligne gauche).",
    ],
  },
};

const LAYOUTS_4V4_CARRE: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P2', x: 82, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 22, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 70 },
      { zoneId: 'P1', x: 75, y: 70 },
    ],
    zones: [
      Z('P1', 65, 43, 35, 57, 'Petite diag'),
      Z('P5', 0, 43, 50, 57, 'Grande diag.'),
      Z('P4', 0, 25, 35, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 22, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Attaque Z4 adverse → balle arrive sur notre côté droit.',
      'Formation carré (2-2 / box) → système A : 1 contreur (P2) + 3 défenseurs.',
      'P2 (avant droit) bloc solo face à l\'attaquant adverse, fixe la ligne.',
      'P4 (avant gauche) en off-blocker à 2-2,5 m du filet — couvre tip et cut shot côté gauche.',
      'P5 défend la grande diagonale longue (~7 m, 0,5 m ligne gauche).',
      'P1 défend la ligne profonde / petite diagonale courte (~7 m, dans l\'ombre du bloc).',
      'Système B (bloc à 2 P2+P4) possible mais laisse seulement 2 défenseurs — à réserver aux gros frappeurs.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 19,
    players: [
      { zoneId: 'P4', x: 42, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 58, y: 29.5, sub: 'BLK' },
      { zoneId: 'P5', x: 25, y: 70 },
      { zoneId: 'P1', x: 75, y: 70 },
    ],
    zones: [
      Z('P5', 0, 40, 50, 60, 'Diag G'),
      Z('P1', 50, 40, 50, 60, 'Diag D'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 47.5 }],
    notes: [
      'Attaque rapide centrale (Z3) — angles courts, peu de temps.',
      'Bloc à 2 (P4 + P2) ferme le centre — système B avec 2 défenseurs derrière.',
      'P5 et P1 prennent les diagonales courtes (~7 m, 0,5-1 m des lignes).',
      'Faiblesse majeure : aucune couverture courte derrière le bloc, le carré n\'a pas de joueur à mi-terrain.',
      'Alternative : bloc à 1 (P3-like rôle, ici P4 ou P2 seul) pour libérer un défenseur tip.',
    ],
  },
  zone2: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P4', x: 18, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 78, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 70 },
      { zoneId: 'P1', x: 75, y: 70 },
    ],
    zones: [
      Z('P5', 0, 43, 35, 57, 'Petite diag'),
      Z('P1', 50, 43, 50, 57, 'Grande diag.'),
      Z('P2', 60, 25, 40, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 78, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Attaque Z2 adverse → balle arrive sur notre côté gauche. Miroir parfait de Z4.',
      'Système A : 1 contreur (P4) + 3 défenseurs.',
      'P4 (avant gauche) bloc solo face à l\'attaquant adverse, fixe la ligne.',
      'P2 (passeur-attaquant avant droit) en off-blocker à 2-2,5 m du filet — anti-feinte + transition rapide vers cible.',
      'P1 défend la grande diagonale longue (~7 m, 0,5 m ligne droite).',
      'P5 défend la ligne profonde courte (~7 m, dans l\'ombre du bloc).',
    ],
  },
};

const LAYOUTS_4V4_31 = LAYOUTS_4V4_LOSANGE;

// 5v5 2F-3B : 2 avants (P4, P3) + 3 arrières (P5, P6, P1 passeur pénétrant).
// Pas de P2 — c'est la config la plus proche du 5-1 6v6. Système défensif : 1-1-3.
const LAYOUTS_5V5_2F3B: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P3', x: 78, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 20, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 70 },
      { zoneId: 'P6', x: 50, y: 70 },
      { zoneId: 'P1', x: 78, y: 67 },
    ],
    zones: [
      Z('P1', 65, 40, 35, 60, 'Ligne D'),
      Z('P6', 33, 52, 34, 48, 'Axe'),
      Z('P5', 0, 43, 35, 57, 'Diag G'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 75 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 70 }, { toX: 18, toY: 40 }],
    notes: [
      'Attaque Z4 adverse → balle arrive sur notre droite.',
      'Configuration 2F-3B (P4+P3 avants, P5+P6+P1 arrières, P1 pénétrant) : bloc à 1.',
      'P3 (central) contre seul côté droit — pas de P2 disponible pour bloc à 2.',
      'P4 (R4) off-blocker à 2-2,5 m du filet côté gauche.',
      '3 défenseurs profonds : P5 grande diagonale, P6 axe central (~7-8 m), P1 ligne droite.',
      'Le système 1-1-3 (1 contreur + 1 off-blocker + 3 défenseurs) est la défense la plus proche du 6v6 périmétrique.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 19,
    players: [
      { zoneId: 'P3', x: 50, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 22, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 70 },
      { zoneId: 'P6', x: 50, y: 70 },
      { zoneId: 'P1', x: 78, y: 70 },
    ],
    zones: [
      Z('P5', 0, 40, 33, 60, 'Diag G'),
      Z('P6', 33, 52, 34, 48, 'Axe'),
      Z('P1', 67, 40, 33, 60, 'Diag D'),
    ],
    mainShot: { toX: 50, toY: 75 },
    altShots: [{ toX: 22, toY: 65 }, { toX: 78, toY: 65 }],
    notes: [
      'Attaque rapide centrale (Z3) — angles courts.',
      'Bloc à 1 (P3) en lecture — la rapide est la cible la plus difficile en 2F-3B.',
      'P4 latéralisé à mi-terrain (~2 m du filet) pour les déviations.',
      'Avantage : 3 défenseurs profonds (P5, P6, P1) couvrent les 3 grandes zones de fond.',
      'P6 face à l\'attaquant central dans son couloir de frappe (~7,5-8 m, axe).',
    ],
  },
  zone2: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P4', x: 18, y: 29.5, sub: 'BLK' },
      { zoneId: 'P3', x: 60, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 67 },
      { zoneId: 'P6', x: 50, y: 70 },
      { zoneId: 'P1', x: 78, y: 70 },
    ],
    zones: [
      Z('P5', 0, 40, 35, 60, 'Ligne G'),
      Z('P6', 33, 52, 34, 48, 'Axe'),
      Z('P1', 65, 43, 35, 57, 'Diag D'),
      Z('P3', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 75 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 70 }, { toX: 80, toY: 40 }],
    notes: [
      'Attaque Z2 adverse → balle arrive sur notre gauche. Miroir de Z4.',
      'Bloc à 1 : P4 contre seul côté gauche (pas de P2 en 2F-3B).',
      'P3 (central) devient off-blocker côté droit à 2-2,5 m du filet.',
      'P5 défend la ligne profonde gauche, P6 l\'axe, P1 la grande diagonale longue.',
    ],
  },
};

// Zone label colour for the 6v6 perimeter layout where labels were originally
// rendered in a neutral fallback; only "Ombre bloc" is in the libero colour.
const LIBERO_LABEL: Pick<DefenseZone, 'role' | 'labelRole'> = { role: 'L', labelRole: 'L' };

const LAYOUTS_6V6_PERIMETER: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    // Attaque adverse en Z4 (sa GAUCHE) -> balle arrive sur NOTRE coin avant-DROIT.
    // Bloc a 2 = P2 (pointu, contreur ligne) + P3 (central, ferme diagonale).
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P3', x: 72, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 70, sub: 'LIB', role: 'L' },
      { zoneId: 'P6', x: 48, y: 67 },
      { zoneId: 'P1', x: 75, y: 62.5 },
    ],
    zones: [
      { posNumber: 'P5', x: 0, y: 43, w: 50, h: 57, label: 'Grande diag.', labelPos: { x: 18, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Ombre bloc', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 62, y: 34, w: 38, h: 42, label: 'Ligne', labelPos: { x: 70, y: 40 } },
      { posNumber: 'P4', x: 0, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 4, y: 33 } },
    ],
    mainShot: { toX: 22, toY: 77.5 },
    altShots: [
      { toX: 78, toY: 47.5 },
      { toX: 45, toY: 62.5 },
      { toX: 15, toY: 40 },
    ],
    notes: [
      { label: 'Poste 2 (pointu / OPP)', text: 'Contreur ligne — bloque, monte au filet côté droit.' },
      { label: 'Poste 3 (central)', text: 'Ferme la diagonale en bloc à 2 avec le pointu.' },
      { label: 'Poste 4 (R4 off-blocker)', text: "Décroche sur la ligne des 3 m côté gauche — couvre le cut shot court (diagonale aiguë) et les feintes." },
      { label: 'Poste 5 (Libéro)', text: "Défend la grande diagonale longue, ~7-8 m du filet, dans l'épaule intérieure du central contreur." },
      { label: 'Poste 6 (arrière centre)', text: "Balles hautes passant le bloc, touches de bloc longues, axe ~8-8,5 m." },
      { label: 'Poste 1 (arrière droit)', text: "Défend la ligne profonde dans l'ombre du bloc, ~7-7,5 m du filet, 0,5 m de la ligne droite." },
    ],
  },
  zone3: {
    // Attaque rapide centrale (quick / tempo 1) : 0,3-0,5 s entre passe et frappe.
    // Bloc a 1 (central) en lecture. "Stopped on contact" — tous arretes au moment du contact.
    // Arrieres Z1 et Z5 gagnent un metre vers le filet (angles plus courts qu'en haute balle).
    ballX: 50, ballY: 19,
    players: [
      { zoneId: 'P4', x: 20, y: 47.5, sub: 'OFF' },
      { zoneId: 'P3', x: 50, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 80, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 67, sub: 'LIB', role: 'L' },
      { zoneId: 'P6', x: 50, y: 70 },
      { zoneId: 'P1', x: 78, y: 65 },
    ],
    zones: [
      { posNumber: 'P5', x: 0, y: 34, w: 36, h: 66, label: 'Diag. G', labelPos: { x: 10, y: 70 } },
      { posNumber: 'P6', x: 32, y: 52, w: 36, h: 48, label: 'Axe', labelPos: { x: 42, y: 73 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 64, y: 34, w: 36, h: 66, label: 'Diag. D', labelPos: { x: 75, y: 70 } },
      { posNumber: 'P4', x: 0, y: 25, w: 28, h: 28, label: 'Couv.', labelPos: { x: 4, y: 36 } },
      { posNumber: 'P2', x: 72, y: 25, w: 28, h: 28, label: 'Couv.', labelPos: { x: 78, y: 36 } },
    ],
    mainShot: { toX: 75, toY: 65 },
    altShots: [
      { toX: 25, toY: 65 },
      { toX: 50, toY: 80 },
    ],
    notes: [
      { label: 'Poste 3 (central)', text: "Bloc à 1 en lecture (read) ou en commitment selon le scouting adverse." },
      { label: 'Postes 4 et 2 (ailiers)', text: "Sur la ligne d'attaque (~2-2,5 m du filet, 0,5 m des lignes) : couvrent déviations de bloc et balles à travers le bloc." },
      { label: 'Poste 5 (Libéro)', text: "Face à l'attaquant central, dans son couloir de frappe (~7-8 m du filet)." },
      { label: 'Poste 6 (arrière centre)', text: "Épaules face à l'attaquant ; défend la balle puissante traversant le bloc (axe ~8-8,5 m)." },
      { label: 'Poste 1 (arrière droit)', text: "Avance d'un mètre (~7,5 m du filet, 1 m de la ligne droite) : angles plus courts sur quick." },
      { label: 'Règle clé', text: '« Stopped on contact » : tous arrêtés et équilibrés à l\'instant exact de la frappe.' },
    ],
  },
  zone2: {
    // Attaque adverse en Z2 (sa DROITE) -> balle arrive sur NOTRE coin avant-GAUCHE.
    // Miroir parfait de Z4. Bloc a 2 = P4 (R4, ligne) + P3 (central, diagonale).
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P4', x: 18, y: 29.5, sub: 'BLK' },
      { zoneId: 'P3', x: 28, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 62.5, sub: 'LIB', role: 'L' },
      { zoneId: 'P6', x: 52, y: 67 },
      { zoneId: 'P1', x: 78, y: 70 },
    ],
    zones: [
      { posNumber: 'P1', x: 50, y: 43, w: 50, h: 57, label: 'Grande diag.', labelPos: { x: 68, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Ombre bloc', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P5', x: 0, y: 34, w: 38, h: 42, label: 'Ligne', labelPos: { x: 10, y: 40 } },
      { posNumber: 'P2', x: 70, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 76, y: 33 } },
    ],
    mainShot: { toX: 78, toY: 77.5 },
    altShots: [
      { toX: 22, toY: 47.5 },
      { toX: 55, toY: 62.5 },
      { toX: 85, toY: 40 },
    ],
    notes: [
      { label: 'Poste 4 (R4)', text: 'Contreur ligne — bloque au filet côté gauche.' },
      { label: 'Poste 3 (central)', text: 'Ferme la diagonale en bloc à 2 avec le R4.' },
      { label: 'Poste 2 (pointu / OPP)', text: 'Devient off-blocker côté droit — décroche sur les 3 m, couvre cut shot court et feintes.' },
      { label: 'Poste 5 (Libéro)', text: "Défend la ligne profonde dans l'ombre du bloc, ~7-7,5 m du filet, 0,5 m de la ligne gauche." },
      { label: 'Poste 6 (arrière centre)', text: "Balles hautes par-dessus le bloc, axe ~8-8,5 m du filet." },
      { label: 'Poste 1 (passeur ou OH/OPP)', text: 'Défend la grande diagonale longue cross-court, ~7-8 m du filet.' },
    ],
  },
};

const LAYOUTS_BY_CONFIG: Record<string, Record<ZoneTab, DefenseLayout>> = {
  // 6v6 — defense doctrine is the same across all offensive configurations.
  '5-1': LAYOUTS_6V6_PERIMETER,
  '4-2': LAYOUTS_6V6_PERIMETER,
  '6-2': LAYOUTS_6V6_PERIMETER,
  // 5v5
  'pentagon': LAYOUTS_5V5_PENTAGON,
  '3F-2B': LAYOUTS_5V5_3F2B,
  '2F-3B': LAYOUTS_5V5_2F3B,
  // 4v4
  'losange': LAYOUTS_4V4_LOSANGE,
  'carre': LAYOUTS_4V4_CARRE,
  '3-1': LAYOUTS_4V4_31,
};

function DataDrivenDefense({ layout, idSuffix }: { layout: DefenseLayout; idSuffix: string }) {
  const courtLayout = defenseToCourtLayout(layout);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Court layout={courtLayout} view="full" idSuffix={idSuffix} />
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {layout.notes.map((n, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
            <span style={S.bulletOrange}>▸</span>
            {typeof n === 'string' ? (
              <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{n}</span>
            ) : (
              <span>
                <strong style={{ color: 'var(--ink)' }}>{n.label} : </strong>
                <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{n.text}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const INDICES_VISUELS = [
  { title: 'Attaquant loin du filet', action: 'AVANCE', accentColor: 'var(--orange)',
    points: ['Passe à 2–3m du filet', 'Il ne peut pas smasher fort', 'Risque élevé de feinte ou amortie', 'Avance de 1–2 mètres'] },
  { title: 'Attaquant près du filet', action: 'RECULE', accentColor: 'var(--plum)',
    points: ['Passe à moins de 1m du filet', 'Peut smasher à pleine puissance', 'Trajectoire descendante rapide', 'Recule au maximum'] },
  { title: "L'épaule de l'attaquant", action: 'Regarde son épaule qui frappe', accentColor: 'var(--teal)',
    points: ['Épaule haute et en arrière = smash puissant', 'Épaule basse = feinte probable', "Rotation d'épaule = direction de la balle", 'Ajuste-toi en 0,5s'] },
  { title: "L'élan de l'attaquant", action: "Observe sa course d'approche", accentColor: 'var(--ink)',
    points: ['Course longue et rapide = smash fort', 'Petit élan ou arrêt = feinte', "Angle d'approche = zone visée", 'Anticipe la puissance'] },
];

const COMMANDEMENTS = [
  ['Regarde le passeur', "Puis l'attaquant, pas la balle"],
  ['Même côté = Avance', 'Côté opposé = Recule'],
  ['Mauvaise passe adverse', '→ Avance de 1–2m (feinte probable)'],
  ['Jamais au milieu', 'Choisis : avancé OU reculé'],
  ['Communique TOUJOURS', '"Moi !" sur chaque balle que tu prends'],
  ['Bouge après le service', 'Position de service ≠ Position défensive'],
  ["Lis l'épaule", 'Épaule haute = smash, basse = feinte'],
  ['Position basse', 'Jambes fléchies, bras prêts'],
  ['Transitions rapides', '3 secondes max pour te replacer'],
  ['Défends ta zone', 'Chaque joueur a sa responsabilité'],
];

type MistakesSection = {
  title: string;
  intro: string;
  mistakes: [string, string][];
};

const MISTAKES_BY_SIZE: Record<TeamSize, MistakesSection> = {
  6: {
    title: 'Les dix erreurs fréquentes de positionnement défensif',
    intro: 'Typologie issue de Mike Hebert (Thinking Volleyball), John Forman (CoachingVB), USA Volleyball et du manuel FIVB Top Volley.',
    mistakes: [
      ['1. Dérive dans l\'ombre du contre', "Les défenseurs se réfugient instinctivement derrière les contreurs au lieu de se positionner autour de l'ombre du bloc — laissant ouvertes les diagonales et les trajectoires « off the block ». Hebert : « creeping into the block shadow »."],
      ['2. Lecture défaillante', "Le défenseur fixe la balle au lieu de suivre la séquence « ballon → passeur → ballon → attaquant ». Conséquence : il devine au lieu de lire, et n'est pas arrêté ni équilibré au moment du contact (« stopped and balanced at the moment of contact »)."],
      ['3. Libéro mal placé en profondeur', "Trop près du filet, il ne défend pas les smashs profonds ; trop loin, il ne couvre pas les tips. Règle : aligner son épaule extérieure sur l'épaule intérieure du contreur central, à 6-8 m du filet selon le bloc."],
      ['4. Passeur défenseur mal préparé', "Position trop basse ou mal orientée empêchant de voir ballon + terrain adverse ; départ prématuré vers la cible créant un trou en Z1 ; absence de « release call » signalant qu'il quitte la défense."],
      ['5. Fautes de chevauchement', "Les plus fréquentes : Z6 dérive devant Z3, Z5 plus à droite que Z6, et le passeur quitte trop tôt sa position pour pénétrer (faute n°1 en 5-1). À l'instant du contact du serveur, tous les pieds doivent respecter les relations front/back et gauche/droite (Règle 7.4)."],
      ['6. Transition réception → défense oubliée', "Les joueurs restent figés dans leur formation de réception en W au lieu de basculer en position de base défensive dès que le passeur adverse touche la balle. Hebert : « sluggish recovery after play on the ball »."],
      ['7. Mauvaise gestion de la zone 6', "Confusion entre « 6-up » (rotation), « 6-back » (périmétrique) et « 6-deep ». Le joueur en Z6 doit décaler latéralement selon le côté d'attaque adverse, pas rester centré. Se pencher en arrière pour digger (« leaning back ») place le poids sur les talons et tue la réactivité."],
      ['8. Défense ratée sur attaque rapide centrale', "Lecture trop tardive du central adverse ; arrières non avancés (sur quick, Z1 et Z5 doivent gagner un mètre vers le filet car les angles sont plus courts) ; « false stepping » (premier appui reculé) qui fait perdre le temps disponible."],
      ['9. Couverture des feintes orpheline', "Aucun défenseur explicitement assigné au tip ; « standing up on tips » — le défenseur est en posture basse pour le smash, puis se redresse et tend les mains sur la feinte, laissant le ballon tomber juste devant lui. Le focus doit rester sur le smash en posture basse permettant un sursaut tip."],
      ['10. Silence collectif', "Absence de calls (« tip ! », « line ! », « out ! », « mine ! ») ; contreurs qui ne communiquent pas leur orientation ligne vs diagonale ; aucun capitaine de rotation pour vérifier les chevauchements avant le service."],
    ],
  },
  5: {
    title: 'Les erreurs fréquentes en 5v5',
    intro: 'Erreurs spécifiques au format 5v5 (adaptations du doc Volleyball Canada, VolleyballXL et de la doctrine 6v6).',
    mistakes: [
      ['1. Reproduire mécaniquement le 6v6', "Couvrir 3 zones profondes avec 3 défenseurs fonctionne (config 2F-3B), mais il manque l'off-blocker qui décroche — la zone 3 m n'est pas couverte si personne n'est explicitement assigné."],
      ['2. L\'avant off-blocker reste collé au filet', "Après la frappe du contre, l'avant off-blocker doit décrocher à 2-2,5 m pour couvrir les tips. S'il reste au filet, la zone derrière le bloc est béante."],
      ['3. 2 défenseurs debout côte à côte', "En configuration 3F-2B, les 2 défenseurs profonds doivent être espacés (un côté gauche, un côté droit) et non centrés ensemble. Sinon, les lignes latérales sont à découvert."],
      ['4. Le passeur monte trop tôt (config pénétrante)', "En configuration 2F-3B avec passeur pénétrant depuis P1, il doit attendre que la balle soit défendue avant de courir à sa cible — sinon trou en Z1."],
      ['5. Confusion avant/arrière', "Avec 5 joueurs, la tentation de laisser les avants défendre leur côté en restant sur la ligne 3 m est forte — mais cela laisse le fond ouvert. Les avants montent au bloc, les arrières défendent profond."],
      ['6. Lecture défaillante', "Le déficit d'un joueur impose une lecture encore plus précoce qu'en 6v6. Séquence « ballon → passeur → ballon → attaquant » + arrêt équilibré au moment du contact."],
    ],
  },
  4: {
    title: 'Les erreurs fréquentes en 4v4',
    intro: 'Erreurs spécifiques au 4v4 indoor (intramurals universitaires, doctrine FFVb / Volleyball Canada, beach 4s).',
    mistakes: [
      ['1. Le contreur isolé sans couverture tip', "Les 3 défenseurs partent tous en profondeur, laissant la zone 3-5 m vide. Quelqu'un doit toujours être assigné au tip à 3,5-4 m du filet."],
      ['2. 2 défenseurs en ligne droite', "Côte à côte à la même profondeur → le cut shot tombe entre eux. En 4v4, les défenseurs doivent toujours être étagés (un proche, un loin) ou écartés latéralement."],
      ['3. Le passeur qui court à la passe avant que la balle soit défendue', "Transition prématurée laissant un trou en défense. Le passeur attend la confirmation que la balle est récupérée avant de partir à sa cible."],
      ['4. Absence de signal entre contreur et défenseurs', "Le contreur DOIT signaler « ligne » ou « diagonale » avant que l'attaque parte. Sans cela, les 3 défenseurs ne savent pas quoi couvrir — chacun improvise."],
      ['5. Le défenseur tip trop loin du filet', "Il recule avec les autres arrières et ne peut plus couvrir les feintes courtes. Sa position est 3,5-4 m du filet, axe — pas 7 m."],
      ['6. Blocage « au hasard » du mauvais joueur', "En 4v4, bloquer avec un joueur mal placé (loin de l'attaquant) laisse l'adversaire face à 3 défenseurs mal alignés. Le contreur doit être celui qui est en face de l'attaquant principal."],
      ['7. Lecture défaillante', "Avec ~40 m² par défenseur (vs 20 m² en 6v6), l'erreur de lecture est non-rattrapable. Anticipation = compétence n°1 en 4v4."],
    ],
  },
};

type DefenseSystem = {
  name: string;
  tag: string;
  principe: string;
  forces: string[];
  faiblesses: string[];
  indication: string;
  accent: string;
};

type DefenseSectionData = {
  title: string;
  warning: { label: string; text: string } | null;
  systems: [DefenseSystem, DefenseSystem, DefenseSystem];
  tableHeaders: [string, string, string];
  tableRows: [string, string, string, string][];
  footer: { strong: string; text: string };
};

const DEFENSE_SYSTEMS_BY_SIZE: Record<TeamSize, DefenseSectionData> = {
  6: {
    title: 'Les trois grands systèmes défensifs (FIVB / USAV)',
    warning: {
      label: '⚠ Avertissement terminologique',
      text: 'L\'expression « défense en W » souvent entendue en France est impropre. La « W-formation » désigne historiquement une formation de réception de service à 5 joueurs — pas un système défensif. La doctrine internationale (FIVB, USAV IMPACT, Liskevych, Stone) distingue trois systèmes : man-up (2-1-3), périmétrique (2-0-4) et en rotation (3-2-1).',
    },
    systems: [
      {
        name: 'Défense man-up (2-1-3)',
        tag: 'Anciennement « défense en W » / red defense',
        principe: "Un défenseur monte à hauteur des 3 m derrière le contre pour intercepter feintes et amorties. Deux contreurs au filet, l'off-blocker décroche, et trois joueurs profonds couvrent les angles longs.",
        forces: ['Couverture exceptionnelle des tips, roll shots et balles « pourries » derrière le bloc', 'Transition rapide vers l\'attaque si le joueur monté est le passeur', 'Simple à enseigner aux jeunes équipes'],
        faiblesses: ['Seulement 3 défenseurs en profondeur — vulnérable aux smashs puissants en diagonale serrée', 'Un attaquant qui frappe fort entre les contreurs traverse facilement'],
        indication: 'Équipes jeunes, scolaires, adversaires tactiques jouant beaucoup de feintes ou off-speed.',
        accent: 'var(--orange)',
      },
      {
        name: 'Défense périmétrique (2-0-4)',
        tag: 'White defense — système dominant en haut niveau masculin',
        principe: "Les quatre défenseurs arrière forment un U ouvert vers le filet, presque sur les lignes de touche et de fond — « un pied sur la ligne » (Liskevych). Le milieu du terrain est volontairement abandonné.",
        forces: ['Excellente couverture des smashs puissants, lignes et coins profonds', 'Mouvement collectif simple', 'Système prédominant en volley masculin moderne international'],
        faiblesses: ['Très vulnérable aux tips courts derrière le bloc — zone centrale entre 3 et 5 m libre', 'Demande des défenseurs athlétiques capables de plonger vers l\'avant'],
        indication: 'Sénior, masculin, niveau international, adversaires puissants.',
        accent: 'var(--teal)',
      },
      {
        name: 'Défense en rotation (3-2-1)',
        tag: 'Rotational / slide defense',
        principe: "Les trois défenseurs arrière glissent vers le côté d'attaque adverse : l'arrière opposé monte derrière le bloc (tip), le milieu glisse vers la ligne attaquée, le défenseur du côté attaqué se met en angle court.",
        forces: ['Excellente couverture de la ligne profonde ET du tip simultanément', 'Système très adaptable', 'Transition setter rapide quand le passeur est en P1'],
        faiblesses: ['Un défenseur en moins en profondeur (un joueur dédié au tip)', 'Coin diagonal opposé vulnérable', 'Forte capacité de lecture et coordination requise'],
        indication: 'Adversaires qui mêlent puissance et lignes/tips ; niveau intermédiaire à élite.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['Man-up 2-1-3', 'Périm. 2-0-4', 'Rotation 3-2-1'],
    tableRows: [
      ['Joueur monté derrière bloc', 'Oui', 'Non', 'Oui'],
      ['Défenseurs profonds', '3', '4', '2'],
      ['Couverture tip', '★★★', '★', '★★'],
      ['Couverture smash puissant', '★★', '★★★', '★★'],
      ['Couverture ligne profonde', '★★', '★★', '★★★'],
      ['Couverture diagonale serrée', '★', '★★★', '★★'],
      ['Position type du libéro', 'Z5 ou Z6', 'Z5 (sur ligne)', 'Z5 glisse'],
      ['Complexité', 'Faible', 'Moyenne', 'Élevée'],
    ],
    footer: {
      strong: 'Le choix n\'est pas une question d\'orthodoxie : ',
      text: 'il dépend du profil offensif adverse et des qualités de vos défenseurs. La défense moderne se définit moins par la formation que par la lecture — séquence visuelle « ballon → passeur → ballon → attaquant » et arrêt équilibré à l\'instant du contact.',
    },
  },
  5: {
    title: 'Les trois systèmes défensifs en 5v5',
    warning: {
      label: '⚠ Format non officiel FIVB',
      text: 'Le 5v5 indoor n\'a pas de règlement FIVB ou FFVb dédié. Ces trois systèmes sont des adaptations logiques du 6v6 documentées par VolleyballXL, The Art of Coaching Volleyball et Volleyball Canada. Il n\'existe pas de manuel technique 5v5 officiel — choisissez le système selon la configuration de votre équipe (2-3 ou 3-2).',
    },
    systems: [
      {
        name: 'Système 1-1-3',
        tag: '1 contreur + 1 couvreur tip + 3 défenseurs profonds',
        principe: "Adapté à la configuration 2F-3B (2 avants, 3 arrières). Le contreur saute seul ; le 2ᵉ avant décroche en off-blocker à 2-3 m du filet pour les tips ; 3 défenseurs profonds couvrent ligne, axe et grande diagonale.",
        forces: ['3 défenseurs profonds comme en 6v6 périmétrique — bonne couverture des smashs', 'Configuration la plus proche du 5-1 6v6 (préparation à la transition vers 6v6)', 'Tip couvert par l\'off-blocker'],
        faiblesses: ['Bloc à 1 seulement → fragile face aux gros frappeurs', 'L\'off-blocker à 2-3 m doit être très réactif'],
        indication: 'Configuration 2F-3B (passeur pénétrant), adversaires moyennement puissants. Système recommandé pour la pédagogie de transition vers le 6v6.',
        accent: 'var(--teal)',
      },
      {
        name: 'Système 2-1-2',
        tag: '2 contreurs + 1 tip + 2 défenseurs profonds',
        principe: "Adapté à la configuration 3F-2B (3 avants, 2 arrières). Bloc à 2 au filet, l'avant centre couvre le tip à 2-3 m du filet, 2 défenseurs profonds prennent grande diagonale et ligne.",
        forces: ['Bloc à 2 comme en 6v6 — nettement plus efficace contre les smashs puissants', '3 attaquants au filet pour la contre-attaque'],
        faiblesses: ['Seulement 2 défenseurs profonds → 9 m de fond très difficile à couvrir', 'Forte exigence athlétique sur les 2 arrières'],
        indication: 'Configuration 3F-2B contre équipes très puissantes. Privilégier en fin de set quand chaque point compte.',
        accent: 'var(--orange)',
      },
      {
        name: 'Système 1-2-2',
        tag: 'Man-up adapté (équivalent du 2-1-3 6v6)',
        principe: "Contreur solo + 2 couvreurs zone avant (tip + arrière-bloc) + 2 défenseurs profonds. Adapté quand l'adversaire feinte beaucoup ou en équipes débutantes.",
        forces: ['Excellente couverture des feintes courtes (2 couvreurs zone avant)', 'Tip difficile à exploiter par l\'adversaire'],
        faiblesses: ['Seulement 2 défenseurs profonds → smashs puissants difficiles', 'Demande coordination entre les 2 couvreurs zone avant'],
        indication: 'Adversaires qui feintent beaucoup ; volley féminin, jeunes catégories, équipes techniques.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['1-1-3', '2-1-2', '1-2-2 (man-up)'],
    tableRows: [
      ['Contreurs', '1', '2', '1'],
      ['Couvreurs zone avant', '1 (off-blocker)', '1 (tip)', '2 (tip + arrière-bloc)'],
      ['Défenseurs profonds', '3', '2', '2'],
      ['Couverture tip', '★★', '★★', '★★★'],
      ['Couverture smash puissant', '★★', '★★★', '★★'],
      ['Couverture fond', '★★★', '★★', '★★'],
      ['Configuration adaptée', '2F-3B', '3F-2B', '2F-3B / 3F-2B'],
      ['Complexité', 'Faible', 'Moyenne', 'Élevée'],
    ],
    footer: {
      strong: 'Recommandation 5v5 : ',
      text: 'le système 1-1-3 en configuration 2F-3B avec passeur pénétrant est la défense la plus proche du 6v6 — idéale comme transition pédagogique. Le 2-1-2 ne se justifie que contre des frappeurs vraiment puissants.',
    },
  },
  4: {
    title: 'Les trois systèmes défensifs en 4v4',
    warning: {
      label: '⚠ Format non officiel FIVB',
      text: 'Le 4v4 indoor n\'a pas de règlement FIVB officiel. Ces trois systèmes proviennent de la pratique intramurals universitaires (USA), des manuels de transition pédagogique FFVb / Volleyball Canada et de la littérature beach (Brandon Joyner, Better at Beach). Avec 4 joueurs, chaque défenseur couvre ~30-40 m² (vs 20 m² en 6v6) — l\'anticipation est la compétence n°1.',
    },
    systems: [
      {
        name: 'Système A : 1 contreur + 3 défenseurs',
        tag: 'Le plus répandu en 4v4 indoor',
        principe: "Un seul joueur monte au contre face à l'attaquant principal. Les 3 autres se répartissent : défenseur tip (3-4 m du filet, axe), défenseur cross (7-7,5 m, ligne droite, diagonale longue), défenseur ligne (7-7,5 m, dans l'ombre du contre).",
        forces: ['Couvre tip, ligne et grande diagonale simultanément', 'Le plus équilibré en 4v4', 'Signal contreur ligne/diagonale très efficace'],
        faiblesses: ['Bloc à 1 — vulnérable aux gros frappeurs', 'Demande un défenseur tip discipliné qui ne recule pas'],
        indication: 'Adversaires de niveau équivalent ou modéré. Configuration la plus polyvalente en 4v4 (formation diamant ou ligne 3-1).',
        accent: 'var(--orange)',
      },
      {
        name: 'Système B : 2 contreurs + 2 défenseurs',
        tag: 'Bloc à 2 (rare en 4v4)',
        principe: "Les 2 avants montent ensemble face à l'attaquant principal. Les 2 arrières se positionnent : un côté ligne (7 m, 1 m de la ligne), un en axe légèrement décalé vers la diagonale. Le tip n'est pas couvert.",
        forces: ['Bloc à 2 nettement plus efficace contre smashs puissants', 'Pression maximale sur l\'attaquant adverse'],
        faiblesses: ['Seulement 2 défenseurs au sol → impossible de tout couvrir', 'Tip derrière le bloc complètement à découvert', 'Impose un choix : ligne OU diagonale, pas les deux'],
        indication: 'À n\'utiliser que contre des attaquants très puissants sans finesse (pas de feinte). Configuration box 2-2 ou ligne 3-1.',
        accent: 'var(--plum)',
      },
      {
        name: 'Système C : 0 contreur',
        tag: 'Défense basse (adversaires non-smasheurs)',
        principe: "Aucun joueur ne monte au contre. Les 4 joueurs défendent en profondeur : 2 à mi-terrain (3-4 m) pour les feintes, 2 en fond (7-8 m) pour les balles plus profondes. Le passeur fait office de 4ᵉ défenseur.",
        forces: ['Couvre toute la profondeur du terrain', 'Bien adapté aux échanges lents'],
        faiblesses: ['CONTRE-PRODUCTIF dès qu\'un adversaire frappe sérieusement (le smash passe sans obstacle)', 'Aucune pression au filet'],
        indication: 'Niveaux scolaires, loisir débutant, adversaires qui ne spikent pas. À éviter dès que l\'opposition gagne en puissance.',
        accent: 'var(--teal)',
      },
    ],
    tableHeaders: ['Système A', 'Système B', 'Système C'],
    tableRows: [
      ['Contreurs', '1', '2', '0'],
      ['Défenseurs profonds', '3', '2', '4'],
      ['Couverture tip', '★★', '★', '★★★'],
      ['Couverture smash puissant', '★★', '★★★', '★ (∅ bloc)'],
      ['Couverture ligne profonde', '★★', '★★', '★★'],
      ['Couverture grande diagonale', '★★★', '★★', '★★'],
      ['Adversaires recommandés', 'Tous niveaux', 'Très puissants', 'Non-smasheurs'],
      ['Complexité', 'Faible', 'Moyenne', 'Faible'],
    ],
    footer: {
      strong: 'Recommandation 4v4 : ',
      text: 'le système A (1 contreur + 3 défenseurs) est le défaut quasi universel. Le système B se justifie uniquement face à des frappeurs vraiment puissants en fin de set. Le système C ne fonctionne qu\'au niveau loisir débutant — dès qu\'un adversaire smashe, retour au système A.',
    },
  },
};

const EXERCICES = [
  { title: 'Lecture de situation', level: 'Débutant', duration: '10 min', materiel: '1 coach ou partenaire avec balles',
    objectif: "Apprendre à identifier rapidement la zone d'attaque",
    steps: ["Le coach se place de l'autre côté du filet en zone 4, 3 ou 2", 'Tu pars du centre du terrain', 'Le coach annonce la zone et lance la balle', 'Tu dois te placer dans ta zone défensive en 2–3 secondes', 'Répète 20 fois en variant les zones'] },
  { title: 'Avancer/Reculer selon la passe', level: 'Intermédiaire', duration: '15 min', materiel: '1 passeur, 1 attaquant, plusieurs défenseurs',
    objectif: 'Ajuster ta position selon la qualité de la passe',
    steps: ["Le passeur fait des passes de qualité variable à l'attaquant", 'Passe proche du filet → Tu recules (smash puissant attendu)', 'Passe loin du filet → Tu avances (feinte probable)', "L'attaquant frappe et tu défends", 'Le coach corrige ta position après chaque balle'] },
  { title: 'Communication défensive', level: 'Tous niveaux', duration: '10 min', materiel: 'Équipe complète',
    objectif: 'Développer la communication automatique',
    steps: ['Match dans votre format (4v4, 5v5 ou 6v6) mais en CRIANT tous les appels', 'Pénalité : -1 point si un joueur ne crie pas "Moi !" sur sa balle', "Bonus : +1 point si toute l'équipe communique sur un échange", "Chaque joueur doit annoncer la zone d'attaque adverse"] },
  { title: 'Défense contre feintes', level: 'Intermédiaire', duration: '15 min', materiel: '1 attaquant, 3 défenseurs arrière',
    objectif: 'Améliorer la défense des balles courtes',
    steps: ["L'attaquant ne fait QUE des feintes et amorties", 'Les défenseurs doivent tous avancer (3–4m)', 'Objectif : récupérer 8 balles sur 10', "Puis alterner : 5 feintes, 5 smashes pour travailler l'adaptation"] },
  { title: 'Transitions rapides', level: 'Avancé', duration: '20 min', materiel: 'Équipe complète',
    objectif: 'Maîtriser les changements attaque-défense',
    steps: ['Jeu normal mais le coach chronomètre les transitions', 'Objectif : être en position défensive en moins de 3 secondes', "Si trop lent, l'équipe fait 5 pompes et recommence", 'Augmente progressivement le rythme des échanges'] },
  { title: "Lire l'attaquant", level: 'Avancé', duration: '15 min', materiel: '1 attaquant, défenseurs',
    objectif: 'Anticiper selon le langage corporel',
    steps: ["L'attaquant alterne smash, feinte, pointe sans prévenir", `Avant qu'il frappe, le défenseur crie sa prédiction : "Smash !" ou "Feinte !"`, 'Point si la prédiction est correcte ET la balle défendue', 'Focus sur : épaule, élan, position par rapport au filet'] },
];

type GuidePositionnementProps = {
  teamSize?: TeamSize;
  configId?: string;
};

export default function GuidePositionnement({ teamSize: teamSizeProp, configId: configIdProp }: GuidePositionnementProps = {}) {
  const teamSize: TeamSize = teamSizeProp ?? 6;
  const configurations = CONFIGURATIONS[teamSize];

  // Config is fully URL-driven via the parent route. Fallback to the first
  // configuration when not provided (e.g. the deprecated /:size route).
  const configId = configIdProp && configurations.some(c => c.id === configIdProp)
    ? configIdProp
    : configurations[0].id;

  const [zone, setZone] = useState<ZoneTab>('zone4');

  const configuration = configurations.find(c => c.id === configId) ?? configurations[0];

  const renderZoneTab = () => {
    const layouts = LAYOUTS_BY_CONFIG[configuration.id];
    if (!layouts) {
      return <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>Diagramme non disponible pour cette configuration.</div>;
    }
    return <DataDrivenDefense layout={layouts[zone]} idSuffix={`${configuration.id}-${zone}`} />;
  };

  const btnBase: React.CSSProperties = {
    padding: '6px 16px',
    fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em',
    border: '2.5px solid var(--ink)',
    background: 'var(--cream)', color: 'var(--ink)',
    cursor: 'pointer',
  };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--orange)', color: '#fff', boxShadow: 'var(--shadow-sm)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* TOP — Format & config selectors */}
      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={S.label}>Configuration de votre équipe</div>
        <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
          Choisissez votre format et votre configuration tactique : <strong>tout le contenu du guide</strong> (postes, zones, défense par attaque) s'adaptera.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Format de jeu</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TEAM_SIZES.map(slug => {
              const isActive = SLUG_TO_SIZE[slug] === teamSize;
              return (
                <Link
                  key={slug}
                  to={`/guides/positionnement-defense/${slug}`}
                  style={{ ...(isActive ? btnActive : btnBase), textDecoration: 'none' }}
                >
                  {slug}
                </Link>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Configuration tactique</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {configurations.map(c => (
              <Link
                key={c.id}
                to={`/guides/positionnement-defense/${SIZE_TO_SLUG[teamSize]}/${c.id}`}
                style={{ ...(configId === c.id ? btnActive : btnBase), textDecoration: 'none' }}
              >
                {c.shortName}
              </Link>
            ))}
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginTop: 4 }}>{configuration.name}</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{configuration.description}</p>
        </div>
      </section>

      {/* Principe de base */}
      <div style={S.card}>
        <div style={S.label}>Principe de base de la défense</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0' }}>Le positionnement défensif dépend de 3 facteurs principaux :</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Votre poste (avant ou arrière)', "La zone d'attaque adverse (zone 4, 3, 2)", "Le type d'attaque (smash puissant, feinte, pointe)"].map((pt, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={S.bullet}>▸</span>
              <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Postes et zones */}
      <section>
        <h2 style={S.section}>1. Postes et zones — {configuration.shortName} ({teamSize}v{teamSize})</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            Disposition de votre équipe en {configuration.name}
          </div>
          <Court
            view="our-side"
            show3mLine
            withShadow={false}
            idSuffix={`guide-postes-${configuration.id}`}
            layout={{
              players: configuration.positions
                .filter(p => p.zoneId !== 'L')
                .map(p => ({
                  id: p.zoneId,
                  x: p.court.x,
                  y: p.court.y,
                  label: p.zoneId,
                  role: p.zoneId,
                  caption: p.name,
                })),
            }}
          />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link
              to={`/positions/${SIZE_TO_SLUG[teamSize]}/${configuration.id}`}
              style={{
                display: 'inline-block', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em',
                color: 'var(--orange)', border: '2.5px solid var(--orange)', padding: '6px 16px',
                textDecoration: 'none',
              }}
            >
              Voir le détail de chaque poste sur /positions →
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--ink)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Règle importante : </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>
            {teamSize === 6 && 'Les joueurs arrière (5, 6, 1) ne peuvent PAS bloquer au filet. Ils défendent en fond de terrain.'}
            {teamSize === 5 && 'Avec 5 joueurs, chaque défenseur couvre ~30 m² (vs 20 m² en 6v6). La lecture devient critique.'}
            {teamSize === 4 && "Pas de libéro. Chaque joueur défend ~30-40 m². L'anticipation est la compétence n°1."}
          </span>
        </div>
      </section>

      {/* 2. Positionnement par zone */}
      <section>
        <h2 style={S.section}>2. Positionnement selon la zone d'attaque adverse</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button key={z} onClick={() => setZone(z)} style={zone === z ? btnActive : btnBase}>
              {z === 'zone4' ? 'Attaque Zone 4' : z === 'zone3' ? 'Attaque Zone 3' : 'Attaque Zone 2'}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {teamSize}v{teamSize} · {configuration.shortName} — {
              zone === 'zone4' ? 'Défense contre attaque en Zone 4 (aile gauche adverse)' :
              zone === 'zone3' ? 'Défense contre attaque en Zone 3 (centre)' :
              'Défense contre attaque en Zone 2 (aile droite adverse)'
            }
          </div>
          {renderZoneTab()}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <span><span style={{ color: 'var(--orange)' }}>■</span> <span style={{ color: 'var(--ink)', opacity: 0.6 }}>Zone de responsabilité</span></span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>BLK</strong> = au bloc</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>OFF</strong> = off-blocker</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>DÉF</strong> = défense</span>
        </div>
      </section>

      {/* 3. Principes généraux */}
      <section>
        <h2 style={S.section}>3. Principes généraux de positionnement</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={S.labelTeal}>Zones de responsabilité</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          {[
            { title: 'Joueurs avant',
              points: ['Priorité : Bloquer au filet', 'Si pas au bloc : défendre la ligne opposée', 'Distance : au filet ou fond de terrain'] },
            { title: teamSize === 4 ? 'Arrière unique (P1)' : 'Pivot défensif (Libéro / P6)',
              points: teamSize === 4
                ? ['Position : centre, ~40 m² à couvrir', 'Distance : 5–6m du filet', 'Rôle : pilier défensif unique, anticipation maximale']
                : ['Position : centre, adaptable', 'Distance : 5–6m du filet', 'Rôle : pilier de la défense, couvre le centre'] },
            { title: 'Arrières latéraux',
              points: ['Rôle variable : avancent ou reculent', 'Côté attaqué : avancent (3–4m)', 'Côté opposé : reculent (6–7m)'] },
          ].map((card, i) => (
            <div key={i} style={S.card}>
              <div style={S.label}>{card.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {card.points.map((pt, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Principes universels 4/5/6 — Hebert, Liskevych, Volleyball Canada */}
        <div style={{ ...S.card, border: '2.5px solid var(--teal)' }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'var(--teal)', marginBottom: 8 }}>
            ★ Principes défensifs universels (4v4 / 5v5 / 6v6)
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px 0', lineHeight: 1.5 }}>
            Ces principes issus de Hebert, Liskevych et Volleyball Canada s'appliquent quel que soit le nombre de joueurs sur le terrain.
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Le contre est la fondation', 'Les défenseurs arrière se positionnent en fonction de l\'ombre et de l\'orientation du bloc — pas de façon indépendante.'],
              ['Arrêté et équilibré au moment du contact', 'Tout défenseur qui bouge encore quand l\'attaquant frappe voit sa réactivité s\'effondrer (« stopped on contact »).'],
              ['Lecture visuelle séquentielle', '« Ballon → passeur adverse → ballon → attaquant adverse ». En 4v4 et 5v5, le déficit de joueurs impose une lecture encore plus précoce.'],
              ['Communication des signaux', 'Même en loisir, le contreur doit signaler « ligne » ou « diagonale » — sans cela, les défenseurs arrière ne savent pas quoi couvrir.'],
              ['Zone avant couverte', 'Quelqu\'un doit couvrir les 3-5 m derrière le bloc — c\'est la zone la plus négligée en formats réduits (4v4 / 5v5).'],
              ['Transition rapide', 'Le passeur ne doit jamais partir à sa cible avant d\'avoir confirmé que la balle est défendue (« release call »).'],
            ].map(([title, text], i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13 }}>
                <span style={{ background: 'var(--teal)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 11, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{title} : </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Lire l'attaquant */}
      <section>
        <h2 style={S.section}>4. Lire l'attaquant : les indices visuels</h2>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Ton positionnement doit s'ajuster en fonction de ce que tu vois. Voici les indices clés :
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          {INDICES_VISUELS.map((card, i) => (
            <div key={i} style={{ ...S.card, borderLeft: `5px solid ${card.accentColor}` }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: card.accentColor, marginBottom: 4 }}>{card.title}</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', marginBottom: 10, letterSpacing: '0.08em' }}>{card.action}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {card.points.map((pt, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                    <span style={{ ...S.bulletOrange, color: card.accentColor }}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Astuce pro : </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>Dans les 2 premières secondes après le service adverse, concentre ton regard sur le passeur, puis IMMÉDIATEMENT sur l'attaquant qui va frapper.</span>
        </div>
      </section>

      {/* 5. Quand avancer / reculer */}
      <section>
        <h2 style={S.section}>5. Quand s'avancer ou reculer ?</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, marginBottom: 14 }}>Arbre de décision rapide</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderLeft: '4px solid var(--orange)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--orange)', letterSpacing: '0.08em' }}>S'avancer (3–4m du filet) quand :</div>
              {[
                "Vous êtes du même côté que l'attaquant",
                "L'attaquant est loin du filet (mauvaise passe)",
                'Vous anticipez une feinte ou amortie',
                'Le bloc est solide — moins de balles puissantes passent',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={S.bulletOrange}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '4px solid var(--ink)', paddingLeft: 16, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.08em' }}>Reculer (6–7m du filet) quand :</div>
              {[
                "Vous êtes du côté opposé à l'attaquant",
                "L'attaquant a une bonne passe près du filet",
                "L'attaquant est puissant ou grand",
                'Le bloc est faible (1 seul bloqueur)',
                'Vous défendez la diagonale (trajectoire la plus longue)',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--ink)', opacity: 0.5, marginTop: 2 }}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Erreurs courantes (conditionnel par teamSize) */}
      <section>
        {(() => {
          const data = MISTAKES_BY_SIZE[teamSize];
          return (
            <>
              <h2 style={S.section}>6. {data.title}</h2>
              <div style={{ ...S.card, marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{data.intro}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.mistakes.map(([label, text], i) => (
                  <div key={i} style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 16, paddingTop: 6, paddingBottom: 6, fontSize: 13 }}>
                    <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
                    <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </section>

      {/* 7. Positionnement au service */}
      <section>
        <h2 style={S.section}>7. Positionnement au service</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            <strong>Ton placement au service est DIFFÉRENT de ta position défensive. </strong>
            Dès que le service part, tu dois te repositionner.
          </p>
        </div>
        <div style={S.card}>
          <div style={{ ...S.labelTeal, marginBottom: 12 }}>Transition service → défense</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Ton équipe sert', 'Tu es en position de rotation'],
              ['Le serveur frappe', 'Tu regardes le passeur adverse'],
              ['Le passeur touche la balle', 'Tu te déplaces vers ta zone défensive'],
              ["L'attaquant saute", 'Tu es en position finale, prêt à réagir'],
            ].map(([step, detail], i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13 }}>
                <span style={S.stepBadge}>{i + 1}</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{step} : </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Communication */}
      <section>
        <h2 style={S.section}>8. Communication défensive</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>Une défense silencieuse est une défense inefficace.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { moment: "Avant l'attaque adverse", calls: [['"Numéro 4 !"', "Annonce la zone d'où vient l'attaque"], ['"Deux au bloc !"', 'Indique combien de bloqueurs'], ['"Ligne libre !"', 'Si le bloc ne couvre pas la ligne'], [`"J'avance !" / "Je recule !"`, 'Annonce ton mouvement']] },
            { moment: "Pendant l'action", calls: [[`"Moi !" / "J'ai !"`, 'Tu prends la balle (le PLUS important)'], ['"Toi !" / "À toi !"', 'Tu laisses la balle à un coéquipier'], ['"Dehors !"', 'La balle va sortir, ne la touche pas'], ['"Bloquée !"', 'Si tu bloques, annonce-le']] },
            { moment: "Après l'action", calls: [['"Couvrez !"', "Demande la couverture d'attaque"], ['"Libre !"', 'Balle libre, replacez-vous'], ['"On reste !"', 'On garde la défense en place']] },
          ].map((group, i) => (
            <div key={i} style={S.card}>
              <div style={S.label}>{group.moment}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {group.calls.map(([call, desc], j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{call} </strong>
                      <span style={{ color: 'var(--ink)', opacity: 0.4 }}>—</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.75 }}> {desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Règle d'or : </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>En cas de doute entre deux joueurs, c'est TOUJOURS le joueur le plus avancé qui prend la balle.</span>
        </div>
      </section>

      {/* 9. Systèmes défensifs (conditionnel par teamSize) */}
      <section>
        {(() => {
          const data = DEFENSE_SYSTEMS_BY_SIZE[teamSize];
          const tableAccents = ['var(--orange)', 'var(--teal)', 'var(--plum)'];
          return (
            <>
              <h2 style={S.section}>9. {data.title}</h2>

              {data.warning && (
                <div style={{ ...S.alert, marginBottom: 14 }}>
                  <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'var(--ink)', marginBottom: 6 }}>{data.warning.label}</div>
                  <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>{data.warning.text}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                {data.systems.map((sys, i) => (
                  <div key={i} style={{ ...S.card, borderLeft: `5px solid ${sys.accent}` }}>
                    <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: sys.accent, marginBottom: 4 }}>{sys.name}</div>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.55, marginBottom: 8 }}>{sys.tag}</div>
                    <p style={{ fontSize: 12, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0', lineHeight: 1.5 }}>{sys.principe}</p>
                    <div style={S.labelTeal}>Forces</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.forces.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={S.bullet}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.55 }}>Faiblesses</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.faiblesses.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sys.accent, marginTop: 6 }}>
                      Indication : <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{sys.indication}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tableau comparatif */}
              <div style={{ ...S.card, marginTop: 14, overflowX: 'auto' }}>
                <div style={{ ...S.label, marginBottom: 10 }}>Tableau comparatif synthétique</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.6 }}>Critère</th>
                      {data.tableHeaders.map((h, i) => (
                        <th key={i} style={{ textAlign: 'center', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: tableAccents[i] }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.tableRows.map(([crit, a, b, c], i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(26,24,18,0.1)' }}>
                        <td style={{ padding: '5px 8px', color: 'var(--ink)', opacity: 0.85 }}>{crit}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--ink)', opacity: 0.75 }}>{a}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--ink)', opacity: 0.75 }}>{b}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--ink)', opacity: 0.75 }}>{c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
                <strong style={{ color: 'var(--ink)' }}>{data.footer.strong}</strong>
                <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{data.footer.text}</span>
              </div>
            </>
          );
        })()}
      </section>

      {/* 10. Transitions */}
      <section>
        <h2 style={S.section}>10. Transitions attaque ↔ défense</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Le volleyball est un jeu de transitions rapides. Tu passes constamment de l'attaque à la défense et vice-versa.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Transition attaque → défense', items: [['Ton coéquipier attaque', 'Prépare-toi mentalement à défendre'], ['La balle est renvoyée', 'Identifie immédiatement qui va attaquer'], ['Course rapide', 'Va vers ta zone défensive (2–3 secondes max)'], ['Position basse', 'Fléchis les jambes, prêt à plonger']] },
            { label: 'Transition défense → attaque', items: [['Tu défends la balle', 'Passe précise vers le passeur'], ['Si tu es AVANT', 'Cours au filet pour attaquer ou bloquer'], ['Si tu es ARRIÈRE', "Recule légèrement, prêt à couvrir l'attaque"], ["Couverture d'attaque", 'Entoure ton attaquant (en demi-cercle à 2–3m)']] },
          ].map((group, gi) => (
            <div key={gi} style={S.card}>
              <div style={S.label}>{group.label}</div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map(([step, detail], i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13 }}>
                    <span style={S.stepBadge}>{i + 1}</span>
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{step} : </strong>
                      <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Exercices */}
      <section>
        <h2 style={S.section}>11. Exercices pour progresser</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{i + 1}. {ex.title}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 8px', border: '1.5px solid var(--ink)', color: 'var(--ink)', background: 'var(--cream)', flexShrink: 0 }}>{ex.level}</span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, marginBottom: 6 }}>
                Durée : {ex.duration} · Matériel : {ex.materiel}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 8 }}>
                Objectif : <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{ex.objectif}</span>
              </div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ex.steps.map((step, j) => (
                  <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13 }}>
                    <span style={{ color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11, flexShrink: 0, width: 16, textAlign: 'right', marginTop: 2 }}>{j + 1}.</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Récapitulatif */}
      <section>
        <h2 style={S.section}>12. Les 10 commandements du défenseur</h2>
        <div style={S.card}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, marginBottom: 16 }}>
            {COMMANDEMENTS.map(([title, sub], i) => (
              <div key={i} style={{ border: '1.5px solid var(--ink)', padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 12, flexShrink: 0, width: 20 }}>{i + 1}.</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{title}</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ border: '2.5px solid var(--orange)', background: 'var(--yellow)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Même côté que l'attaquant</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--orange)', marginBottom: 4 }}>→ AVANCER (3–4m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Défendre feintes et amorties</div>
            </div>
            <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Côté opposé à l'attaquant</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>→ RECULER (6–7m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Défendre diagonales longues</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>Conclusion</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            Le positionnement défensif s'apprend avec la pratique et l'expérience. Ne te décourage pas si tu fais
            des erreurs au début — même les professionnels ajustent constamment leur placement.
          </p>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: 0 }}>
            La clé : applique la règle de base (même côté = avance, opposé = recule), observe l'attaquant,
            communique avec tes coéquipiers, et n'aie jamais peur de plonger pour une balle.
          </p>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, color: 'var(--ink)', margin: 0, letterSpacing: '0.06em' }}>La défense gagne les matchs.</p>
        </div>
      </section>

    </div>
  );
}
