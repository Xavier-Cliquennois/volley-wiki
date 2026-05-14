import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Court, type CourtLayout } from '../components/court';
import type { RoleColorKey } from '../constants/positions';
import { CONFIGURATIONS, type TeamSize } from '../pages/Positions';
import { S } from './styles';
import { TEAM_SIZES, type TeamSizeSlug } from '../seo/constants';
import { useCurrentLang } from '../i18n/paths';

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
      Z('P1', 65, 40, 35, 60, 'Z1 krótka'),
      Z('P5', 0, 43, 50, 57, 'Długa krzyżowa'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Atak przeciwnika z Z4 (ich lewe skrzydło) → piłka trafia na naszą prawą stronę.',
      'System 2-1-2: blok 2-osobowy (P2 atakujący po linii + P3 krzyżowa) + 2 obrońców w głębi.',
      'P4 (przyjmujący) jako off-blocker, 2-2,5 m od siatki, 1 m od linii bocznej — kryje feintę i ścięty atak.',
      'P5 (~7-7,5 m, 0,5 m od lewej linii) broni długiej krzyżowej.',
      'P1 (~7-7,5 m, 0,5 m od prawej linii) broni głębokiej linii, w cieniu bloku.',
      'Główny broniony atak: długa krzyżowa (statystycznie najczęstsza trajektoria).',
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
      Z('P5', 0, 40, 50, 60, 'Krzyżowa L'),
      Z('P1', 50, 40, 50, 60, 'Krzyżowa P'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 82 }],
    notes: [
      'Środkowy atak szybki (Z3) — krótkie kąty, mało czasu na reakcję.',
      'Blok 1-osobowy: P3 (środkowy bloku) czytający, commitment niemożliwy.',
      'P4 i P2 (off-blockers) 2 m od siatki na linii ataku — kryją odbicia od bloku.',
      'P5 i P1 1 m do przodu (~7 m od siatki) — kąty są krótsze niż przy wysokich piłkach.',
      'Słabość: brak dedykowanego obrońcy w głębi środka (tylko 2 graczy w tylnej linii w 5v5).',
      'Kluczowa zasada: "zatrzymany na kontakcie" — wszyscy zatrzymani i zrównoważeni w chwili kontaktu.',
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
      Z('P5', 0, 40, 35, 60, 'Z5 krótka'),
      Z('P1', 50, 43, 50, 57, 'Długa krzyżowa'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Atak przeciwnika z Z2 (ich prawe skrzydło) → piłka trafia na naszą lewą stronę. Idealne lustrzane odbicie Z4.',
      'Blok 2-osobowy: P4 (przyjmujący po linii) + P3 (środkowy krzyżowa).',
      'P2 (atakujący / rozgrywający) jako off-blocker, 2-2,5 m od siatki po prawej stronie.',
      'P1 (~7-7,5 m, 1 m od prawej linii) broni długiej krzyżowej.',
      'P5 (~7-7,5 m, 0,5 m od lewej linii) broni głębokiej linii w cieniu bloku.',
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
      Z('P1', 65, 40, 35, 60, 'Z1 krótka'),
      Z('P5', 0, 43, 50, 57, 'Długa krzyżowa'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 35, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Atak przeciwnika z Z4 → piłka trafia na naszą prawą stronę.',
      'Ustawienie 3F-2B: 3 graczy w linii ataku → korzystny blok 2-osobowy (P3 + P2 rozgrywający-blokujący).',
      'P4 (przyjmujący) krótki off-blocker po lewej stronie na linii ataku (~2-2,5 m od siatki).',
      'P5 broni długiej krzyżowej (~7 m, 0,5 m od lewej linii).',
      'P1 broni głębokiej prawej linii w cieniu bloku (~7 m, 0,5 m od prawej linii).',
      'Wada: tylko 2 obrońców w głębi → 30+ m² na obrońcę (vs 20 m² w 6v6).',
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
      Z('P5', 0, 40, 50, 60, 'Krzyżowa L'),
      Z('P1', 50, 40, 50, 60, 'Krzyżowa P'),
    ],
    mainShot: { toX: 50, toY: 82 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 75, toY: 70 }],
    notes: [
      'Środkowy atak szybki (Z3) — krótkie kąty.',
      'Przy 3 graczach w linii ataku możliwy jest blok 3-osobowy, ale zostawia tylko 2 obrońców w polu — niezalecane.',
      'Zalecane: blok 2-osobowy (P3 + skrzydłowy najbliższy korytarza ataku).',
      'P5 i P1 1 m do przodu (~7 m) bo kąty są krótsze przy szybkich.',
      'Słabość: głęboka piłka osiowa nie kryta (brak obrońcy Z6 w 5v5 3F-2B).',
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
      Z('P5', 0, 43, 35, 57, 'Z5 krótka'),
      Z('P1', 50, 43, 50, 57, 'Długa krzyżowa'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Atak przeciwnika z Z2 → piłka trafia na naszą lewą stronę. Idealne lustrzane odbicie Z4.',
      'Blok 2-osobowy: P4 (przyjmujący po linii) + P3 (środkowy krzyżowa).',
      'Rozgrywający (P2) jako off-blocker, 2-2,5 m od siatki po prawej stronie (anty-feinta + szybka tranzycja do celu).',
      'P1 broni długiej krzyżowej (~7-7,5 m).',
      'P5 broni głębokiej lewej linii w cieniu bloku.',
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
      Z('P2', 65, 34, 35, 66, 'Krótka linia'),
      Z('P4', 0, 25, 35, 45, 'Krzyżowa L'),
      Z('P1', 25, 62.5, 45, 37.5, 'Głębia'),
    ],
    mainShot: { toX: 20, toY: 55 },
    altShots: [{ toX: 82, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 70, toY: 47.5 }],
    notes: [
      'Atak przeciwnika z Z4 → piłka trafia na naszą prawą stronę.',
      'Formacja romb (1-2-1) → system A: 1 blokujący (P3) + 3 obrońców.',
      'P3 idzie do bloku solo po prawej stronie (naprzeciwko atakującego przeciwnika).',
      'P2 (przód prawa) cofa się na linię 3 m, 3,5-4 m od siatki — kryje feintę i kiwki za blokiem.',
      'P4 (przód lewa) opada w środek boiska po lewej — kryje krótką krzyżową.',
      'P1 (jedyny obrońca w głębi) kryje długą krzyżową (~7-7,5 m, 1 m od prawej linii).',
      'Antycypacja = umiejętność #1: tylko 1 obrońca w głębi → ~40 m² do pokrycia.',
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
      Z('P4', 0, 32.5, 35, 52.5, 'Krzyżowa L'),
      Z('P2', 65, 32.5, 35, 52.5, 'Krzyżowa P'),
      Z('P1', 30, 62.5, 45, 37.5, 'Głębia'),
    ],
    mainShot: { toX: 50, toY: 77.5 },
    altShots: [{ toX: 18, toY: 55 }, { toX: 80, toY: 55 }],
    notes: [
      'Środkowy atak szybki (Z3) — najtrudniejsze ustawienie w 4v4: mało czasu, tylko 1 blokujący.',
      'Blok 1-osobowy (P3 solo) w stałym trybie READ (commitment niemożliwy).',
      'P4 i P2 cofają się do środka boiska (~3,5-4 m od siatki, kryją obie krótkie krzyżowe).',
      'Jedyny obrońca w głębi P1 pełni rolę obrońcy Z6 (oś centralna, 7-8 m od siatki).',
      'Główny atak: mocna piłka osiowa (w stronę P1) ponieważ blok 1-osobowy kryje tylko środek.',
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
      Z('P4', 0, 34, 35, 66, 'Krótka linia'),
      Z('P2', 60, 25, 40, 45, 'Krzyżowa P'),
      Z('P1', 30, 62.5, 45, 37.5, 'Głębia'),
    ],
    mainShot: { toX: 80, toY: 55 },
    altShots: [{ toX: 18, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 30, toY: 55 }],
    notes: [
      'Atak przeciwnika z Z2 → piłka trafia na naszą lewą stronę. Idealne lustrzane odbicie Z4.',
      'System A: 1 blokujący (P3) + 3 obrońców.',
      'P4 (przód lewa) cofa się na linię 3 m, 3,5-4 m od siatki — kryje feintę i kiwki po lewej.',
      'P2 (przód prawa) opada w środek boiska po prawej — kryje krótką krzyżową.',
      'Jedyny obrońca w głębi P1 broni długiej krzyżowej (~7-7,5 m, 1 m od lewej linii).',
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
      Z('P1', 65, 43, 35, 57, 'Krótka krzyżowa'),
      Z('P5', 0, 43, 50, 57, 'Długa krzyżowa'),
      Z('P4', 0, 25, 35, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 22, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Atak przeciwnika z Z4 → piłka trafia na naszą prawą stronę.',
      'Formacja kwadrat (2-2 / box) → system A: 1 blokujący (P2) + 3 obrońców.',
      'P2 (przód prawa) solo blok naprzeciwko atakującego przeciwnika, bierze linię.',
      'P4 (przód lewa) jako off-blocker, 2-2,5 m od siatki — kryje feintę i ścięty atak po lewej.',
      'P5 broni długiej krzyżowej (~7 m, 0,5 m od lewej linii).',
      'P1 broni głębokiej linii / krótkiej krzyżowej (~7 m, w cieniu bloku).',
      'System B (blok 2-osobowy P2+P4) możliwy, ale zostawia tylko 2 obrońców — rezerwa dla mocnych atakujących.',
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
      Z('P5', 0, 40, 50, 60, 'Krzyżowa L'),
      Z('P1', 50, 40, 50, 60, 'Krzyżowa P'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 47.5 }],
    notes: [
      'Środkowy atak szybki (Z3) — krótkie kąty, mało czasu.',
      'Blok 2-osobowy (P4 + P2) zamyka środek — system B z 2 obrońcami za blokiem.',
      'P5 i P1 biorą krótkie krzyżowe (~7 m, 0,5-1 m od linii bocznych).',
      'Główna słabość: brak krótkiego pokrycia za blokiem, kwadrat nie ma gracza w środku boiska.',
      'Alternatywa: blok 1-osobowy (rola w stylu P3, tu P4 lub P2 sam) by uwolnić obrońcę feinty.',
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
      Z('P5', 0, 43, 35, 57, 'Krótka krzyżowa'),
      Z('P1', 50, 43, 50, 57, 'Długa krzyżowa'),
      Z('P2', 60, 25, 40, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 78, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Atak przeciwnika z Z2 → piłka trafia na naszą lewą stronę. Idealne lustrzane odbicie Z4.',
      'System A: 1 blokujący (P4) + 3 obrońców.',
      'P4 (przód lewa) solo blok naprzeciwko atakującego przeciwnika, bierze linię.',
      'P2 (rozgrywający-atakujący przód prawa) jako off-blocker, 2-2,5 m od siatki — anty-feinta + szybka tranzycja do celu.',
      'P1 broni długiej krzyżowej (~7 m, 0,5 m od prawej linii).',
      'P5 broni krótkiej głębokiej linii (~7 m, w cieniu bloku).',
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
      Z('P1', 65, 40, 35, 60, 'Linia P'),
      Z('P6', 33, 52, 34, 48, 'Oś'),
      Z('P5', 0, 43, 35, 57, 'Krzyżowa L'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 75 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 70 }, { toX: 18, toY: 40 }],
    notes: [
      'Atak przeciwnika z Z4 → piłka trafia na naszą prawą.',
      'Ustawienie 2F-3B (P4+P3 w linii ataku, P5+P6+P1 w tylnej linii, P1 wbiegający): blok 1-osobowy.',
      'P3 (środkowy bloku) blokuje sam po prawej — brak P2 do bloku 2-osobowego.',
      'P4 (przyjmujący) off-blocker, 2-2,5 m od siatki po lewej.',
      '3 obrońców w głębi: P5 długa krzyżowa, P6 oś centralna (~7-8 m), P1 prawa linia.',
      'System 1-1-3 (1 blokujący + 1 off-blocker + 3 obrońców) to obrona najbliższa perymetrycznej 6v6.',
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
      Z('P5', 0, 40, 33, 60, 'Krzyżowa L'),
      Z('P6', 33, 52, 34, 48, 'Oś'),
      Z('P1', 67, 40, 33, 60, 'Krzyżowa P'),
    ],
    mainShot: { toX: 50, toY: 75 },
    altShots: [{ toX: 22, toY: 65 }, { toX: 78, toY: 65 }],
    notes: [
      'Środkowy atak szybki (Z3) — krótkie kąty.',
      'Blok 1-osobowy (P3) czytający — szybka jest najtrudniejszym celem w 2F-3B.',
      'P4 zlateralizowany w środku boiska (~2 m od siatki) na odbicia od bloku.',
      'Zaleta: 3 obrońców w głębi (P5, P6, P1) kryje 3 główne strefy tylne.',
      'P6 naprzeciwko środkowego atakującego w jego korytarzu ataku (~7,5-8 m, oś).',
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
      Z('P5', 0, 40, 35, 60, 'Linia L'),
      Z('P6', 33, 52, 34, 48, 'Oś'),
      Z('P1', 65, 43, 35, 57, 'Krzyżowa P'),
      Z('P3', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 75 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 70 }, { toX: 80, toY: 40 }],
    notes: [
      'Atak przeciwnika z Z2 → piłka trafia na naszą lewą. Lustrzane odbicie Z4.',
      'Blok 1-osobowy: P4 blokuje sam po lewej stronie (brak P2 w 2F-3B).',
      'P3 (środkowy bloku) staje się off-blockerem po prawej, 2-2,5 m od siatki.',
      'P5 broni głębokiej lewej linii, P6 osi, P1 długiej krzyżowej.',
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
      { posNumber: 'P5', x: 0, y: 43, w: 50, h: 57, label: 'Długa krzyżowa', labelPos: { x: 18, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Cień bloku', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 62, y: 34, w: 38, h: 42, label: 'Linia', labelPos: { x: 70, y: 40 } },
      { posNumber: 'P4', x: 0, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 4, y: 33 } },
    ],
    mainShot: { toX: 22, toY: 77.5 },
    altShots: [
      { toX: 78, toY: 47.5 },
      { toX: 45, toY: 62.5 },
      { toX: 15, toY: 40 },
    ],
    notes: [
      { label: 'Pozycja 2 (atakujący / OPP)', text: 'Blokujący linię — blokuje, podchodzi do siatki po prawej stronie.' },
      { label: 'Pozycja 3 (środkowy bloku)', text: 'Zamyka krzyżową w bloku 2-osobowym z atakującym.' },
      { label: 'Pozycja 4 (przyjmujący off-blocker)', text: 'Cofa się na linię 3 m po lewej stronie — kryje krótki ścięty atak (ostra krzyżowa) i feinty.' },
      { label: 'Pozycja 5 (Libero)', text: 'Broni długiej krzyżowej, ~7-8 m od siatki, na wewnętrznym ramieniu środkowego bloku.' },
      { label: 'Pozycja 6 (środkowy tylny)', text: 'Wysokie piłki przelatujące blok, długie odbicia od bloku, oś ~8-8,5 m.' },
      { label: 'Pozycja 1 (tylny prawy)', text: 'Broni głębokiej linii w cieniu bloku, ~7-7,5 m od siatki, 0,5 m od prawej linii.' },
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
      { posNumber: 'P5', x: 0, y: 34, w: 36, h: 66, label: 'Krzyżowa L', labelPos: { x: 10, y: 70 } },
      { posNumber: 'P6', x: 32, y: 52, w: 36, h: 48, label: 'Oś', labelPos: { x: 42, y: 73 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 64, y: 34, w: 36, h: 66, label: 'Krzyżowa P', labelPos: { x: 75, y: 70 } },
      { posNumber: 'P4', x: 0, y: 25, w: 28, h: 28, label: 'Asekuracja', labelPos: { x: 4, y: 36 } },
      { posNumber: 'P2', x: 72, y: 25, w: 28, h: 28, label: 'Asekuracja', labelPos: { x: 78, y: 36 } },
    ],
    mainShot: { toX: 75, toY: 65 },
    altShots: [
      { toX: 25, toY: 65 },
      { toX: 50, toY: 80 },
    ],
    notes: [
      { label: 'Pozycja 3 (środkowy bloku)', text: 'Blok 1-osobowy czytający (read) lub commitment w zależności od scoutingu przeciwnika.' },
      { label: 'Pozycje 4 i 2 (przyjmujący)', text: 'Na linii ataku (~2-2,5 m od siatki, 0,5 m od linii bocznych): kryją odbicia od bloku i piłki przez blok.' },
      { label: 'Pozycja 5 (Libero)', text: 'Naprzeciwko środkowego atakującego, w jego korytarzu ataku (~7-8 m od siatki).' },
      { label: 'Pozycja 6 (środkowy tylny)', text: 'Ramiona zwrócone do atakującego; broni mocnej piłki przez blok (oś ~8-8,5 m).' },
      { label: 'Pozycja 1 (tylny prawy)', text: 'Przesuwa się o metr do przodu (~7,5 m od siatki, 1 m od prawej linii): krótsze kąty przy szybkich.' },
      { label: 'Kluczowa zasada', text: '"Zatrzymany na kontakcie": wszyscy zatrzymani i zrównoważeni w dokładnym momencie uderzenia.' },
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
      { posNumber: 'P1', x: 50, y: 43, w: 50, h: 57, label: 'Długa krzyżowa', labelPos: { x: 68, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Cień bloku', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P5', x: 0, y: 34, w: 38, h: 42, label: 'Linia', labelPos: { x: 10, y: 40 } },
      { posNumber: 'P2', x: 70, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 76, y: 33 } },
    ],
    mainShot: { toX: 78, toY: 77.5 },
    altShots: [
      { toX: 22, toY: 47.5 },
      { toX: 55, toY: 62.5 },
      { toX: 85, toY: 40 },
    ],
    notes: [
      { label: 'Pozycja 4 (przyjmujący)', text: 'Blokujący linię — blokuje przy siatce po lewej stronie.' },
      { label: 'Pozycja 3 (środkowy bloku)', text: 'Zamyka krzyżową w bloku 2-osobowym z przyjmującym.' },
      { label: 'Pozycja 2 (atakujący / OPP)', text: 'Staje się off-blockerem po prawej — cofa się na linię 3 m, kryje krótki ścięty atak i feinty.' },
      { label: 'Pozycja 5 (Libero)', text: 'Broni głębokiej linii w cieniu bloku, ~7-7,5 m od siatki, 0,5 m od lewej linii.' },
      { label: 'Pozycja 6 (środkowy tylny)', text: 'Wysokie piłki ponad blokiem, oś ~8-8,5 m od siatki.' },
      { label: 'Pozycja 1 (rozgrywający lub OH/OPP)', text: 'Broni długiej krzyżowej, ~7-8 m od siatki.' },
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
  { title: 'Atakujący daleko od siatki', action: 'PODEJDŹ', accentColor: 'var(--orange)',
    points: ['Wystawa 2-3 m od siatki', 'Nie może mocno smeczować', 'Wysokie ryzyko feinty lub roll shotu', 'Podejdź 1-2 metry'] },
  { title: 'Atakujący blisko siatki', action: 'COFNIJ SIĘ', accentColor: 'var(--plum)',
    points: ['Wystawa mniej niż 1 m od siatki', 'Może smeczować z pełną mocą', 'Szybka trajektoria w dół', 'Cofnij się tak daleko jak to możliwe'] },
  { title: 'Ramię atakującego', action: 'Obserwuj jego ramię atakujące', accentColor: 'var(--teal)',
    points: ['Wysokie ramię odciągnięte w tył = mocny smecz', 'Niskie ramię = prawdopodobna feinta', 'Rotacja ramienia = kierunek piłki', 'Dostosuj się w 0,5 s'] },
  { title: 'Doskok atakującego', action: 'Obserwuj jego doskok', accentColor: 'var(--ink)',
    points: ['Długi, szybki doskok = mocny smecz', 'Krótki doskok lub zatrzymanie = feinta', 'Kąt doskoku = strefa celu', 'Antycypuj siłę'] },
];

const COMMANDEMENTS = [
  ['Obserwuj rozgrywającego', 'Potem atakującego, nie piłkę'],
  ['Ta sama strona = Podejdź', 'Przeciwna strona = Cofnij się'],
  ['Zła wystawa przeciwnika', '→ Podejdź 1-2 m (prawdopodobna feinta)'],
  ['Nigdy w środku', 'Wybierz: do przodu LUB w tył'],
  ['Komunikuj się ZAWSZE', '"Moja!" przy każdej piłce którą bierzesz'],
  ['Ruszaj się po serwisie', 'Pozycja przy serwisie ≠ pozycja obronna'],
  ['Czytaj ramię', 'Wysokie ramię = smecz, niskie = feinta'],
  ['Niska postawa', 'Kolana ugięte, ręce gotowe'],
  ['Szybkie tranzycje', 'Max 3 sekundy na powrót'],
  ['Broń swojej strefy', 'Każdy gracz ma odpowiedzialność'],
];

type MistakesSection = {
  title: string;
  intro: string;
  mistakes: [string, string][];
};

const MISTAKES_BY_SIZE: Record<TeamSize, MistakesSection> = {
  6: {
    title: 'Dziesięć typowych błędów w ustawieniu obronnym',
    intro: 'Typologia oparta na pracach Mike\'a Heberta (Thinking Volleyball), Johna Formana (CoachingVB), USA Volleyball i podręczniku FIVB Top Volley.',
    mistakes: [
      ['1. Wchodzenie w cień bloku', 'Obrońcy instynktownie chowają się za blokującymi zamiast ustawiać się dookoła cienia bloku — zostawiając krzyżowe i trajektorie "obok bloku" otwarte. Hebert: "creeping into the block shadow".'],
      ['2. Błędne czytanie', 'Obrońca wpatruje się w piłkę zamiast śledzić sekwencję "piłka → rozgrywający → piłka → atakujący". Skutek: zgaduje zamiast czytać, i nie jest zatrzymany i zrównoważony w momencie kontaktu ("stopped and balanced at the moment of contact").'],
      ['3. Libero źle ustawione w głębi', 'Zbyt blisko siatki — nie może bronić głębokich smeczy; zbyt daleko — nie kryje feint. Zasada: ustaw zewnętrzne ramię na linii wewnętrznego ramienia środkowego bloku, 6-8 m od siatki w zależności od bloku.'],
      ['4. Rozgrywający-obrońca źle przygotowany', 'Postawa zbyt niska lub źle zorientowana uniemożliwiająca widzenie piłki + boiska przeciwnika; przedwczesne uwolnienie do celu tworzące dziurę w Z1; brak "release call" sygnalizującego opuszczenie obrony.'],
      ['5. Błędy overlapu', 'Najczęstsze: Z6 dryfuje przed Z3, Z5 dalej w prawo niż Z6, a rozgrywający opuszcza pozycję zbyt wcześnie aby się wbiec (błąd #1 w 5-1). W momencie kontaktu serwującego wszystkie stopy muszą respektować relacje przód/tył i lewo/prawo (Zasada 7.4).'],
      ['6. Zapomniana tranzycja odbiór → obrona', 'Gracze pozostają zamrożeni w formacji odbioru W zamiast przejść do bazowej pozycji obronnej gdy tylko rozgrywający przeciwnika dotknie piłki. Hebert: "sluggish recovery after play on the ball".'],
      ['7. Złe zarządzanie strefą 6', 'Zamieszanie między "6-up" (rotacja), "6-back" (perymetr) i "6-deep". Gracz Z6 musi przesuwać się bocznie w zależności od strony ataku przeciwnika, nie pozostawać wycentrowany. Odchylenie do tyłu przy odbiorze ("leaning back") przenosi ciężar na pięty i zabija reaktywność.'],
      ['8. Nieudana obrona przy ataku szybkim ze środka', 'Zbyt późne czytanie środkowego bloku przeciwnika; tylna linia nie posunięta do przodu (przy szybkich Z1 i Z5 muszą wejść o metr bo kąty są krótsze); "false stepping" (pierwszy krok w tył) który traci dostępny czas.'],
      ['9. Osierocone pokrycie feinty', 'Brak obrońcy wyraźnie przypisanego do feinty; "standing up on tips" — obrońca jest nisko na smecz, potem się prostuje i wyciąga do feinty, pozwalając piłce spaść tuż przed nim. Skupienie musi pozostać na smeczu w niskiej postawie umożliwiającej wyskok na feintę.'],
      ['10. Zbiorowa cisza', 'Brak wołań ("feinta!", "linia!", "aut!", "moja!"); blokujący nie komunikują orientacji linia vs krzyżowa; brak kapitana rotacji który sprawdzi overlapy przed serwisem.'],
    ],
  },
  5: {
    title: 'Typowe błędy w 5v5',
    intro: 'Błędy specyficzne dla formatu 5v5 (adaptacje z Volleyball Canada, VolleyballXL i doktryny 6v6).',
    mistakes: [
      ['1. Mechaniczne kopiowanie 6v6', 'Pokrycie 3 głębokich stref przez 3 obrońców działa (ustawienie 2F-3B), ale brakuje off-blockera który się cofa — strefa 3 m nie jest kryta jeśli nikt nie jest wyraźnie przypisany.'],
      ['2. Off-blocker w linii ataku klei się do siatki', 'Po kontakcie bloku off-blocker w linii ataku musi cofnąć się na 2-2,5 m by kryć feinty. Jeśli zostaje przy siatce, strefa za blokiem jest szeroko otwarta.'],
      ['3. 2 obrońców stojących obok siebie', 'W ustawieniu 3F-2B 2 obrońcy w głębi muszą być rozsunięci (jeden po lewej, drugi po prawej) a nie wycentrowani razem. Inaczej linie boczne są odsłonięte.'],
      ['4. Rozgrywający uwalnia się zbyt wcześnie (ustawienie wbiegające)', 'W ustawieniu 2F-3B z wbiegającym rozgrywającym z P1, musi on czekać aż piłka zostanie obroniona przed biegiem do swojego celu — inaczej otwiera się dziura w Z1.'],
      ['5. Zamieszanie przód/tył', 'Z 5 graczami pokusa by linia ataku broniła swojej strony pozostając na linii 3 m jest silna — ale to zostawia głębokie boisko otwarte. Linia ataku idzie do bloku, tylna linia broni głębi.'],
      ['6. Błędne czytanie', 'Brak jednego gracza wymaga jeszcze wcześniejszego czytania niż w 6v6. Sekwencja "piłka → rozgrywający → piłka → atakujący" + zrównoważone zatrzymanie w momencie kontaktu.'],
    ],
  },
  4: {
    title: 'Typowe błędy w 4v4',
    intro: 'Błędy specyficzne dla 4v4 halowego (intramurale uniwersyteckie, doktryna FFVb / Volleyball Canada, plażowa 4s).',
    mistakes: [
      ['1. Odizolowany blokujący bez pokrycia feinty', 'Wszyscy 3 obrońcy idą w głąb, zostawiając strefę 3-5 m pustą. Ktoś zawsze musi być przypisany do feinty 3,5-4 m od siatki.'],
      ['2. 2 obrońców w linii prostej', 'Obok siebie na tej samej głębokości → ścięty atak spada między nimi. W 4v4 obrońcy muszą być zawsze przesunięci (jeden bliżej, drugi dalej) lub rozłożeni bocznie.'],
      ['3. Rozgrywający uwalniający się do celu przed obroną piłki', 'Przedwczesna tranzycja zostawiająca dziurę w obronie. Rozgrywający czeka na potwierdzenie odzyskania piłki przed pójściem do swojego celu.'],
      ['4. Brak sygnału między blokującym a obrońcami', 'Blokujący MUSI sygnalizować "linia" lub "krzyżowa" przed rozpoczęciem ataku. Bez tego 3 obrońcy nie wiedzą co kryć — każdy improwizuje.'],
      ['5. Obrońca feinty zbyt daleko od siatki', 'Cofa się z innymi tylnymi obrońcami i nie może już kryć krótkich feint. Jego pozycja to 3,5-4 m od siatki, oś — nie 7 m.'],
      ['6. "Losowe" blokowanie złego gracza', 'W 4v4 blokowanie źle ustawionym graczem (daleko od atakującego) zostawia przeciwnika naprzeciw 3 źle ustawionych obrońców. Blokujący musi być tym naprzeciwko głównego atakującego.'],
      ['7. Błędne czytanie', 'Przy ~40 m² na obrońcę (vs 20 m² w 6v6) błąd czytania jest nie do nadrobienia. Antycypacja = umiejętność #1 w 4v4.'],
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
    title: 'Trzy główne systemy obrony (FIVB / USAV)',
    warning: {
      label: '⚠ Ostrzeżenie terminologiczne',
      text: 'Wyrażenie "obrona W" często słyszane we Francji jest nieprawidłowe. "Formacja W" odnosi się historycznie do 5-osobowej formacji odbioru zagrywki — nie do systemu obrony. Doktryna międzynarodowa (FIVB, USAV IMPACT, Liskevych, Stone) wyróżnia trzy systemy: man-up (2-1-3), perymetryczny (2-0-4) i rotacyjny (3-2-1).',
    },
    systems: [
      {
        name: 'Obrona man-up (2-1-3)',
        tag: 'Dawniej "obrona W" / czerwona obrona',
        principe: 'Obrońca podchodzi na linię 3 m za blokiem aby przechwytywać feinty i roll shoty. Dwóch blokujących przy siatce, off-blocker cofa się, a trzech graczy w głębi kryje długie kąty.',
        forces: ['Wyjątkowe pokrycie feint, roll shotów i "śmieciowych" piłek za blokiem', 'Szybka tranzycja do ataku jeśli podchodzącym graczem jest rozgrywający', 'Proste w nauczaniu młodych drużyn'],
        faiblesses: ['Tylko 3 obrońców w głębi — wrażliwa na mocne ciasne krzyżowe smecze', 'Atakujący który bije mocno między blokujących łatwo przebija'],
        indication: 'Młode drużyny, szkolne, taktyczni przeciwnicy grający dużo feint lub off-speed shotów.',
        accent: 'var(--orange)',
      },
      {
        name: 'Obrona perymetryczna (2-0-4)',
        tag: 'Biała obrona — dominujący system na elitarnym poziomie męskim',
        principe: 'Czterech obrońców w głębi tworzy U otwarte w stronę siatki, prawie na liniach bocznych i końcowej — "jedna stopa na linii" (Liskevych). Środek boiska jest celowo opuszczony.',
        forces: ['Doskonałe pokrycie mocnych smeczy, linii i głębokich rogów', 'Prosty ruch zbiorowy', 'Dominujący system w nowoczesnej międzynarodowej siatkówce męskiej'],
        faiblesses: ['Bardzo wrażliwa na krótkie feinty za blokiem — strefa centralna między 3 a 5 m jest otwarta', 'Wymaga atletycznych obrońców zdolnych do nurkowania do przodu'],
        indication: 'Seniorski, męski, międzynarodowy poziom, mocni przeciwnicy.',
        accent: 'var(--teal)',
      },
      {
        name: 'Obrona rotacyjna / slide defense (3-2-1)',
        tag: 'Rotational / slide defense',
        principe: 'Trzech obrońców w głębi przesuwa się w stronę strony ataku przeciwnika: atakujący tylny podchodzi za blok (feinta), środkowy przesuwa się w stronę atakowanej linii, obrońca po atakowanej stronie bierze krótki kąt.',
        forces: ['Doskonałe pokrycie głębokiej linii ORAZ feinty jednocześnie', 'Bardzo elastyczny system', 'Szybka tranzycja rozgrywającego gdy rozgrywający jest w P1'],
        faiblesses: ['Jeden obrońca mniej w głębi (jeden gracz dedykowany feincie)', 'Przeciwny róg po przekątnej wrażliwy', 'Wymaga wysokich umiejętności czytania i koordynacji'],
        indication: 'Przeciwnicy mieszający siłę z liniami/feintami; poziom średniozaawansowany do elitarnego.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['Man-up 2-1-3', 'Perym. 2-0-4', 'Rotacja 3-2-1'],
    tableRows: [
      ['Gracz wbiegający za blok', 'Tak', 'Nie', 'Tak'],
      ['Obrońcy w głębi', '3', '4', '2'],
      ['Pokrycie feinty', '★★★', '★', '★★'],
      ['Pokrycie mocnego smecza', '★★', '★★★', '★★'],
      ['Pokrycie głębokiej linii', '★★', '★★', '★★★'],
      ['Pokrycie ciasnej krzyżowej', '★', '★★★', '★★'],
      ['Typowa pozycja libero', 'Z5 lub Z6', 'Z5 (na linii)', 'Z5 ślizga się'],
      ['Złożoność', 'Niska', 'Średnia', 'Wysoka'],
    ],
    footer: {
      strong: 'Wybór nie jest kwestią ortodoksji: ',
      text: 'zależy od ofensywnego profilu przeciwnika i jakości twoich obrońców. Nowoczesna obrona jest definiowana mniej przez formację a bardziej przez czytanie — sekwencja wzrokowa "piłka → rozgrywający → piłka → atakujący" i zrównoważone zatrzymanie w momencie kontaktu.',
    },
  },
  5: {
    title: 'Trzy systemy obrony w 5v5',
    warning: {
      label: '⚠ Format nieoficjalny FIVB',
      text: 'Halowa 5v5 nie ma dedykowanego regulaminu FIVB ani FFVb. Te trzy systemy to logiczne adaptacje 6v6 udokumentowane przez VolleyballXL, The Art of Coaching Volleyball i Volleyball Canada. Nie istnieje oficjalny podręcznik techniczny 5v5 — wybierz system na podstawie ustawienia drużyny (2-3 lub 3-2).',
    },
    systems: [
      {
        name: 'System 1-1-3',
        tag: '1 blokujący + 1 pokrywający feintę + 3 obrońców w głębi',
        principe: 'Pasuje do ustawienia 2F-3B (2 w linii ataku, 3 w tylnej linii). Blokujący skacze sam; drugi gracz linii ataku cofa się jako off-blocker 2-3 m od siatki na feinty; 3 obrońców w głębi kryje linię, oś i długą krzyżową.',
        forces: ['3 obrońców w głębi jak w perymetrze 6v6 — dobre pokrycie smeczy', 'Ustawienie najbliższe 6v6 5-1 (przygotowanie do przejścia na 6v6)', 'Feinta kryta przez off-blockera'],
        faiblesses: ['Tylko blok 1-osobowy → kruchy przeciw mocnym atakującym', 'Off-blocker 2-3 m za siatką musi być bardzo reaktywny'],
        indication: 'Ustawienie 2F-3B (wbiegający rozgrywający), umiarkowanie mocni przeciwnicy. Zalecany system dla pedagogicznego przejścia do 6v6.',
        accent: 'var(--teal)',
      },
      {
        name: 'System 2-1-2',
        tag: '2 blokujących + 1 feinta + 2 obrońców w głębi',
        principe: 'Pasuje do ustawienia 3F-2B (3 w linii ataku, 2 w tylnej linii). Blok 2-osobowy przy siatce, środkowy linii ataku kryje feintę 2-3 m od siatki, 2 obrońców w głębi bierze długą krzyżową i linię.',
        forces: ['Blok 2-osobowy jak w 6v6 — znacznie skuteczniejszy przeciw mocnym smeczom', '3 atakujących przy siatce do kontrataku'],
        faiblesses: ['Tylko 2 obrońców w głębi → 9 m tylnego boiska bardzo trudne do pokrycia', 'Wysokie wymagania atletyczne dla 2 obrońców tylnej linii'],
        indication: 'Ustawienie 3F-2B przeciw bardzo mocnym drużynom. Preferuj na koniec seta gdy każdy punkt się liczy.',
        accent: 'var(--orange)',
      },
      {
        name: 'System 1-2-2',
        tag: 'Zaadaptowane man-up (odpowiednik 6v6 2-1-3)',
        principe: 'Solo blokujący + 2 pokrywających strefę przednią (feinta + za blokiem) + 2 obrońców w głębi. Pasuje gdy przeciwnik dużo feintuje lub do drużyn początkujących.',
        forces: ['Doskonałe pokrycie krótkich feint (2 pokrywających strefę przednią)', 'Feinta trudna do wykorzystania przez przeciwnika'],
        faiblesses: ['Tylko 2 obrońców w głębi → mocne smecze trudne', 'Wymaga koordynacji między 2 pokrywającymi strefę przednią'],
        indication: 'Przeciwnicy którzy dużo feintują; siatkówka kobiet, kategorie młodzieżowe, techniczne drużyny.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['1-1-3', '2-1-2', '1-2-2 (man-up)'],
    tableRows: [
      ['Blokujący', '1', '2', '1'],
      ['Pokrywający strefę przednią', '1 (off-blocker)', '1 (feinta)', '2 (feinta + za blokiem)'],
      ['Obrońcy w głębi', '3', '2', '2'],
      ['Pokrycie feinty', '★★', '★★', '★★★'],
      ['Pokrycie mocnego smecza', '★★', '★★★', '★★'],
      ['Pokrycie tylnego boiska', '★★★', '★★', '★★'],
      ['Pasujące ustawienie', '2F-3B', '3F-2B', '2F-3B / 3F-2B'],
      ['Złożoność', 'Niska', 'Średnia', 'Wysoka'],
    ],
    footer: {
      strong: 'Rekomendacja 5v5: ',
      text: 'system 1-1-3 w ustawieniu 2F-3B z wbiegającym rozgrywającym to obrona najbliższa 6v6 — idealna jako przejście pedagogiczne. System 2-1-2 jest uzasadniony tylko przeciw naprawdę mocnym atakującym.',
    },
  },
  4: {
    title: 'Trzy systemy obrony w 4v4',
    warning: {
      label: '⚠ Format nieoficjalny FIVB',
      text: 'Halowa 4v4 nie ma oficjalnego regulaminu FIVB. Te trzy systemy pochodzą z praktyki intramurali uniwersyteckich (USA), podręczników przejścia pedagogicznego FFVb / Volleyball Canada i literatury plażowej (Brandon Joyner, Better at Beach). Z 4 graczami każdy obrońca kryje ~30-40 m² (vs 20 m² w 6v6) — antycypacja jest umiejętnością #1.',
    },
    systems: [
      {
        name: 'System A: 1 blokujący + 3 obrońców',
        tag: 'Najczęstszy w halowej 4v4',
        principe: 'Pojedynczy gracz idzie do bloku naprzeciwko głównego atakującego. Pozostała 3 dzieli się: obrońca feinty (3-4 m od siatki, oś), obrońca krzyżowej (7-7,5 m, prawa linia, długa krzyżowa), obrońca linii (7-7,5 m, w cieniu bloku).',
        forces: ['Kryje feintę, linię i długą krzyżową jednocześnie', 'Najbardziej zbalansowany w 4v4', 'Sygnał blokującego linia/krzyżowa bardzo skuteczny'],
        faiblesses: ['Blok 1-osobowy — wrażliwy na mocnych atakujących', 'Wymaga zdyscyplinowanego obrońcy feinty który się nie cofa'],
        indication: 'Przeciwnicy równorzędnego lub umiarkowanego poziomu. Najbardziej wszechstronne ustawienie w 4v4 (formacja romb lub linia 3-1).',
        accent: 'var(--orange)',
      },
      {
        name: 'System B: 2 blokujących + 2 obrońców',
        tag: 'Blok 2-osobowy (rzadki w 4v4)',
        principe: '2 graczy linii ataku idzie razem do bloku naprzeciwko głównego atakującego. 2 z tylnej linii ustawiają się: jeden po stronie linii (7 m, 1 m od linii), drugi na osi lekko przesunięty w stronę krzyżowej. Feinta nie jest kryta.',
        forces: ['Blok 2-osobowy znacznie skuteczniejszy przeciw mocnym smeczom', 'Maksymalna presja na atakującego przeciwnika'],
        faiblesses: ['Tylko 2 obrońców w polu → niemożliwe pokrycie wszystkiego', 'Feinta za blokiem zupełnie nie kryta', 'Wymusza wybór: linia LUB krzyżowa, nie obie'],
        indication: 'Tylko przeciw bardzo mocnym atakującym bez finezji (brak feint). Ustawienie kwadrat 2-2 lub linia 3-1.',
        accent: 'var(--plum)',
      },
      {
        name: 'System C: 0 blokujących',
        tag: 'Niska obrona (przeciwnicy nie smeczujący)',
        principe: 'Żaden gracz nie idzie do bloku. 4 graczy broni głębi: 2 w środku boiska (3-4 m) na feinty, 2 w głębi (7-8 m) na głębsze piłki. Rozgrywający pełni rolę 4. obrońcy.',
        forces: ['Kryje całą głębokość boiska', 'Dobrze pasuje do powolnych wymian'],
        faiblesses: ['PRZECIWSKUTECZNY gdy tylko przeciwnik bije poważnie (smecz przechodzi bez przeszkód)', 'Brak presji przy siatce'],
        indication: 'Poziomy szkolne, rekreacyjny początkujący, przeciwnicy którzy nie smeczują. Unikać gdy tylko przeciwnik zyskuje siłę.',
        accent: 'var(--teal)',
      },
    ],
    tableHeaders: ['System A', 'System B', 'System C'],
    tableRows: [
      ['Blokujący', '1', '2', '0'],
      ['Obrońcy w głębi', '3', '2', '4'],
      ['Pokrycie feinty', '★★', '★', '★★★'],
      ['Pokrycie mocnego smecza', '★★', '★★★', '★ (brak bloku)'],
      ['Pokrycie głębokiej linii', '★★', '★★', '★★'],
      ['Pokrycie długiej krzyżowej', '★★★', '★★', '★★'],
      ['Zalecani przeciwnicy', 'Wszystkie poziomy', 'Bardzo mocni', 'Niesmeczujący'],
      ['Złożoność', 'Niska', 'Średnia', 'Niska'],
    ],
    footer: {
      strong: 'Rekomendacja 4v4: ',
      text: 'system A (1 blokujący + 3 obrońców) to niemal uniwersalny domyślny. System B jest uzasadniony tylko przeciw naprawdę mocnym atakującym na koniec seta. System C działa tylko na poziomie rekreacyjnym początkującym — gdy tylko przeciwnik zaczyna smeczować, wróć do systemu A.',
    },
  },
};

const EXERCICES = [
  { title: 'Czytanie sytuacji', level: 'Początkujący', duration: '10 min', materiel: '1 trener lub partner z piłkami',
    objectif: 'Naucz się szybko identyfikować strefę ataku',
    steps: ['Trener stoi po drugiej stronie siatki w strefie 4, 3 lub 2', 'Startujesz ze środka boiska', 'Trener ogłasza strefę i podrzuca piłkę', 'Musisz dotrzeć do swojej strefy obronnej w 2-3 sekundy', 'Powtórz 20 razy zmieniając strefy'] },
  { title: 'Podejdź / cofnij się w zależności od wystawy', level: 'Średniozaawansowany', duration: '15 min', materiel: '1 rozgrywający, 1 atakujący, kilku obrońców',
    objectif: 'Dostosuj swoją pozycję na podstawie jakości wystawy',
    steps: ['Rozgrywający dostarcza wystawy różnej jakości atakującemu', 'Wystawa blisko siatki → Cofasz się (spodziewany mocny smecz)', 'Wystawa daleko od siatki → Podchodzisz (prawdopodobna feinta)', 'Atakujący atakuje a ty bronisz', 'Trener koryguje twoją pozycję po każdej piłce'] },
  { title: 'Komunikacja obronna', level: 'Wszystkie poziomy', duration: '10 min', materiel: 'Pełna drużyna',
    objectif: 'Rozwijaj automatyczną komunikację',
    steps: ['Mecz w twoim formacie (4v4, 5v5 lub 6v6) ale KRZYCZĄC każde wołanie', 'Kara: -1 punkt jeśli gracz nie krzyknie "Moja!" przy swojej piłce', 'Bonus: +1 punkt jeśli cała drużyna komunikuje się w wymianie', 'Każdy gracz musi ogłosić strefę ataku przeciwnika'] },
  { title: 'Obrona przeciw feintom', level: 'Średniozaawansowany', duration: '15 min', materiel: '1 atakujący, 3 obrońców w głębi',
    objectif: 'Popraw obronę krótkich piłek',
    steps: ['Atakujący gra TYLKO feinty i roll shoty', 'Obrońcy muszą wszyscy podejść (3-4 m)', 'Cel: odzyskać 8 z 10 piłek', 'Potem zmieniaj: 5 feint, 5 smeczy aby ćwiczyć adaptację'] },
  { title: 'Szybkie tranzycje', level: 'Zaawansowany', duration: '20 min', materiel: 'Pełna drużyna',
    objectif: 'Opanuj zmiany atak-obrona',
    steps: ['Normalna gra ale trener mierzy czasy tranzycji', 'Cel: być w pozycji obronnej w mniej niż 3 sekundy', 'Jeśli zbyt wolno, drużyna robi 5 pompek i zaczyna od nowa', 'Stopniowo zwiększaj tempo wymian'] },
  { title: 'Czytanie atakującego', level: 'Zaawansowany', duration: '15 min', materiel: '1 atakujący, obrońcy',
    objectif: 'Antycypuj na podstawie języka ciała',
    steps: ['Atakujący zmienia smecz, feintę, kiwkę bez ostrzeżenia', `Przed jego uderzeniem obrońca ogłasza swoją prognozę: "Smecz!" lub "Feinta!"`, 'Punkt jeśli prognoza jest poprawna ORAZ piłka jest obroniona', 'Skup się na: ramieniu, doskoku, pozycji względem siatki'] },
];

type GuidePositionnementProps = {
  teamSize?: TeamSize;
  configId?: string;
};

export default function GuidePositionnementPl({ teamSize: teamSizeProp, configId: configIdProp }: GuidePositionnementProps = {}) {
  const lang = useCurrentLang();
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
      return <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>Diagram niedostępny dla tego ustawienia.</div>;
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
        <div style={S.label}>Konfiguracja twojej drużyny</div>
        <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
          Wybierz swój format i ustawienie taktyczne: <strong>cała zawartość przewodnika</strong> (pozycje, strefy, obrona według ataku) dostosuje się.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Format gry</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TEAM_SIZES.map(slug => {
              const isActive = SLUG_TO_SIZE[slug] === teamSize;
              return (
                <Link
                  key={slug}
                  to={`/${lang}/guides/positionnement-defense/${slug}`}
                  style={{ ...(isActive ? btnActive : btnBase), textDecoration: 'none' }}
                >
                  {slug}
                </Link>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Ustawienie taktyczne</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {configurations.map(c => (
              <Link
                key={c.id}
                to={`/${lang}/guides/positionnement-defense/${SIZE_TO_SLUG[teamSize]}/${c.id}`}
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
        <div style={S.label}>Podstawowa zasada obrony</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0' }}>Ustawienie obronne zależy od 3 głównych czynników:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Twojej pozycji (linia ataku lub tylna linia)', 'Strefy ataku przeciwnika (strefa 4, 3, 2)', 'Typu ataku (mocny smecz, feinta, kiwka)'].map((pt, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={S.bullet}>▸</span>
              <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Positions and zones */}
      <section>
        <h2 style={S.section}>1. Pozycje i strefy — {configuration.shortName} ({teamSize}v{teamSize})</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            Ustawienie twojej drużyny w {configuration.name}
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
              to={`/${lang}/positions/${SIZE_TO_SLUG[teamSize]}/${configuration.id}`}
              style={{
                display: 'inline-block', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em',
                color: 'var(--orange)', border: '2.5px solid var(--orange)', padding: '6px 16px',
                textDecoration: 'none',
              }}
            >
              Zobacz każdą pozycję szczegółowo na /positions →
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--ink)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Ważna zasada: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>
            {teamSize === 6 && 'Gracze tylnej linii (5, 6, 1) NIE MOGĄ blokować przy siatce. Bronią w tylnym boisku.'}
            {teamSize === 5 && 'Z 5 graczami każdy obrońca kryje ~30 m² (vs 20 m² w 6v6). Czytanie staje się krytyczne.'}
            {teamSize === 4 && 'Brak libero. Każdy gracz broni ~30-40 m². Antycypacja jest umiejętnością #1.'}
          </span>
        </div>
      </section>

      {/* 2. Positioning by zone */}
      <section>
        <h2 style={S.section}>2. Ustawienie według strefy ataku przeciwnika</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button key={z} onClick={() => setZone(z)} style={zone === z ? btnActive : btnBase}>
              {z === 'zone4' ? 'Atak ze strefy 4' : z === 'zone3' ? 'Atak ze strefy 3' : 'Atak ze strefy 2'}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {teamSize}v{teamSize} · {configuration.shortName} — {
              zone === 'zone4' ? 'Obrona przeciw atakowi ze strefy 4 (lewe skrzydło przeciwnika)' :
              zone === 'zone3' ? 'Obrona przeciw atakowi ze strefy 3 (środek)' :
              'Obrona przeciw atakowi ze strefy 2 (prawe skrzydło przeciwnika)'
            }
          </div>
          {renderZoneTab()}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <span><span style={{ color: 'var(--orange)' }}>■</span> <span style={{ color: 'var(--ink)', opacity: 0.6 }}>Strefa odpowiedzialności</span></span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>BLK</strong> = blok</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>OFF</strong> = off-blocker</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>DEF</strong> = obrona</span>
        </div>
      </section>

      {/* 3. General principles */}
      <section>
        <h2 style={S.section}>3. Ogólne zasady ustawienia</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={S.labelTeal}>Strefy odpowiedzialności</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          {[
            { title: 'Gracze linii ataku',
              points: ['Priorytet: blok przy siatce', 'Jeśli nie blokują: bronią przeciwnej linii', 'Odległość: przy siatce lub tylne boisko'] },
            { title: teamSize === 4 ? 'Jedyny obrońca w głębi (P1)' : 'Filar obronny (Libero / P6)',
              points: teamSize === 4
                ? ['Pozycja: środek, ~40 m² do pokrycia', 'Odległość: 5-6 m od siatki', 'Rola: jedyny filar obrony, maksymalna antycypacja']
                : ['Pozycja: środek, elastyczna', 'Odległość: 5-6 m od siatki', 'Rola: filar obrony, kryje środek'] },
            { title: 'Zewnętrzni obrońcy w głębi',
              points: ['Zmienna rola: podejdź lub cofnij się', 'Atakowana strona: podejdź (3-4 m)', 'Przeciwna strona: cofnij się (6-7 m)'] },
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
            ★ Uniwersalne zasady obrony (4v4 / 5v5 / 6v6)
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px 0', lineHeight: 1.5 }}>
            Te zasady z prac Heberta, Liskevycha i Volleyball Canada obowiązują niezależnie od liczby graczy na boisku.
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Blok jest podstawą', 'Obrońcy w głębi ustawiają się względem cienia bloku i jego orientacji — nie niezależnie.'],
              ['Zatrzymany i zrównoważony w momencie kontaktu', 'Każdy obrońca który nadal się porusza gdy atakujący dotyka piłki widzi swoją reaktywność załamaną ("stopped on contact").'],
              ['Sekwencyjne czytanie wzrokowe', '"Piłka → rozgrywający przeciwnika → piłka → atakujący przeciwnika". W 4v4 i 5v5 brakujący gracze wymuszają jeszcze wcześniejsze czytanie.'],
              ['Komunikacja sygnałowa', 'Nawet na poziomie rekreacyjnym blokujący musi sygnalizować "linia" lub "krzyżowa" — bez tego obrońcy w głębi nie wiedzą co kryć.'],
              ['Strefa przednia kryta', 'Ktoś musi kryć 3-5 m za blokiem — jest to najbardziej zaniedbana strefa w formatach zredukowanych (4v4 / 5v5).'],
              ['Szybka tranzycja', 'Rozgrywający nigdy nie może uwolnić się do celu przed potwierdzeniem że piłka została obroniona ("release call").'],
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
        <h2 style={S.section}>4. Czytanie atakującego: wskazówki wzrokowe</h2>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Twoje ustawienie musi dostosować się do tego co widzisz. Oto kluczowe wskazówki:
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
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>W 2 sekundach po serwisie przeciwnika skup wzrok na rozgrywającym, potem NATYCHMIAST na atakującym który będzie atakował.</span>
        </div>
      </section>

      {/* 5. When to step up / drop back */}
      <section>
        <h2 style={S.section}>5. Kiedy podchodzić lub się cofać?</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, marginBottom: 14 }}>Szybkie drzewo decyzyjne</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderLeft: '4px solid var(--orange)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--orange)', letterSpacing: '0.08em' }}>Podejdź (3-4 m od siatki) gdy:</div>
              {[
                'Jesteś po tej samej stronie co atakujący',
                'Atakujący jest daleko od siatki (zła wystawa)',
                'Przewidujesz feintę lub roll shot',
                'Blok jest solidny — mniej mocnych piłek przechodzi',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={S.bulletOrange}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '4px solid var(--ink)', paddingLeft: 16, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.08em' }}>Cofnij się (6-7 m od siatki) gdy:</div>
              {[
                'Jesteś po przeciwnej stronie niż atakujący',
                'Atakujący ma dobrą wystawę blisko siatki',
                'Atakujący jest mocny lub wysoki',
                'Blok jest słaby (tylko 1 blokujący)',
                'Bronisz krzyżowej (najdłuższa trajektoria)',
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
        <h2 style={S.section}>7. Ustawienie przy serwisie</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            <strong>Twoje ustawienie przy serwisie jest INNE niż pozycja obronna. </strong>
            Gdy tylko serwis poleci, musisz się przeustawić.
          </p>
        </div>
        <div style={S.card}>
          <div style={{ ...S.labelTeal, marginBottom: 12 }}>Tranzycja serwis → obrona</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Twoja drużyna serwuje', 'Jesteś w pozycji rotacji'],
              ['Serwujący uderza', 'Obserwujesz rozgrywającego przeciwnika'],
              ['Rozgrywający dotyka piłki', 'Ruszasz w stronę swojej strefy obronnej'],
              ['Atakujący wyskakuje', 'Jesteś w końcowej pozycji, gotowy do reakcji'],
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
        <h2 style={S.section}>8. Komunikacja obronna</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>Cicha obrona to nieskuteczna obrona.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { moment: 'Przed atakiem przeciwnika', calls: [['"Numer 4!"', 'Ogłoś strefę z której idzie atak'], ['"Dwóch w bloku!"', 'Wskaż liczbę blokujących'], ['"Linia otwarta!"', 'Jeśli blok nie kryje linii'], [`"Podchodzę!" / "Cofam się!"`, 'Ogłoś swój ruch']] },
            { moment: 'W trakcie akcji', calls: [[`"Moja!" / "Mam ją!"`, 'Bierzesz piłkę (NAJWAŻNIEJSZE)'], ['"Twoja!" / "Ty!"', 'Zostawiasz piłkę partnerowi'], ['"Aut!"', 'Piłka leci na aut, nie dotykaj'], ['"Zablokowane!"', 'Jeśli blokujesz, zawołaj']] },
            { moment: 'Po akcji', calls: [['"Asekuracja!"', 'Wołanie o asekurację ataku'], ['"Free!"', 'Free ball, reset'], ['"Stój!"', 'Zostaw obronę w miejscu']] },
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
          <strong style={{ color: 'var(--ink)' }}>Złota zasada: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>Gdy są wątpliwości między dwoma graczami, gracz bardziej z przodu ZAWSZE bierze piłkę.</span>
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
                    <div style={S.labelTeal}>Mocne strony</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.forces.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={S.bullet}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.55 }}>Słabości</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.faiblesses.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sys.accent, marginTop: 6 }}>
                      Stosuj gdy: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{sys.indication}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div style={{ ...S.card, marginTop: 14, overflowX: 'auto' }}>
                <div style={{ ...S.label, marginBottom: 10 }}>Tabela porównawcza</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.6 }}>Kryterium</th>
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
        <h2 style={S.section}>10. Tranzycje atak ↔ obrona</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Siatkówka to gra szybkich tranzycji. Nieustannie przełączasz się między atakiem a obroną.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Tranzycja atak → obrona', items: [['Twój partner atakuje', 'Przygotuj się mentalnie do obrony'], ['Piłka jest odbita', 'Natychmiast zidentyfikuj kto będzie atakował'], ['Szybki ruch', 'Dotrzyj do swojej strefy obronnej (max 2-3 sekundy)'], ['Niska postawa', 'Ugnij kolana, gotowy do nurkowania']] },
            { label: 'Tranzycja obrona → atak', items: [['Bronisz piłki', 'Dokładne podanie do rozgrywającego'], ['Jeśli jesteś w LINII ATAKU', 'Biegnij do siatki by atakować lub blokować'], ['Jeśli jesteś w TYLNEJ LINII', 'Cofnij się lekko, gotowy do asekuracji ataku'], ['Asekuracja ataku', 'Otocz swojego atakującego (w półkolu 2-3 m)']] },
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
        <h2 style={S.section}>11. Ćwiczenia do poprawy</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{i + 1}. {ex.title}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 8px', border: '1.5px solid var(--ink)', color: 'var(--ink)', background: 'var(--cream)', flexShrink: 0 }}>{ex.level}</span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, marginBottom: 6 }}>
                Czas trwania: {ex.duration} · Sprzęt: {ex.materiel}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 8 }}>
                Cel: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{ex.objectif}</span>
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
        <h2 style={S.section}>12. 10 przykazań obrońcy</h2>
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
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Ta sama strona co atakujący</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--orange)', marginBottom: 4 }}>→ PODEJDŹ (3-4 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Broń feint i roll shotów</div>
            </div>
            <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Przeciwna strona niż atakujący</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>→ COFNIJ SIĘ (6-7 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Broń długich krzyżowych</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>Podsumowanie</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            Ustawienia obronnego uczymy się przez praktykę i doświadczenie. Nie zniechęcaj się jeśli popełniasz
            błędy na początku — nawet zawodowcy nieustannie dostosowują swoje ustawienie.
          </p>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: 0 }}>
            Klucz: stosuj podstawową zasadę (ta sama strona = podejdź, przeciwna = cofnij się), obserwuj atakującego,
            komunikuj się z partnerami i nigdy nie bój się rzucić po piłkę.
          </p>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, color: 'var(--ink)', margin: 0, letterSpacing: '0.06em' }}>Obrona wygrywa mecze.</p>
        </div>
      </section>

    </div>
  );
}
