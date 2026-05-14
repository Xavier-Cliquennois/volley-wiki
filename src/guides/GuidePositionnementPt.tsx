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
      Z('P1', 65, 40, 35, 60, 'Z1 curta'),
      Z('P5', 0, 43, 50, 57, 'Diag. longa'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Ataque adversário na Z4 (ponta esquerda deles) → bola chega ao nosso lado direito.',
      'Sistema 2-1-2: bloco de 2 jogadores (P2 oposto na paralela + P3 na diagonal) + 2 defesas profundos.',
      'P4 (ponta) como off-blocker, 2-2,5 m da rede, 1 m da linha lateral — cobre o amorti e o corte.',
      'P5 (~7-7,5 m, 0,5 m da linha esquerda) defende a diagonal longa.',
      'P1 (~7-7,5 m, 0,5 m da linha direita) defende a paralela profunda, na sombra do bloco.',
      'Trajetória principal a defender: diagonal longa (estatisticamente a mais frequente).',
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
      Z('P5', 0, 40, 50, 60, 'Diag. E'),
      Z('P1', 50, 40, 50, 60, 'Diag. D'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 82 }],
    notes: [
      'Ataque rápido central (Z3) — ângulos curtos, pouco tempo de reação.',
      'Bloco de 1 jogador: P3 (central) em leitura, sem possibilidade de commitment.',
      'P4 e P2 (off-blockers) a 2 m da rede sobre a linha de ataque — cobrem desvios.',
      'P5 e P1 1 m mais à frente (~7 m da rede) — os ângulos são mais curtos do que em bolas altas.',
      'Fragilidade: nenhum defesa central profundo dedicado (só 2 jogadores atrás no 5v5).',
      'Regra-chave: "parado no contacto" — todos parados e equilibrados no momento do contacto.',
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
      Z('P5', 0, 40, 35, 60, 'Z5 curta'),
      Z('P1', 50, 43, 50, 57, 'Diag. longa'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Ataque adversário na Z2 (ponta direita deles) → bola chega ao nosso lado esquerdo. Espelho perfeito da Z4.',
      'Bloco de 2 jogadores: P4 (ponta na paralela) + P3 (central na diagonal).',
      'P2 (oposto / distribuidor) como off-blocker, 2-2,5 m da rede no lado direito.',
      'P1 (~7-7,5 m, 1 m da linha direita) defende a diagonal longa.',
      'P5 (~7-7,5 m, 0,5 m da linha esquerda) defende a paralela profunda na sombra do bloco.',
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
      Z('P1', 65, 40, 35, 60, 'Z1 curta'),
      Z('P5', 0, 43, 50, 57, 'Diag. longa'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 35, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Ataque adversário na Z4 → bola chega ao nosso lado direito.',
      'Disposição 3F-2B: 3 jogadores à frente → bloco de 2 jogadores favorável (P3 + P2 distribuidor-bloqueador).',
      'P4 (ponta) off-blocker curto no lado esquerdo, sobre a linha de ataque (~2-2,5 m da rede).',
      'P5 defende a diagonal longa (~7 m, 0,5 m da linha esquerda).',
      'P1 defende a paralela direita profunda na sombra do bloco (~7 m, 0,5 m da linha direita).',
      'Inconveniente: apenas 2 defesas atrás → 30+ m² por defesa (vs 20 m² no 6v6).',
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
      Z('P5', 0, 40, 50, 60, 'Diag. E'),
      Z('P1', 50, 40, 50, 60, 'Diag. D'),
    ],
    mainShot: { toX: 50, toY: 82 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 75, toY: 70 }],
    notes: [
      'Ataque rápido central (Z3) — ângulos curtos.',
      'Com 3 jogadores à frente, um bloco de 3 é possível mas deixa apenas 2 defesas no solo — não recomendado.',
      'Recomendado: bloco de 2 jogadores (P3 + a ponta mais próxima da linha de ataque).',
      'P5 e P1 1 m mais à frente (~7 m) porque os ângulos são mais curtos nas bolas rápidas.',
      'Fragilidade: bola axial profunda descoberta (sem defesa de Z6 no 5v5 3F-2B).',
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
      Z('P5', 0, 43, 35, 57, 'Z5 curta'),
      Z('P1', 50, 43, 50, 57, 'Diag. longa'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Ataque adversário na Z2 → bola chega ao nosso lado esquerdo. Espelho perfeito da Z4.',
      'Bloco de 2 jogadores: P4 (ponta na paralela) + P3 (central na diagonal).',
      'O distribuidor (P2) como off-blocker, 2-2,5 m da rede no lado direito (anti-amorti + transição rápida para o alvo).',
      'P1 defende a diagonal longa (~7-7,5 m).',
      'P5 defende a paralela esquerda profunda na sombra do bloco.',
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
      Z('P2', 65, 34, 35, 66, 'Paralela curta'),
      Z('P4', 0, 25, 35, 45, 'Diag. E'),
      Z('P1', 25, 62.5, 45, 37.5, 'Fundo'),
    ],
    mainShot: { toX: 20, toY: 55 },
    altShots: [{ toX: 82, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 70, toY: 47.5 }],
    notes: [
      'Ataque adversário na Z4 → bola chega ao nosso lado direito.',
      'Formação em losango (1-2-1) → sistema A: 1 bloqueador (P3) + 3 defesas.',
      'P3 sobe para um bloco individual no lado direito (frente ao atacante adversário).',
      'P2 (à frente, à direita) recua para a linha dos 3 m, 3,5-4 m da rede — cobre amortis e fintas atrás do bloco.',
      'P4 (à frente, à esquerda) recua para meia-distância à esquerda — cobre a diagonal curta.',
      'P1 (único defesa atrás) cobre a diagonal longa (~7-7,5 m, 1 m da linha direita).',
      'Antecipação = competência #1: apenas 1 defesa atrás → ~40 m² a cobrir.',
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
      Z('P4', 0, 32.5, 35, 52.5, 'Diag. E'),
      Z('P2', 65, 32.5, 35, 52.5, 'Diag. D'),
      Z('P1', 30, 62.5, 45, 37.5, 'Fundo'),
    ],
    mainShot: { toX: 50, toY: 77.5 },
    altShots: [{ toX: 18, toY: 55 }, { toX: 80, toY: 55 }],
    notes: [
      'Ataque rápido central (Z3) — a configuração mais difícil em 4v4: pouco tempo, apenas 1 bloqueador.',
      'Bloco de 1 jogador (P3 sozinho) em modo READ constante (sem commitment possível).',
      'P4 e P2 recuam para meia-distância (~3,5-4 m da rede, cobrem ambas as diagonais curtas).',
      'O único defesa atrás P1 atua como defesa de Z6 (eixo central, 7-8 m da rede).',
      'Trajetória principal: bola axial potente (em direção a P1) já que o bloco de 1 jogador só cobre o centro.',
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
      Z('P4', 0, 34, 35, 66, 'Paralela curta'),
      Z('P2', 60, 25, 40, 45, 'Diag. D'),
      Z('P1', 30, 62.5, 45, 37.5, 'Fundo'),
    ],
    mainShot: { toX: 80, toY: 55 },
    altShots: [{ toX: 18, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 30, toY: 55 }],
    notes: [
      'Ataque adversário na Z2 → bola chega ao nosso lado esquerdo. Espelho perfeito da Z4.',
      'Sistema A: 1 bloqueador (P3) + 3 defesas.',
      'P4 (à frente, à esquerda) recua para a linha dos 3 m, 3,5-4 m da rede — cobre amortis e fintas à esquerda.',
      'P2 (à frente, à direita) recua para meia-distância à direita — cobre a diagonal curta.',
      'O único defesa atrás P1 defende a diagonal longa (~7-7,5 m, 1 m da linha esquerda).',
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
      Z('P1', 65, 43, 35, 57, 'Diag. curta'),
      Z('P5', 0, 43, 50, 57, 'Diag. longa'),
      Z('P4', 0, 25, 35, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 22, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Ataque adversário na Z4 → bola chega ao nosso lado direito.',
      'Formação em quadrado (2-2 / box) → sistema A: 1 bloqueador (P2) + 3 defesas.',
      'P2 (à frente, à direita) bloco individual frente ao atacante adversário, fica com a paralela.',
      'P4 (à frente, à esquerda) como off-blocker, 2-2,5 m da rede — cobre amorti e corte à esquerda.',
      'P5 defende a diagonal longa (~7 m, 0,5 m da linha esquerda).',
      'P1 defende a paralela profunda / diagonal curta (~7 m, na sombra do bloco).',
      'Sistema B (bloco de 2 P2+P4) possível mas deixa apenas 2 defesas — reservar para atacantes potentes.',
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
      Z('P5', 0, 40, 50, 60, 'Diag. E'),
      Z('P1', 50, 40, 50, 60, 'Diag. D'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 47.5 }],
    notes: [
      'Ataque rápido central (Z3) — ângulos curtos, pouco tempo.',
      'Bloco de 2 jogadores (P4 + P2) fecha o centro — sistema B com 2 defesas atrás.',
      'P5 e P1 ficam com as diagonais curtas (~7 m, 0,5-1 m das linhas laterais).',
      'Grande fragilidade: sem cobertura curta atrás do bloco, o quadrado não tem jogador a meia-distância.',
      'Alternativa: bloco de 1 jogador (papel tipo P3, aqui P4 ou P2 sozinho) para libertar um defesa de amorti.',
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
      Z('P5', 0, 43, 35, 57, 'Diag. curta'),
      Z('P1', 50, 43, 50, 57, 'Diag. longa'),
      Z('P2', 60, 25, 40, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 78, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Ataque adversário na Z2 → bola chega ao nosso lado esquerdo. Espelho perfeito da Z4.',
      'Sistema A: 1 bloqueador (P4) + 3 defesas.',
      'P4 (à frente, à esquerda) bloco individual frente ao atacante adversário, fica com a paralela.',
      'P2 (distribuidor-atacante à frente, à direita) como off-blocker, 2-2,5 m da rede — anti-amorti + transição rápida para o alvo.',
      'P1 defende a diagonal longa (~7 m, 0,5 m da linha direita).',
      'P5 defende a paralela curta profunda (~7 m, na sombra do bloco).',
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
      Z('P6', 33, 52, 34, 48, 'Eixo'),
      Z('P5', 0, 43, 35, 57, 'Diag. E'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 75 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 70 }, { toX: 18, toY: 40 }],
    notes: [
      'Ataque adversário na Z4 → bola chega ao nosso lado direito.',
      'Disposição 2F-3B (P4+P3 à frente, P5+P6+P1 atrás, P1 a penetrar): bloco de 1 jogador.',
      'P3 (central) bloca sozinho à direita — não há P2 disponível para um bloco de 2.',
      'P4 (ponta) off-blocker, 2-2,5 m da rede à esquerda.',
      '3 defesas profundos: P5 diagonal longa, P6 eixo central (~7-8 m), P1 paralela direita.',
      'O sistema 1-1-3 (1 bloqueador + 1 off-blocker + 3 defesas) é a defesa mais próxima da perimétrica 6v6.',
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
      Z('P5', 0, 40, 33, 60, 'Diag. E'),
      Z('P6', 33, 52, 34, 48, 'Eixo'),
      Z('P1', 67, 40, 33, 60, 'Diag. D'),
    ],
    mainShot: { toX: 50, toY: 75 },
    altShots: [{ toX: 22, toY: 65 }, { toX: 78, toY: 65 }],
    notes: [
      'Ataque rápido central (Z3) — ângulos curtos.',
      'Bloco de 1 jogador (P3) em leitura — a bola rápida é o alvo mais difícil no 2F-3B.',
      'P4 lateralizado a meia-distância (~2 m da rede) para desvios.',
      'Vantagem: 3 defesas profundos (P5, P6, P1) cobrem as 3 principais zonas atrás.',
      'P6 fica frente ao atacante central na sua linha de ataque (~7,5-8 m, eixo).',
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
      Z('P5', 0, 40, 35, 60, 'Paralela E'),
      Z('P6', 33, 52, 34, 48, 'Eixo'),
      Z('P1', 65, 43, 35, 57, 'Diag. D'),
      Z('P3', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 75 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 70 }, { toX: 80, toY: 40 }],
    notes: [
      'Ataque adversário na Z2 → bola chega ao nosso lado esquerdo. Espelho da Z4.',
      'Bloco de 1 jogador: P4 bloca sozinho no lado esquerdo (sem P2 no 2F-3B).',
      'P3 (central) torna-se off-blocker à direita, 2-2,5 m da rede.',
      'P5 defende a paralela esquerda profunda, P6 o eixo, P1 a diagonal longa.',
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
      { posNumber: 'P5', x: 0, y: 43, w: 50, h: 57, label: 'Diag. longa', labelPos: { x: 18, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Sombra do bloco', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
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
      { label: 'Posição 2 (oposto / OPP)', text: 'Bloqueador da paralela — bloca, sobe à rede no lado direito.' },
      { label: 'Posição 3 (central)', text: 'Fecha a diagonal num bloco de 2 com o oposto.' },
      { label: 'Posição 4 (ponta off-blocker)', text: 'Recua para a linha dos 3 m no lado esquerdo — cobre o corte curto (diagonal fechada) e fintas.' },
      { label: 'Posição 5 (Líbero)', text: 'Defende a diagonal longa, ~7-8 m da rede, no ombro interior do central.' },
      { label: 'Posição 6 (defesa central atrás)', text: 'Bolas altas que passam o bloco, toques longos no bloco, eixo ~8-8,5 m.' },
      { label: 'Posição 1 (defesa atrás à direita)', text: 'Defende a paralela profunda na sombra do bloco, ~7-7,5 m da rede, 0,5 m da linha direita.' },
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
      { posNumber: 'P5', x: 0, y: 34, w: 36, h: 66, label: 'Diag. E', labelPos: { x: 10, y: 70 } },
      { posNumber: 'P6', x: 32, y: 52, w: 36, h: 48, label: 'Eixo', labelPos: { x: 42, y: 73 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 64, y: 34, w: 36, h: 66, label: 'Diag. D', labelPos: { x: 75, y: 70 } },
      { posNumber: 'P4', x: 0, y: 25, w: 28, h: 28, label: 'Cobertura', labelPos: { x: 4, y: 36 } },
      { posNumber: 'P2', x: 72, y: 25, w: 28, h: 28, label: 'Cobertura', labelPos: { x: 78, y: 36 } },
    ],
    mainShot: { toX: 75, toY: 65 },
    altShots: [
      { toX: 25, toY: 65 },
      { toX: 50, toY: 80 },
    ],
    notes: [
      { label: 'Posição 3 (central)', text: 'Bloco de 1 jogador em leitura (read) ou commitment consoante o scouting do adversário.' },
      { label: 'Posições 4 e 2 (pontas)', text: 'Sobre a linha de ataque (~2-2,5 m da rede, 0,5 m das linhas laterais): cobrem desvios do bloco e bolas que passam pelo bloco.' },
      { label: 'Posição 5 (Líbero)', text: 'Frente ao atacante central, na sua linha de ataque (~7-8 m da rede).' },
      { label: 'Posição 6 (defesa central atrás)', text: 'Ombros virados para o atacante; defende a bola potente que passa o bloco (eixo ~8-8,5 m).' },
      { label: 'Posição 1 (defesa atrás à direita)', text: 'Avança um metro (~7,5 m da rede, 1 m da linha direita): ângulos mais curtos nas bolas rápidas.' },
      { label: 'Regra-chave', text: '"Parado no contacto": todos parados e equilibrados no instante exato do remate.' },
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
      { posNumber: 'P1', x: 50, y: 43, w: 50, h: 57, label: 'Diag. longa', labelPos: { x: 68, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Sombra do bloco', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
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
      { label: 'Posição 4 (ponta)', text: 'Bloqueador da paralela — bloca à rede no lado esquerdo.' },
      { label: 'Posição 3 (central)', text: 'Fecha a diagonal num bloco de 2 com a ponta.' },
      { label: 'Posição 2 (oposto / OPP)', text: 'Torna-se off-blocker à direita — recua para a linha dos 3 m, cobre o corte curto e fintas.' },
      { label: 'Posição 5 (Líbero)', text: 'Defende a paralela profunda na sombra do bloco, ~7-7,5 m da rede, 0,5 m da linha esquerda.' },
      { label: 'Posição 6 (defesa central atrás)', text: 'Bolas altas por cima do bloco, eixo ~8-8,5 m da rede.' },
      { label: 'Posição 1 (distribuidor ou ponta/OPP)', text: 'Defende a diagonal longa, ~7-8 m da rede.' },
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
  { title: 'Atacante longe da rede', action: 'AVANÇAR', accentColor: 'var(--orange)',
    points: ['Passe a 2-3 m da rede', 'Não consegue rematar com força', 'Alto risco de finta ou amorti', 'Avançar 1-2 metros'] },
  { title: 'Atacante perto da rede', action: 'RECUAR', accentColor: 'var(--plum)',
    points: ['Passe a menos de 1 m da rede', 'Pode rematar a toda a potência', 'Trajetória descendente rápida', 'Recuar o máximo possível'] },
  { title: 'O ombro do atacante', action: 'Observar o ombro de remate', accentColor: 'var(--teal)',
    points: ['Ombro alto puxado atrás = remate potente', 'Ombro baixo = provável finta', 'Rotação do ombro = direção da bola', 'Ajustar em 0,5 s'] },
  { title: 'A corrida de balanço', action: 'Observar a corrida de balanço', accentColor: 'var(--ink)',
    points: ['Corrida longa e rápida = remate forte', 'Corrida curta ou paragem = finta', 'Ângulo da corrida = zona alvo', 'Antecipar a potência'] },
];

const COMMANDEMENTS = [
  ['Observa o distribuidor', 'Depois o atacante, não a bola'],
  ['Mesmo lado = Avançar', 'Lado oposto = Recuar'],
  ['Mau passe adversário', '→ Avançar 1-2 m (finta provável)'],
  ['Nunca no meio', 'Decide: à frente OU atrás'],
  ['Comunica SEMPRE', '"Minha!" em cada bola que tomas'],
  ['Move-te após o serviço', 'Posição de serviço ≠ posição defensiva'],
  ['Lê o ombro', 'Ombro alto = remate, baixo = finta'],
  ['Postura baixa', 'Joelhos fletidos, braços prontos'],
  ['Transições rápidas', '3 segundos no máximo para repor'],
  ['Defende a tua zona', 'Cada jogador tem uma responsabilidade'],
];

type MistakesSection = {
  title: string;
  intro: string;
  mistakes: [string, string][];
};

const MISTAKES_BY_SIZE: Record<TeamSize, MistakesSection> = {
  6: {
    title: 'Os dez erros comuns de posicionamento defensivo',
    intro: 'Tipologia retirada de Mike Hebert (Thinking Volleyball), John Forman (CoachingVB), USA Volleyball e do manual Top Volley da FIVB.',
    mistakes: [
      ['1. Deriva para a sombra do bloco', 'Os defesas refugiam-se instintivamente atrás dos bloqueadores em vez de se posicionarem em torno da sombra do bloco — deixando abertas as diagonais e as trajetórias "off the block". Hebert: "creeping into the block shadow".'],
      ['2. Leitura defeituosa', 'O defesa fixa a bola em vez de seguir a sequência "bola → distribuidor → bola → atacante". Consequência: adivinha em vez de ler, e não está parado e equilibrado no momento do contacto ("stopped and balanced at the moment of contact").'],
      ['3. Líbero mal colocado em profundidade', 'Demasiado perto da rede, não consegue defender remates profundos; demasiado atrás, não consegue cobrir amortis. Regra: alinhar o ombro exterior com o ombro interior do central, 6-8 m da rede consoante o bloco.'],
      ['4. Distribuidor-defesa mal preparado', 'Postura demasiado baixa ou mal orientada que o impede de ver a bola + campo adversário; saída prematura para o alvo criando um buraco na Z1; sem "release call" a sinalizar que está a sair da defesa.'],
      ['5. Faltas de sobreposição (overlap)', 'A mais comum: Z6 deriva à frente de Z3, Z5 mais à direita do que Z6, e o distribuidor sai da sua posição demasiado cedo para penetrar (falta #1 no 5-1). No instante do contacto do servidor, todos os pés devem respeitar as relações frente/atrás e esquerda/direita (Regra 7.4).'],
      ['6. Transição receção → defesa esquecida', 'Os jogadores ficam congelados na sua formação de receção em W em vez de mudarem para a posição base defensiva assim que o distribuidor adversário toca a bola. Hebert: "sluggish recovery after play on the ball".'],
      ['7. Má gestão da zona 6', 'Confusão entre "6-up" (rotação), "6-back" (perimétrica) e "6-deep". O jogador de Z6 deve deslocar-se lateralmente consoante o lado do ataque adversário, não ficar centrado. Inclinar-se para trás para defender ("leaning back") coloca o peso nos calcanhares e mata a reatividade.'],
      ['8. Defesa falhada no ataque rápido central', 'Leitura do central adversário demasiado tardia; jogadores de trás não avançam (nas bolas rápidas, Z1 e Z5 devem avançar um metro porque os ângulos são mais curtos); "false stepping" (primeiro passo para trás) que desperdiça o tempo disponível.'],
      ['9. Cobertura de finta órfã', 'Nenhum defesa explicitamente designado para o amorti; "standing up on tips" — o defesa está baixo para o remate, depois levanta-se e estende a mão para a finta, deixando cair a bola à sua frente. O foco deve manter-se no remate em postura baixa que permita o salto à finta.'],
      ['10. Silêncio coletivo', 'Sem chamadas ("amorti!", "paralela!", "fora!", "minha!"); bloqueadores não comunicam a sua orientação paralela vs diagonal; sem capitão de rotação para verificar sobreposições antes do serviço.'],
    ],
  },
  5: {
    title: 'Erros comuns no 5v5',
    intro: 'Erros específicos do formato 5v5 (adaptações da Volleyball Canada, VolleyballXL e doutrina 6v6).',
    mistakes: [
      ['1. Reproduzir mecanicamente o 6v6', 'Cobrir 3 zonas profundas com 3 defesas funciona (disposição 2F-3B), mas falta o off-blocker que recua — a zona dos 3 m fica descoberta se ninguém for explicitamente designado.'],
      ['2. O off-blocker à frente fica colado à rede', 'Após o contacto do bloco, o off-blocker à frente deve recuar para 2-2,5 m para cobrir amortis. Se ficar à rede, a zona atrás do bloco fica completamente aberta.'],
      ['3. 2 defesas lado a lado', 'Na disposição 3F-2B, os 2 defesas profundos devem estar espaçados (um à esquerda, outro à direita) e não centrados juntos. Caso contrário, as linhas laterais ficam expostas.'],
      ['4. O distribuidor sai demasiado cedo (disposição em penetração)', 'Em 2F-3B com distribuidor a penetrar a partir de P1, deve esperar que a bola seja defendida antes de correr para o seu alvo — caso contrário abre-se um buraco em Z1.'],
      ['5. Confusão à frente/atrás', 'Com 5 jogadores, a tentação de deixar os da frente defenderem o seu lado ficando na linha dos 3 m é forte — mas isso deixa o fundo do campo descoberto. À frente sobe-se para blocar, atrás defende-se em profundidade.'],
      ['6. Leitura defeituosa', 'Faltando um jogador exige-se uma leitura ainda mais precoce do que no 6v6. Sequência "bola → distribuidor → bola → atacante" + paragem equilibrada no momento do contacto.'],
    ],
  },
  4: {
    title: 'Erros comuns no 4v4',
    intro: 'Erros específicos do 4v4 indoor (intramurais universitários, doutrina FFVb / Volleyball Canada, voleibol de praia 4s).',
    mistakes: [
      ['1. O bloqueador isolado sem cobertura de amorti', 'Os 3 defesas vão todos para o fundo, deixando a zona dos 3-5 m vazia. Alguém deve estar sempre designado para o amorti a 3,5-4 m da rede.'],
      ['2. 2 defesas em linha reta', 'Lado a lado à mesma profundidade → o corte cai entre eles. No 4v4, os defesas devem estar sempre escalonados (um perto, outro longe) ou afastados lateralmente.'],
      ['3. O distribuidor sai para o alvo antes da bola estar defendida', 'Transição prematura que deixa um buraco na defesa. O distribuidor espera pela confirmação de que a bola foi recuperada antes de ir para o seu alvo.'],
      ['4. Sem sinal entre bloqueador e defesas', 'O bloqueador TEM de sinalizar "paralela" ou "diagonal" antes do ataque começar. Sem isso, os 3 defesas não sabem o que cobrir — todos improvisam.'],
      ['5. O defesa de amorti demasiado longe da rede', 'Recua com os outros defesas atrás e já não consegue cobrir fintas curtas. A sua posição é a 3,5-4 m da rede, no eixo — não a 7 m.'],
      ['6. Bloco "aleatório" do jogador errado', 'No 4v4, blocar com um jogador mal colocado (longe do atacante) deixa o adversário frente a 3 defesas mal alinhados. O bloqueador deve ser o que está frente ao atacante principal.'],
      ['7. Leitura defeituosa', 'Com ~40 m² por defesa (vs 20 m² no 6v6), um erro de leitura é irrecuperável. Antecipação = competência #1 no 4v4.'],
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
    title: 'Os três principais sistemas defensivos (FIVB / USAV)',
    warning: {
      label: '⚠ Aviso terminológico',
      text: 'A expressão "defesa em W" muito ouvida em França é incorreta. A "formação em W" refere-se historicamente a uma formação de receção de serviço com 5 jogadores — não a um sistema defensivo. A doutrina internacional (FIVB, USAV IMPACT, Liskevych, Stone) distingue três sistemas: man-up (2-1-3), perimétrica (2-0-4) e rotação (3-2-1).',
    },
    systems: [
      {
        name: 'Defesa man-up (2-1-3)',
        tag: 'Antigamente "defesa em W" / defesa vermelha',
        principe: 'Um defesa avança até à linha dos 3 m atrás do bloco para intercetar fintas e amortis. Dois bloqueadores à rede, o off-blocker recua, e três jogadores em profundidade cobrem os ângulos longos.',
        forces: ['Excelente cobertura de amortis, fintas e bolas "lixo" atrás do bloco', 'Transição rápida para o ataque se o jogador avançado for o distribuidor', 'Simples de ensinar a equipas jovens'],
        faiblesses: ['Apenas 3 defesas profundos — vulnerável a remates potentes em diagonal fechada', 'Um atacante que remate forte entre os bloqueadores passa facilmente'],
        indication: 'Equipas jovens, escolar, adversários táticos que jogam muitas fintas ou bolas de mudança de ritmo.',
        accent: 'var(--orange)',
      },
      {
        name: 'Defesa perimétrica (2-0-4)',
        tag: 'Defesa branca — sistema dominante no alto nível masculino',
        principe: 'Os quatro defesas atrás formam um U aberto para a rede, quase sobre as linhas laterais e a linha de fundo — "um pé na linha" (Liskevych). O meio do campo é intencionalmente abandonado.',
        forces: ['Excelente cobertura de remates potentes, paralelas e cantos profundos', 'Movimento coletivo simples', 'Sistema predominante no voleibol masculino internacional moderno'],
        faiblesses: ['Muito vulnerável a amortis curtos atrás do bloco — zona central entre 3 e 5 m descoberta', 'Exige defesas atléticos capazes de mergulhar para a frente'],
        indication: 'Sénior, masculino, nível internacional, adversários potentes.',
        accent: 'var(--teal)',
      },
      {
        name: 'Defesa de rotação / slide defense (3-2-1)',
        tag: 'Rotational / slide defense',
        principe: 'Os três defesas atrás deslizam para o lado do ataque adversário: o jogador atrás do oposto avança atrás do bloco (amorti), o central desliza para a paralela atacada, o defesa do lado atacado fica com o ângulo curto.',
        forces: ['Excelente cobertura da paralela profunda E do amorti em simultâneo', 'Sistema muito adaptável', 'Transição rápida do distribuidor quando este está em P1'],
        faiblesses: ['Menos um defesa em profundidade (um jogador dedicado ao amorti)', 'Canto da diagonal oposta vulnerável', 'Elevada exigência de leitura e coordenação'],
        indication: 'Adversários que misturam potência e paralelas/amortis; nível intermédio a elite.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['Man-up 2-1-3', 'Perim. 2-0-4', 'Rotação 3-2-1'],
    tableRows: [
      ['Jogador avançado atrás do bloco', 'Sim', 'Não', 'Sim'],
      ['Defesas em profundidade', '3', '4', '2'],
      ['Cobertura de amorti', '★★★', '★', '★★'],
      ['Cobertura de remate potente', '★★', '★★★', '★★'],
      ['Cobertura de paralela profunda', '★★', '★★', '★★★'],
      ['Cobertura de diagonal fechada', '★', '★★★', '★★'],
      ['Posição típica do líbero', 'Z5 ou Z6', 'Z5 (sobre a linha)', 'Z5 desliza'],
      ['Complexidade', 'Baixa', 'Média', 'Alta'],
    ],
    footer: {
      strong: 'A escolha não é uma questão de ortodoxia: ',
      text: 'depende do perfil ofensivo do adversário e das qualidades dos teus defesas. A defesa moderna define-se menos pela formação do que pela leitura — sequência visual "bola → distribuidor → bola → atacante" e paragem equilibrada no momento do contacto.',
    },
  },
  5: {
    title: 'Os três sistemas defensivos no 5v5',
    warning: {
      label: '⚠ Formato não oficial da FIVB',
      text: 'O 5v5 indoor não tem regulamento dedicado da FIVB ou FFVb. Estes três sistemas são adaptações lógicas do 6v6 documentadas pela VolleyballXL, The Art of Coaching Volleyball e Volleyball Canada. Não existe um manual técnico oficial 5v5 — escolhe o sistema consoante a disposição da tua equipa (2-3 ou 3-2).',
    },
    systems: [
      {
        name: 'Sistema 1-1-3',
        tag: '1 bloqueador + 1 cobertura de amorti + 3 defesas profundos',
        principe: 'Adequado à disposição 2F-3B (2 à frente, 3 atrás). O bloqueador salta sozinho; o 2º jogador da frente recua como off-blocker a 2-3 m da rede para amortis; 3 defesas em profundidade cobrem paralela, eixo e diagonal longa.',
        forces: ['3 defesas em profundidade como na perimétrica 6v6 — boa cobertura de remates', 'A disposição mais próxima do 6v6 5-1 (preparação para a transição para 6v6)', 'Amorti coberto pelo off-blocker'],
        faiblesses: ['Bloco de apenas 1 jogador → frágil contra grandes atacantes', 'O off-blocker a 2-3 m atrás tem de ser muito reativo'],
        indication: 'Disposição 2F-3B (distribuidor a penetrar), adversários moderadamente potentes. Sistema recomendado para a transição pedagógica para o 6v6.',
        accent: 'var(--teal)',
      },
      {
        name: 'Sistema 2-1-2',
        tag: '2 bloqueadores + 1 amorti + 2 defesas profundos',
        principe: 'Adequado à disposição 3F-2B (3 à frente, 2 atrás). Bloco de 2 jogadores à rede, o central à frente cobre o amorti a 2-3 m da rede, 2 defesas em profundidade ficam com a diagonal longa e a paralela.',
        forces: ['Bloco de 2 jogadores como no 6v6 — significativamente mais eficaz contra remates potentes', '3 atacantes à rede para o contra-ataque'],
        faiblesses: ['Apenas 2 defesas em profundidade → 9 m de fundo de campo muito difíceis de cobrir', 'Elevada exigência atlética sobre os 2 defesas atrás'],
        indication: 'Disposição 3F-2B contra equipas muito potentes. Privilegiar no fim de um set em que cada ponto conta.',
        accent: 'var(--orange)',
      },
      {
        name: 'Sistema 1-2-2',
        tag: 'Man-up adaptado (equivalente ao 2-1-3 do 6v6)',
        principe: 'Bloqueador único + 2 cobertores da zona frontal (amorti + atrás do bloco) + 2 defesas profundos. Adequado quando o adversário finta muito ou para equipas iniciantes.',
        forces: ['Excelente cobertura de fintas curtas (2 cobertores da zona frontal)', 'Amorti difícil de explorar pelo adversário'],
        faiblesses: ['Apenas 2 defesas em profundidade → remates potentes difíceis', 'Exige coordenação entre os 2 cobertores da zona frontal'],
        indication: 'Adversários que fintam muito; voleibol feminino, categorias jovens, equipas técnicas.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['1-1-3', '2-1-2', '1-2-2 (man-up)'],
    tableRows: [
      ['Bloqueadores', '1', '2', '1'],
      ['Cobertores zona frontal', '1 (off-blocker)', '1 (amorti)', '2 (amorti + atrás do bloco)'],
      ['Defesas em profundidade', '3', '2', '2'],
      ['Cobertura de amorti', '★★', '★★', '★★★'],
      ['Cobertura de remate potente', '★★', '★★★', '★★'],
      ['Cobertura do fundo de campo', '★★★', '★★', '★★'],
      ['Disposição correspondente', '2F-3B', '3F-2B', '2F-3B / 3F-2B'],
      ['Complexidade', 'Baixa', 'Média', 'Alta'],
    ],
    footer: {
      strong: 'Recomendação 5v5: ',
      text: 'o sistema 1-1-3 na disposição 2F-3B com distribuidor a penetrar é a defesa mais próxima do 6v6 — ideal como transição pedagógica. O 2-1-2 só se justifica contra atacantes realmente potentes.',
    },
  },
  4: {
    title: 'Os três sistemas defensivos no 4v4',
    warning: {
      label: '⚠ Formato não oficial da FIVB',
      text: 'O 4v4 indoor não tem regulamento oficial da FIVB. Estes três sistemas vêm da prática dos intramurais universitários (EUA), dos manuais de transição pedagógica FFVb / Volleyball Canada e da literatura de praia (Brandon Joyner, Better at Beach). Com 4 jogadores, cada defesa cobre ~30-40 m² (vs 20 m² no 6v6) — a antecipação é a competência #1.',
    },
    systems: [
      {
        name: 'Sistema A: 1 bloqueador + 3 defesas',
        tag: 'O mais comum no 4v4 indoor',
        principe: 'Um único jogador sobe para blocar frente ao atacante principal. Os outros 3 dividem-se: defesa de amorti (3-4 m da rede, eixo), defesa de diagonal (7-7,5 m, linha direita, diagonal longa), defesa de paralela (7-7,5 m, na sombra do bloco).',
        forces: ['Cobre amorti, paralela e diagonal longa em simultâneo', 'O mais equilibrado no 4v4', 'Sinal paralela/diagonal do bloqueador muito eficaz'],
        faiblesses: ['Bloco de 1 jogador — vulnerável a grandes atacantes', 'Exige um defesa de amorti disciplinado que não recua'],
        indication: 'Adversários de nível equivalente ou moderado. Disposição mais versátil no 4v4 (formação em losango ou linha 3-1).',
        accent: 'var(--orange)',
      },
      {
        name: 'Sistema B: 2 bloqueadores + 2 defesas',
        tag: 'Bloco de 2 jogadores (raro no 4v4)',
        principe: 'Os 2 jogadores da frente sobem juntos frente ao atacante principal. Os 2 de trás posicionam-se: um do lado da paralela (7 m, 1 m da linha), outro no eixo ligeiramente deslocado para a diagonal. O amorti não é coberto.',
        forces: ['Bloco de 2 jogadores significativamente mais eficaz contra remates potentes', 'Pressão máxima sobre o atacante adversário'],
        faiblesses: ['Apenas 2 defesas no solo → impossível cobrir tudo', 'Amorti atrás do bloco completamente descoberto', 'Obriga a uma escolha: paralela OU diagonal, não ambas'],
        indication: 'A usar apenas contra atacantes muito potentes sem subtileza (sem fintas). Disposição quadrado 2-2 ou linha 3-1.',
        accent: 'var(--plum)',
      },
      {
        name: 'Sistema C: 0 bloqueadores',
        tag: 'Defesa baixa (adversários sem remate)',
        principe: 'Nenhum jogador sobe para blocar. Os 4 jogadores defendem em profundidade: 2 a meia-distância (3-4 m) para fintas, 2 em profundidade (7-8 m) para bolas mais longas. O distribuidor atua como 4º defesa.',
        forces: ['Cobre toda a profundidade do campo', 'Bem adaptado a trocas lentas'],
        faiblesses: ['CONTRAPRODUCENTE assim que um adversário remata a sério (o remate passa sem oposição)', 'Sem pressão à rede'],
        indication: 'Níveis escolares, recreativo iniciante, adversários que não rematam. Evitar assim que o adversário ganhe potência.',
        accent: 'var(--teal)',
      },
    ],
    tableHeaders: ['Sistema A', 'Sistema B', 'Sistema C'],
    tableRows: [
      ['Bloqueadores', '1', '2', '0'],
      ['Defesas em profundidade', '3', '2', '4'],
      ['Cobertura de amorti', '★★', '★', '★★★'],
      ['Cobertura de remate potente', '★★', '★★★', '★ (sem bloco)'],
      ['Cobertura de paralela profunda', '★★', '★★', '★★'],
      ['Cobertura de diagonal longa', '★★★', '★★', '★★'],
      ['Adversários recomendados', 'Todos os níveis', 'Muito potentes', 'Sem remate'],
      ['Complexidade', 'Baixa', 'Média', 'Baixa'],
    ],
    footer: {
      strong: 'Recomendação 4v4: ',
      text: 'o sistema A (1 bloqueador + 3 defesas) é o padrão quase universal. O sistema B só se justifica contra atacantes realmente potentes no fim de um set. O sistema C só funciona a nível recreativo iniciante — assim que um adversário rematar, voltar ao sistema A.',
    },
  },
};

const EXERCICES = [
  { title: 'Leitura de situação', level: 'Iniciante', duration: '10 min', materiel: '1 treinador ou parceiro com bolas',
    objectif: 'Aprender a identificar rapidamente a zona de ataque',
    steps: ['O treinador coloca-se do outro lado da rede na zona 4, 3 ou 2', 'Tu partes do centro do campo', 'O treinador anuncia a zona e lança a bola', 'Tens de chegar à tua zona defensiva em 2-3 segundos', 'Repetir 20 vezes variando as zonas'] },
  { title: 'Avançar / recuar consoante o passe', level: 'Intermédio', duration: '15 min', materiel: '1 distribuidor, 1 atacante, vários defesas',
    objectif: 'Ajustar a tua posição consoante a qualidade do passe',
    steps: ['O distribuidor faz passes de qualidade variada ao atacante', 'Passe perto da rede → Recuas (remate potente esperado)', 'Passe longe da rede → Avanças (finta provável)', 'O atacante remata e tu defendes', 'O treinador corrige a tua posição após cada bola'] },
  { title: 'Comunicação defensiva', level: 'Todos os níveis', duration: '10 min', materiel: 'Equipa completa',
    objectif: 'Desenvolver a comunicação automática',
    steps: ['Jogo no teu formato (4v4, 5v5 ou 6v6) mas GRITANDO todas as chamadas', 'Penalização: -1 ponto se um jogador não gritar "Minha!" na sua bola', 'Bónus: +1 ponto se toda a equipa comunicar numa troca', 'Cada jogador deve anunciar a zona de ataque adversária'] },
  { title: 'Defesa contra fintas', level: 'Intermédio', duration: '15 min', materiel: '1 atacante, 3 defesas atrás',
    objectif: 'Melhorar a defesa de bolas curtas',
    steps: ['O atacante joga APENAS fintas e amortis', 'Os defesas devem avançar todos (3-4 m)', 'Objetivo: recuperar 8 em 10 bolas', 'Depois alternar: 5 fintas, 5 remates para trabalhar a adaptação'] },
  { title: 'Transições rápidas', level: 'Avançado', duration: '20 min', materiel: 'Equipa completa',
    objectif: 'Dominar as mudanças ataque-defesa',
    steps: ['Jogo normal mas o treinador cronometra as transições', 'Objetivo: estar em posição defensiva em menos de 3 segundos', 'Se for demasiado lento, a equipa faz 5 flexões e recomeça', 'Aumentar progressivamente o ritmo das trocas'] },
  { title: 'Leitura do atacante', level: 'Avançado', duration: '15 min', materiel: '1 atacante, defesas',
    objectif: 'Antecipar a partir da linguagem corporal',
    steps: ['O atacante alterna remate, finta, amorti sem aviso', `Antes de rematar, o defesa anuncia a sua previsão: "Remate!" ou "Finta!"`, 'Ponto se a previsão estiver correta E a bola for defendida', 'Foco em: ombro, corrida de balanço, posição em relação à rede'] },
];

type GuidePositionnementProps = {
  teamSize?: TeamSize;
  configId?: string;
};

export default function GuidePositionnementPt({ teamSize: teamSizeProp, configId: configIdProp }: GuidePositionnementProps = {}) {
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
      return <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>Diagrama não disponível para esta disposição.</div>;
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
        <div style={S.label}>A configuração da tua equipa</div>
        <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
          Escolhe o teu formato e a disposição tática: <strong>todo o conteúdo do guia</strong> (posições, zonas, defesa por ataque) vai adaptar-se.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Formato de jogo</div>
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
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Disposição tática</div>
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
        <div style={S.label}>Princípio básico da defesa</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0' }}>O posicionamento defensivo depende de 3 fatores principais:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['A tua posição (à frente ou atrás)', 'A zona de ataque adversária (zona 4, 3, 2)', 'O tipo de ataque (remate potente, finta, amorti)'].map((pt, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={S.bullet}>▸</span>
              <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Positions and zones */}
      <section>
        <h2 style={S.section}>1. Posições e zonas — {configuration.shortName} ({teamSize}v{teamSize})</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            Disposição da tua equipa em {configuration.name}
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
              Ver cada posição em detalhe em /positions →
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--ink)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Regra importante: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>
            {teamSize === 6 && 'Os jogadores de trás (5, 6, 1) NÃO PODEM blocar à rede. Defendem no fundo do campo.'}
            {teamSize === 5 && 'Com 5 jogadores, cada defesa cobre ~30 m² (vs 20 m² no 6v6). A leitura torna-se crítica.'}
            {teamSize === 4 && 'Sem líbero. Cada jogador defende ~30-40 m². A antecipação é a competência #1.'}
          </span>
        </div>
      </section>

      {/* 2. Positioning by zone */}
      <section>
        <h2 style={S.section}>2. Posicionamento por zona de ataque adversária</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button key={z} onClick={() => setZone(z)} style={zone === z ? btnActive : btnBase}>
              {z === 'zone4' ? 'Ataque na Zona 4' : z === 'zone3' ? 'Ataque na Zona 3' : 'Ataque na Zona 2'}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {teamSize}v{teamSize} · {configuration.shortName} — {
              zone === 'zone4' ? 'Defesa contra ataque na Zona 4 (ponta esquerda adversária)' :
              zone === 'zone3' ? 'Defesa contra ataque na Zona 3 (centro)' :
              'Defesa contra ataque na Zona 2 (ponta direita adversária)'
            }
          </div>
          {renderZoneTab()}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <span><span style={{ color: 'var(--orange)' }}>■</span> <span style={{ color: 'var(--ink)', opacity: 0.6 }}>Zona de responsabilidade</span></span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>BLK</strong> = bloco</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>OFF</strong> = off-blocker</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>DEF</strong> = defesa</span>
        </div>
      </section>

      {/* 3. General principles */}
      <section>
        <h2 style={S.section}>3. Princípios gerais de posicionamento</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={S.labelTeal}>Zonas de responsabilidade</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          {[
            { title: 'Jogadores da frente',
              points: ['Prioridade: Blocar à rede', 'Se não blocar: defender a linha oposta', 'Distância: à rede ou no fundo'] },
            { title: teamSize === 4 ? 'Único defesa atrás (P1)' : 'Pilar defensivo (Líbero / P6)',
              points: teamSize === 4
                ? ['Posição: centro, ~40 m² a cobrir', 'Distância: 5-6 m da rede', 'Função: pilar defensivo único, antecipação máxima']
                : ['Posição: centro, adaptável', 'Distância: 5-6 m da rede', 'Função: pilar defensivo, cobre o centro'] },
            { title: 'Defesas exteriores atrás',
              points: ['Função variável: avançar ou recuar', 'Lado atacado: avançar (3-4 m)', 'Lado oposto: recuar (6-7 m)'] },
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
            ★ Princípios defensivos universais (4v4 / 5v5 / 6v6)
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px 0', lineHeight: 1.5 }}>
            Estes princípios de Hebert, Liskevych e Volleyball Canada aplicam-se independentemente do número de jogadores em campo.
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['O bloco é a base', 'Os defesas atrás posicionam-se em relação à sombra e orientação do bloco — não de forma independente.'],
              ['Parado e equilibrado no momento do contacto', 'Qualquer defesa ainda em movimento quando o atacante toca a bola vê a sua reatividade colapsar ("stopped on contact").'],
              ['Leitura visual sequencial', '"Bola → distribuidor adversário → bola → atacante adversário". No 4v4 e 5v5, os jogadores em falta obrigam a uma leitura ainda mais precoce.'],
              ['Comunicação por sinais', 'Mesmo a nível recreativo, o bloqueador tem de sinalizar "paralela" ou "diagonal" — sem isso, os defesas atrás não sabem o que cobrir.'],
              ['Zona frontal coberta', 'Alguém tem de cobrir os 3-5 m atrás do bloco — é a zona mais negligenciada nos formatos reduzidos (4v4 / 5v5).'],
              ['Transição rápida', 'O distribuidor nunca deve sair para o alvo antes de confirmar que a bola foi defendida ("release call").'],
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
        <h2 style={S.section}>4. Ler o atacante: pistas visuais</h2>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            O teu posicionamento deve ajustar-se ao que vês. Aqui ficam as pistas-chave:
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
          <strong style={{ color: 'var(--ink)' }}>Dica de profissional: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>Nos 2 segundos após o serviço adversário, foca o olhar no distribuidor, depois IMEDIATAMENTE no atacante que vai atacar.</span>
        </div>
      </section>

      {/* 5. When to step up / drop back */}
      <section>
        <h2 style={S.section}>5. Quando avançar ou recuar?</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, marginBottom: 14 }}>Árvore de decisão rápida</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderLeft: '4px solid var(--orange)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--orange)', letterSpacing: '0.08em' }}>Avançar (3-4 m da rede) quando:</div>
              {[
                'Estás do mesmo lado que o atacante',
                'O atacante está longe da rede (mau passe)',
                'Antecipas uma finta ou amorti',
                'O bloco é sólido — passam menos bolas potentes',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={S.bulletOrange}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '4px solid var(--ink)', paddingLeft: 16, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.08em' }}>Recuar (6-7 m da rede) quando:</div>
              {[
                'Estás do lado oposto ao do atacante',
                'O atacante tem um bom passe perto da rede',
                'O atacante é potente ou alto',
                'O bloco é fraco (apenas 1 bloqueador)',
                'Estás a defender a diagonal (trajetória mais longa)',
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
        <h2 style={S.section}>7. Posicionamento no serviço</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            <strong>A tua colocação no serviço é DIFERENTE da tua posição defensiva. </strong>
            Assim que o serviço sai, tens de te reposicionar.
          </p>
        </div>
        <div style={S.card}>
          <div style={{ ...S.labelTeal, marginBottom: 12 }}>Transição serviço → defesa</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['A tua equipa serve', 'Estás em posição de rotação'],
              ['O servidor bate', 'Observas o distribuidor adversário'],
              ['O distribuidor toca a bola', 'Move-te para a tua zona defensiva'],
              ['O atacante salta', 'Estás na posição final, pronto a reagir'],
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
        <h2 style={S.section}>8. Comunicação defensiva</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>Uma defesa silenciosa é uma defesa ineficaz.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { moment: 'Antes do ataque adversário', calls: [['"Número 4!"', 'Anuncia a zona de onde vem o ataque'], ['"Dois no bloco!"', 'Indica quantos bloqueadores'], ['"Paralela aberta!"', 'Se o bloco não cobre a paralela'], [`"A avançar!" / "A recuar!"`, 'Anuncia o teu movimento']] },
            { moment: 'Durante a ação', calls: [[`"Minha!" / "Eu vou!"`, 'Tomas a bola (a MAIS importante)'], ['"Tua!" / "Tu!"', 'Deixas a bola para um colega'], ['"Fora!"', 'A bola vai sair, não lhe toques'], ['"Bloco!"', 'Se blocares, anuncia']] },
            { moment: 'Depois da ação', calls: [['"Cobertura!"', 'Pede a cobertura do ataque'], ['"Livre!"', 'Bola livre, repor'], ['"Manter!"', 'Manter a defesa no lugar']] },
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
          <strong style={{ color: 'var(--ink)' }}>Regra de ouro: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>Em caso de dúvida entre dois jogadores, o mais avançado fica SEMPRE com a bola.</span>
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
                    <div style={S.labelTeal}>Pontos fortes</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.forces.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={S.bullet}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.55 }}>Pontos fracos</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.faiblesses.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sys.accent, marginTop: 6 }}>
                      Usar quando: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{sys.indication}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div style={{ ...S.card, marginTop: 14, overflowX: 'auto' }}>
                <div style={{ ...S.label, marginBottom: 10 }}>Tabela comparativa sintética</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.6 }}>Critério</th>
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
        <h2 style={S.section}>10. Transições ataque ↔ defesa</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            O voleibol é um jogo de transições rápidas. Passas constantemente de ataque a defesa e vice-versa.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Transição ataque → defesa', items: [['O teu colega ataca', 'Prepara-te mentalmente para defender'], ['A bola é devolvida', 'Identifica imediatamente quem vai atacar'], ['Movimento rápido', 'Chega à tua zona defensiva (2-3 segundos no máximo)'], ['Postura baixa', 'Dobra os joelhos, pronto a mergulhar']] },
            { label: 'Transição defesa → ataque', items: [['Defendes a bola', 'Passe preciso ao distribuidor'], ['Se estás À FRENTE', 'Corre para a rede para atacar ou blocar'], ['Se estás ATRÁS', 'Recua um pouco, pronto a cobrir o ataque'], ['Cobertura do ataque', 'Rodeia o teu atacante (num semicírculo a 2-3 m)']] },
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
        <h2 style={S.section}>11. Exercícios para melhorar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{i + 1}. {ex.title}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 8px', border: '1.5px solid var(--ink)', color: 'var(--ink)', background: 'var(--cream)', flexShrink: 0 }}>{ex.level}</span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, marginBottom: 6 }}>
                Duração: {ex.duration} · Material: {ex.materiel}
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
        <h2 style={S.section}>12. Os 10 mandamentos do defesa</h2>
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
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Mesmo lado que o atacante</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--orange)', marginBottom: 4 }}>→ AVANÇAR (3-4 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Defender fintas e amortis</div>
            </div>
            <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Lado oposto ao do atacante</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>→ RECUAR (6-7 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Defender diagonais longas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>Conclusão</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            O posicionamento defensivo aprende-se com prática e experiência. Não te desanimes se cometeres
            erros no início — até os profissionais ajustam constantemente a sua colocação.
          </p>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: 0 }}>
            A chave: aplica a regra básica (mesmo lado = avançar, oposto = recuar), observa o atacante,
            comunica com os teus colegas, e nunca tenhas medo de mergulhar para uma bola.
          </p>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, color: 'var(--ink)', margin: 0, letterSpacing: '0.06em' }}>A defesa ganha jogos.</p>
        </div>
      </section>

    </div>
  );
}
