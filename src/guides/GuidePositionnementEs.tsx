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
      Z('P1', 65, 40, 35, 60, 'Z1 corta'),
      Z('P5', 0, 43, 50, 57, 'Diagonal larga'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Ataque rival por Z4 (su punta izquierda) → la pelota llega por nuestro lado derecho.',
      'Sistema 2-1-2: bloqueo a 2 jugadores (P2 línea opuesto + P3 diagonal) + 2 defensores profundos.',
      'P4 (punta) como off-blocker, a 2-2,5 m de la red, 1 m de la banda — cubre fintas y dejadas.',
      'P5 (~7-7,5 m, 0,5 m de la línea izquierda) defiende la diagonal larga.',
      'P1 (~7-7,5 m, 0,5 m de la línea derecha) defiende la paralela profunda, a la sombra del bloqueo.',
      'Trayectoria principal defendida: diagonal larga (estadísticamente la más frecuente).',
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
      Z('P5', 0, 40, 50, 60, 'Diagonal I'),
      Z('P1', 50, 40, 50, 60, 'Diagonal D'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 82 }],
    notes: [
      'Ataque rápido central (Z3) — ángulos cortos, poco tiempo de reacción.',
      'Bloqueo a 1 jugador: P3 (central) en lectura, sin posibilidad de commit.',
      'P4 y P2 (off-blockers) a 2 m de la red sobre la línea de ataque — cubren los rebotes.',
      'P5 y P1 1 m adelantados (~7 m de la red) — los ángulos son más cortos que en pelotas altas.',
      'Punto débil: ningún defensor profundo central dedicado (solo 2 zagueros en 5v5).',
      'Regla clave: "parados al contacto" — todos detenidos y equilibrados en el instante del golpe.',
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
      Z('P5', 0, 40, 35, 60, 'Z5 corta'),
      Z('P1', 50, 43, 50, 57, 'Diagonal larga'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Ataque rival por Z2 (su punta derecha) → la pelota llega por nuestro lado izquierdo. Espejo perfecto de Z4.',
      'Bloqueo a 2 jugadores: P4 (línea exterior) + P3 (centro diagonal).',
      'P2 (opuesto / colocador) como off-blocker, a 2-2,5 m de la red por el lado derecho.',
      'P1 (~7-7,5 m, 1 m de la línea derecha) defiende la diagonal larga.',
      'P5 (~7-7,5 m, 0,5 m de la línea izquierda) defiende la paralela profunda a la sombra del bloqueo.',
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
      Z('P1', 65, 40, 35, 60, 'Z1 corta'),
      Z('P5', 0, 43, 50, 57, 'Diagonal larga'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 35, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Ataque rival por Z4 → la pelota llega por nuestro lado derecho.',
      'Sistema 3F-2B: 3 delanteros → bloqueo a 2 jugadores favorable (P3 + P2 colocador-bloqueador).',
      'P4 (punta) off-blocker corto por el lado izquierdo sobre la línea de ataque (~2-2,5 m de la red).',
      'P5 defiende la diagonal larga (~7 m, 0,5 m de la línea izquierda).',
      'P1 defiende la paralela derecha profunda a la sombra del bloqueo (~7 m, 0,5 m de la línea derecha).',
      'Inconveniente: solo 2 zagueros → más de 30 m² por defensor (vs 20 m² en 6v6).',
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
      Z('P5', 0, 40, 50, 60, 'Diagonal I'),
      Z('P1', 50, 40, 50, 60, 'Diagonal D'),
    ],
    mainShot: { toX: 50, toY: 82 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 75, toY: 70 }],
    notes: [
      'Ataque rápido central (Z3) — ángulos cortos.',
      'Con 3 delanteros, un bloqueo a 3 es posible pero deja solo 2 defensores en cancha — no recomendado.',
      'Recomendado: bloqueo a 2 jugadores (P3 + el punta más cercano al pasillo de ataque).',
      'P5 y P1 1 m adelantados (~7 m) porque los ángulos son más cortos en los rápidos.',
      'Punto débil: pelota axial profunda sin cubrir (sin defensor de Z6 en 5v5 3F-2B).',
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
      Z('P5', 0, 43, 35, 57, 'Z5 corta'),
      Z('P1', 50, 43, 50, 57, 'Diagonal larga'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Ataque rival por Z2 → la pelota llega por nuestro lado izquierdo. Espejo perfecto de Z4.',
      'Bloqueo a 2 jugadores: P4 (línea exterior) + P3 (centro diagonal).',
      'El colocador (P2) como off-blocker, a 2-2,5 m de la red por el lado derecho (anti-finta + transición rápida al objetivo).',
      'P1 defiende la diagonal larga (~7-7,5 m).',
      'P5 defiende la paralela izquierda profunda a la sombra del bloqueo.',
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
      Z('P2', 65, 34, 35, 66, 'Paralela corta'),
      Z('P4', 0, 25, 35, 45, 'Diagonal I'),
      Z('P1', 25, 62.5, 45, 37.5, 'Profundo'),
    ],
    mainShot: { toX: 20, toY: 55 },
    altShots: [{ toX: 82, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 70, toY: 47.5 }],
    notes: [
      'Ataque rival por Z4 → la pelota llega por nuestro lado derecho.',
      'Formación en rombo (1-2-1) → sistema A: 1 bloqueador (P3) + 3 defensores.',
      'P3 sube a bloquear en solitario por el lado derecho (frente al atacante rival).',
      'P2 (delantero derecho) baja hasta la línea de 3 m, a 3,5-4 m de la red — cubre fintas y dejadas detrás del bloqueo.',
      'P4 (delantero izquierdo) baja a media cancha por la izquierda — cubre la diagonal corta.',
      'P1 (único defensor zaguero) cubre la diagonal larga (~7-7,5 m, 1 m de la línea derecha).',
      'Anticipación = habilidad #1: solo 1 zaguero → ~40 m² por cubrir.',
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
      Z('P4', 0, 32.5, 35, 52.5, 'Diagonal I'),
      Z('P2', 65, 32.5, 35, 52.5, 'Diagonal D'),
      Z('P1', 30, 62.5, 45, 37.5, 'Profundo'),
    ],
    mainShot: { toX: 50, toY: 77.5 },
    altShots: [{ toX: 18, toY: 55 }, { toX: 80, toY: 55 }],
    notes: [
      'Ataque rápido central (Z3) — la situación más difícil en 4v4: poco tiempo, solo 1 bloqueador.',
      'Bloqueo a 1 jugador (P3 solo) en modo READ constante (sin commit posible).',
      'P4 y P2 bajan a media cancha (~3,5-4 m de la red, cubren ambas diagonales cortas).',
      'El único defensor zaguero P1 actúa como defensor de Z6 (eje central, 7-8 m de la red).',
      'Trayectoria principal: pelota axial potente (hacia P1) ya que el bloqueo a 1 solo cubre el centro.',
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
      Z('P4', 0, 34, 35, 66, 'Paralela corta'),
      Z('P2', 60, 25, 40, 45, 'Diagonal D'),
      Z('P1', 30, 62.5, 45, 37.5, 'Profundo'),
    ],
    mainShot: { toX: 80, toY: 55 },
    altShots: [{ toX: 18, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 30, toY: 55 }],
    notes: [
      'Ataque rival por Z2 → la pelota llega por nuestro lado izquierdo. Espejo perfecto de Z4.',
      'Sistema A: 1 bloqueador (P3) + 3 defensores.',
      'P4 (delantero izquierdo) baja hasta la línea de 3 m, a 3,5-4 m de la red — cubre fintas y dejadas por la izquierda.',
      'P2 (delantero derecho) baja a media cancha por la derecha — cubre la diagonal corta.',
      'El único defensor zaguero P1 defiende la diagonal larga (~7-7,5 m, 1 m de la línea izquierda).',
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
      Z('P1', 65, 43, 35, 57, 'Diagonal corta'),
      Z('P5', 0, 43, 50, 57, 'Diagonal larga'),
      Z('P4', 0, 25, 35, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 22, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Ataque rival por Z4 → la pelota llega por nuestro lado derecho.',
      'Formación en cuadrado (2-2 / box) → sistema A: 1 bloqueador (P2) + 3 defensores.',
      'P2 (delantero derecho) bloqueo solo frente al atacante rival, toma la paralela.',
      'P4 (delantero izquierdo) como off-blocker, a 2-2,5 m de la red — cubre fintas y dejadas por la izquierda.',
      'P5 defiende la diagonal larga (~7 m, 0,5 m de la línea izquierda).',
      'P1 defiende la paralela profunda / diagonal corta (~7 m, a la sombra del bloqueo).',
      'Sistema B (bloqueo a 2 P2+P4) posible pero deja solo 2 defensores — reservar para atacantes potentes.',
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
      Z('P5', 0, 40, 50, 60, 'Diagonal I'),
      Z('P1', 50, 40, 50, 60, 'Diagonal D'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 47.5 }],
    notes: [
      'Ataque rápido central (Z3) — ángulos cortos, poco tiempo.',
      'Bloqueo a 2 jugadores (P4 + P2) cierra el centro — sistema B con 2 defensores detrás.',
      'P5 y P1 toman las diagonales cortas (~7 m, 0,5-1 m de las bandas).',
      'Punto débil mayor: sin cobertura corta detrás del bloqueo, el cuadrado no tiene jugador a media cancha.',
      'Alternativa: bloqueo a 1 jugador (rol tipo P3, aquí P4 o P2 solo) para liberar un defensor de fintas.',
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
      Z('P5', 0, 43, 35, 57, 'Diagonal corta'),
      Z('P1', 50, 43, 50, 57, 'Diagonal larga'),
      Z('P2', 60, 25, 40, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 78, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Ataque rival por Z2 → la pelota llega por nuestro lado izquierdo. Espejo perfecto de Z4.',
      'Sistema A: 1 bloqueador (P4) + 3 defensores.',
      'P4 (delantero izquierdo) bloqueo solo frente al atacante rival, toma la paralela.',
      'P2 (colocador-atacante delantero derecho) como off-blocker, a 2-2,5 m de la red — anti-finta + transición rápida al objetivo.',
      'P1 defiende la diagonal larga (~7 m, 0,5 m de la línea derecha).',
      'P5 defiende la paralela profunda corta (~7 m, a la sombra del bloqueo).',
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
      Z('P1', 65, 40, 35, 60, 'Paralela D'),
      Z('P6', 33, 52, 34, 48, 'Eje'),
      Z('P5', 0, 43, 35, 57, 'Diagonal I'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 75 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 70 }, { toX: 18, toY: 40 }],
    notes: [
      'Ataque rival por Z4 → la pelota llega por nuestra derecha.',
      'Sistema 2F-3B (P4+P3 delanteros, P5+P6+P1 zagueros, P1 penetrando): bloqueo a 1 jugador.',
      'P3 (central) bloquea solo por la derecha — no hay P2 disponible para bloqueo a 2.',
      'P4 (punta) off-blocker, a 2-2,5 m de la red por la izquierda.',
      '3 defensores profundos: P5 diagonal larga, P6 eje central (~7-8 m), P1 paralela derecha.',
      'El sistema 1-1-3 (1 bloqueador + 1 off-blocker + 3 defensores) es la defensa más cercana al perimetral 6v6.',
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
      Z('P5', 0, 40, 33, 60, 'Diagonal I'),
      Z('P6', 33, 52, 34, 48, 'Eje'),
      Z('P1', 67, 40, 33, 60, 'Diagonal D'),
    ],
    mainShot: { toX: 50, toY: 75 },
    altShots: [{ toX: 22, toY: 65 }, { toX: 78, toY: 65 }],
    notes: [
      'Ataque rápido central (Z3) — ángulos cortos.',
      'Bloqueo a 1 jugador (P3) en lectura — el rápido es el objetivo más difícil en 2F-3B.',
      'P4 lateralizado a media cancha (~2 m de la red) para los rebotes.',
      'Ventaja: 3 defensores profundos (P5, P6, P1) cubren las 3 zonas traseras principales.',
      'P6 frente al atacante central en su pasillo de ataque (~7,5-8 m, eje).',
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
      Z('P5', 0, 40, 35, 60, 'Paralela I'),
      Z('P6', 33, 52, 34, 48, 'Eje'),
      Z('P1', 65, 43, 35, 57, 'Diagonal D'),
      Z('P3', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 75 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 70 }, { toX: 80, toY: 40 }],
    notes: [
      'Ataque rival por Z2 → la pelota llega por nuestra izquierda. Espejo de Z4.',
      'Bloqueo a 1 jugador: P4 bloquea solo por la izquierda (sin P2 en 2F-3B).',
      'P3 (central) se convierte en off-blocker por la derecha, a 2-2,5 m de la red.',
      'P5 defiende la paralela izquierda profunda, P6 el eje, P1 la diagonal larga.',
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
      { posNumber: 'P5', x: 0, y: 43, w: 50, h: 57, label: 'Diagonal larga', labelPos: { x: 18, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Sombra del bloqueo', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 62, y: 34, w: 38, h: 42, label: 'Paralela', labelPos: { x: 70, y: 40 } },
      { posNumber: 'P4', x: 0, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 4, y: 33 } },
    ],
    mainShot: { toX: 22, toY: 77.5 },
    altShots: [
      { toX: 78, toY: 47.5 },
      { toX: 45, toY: 62.5 },
      { toX: 15, toY: 40 },
    ],
    notes: [
      { label: 'Posición 2 (opuesto / OPP)', text: 'Bloqueador de paralela — bloquea, sube a la red por el lado derecho.' },
      { label: 'Posición 3 (central)', text: 'Cierra la diagonal en bloqueo a 2 con el opuesto.' },
      { label: 'Posición 4 (punta off-blocker)', text: 'Baja a la línea de 3 m por la izquierda — cubre la dejada corta (diagonal cerrada) y las fintas.' },
      { label: 'Posición 5 (Líbero)', text: 'Defiende la diagonal larga, a ~7-8 m de la red, en el hombro interior del central.' },
      { label: 'Posición 6 (zaguero centro)', text: 'Pelotas altas que pasan el bloqueo, toques largos del bloqueo, eje ~8-8,5 m.' },
      { label: 'Posición 1 (zaguero derecho)', text: 'Defiende la paralela profunda a la sombra del bloqueo, ~7-7,5 m de la red, 0,5 m de la línea derecha.' },
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
      { posNumber: 'P5', x: 0, y: 34, w: 36, h: 66, label: 'Diagonal I', labelPos: { x: 10, y: 70 } },
      { posNumber: 'P6', x: 32, y: 52, w: 36, h: 48, label: 'Eje', labelPos: { x: 42, y: 73 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 64, y: 34, w: 36, h: 66, label: 'Diagonal D', labelPos: { x: 75, y: 70 } },
      { posNumber: 'P4', x: 0, y: 25, w: 28, h: 28, label: 'Cobertura', labelPos: { x: 4, y: 36 } },
      { posNumber: 'P2', x: 72, y: 25, w: 28, h: 28, label: 'Cobertura', labelPos: { x: 78, y: 36 } },
    ],
    mainShot: { toX: 75, toY: 65 },
    altShots: [
      { toX: 25, toY: 65 },
      { toX: 50, toY: 80 },
    ],
    notes: [
      { label: 'Posición 3 (central)', text: 'Bloqueo a 1 jugador en lectura (read) o commit según el scouting rival.' },
      { label: 'Posiciones 4 y 2 (puntas)', text: 'Sobre la línea de ataque (~2-2,5 m de la red, 0,5 m de las bandas): cubren rebotes del bloqueo y pelotas que pasan el bloqueo.' },
      { label: 'Posición 5 (Líbero)', text: 'Frente al atacante central, en su pasillo de ataque (~7-8 m de la red).' },
      { label: 'Posición 6 (zaguero centro)', text: 'Hombros frente al atacante; defiende la pelota potente que pasa el bloqueo (eje ~8-8,5 m).' },
      { label: 'Posición 1 (zaguero derecho)', text: 'Se adelanta un metro (~7,5 m de la red, 1 m de la línea derecha): los ángulos son más cortos en los rápidos.' },
      { label: 'Regla clave', text: '"Parados al contacto": todos detenidos y equilibrados en el instante exacto del golpe.' },
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
      { posNumber: 'P1', x: 50, y: 43, w: 50, h: 57, label: 'Diagonal larga', labelPos: { x: 68, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Sombra del bloqueo', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P5', x: 0, y: 34, w: 38, h: 42, label: 'Paralela', labelPos: { x: 10, y: 40 } },
      { posNumber: 'P2', x: 70, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 76, y: 33 } },
    ],
    mainShot: { toX: 78, toY: 77.5 },
    altShots: [
      { toX: 22, toY: 47.5 },
      { toX: 55, toY: 62.5 },
      { toX: 85, toY: 40 },
    ],
    notes: [
      { label: 'Posición 4 (punta)', text: 'Bloqueador de paralela — bloquea en la red por el lado izquierdo.' },
      { label: 'Posición 3 (central)', text: 'Cierra la diagonal en bloqueo a 2 con el punta.' },
      { label: 'Posición 2 (opuesto / OPP)', text: 'Se convierte en off-blocker por la derecha — baja a la línea de 3 m, cubre la dejada corta y las fintas.' },
      { label: 'Posición 5 (Líbero)', text: 'Defiende la paralela profunda a la sombra del bloqueo, ~7-7,5 m de la red, 0,5 m de la línea izquierda.' },
      { label: 'Posición 6 (zaguero centro)', text: 'Pelotas altas por encima del bloqueo, eje ~8-8,5 m de la red.' },
      { label: 'Posición 1 (colocador o punta/OPP)', text: 'Defiende la diagonal larga, ~7-8 m de la red.' },
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
  { title: 'Atacante lejos de la red', action: 'ADELANTARSE', accentColor: 'var(--orange)',
    points: ['Colocación a 2-3 m de la red', 'No puede rematar con fuerza', 'Alto riesgo de finta o dejada', 'Adelantarse 1-2 metros'] },
  { title: 'Atacante cerca de la red', action: 'RETROCEDER', accentColor: 'var(--plum)',
    points: ['Colocación a menos de 1 m de la red', 'Puede rematar a máxima potencia', 'Trayectoria descendente rápida', 'Retroceder lo más posible'] },
  { title: 'El hombro del atacante', action: 'Observa su hombro de golpeo', accentColor: 'var(--teal)',
    points: ['Hombro alto y atrasado = remate potente', 'Hombro bajo = probable finta', 'Rotación del hombro = dirección de la pelota', 'Ajustar en 0,5 s'] },
  { title: 'La carrera de aproximación', action: 'Observa su carrera de aproximación', accentColor: 'var(--ink)',
    points: ['Aproximación larga y rápida = remate fuerte', 'Aproximación corta o detención = finta', 'Ángulo de aproximación = zona objetivo', 'Anticipar la potencia'] },
];

const COMMANDEMENTS = [
  ['Mira al colocador', 'Después al atacante, no la pelota'],
  ['Mismo lado = Adelantarse', 'Lado opuesto = Retroceder'],
  ['Mala colocación rival', '→ Adelantarse 1-2 m (finta probable)'],
  ['Nunca en el medio', 'Elige: adelante O atrás'],
  ['Comunica SIEMPRE', '"¡Mía!" en cada pelota que tomas'],
  ['Muévete tras el saque', 'Posición de saque ≠ posición defensiva'],
  ['Lee el hombro', 'Hombro alto = remate, bajo = finta'],
  ['Postura baja', 'Rodillas flexionadas, brazos listos'],
  ['Transiciones rápidas', '3 segundos máximo para reorganizarse'],
  ['Defiende tu zona', 'Cada jugador tiene una responsabilidad'],
];

type MistakesSection = {
  title: string;
  intro: string;
  mistakes: [string, string][];
};

const MISTAKES_BY_SIZE: Record<TeamSize, MistakesSection> = {
  6: {
    title: 'Los diez errores frecuentes de colocación defensiva',
    intro: 'Tipología extraída de Mike Hebert (Thinking Volleyball), John Forman (CoachingVB), USA Volleyball y el manual FIVB Top Volley.',
    mistakes: [
      ['1. Refugiarse en la sombra del bloqueo', 'Los defensores se refugian instintivamente detrás de los bloqueadores en lugar de colocarse alrededor de la sombra del bloqueo — dejando libres las diagonales y las trayectorias "off the block". Hebert: "creeping into the block shadow".'],
      ['2. Lectura defectuosa', 'El defensor mira fijo la pelota en vez de seguir la secuencia "pelota → colocador → pelota → atacante". Consecuencia: adivina en vez de leer, y no está detenido ni equilibrado en el momento del contacto ("stopped and balanced at the moment of contact").'],
      ['3. Líbero mal ubicado en profundidad', 'Demasiado cerca de la red, no puede defender remates profundos; demasiado atrás, no puede cubrir fintas. Regla: alinea su hombro exterior con el hombro interior del central, a 6-8 m de la red según el bloqueo.'],
      ['4. Colocador-defensor mal preparado', 'Postura demasiado baja o mal orientada que le impide ver pelota + cancha rival; salida prematura hacia el objetivo creando un hueco en Z1; sin "release call" que señale que abandona la defensa.'],
      ['5. Faltas de overlap', 'Las más frecuentes: Z6 se adelanta a Z3, Z5 más a la derecha que Z6, y el colocador deja su posición demasiado pronto para penetrar (falta #1 en 5-1). En el instante del contacto del sacador, todos los pies deben respetar las relaciones delante/atrás e izquierda/derecha (Regla 7.4).'],
      ['6. Transición recepción → defensa olvidada', 'Los jugadores se quedan congelados en su formación de recepción en W en lugar de cambiar a posición base defensiva en cuanto el colocador rival toca la pelota. Hebert: "sluggish recovery after play on the ball".'],
      ['7. Mala gestión de la zona 6', 'Confusión entre "6-up" (rotación), "6-back" (perimetral) y "6-deep". El jugador de Z6 debe desplazarse lateralmente según el lado del ataque rival, no permanecer centrado. Inclinarse hacia atrás para defender ("leaning back") pone el peso en los talones y mata la reactividad.'],
      ['8. Defensa fallida ante el ataque rápido central', 'Lectura tardía del central rival; zaguera no adelantada (en los rápidos, Z1 y Z5 deben adelantarse un metro porque los ángulos son más cortos); "false stepping" (primer paso hacia atrás) que desperdicia el tiempo disponible.'],
      ['9. Cobertura de finta huérfana', 'Ningún defensor asignado explícitamente a la finta; "standing up on tips" — el defensor está bajo para el remate, luego se incorpora y estira el brazo hacia la finta, dejando caer la pelota justo delante. La concentración debe permanecer en el remate en postura baja que permita saltar a la finta.'],
      ['10. Silencio colectivo', 'Sin llamados ("¡finta!", "¡paralela!", "¡fuera!", "¡mía!"); bloqueadores que no comunican su orientación paralela vs diagonal; sin capitán de rotación que verifique los overlaps antes del saque.'],
    ],
  },
  5: {
    title: 'Errores frecuentes en 5v5',
    intro: 'Errores específicos del formato 5v5 (adaptaciones de Volleyball Canada, VolleyballXL y la doctrina 6v6).',
    mistakes: [
      ['1. Reproducir mecánicamente el 6v6', 'Cubrir 3 zonas profundas con 3 defensores funciona (sistema 2F-3B), pero falta el off-blocker que retrocede — la zona de 3 m no se cubre si no se asigna explícitamente a alguien.'],
      ['2. El off-blocker delantero pegado a la red', 'Después del contacto del bloqueo, el off-blocker delantero debe retroceder a 2-2,5 m para cubrir fintas. Si se queda en la red, la zona detrás del bloqueo queda totalmente abierta.'],
      ['3. 2 defensores parados uno al lado del otro', 'En sistema 3F-2B, los 2 defensores profundos deben estar separados (uno a la izquierda, otro a la derecha) y no centrados juntos. De lo contrario, las bandas quedan expuestas.'],
      ['4. El colocador sale demasiado pronto (sistema penetrante)', 'En sistema 2F-3B con colocador penetrando desde P1, debe esperar a que la pelota sea defendida antes de correr a su objetivo — si no, se abre un hueco en Z1.'],
      ['5. Confusión adelante/atrás', 'Con 5 jugadores, la tentación de dejar que los delanteros defiendan su lado quedándose sobre la línea de 3 m es fuerte — pero eso deja la cancha profunda libre. Los delanteros suben a bloquear, los zagueros defienden el fondo.'],
      ['6. Lectura defectuosa', 'La falta de un jugador exige una lectura aún más temprana que en 6v6. Secuencia "pelota → colocador → pelota → atacante" + detención equilibrada en el momento del contacto.'],
    ],
  },
  4: {
    title: 'Errores frecuentes en 4v4',
    intro: 'Errores específicos del 4v4 indoor (intramuros universitarios, doctrina FFVb / Volleyball Canada, literatura de playa 4s).',
    mistakes: [
      ['1. El bloqueador aislado sin cobertura de finta', 'Los 3 defensores se van todos al fondo, dejando vacía la zona de 3-5 m. Siempre alguien debe estar asignado a la finta a 3,5-4 m de la red.'],
      ['2. 2 defensores en línea recta', 'Lado a lado a la misma profundidad → la dejada cae entre ellos. En 4v4, los defensores siempre deben estar escalonados (uno cerca, otro lejos) o repartidos lateralmente.'],
      ['3. El colocador sale al objetivo antes de que la pelota sea defendida', 'Transición prematura que deja un hueco en defensa. El colocador espera la confirmación de que la pelota está recuperada antes de ir a su objetivo.'],
      ['4. Sin señal entre bloqueador y defensores', 'El bloqueador DEBE señalar "paralela" o "diagonal" antes de que comience el ataque. Sin esto, los 3 defensores no saben qué cubrir — todos improvisan.'],
      ['5. El defensor de finta demasiado lejos de la red', 'Se queda atrás con los demás zagueros y ya no puede cubrir las fintas cortas. Su posición es 3,5-4 m de la red, eje — no 7 m.'],
      ['6. Bloqueo "al azar" del jugador equivocado', 'En 4v4, bloquear con un jugador mal ubicado (lejos del atacante) deja al rival frente a 3 defensores desalineados. El bloqueador debe ser quien esté frente al atacante principal.'],
      ['7. Lectura defectuosa', 'Con ~40 m² por defensor (vs 20 m² en 6v6), un error de lectura es irreparable. Anticipación = habilidad #1 en 4v4.'],
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
    title: 'Los tres sistemas defensivos principales (FIVB / USAV)',
    warning: {
      label: '⚠ Advertencia terminológica',
      text: 'La expresión "defensa en W" que se escucha a menudo en Francia es incorrecta. La "W-formation" se refiere históricamente a una formación de recepción del saque a 5 jugadores — no a un sistema defensivo. La doctrina internacional (FIVB, USAV IMPACT, Liskevych, Stone) distingue tres sistemas: man-up (2-1-3), perimetral (2-0-4) y rotación (3-2-1).',
    },
    systems: [
      {
        name: 'Defensa man-up (2-1-3)',
        tag: 'Antiguamente "defensa en W" / defensa roja',
        principe: 'Un defensor se adelanta hasta la línea de 3 m detrás del bloqueo para interceptar fintas y dejadas. Dos bloqueadores en la red, el off-blocker retrocede, y tres jugadores profundos cubren los ángulos largos.',
        forces: ['Cobertura excelente de fintas, dejadas y pelotas "basura" detrás del bloqueo', 'Transición rápida al ataque si el adelantado es el colocador', 'Sencillo de enseñar a equipos jóvenes'],
        faiblesses: ['Solo 3 defensores profundos — vulnerable a remates potentes en diagonal cerrada', 'Un atacante que pega fuerte entre los bloqueadores rompe fácilmente'],
        indication: 'Equipos jóvenes, escolares, rivales tácticos que juegan muchas fintas o pelotas de toque.',
        accent: 'var(--orange)',
      },
      {
        name: 'Defensa perimetral (2-0-4)',
        tag: 'Defensa blanca — sistema dominante en alto nivel masculino',
        principe: 'Los cuatro defensores zagueros forman una U que se abre hacia la red, casi sobre las bandas y la línea de fondo — "un pie en la línea" (Liskevych). El centro de la cancha se abandona intencionalmente.',
        forces: ['Excelente cobertura de remates potentes, paralelas y esquinas profundas', 'Movimiento colectivo sencillo', 'Sistema predominante en el voleibol masculino internacional moderno'],
        faiblesses: ['Muy vulnerable a fintas cortas detrás del bloqueo — la zona central entre 3 y 5 m está abierta', 'Requiere defensores atléticos capaces de tirarse hacia adelante'],
        indication: 'Sénior, masculino, nivel internacional, rivales potentes.',
        accent: 'var(--teal)',
      },
      {
        name: 'Defensa de rotación / slide defense (3-2-1)',
        tag: 'Rotational / slide defense',
        principe: 'Los tres defensores zagueros deslizan hacia el lado del ataque rival: el zaguero opuesto se adelanta detrás del bloqueo (finta), el centro desliza hacia la paralela atacada, el defensor del lado atacado toma el ángulo corto.',
        forces: ['Excelente cobertura de la paralela profunda Y la finta simultáneamente', 'Sistema muy adaptable', 'Transición rápida del colocador cuando está en P1'],
        faiblesses: ['Un defensor profundo menos (un jugador dedicado a la finta)', 'Esquina diagonal opuesta vulnerable', 'Exige alta capacidad de lectura y coordinación'],
        indication: 'Rivales que mezclan potencia y paralelas/fintas; nivel intermedio a élite.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['Man-up 2-1-3', 'Perim. 2-0-4', 'Rotación 3-2-1'],
    tableRows: [
      ['Jugador adelantado detrás del bloqueo', 'Sí', 'No', 'Sí'],
      ['Defensores profundos', '3', '4', '2'],
      ['Cobertura de finta', '★★★', '★', '★★'],
      ['Cobertura de remate potente', '★★', '★★★', '★★'],
      ['Cobertura de paralela profunda', '★★', '★★', '★★★'],
      ['Cobertura de diagonal cerrada', '★', '★★★', '★★'],
      ['Posición típica del líbero', 'Z5 o Z6', 'Z5 (sobre la línea)', 'Z5 desliza'],
      ['Complejidad', 'Baja', 'Media', 'Alta'],
    ],
    footer: {
      strong: 'La elección no es cuestión de ortodoxia: ',
      text: 'depende del perfil ofensivo del rival y de las cualidades de tus defensores. La defensa moderna se define menos por la formación que por la lectura — secuencia visual "pelota → colocador → pelota → atacante" y detención equilibrada en el momento del contacto.',
    },
  },
  5: {
    title: 'Los tres sistemas defensivos en 5v5',
    warning: {
      label: '⚠ Formato no oficial FIVB',
      text: 'El 5v5 indoor no tiene reglamento dedicado FIVB ni FFVb. Estos tres sistemas son adaptaciones lógicas del 6v6 documentadas por VolleyballXL, The Art of Coaching Volleyball y Volleyball Canada. No existe un manual técnico oficial de 5v5 — elige el sistema según la configuración de tu equipo (2-3 o 3-2).',
    },
    systems: [
      {
        name: 'Sistema 1-1-3',
        tag: '1 bloqueador + 1 cobertura de finta + 3 defensores profundos',
        principe: 'Adaptado al sistema 2F-3B (2 delanteros, 3 zagueros). El bloqueador salta solo; el 2º delantero retrocede como off-blocker a 2-3 m de la red para las fintas; 3 defensores profundos cubren paralela, eje y diagonal larga.',
        forces: ['3 defensores profundos como en el perimetral 6v6 — buena cobertura de remates', 'El sistema más cercano al 5-1 6v6 (preparación para la transición al 6v6)', 'Finta cubierta por el off-blocker'],
        faiblesses: ['Bloqueo a 1 solo → frágil ante grandes atacantes', 'El off-blocker a 2-3 m atrás debe ser muy reactivo'],
        indication: 'Sistema 2F-3B (colocador penetrando), rivales de potencia moderada. Sistema recomendado para la transición pedagógica al 6v6.',
        accent: 'var(--teal)',
      },
      {
        name: 'Sistema 2-1-2',
        tag: '2 bloqueadores + 1 finta + 2 defensores profundos',
        principe: 'Adaptado al sistema 3F-2B (3 delanteros, 2 zagueros). Bloqueo a 2 en la red, el delantero central cubre la finta a 2-3 m de la red, 2 defensores profundos toman diagonal larga y paralela.',
        forces: ['Bloqueo a 2 como en 6v6 — mucho más eficaz contra remates potentes', '3 atacantes en la red para el contraataque'],
        faiblesses: ['Solo 2 defensores profundos → 9 m de fondo muy difíciles de cubrir', 'Alta exigencia atlética sobre los 2 zagueros'],
        indication: 'Sistema 3F-2B contra equipos muy potentes. Privilegiar al final de un set cuando cada punto cuenta.',
        accent: 'var(--orange)',
      },
      {
        name: 'Sistema 1-2-2',
        tag: 'Man-up adaptado (equivalente al 2-1-3 del 6v6)',
        principe: 'Bloqueador solo + 2 cubridores de zona delantera (finta + detrás del bloqueo) + 2 defensores profundos. Adaptado cuando el rival hace muchas fintas o para equipos principiantes.',
        forces: ['Excelente cobertura de fintas cortas (2 cubridores delante)', 'Finta difícil de explotar por el rival'],
        faiblesses: ['Solo 2 defensores profundos → remates potentes difíciles', 'Requiere coordinación entre los 2 cubridores delanteros'],
        indication: 'Rivales que fintean mucho; voleibol femenino, categorías juveniles, equipos técnicos.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['1-1-3', '2-1-2', '1-2-2 (man-up)'],
    tableRows: [
      ['Bloqueadores', '1', '2', '1'],
      ['Cubridores delante', '1 (off-blocker)', '1 (finta)', '2 (finta + detrás del bloqueo)'],
      ['Defensores profundos', '3', '2', '2'],
      ['Cobertura de finta', '★★', '★★', '★★★'],
      ['Cobertura de remate potente', '★★', '★★★', '★★'],
      ['Cobertura del fondo', '★★★', '★★', '★★'],
      ['Configuración correspondiente', '2F-3B', '3F-2B', '2F-3B / 3F-2B'],
      ['Complejidad', 'Baja', 'Media', 'Alta'],
    ],
    footer: {
      strong: 'Recomendación 5v5: ',
      text: 'el sistema 1-1-3 en configuración 2F-3B con colocador penetrando es la defensa más cercana al 6v6 — ideal como transición pedagógica. El 2-1-2 solo se justifica frente a atacantes realmente potentes.',
    },
  },
  4: {
    title: 'Los tres sistemas defensivos en 4v4',
    warning: {
      label: '⚠ Formato no oficial FIVB',
      text: 'El 4v4 indoor no tiene reglamento oficial FIVB. Estos tres sistemas provienen de la práctica de intramuros universitarios (USA), de manuales de transición pedagógica FFVb / Volleyball Canada y de la literatura de playa (Brandon Joyner, Better at Beach). Con 4 jugadores, cada defensor cubre ~30-40 m² (vs 20 m² en 6v6) — la anticipación es la habilidad #1.',
    },
    systems: [
      {
        name: 'Sistema A: 1 bloqueador + 3 defensores',
        tag: 'El más común en 4v4 indoor',
        principe: 'Un solo jugador sube a bloquear frente al atacante principal. Los otros 3 se reparten: defensor de finta (3-4 m de la red, eje), defensor de diagonal (7-7,5 m, línea derecha, diagonal larga), defensor de paralela (7-7,5 m, a la sombra del bloqueo).',
        forces: ['Cubre finta, paralela y diagonal larga simultáneamente', 'El más equilibrado en 4v4', 'Señal paralela/diagonal del bloqueador muy eficaz'],
        faiblesses: ['Bloqueo a 1 — vulnerable a grandes atacantes', 'Requiere un defensor de finta disciplinado que no retroceda'],
        indication: 'Rivales de nivel equivalente o moderado. Configuración más versátil en 4v4 (rombo o línea 3-1).',
        accent: 'var(--orange)',
      },
      {
        name: 'Sistema B: 2 bloqueadores + 2 defensores',
        tag: 'Bloqueo a 2 (raro en 4v4)',
        principe: 'Los 2 delanteros suben juntos frente al atacante principal. Los 2 zagueros se ubican: uno del lado de la paralela (7 m, 1 m de la línea), otro en el eje ligeramente desplazado hacia la diagonal. La finta no se cubre.',
        forces: ['Bloqueo a 2 mucho más eficaz contra remates potentes', 'Presión máxima sobre el atacante rival'],
        faiblesses: ['Solo 2 defensores en cancha → imposible cubrirlo todo', 'Finta detrás del bloqueo totalmente descubierta', 'Obliga a elegir: paralela O diagonal, no ambas'],
        indication: 'Usar solo contra atacantes muy potentes sin sutileza (sin fintas). Configuración cuadrado 2-2 o línea 3-1.',
        accent: 'var(--plum)',
      },
      {
        name: 'Sistema C: 0 bloqueadores',
        tag: 'Defensa baja (rivales que no rematan)',
        principe: 'Ningún jugador sube a bloquear. Los 4 jugadores defienden el fondo: 2 a media cancha (3-4 m) para las fintas, 2 profundos (7-8 m) para las pelotas más largas. El colocador actúa como 4º defensor.',
        forces: ['Cubre toda la profundidad de la cancha', 'Bien adaptado a jugadas lentas'],
        faiblesses: ['CONTRAPRODUCENTE en cuanto un rival remata en serio (el remate pasa sin oposición)', 'Sin presión en la red'],
        indication: 'Niveles escolares, recreativo principiante, rivales que no rematan. Evitar en cuanto la oposición gane potencia.',
        accent: 'var(--teal)',
      },
    ],
    tableHeaders: ['Sistema A', 'Sistema B', 'Sistema C'],
    tableRows: [
      ['Bloqueadores', '1', '2', '0'],
      ['Defensores profundos', '3', '2', '4'],
      ['Cobertura de finta', '★★', '★', '★★★'],
      ['Cobertura de remate potente', '★★', '★★★', '★ (sin bloqueo)'],
      ['Cobertura de paralela profunda', '★★', '★★', '★★'],
      ['Cobertura de diagonal larga', '★★★', '★★', '★★'],
      ['Rivales recomendados', 'Todos los niveles', 'Muy potentes', 'No rematan'],
      ['Complejidad', 'Baja', 'Media', 'Baja'],
    ],
    footer: {
      strong: 'Recomendación 4v4: ',
      text: 'el sistema A (1 bloqueador + 3 defensores) es el predeterminado casi universal. El sistema B solo se justifica frente a atacantes realmente potentes al final de un set. El sistema C solo funciona a nivel recreativo principiante — en cuanto un rival remate, vuelve al sistema A.',
    },
  },
};

const EXERCICES = [
  { title: 'Lectura de la situación', level: 'Principiante', duration: '10 min', materiel: '1 entrenador o compañero con pelotas',
    objectif: 'Aprender a identificar rápidamente la zona de ataque',
    steps: ['El entrenador se ubica al otro lado de la red en zona 4, 3 o 2', 'Tú partes desde el centro de la cancha', 'El entrenador anuncia la zona y lanza la pelota', 'Debes llegar a tu zona defensiva en 2-3 segundos', 'Repite 20 veces variando las zonas'] },
  { title: 'Adelantarse / retroceder según la colocación', level: 'Intermedio', duration: '15 min', materiel: '1 colocador, 1 atacante, varios defensores',
    objectif: 'Ajustar tu posición según la calidad de la colocación',
    steps: ['El colocador entrega colocaciones de calidad variable al atacante', 'Colocación cerca de la red → retrocedes (se espera remate potente)', 'Colocación lejos de la red → te adelantas (finta probable)', 'El atacante remata y tú defiendes', 'El entrenador corrige tu posición después de cada pelota'] },
  { title: 'Comunicación defensiva', level: 'Todos los niveles', duration: '10 min', materiel: 'Equipo completo',
    objectif: 'Desarrollar la comunicación automática',
    steps: ['Partido en tu formato (4v4, 5v5 o 6v6) pero GRITANDO cada llamado', 'Penalización: -1 punto si un jugador no grita "¡Mía!" en su pelota', 'Bonus: +1 punto si todo el equipo comunica en una jugada', 'Cada jugador debe anunciar la zona de ataque rival'] },
  { title: 'Defensa contra fintas', level: 'Intermedio', duration: '15 min', materiel: '1 atacante, 3 defensores zagueros',
    objectif: 'Mejorar la defensa de pelotas cortas',
    steps: ['El atacante SOLO juega fintas y dejadas', 'Los defensores deben adelantarse todos (3-4 m)', 'Objetivo: recuperar 8 de cada 10 pelotas', 'Después alternar: 5 fintas, 5 remates para trabajar la adaptación'] },
  { title: 'Transiciones rápidas', level: 'Avanzado', duration: '20 min', materiel: 'Equipo completo',
    objectif: 'Dominar los cambios ataque-defensa',
    steps: ['Juego normal pero el entrenador toma el tiempo de las transiciones', 'Objetivo: estar en posición defensiva en menos de 3 segundos', 'Si es demasiado lento, el equipo hace 5 flexiones y vuelve a empezar', 'Aumentar progresivamente el ritmo de las jugadas'] },
  { title: 'Lectura del atacante', level: 'Avanzado', duration: '15 min', materiel: '1 atacante, defensores',
    objectif: 'Anticipar según el lenguaje corporal',
    steps: ['El atacante alterna remate, finta, dejada sin avisar', `Antes de que golpee, el defensor anuncia su predicción: "¡Remate!" o "¡Finta!"`, 'Punto si la predicción es correcta Y la pelota es defendida', 'Atención a: hombro, aproximación, posición respecto a la red'] },
];

type GuidePositionnementProps = {
  teamSize?: TeamSize;
  configId?: string;
};

export default function GuidePositionnementEs({ teamSize: teamSizeProp, configId: configIdProp }: GuidePositionnementProps = {}) {
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
      return <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>Diagrama no disponible para esta configuración.</div>;
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
        <div style={S.label}>Tu configuración de equipo</div>
        <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
          Elige tu formato y configuración táctica: <strong>todo el contenido de la guía</strong> (posiciones, zonas, defensa por ataque) se adaptará.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Formato de juego</div>
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
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Configuración táctica</div>
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
        <div style={S.label}>Principio básico de la defensa</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0' }}>La colocación defensiva depende de 3 factores principales:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Tu posición (delantero o zaguero)', 'La zona de ataque rival (zona 4, 3, 2)', 'El tipo de ataque (remate potente, finta, dejada)'].map((pt, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={S.bullet}>▸</span>
              <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Positions and zones */}
      <section>
        <h2 style={S.section}>1. Posiciones y zonas — {configuration.shortName} ({teamSize}v{teamSize})</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            Disposición de tu equipo en {configuration.name}
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
              Ver cada posición en detalle en /positions →
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--ink)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Regla importante: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>
            {teamSize === 6 && 'Los zagueros (5, 6, 1) NO PUEDEN bloquear en la red. Defienden en la zona zaguera.'}
            {teamSize === 5 && 'Con 5 jugadores, cada defensor cubre ~30 m² (vs 20 m² en 6v6). La lectura se vuelve crítica.'}
            {teamSize === 4 && 'Sin líbero. Cada jugador defiende ~30-40 m². La anticipación es la habilidad #1.'}
          </span>
        </div>
      </section>

      {/* 2. Positioning by zone */}
      <section>
        <h2 style={S.section}>2. Colocación según la zona de ataque rival</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button key={z} onClick={() => setZone(z)} style={zone === z ? btnActive : btnBase}>
              {z === 'zone4' ? 'Ataque por zona 4' : z === 'zone3' ? 'Ataque por zona 3' : 'Ataque por zona 2'}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {teamSize}v{teamSize} · {configuration.shortName} — {
              zone === 'zone4' ? 'Defensa contra ataque por zona 4 (punta izquierda rival)' :
              zone === 'zone3' ? 'Defensa contra ataque por zona 3 (centro)' :
              'Defensa contra ataque por zona 2 (punta derecha rival)'
            }
          </div>
          {renderZoneTab()}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <span><span style={{ color: 'var(--orange)' }}>■</span> <span style={{ color: 'var(--ink)', opacity: 0.6 }}>Zona de responsabilidad</span></span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>BLK</strong> = bloqueo</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>OFF</strong> = off-blocker</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>DEF</strong> = defensa</span>
        </div>
      </section>

      {/* 3. General principles */}
      <section>
        <h2 style={S.section}>3. Principios generales de colocación</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={S.labelTeal}>Zonas de responsabilidad</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          {[
            { title: 'Delanteros',
              points: ['Prioridad: Bloquear en la red', 'Si no bloquean: defender la línea opuesta', 'Distancia: en la red o en zona zaguera'] },
            { title: teamSize === 4 ? 'Único defensor zaguero (P1)' : 'Pivote defensivo (Líbero / P6)',
              points: teamSize === 4
                ? ['Posición: centro, ~40 m² por cubrir', 'Distancia: 5-6 m de la red', 'Rol: pilar defensivo único, máxima anticipación']
                : ['Posición: centro, adaptable', 'Distancia: 5-6 m de la red', 'Rol: pilar defensivo, cubre el centro'] },
            { title: 'Defensores zagueros laterales',
              points: ['Rol variable: adelantarse o retroceder', 'Lado atacado: adelantarse (3-4 m)', 'Lado opuesto: retroceder (6-7 m)'] },
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
            ★ Principios defensivos universales (4v4 / 5v5 / 6v6)
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px 0', lineHeight: 1.5 }}>
            Estos principios de Hebert, Liskevych y Volleyball Canada se aplican sea cual sea el número de jugadores en la cancha.
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['El bloqueo es la base', 'Los defensores zagueros se colocan en relación con la sombra del bloqueo y su orientación — no de forma independiente.'],
              ['Detenido y equilibrado en el momento del contacto', 'Cualquier defensor que aún se mueva cuando el atacante contacta la pelota ve colapsar su reactividad ("stopped on contact").'],
              ['Lectura visual secuencial', '"Pelota → colocador rival → pelota → atacante rival". En 4v4 y 5v5, la falta de jugadores obliga a una lectura aún más temprana.'],
              ['Comunicación por señales', 'Incluso a nivel recreativo, el bloqueador debe señalar "paralela" o "diagonal" — sin esto, los zagueros no saben qué cubrir.'],
              ['Zona delantera cubierta', 'Alguien debe cubrir los 3-5 m detrás del bloqueo — es la zona más descuidada en formatos reducidos (4v4 / 5v5).'],
              ['Transición rápida', 'El colocador nunca debe salir hacia el objetivo antes de confirmar que la pelota ha sido defendida ("release call").'],
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
        <h2 style={S.section}>4. Lectura del atacante: pistas visuales</h2>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Tu colocación debe ajustarse a lo que ves. Estas son las pistas clave:
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
          <strong style={{ color: 'var(--ink)' }}>Consejo pro: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>En los 2 segundos posteriores al saque rival, fija tu mirada en el colocador, luego INMEDIATAMENTE en el atacante que va a rematar.</span>
        </div>
      </section>

      {/* 5. When to step up / drop back */}
      <section>
        <h2 style={S.section}>5. ¿Cuándo adelantarse o retroceder?</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, marginBottom: 14 }}>Árbol de decisión rápido</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderLeft: '4px solid var(--orange)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--orange)', letterSpacing: '0.08em' }}>Adelantarse (3-4 m de la red) cuando:</div>
              {[
                'Estás del mismo lado que el atacante',
                'El atacante está lejos de la red (mala colocación)',
                'Anticipas una finta o dejada',
                'El bloqueo es sólido — pasan menos pelotas potentes',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={S.bulletOrange}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '4px solid var(--ink)', paddingLeft: 16, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.08em' }}>Retroceder (6-7 m de la red) cuando:</div>
              {[
                'Estás en el lado opuesto al atacante',
                'El atacante tiene una buena colocación cerca de la red',
                'El atacante es potente o alto',
                'El bloqueo es débil (solo 1 bloqueador)',
                'Defiendes la diagonal (trayectoria más larga)',
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
        <h2 style={S.section}>7. Colocación durante el saque</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            <strong>Tu ubicación durante el saque es DIFERENTE de tu posición defensiva. </strong>
            En cuanto sale el saque, debes reubicarte.
          </p>
        </div>
        <div style={S.card}>
          <div style={{ ...S.labelTeal, marginBottom: 12 }}>Transición saque → defensa</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Tu equipo saca', 'Estás en posición de rotación'],
              ['El sacador golpea', 'Observas al colocador rival'],
              ['El colocador toca la pelota', 'Te desplazas hacia tu zona defensiva'],
              ['El atacante salta', 'Estás en posición final, listo para reaccionar'],
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
        <h2 style={S.section}>8. Comunicación defensiva</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>Una defensa silenciosa es una defensa ineficaz.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { moment: 'Antes del ataque rival', calls: [['"¡Número 4!"', 'Anuncia la zona desde donde viene el ataque'], ['"¡Dos al bloqueo!"', 'Indica cuántos bloqueadores'], ['"¡Paralela abierta!"', 'Si el bloqueo no cubre la paralela'], [`"¡Adelantándome!" / "¡Retrocediendo!"`, 'Anuncia tu movimiento']] },
            { moment: 'Durante la acción', calls: [[`"¡Mía!" / "¡La tengo!"`, 'Tú tomas la pelota (la MÁS importante)'], ['"¡Tuya!" / "¡Tú!"', 'Dejas la pelota a un compañero'], ['"¡Fuera!"', 'La pelota se va fuera, no la toques'], ['"¡Bloqueada!"', 'Si bloqueas, anúncialo']] },
            { moment: 'Después de la acción', calls: [['"¡Cobertura!"', 'Pide cobertura del ataque'], ['"¡Free!"', 'Pelota libre, reorganizarse'], ['"¡Quietos!"', 'Mantener la defensa en su lugar']] },
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
          <strong style={{ color: 'var(--ink)' }}>Regla de oro: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>Ante la duda entre dos jugadores, el más adelantado SIEMPRE toma la pelota.</span>
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
                    <div style={S.labelTeal}>Fortalezas</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.forces.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={S.bullet}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.55 }}>Debilidades</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.faiblesses.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sys.accent, marginTop: 6 }}>
                      Usar cuando: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{sys.indication}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div style={{ ...S.card, marginTop: 14, overflowX: 'auto' }}>
                <div style={{ ...S.label, marginBottom: 10 }}>Tabla comparativa de síntesis</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.6 }}>Criterio</th>
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
        <h2 style={S.section}>10. Transiciones ataque ↔ defensa</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            El voleibol es un juego de transiciones rápidas. Pasas constantemente de atacar a defender y viceversa.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Transición ataque → defensa', items: [['Tu compañero ataca', 'Prepárate mentalmente para defender'], ['La pelota es devuelta', 'Identifica inmediatamente quién va a atacar'], ['Desplazamiento rápido', 'Llega a tu zona defensiva (2-3 segundos máximo)'], ['Postura baja', 'Flexiona las rodillas, listo para tirarte']] },
            { label: 'Transición defensa → ataque', items: [['Defiendes la pelota', 'Pase preciso al colocador'], ['Si eres DELANTERO', 'Corre a la red para atacar o bloquear'], ['Si eres ZAGUERO', 'Retrocede ligeramente, listo para cubrir el ataque'], ['Cobertura del ataque', 'Rodea a tu atacante (en semicírculo a 2-3 m)']] },
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
        <h2 style={S.section}>11. Ejercicios para mejorar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{i + 1}. {ex.title}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 8px', border: '1.5px solid var(--ink)', color: 'var(--ink)', background: 'var(--cream)', flexShrink: 0 }}>{ex.level}</span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, marginBottom: 6 }}>
                Duración: {ex.duration} · Material: {ex.materiel}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 8 }}>
                Objetivo: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{ex.objectif}</span>
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
        <h2 style={S.section}>12. Los 10 mandamientos del defensor</h2>
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
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Mismo lado que el atacante</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--orange)', marginBottom: 4 }}>→ ADELANTARSE (3-4 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Defender fintas y dejadas</div>
            </div>
            <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Lado opuesto al atacante</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>→ RETROCEDER (6-7 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Defender diagonales largas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>Conclusión</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            La colocación defensiva se aprende con la práctica y la experiencia. No te desanimes si cometes
            errores al principio — incluso los profesionales ajustan constantemente su ubicación.
          </p>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: 0 }}>
            La clave: aplica la regla básica (mismo lado = adelantarse, opuesto = retroceder), observa al atacante,
            comunícate con tus compañeros y nunca temas tirarte por una pelota.
          </p>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, color: 'var(--ink)', margin: 0, letterSpacing: '0.06em' }}>La defensa gana partidos.</p>
        </div>
      </section>

    </div>
  );
}
