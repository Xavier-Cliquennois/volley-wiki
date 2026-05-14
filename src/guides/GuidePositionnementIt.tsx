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
      Z('P1', 65, 40, 35, 60, 'Z1 corto'),
      Z('P5', 0, 43, 50, 57, 'Diag. lunga'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Attacco avversario in Z4 (la loro ala sinistra) → la palla arriva sul nostro lato destro.',
      'Sistema 2-1-2: muro a 2 (P2 sul lungolinea + P3 sulla diagonale) + 2 difensori profondi.',
      'P4 (schiacciatore) come off-blocker, 2-2,5 m dalla rete, 1 m dalla linea laterale — copre pallonetto e cut shot.',
      'P5 (~7-7,5 m, 0,5 m dalla linea sinistra) difende la diagonale lunga.',
      'P1 (~7-7,5 m, 0,5 m dalla linea destra) difende il lungolinea profondo, nell\'ombra del muro.',
      'Traiettoria principale difesa: diagonale lunga (statisticamente la traiettoria più frequente).',
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
      Z('P5', 0, 40, 50, 60, 'Diag. SX'),
      Z('P1', 50, 40, 50, 60, 'Diag. DX'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 82 }],
    notes: [
      'Attacco veloce centrale (Z3) — angoli stretti, poco tempo di reazione.',
      'Muro a 1: P3 (centrale) in lettura, il commitment non è possibile.',
      'P4 e P2 (off-blocker) a 2 m dalla rete sulla linea d\'attacco — coprono le deviazioni.',
      'P5 e P1 avanzati di 1 m (~7 m dalla rete) — gli angoli sono più stretti rispetto alle palle alte.',
      'Punto debole: nessun difensore centrale profondo dedicato (solo 2 giocatori in seconda linea nel 5v5).',
      'Regola chiave: "fermi al contatto" — tutti fermi ed equilibrati nell\'istante del contatto.',
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
      Z('P5', 0, 40, 35, 60, 'Z5 corto'),
      Z('P1', 50, 43, 50, 57, 'Diag. lunga'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Attacco avversario in Z2 (la loro ala destra) → la palla arriva sul nostro lato sinistro. Specchio perfetto della Z4.',
      'Muro a 2: P4 (lungolinea esterno) + P3 (diagonale centrale).',
      'P2 (opposto / alzatore) come off-blocker, 2-2,5 m dalla rete sul lato destro.',
      'P1 (~7-7,5 m, 1 m dalla linea destra) difende la diagonale lunga.',
      'P5 (~7-7,5 m, 0,5 m dalla linea sinistra) difende il lungolinea profondo nell\'ombra del muro.',
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
      Z('P1', 65, 40, 35, 60, 'Z1 corto'),
      Z('P5', 0, 43, 50, 57, 'Diag. lunga'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 35, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Attacco avversario in Z4 → la palla arriva sul nostro lato destro.',
      'Schema 3F-2B: 3 in prima linea → muro a 2 vantaggioso (P3 + P2 alzatore-bloccante).',
      'P4 (schiacciatore) off-blocker corto sul lato sinistro sulla linea d\'attacco (~2-2,5 m dalla rete).',
      'P5 difende la diagonale lunga (~7 m, 0,5 m dalla linea sinistra).',
      'P1 difende il lungolinea destro profondo nell\'ombra del muro (~7 m, 0,5 m dalla linea destra).',
      'Svantaggio: solo 2 difensori in seconda linea → 30+ mq per difensore (vs 20 mq nel 6v6).',
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
      Z('P5', 0, 40, 50, 60, 'Diag. SX'),
      Z('P1', 50, 40, 50, 60, 'Diag. DX'),
    ],
    mainShot: { toX: 50, toY: 82 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 75, toY: 70 }],
    notes: [
      'Attacco veloce centrale (Z3) — angoli stretti.',
      'Con 3 in prima linea, il muro a 3 è possibile ma lascia solo 2 difensori a terra — non consigliato.',
      'Consigliato: muro a 2 (P3 + l\'ala più vicina alla linea di tiro).',
      'P5 e P1 avanzati di 1 m (~7 m) perché gli angoli sono più stretti sulle veloci.',
      'Punto debole: palla profonda assiale scoperta (nessun difensore Z6 nel 5v5 3F-2B).',
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
      Z('P5', 0, 43, 35, 57, 'Z5 corto'),
      Z('P1', 50, 43, 50, 57, 'Diag. lunga'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Attacco avversario in Z2 → la palla arriva sul nostro lato sinistro. Specchio perfetto della Z4.',
      'Muro a 2: P4 (lungolinea esterno) + P3 (diagonale centrale).',
      'L\'alzatore (P2) come off-blocker, 2-2,5 m dalla rete sul lato destro (anti-pallonetto + transizione veloce verso il bersaglio).',
      'P1 difende la diagonale lunga (~7-7,5 m).',
      'P5 difende il lungolinea sinistro profondo nell\'ombra del muro.',
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
      Z('P2', 65, 34, 35, 66, 'Linea corta'),
      Z('P4', 0, 25, 35, 45, 'Diag. SX'),
      Z('P1', 25, 62.5, 45, 37.5, 'Profondo'),
    ],
    mainShot: { toX: 20, toY: 55 },
    altShots: [{ toX: 82, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 70, toY: 47.5 }],
    notes: [
      'Attacco avversario in Z4 → la palla arriva sul nostro lato destro.',
      'Formazione a rombo (1-2-1) → sistema A: 1 bloccante (P3) + 3 difensori.',
      'P3 sale a murare da solo sul lato destro (di fronte all\'attaccante avversario).',
      'P2 (avanti destra) arretra fino alla linea dei 3 m, 3,5-4 m dalla rete — copre pallonetti e finte dietro il muro.',
      'P4 (avanti sinistra) scende a metà campo sulla sinistra — copre la diagonale corta.',
      'P1 (unico difensore profondo) copre la diagonale lunga (~7-7,5 m, 1 m dalla linea destra).',
      'Anticipazione = abilità #1: solo 1 difensore profondo → ~40 mq da coprire.',
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
      Z('P4', 0, 32.5, 35, 52.5, 'Diag. SX'),
      Z('P2', 65, 32.5, 35, 52.5, 'Diag. DX'),
      Z('P1', 30, 62.5, 45, 37.5, 'Profondo'),
    ],
    mainShot: { toX: 50, toY: 77.5 },
    altShots: [{ toX: 18, toY: 55 }, { toX: 80, toY: 55 }],
    notes: [
      'Attacco veloce centrale (Z3) — schema più difficile nel 4v4: poco tempo, un solo bloccante.',
      'Muro a 1 (P3 da solo) in modalità READ costante (commitment non possibile).',
      'P4 e P2 arretrano a metà campo (~3,5-4 m dalla rete, coprono entrambe le diagonali corte).',
      'L\'unico difensore profondo P1 agisce come difensore Z6 (asse centrale, 7-8 m dalla rete).',
      'Traiettoria principale: palla assiale potente (verso P1) poiché il muro a 1 copre solo il centro.',
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
      Z('P4', 0, 34, 35, 66, 'Linea corta'),
      Z('P2', 60, 25, 40, 45, 'Diag. DX'),
      Z('P1', 30, 62.5, 45, 37.5, 'Profondo'),
    ],
    mainShot: { toX: 80, toY: 55 },
    altShots: [{ toX: 18, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 30, toY: 55 }],
    notes: [
      'Attacco avversario in Z2 → la palla arriva sul nostro lato sinistro. Specchio perfetto della Z4.',
      'Sistema A: 1 bloccante (P3) + 3 difensori.',
      'P4 (avanti sinistra) arretra fino alla linea dei 3 m, 3,5-4 m dalla rete — copre pallonetti e finte sulla sinistra.',
      'P2 (avanti destra) scende a metà campo sulla destra — copre la diagonale corta.',
      'L\'unico difensore profondo P1 difende la diagonale lunga (~7-7,5 m, 1 m dalla linea sinistra).',
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
      Z('P1', 65, 43, 35, 57, 'Diag. corta'),
      Z('P5', 0, 43, 50, 57, 'Diag. lunga'),
      Z('P4', 0, 25, 35, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 22, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Attacco avversario in Z4 → la palla arriva sul nostro lato destro.',
      'Formazione a quadrato (2-2 / box) → sistema A: 1 bloccante (P2) + 3 difensori.',
      'P2 (avanti destra) muro a 1 di fronte all\'attaccante avversario, prende il lungolinea.',
      'P4 (avanti sinistra) come off-blocker, 2-2,5 m dalla rete — copre pallonetto e cut shot sulla sinistra.',
      'P5 difende la diagonale lunga (~7 m, 0,5 m dalla linea sinistra).',
      'P1 difende il lungolinea profondo / diagonale corta (~7 m, nell\'ombra del muro).',
      'Sistema B (muro a 2 P2+P4) possibile ma lascia solo 2 difensori — riservato ai grandi attaccanti.',
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
      Z('P5', 0, 40, 50, 60, 'Diag. SX'),
      Z('P1', 50, 40, 50, 60, 'Diag. DX'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 47.5 }],
    notes: [
      'Attacco veloce centrale (Z3) — angoli stretti, poco tempo.',
      'Muro a 2 (P4 + P2) chiude il centro — sistema B con 2 difensori dietro.',
      'P5 e P1 prendono le diagonali corte (~7 m, 0,5-1 m dalle linee laterali).',
      'Punto debole importante: nessuna copertura corta dietro il muro, il quadrato non ha un giocatore a metà campo.',
      'Alternativa: muro a 1 (ruolo simile al P3, qui P4 o P2 da solo) per liberare un difensore di pallonetto.',
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
      Z('P5', 0, 43, 35, 57, 'Diag. corta'),
      Z('P1', 50, 43, 50, 57, 'Diag. lunga'),
      Z('P2', 60, 25, 40, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 78, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Attacco avversario in Z2 → la palla arriva sul nostro lato sinistro. Specchio perfetto della Z4.',
      'Sistema A: 1 bloccante (P4) + 3 difensori.',
      'P4 (avanti sinistra) muro a 1 di fronte all\'attaccante avversario, prende il lungolinea.',
      'P2 (alzatore-attaccante avanti destra) come off-blocker, 2-2,5 m dalla rete — anti-pallonetto + transizione veloce verso il bersaglio.',
      'P1 difende la diagonale lunga (~7 m, 0,5 m dalla linea destra).',
      'P5 difende il lungolinea corto profondo (~7 m, nell\'ombra del muro).',
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
      Z('P1', 65, 40, 35, 60, 'Linea DX'),
      Z('P6', 33, 52, 34, 48, 'Asse'),
      Z('P5', 0, 43, 35, 57, 'Diag. SX'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 75 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 70 }, { toX: 18, toY: 40 }],
    notes: [
      'Attacco avversario in Z4 → la palla arriva alla nostra destra.',
      'Schema 2F-3B (P4+P3 in prima linea, P5+P6+P1 in seconda linea, P1 penetrante): muro a 1.',
      'P3 (centrale) mura da solo sulla destra — nessun P2 disponibile per il muro a 2.',
      'P4 (schiacciatore) off-blocker, 2-2,5 m dalla rete sulla sinistra.',
      '3 difensori profondi: P5 diagonale lunga, P6 asse centrale (~7-8 m), P1 lungolinea destro.',
      'Il sistema 1-1-3 (1 bloccante + 1 off-blocker + 3 difensori) è la difesa più vicina alla difesa perimetrale del 6v6.',
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
      Z('P5', 0, 40, 33, 60, 'Diag. SX'),
      Z('P6', 33, 52, 34, 48, 'Asse'),
      Z('P1', 67, 40, 33, 60, 'Diag. DX'),
    ],
    mainShot: { toX: 50, toY: 75 },
    altShots: [{ toX: 22, toY: 65 }, { toX: 78, toY: 65 }],
    notes: [
      'Attacco veloce centrale (Z3) — angoli stretti.',
      'Muro a 1 (P3) in lettura — la veloce è il bersaglio più difficile nel 2F-3B.',
      'P4 lateralizzato a metà campo (~2 m dalla rete) per le deviazioni.',
      'Vantaggio: 3 difensori profondi (P5, P6, P1) coprono le 3 principali zone in seconda linea.',
      'P6 di fronte al centrale nella sua linea di tiro (~7,5-8 m, asse).',
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
      Z('P5', 0, 40, 35, 60, 'Linea SX'),
      Z('P6', 33, 52, 34, 48, 'Asse'),
      Z('P1', 65, 43, 35, 57, 'Diag. DX'),
      Z('P3', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 75 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 70 }, { toX: 80, toY: 40 }],
    notes: [
      'Attacco avversario in Z2 → la palla arriva alla nostra sinistra. Specchio della Z4.',
      'Muro a 1: P4 mura da solo sul lato sinistro (nessun P2 nel 2F-3B).',
      'P3 (centrale) diventa off-blocker sulla destra, 2-2,5 m dalla rete.',
      'P5 difende il lungolinea sinistro profondo, P6 l\'asse, P1 la diagonale lunga.',
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
      { posNumber: 'P5', x: 0, y: 43, w: 50, h: 57, label: 'Diag. lunga', labelPos: { x: 18, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Ombra muro', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 62, y: 34, w: 38, h: 42, label: 'Lungolinea', labelPos: { x: 70, y: 40 } },
      { posNumber: 'P4', x: 0, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 4, y: 33 } },
    ],
    mainShot: { toX: 22, toY: 77.5 },
    altShots: [
      { toX: 78, toY: 47.5 },
      { toX: 45, toY: 62.5 },
      { toX: 15, toY: 40 },
    ],
    notes: [
      { label: 'Posizione 2 (opposto / OPP)', text: 'Bloccante lungolinea — mura, sale a rete sul lato destro.' },
      { label: 'Posizione 3 (centrale)', text: 'Chiude la diagonale su muro a 2 con l\'opposto.' },
      { label: 'Posizione 4 (schiacciatore off-blocker)', text: 'Scende sulla linea dei 3 m sul lato sinistro — copre il cut shot corto (diagonale stretta) e le finte.' },
      { label: 'Posizione 5 (Libero)', text: 'Difende la diagonale lunga, ~7-8 m dalla rete, sulla spalla interna del centrale.' },
      { label: 'Posizione 6 (centro dietro)', text: 'Palle alte che superano il muro, tocchi lunghi del muro, asse ~8-8,5 m.' },
      { label: 'Posizione 1 (dietro destra)', text: 'Difende il lungolinea profondo nell\'ombra del muro, ~7-7,5 m dalla rete, 0,5 m dalla linea destra.' },
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
      { posNumber: 'P5', x: 0, y: 34, w: 36, h: 66, label: 'Diag. SX', labelPos: { x: 10, y: 70 } },
      { posNumber: 'P6', x: 32, y: 52, w: 36, h: 48, label: 'Asse', labelPos: { x: 42, y: 73 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 64, y: 34, w: 36, h: 66, label: 'Diag. DX', labelPos: { x: 75, y: 70 } },
      { posNumber: 'P4', x: 0, y: 25, w: 28, h: 28, label: 'Copertura', labelPos: { x: 4, y: 36 } },
      { posNumber: 'P2', x: 72, y: 25, w: 28, h: 28, label: 'Copertura', labelPos: { x: 78, y: 36 } },
    ],
    mainShot: { toX: 75, toY: 65 },
    altShots: [
      { toX: 25, toY: 65 },
      { toX: 50, toY: 80 },
    ],
    notes: [
      { label: 'Posizione 3 (centrale)', text: 'Muro a 1 in lettura (read) o commitment a seconda dello scouting avversario.' },
      { label: 'Posizioni 4 e 2 (schiacciatori)', text: 'Sulla linea d\'attacco (~2-2,5 m dalla rete, 0,5 m dalle linee laterali): coprono le deviazioni del muro e le palle che passano attraverso il muro.' },
      { label: 'Posizione 5 (Libero)', text: 'Di fronte al centrale, nella sua linea di tiro (~7-8 m dalla rete).' },
      { label: 'Posizione 6 (centro dietro)', text: 'Spalle rivolte all\'attaccante; difende la palla potente che passa il muro (asse ~8-8,5 m).' },
      { label: 'Posizione 1 (dietro destra)', text: 'Si fa avanti di un metro (~7,5 m dalla rete, 1 m dalla linea destra): angoli più stretti sulle veloci.' },
      { label: 'Regola chiave', text: '"Fermi al contatto": tutti fermi ed equilibrati nell\'istante esatto della schiacciata.' },
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
      { posNumber: 'P1', x: 50, y: 43, w: 50, h: 57, label: 'Diag. lunga', labelPos: { x: 68, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Ombra muro', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P5', x: 0, y: 34, w: 38, h: 42, label: 'Lungolinea', labelPos: { x: 10, y: 40 } },
      { posNumber: 'P2', x: 70, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 76, y: 33 } },
    ],
    mainShot: { toX: 78, toY: 77.5 },
    altShots: [
      { toX: 22, toY: 47.5 },
      { toX: 55, toY: 62.5 },
      { toX: 85, toY: 40 },
    ],
    notes: [
      { label: 'Posizione 4 (schiacciatore)', text: 'Bloccante lungolinea — mura a rete sul lato sinistro.' },
      { label: 'Posizione 3 (centrale)', text: 'Chiude la diagonale su muro a 2 con lo schiacciatore.' },
      { label: 'Posizione 2 (opposto / OPP)', text: 'Diventa off-blocker sulla destra — scende alla linea dei 3 m, copre il cut shot corto e le finte.' },
      { label: 'Posizione 5 (Libero)', text: 'Difende il lungolinea profondo nell\'ombra del muro, ~7-7,5 m dalla rete, 0,5 m dalla linea sinistra.' },
      { label: 'Posizione 6 (centro dietro)', text: 'Palle alte oltre il muro, asse ~8-8,5 m dalla rete.' },
      { label: 'Posizione 1 (alzatore o schiacciatore/OPP)', text: 'Difende la diagonale lunga, ~7-8 m dalla rete.' },
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
  { title: 'Attaccante lontano dalla rete', action: 'FARSI AVANTI', accentColor: 'var(--orange)',
    points: ['Alzata a 2-3 m dalla rete', 'Non può schiacciare forte', 'Alto rischio di finta o pallonetto', 'Avanzare di 1-2 metri'] },
  { title: 'Attaccante vicino alla rete', action: 'ARRETRARE', accentColor: 'var(--plum)',
    points: ['Alzata a meno di 1 m dalla rete', 'Può schiacciare a piena potenza', 'Traiettoria veloce verso il basso', 'Arretrare il più possibile'] },
  { title: 'La spalla dell\'attaccante', action: 'Osserva la spalla che colpisce', accentColor: 'var(--teal)',
    points: ['Spalla alta e arretrata = schiacciata potente', 'Spalla bassa = probabile finta', 'Rotazione della spalla = direzione della palla', 'Adattati in 0,5 s'] },
  { title: 'La rincorsa dell\'attaccante', action: 'Osserva la sua rincorsa', accentColor: 'var(--ink)',
    points: ['Rincorsa lunga e veloce = schiacciata forte', 'Rincorsa corta o stop = finta', 'Angolo di rincorsa = zona di destinazione', 'Anticipa la potenza'] },
];

const COMMANDEMENTS = [
  ['Osserva l\'alzatore', 'Poi l\'attaccante, non la palla'],
  ['Stesso lato = Avanti', 'Lato opposto = Arretra'],
  ['Alzata avversaria scarsa', '→ Avanti di 1-2 m (finta probabile)'],
  ['Mai nel mezzo', 'Scegli: avanti O dietro'],
  ['Comunica SEMPRE', '"Mia!" su ogni palla che prendi'],
  ['Spostati dopo il servizio', 'Posizione di battuta ≠ posizione difensiva'],
  ['Leggi la spalla', 'Spalla alta = schiacciata, bassa = finta'],
  ['Postura bassa', 'Ginocchia flesse, braccia pronte'],
  ['Transizioni veloci', '3 secondi massimo per ripristinare'],
  ['Difendi la tua zona', 'Ogni giocatore ha una responsabilità'],
];

type MistakesSection = {
  title: string;
  intro: string;
  mistakes: [string, string][];
};

const MISTAKES_BY_SIZE: Record<TeamSize, MistakesSection> = {
  6: {
    title: 'I dieci errori comuni di posizionamento difensivo',
    intro: 'Tipologia tratta da Mike Hebert (Thinking Volleyball), John Forman (CoachingVB), USA Volleyball e dal manuale FIVB Top Volley.',
    mistakes: [
      ['1. Spostarsi nell\'ombra del muro', 'I difensori si rifugiano istintivamente dietro i bloccanti invece di posizionarsi attorno all\'ombra del muro — lasciando aperte le diagonali e le traiettorie "off the block". Hebert: "creeping into the block shadow".'],
      ['2. Lettura sbagliata', 'Il difensore fissa la palla invece di seguire la sequenza "palla → alzatore → palla → attaccante". Conseguenza: tira a indovinare invece di leggere, e non è fermo ed equilibrato al momento del contatto ("stopped and balanced at the moment of contact").'],
      ['3. Libero mal posizionato in profondità', 'Troppo vicino alla rete, non può difendere le schiacciate profonde; troppo arretrato, non può coprire i pallonetti. Regola: allineare la sua spalla esterna con la spalla interna del centrale, 6-8 m dalla rete a seconda del muro.'],
      ['4. Alzatore-difensore mal preparato', 'Postura troppo bassa o male orientata che gli impedisce di vedere palla + campo avversario; release prematuro verso il bersaglio che crea un buco in Z1; nessun "release call" che segnali che sta lasciando la difesa.'],
      ['5. Errori di overlap', 'I più comuni: Z6 si sposta davanti a Z3, Z5 più a destra di Z6, e l\'alzatore lascia la sua posizione troppo presto per penetrare (errore #1 nel 5-1). Nell\'istante del contatto del battitore, tutti i piedi devono rispettare le relazioni avanti/dietro e sinistra/destra (Regola 7.4).'],
      ['6. Transizione ricezione → difesa dimenticata', 'I giocatori restano congelati nella loro formazione a W di ricezione invece di passare alla posizione difensiva di base non appena l\'alzatore avversario tocca la palla. Hebert: "sluggish recovery after play on the ball".'],
      ['7. Cattiva gestione della zona 6', 'Confusione tra "6-up" (rotazione), "6-back" (perimetrale) e "6-deep". Il giocatore in Z6 deve spostarsi lateralmente in base al lato dell\'attacco avversario, non restare al centro. Inclinarsi all\'indietro per il dig ("leaning back") sposta il peso sui talloni e annulla la reattività.'],
      ['8. Difesa fallita sull\'attacco veloce centrale', 'Lettura del centrale avversario troppo tardiva; seconda linea non avanzata (sulle veloci, Z1 e Z5 devono avanzare di un metro perché gli angoli sono più stretti); "false stepping" (primo passo indietro) che spreca il tempo disponibile.'],
      ['9. Copertura del pallonetto orfana', 'Nessun difensore esplicitamente assegnato al pallonetto; "standing up on tips" — il difensore è basso per la schiacciata, poi si alza e allunga il braccio per il pallonetto, lasciando cadere la palla proprio davanti a sé. La concentrazione deve restare sulla schiacciata in postura bassa che permetta uno scatto verso il pallonetto.'],
      ['10. Silenzio collettivo', 'Nessuna chiamata ("pallonetto!", "lungolinea!", "fuori!", "mia!"); i bloccanti non comunicano il loro orientamento lungolinea vs diagonale; nessun capitano di rotazione che controlli gli overlap prima del servizio.'],
    ],
  },
  5: {
    title: 'Errori comuni nel 5v5',
    intro: 'Errori specifici del formato 5v5 (adattamenti da Volleyball Canada, VolleyballXL e dalla dottrina 6v6).',
    mistakes: [
      ['1. Riprodurre meccanicamente il 6v6', 'Coprire 3 zone profonde con 3 difensori funziona (schema 2F-3B), ma manca l\'off-blocker che arretra — la zona dei 3 m non è coperta se nessuno è esplicitamente assegnato.'],
      ['2. L\'off-blocker della prima linea resta incollato alla rete', 'Dopo il contatto del muro, l\'off-blocker della prima linea deve arretrare a 2-2,5 m per coprire i pallonetti. Se resta a rete, la zona dietro il muro è completamente aperta.'],
      ['3. 2 difensori uno accanto all\'altro', 'Nello schema 3F-2B, i 2 difensori profondi devono essere distanziati (uno a sinistra, uno a destra) e non centrati insieme. Altrimenti le linee laterali sono esposte.'],
      ['4. L\'alzatore fa il release troppo presto (schema penetrante)', 'Nello schema 2F-3B con alzatore penetrante dal P1, deve aspettare che la palla sia difesa prima di correre al suo bersaglio — altrimenti si apre un buco in Z1.'],
      ['5. Confusione avanti/dietro', 'Con 5 giocatori, la tentazione di lasciare che la prima linea difenda il proprio lato restando sulla linea dei 3 m è forte — ma questo lascia il campo profondo aperto. La prima linea sale a murare, la seconda linea difende in profondità.'],
      ['6. Lettura sbagliata', 'Mancare un giocatore richiede una lettura ancora più precoce rispetto al 6v6. Sequenza "palla → alzatore → palla → attaccante" + arresto equilibrato al momento del contatto.'],
    ],
  },
  4: {
    title: 'Errori comuni nel 4v4',
    intro: 'Errori specifici del 4v4 indoor (intramurali universitari, dottrina FFVb / Volleyball Canada, beach 4s).',
    mistakes: [
      ['1. Il bloccante isolato senza copertura del pallonetto', 'Tutti e 3 i difensori vanno in profondità, lasciando vuota la zona 3-5 m. Qualcuno deve sempre essere assegnato al pallonetto a 3,5-4 m dalla rete.'],
      ['2. 2 difensori su una linea retta', 'Affiancati alla stessa profondità → il cut shot cade tra loro. Nel 4v4, i difensori devono sempre essere scalati (uno vicino, uno lontano) o distribuiti lateralmente.'],
      ['3. L\'alzatore che fa il release verso il bersaglio prima che la palla sia difesa', 'Transizione prematura che lascia un buco in difesa. L\'alzatore aspetta la conferma del recupero della palla prima di andare al bersaglio.'],
      ['4. Nessun segnale tra bloccante e difensori', 'Il bloccante DEVE segnalare "lungolinea" o "diagonale" prima che l\'attacco inizi. Senza, i 3 difensori non sanno cosa coprire — ognuno improvvisa.'],
      ['5. Il difensore del pallonetto troppo lontano dalla rete', 'Arretra con gli altri difensori di seconda linea e non riesce più a coprire le finte corte. La sua posizione è a 3,5-4 m dalla rete, sull\'asse — non a 7 m.'],
      ['6. Murare "a caso" il giocatore sbagliato', 'Nel 4v4, murare con un giocatore mal posizionato (lontano dall\'attaccante) lascia l\'avversario di fronte a 3 difensori mal allineati. Il bloccante deve essere quello di fronte all\'attaccante principale.'],
      ['7. Lettura sbagliata', 'Con ~40 mq per difensore (vs 20 mq nel 6v6), un errore di lettura è irrecuperabile. L\'anticipazione = abilità #1 nel 4v4.'],
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
    title: 'I tre principali sistemi difensivi (FIVB / USAV)',
    warning: {
      label: '⚠ Avvertenza terminologica',
      text: 'L\'espressione "difesa a W" spesso sentita in Francia è scorretta. La "W-formation" si riferisce storicamente a una formazione di ricezione a 5 giocatori — non a un sistema difensivo. La dottrina internazionale (FIVB, USAV IMPACT, Liskevych, Stone) distingue tre sistemi: man-up (2-1-3), perimetrale (2-0-4) e a rotazione (3-2-1).',
    },
    systems: [
      {
        name: 'Difesa man-up (2-1-3)',
        tag: 'Anticamente "difesa a W" / difesa rossa',
        principe: 'Un difensore avanza alla linea dei 3 m dietro il muro per intercettare finte e pallonetti. Due bloccanti a rete, l\'off-blocker arretra, e tre giocatori profondi coprono gli angoli lunghi.',
        forces: ['Eccellente copertura di pallonetti, finte e palle "junk" dietro il muro', 'Transizione veloce all\'attacco se il giocatore avanzato è l\'alzatore', 'Semplice da insegnare alle squadre giovani'],
        faiblesses: ['Solo 3 difensori profondi — vulnerabile alle diagonali strette potenti', 'Un attaccante che colpisce forte tra i bloccanti passa facilmente'],
        indication: 'Squadre giovani, scolastiche, avversari tattici che giocano molte finte o off-speed shot.',
        accent: 'var(--orange)',
      },
      {
        name: 'Difesa perimetrale (2-0-4)',
        tag: 'Difesa bianca — sistema dominante a livello maschile elite',
        principe: 'I quattro difensori di seconda linea formano una U aperta verso la rete, quasi sulle linee laterali e sulla linea di fondo — "un piede sulla linea" (Liskevych). Il centro del campo è intenzionalmente abbandonato.',
        forces: ['Eccellente copertura di schiacciate potenti, lungolinea e angoli profondi', 'Movimento collettivo semplice', 'Sistema predominante nella moderna pallavolo maschile internazionale'],
        faiblesses: ['Molto vulnerabile ai pallonetti corti dietro il muro — la zona centrale tra 3 e 5 m è aperta', 'Richiede difensori atletici capaci di tuffarsi in avanti'],
        indication: 'Senior, maschile, livello internazionale, avversari potenti.',
        accent: 'var(--teal)',
      },
      {
        name: 'Difesa a rotazione / slide defense (3-2-1)',
        tag: 'Rotational / slide defense',
        principe: 'I tre difensori di seconda linea scivolano verso il lato di attacco avversario: il giocatore di seconda linea opposto avanza dietro il muro (pallonetto), il centrale scivola verso la linea attaccata, il difensore dal lato attaccato prende l\'angolo corto.',
        forces: ['Eccellente copertura del lungolinea profondo E del pallonetto contemporaneamente', 'Sistema molto adattabile', 'Transizione veloce dell\'alzatore quando è in P1'],
        faiblesses: ['Un difensore in meno in profondità (un giocatore dedicato al pallonetto)', 'Angolo diagonale opposto vulnerabile', 'Richiede grande capacità di lettura e coordinazione'],
        indication: 'Avversari che mescolano potenza e lungolinea/pallonetti; livello intermedio-elite.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['Man-up 2-1-3', 'Perim. 2-0-4', 'Rotazione 3-2-1'],
    tableRows: [
      ['Giocatore avanzato dietro il muro', 'Sì', 'No', 'Sì'],
      ['Difensori profondi', '3', '4', '2'],
      ['Copertura pallonetto', '★★★', '★', '★★'],
      ['Copertura schiacciata potente', '★★', '★★★', '★★'],
      ['Copertura lungolinea profondo', '★★', '★★', '★★★'],
      ['Copertura diagonale stretta', '★', '★★★', '★★'],
      ['Posizione tipica del libero', 'Z5 o Z6', 'Z5 (sulla linea)', 'Z5 scivola'],
      ['Complessità', 'Bassa', 'Media', 'Alta'],
    ],
    footer: {
      strong: 'La scelta non è una questione di ortodossia: ',
      text: 'dipende dal profilo offensivo dell\'avversario e dalle qualità dei tuoi difensori. La difesa moderna è definita meno dalla formazione che dalla lettura — sequenza visiva "palla → alzatore → palla → attaccante" e arresto equilibrato al momento del contatto.',
    },
  },
  5: {
    title: 'I tre sistemi difensivi nel 5v5',
    warning: {
      label: '⚠ Formato non ufficiale FIVB',
      text: 'Il 5v5 indoor non ha un regolamento dedicato FIVB o FFVb. Questi tre sistemi sono adattamenti logici del 6v6 documentati da VolleyballXL, The Art of Coaching Volleyball e Volleyball Canada. Non esiste un manuale tecnico ufficiale per il 5v5 — scegli il sistema in base allo schema della tua squadra (2-3 o 3-2).',
    },
    systems: [
      {
        name: 'Sistema 1-1-3',
        tag: '1 bloccante + 1 copertura pallonetto + 3 difensori profondi',
        principe: 'Adatto allo schema 2F-3B (2 in prima linea, 3 in seconda linea). Il bloccante salta da solo; il 2º giocatore di prima linea arretra come off-blocker a 2-3 m dalla rete per i pallonetti; 3 difensori profondi coprono lungolinea, asse e diagonale lunga.',
        forces: ['3 difensori profondi come nella difesa perimetrale del 6v6 — buona copertura delle schiacciate', 'Lo schema più vicino al 6v6 5-1 (preparazione alla transizione al 6v6)', 'Pallonetto coperto dall\'off-blocker'],
        faiblesses: ['Solo muro a 1 → fragile contro grandi attaccanti', 'L\'off-blocker a 2-3 m deve essere molto reattivo'],
        indication: 'Schema 2F-3B (alzatore penetrante), avversari di potenza moderata. Sistema consigliato per la transizione pedagogica verso il 6v6.',
        accent: 'var(--teal)',
      },
      {
        name: 'Sistema 2-1-2',
        tag: '2 bloccanti + 1 pallonetto + 2 difensori profondi',
        principe: 'Adatto allo schema 3F-2B (3 in prima linea, 2 in seconda linea). Muro a 2 a rete, il centrale di prima linea copre il pallonetto a 2-3 m dalla rete, 2 difensori profondi prendono diagonale lunga e lungolinea.',
        forces: ['Muro a 2 come nel 6v6 — significativamente più efficace contro le schiacciate potenti', '3 attaccanti a rete per il contrattacco'],
        faiblesses: ['Solo 2 difensori profondi → 9 m di seconda linea molto difficili da coprire', 'Elevata richiesta atletica sui 2 difensori di seconda linea'],
        indication: 'Schema 3F-2B contro squadre molto potenti. Da preferire a fine set quando ogni punto conta.',
        accent: 'var(--orange)',
      },
      {
        name: 'Sistema 1-2-2',
        tag: 'Man-up adattato (equivalente al 2-1-3 del 6v6)',
        principe: 'Bloccante solitario + 2 coperture della zona anteriore (pallonetto + dietro-muro) + 2 difensori profondi. Adatto quando l\'avversario gioca molti pallonetti o per squadre principianti.',
        forces: ['Eccellente copertura delle finte corte (2 coperture zona anteriore)', 'Pallonetto difficile da sfruttare per l\'avversario'],
        faiblesses: ['Solo 2 difensori profondi → schiacciate potenti difficili', 'Richiede coordinazione tra le 2 coperture zona anteriore'],
        indication: 'Avversari che giocano molti pallonetti; pallavolo femminile, categorie giovanili, squadre tecniche.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['1-1-3', '2-1-2', '1-2-2 (man-up)'],
    tableRows: [
      ['Bloccanti', '1', '2', '1'],
      ['Coperture zona anteriore', '1 (off-blocker)', '1 (pallonetto)', '2 (pallonetto + dietro-muro)'],
      ['Difensori profondi', '3', '2', '2'],
      ['Copertura pallonetto', '★★', '★★', '★★★'],
      ['Copertura schiacciata potente', '★★', '★★★', '★★'],
      ['Copertura seconda linea', '★★★', '★★', '★★'],
      ['Schema corrispondente', '2F-3B', '3F-2B', '2F-3B / 3F-2B'],
      ['Complessità', 'Bassa', 'Media', 'Alta'],
    ],
    footer: {
      strong: 'Raccomandazione 5v5: ',
      text: 'il sistema 1-1-3 in schema 2F-3B con alzatore penetrante è la difesa più vicina al 6v6 — ideale come transizione pedagogica. Il 2-1-2 è giustificato solo contro attaccanti veramente potenti.',
    },
  },
  4: {
    title: 'I tre sistemi difensivi nel 4v4',
    warning: {
      label: '⚠ Formato non ufficiale FIVB',
      text: 'Il 4v4 indoor non ha un regolamento ufficiale FIVB. Questi tre sistemi provengono dalla pratica degli intramurali universitari (USA), dai manuali di transizione pedagogica FFVb / Volleyball Canada e dalla letteratura beach (Brandon Joyner, Better at Beach). Con 4 giocatori, ogni difensore copre ~30-40 mq (vs 20 mq nel 6v6) — l\'anticipazione è l\'abilità #1.',
    },
    systems: [
      {
        name: 'Sistema A: 1 bloccante + 3 difensori',
        tag: 'Il più comune nel 4v4 indoor',
        principe: 'Un solo giocatore sale a murare di fronte all\'attaccante principale. Gli altri 3 si dividono: difensore di pallonetto (3-4 m dalla rete, asse), difensore di diagonale (7-7,5 m, linea destra, diagonale lunga), difensore di lungolinea (7-7,5 m, nell\'ombra del muro).',
        forces: ['Copre pallonetto, lungolinea e diagonale lunga contemporaneamente', 'Il più equilibrato nel 4v4', 'Segnale lungolinea/diagonale del bloccante molto efficace'],
        faiblesses: ['Muro a 1 — vulnerabile ai grandi attaccanti', 'Richiede un difensore di pallonetto disciplinato che non arretra'],
        indication: 'Avversari di livello equivalente o moderato. Schema più versatile nel 4v4 (formazione a rombo o linea 3-1).',
        accent: 'var(--orange)',
      },
      {
        name: 'Sistema B: 2 bloccanti + 2 difensori',
        tag: 'Muro a 2 (raro nel 4v4)',
        principe: 'I 2 di prima linea salgono insieme di fronte all\'attaccante principale. I 2 di seconda linea si posizionano: uno sul lato del lungolinea (7 m, 1 m dalla linea), uno sull\'asse leggermente spostato verso la diagonale. Il pallonetto non è coperto.',
        forces: ['Muro a 2 significativamente più efficace contro le schiacciate potenti', 'Massima pressione sull\'attaccante avversario'],
        faiblesses: ['Solo 2 difensori a terra → impossibile coprire tutto', 'Pallonetto dietro il muro completamente scoperto', 'Costringe a una scelta: lungolinea O diagonale, non entrambi'],
        indication: 'Da usare solo contro attaccanti molto potenti senza finezza (nessuna finta). Schema quadrato 2-2 o linea 3-1.',
        accent: 'var(--plum)',
      },
      {
        name: 'Sistema C: 0 bloccanti',
        tag: 'Difesa bassa (avversari non schiacciatori)',
        principe: 'Nessun giocatore sale a murare. I 4 giocatori difendono in profondità: 2 a metà campo (3-4 m) per le finte, 2 in profondità (7-8 m) per le palle più profonde. L\'alzatore agisce come 4º difensore.',
        forces: ['Copre tutta la profondità del campo', 'Adatto agli scambi lenti'],
        faiblesses: ['CONTROPRODUCENTE non appena un avversario colpisce seriamente (la schiacciata passa senza opposizione)', 'Nessuna pressione a rete'],
        indication: 'Livelli scolastici, ricreativo principiante, avversari che non schiacciano. Da evitare non appena l\'avversario acquista potenza.',
        accent: 'var(--teal)',
      },
    ],
    tableHeaders: ['Sistema A', 'Sistema B', 'Sistema C'],
    tableRows: [
      ['Bloccanti', '1', '2', '0'],
      ['Difensori profondi', '3', '2', '4'],
      ['Copertura pallonetto', '★★', '★', '★★★'],
      ['Copertura schiacciata potente', '★★', '★★★', '★ (nessun muro)'],
      ['Copertura lungolinea profondo', '★★', '★★', '★★'],
      ['Copertura diagonale lunga', '★★★', '★★', '★★'],
      ['Avversari consigliati', 'Tutti i livelli', 'Molto potenti', 'Non schiacciatori'],
      ['Complessità', 'Bassa', 'Media', 'Bassa'],
    ],
    footer: {
      strong: 'Raccomandazione 4v4: ',
      text: 'il sistema A (1 bloccante + 3 difensori) è il default quasi universale. Il sistema B è giustificato solo contro attaccanti veramente potenti a fine set. Il sistema C funziona solo a livello ricreativo principiante — non appena un avversario schiaccia, tornare al sistema A.',
    },
  },
};

const EXERCICES = [
  { title: 'Lettura della situazione', level: 'Principiante', duration: '10 min', materiel: '1 allenatore o partner con palloni',
    objectif: 'Imparare a identificare rapidamente la zona di attacco',
    steps: ['L\'allenatore si posiziona dall\'altra parte della rete in zona 4, 3 o 2', 'Tu parti dal centro del campo', 'L\'allenatore annuncia la zona e lancia la palla', 'Devi raggiungere la tua zona difensiva in 2-3 secondi', 'Ripeti 20 volte variando le zone'] },
  { title: 'Avanti / arretrare in base all\'alzata', level: 'Intermedio', duration: '15 min', materiel: '1 alzatore, 1 attaccante, diversi difensori',
    objectif: 'Adattare la tua posizione in base alla qualità dell\'alzata',
    steps: ['L\'alzatore distribuisce alzate di qualità variabile all\'attaccante', 'Alzata vicino alla rete → Arretri (schiacciata potente attesa)', 'Alzata lontana dalla rete → Avanzi (finta probabile)', 'L\'attaccante schiaccia e tu difendi', 'L\'allenatore corregge la tua posizione dopo ogni palla'] },
  { title: 'Comunicazione difensiva', level: 'Tutti i livelli', duration: '10 min', materiel: 'Squadra completa',
    objectif: 'Sviluppare la comunicazione automatica',
    steps: ['Partita nel tuo formato (4v4, 5v5 o 6v6) ma GRIDANDO ogni chiamata', 'Penalità: -1 punto se un giocatore non grida "Mia!" sulla sua palla', 'Bonus: +1 punto se tutta la squadra comunica in uno scambio', 'Ogni giocatore deve annunciare la zona di attacco avversaria'] },
  { title: 'Difesa contro le finte', level: 'Intermedio', duration: '15 min', materiel: '1 attaccante, 3 difensori di seconda linea',
    objectif: 'Migliorare la difesa delle palle corte',
    steps: ['L\'attaccante gioca SOLO finte e pallonetti', 'I difensori devono tutti avanzare (3-4 m)', 'Obiettivo: recuperare 8 palle su 10', 'Poi alterna: 5 finte, 5 schiacciate per lavorare sull\'adattamento'] },
  { title: 'Transizioni veloci', level: 'Avanzato', duration: '20 min', materiel: 'Squadra completa',
    objectif: 'Padroneggiare i cambi attacco-difesa',
    steps: ['Gioco normale ma l\'allenatore cronometra le transizioni', 'Obiettivo: essere in posizione difensiva in meno di 3 secondi', 'Se troppo lenti, la squadra fa 5 flessioni e ricomincia', 'Aumenta progressivamente il ritmo degli scambi'] },
  { title: 'Lettura dell\'attaccante', level: 'Avanzato', duration: '15 min', materiel: '1 attaccante, difensori',
    objectif: 'Anticipare in base al linguaggio del corpo',
    steps: ['L\'attaccante alterna schiacciata, finta, pallonetto senza preavviso', `Prima che colpisca, il difensore annuncia la sua previsione: "Schiacciata!" o "Finta!"`, 'Punto se la previsione è corretta E la palla è difesa', 'Focus su: spalla, rincorsa, posizione rispetto alla rete'] },
];

type GuidePositionnementProps = {
  teamSize?: TeamSize;
  configId?: string;
};

export default function GuidePositionnementIt({ teamSize: teamSizeProp, configId: configIdProp }: GuidePositionnementProps = {}) {
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
      return <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>Schema non disponibile per questa configurazione.</div>;
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
        <div style={S.label}>La configurazione della tua squadra</div>
        <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
          Scegli il tuo formato e schema tattico: <strong>l'intero contenuto della guida</strong> (posizioni, zone, difesa per attacco) si adatterà.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Formato di gioco</div>
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
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Schema tattico</div>
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
        <div style={S.label}>Principio base della difesa</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0' }}>Il posizionamento difensivo dipende da 3 fattori principali:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['La tua posizione (prima o seconda linea)', 'La zona di attacco avversaria (zona 4, 3, 2)', 'Il tipo di attacco (schiacciata potente, finta, pallonetto)'].map((pt, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={S.bullet}>▸</span>
              <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Positions and zones */}
      <section>
        <h2 style={S.section}>1. Posizioni e zone — {configuration.shortName} ({teamSize}v{teamSize})</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            Schema della tua squadra in {configuration.name}
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
              Vedi ogni posizione in dettaglio su /positions →
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--ink)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Regola importante: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>
            {teamSize === 6 && 'I giocatori di seconda linea (5, 6, 1) NON POSSONO murare a rete. Difendono in seconda linea.'}
            {teamSize === 5 && 'Con 5 giocatori, ogni difensore copre ~30 mq (vs 20 mq nel 6v6). La lettura diventa critica.'}
            {teamSize === 4 && 'Nessun libero. Ogni giocatore difende ~30-40 mq. L\'anticipazione è l\'abilità #1.'}
          </span>
        </div>
      </section>

      {/* 2. Positioning by zone */}
      <section>
        <h2 style={S.section}>2. Posizionamento per zona di attacco avversaria</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button key={z} onClick={() => setZone(z)} style={zone === z ? btnActive : btnBase}>
              {z === 'zone4' ? 'Attacco zona 4' : z === 'zone3' ? 'Attacco zona 3' : 'Attacco zona 2'}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {teamSize}v{teamSize} · {configuration.shortName} — {
              zone === 'zone4' ? 'Difesa contro attacco in Zona 4 (ala sinistra avversaria)' :
              zone === 'zone3' ? 'Difesa contro attacco in Zona 3 (centro)' :
              'Difesa contro attacco in Zona 2 (ala destra avversaria)'
            }
          </div>
          {renderZoneTab()}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <span><span style={{ color: 'var(--orange)' }}>■</span> <span style={{ color: 'var(--ink)', opacity: 0.6 }}>Zona di responsabilità</span></span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>BLK</strong> = muro</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>OFF</strong> = off-blocker</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>DEF</strong> = difesa</span>
        </div>
      </section>

      {/* 3. General principles */}
      <section>
        <h2 style={S.section}>3. Principi generali di posizionamento</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={S.labelTeal}>Zone di responsabilità</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          {[
            { title: 'Giocatori di prima linea',
              points: ['Priorità: Murare a rete', 'Se non si mura: difendere il lungolinea opposto', 'Distanza: a rete o in seconda linea'] },
            { title: teamSize === 4 ? 'Unico difensore profondo (P1)' : 'Pivot difensivo (Libero / P6)',
              points: teamSize === 4
                ? ['Posizione: centro, ~40 mq da coprire', 'Distanza: 5-6 m dalla rete', 'Ruolo: unico pilastro difensivo, massima anticipazione']
                : ['Posizione: centro, adattabile', 'Distanza: 5-6 m dalla rete', 'Ruolo: pilastro difensivo, copre il centro'] },
            { title: 'Difensori esterni di seconda linea',
              points: ['Ruolo variabile: avanzare o arretrare', 'Lato attaccato: avanzare (3-4 m)', 'Lato opposto: arretrare (6-7 m)'] },
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
            ★ Principi difensivi universali (4v4 / 5v5 / 6v6)
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px 0', lineHeight: 1.5 }}>
            Questi principi di Hebert, Liskevych e Volleyball Canada si applicano indipendentemente dal numero di giocatori in campo.
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Il muro è il fondamento', 'I difensori di seconda linea si posizionano in relazione all\'ombra e all\'orientamento del muro — non in modo indipendente.'],
              ['Fermi ed equilibrati al momento del contatto', 'Qualsiasi difensore ancora in movimento quando l\'attaccante colpisce la palla vede la sua reattività crollare ("stopped on contact").'],
              ['Lettura visiva sequenziale', '"Palla → alzatore avversario → palla → attaccante avversario". Nel 4v4 e 5v5, i giocatori mancanti impongono una lettura ancora più precoce.'],
              ['Comunicazione di segnali', 'Anche a livello ricreativo, il bloccante deve segnalare "lungolinea" o "diagonale" — senza, i difensori di seconda linea non sanno cosa coprire.'],
              ['Zona anteriore coperta', 'Qualcuno deve coprire i 3-5 m dietro il muro — è la zona più trascurata nei formati ridotti (4v4 / 5v5).'],
              ['Transizione veloce', 'L\'alzatore non deve mai fare il release verso il bersaglio prima di aver confermato che la palla è stata difesa ("release call").'],
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
        <h2 style={S.section}>4. Leggere l'attaccante: indizi visivi</h2>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Il tuo posizionamento deve adattarsi a ciò che vedi. Ecco gli indizi chiave:
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
          <strong style={{ color: 'var(--ink)' }}>Consiglio pro: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>Nei 2 secondi successivi al servizio avversario, focalizza lo sguardo sull'alzatore, poi IMMEDIATAMENTE sull'attaccante che sta per colpire.</span>
        </div>
      </section>

      {/* 5. When to step up / drop back */}
      <section>
        <h2 style={S.section}>5. Quando avanzare o arretrare?</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, marginBottom: 14 }}>Albero decisionale rapido</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderLeft: '4px solid var(--orange)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--orange)', letterSpacing: '0.08em' }}>Avanzare (3-4 m dalla rete) quando:</div>
              {[
                'Sei sullo stesso lato dell\'attaccante',
                'L\'attaccante è lontano dalla rete (alzata scarsa)',
                'Prevedi una finta o un pallonetto',
                'Il muro è solido — meno palle potenti passano',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={S.bulletOrange}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '4px solid var(--ink)', paddingLeft: 16, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.08em' }}>Arretrare (6-7 m dalla rete) quando:</div>
              {[
                'Sei sul lato opposto rispetto all\'attaccante',
                'L\'attaccante ha una buona alzata vicino alla rete',
                'L\'attaccante è potente o alto',
                'Il muro è debole (solo 1 bloccante)',
                'Stai difendendo la diagonale (traiettoria più lunga)',
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
        <h2 style={S.section}>7. Posizionamento al servizio</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            <strong>La tua posizione al servizio è DIVERSA dalla tua posizione difensiva. </strong>
            Non appena parte il servizio, devi riposizionarti.
          </p>
        </div>
        <div style={S.card}>
          <div style={{ ...S.labelTeal, marginBottom: 12 }}>Transizione servizio → difesa</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['La tua squadra serve', 'Sei in posizione di rotazione'],
              ['Il battitore colpisce', 'Osservi l\'alzatore avversario'],
              ['L\'alzatore tocca la palla', 'Ti sposti verso la tua zona difensiva'],
              ['L\'attaccante salta', 'Sei in posizione finale, pronto a reagire'],
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
        <h2 style={S.section}>8. Comunicazione difensiva</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>Una difesa silenziosa è una difesa inefficace.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { moment: 'Prima dell\'attacco avversario', calls: [['"Numero 4!"', 'Annuncia la zona da cui arriva l\'attacco'], ['"Due a muro!"', 'Indica quanti bloccanti'], ['"Lungolinea aperto!"', 'Se il muro non copre il lungolinea'], [`"Avanti!" / "Indietro!"`, 'Annuncia il tuo movimento']] },
            { moment: 'Durante l\'azione', calls: [[`"Mia!" / "Ce l'ho!"`, 'Prendi tu la palla (la PIÙ importante)'], ['"Tua!" / "Tu!"', 'Lasci la palla a un compagno'], ['"Fuori!"', 'La palla esce, non toccarla'], ['"Murata!"', 'Se muri, dillo']] },
            { moment: 'Dopo l\'azione', calls: [[`"Copri!"`, 'Chiama la copertura dell\'attacco'], ['"Free!"', 'Free ball, ripristina'], ['"Resta!"', 'Mantieni la difesa in posizione']] },
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
          <strong style={{ color: 'var(--ink)' }}>Regola d'oro: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>In caso di dubbio tra due giocatori, il più avanzato prende SEMPRE la palla.</span>
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
                    <div style={S.labelTeal}>Punti di forza</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.forces.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={S.bullet}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.55 }}>Punti deboli</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.faiblesses.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sys.accent, marginTop: 6 }}>
                      Da usare quando: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{sys.indication}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div style={{ ...S.card, marginTop: 14, overflowX: 'auto' }}>
                <div style={{ ...S.label, marginBottom: 10 }}>Tabella di confronto sintetica</div>
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
        <h2 style={S.section}>10. Transizioni attacco ↔ difesa</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            La pallavolo è un gioco di transizioni veloci. Passi continuamente dall'attacco alla difesa e viceversa.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Transizione attacco → difesa', items: [['Il tuo compagno attacca', 'Preparati mentalmente a difendere'], ['La palla è rimandata', 'Identifica immediatamente chi attaccherà'], ['Spostamento veloce', 'Raggiungi la tua zona difensiva (2-3 secondi massimo)'], ['Postura bassa', 'Piega le ginocchia, pronto al tuffo']] },
            { label: 'Transizione difesa → attacco', items: [['Difendi la palla', 'Passaggio preciso all\'alzatore'], ['Se sei in PRIMA LINEA', 'Corri a rete per attaccare o murare'], ['Se sei in SECONDA LINEA', 'Arretra leggermente, pronto a coprire l\'attacco'], ['Copertura d\'attacco', 'Circonda il tuo attaccante (a semicerchio a 2-3 m di distanza)']] },
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
        <h2 style={S.section}>11. Esercizi per migliorare</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{i + 1}. {ex.title}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 8px', border: '1.5px solid var(--ink)', color: 'var(--ink)', background: 'var(--cream)', flexShrink: 0 }}>{ex.level}</span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, marginBottom: 6 }}>
                Durata: {ex.duration} · Materiale: {ex.materiel}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 8 }}>
                Obiettivo: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{ex.objectif}</span>
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
        <h2 style={S.section}>12. I 10 comandamenti del difensore</h2>
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
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Stesso lato dell'attaccante</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--orange)', marginBottom: 4 }}>→ AVANTI (3-4 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Difendi finte e pallonetti</div>
            </div>
            <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Lato opposto rispetto all'attaccante</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>→ INDIETRO (6-7 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Difendi le diagonali lunghe</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>Conclusione</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            Il posizionamento difensivo si impara con la pratica e l'esperienza. Non scoraggiarti se commetti
            errori all'inizio — anche i professionisti aggiustano costantemente il loro piazzamento.
          </p>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: 0 }}>
            La chiave: applica la regola base (stesso lato = avanti, opposto = indietro), osserva l'attaccante,
            comunica con i compagni e non avere mai paura di tuffarti su una palla.
          </p>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, color: 'var(--ink)', margin: 0, letterSpacing: '0.06em' }}>La difesa vince le partite.</p>
        </div>
      </section>

    </div>
  );
}
