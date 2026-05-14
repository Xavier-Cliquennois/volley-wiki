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
  role?: RoleColorKey;
  label?: string;
};

type DefenseZone = {
  x: number; y: number; w: number; h: number;
  posNumber: ZoneId;
  label: string;
  role?: RoleColorKey;
  labelRole?: RoleColorKey;
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
      Z('P1', 65, 40, 35, 60, 'Z1 short'),
      Z('P5', 0, 43, 50, 57, 'Long cross'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Opposing Z4 attack (their left wing) → ball arrives on our right side.',
      '2-1-2 system: 2-player block (P2 opposite line + P3 cross-court) + 2 deep defenders.',
      'P4 (outside hitter) as off-blocker, 2-2.5 m from net, 1 m from sideline — covers tip and cut shot.',
      'P5 (~7-7.5 m, 0.5 m from left line) defends the long cross-court.',
      'P1 (~7-7.5 m, 0.5 m from right line) defends the deep line, in the block shadow.',
      'Primary shot defended: long cross-court (statistically the most frequent trajectory).',
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
      Z('P5', 0, 40, 50, 60, 'Cross L'),
      Z('P1', 50, 40, 50, 60, 'Cross R'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 82 }],
    notes: [
      'Central quick attack (Z3) — short angles, little reaction time.',
      '1-player block: P3 (middle blocker) reading, commitment not possible.',
      'P4 and P2 (off-blockers) 2 m from net on the attack line — cover deflections.',
      'P5 and P1 1 m forward (~7 m from net) — angles are shorter than on high balls.',
      'Weakness: no dedicated deep central defender (only 2 back players in 5v5).',
      'Key rule: "stopped on contact" — everyone stopped and balanced at the instant of contact.',
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
      Z('P5', 0, 40, 35, 60, 'Z5 short'),
      Z('P1', 50, 43, 50, 57, 'Long cross'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Opposing Z2 attack (their right wing) → ball arrives on our left. Perfect mirror of Z4.',
      '2-player block: P4 (outside line) + P3 (middle cross-court).',
      'P2 (opposite / setter) as off-blocker, 2-2.5 m from net on the right side.',
      'P1 (~7-7.5 m, 1 m from right line) defends the long cross-court.',
      'P5 (~7-7.5 m, 0.5 m from left line) defends the deep line in the block shadow.',
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
      Z('P1', 65, 40, 35, 60, 'Z1 short'),
      Z('P5', 0, 43, 50, 57, 'Long cross'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 35, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Opposing Z4 attack → ball arrives on our right side.',
      '3F-2B setup: 3 front-row → favourable 2-player block (P3 + P2 setter-blocker).',
      'P4 (outside hitter) short off-blocker on the left side at the attack line (~2-2.5 m from net).',
      'P5 defends the long cross-court (~7 m, 0.5 m from left line).',
      'P1 defends the deep right line in the block shadow (~7 m, 0.5 m from right line).',
      'Drawback: only 2 back defenders → 30+ sqm per defender (vs 20 sqm in 6v6).',
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
      Z('P5', 0, 40, 50, 60, 'Cross L'),
      Z('P1', 50, 40, 50, 60, 'Cross R'),
    ],
    mainShot: { toX: 50, toY: 82 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 75, toY: 70 }],
    notes: [
      'Central quick attack (Z3) — short angles.',
      'With 3 front-row, a 3-player block is possible but leaves only 2 floor defenders — not recommended.',
      'Recommended: 2-player block (P3 + the wing closest to the hitting lane).',
      'P5 and P1 1 m forward (~7 m) because angles are shorter on quicks.',
      'Weakness: deep axial ball uncovered (no Z6 defender in 5v5 3F-2B).',
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
      Z('P5', 0, 43, 35, 57, 'Z5 short'),
      Z('P1', 50, 43, 50, 57, 'Long cross'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Opposing Z2 attack → ball arrives on our left side. Perfect mirror of Z4.',
      '2-player block: P4 (outside line) + P3 (middle cross-court).',
      'The setter (P2) as off-blocker, 2-2.5 m from net on the right side (anti-tip + fast transition to target).',
      'P1 defends the long cross-court (~7-7.5 m).',
      'P5 defends the deep left line in the block shadow.',
    ],
  },
};

const LAYOUTS_4V4_LOSANGE: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P3', x: 78, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 55, sub: 'OFF' },
      { zoneId: 'P4', x: 20, y: 47.5, sub: 'DEF' },
      { zoneId: 'P1', x: 50, y: 73 },
    ],
    zones: [
      Z('P2', 65, 34, 35, 66, 'Short line'),
      Z('P4', 0, 25, 35, 45, 'Cross L'),
      Z('P1', 25, 62.5, 45, 37.5, 'Deep'),
    ],
    mainShot: { toX: 20, toY: 55 },
    altShots: [{ toX: 82, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 70, toY: 47.5 }],
    notes: [
      'Opposing Z4 attack → ball arrives on our right side.',
      'Diamond formation (1-2-1) → A system: 1 blocker (P3) + 3 defenders.',
      'P3 goes up for a solo block on the right side (facing the opposing hitter).',
      'P2 (front right) drops back to the 3 m line, 3.5-4 m from the net — covers tips and feints behind the block.',
      'P4 (front left) drops to mid-court on the left — covers the short cross-court.',
      'P1 (lone back defender) covers the long cross-court (~7-7.5 m, 1 m from right line).',
      'Anticipation = skill #1: only 1 back defender → ~40 sqm to cover.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 19,
    players: [
      { zoneId: 'P3', x: 50, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 47.5, sub: 'DEF' },
      { zoneId: 'P2', x: 80, y: 47.5, sub: 'DEF' },
      { zoneId: 'P1', x: 50, y: 73 },
    ],
    zones: [
      Z('P4', 0, 32.5, 35, 52.5, 'Cross L'),
      Z('P2', 65, 32.5, 35, 52.5, 'Cross R'),
      Z('P1', 30, 62.5, 45, 37.5, 'Deep'),
    ],
    mainShot: { toX: 50, toY: 77.5 },
    altShots: [{ toX: 18, toY: 55 }, { toX: 80, toY: 55 }],
    notes: [
      'Central quick attack (Z3) — hardest setup in 4v4: little time, only 1 blocker.',
      '1-player block (P3 solo) in constant READ mode (no commitment possible).',
      'P4 and P2 drop back to mid-court (~3.5-4 m from net, cover both short cross-courts).',
      'The lone back defender P1 acts as a Z6 defender (central axis, 7-8 m from net).',
      'Primary shot: powerful axial ball (toward P1) since the 1-player block only covers the centre.',
    ],
  },
  zone2: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P3', x: 22, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 55, sub: 'OFF' },
      { zoneId: 'P2', x: 80, y: 47.5, sub: 'DEF' },
      { zoneId: 'P1', x: 50, y: 73 },
    ],
    zones: [
      Z('P4', 0, 34, 35, 66, 'Short line'),
      Z('P2', 60, 25, 40, 45, 'Cross R'),
      Z('P1', 30, 62.5, 45, 37.5, 'Deep'),
    ],
    mainShot: { toX: 80, toY: 55 },
    altShots: [{ toX: 18, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 30, toY: 55 }],
    notes: [
      'Opposing Z2 attack → ball arrives on our left side. Perfect mirror of Z4.',
      'A system: 1 blocker (P3) + 3 defenders.',
      'P4 (front left) drops back to the 3 m line, 3.5-4 m from net — covers tips and feints on the left.',
      'P2 (front right) drops to mid-court on the right — covers the short cross-court.',
      'The lone back defender P1 defends the long cross-court (~7-7.5 m, 1 m from left line).',
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
      Z('P1', 65, 43, 35, 57, 'Short cross'),
      Z('P5', 0, 43, 50, 57, 'Long cross'),
      Z('P4', 0, 25, 35, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 22, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Opposing Z4 attack → ball arrives on our right side.',
      'Box formation (2-2 / box) → A system: 1 blocker (P2) + 3 defenders.',
      'P2 (front right) solo block facing the opposing hitter, takes the line.',
      'P4 (front left) as off-blocker, 2-2.5 m from net — covers tip and cut shot on the left.',
      'P5 defends the long cross-court (~7 m, 0.5 m from left line).',
      'P1 defends the deep line / short cross-court (~7 m, in the block shadow).',
      'B system (2-player block P2+P4) possible but leaves only 2 defenders — reserve for big hitters.',
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
      Z('P5', 0, 40, 50, 60, 'Cross L'),
      Z('P1', 50, 40, 50, 60, 'Cross R'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 47.5 }],
    notes: [
      'Central quick attack (Z3) — short angles, little time.',
      '2-player block (P4 + P2) closes the centre — B system with 2 defenders behind.',
      'P5 and P1 take the short cross-courts (~7 m, 0.5-1 m from sidelines).',
      'Major weakness: no short coverage behind the block, the box has no mid-court player.',
      'Alternative: 1-player block (P3-like role, here P4 or P2 alone) to free up a tip defender.',
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
      Z('P5', 0, 43, 35, 57, 'Short cross'),
      Z('P1', 50, 43, 50, 57, 'Long cross'),
      Z('P2', 60, 25, 40, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 78, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Opposing Z2 attack → ball arrives on our left side. Perfect mirror of Z4.',
      'A system: 1 blocker (P4) + 3 defenders.',
      'P4 (front left) solo block facing the opposing hitter, takes the line.',
      'P2 (setter-hitter front right) as off-blocker, 2-2.5 m from net — anti-tip + fast transition to target.',
      'P1 defends the long cross-court (~7 m, 0.5 m from right line).',
      'P5 defends the short deep line (~7 m, in the block shadow).',
    ],
  },
};

const LAYOUTS_4V4_31 = LAYOUTS_4V4_LOSANGE;

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
      Z('P1', 65, 40, 35, 60, 'Line R'),
      Z('P6', 33, 52, 34, 48, 'Axis'),
      Z('P5', 0, 43, 35, 57, 'Cross L'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 75 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 70 }, { toX: 18, toY: 40 }],
    notes: [
      'Opposing Z4 attack → ball arrives on our right.',
      '2F-3B setup (P4+P3 front-row, P5+P6+P1 back-row, P1 penetrating): 1-player block.',
      'P3 (middle blocker) blocks alone on the right — no P2 available for a 2-player block.',
      'P4 (outside hitter) off-blocker, 2-2.5 m from net on the left.',
      '3 deep defenders: P5 long cross-court, P6 central axis (~7-8 m), P1 right line.',
      'The 1-1-3 system (1 blocker + 1 off-blocker + 3 defenders) is the defense closest to 6v6 perimeter.',
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
      Z('P5', 0, 40, 33, 60, 'Cross L'),
      Z('P6', 33, 52, 34, 48, 'Axis'),
      Z('P1', 67, 40, 33, 60, 'Cross R'),
    ],
    mainShot: { toX: 50, toY: 75 },
    altShots: [{ toX: 22, toY: 65 }, { toX: 78, toY: 65 }],
    notes: [
      'Central quick attack (Z3) — short angles.',
      '1-player block (P3) reading — the quick is the hardest target in 2F-3B.',
      'P4 lateralized at mid-court (~2 m from net) for deflections.',
      'Advantage: 3 deep defenders (P5, P6, P1) cover the 3 main back zones.',
      'P6 faces the middle hitter in his hitting lane (~7.5-8 m, axis).',
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
      Z('P5', 0, 40, 35, 60, 'Line L'),
      Z('P6', 33, 52, 34, 48, 'Axis'),
      Z('P1', 65, 43, 35, 57, 'Cross R'),
      Z('P3', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 75 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 70 }, { toX: 80, toY: 40 }],
    notes: [
      'Opposing Z2 attack → ball arrives on our left. Mirror of Z4.',
      '1-player block: P4 blocks alone on the left side (no P2 in 2F-3B).',
      'P3 (middle blocker) becomes off-blocker on the right, 2-2.5 m from net.',
      'P5 defends the deep left line, P6 the axis, P1 the long cross-court.',
    ],
  },
};

const LIBERO_LABEL: Pick<DefenseZone, 'role' | 'labelRole'> = { role: 'L', labelRole: 'L' };

const LAYOUTS_6V6_PERIMETER: Record<ZoneTab, DefenseLayout> = {
  zone4: {
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
      { posNumber: 'P5', x: 0, y: 43, w: 50, h: 57, label: 'Long cross', labelPos: { x: 18, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Block shadow', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 62, y: 34, w: 38, h: 42, label: 'Line', labelPos: { x: 70, y: 40 } },
      { posNumber: 'P4', x: 0, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 4, y: 33 } },
    ],
    mainShot: { toX: 22, toY: 77.5 },
    altShots: [
      { toX: 78, toY: 47.5 },
      { toX: 45, toY: 62.5 },
      { toX: 15, toY: 40 },
    ],
    notes: [
      { label: 'Position 2 (opposite / OPP)', text: 'Line blocker — blocks, comes up to the net on the right side.' },
      { label: 'Position 3 (middle blocker)', text: 'Closes the cross-court on a 2-player block with the opposite.' },
      { label: 'Position 4 (outside off-blocker)', text: 'Drops to the 3 m line on the left side — covers the short cut shot (sharp cross-court) and feints.' },
      { label: 'Position 5 (Libero)', text: 'Defends the long cross-court, ~7-8 m from net, in the inside shoulder of the middle blocker.' },
      { label: 'Position 6 (back centre)', text: 'High balls passing the block, long block touches, axis ~8-8.5 m.' },
      { label: 'Position 1 (back right)', text: 'Defends the deep line in the block shadow, ~7-7.5 m from net, 0.5 m from the right line.' },
    ],
  },
  zone3: {
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
      { posNumber: 'P5', x: 0, y: 34, w: 36, h: 66, label: 'Cross L', labelPos: { x: 10, y: 70 } },
      { posNumber: 'P6', x: 32, y: 52, w: 36, h: 48, label: 'Axis', labelPos: { x: 42, y: 73 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 64, y: 34, w: 36, h: 66, label: 'Cross R', labelPos: { x: 75, y: 70 } },
      { posNumber: 'P4', x: 0, y: 25, w: 28, h: 28, label: 'Cover', labelPos: { x: 4, y: 36 } },
      { posNumber: 'P2', x: 72, y: 25, w: 28, h: 28, label: 'Cover', labelPos: { x: 78, y: 36 } },
    ],
    mainShot: { toX: 75, toY: 65 },
    altShots: [
      { toX: 25, toY: 65 },
      { toX: 50, toY: 80 },
    ],
    notes: [
      { label: 'Position 3 (middle blocker)', text: '1-player block reading (read) or commitment depending on opposing scouting.' },
      { label: 'Positions 4 and 2 (outside hitters)', text: 'On the attack line (~2-2.5 m from net, 0.5 m from sidelines): cover block deflections and balls through the block.' },
      { label: 'Position 5 (Libero)', text: 'Facing the middle hitter, in his hitting lane (~7-8 m from net).' },
      { label: 'Position 6 (back centre)', text: 'Shoulders facing the hitter; defends the powerful ball through the block (axis ~8-8.5 m).' },
      { label: 'Position 1 (back right)', text: 'Steps forward one metre (~7.5 m from net, 1 m from right line): shorter angles on quicks.' },
      { label: 'Key rule', text: '"Stopped on contact": everyone stopped and balanced at the exact instant of the hit.' },
    ],
  },
  zone2: {
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
      { posNumber: 'P1', x: 50, y: 43, w: 50, h: 57, label: 'Long cross', labelPos: { x: 68, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Block shadow', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P5', x: 0, y: 34, w: 38, h: 42, label: 'Line', labelPos: { x: 10, y: 40 } },
      { posNumber: 'P2', x: 70, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 76, y: 33 } },
    ],
    mainShot: { toX: 78, toY: 77.5 },
    altShots: [
      { toX: 22, toY: 47.5 },
      { toX: 55, toY: 62.5 },
      { toX: 85, toY: 40 },
    ],
    notes: [
      { label: 'Position 4 (outside hitter)', text: 'Line blocker — blocks at the net on the left side.' },
      { label: 'Position 3 (middle blocker)', text: 'Closes the cross-court on a 2-player block with the outside hitter.' },
      { label: 'Position 2 (opposite / OPP)', text: 'Becomes off-blocker on the right — drops to the 3 m line, covers short cut shot and feints.' },
      { label: 'Position 5 (Libero)', text: 'Defends the deep line in the block shadow, ~7-7.5 m from net, 0.5 m from the left line.' },
      { label: 'Position 6 (back centre)', text: 'High balls over the block, axis ~8-8.5 m from net.' },
      { label: 'Position 1 (setter or OH/OPP)', text: 'Defends the long cross-court, ~7-8 m from net.' },
    ],
  },
};

const LAYOUTS_BY_CONFIG: Record<string, Record<ZoneTab, DefenseLayout>> = {
  '5-1': LAYOUTS_6V6_PERIMETER,
  '4-2': LAYOUTS_6V6_PERIMETER,
  '6-2': LAYOUTS_6V6_PERIMETER,
  'pentagon': LAYOUTS_5V5_PENTAGON,
  '3F-2B': LAYOUTS_5V5_3F2B,
  '2F-3B': LAYOUTS_5V5_2F3B,
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
                <strong style={{ color: 'var(--ink)' }}>{n.label}: </strong>
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
  { title: 'Hitter far from the net', action: 'STEP UP', accentColor: 'var(--orange)',
    points: ['Set 2-3 m from the net', 'They cannot spike hard', 'High risk of feint or roll shot', 'Step up 1-2 metres'] },
  { title: 'Hitter close to the net', action: 'DROP BACK', accentColor: 'var(--plum)',
    points: ['Set less than 1 m from the net', 'Can spike at full power', 'Fast downward trajectory', 'Drop back as far as possible'] },
  { title: "The hitter's shoulder", action: 'Watch their hitting shoulder', accentColor: 'var(--teal)',
    points: ['High shoulder pulled back = powerful spike', 'Low shoulder = likely feint', 'Shoulder rotation = ball direction', 'Adjust in 0.5 s'] },
  { title: "The hitter's approach", action: 'Watch their approach run', accentColor: 'var(--ink)',
    points: ['Long, fast approach = hard spike', 'Short approach or stop = feint', 'Approach angle = target zone', 'Anticipate the power'] },
];

const COMMANDEMENTS = [
  ['Watch the setter', "Then the hitter, not the ball"],
  ['Same side = Step up', 'Opposite side = Drop back'],
  ['Bad opposing set', '→ Step up 1-2 m (feint likely)'],
  ['Never in the middle', 'Pick: forward OR back'],
  ['Communicate ALWAYS', '"Mine!" on every ball you take'],
  ['Move after the serve', 'Serve position ≠ defensive position'],
  ["Read the shoulder", 'High shoulder = spike, low = feint'],
  ['Low stance', 'Knees flexed, arms ready'],
  ['Fast transitions', '3 seconds max to reset'],
  ['Defend your zone', 'Every player has a responsibility'],
];

type MistakesSection = {
  title: string;
  intro: string;
  mistakes: [string, string][];
};

const MISTAKES_BY_SIZE: Record<TeamSize, MistakesSection> = {
  6: {
    title: 'The ten common defensive positioning mistakes',
    intro: 'Typology drawn from Mike Hebert (Thinking Volleyball), John Forman (CoachingVB), USA Volleyball and the FIVB Top Volley manual.',
    mistakes: [
      ['1. Drifting into the block shadow', 'Defenders instinctively take refuge behind blockers instead of positioning themselves around the block shadow — leaving the cross-courts and "off the block" trajectories open. Hebert: "creeping into the block shadow".'],
      ['2. Faulty reading', 'The defender stares at the ball instead of following the sequence "ball → setter → ball → hitter". Consequence: they guess instead of reading, and are not stopped and balanced at the moment of contact ("stopped and balanced at the moment of contact").'],
      ['3. Libero misplaced in depth', 'Too close to the net, they cannot defend deep spikes; too far back, they cannot cover tips. Rule: align their outside shoulder with the inside shoulder of the middle blocker, 6-8 m from the net depending on the block.'],
      ['4. Setter-defender poorly prepared', 'Stance too low or poorly oriented preventing them from seeing ball + opposing court; premature release toward the target creating a hole in Z1; no "release call" signalling they are leaving defense.'],
      ['5. Overlap faults', 'The most common: Z6 drifts in front of Z3, Z5 farther right than Z6, and the setter leaves their position too early to penetrate (fault #1 in 5-1). At the instant of server contact, all feet must respect the front/back and left/right relationships (Rule 7.4).'],
      ['6. Reception → defense transition forgotten', 'Players stay frozen in their W reception formation instead of switching to defensive base position as soon as the opposing setter touches the ball. Hebert: "sluggish recovery after play on the ball".'],
      ['7. Mismanaging zone 6', 'Confusion between "6-up" (rotation), "6-back" (perimeter) and "6-deep". The Z6 player must shift laterally according to the opposing attack side, not stay centred. Leaning back to dig ("leaning back") puts weight on the heels and kills reactivity.'],
      ['8. Failed defense on central quick attack', 'Reading the opposing middle blocker too late; back-row not stepped forward (on quicks, Z1 and Z5 must step in one metre because angles are shorter); "false stepping" (first step backward) which wastes the available time.'],
      ['9. Orphaned feint coverage', 'No defender explicitly assigned to the tip; "standing up on tips" — the defender is low for the spike, then stands up and reaches out for the feint, letting the ball drop right in front of them. Focus must stay on the spike in low stance allowing a tip jump.'],
      ['10. Collective silence', 'No calls ("tip!", "line!", "out!", "mine!"); blockers not communicating their line vs cross-court orientation; no rotation captain to check overlaps before the serve.'],
    ],
  },
  5: {
    title: 'Common mistakes in 5v5',
    intro: 'Mistakes specific to the 5v5 format (adaptations from Volleyball Canada, VolleyballXL and 6v6 doctrine).',
    mistakes: [
      ['1. Mechanically reproducing 6v6', 'Covering 3 deep zones with 3 defenders works (2F-3B setup), but the off-blocker who drops back is missing — the 3 m zone is not covered if no one is explicitly assigned.'],
      ['2. The front-row off-blocker stays glued to the net', 'After the block contact, the front-row off-blocker must drop back to 2-2.5 m to cover tips. If they stay at the net, the zone behind the block is wide open.'],
      ['3. 2 defenders standing side by side', 'In 3F-2B setup, the 2 deep defenders must be spaced (one on the left, one on the right) and not centred together. Otherwise, the sidelines are exposed.'],
      ['4. The setter releases too early (penetrating setup)', 'In 2F-3B setup with a penetrating setter from P1, they must wait until the ball is defended before running to their target — otherwise a hole opens in Z1.'],
      ['5. Front/back confusion', 'With 5 players, the temptation to let front-row defend their side while staying on the 3 m line is strong — but this leaves the deep court open. Front-row goes up to block, back-row defends deep.'],
      ['6. Faulty reading', 'Missing one player demands even earlier reading than in 6v6. Sequence "ball → setter → ball → hitter" + balanced stop at the moment of contact.'],
    ],
  },
  4: {
    title: 'Common mistakes in 4v4',
    intro: 'Mistakes specific to 4v4 indoor (university intramurals, FFVb / Volleyball Canada doctrine, beach 4s).',
    mistakes: [
      ['1. The isolated blocker without tip coverage', 'All 3 defenders go deep, leaving the 3-5 m zone empty. Someone must always be assigned to the tip at 3.5-4 m from the net.'],
      ['2. 2 defenders in a straight line', 'Side by side at the same depth → the cut shot drops between them. In 4v4, defenders must always be staggered (one near, one far) or spread laterally.'],
      ['3. The setter releasing to the target before the ball is defended', 'Premature transition leaving a hole in defense. The setter waits for confirmation that the ball is recovered before going to their target.'],
      ['4. No signal between blocker and defenders', 'The blocker MUST signal "line" or "cross-court" before the attack starts. Without it, the 3 defenders do not know what to cover — everyone improvises.'],
      ['5. The tip defender too far from the net', 'They drop back with the other back defenders and can no longer cover short feints. Their position is 3.5-4 m from the net, axis — not 7 m.'],
      ['6. "Random" blocking of the wrong player', 'In 4v4, blocking with a poorly placed player (far from the hitter) leaves the opponent facing 3 misaligned defenders. The blocker must be the one facing the primary hitter.'],
      ['7. Faulty reading', 'With ~40 sqm per defender (vs 20 sqm in 6v6), a reading error is unrecoverable. Anticipation = skill #1 in 4v4.'],
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
    title: 'The three main defensive systems (FIVB / USAV)',
    warning: {
      label: '⚠ Terminological warning',
      text: 'The expression "W defense" often heard in France is incorrect. The "W-formation" historically refers to a 5-player serve reception formation — not a defensive system. International doctrine (FIVB, USAV IMPACT, Liskevych, Stone) distinguishes three systems: man-up (2-1-3), perimeter (2-0-4) and rotation (3-2-1).',
    },
    systems: [
      {
        name: 'Man-up defense (2-1-3)',
        tag: 'Formerly "W defense" / red defense',
        principe: 'A defender steps up to the 3 m line behind the block to intercept feints and roll shots. Two blockers at the net, the off-blocker drops back, and three deep players cover the long angles.',
        forces: ['Outstanding coverage of tips, roll shots and "junk" balls behind the block', 'Fast transition to attack if the stepped-up player is the setter', 'Simple to teach young teams'],
        faiblesses: ['Only 3 deep defenders — vulnerable to powerful tight cross-court spikes', 'A hitter who hits hard between the blockers easily breaks through'],
        indication: 'Young teams, scholastic, tactical opponents who play many feints or off-speed shots.',
        accent: 'var(--orange)',
      },
      {
        name: 'Perimeter defense (2-0-4)',
        tag: 'White defense — dominant system at the elite men\'s level',
        principe: 'The four back defenders form a U opening toward the net, almost on the sidelines and endline — "one foot on the line" (Liskevych). The middle of the court is intentionally abandoned.',
        forces: ['Excellent coverage of powerful spikes, lines and deep corners', 'Simple collective movement', 'Predominant system in modern international men\'s volleyball'],
        faiblesses: ['Very vulnerable to short tips behind the block — central zone between 3 and 5 m is open', 'Requires athletic defenders capable of diving forward'],
        indication: 'Senior, men\'s, international level, powerful opponents.',
        accent: 'var(--teal)',
      },
      {
        name: 'Rotation defense / slide defense (3-2-1)',
        tag: 'Rotational / slide defense',
        principe: 'The three back defenders slide toward the opposing attack side: the opposite back-row player steps up behind the block (tip), the middle slides toward the attacked line, the defender on the attacked side takes the short angle.',
        forces: ['Excellent coverage of the deep line AND tip simultaneously', 'Very adaptable system', 'Fast setter transition when the setter is in P1'],
        faiblesses: ['One fewer defender deep (one player dedicated to the tip)', 'Opposite diagonal corner vulnerable', 'High reading and coordination skill required'],
        indication: 'Opponents who mix power and lines/tips; intermediate to elite level.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['Man-up 2-1-3', 'Perim. 2-0-4', 'Rotation 3-2-1'],
    tableRows: [
      ['Player up behind block', 'Yes', 'No', 'Yes'],
      ['Deep defenders', '3', '4', '2'],
      ['Tip coverage', '★★★', '★', '★★'],
      ['Powerful spike coverage', '★★', '★★★', '★★'],
      ['Deep line coverage', '★★', '★★', '★★★'],
      ['Tight cross-court coverage', '★', '★★★', '★★'],
      ['Typical libero position', 'Z5 or Z6', 'Z5 (on the line)', 'Z5 slides'],
      ['Complexity', 'Low', 'Medium', 'High'],
    ],
    footer: {
      strong: 'The choice is not a matter of orthodoxy: ',
      text: 'it depends on the opponent\'s offensive profile and the qualities of your defenders. Modern defense is defined less by the formation than by the reading — visual sequence "ball → setter → ball → hitter" and balanced stop at the moment of contact.',
    },
  },
  5: {
    title: 'The three defensive systems in 5v5',
    warning: {
      label: '⚠ Non-official FIVB format',
      text: 'Indoor 5v5 has no dedicated FIVB or FFVb rulebook. These three systems are logical adaptations of 6v6 documented by VolleyballXL, The Art of Coaching Volleyball and Volleyball Canada. There is no official 5v5 technical manual — choose the system based on your team setup (2-3 or 3-2).',
    },
    systems: [
      {
        name: '1-1-3 system',
        tag: '1 blocker + 1 tip cover + 3 deep defenders',
        principe: 'Suited to 2F-3B setup (2 front-row, 3 back-row). The blocker jumps alone; the 2nd front-row drops back as an off-blocker 2-3 m from the net for tips; 3 deep defenders cover line, axis and long cross-court.',
        forces: ['3 deep defenders like in 6v6 perimeter — good spike coverage', 'The setup closest to 6v6 5-1 (preparation for the transition to 6v6)', 'Tip covered by the off-blocker'],
        faiblesses: ['1-player block only → fragile against big hitters', 'The off-blocker 2-3 m back must be very reactive'],
        indication: '2F-3B setup (penetrating setter), moderately powerful opponents. Recommended system for the pedagogical transition toward 6v6.',
        accent: 'var(--teal)',
      },
      {
        name: '2-1-2 system',
        tag: '2 blockers + 1 tip + 2 deep defenders',
        principe: 'Suited to 3F-2B setup (3 front-row, 2 back-row). 2-player block at the net, the centre front-row covers the tip 2-3 m from the net, 2 deep defenders take long cross-court and line.',
        forces: ['2-player block like in 6v6 — significantly more effective against powerful spikes', '3 attackers at the net for counter-attack'],
        faiblesses: ['Only 2 deep defenders → 9 m of back-court very hard to cover', 'High athletic demand on the 2 back-row defenders'],
        indication: '3F-2B setup against very powerful teams. Favour at the end of a set when every point counts.',
        accent: 'var(--orange)',
      },
      {
        name: '1-2-2 system',
        tag: 'Adapted man-up (equivalent to 6v6 2-1-3)',
        principe: 'Solo blocker + 2 front-zone coverers (tip + behind-block) + 2 deep defenders. Suited when the opponent tips a lot or for beginner teams.',
        forces: ['Excellent coverage of short feints (2 front-zone coverers)', 'Tip hard to exploit by the opponent'],
        faiblesses: ['Only 2 deep defenders → powerful spikes difficult', 'Requires coordination between the 2 front-zone coverers'],
        indication: 'Opponents who tip a lot; women\'s volleyball, youth categories, technical teams.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['1-1-3', '2-1-2', '1-2-2 (man-up)'],
    tableRows: [
      ['Blockers', '1', '2', '1'],
      ['Front-zone coverers', '1 (off-blocker)', '1 (tip)', '2 (tip + behind-block)'],
      ['Deep defenders', '3', '2', '2'],
      ['Tip coverage', '★★', '★★', '★★★'],
      ['Powerful spike coverage', '★★', '★★★', '★★'],
      ['Back-court coverage', '★★★', '★★', '★★'],
      ['Matching setup', '2F-3B', '3F-2B', '2F-3B / 3F-2B'],
      ['Complexity', 'Low', 'Medium', 'High'],
    ],
    footer: {
      strong: '5v5 recommendation: ',
      text: 'the 1-1-3 system in 2F-3B setup with a penetrating setter is the defense closest to 6v6 — ideal as a pedagogical transition. The 2-1-2 is only justified against truly powerful hitters.',
    },
  },
  4: {
    title: 'The three defensive systems in 4v4',
    warning: {
      label: '⚠ Non-official FIVB format',
      text: 'Indoor 4v4 has no official FIVB rulebook. These three systems come from university intramurals practice (USA), FFVb / Volleyball Canada pedagogical transition manuals and beach literature (Brandon Joyner, Better at Beach). With 4 players, each defender covers ~30-40 sqm (vs 20 sqm in 6v6) — anticipation is skill #1.',
    },
    systems: [
      {
        name: 'A system: 1 blocker + 3 defenders',
        tag: 'The most common in 4v4 indoor',
        principe: 'A single player goes up to block facing the primary hitter. The other 3 split up: tip defender (3-4 m from the net, axis), cross defender (7-7.5 m, right line, long cross-court), line defender (7-7.5 m, in the block shadow).',
        forces: ['Covers tip, line and long cross-court simultaneously', 'The most balanced in 4v4', 'Line/cross-court blocker signal very effective'],
        faiblesses: ['1-player block — vulnerable to big hitters', 'Requires a disciplined tip defender who does not drop back'],
        indication: 'Opponents of equivalent or moderate level. Most versatile setup in 4v4 (diamond formation or 3-1 line).',
        accent: 'var(--orange)',
      },
      {
        name: 'B system: 2 blockers + 2 defenders',
        tag: '2-player block (rare in 4v4)',
        principe: 'The 2 front-row go up together facing the primary hitter. The 2 back-row position themselves: one on the line side (7 m, 1 m from the line), one on the axis slightly shifted toward the cross-court. The tip is not covered.',
        forces: ['2-player block significantly more effective against powerful spikes', 'Maximum pressure on the opposing hitter'],
        faiblesses: ['Only 2 defenders on the floor → impossible to cover everything', 'Tip behind the block completely uncovered', 'Forces a choice: line OR cross-court, not both'],
        indication: 'Only to be used against very powerful hitters without finesse (no feints). Box 2-2 or 3-1 line setup.',
        accent: 'var(--plum)',
      },
      {
        name: 'C system: 0 blocker',
        tag: 'Low defense (non-spiking opponents)',
        principe: 'No player goes up to block. The 4 players defend deep: 2 at mid-court (3-4 m) for feints, 2 deep (7-8 m) for deeper balls. The setter acts as the 4th defender.',
        forces: ['Covers the whole depth of the court', 'Well suited to slow rallies'],
        faiblesses: ['COUNTER-PRODUCTIVE as soon as an opponent hits seriously (the spike goes through unopposed)', 'No pressure at the net'],
        indication: 'Scholastic levels, beginner recreational, opponents who do not spike. Avoid as soon as the opposition gains power.',
        accent: 'var(--teal)',
      },
    ],
    tableHeaders: ['A system', 'B system', 'C system'],
    tableRows: [
      ['Blockers', '1', '2', '0'],
      ['Deep defenders', '3', '2', '4'],
      ['Tip coverage', '★★', '★', '★★★'],
      ['Powerful spike coverage', '★★', '★★★', '★ (no block)'],
      ['Deep line coverage', '★★', '★★', '★★'],
      ['Long cross-court coverage', '★★★', '★★', '★★'],
      ['Recommended opponents', 'All levels', 'Very powerful', 'Non-spikers'],
      ['Complexity', 'Low', 'Medium', 'Low'],
    ],
    footer: {
      strong: '4v4 recommendation: ',
      text: 'the A system (1 blocker + 3 defenders) is the near-universal default. The B system is only justified against truly powerful hitters at the end of a set. The C system only works at beginner recreational level — as soon as an opponent spikes, return to the A system.',
    },
  },
};

const EXERCICES = [
  { title: 'Situation reading', level: 'Beginner', duration: '10 min', materiel: '1 coach or partner with balls',
    objectif: 'Learn to quickly identify the attack zone',
    steps: ['The coach stands on the other side of the net in zone 4, 3 or 2', 'You start from the centre of the court', 'The coach announces the zone and tosses the ball', 'You must reach your defensive zone in 2-3 seconds', 'Repeat 20 times varying the zones'] },
  { title: 'Step up / drop back according to the set', level: 'Intermediate', duration: '15 min', materiel: '1 setter, 1 hitter, several defenders',
    objectif: 'Adjust your position based on the quality of the set',
    steps: ['The setter delivers sets of varying quality to the hitter', 'Set close to the net → You drop back (powerful spike expected)', 'Set far from the net → You step up (feint likely)', 'The hitter attacks and you defend', 'The coach corrects your position after each ball'] },
  { title: 'Defensive communication', level: 'All levels', duration: '10 min', materiel: 'Full team',
    objectif: 'Develop automatic communication',
    steps: ['Match in your format (4v4, 5v5 or 6v6) but SHOUTING every call', 'Penalty: -1 point if a player does not shout "Mine!" on their ball', 'Bonus: +1 point if the whole team communicates on a rally', 'Each player must announce the opposing attack zone'] },
  { title: 'Defense against feints', level: 'Intermediate', duration: '15 min', materiel: '1 hitter, 3 back defenders',
    objectif: 'Improve defense of short balls',
    steps: ['The hitter ONLY plays feints and roll shots', 'The defenders must all step up (3-4 m)', 'Goal: recover 8 out of 10 balls', 'Then alternate: 5 feints, 5 spikes to work on adaptation'] },
  { title: 'Fast transitions', level: 'Advanced', duration: '20 min', materiel: 'Full team',
    objectif: 'Master attack-defense changes',
    steps: ['Normal play but the coach times the transitions', 'Goal: be in defensive position in less than 3 seconds', 'If too slow, the team does 5 push-ups and starts over', 'Gradually increase the pace of rallies'] },
  { title: 'Reading the hitter', level: 'Advanced', duration: '15 min', materiel: '1 hitter, defenders',
    objectif: 'Anticipate based on body language',
    steps: ['The hitter alternates spike, feint, tip without warning', `Before they hit, the defender calls their prediction: "Spike!" or "Feint!"`, 'Point if the prediction is correct AND the ball is defended', 'Focus on: shoulder, approach, position relative to the net'] },
];

type GuidePositionnementProps = {
  teamSize?: TeamSize;
  configId?: string;
};

export default function GuidePositionnementEn({ teamSize: teamSizeProp, configId: configIdProp }: GuidePositionnementProps = {}) {
  const teamSize: TeamSize = teamSizeProp ?? 6;
  const configurations = CONFIGURATIONS[teamSize];

  const configId = configIdProp && configurations.some(c => c.id === configIdProp)
    ? configIdProp
    : configurations[0].id;

  const [zone, setZone] = useState<ZoneTab>('zone4');

  const configuration = configurations.find(c => c.id === configId) ?? configurations[0];

  const renderZoneTab = () => {
    const layouts = LAYOUTS_BY_CONFIG[configuration.id];
    if (!layouts) {
      return <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>Diagram not available for this setup.</div>;
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
        <div style={S.label}>Your team configuration</div>
        <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
          Choose your format and tactical setup: <strong>the entire guide content</strong> (positions, zones, defense by attack) will adapt.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Game format</div>
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
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Tactical setup</div>
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

      {/* Basic principle */}
      <div style={S.card}>
        <div style={S.label}>Basic principle of defense</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0' }}>Defensive positioning depends on 3 main factors:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Your position (front or back-row)', 'The opposing attack zone (zone 4, 3, 2)', 'The type of attack (powerful spike, feint, tip)'].map((pt, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={S.bullet}>▸</span>
              <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Positions and zones */}
      <section>
        <h2 style={S.section}>1. Positions and zones — {configuration.shortName} ({teamSize}v{teamSize})</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            Your team layout in {configuration.name}
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
              See each position in detail on /positions →
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--ink)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Important rule: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>
            {teamSize === 6 && 'Back-row players (5, 6, 1) CANNOT block at the net. They defend in the back-court.'}
            {teamSize === 5 && 'With 5 players, each defender covers ~30 sqm (vs 20 sqm in 6v6). Reading becomes critical.'}
            {teamSize === 4 && 'No libero. Each player defends ~30-40 sqm. Anticipation is skill #1.'}
          </span>
        </div>
      </section>

      {/* 2. Positioning by zone */}
      <section>
        <h2 style={S.section}>2. Positioning by opposing attack zone</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button key={z} onClick={() => setZone(z)} style={zone === z ? btnActive : btnBase}>
              {z === 'zone4' ? 'Zone 4 attack' : z === 'zone3' ? 'Zone 3 attack' : 'Zone 2 attack'}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {teamSize}v{teamSize} · {configuration.shortName} — {
              zone === 'zone4' ? 'Defense against attack in Zone 4 (opposing left wing)' :
              zone === 'zone3' ? 'Defense against attack in Zone 3 (centre)' :
              'Defense against attack in Zone 2 (opposing right wing)'
            }
          </div>
          {renderZoneTab()}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <span><span style={{ color: 'var(--orange)' }}>■</span> <span style={{ color: 'var(--ink)', opacity: 0.6 }}>Responsibility zone</span></span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>BLK</strong> = blocking</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>OFF</strong> = off-blocker</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>DEF</strong> = defense</span>
        </div>
      </section>

      {/* 3. General principles */}
      <section>
        <h2 style={S.section}>3. General positioning principles</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={S.labelTeal}>Responsibility zones</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          {[
            { title: 'Front-row players',
              points: ['Priority: Block at the net', 'If not blocking: defend the opposite line', 'Distance: at the net or back-court'] },
            { title: teamSize === 4 ? 'Lone back defender (P1)' : 'Defensive pivot (Libero / P6)',
              points: teamSize === 4
                ? ['Position: centre, ~40 sqm to cover', 'Distance: 5-6 m from net', 'Role: lone defensive pillar, maximum anticipation']
                : ['Position: centre, adaptable', 'Distance: 5-6 m from net', 'Role: defensive pillar, covers the centre'] },
            { title: 'Outside back defenders',
              points: ['Variable role: step up or drop back', 'Attacked side: step up (3-4 m)', 'Opposite side: drop back (6-7 m)'] },
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

        {/* Universal principles 4/5/6 — Hebert, Liskevych, Volleyball Canada */}
        <div style={{ ...S.card, border: '2.5px solid var(--teal)' }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.12em', color: 'var(--teal)', marginBottom: 8 }}>
            ★ Universal defensive principles (4v4 / 5v5 / 6v6)
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px 0', lineHeight: 1.5 }}>
            These principles from Hebert, Liskevych and Volleyball Canada apply regardless of the number of players on the court.
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['The block is the foundation', 'Back defenders position themselves relative to the block shadow and orientation — not independently.'],
              ['Stopped and balanced at the moment of contact', 'Any defender still moving when the hitter contacts the ball sees their reactivity collapse ("stopped on contact").'],
              ['Sequential visual reading', '"Ball → opposing setter → ball → opposing hitter". In 4v4 and 5v5, the missing players force even earlier reading.'],
              ['Signal communication', 'Even at recreational level, the blocker must signal "line" or "cross-court" — without it, back defenders do not know what to cover.'],
              ['Front zone covered', 'Someone must cover the 3-5 m behind the block — it is the most neglected zone in reduced formats (4v4 / 5v5).'],
              ['Fast transition', 'The setter must never release to the target before confirming that the ball has been defended ("release call").'],
            ].map(([title, text], i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13 }}>
                <span style={{ background: 'var(--teal)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 11, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{title}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Reading the hitter */}
      <section>
        <h2 style={S.section}>4. Reading the hitter: visual cues</h2>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Your positioning must adjust to what you see. Here are the key cues:
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
          <strong style={{ color: 'var(--ink)' }}>Pro tip: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>In the 2 seconds after the opposing serve, focus your gaze on the setter, then IMMEDIATELY on the hitter who is going to attack.</span>
        </div>
      </section>

      {/* 5. When to step up / drop back */}
      <section>
        <h2 style={S.section}>5. When to step up or drop back?</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, marginBottom: 14 }}>Quick decision tree</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderLeft: '4px solid var(--orange)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--orange)', letterSpacing: '0.08em' }}>Step up (3-4 m from net) when:</div>
              {[
                'You are on the same side as the hitter',
                'The hitter is far from the net (bad set)',
                'You anticipate a feint or roll shot',
                'The block is solid — fewer powerful balls get through',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={S.bulletOrange}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '4px solid var(--ink)', paddingLeft: 16, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.08em' }}>Drop back (6-7 m from net) when:</div>
              {[
                'You are on the opposite side from the hitter',
                'The hitter has a good set close to the net',
                'The hitter is powerful or tall',
                'The block is weak (only 1 blocker)',
                'You are defending the cross-court (longest trajectory)',
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

      {/* 6. Common mistakes (conditional by teamSize) */}
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
                    <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                    <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </section>

      {/* 7. Positioning at the serve */}
      <section>
        <h2 style={S.section}>7. Positioning at the serve</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            <strong>Your placement at the serve is DIFFERENT from your defensive position. </strong>
            As soon as the serve goes, you must reposition.
          </p>
        </div>
        <div style={S.card}>
          <div style={{ ...S.labelTeal, marginBottom: 12 }}>Serve → defense transition</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Your team serves', 'You are in rotation position'],
              ['The server hits', 'You watch the opposing setter'],
              ['The setter touches the ball', 'You move toward your defensive zone'],
              ['The hitter jumps', 'You are in final position, ready to react'],
            ].map(([step, detail], i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13 }}>
                <span style={S.stepBadge}>{i + 1}</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{step}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Communication */}
      <section>
        <h2 style={S.section}>8. Defensive communication</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>A silent defense is an ineffective defense.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { moment: 'Before the opposing attack', calls: [['"Number 4!"', 'Announce the zone the attack comes from'], ['"Two on the block!"', 'Indicate how many blockers'], ['"Line open!"', 'If the block does not cover the line'], [`"Stepping up!" / "Dropping back!"`, 'Announce your movement']] },
            { moment: 'During the action', calls: [[`"Mine!" / "I got it!"`, 'You take the ball (the MOST important)'], ['"Yours!" / "You!"', 'You leave the ball to a teammate'], ['"Out!"', 'The ball is going out, do not touch it'], ['"Blocked!"', 'If you block, call it']] },
            { moment: 'After the action', calls: [['"Cover!"', 'Call for attack coverage'], ['"Free!"', 'Free ball, reset'], ['"Stay!"', 'Keep the defense in place']] },
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
          <strong style={{ color: 'var(--ink)' }}>Golden rule: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>When in doubt between two players, the more forward player ALWAYS takes the ball.</span>
        </div>
      </section>

      {/* 9. Defensive systems (conditional by teamSize) */}
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
                    <div style={S.labelTeal}>Strengths</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.forces.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={S.bullet}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.55 }}>Weaknesses</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.faiblesses.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sys.accent, marginTop: 6 }}>
                      Use when: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{sys.indication}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div style={{ ...S.card, marginTop: 14, overflowX: 'auto' }}>
                <div style={{ ...S.label, marginBottom: 10 }}>Synthetic comparison table</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.6 }}>Criterion</th>
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
        <h2 style={S.section}>10. Attack ↔ defense transitions</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Volleyball is a game of fast transitions. You constantly switch from attack to defense and back.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Attack → defense transition', items: [['Your teammate attacks', 'Get mentally ready to defend'], ['The ball is returned', 'Immediately identify who will attack'], ['Fast movement', 'Get to your defensive zone (2-3 seconds max)'], ['Low stance', 'Bend your knees, ready to dive']] },
            { label: 'Defense → attack transition', items: [['You defend the ball', 'Accurate pass to the setter'], ['If you are FRONT-ROW', 'Run to the net to attack or block'], ['If you are BACK-ROW', 'Drop back slightly, ready to cover the attack'], ['Attack coverage', 'Surround your hitter (in a half-circle 2-3 m away)']] },
          ].map((group, gi) => (
            <div key={gi} style={S.card}>
              <div style={S.label}>{group.label}</div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map(([step, detail], i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13 }}>
                    <span style={S.stepBadge}>{i + 1}</span>
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{step}: </strong>
                      <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Drills */}
      <section>
        <h2 style={S.section}>11. Drills to improve</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{i + 1}. {ex.title}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 8px', border: '1.5px solid var(--ink)', color: 'var(--ink)', background: 'var(--cream)', flexShrink: 0 }}>{ex.level}</span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, marginBottom: 6 }}>
                Duration: {ex.duration} · Equipment: {ex.materiel}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 8 }}>
                Goal: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{ex.objectif}</span>
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

      {/* 12. Recap */}
      <section>
        <h2 style={S.section}>12. The 10 commandments of the defender</h2>
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
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Same side as the hitter</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--orange)', marginBottom: 4 }}>→ STEP UP (3-4 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Defend feints and roll shots</div>
            </div>
            <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Opposite side from the hitter</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>→ DROP BACK (6-7 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Defend long cross-courts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>Conclusion</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            Defensive positioning is learned through practice and experience. Do not get discouraged if you make
            mistakes at first — even pros constantly adjust their placement.
          </p>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: 0 }}>
            The key: apply the basic rule (same side = step up, opposite = drop back), watch the hitter,
            communicate with your teammates, and never be afraid to dive for a ball.
          </p>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, color: 'var(--ink)', margin: 0, letterSpacing: '0.06em' }}>Defense wins matches.</p>
        </div>
      </section>

    </div>
  );
}
