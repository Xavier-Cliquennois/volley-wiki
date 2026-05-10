import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Court, Player, Zone, Ball, ZoneLabel } from './CourtDiagram';
import { ROLE_COLORS } from '../constants/positions';
import { CONFIGURATIONS, type TeamSize } from '../pages/Positions';

type ZoneTab = 'zone4' | 'zone3' | 'zone2';
type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

// ==========================================================================
// Data-driven defensive layouts for 4v4 and 5v5 configurations
// (6v6 keeps the rich custom diagrams below)
// ==========================================================================

type DefensePlayer = {
  zoneId: ZoneId;
  x: number;        // 0-100 (left %)
  y: number;        // 0-100 (top % within our half-court)
  sub?: 'BLK' | 'DÉF' | 'OFF';
};

type DefenseZone = {
  x: number; y: number; w: number; h: number;
  posNumber: ZoneId;
  label: string;
};

type Shot = {
  toX: number;
  toY: number;
};

type DefenseLayout = {
  ballX: number;
  ballY: number;
  players: DefensePlayer[];
  zones: DefenseZone[];
  // Most probable shot the attacker takes from the ball position
  mainShot: Shot;
  // Alternative possible shots (rendered dashed)
  altShots: Shot[];
  notes: string[];
};

const Z = (zoneId: ZoneId, x: number, y: number, w: number, h: number, label: string): DefenseZone =>
  ({ zoneId, x, y, w, h, posNumber: zoneId, label } as DefenseZone & { zoneId: ZoneId });

// 5v5 Pentagone defense — 1 net + 2 mid + 2 back
const LAYOUTS_5V5_PENTAGON: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 15, ballY: 38,
    players: [
      { zoneId: 'P3', x: 38, y: 53, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 53, sub: 'BLK' },
      { zoneId: 'P2', x: 80, y: 65, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 80 },
      { zoneId: 'P1', x: 75, y: 78 },
    ],
    zones: [
      Z('P5', 0, 60, 35, 40, 'Z5 court'),
      Z('P1', 50, 62, 50, 38, 'Grande diagonale'),
      Z('P2', 70, 50, 30, 22, 'Off-blk court'),
    ],
    mainShot: { toX: 75, toY: 85 },
    altShots: [{ toX: 22, toY: 80 }, { toX: 50, toY: 70 }, { toX: 80, toY: 60 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P1).',
      'Block à 2 (P4 monte avec P3) ferme la diagonale.',
      'P2 (aile droite) recule sur les 3 m en off-blocker.',
      'P5 (proche de l\'attaque) défend la petite diagonale courte.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 38,
    players: [
      { zoneId: 'P3', x: 50, y: 53, sub: 'BLK' },
      { zoneId: 'P4', x: 25, y: 65, sub: 'OFF' },
      { zoneId: 'P2', x: 75, y: 65, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 80 },
      { zoneId: 'P1', x: 75, y: 80 },
    ],
    zones: [
      Z('P5', 0, 60, 50, 40, 'Diag G'),
      Z('P1', 50, 60, 50, 40, 'Diag D'),
    ],
    mainShot: { toX: 25, toY: 80 },
    altShots: [{ toX: 75, toY: 80 }, { toX: 50, toY: 88 }],
    notes: [
      'Coup principal : diagonale puissante (G ou D, ici G).',
      'Block à 1 sur la rapide centrale (P3 seul).',
      'P4 et P2 reculent latéralement sur les 3 m.',
      'P5 et P1 tiennent les diagonales — pas de défense fond centre dédiée.',
    ],
  },
  zone2: {
    ballX: 85, ballY: 38,
    players: [
      { zoneId: 'P3', x: 62, y: 53, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 53, sub: 'BLK' },
      { zoneId: 'P4', x: 20, y: 65, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 78 },
      { zoneId: 'P1', x: 78, y: 80 },
    ],
    zones: [
      Z('P1', 65, 60, 35, 40, 'Z1 court'),
      Z('P5', 0, 62, 50, 38, 'Grande diagonale'),
      Z('P4', 0, 50, 30, 22, 'Off-blk court'),
    ],
    mainShot: { toX: 25, toY: 85 },
    altShots: [{ toX: 78, toY: 80 }, { toX: 50, toY: 70 }, { toX: 20, toY: 60 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P5).',
      'Symétrique de Z4 : P3 + P2 forment le bloc, P4 off-blocker court.',
      'P1 défend la petite diagonale courte côté droit.',
      'P5 prend la grande diagonale longue.',
    ],
  },
};

// 5v5 3 avant / 2 arrière — passeur avant fixe
const LAYOUTS_5V5_3F2B: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 15, ballY: 38,
    players: [
      { zoneId: 'P3', x: 40, y: 53, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 53, sub: 'BLK' },
      { zoneId: 'P2', x: 80, y: 65, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 80 },
      { zoneId: 'P1', x: 75, y: 80 },
    ],
    zones: [
      Z('P5', 0, 62, 35, 38, 'Z5 court'),
      Z('P1', 50, 62, 50, 38, 'Grande diagonale'),
      Z('P2', 70, 50, 30, 22, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 85 },
    altShots: [{ toX: 22, toY: 80 }, { toX: 50, toY: 70 }, { toX: 80, toY: 60 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P1).',
      'Block à 2 (P4 + P3) ferme la diagonale.',
      'Le passeur (P2) recule en off-blocker côté ligne.',
      'P5 (souvent meilleur réceptionneur) en grande diagonale.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 38,
    players: [
      { zoneId: 'P4', x: 30, y: 53, sub: 'BLK' },
      { zoneId: 'P3', x: 50, y: 53, sub: 'BLK' },
      { zoneId: 'P2', x: 70, y: 53, sub: 'BLK' },
      { zoneId: 'P5', x: 25, y: 80 },
      { zoneId: 'P1', x: 75, y: 80 },
    ],
    zones: [
      Z('P5', 0, 60, 50, 40, 'Diag G'),
      Z('P1', 50, 60, 50, 40, 'Diag D'),
    ],
    mainShot: { toX: 50, toY: 88 },
    altShots: [{ toX: 25, toY: 80 }, { toX: 75, toY: 80 }],
    notes: [
      'Coup principal : balle profonde droit devant (faiblesse du système).',
      'Avec 3 avants, block à 3 possible — mais laisse seulement 2 défenseurs au sol.',
      'En général : block à 2 (P3 + l\'aile la plus proche).',
      'P5 et P1 partagent les diagonales.',
    ],
  },
  zone2: {
    ballX: 85, ballY: 38,
    players: [
      { zoneId: 'P3', x: 60, y: 53, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 53, sub: 'BLK' },
      { zoneId: 'P4', x: 20, y: 65, sub: 'OFF' },
      { zoneId: 'P5', x: 35, y: 80 },
      { zoneId: 'P1', x: 78, y: 80 },
    ],
    zones: [
      Z('P1', 65, 60, 35, 40, 'Z1 court'),
      Z('P5', 0, 62, 50, 38, 'Grande diagonale'),
      Z('P4', 0, 50, 30, 22, 'Off-blk'),
    ],
    mainShot: { toX: 35, toY: 85 },
    altShots: [{ toX: 78, toY: 80 }, { toX: 50, toY: 70 }, { toX: 20, toY: 60 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P5).',
      'Bloc P3 + P2 — l\'aile droite (P2 = passeur ici) bloque.',
      'P4 off-blocker court côté gauche.',
      'P1 défend la ligne droite, P5 la grande diagonale.',
    ],
  },
};

// 4v4 Losange (1-2-1) — block à 1 standard
const LAYOUTS_4V4_LOSANGE: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 15, ballY: 38,
    players: [
      { zoneId: 'P3', x: 38, y: 53, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 70, sub: 'OFF' },
      { zoneId: 'P2', x: 80, y: 65, sub: 'DÉF' },
      { zoneId: 'P1', x: 50, y: 82 },
    ],
    zones: [
      Z('P4', 0, 56, 35, 44, 'Court ligne'),
      Z('P2', 60, 50, 40, 30, 'Diag D'),
      Z('P1', 30, 75, 45, 25, 'Fond'),
    ],
    mainShot: { toX: 80, toY: 70 },
    altShots: [{ toX: 18, toY: 80 }, { toX: 50, toY: 85 }, { toX: 30, toY: 70 }],
    notes: [
      'Coup principal : diagonale longue (vers P2 reculé).',
      'Block à 1 (P3 monte sur la zone 4 adverse).',
      'P4 redescend sur les 3 m côté ligne (couverture courte + feintes).',
      'L\'arrière unique P1 doit anticiper la trajectoire profonde.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 38,
    players: [
      { zoneId: 'P3', x: 50, y: 53, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 65, sub: 'DÉF' },
      { zoneId: 'P2', x: 80, y: 65, sub: 'DÉF' },
      { zoneId: 'P1', x: 50, y: 82 },
    ],
    zones: [
      Z('P4', 0, 55, 35, 35, 'Diag G'),
      Z('P2', 65, 55, 35, 35, 'Diag D'),
      Z('P1', 30, 75, 45, 25, 'Fond'),
    ],
    mainShot: { toX: 50, toY: 85 },
    altShots: [{ toX: 18, toY: 70 }, { toX: 80, toY: 70 }],
    notes: [
      'Coup principal : balle profonde droit devant (vers P1 fond).',
      'Block à 1 (P3 seul) sur la rapide centrale.',
      'Les 2 ailes reculent latéralement sur les 3 m.',
      'L\'arrière unique au fond — il doit lire vite.',
    ],
  },
  zone2: {
    ballX: 85, ballY: 38,
    players: [
      { zoneId: 'P3', x: 62, y: 53, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 70, sub: 'OFF' },
      { zoneId: 'P4', x: 20, y: 65, sub: 'DÉF' },
      { zoneId: 'P1', x: 50, y: 82 },
    ],
    zones: [
      Z('P2', 65, 56, 35, 44, 'Court ligne'),
      Z('P4', 0, 50, 35, 30, 'Diag G'),
      Z('P1', 25, 75, 45, 25, 'Fond'),
    ],
    mainShot: { toX: 20, toY: 70 },
    altShots: [{ toX: 82, toY: 80 }, { toX: 50, toY: 85 }, { toX: 70, toY: 65 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P4 reculé).',
      'Symétrique de Z4 : P3 monte côté zone 2 adverse, block à 1.',
      'P2 redescend sur les 3 m en couverture courte + feintes.',
      'L\'arrière unique défend le fond.',
    ],
  },
};

// 4v4 Carré (2-2) — block à 2 possible
const LAYOUTS_4V4_CARRE: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 15, ballY: 38,
    players: [
      { zoneId: 'P4', x: 22, y: 53, sub: 'BLK' },
      { zoneId: 'P2', x: 78, y: 65, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 80 },
      { zoneId: 'P1', x: 75, y: 80 },
    ],
    zones: [
      Z('P5', 0, 62, 35, 38, 'Petite diag'),
      Z('P1', 50, 62, 50, 38, 'Grande diagonale'),
      Z('P2', 60, 50, 40, 22, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 85 },
    altShots: [{ toX: 25, toY: 80 }, { toX: 78, toY: 65 }, { toX: 50, toY: 75 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P1).',
      'P4 fixe la ligne — block à 1 (block à 2 rare en carré sans central).',
      'P2 (passeur-attaquant) recule en off-blocker.',
      'P5 et P1 partagent diagonales courtes et longues.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 38,
    players: [
      { zoneId: 'P4', x: 35, y: 53, sub: 'BLK' },
      { zoneId: 'P2', x: 65, y: 53, sub: 'BLK' },
      { zoneId: 'P5', x: 25, y: 80 },
      { zoneId: 'P1', x: 75, y: 80 },
    ],
    zones: [
      Z('P5', 0, 60, 50, 40, 'Diag G'),
      Z('P1', 50, 60, 50, 40, 'Diag D'),
    ],
    mainShot: { toX: 25, toY: 80 },
    altShots: [{ toX: 75, toY: 80 }, { toX: 50, toY: 65 }],
    notes: [
      'Coup principal : diagonale puissante (G ou D).',
      'Block à 2 (P4 + P2) ferme le centre.',
      'P5 et P1 prennent les diagonales — pas de couverture courte derrière le bloc.',
      'Vulnérable aux feintes — le carré n\'a pas de joueur à mi-terrain.',
    ],
  },
  zone2: {
    ballX: 85, ballY: 38,
    players: [
      { zoneId: 'P2', x: 78, y: 53, sub: 'BLK' },
      { zoneId: 'P4', x: 22, y: 65, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 80 },
      { zoneId: 'P1', x: 75, y: 80 },
    ],
    zones: [
      Z('P1', 65, 62, 35, 38, 'Petite diag'),
      Z('P5', 0, 62, 50, 38, 'Grande diagonale'),
      Z('P4', 0, 50, 35, 22, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 85 },
    altShots: [{ toX: 75, toY: 80 }, { toX: 22, toY: 65 }, { toX: 50, toY: 75 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P5).',
      'Symétrique de Z4 : P2 fixe la ligne au filet.',
      'P4 (aile gauche) recule en off-blocker.',
      'P5 prend la grande diagonale, P1 la petite courte.',
    ],
  },
};

// 4v4 3-1 — passeur arrière, 3 attaquants au filet
const LAYOUTS_4V4_31 = LAYOUTS_4V4_LOSANGE; // similar baseline

// 5v5 2F/3B — uses pentagone-like
const LAYOUTS_5V5_2F3B = LAYOUTS_5V5_PENTAGON;

const LAYOUTS_BY_CONFIG: Record<string, Record<ZoneTab, DefenseLayout>> = {
  // 5v5
  'pentagon': LAYOUTS_5V5_PENTAGON,
  '3F-2B': LAYOUTS_5V5_3F2B,
  '2F-3B': LAYOUTS_5V5_2F3B,
  // 4v4
  'losange': LAYOUTS_4V4_LOSANGE,
  'carre': LAYOUTS_4V4_CARRE,
  '3-1': LAYOUTS_4V4_31,
};

function DataDrivenDefense({ layout }: { layout: DefenseLayout }) {
  return (
    <div className="space-y-4">
      <Court>
        <Ball x={layout.ballX} y={layout.ballY} />
        {layout.zones.map((z, i) => (
          <Zone key={`z-${i}`} x={z.x} y={z.y} w={z.w} h={z.h} type="arriere" posNumber={parseInt(z.posNumber.slice(1))} />
        ))}
        {layout.zones.map((z, i) => (
          <ZoneLabel key={`zl-${i}`} x={z.x + z.w / 2 - 5} y={z.y + z.h / 2} label={z.label} type="arriere" />
        ))}
        {/* Trajectoires : flèche pleine = coup principal, pointillés = alternatives */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none', zIndex: 20 }}
        >
          <defs>
            <marker id="ddm" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#eab308" />
            </marker>
            <marker id="dda" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
          <line
            x1={layout.ballX}
            y1={layout.ballY}
            x2={layout.mainShot.toX}
            y2={layout.mainShot.toY}
            stroke="#eab308"
            strokeWidth="1.5"
            markerEnd="url(#ddm)"
          />
          {layout.altShots.map((s, i) => (
            <line
              key={i}
              x1={layout.ballX}
              y1={layout.ballY}
              x2={s.toX}
              y2={s.toY}
              stroke="#6b7280"
              strokeWidth="0.8"
              markerEnd="url(#dda)"
              strokeDasharray="3,2"
            />
          ))}
        </svg>
        {layout.players.map(p => (
          <Player
            key={p.zoneId}
            x={p.x}
            y={p.y}
            label={p.zoneId.slice(1)}
            sub={p.sub}
            type={['P4', 'P3', 'P2'].includes(p.zoneId) ? 'avant' : 'arriere'}
          />
        ))}
      </Court>
      <ul className="space-y-1 text-sm text-gray-400">
        {layout.notes.map((n, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-yellow-400 mt-0.5">▸</span>
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==========================================================================
// 6v6 detailed diagrams (kept from previous version)
// ==========================================================================

function Zone4Tab() {
  return (
    <div className="space-y-4">
      <Court>
        <Ball x={15} y={38} />
        <Zone x={0} y={50} w={28} h={28} type="arriere" posNumber={5} />
        <Zone x={23} y={56} w={35} h={32} type="libero" posNumber={6} />
        <Zone x={58} y={62} w={42} h={38} type="arriere" posNumber={1} />
        <Zone x={70} y={50} w={30} h={24} type="avant" posNumber={2} />
        <ZoneLabel x={8} y={60} label="Zone 5" type="arriere" />
        <ZoneLabel x={38} y={68} label="Zone 6" type="libero" />
        <ZoneLabel x={72} y={80} label="Zone 1" type="arriere" />
        <ZoneLabel x={78} y={60} label="Zone 2" type="avant" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none', zIndex: 20 }}
        >
          <defs>
            <marker id="am" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#eab308" />
            </marker>
            <marker id="aa" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>
          <line x1="15" y1="38" x2="75" y2="85" stroke="#eab308" strokeWidth="1.5" markerEnd="url(#am)" />
          <line x1="15" y1="38" x2="18" y2="65" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
          <line x1="15" y1="38" x2="40" y2="75" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
          <line x1="15" y1="38" x2="85" y2="60" stroke="#6b7280" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
        </svg>
        <Player x={20} y={53} label="4" sub="BLK" type="avant" />
        <Player x={40} y={53} label="3" sub="BLK" type="avant" />
        <Player x={85} y={75} label="2" sub="DÉF" type="avant" />
        <Player x={15} y={75} label="5" type="arriere" />
        <Player x={38} y={75} label="6" sub="LIB" type="libero" />
        <Player x={85} y={85} label="1" type="arriere" />
      </Court>
      <ul className="space-y-1 text-sm">
        {[
          ['Postes 4 et 3', 'Bloquent au filet pour fermer la diagonale.'],
          ['Poste 2', 'Recule et défend la ligne (off-blocker).'],
          ['Poste 5', 'Avance légèrement, défend les balles courtes derrière le bloc.'],
          ['Poste 6 (Libéro)', 'Se décale nettement vers la gauche, défend au centre-gauche.'],
          ['Poste 1', 'Recule en fond de terrain, défend la diagonale longue.'],
        ].map(([l, t], i) => (
          <li key={i} className="flex items-start gap-2 text-gray-400">
            <span className="text-yellow-400 mt-0.5">▸</span>
            <span><strong className="text-white">{l} : </strong>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Zone3Tab() {
  return (
    <div className="space-y-4">
      <Court>
        <Ball x={50} y={38} />
        <Zone x={0} y={50} w={33} h={50} type="arriere" posNumber={5} />
        <Zone x={33} y={68} w={34} h={32} type="libero" posNumber={6} />
        <Zone x={67} y={50} w={33} h={50} type="arriere" posNumber={1} />
        <ZoneLabel x={10} y={80} label="Zone 5" type="arriere" />
        <ZoneLabel x={45} y={82} label="Zone 6" type="libero" />
        <ZoneLabel x={78} y={80} label="Zone 1" type="arriere" />
        <Player x={35} y={53} label="4" sub="BLK" type="avant" />
        <Player x={50} y={53} label="3" sub="BLK" type="avant" />
        <Player x={65} y={53} label="2" sub="BLK" type="avant" />
        <Player x={20} y={80} label="5" type="arriere" />
        <Player x={50} y={80} label="6" sub="LIB" type="libero" />
        <Player x={80} y={80} label="1" type="arriere" />
      </Court>
      <ul className="space-y-1 text-sm">
        {[
          ['Postes 4, 3 et 2', 'Triple bloc au centre.'],
          ['Postes 5 et 1', 'Reculent profondément dans les angles.'],
          ['Poste 6 (Libéro)', 'Se positionne au centre, prêt à réagir dans toutes les directions.'],
        ].map(([l, t], i) => (
          <li key={i} className="flex items-start gap-2 text-gray-400">
            <span className="text-yellow-400 mt-0.5">▸</span>
            <span><strong className="text-white">{l} : </strong>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Zone2Tab() {
  return (
    <div className="space-y-4">
      <Court>
        <Ball x={85} y={38} />
        <Zone x={0} y={62} w={42} h={38} type="arriere" posNumber={5} />
        <Zone x={40} y={56} w={35} h={32} type="libero" posNumber={6} />
        <Zone x={72} y={50} w={28} h={28} type="arriere" posNumber={1} />
        <Zone x={0} y={50} w={30} h={24} type="avant" posNumber={4} />
        <ZoneLabel x={16} y={80} label="Zone 5" type="arriere" />
        <ZoneLabel x={55} y={68} label="Zone 6" type="libero" />
        <ZoneLabel x={80} y={60} label="Zone 1" type="arriere" />
        <ZoneLabel x={7} y={60} label="Zone 4" type="avant" />
        <Player x={60} y={53} label="3" sub="BLK" type="avant" />
        <Player x={80} y={53} label="2" sub="BLK" type="avant" />
        <Player x={15} y={75} label="4" sub="DÉF" type="avant" />
        <Player x={15} y={85} label="5" type="arriere" />
        <Player x={62} y={75} label="6" sub="LIB" type="libero" />
        <Player x={85} y={75} label="1" type="arriere" />
      </Court>
      <ul className="space-y-1 text-sm">
        {[
          ['Postes 3 et 2', 'Bloquent au filet, ferment la diagonale.'],
          ['Poste 4', 'Recule et défend la ligne gauche (off-blocker).'],
          ['Poste 1', 'Avance légèrement, défend les balles courtes derrière le bloc.'],
          ['Poste 6 (Libéro)', 'Se décale nettement vers la droite.'],
          ['Poste 5', 'Recule en fond de terrain, défend la diagonale longue.'],
        ].map(([l, t], i) => (
          <li key={i} className="flex items-start gap-2 text-gray-400">
            <span className="text-yellow-400 mt-0.5">▸</span>
            <span><strong className="text-white">{l} : </strong>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==========================================================================
// Reference data (unchanged)
// ==========================================================================

const INDICES_VISUELS = [
  { title: 'Attaquant loin du filet', action: 'AVANCE', accent: 'border-yellow-400', titleColor: 'text-yellow-400',
    points: ['Passe à 2–3m du filet', 'Il ne peut pas smasher fort', 'Risque élevé de feinte ou amortie', 'Avance de 1–2 mètres'] },
  { title: 'Attaquant près du filet', action: 'RECULE', accent: 'border-red-500', titleColor: 'text-red-400',
    points: ['Passe à moins de 1m du filet', 'Peut smasher à pleine puissance', 'Trajectoire descendante rapide', 'Recule au maximum'] },
  { title: "L'épaule de l'attaquant", action: 'Regarde son épaule qui frappe', accent: 'border-gray-500', titleColor: 'text-gray-300',
    points: ['Épaule haute et en arrière = smash puissant', 'Épaule basse = feinte probable', "Rotation d'épaule = direction de la balle", 'Ajuste-toi en 0,5s'] },
  { title: "L'élan de l'attaquant", action: "Observe sa course d'approche", accent: 'border-gray-600', titleColor: 'text-gray-400',
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

const EXERCICES = [
  { title: 'Lecture de situation', level: 'Débutant', duration: '10 min', materiel: '1 coach ou partenaire avec balles',
    objectif: "Apprendre à identifier rapidement la zone d'attaque",
    steps: ["Le coach se place de l'autre côté du filet en zone 4, 3 ou 2", 'Tu pars du centre du terrain', 'Le coach annonce la zone et lance la balle', 'Tu dois te placer dans ta zone défensive en 2–3 secondes', 'Répète 20 fois en variant les zones'] },
  { title: 'Avancer/Reculer selon la passe', level: 'Intermédiaire', duration: '15 min', materiel: '1 passeur, 1 attaquant, plusieurs défenseurs',
    objectif: 'Ajuster ta position selon la qualité de la passe',
    steps: ["Le passeur fait des passes de qualité variable à l'attaquant", 'Passe proche du filet → Tu recules (smash puissant attendu)', 'Passe loin du filet → Tu avances (feinte probable)', "L'attaquant frappe et tu défends", 'Le coach corrige ta position après chaque balle'] },
  { title: 'Communication défensive', level: 'Tous niveaux', duration: '10 min', materiel: 'Équipe complète',
    objectif: 'Développer la communication automatique',
    steps: ['Jeu à 6 contre 6, mais en CRIANT tous les appels', 'Pénalité : -1 point si un joueur ne crie pas "Moi !" sur sa balle', "Bonus : +1 point si toute l'équipe communique sur un échange", "Chaque joueur doit annoncer la zone d'attaque adverse"] },
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

// ==========================================================================
// Component
// ==========================================================================

export default function GuidePositionnement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSize = (parseInt(searchParams.get('size') ?? '6') as TeamSize);
  const initialConfig = searchParams.get('config') ?? CONFIGURATIONS[initialSize][0].id;

  const [teamSize, setTeamSize] = useState<TeamSize>([4, 5, 6].includes(initialSize) ? initialSize : 6);
  const [configId, setConfigId] = useState<string>(initialConfig);
  const [zone, setZone] = useState<ZoneTab>('zone4');

  const configurations = CONFIGURATIONS[teamSize];
  const configuration = configurations.find(c => c.id === configId) ?? configurations[0];

  // Sync URL when selection changes
  useEffect(() => {
    setSearchParams({ size: String(teamSize), config: configuration.id }, { replace: true });
  }, [teamSize, configuration.id, setSearchParams]);

  const changeTeamSize = (size: TeamSize) => {
    setTeamSize(size);
    setConfigId(CONFIGURATIONS[size][0].id);
  };

  const renderZoneTab = () => {
    if (teamSize === 6) {
      if (zone === 'zone4') return <Zone4Tab />;
      if (zone === 'zone3') return <Zone3Tab />;
      return <Zone2Tab />;
    }
    const layouts = LAYOUTS_BY_CONFIG[configuration.id];
    if (!layouts) {
      return <div className="text-gray-500 text-sm">Diagramme non disponible pour cette configuration.</div>;
    }
    return <DataDrivenDefense layout={layouts[zone]} />;
  };

  return (
    <div className="space-y-12">

      {/* TOP — Format & configuration selectors (affects everything below) */}
      <section className="border-2 border-yellow-400 bg-yellow-400/5 p-5 space-y-4">
        <div className="text-yellow-400 text-xs uppercase tracking-widest font-bold">Configuration de votre équipe</div>
        <p className="text-gray-300 text-sm">
          Choisissez votre format et votre configuration tactique : <strong className="text-white">tout le contenu du guide</strong> (postes, zones, défense par attaque) s'adaptera.
        </p>

        <div className="space-y-2">
          <div className="text-gray-500 text-xs uppercase tracking-widest">Format de jeu</div>
          <div className="flex flex-wrap gap-2">
            {([6, 5, 4] as const).map(size => (
              <button
                key={size}
                onClick={() => changeTeamSize(size)}
                className={`px-4 py-2 text-xs uppercase tracking-wider border-2 transition-colors ${
                  teamSize === size
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {size}v{size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-gray-500 text-xs uppercase tracking-widest">Configuration tactique</div>
          <div className="flex flex-wrap gap-2">
            {configurations.map(c => (
              <button
                key={c.id}
                onClick={() => setConfigId(c.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider border-2 transition-colors ${
                  configId === c.id
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {c.shortName}
              </button>
            ))}
          </div>
          <div className="text-white font-bold text-sm pt-1">{configuration.name}</div>
          <p className="text-gray-400 text-sm leading-relaxed">{configuration.description}</p>
        </div>
      </section>

      {/* Principe de base */}
      <div className="border-2 border-gray-700 bg-gray-900 p-5 space-y-2">
        <div className="text-yellow-400 text-xs uppercase tracking-wider">Principe de base de la défense</div>
        <p className="text-gray-300 text-sm">Le positionnement défensif dépend de 3 facteurs principaux :</p>
        <ul className="space-y-1">
          {['Votre poste (avant ou arrière)', "La zone d'attaque adverse (zone 4, 3, 2)", "Le type d'attaque (smash puissant, feinte, pointe)"].map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-yellow-400 mt-0.5">▸</span>
              <span className="text-gray-300">{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Les Postes et Zones — config-aware */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
          1. Postes et zones — {configuration.shortName} ({teamSize}v{teamSize})
        </h2>
        <div className="border-2 border-gray-700 p-4 space-y-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider text-center">
            Disposition de votre équipe en {configuration.name}
          </p>
          <div className="relative w-full max-w-[440px] mx-auto bg-gray-800 border border-gray-600" style={{ aspectRatio: '1 / 1.1' }}>
            <div className="absolute top-0 left-0 right-0 border-t-2 border-yellow-400" style={{ zIndex: 5 }} />
            <div className="absolute left-0 right-0 border-t border-dashed border-gray-600" style={{ top: '33%' }} />
            {configuration.positions.filter(p => p.zoneId !== 'L').map(p => (
              <div
                key={p.zoneId}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${p.court.x}%`, top: `${p.court.y}%` }}
              >
                <span
                  className="w-10 h-10 flex items-center justify-center text-sm font-bold border-2"
                  style={{
                    color: p.zoneId === 'P5' ? '#000' : '#fff',
                    backgroundColor: ROLE_COLORS[p.zoneId],
                    borderColor: 'rgba(0,0,0,0.4)',
                  }}
                >
                  {p.zoneId}
                </span>
                <span className="mt-1 text-[9px] uppercase text-gray-400 whitespace-nowrap">{p.name}</span>
              </div>
            ))}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notre côté</div>
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 uppercase tracking-wider">Adversaires</div>
          </div>
          <div className="text-center">
            <Link
              to={`/positions?size=${teamSize}&config=${configuration.id}`}
              className="inline-block text-yellow-400 text-xs uppercase tracking-wider border-2 border-yellow-400 px-4 py-2 hover:bg-yellow-400/10 transition-colors"
            >
              Voir le détail de chaque poste sur /positions →
            </Link>
          </div>
        </div>
        <div className="border-l-4 border-gray-600 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Règle importante : </strong>
          {teamSize === 6 && 'Les joueurs arrière (5, 6, 1) ne peuvent PAS bloquer au filet. Ils défendent en fond de terrain.'}
          {teamSize === 5 && 'Avec 5 joueurs, chaque défenseur couvre ~30 m² (vs 20 m² en 6v6). La lecture devient critique.'}
          {teamSize === 4 && 'Pas de libéro. Chaque joueur défend ~30-40 m². L\'anticipation est la compétence n°1.'}
        </div>
      </section>

      {/* 2. Positionnement par zone — uses top selectors */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
          2. Positionnement selon la zone d'attaque adverse
        </h2>

        <div className="flex gap-1 flex-wrap">
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button
              key={z}
              onClick={() => setZone(z)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
                zone === z
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              {z === 'zone4' ? 'Attaque Zone 4' : z === 'zone3' ? 'Attaque Zone 3' : 'Attaque Zone 2'}
            </button>
          ))}
        </div>
        <div className="border-2 border-gray-700 p-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider text-center mb-4">
            {teamSize}v{teamSize} · {configuration.shortName} —{' '}
            {zone === 'zone4' ? 'Défense contre attaque en Zone 4 (aile gauche adverse)' :
             zone === 'zone3' ? 'Défense contre attaque en Zone 3 (centre)' :
             'Défense contre attaque en Zone 2 (aile droite adverse)'}
          </p>
          {renderZoneTab()}
        </div>
        <div className="text-xs text-gray-600 flex gap-4 flex-wrap">
          <span><span className="text-yellow-400">■</span> Zone de responsabilité</span>
          <span className="text-gray-400"><strong>BLK</strong> = au bloc</span>
          <span className="text-gray-400"><strong>OFF</strong> = off-blocker</span>
          <span className="text-gray-400"><strong>DÉF</strong> = défense</span>
        </div>
      </section>

      {/* 6. Principes généraux */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">3. Principes généraux de positionnement</h2>
        <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Zones de responsabilité</div>
        <div className="grid md:grid-cols-3 gap-3">
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
            <div key={i} className="border-2 border-gray-700 p-4 space-y-2">
              <h4 className="text-yellow-400 text-xs uppercase tracking-wider font-bold">{card.title}</h4>
              <ul className="space-y-1">
                {card.points.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Lire l'attaquant */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">4. Lire l'attaquant : les indices visuels</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          Ton positionnement doit s'ajuster en fonction de ce que tu vois. Voici les indices clés :
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {INDICES_VISUELS.map((card, i) => (
            <div key={i} className={`border-l-4 ${card.accent} border-2 border-gray-700 p-4 space-y-2`}>
              <h4 className={`text-sm font-bold ${card.titleColor}`}>{card.title}</h4>
              <div className="text-yellow-400 text-xs font-bold">{card.action}</div>
              <ul className="space-y-1">
                {card.points.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Astuce pro : </strong>
          Dans les 2 premières secondes après le service adverse, concentre ton regard sur le passeur, puis IMMÉDIATEMENT sur l'attaquant qui va frapper.
        </div>
      </section>

      {/* 5. Quand avancer / reculer */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">5. Quand s'avancer ou reculer ?</h2>
        <div className="border-2 border-gray-700 p-4 space-y-4">
          <div className="text-gray-500 text-xs uppercase tracking-wider">Arbre de décision rapide</div>
          <div className="space-y-3">
            <div className="border-l-4 border-yellow-400 pl-4 space-y-1">
              <div className="text-yellow-400 text-xs uppercase tracking-wider font-bold">S'avancer (3–4m du filet) quand :</div>
              {[
                "Vous êtes du même côté que l'attaquant",
                "L'attaquant est loin du filet (mauvaise passe)",
                'Vous anticipez une feinte ou amortie',
                'Le bloc est solide — moins de balles puissantes passent',
              ].map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-yellow-400 mt-0.5">▸</span>{pt}
                </div>
              ))}
            </div>
            <div className="border-l-4 border-gray-600 pl-4 space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wider font-bold">Reculer (6–7m du filet) quand :</div>
              {[
                "Vous êtes du côté opposé à l'attaquant",
                "L'attaquant a une bonne passe près du filet",
                "L'attaquant est puissant ou grand",
                'Le bloc est faible (1 seul bloqueur)',
                'Vous défendez la diagonale (trajectoire la plus longue)',
              ].map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-gray-500 mt-0.5">▸</span>{pt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Erreurs courantes */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">6. Erreurs courantes à éviter</h2>
        <div className="space-y-2">
          {[
            ['Rester au milieu du terrain', "Beaucoup de débutants restent à 4–5m du filet, dans «no man's land». C'est la zone où vous ne pouvez défendre ni les balles courtes ni les balles longues. Choisissez : avancé OU reculé !"],
            ['Ne pas regarder le bloc', 'La position du bloc détermine où la balle peut passer. Si le bloc ferme bien la ligne, défendez plus la diagonale.'],
            ['Ne pas bouger après le service', "Votre position de service n'est JAMAIS votre position de défense. Dès que le service part, repositionnez-vous selon l'attaque adverse."],
            ['Défendre la même zone que votre coéquipier', 'Communiquez ! Si deux joueurs vont au même endroit, un espace se crée ailleurs.'],
          ].map(([label, text], i) => (
            <div key={i} className="border-l-4 border-red-500 pl-4 py-2 text-sm">
              <strong className="text-white">{label} : </strong>
              <span className="text-gray-400">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Positionnement au service */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">7. Positionnement au service</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          <strong className="text-white">Ton placement au service est DIFFÉRENT de ta position défensive. </strong>
          Dès que le service part, tu dois te repositionner.
        </div>
        <div className="border-2 border-gray-700 p-4 space-y-3">
          <div className="text-gray-500 text-xs uppercase tracking-wider">Transition service → défense</div>
          <ol className="space-y-2">
            {[
              ['Ton équipe sert', 'Tu es en position de rotation'],
              ['Le serveur frappe', 'Tu regardes le passeur adverse'],
              ['Le passeur touche la balle', 'Tu te déplaces vers ta zone défensive'],
              ["L'attaquant saute", 'Tu es en position finale, prêt à réagir'],
            ].map(([step, detail], i) => (
              <li key={i} className="flex gap-3 items-start text-sm">
                <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span><strong className="text-white">{step} : </strong><span className="text-gray-400">{detail}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Communication */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">8. Communication défensive</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          Une défense silencieuse est une défense inefficace.
        </div>
        <div className="space-y-3">
          {[
            { moment: "Avant l'attaque adverse", calls: [['"Numéro 4 !"', "Annonce la zone d'où vient l'attaque"], ['"Deux au bloc !"', 'Indique combien de bloqueurs'], ['"Ligne libre !"', 'Si le bloc ne couvre pas la ligne'], [`"J'avance !" / "Je recule !"`, 'Annonce ton mouvement']] },
            { moment: "Pendant l'action", calls: [[`"Moi !" / "J'ai !"`, 'Tu prends la balle (le PLUS important)'], ['"Toi !" / "À toi !"', 'Tu laisses la balle à un coéquipier'], ['"Dehors !"', 'La balle va sortir, ne la touche pas'], ['"Bloquée !"', 'Si tu bloques, annonce-le']] },
            { moment: "Après l'action", calls: [['"Couvrez !"', "Demande la couverture d'attaque"], ['"Libre !"', 'Balle libre, replacez-vous'], ['"On reste !"', 'On garde la défense en place']] },
          ].map((group, i) => (
            <div key={i} className="border-2 border-gray-700 p-4 space-y-2">
              <div className="text-yellow-400 text-xs uppercase tracking-wider">{group.moment}</div>
              <ul className="space-y-1">
                {group.calls.map(([call, desc], j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    <span><strong className="text-white">{call} </strong><span className="text-gray-500">—</span><span className="text-gray-400"> {desc}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Règle d'or : </strong>
          En cas de doute entre deux joueurs, c'est TOUJOURS le joueur le plus avancé qui prend la balle.
        </div>
      </section>

      {/* 9. Systèmes défensifs avancé / reculé */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">9. Systèmes défensifs : avancé vs reculé</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          Il existe deux philosophies défensives principales. Ton équipe peut choisir de jouer avec une défense avancée ou reculée.
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border-2 border-yellow-400 bg-yellow-400/5 p-4 space-y-3">
            <h3 className="text-yellow-400 text-xs uppercase tracking-wider font-bold text-center">Défense avancée</h3>
            <div className="text-gray-500 text-xs">Principe : les arrières se positionnent à 3–4m du filet</div>
            <div className="space-y-2 text-sm">
              <div className="text-gray-400 text-xs uppercase tracking-wider">Avantages</div>
              <ul className="space-y-1">{['Excellente contre les feintes', 'Récupère les balles molles', 'Couvre bien les amorties', 'Transition rapide attaque-défense'].map((pt, i) => (<li key={i} className="flex items-start gap-2 text-gray-400"><span className="text-yellow-400">▸</span>{pt}</li>))}</ul>
              <div className="text-gray-400 text-xs uppercase tracking-wider mt-2">Inconvénients</div>
              <ul className="space-y-1">{['Vulnérable aux smashes puissants', 'Diagonales longues difficiles', 'Nécessite des blocs solides'].map((pt, i) => (<li key={i} className="flex items-start gap-2 text-gray-400"><span className="text-gray-600">▸</span>{pt}</li>))}</ul>
            </div>
          </div>
          <div className="border-2 border-gray-600 p-4 space-y-3">
            <h3 className="text-gray-300 text-xs uppercase tracking-wider font-bold text-center">Défense reculée</h3>
            <div className="text-gray-500 text-xs">Principe : les arrières se positionnent à 6–7m du filet</div>
            <div className="space-y-2 text-sm">
              <div className="text-gray-400 text-xs uppercase tracking-wider">Avantages</div>
              <ul className="space-y-1">{['Excellente contre les smashes puissants', 'Plus de temps de réaction', 'Couvre toute la profondeur', 'Diagonales bien défendues'].map((pt, i) => (<li key={i} className="flex items-start gap-2 text-gray-400"><span className="text-gray-300">▸</span>{pt}</li>))}</ul>
              <div className="text-gray-400 text-xs uppercase tracking-wider mt-2">Inconvénients</div>
              <ul className="space-y-1">{['Vulnérable aux feintes courtes', 'Zone morte derrière le bloc', 'Difficile de remonter les amorties'].map((pt, i) => (<li key={i} className="flex items-start gap-2 text-gray-400"><span className="text-gray-600">▸</span>{pt}</li>))}</ul>
            </div>
          </div>
        </div>
        <div className="border-l-4 border-yellow-400 pl-4 py-1 text-sm text-gray-400">
          <strong className="text-white">Niveau avancé : </strong>
          Les meilleures équipes utilisent une défense mixte — le joueur du même côté que l'attaque avance (3–4m), tandis que les deux autres reculent (6–7m).
        </div>
      </section>

      {/* 10. Transitions */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">10. Transitions attaque ↔ défense</h2>
        <div className="border-2 border-gray-700 bg-gray-900 p-4 text-sm text-gray-300">
          Le volleyball est un jeu de transitions rapides. Tu passes constamment de l'attaque à la défense et vice-versa.
        </div>
        <div className="space-y-3">
          <div className="border-2 border-gray-700 p-4 space-y-3">
            <div className="text-yellow-400 text-xs uppercase tracking-wider">Transition attaque → défense</div>
            <ol className="space-y-2">
              {[['Ton coéquipier attaque', 'Prépare-toi mentalement à défendre'], ['La balle est renvoyée', 'Identifie immédiatement qui va attaquer'], ['Course rapide', 'Va vers ta zone défensive (2–3 secondes max)'], ['Position basse', 'Fléchis les jambes, prêt à plonger']].map(([step, detail], i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span><strong className="text-white">{step} : </strong><span className="text-gray-400">{detail}</span></span>
                </li>
              ))}
            </ol>
          </div>
          <div className="border-2 border-gray-700 p-4 space-y-3">
            <div className="text-yellow-400 text-xs uppercase tracking-wider">Transition défense → attaque</div>
            <ol className="space-y-2">
              {[['Tu défends la balle', 'Passe précise vers le passeur'], ['Si tu es AVANT', 'Cours au filet pour attaquer ou bloquer'], ['Si tu es ARRIÈRE', "Recule légèrement, prêt à couvrir l'attaque"], ["Couverture d'attaque", 'Entoure ton attaquant (en demi-cercle à 2–3m)']].map(([step, detail], i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span><strong className="text-white">{step} : </strong><span className="text-gray-400">{detail}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 11. Exercices */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">11. Exercices pour progresser</h2>
        <div className="space-y-3">
          {EXERCICES.map((ex, i) => (
            <div key={i} className="border-2 border-gray-700 p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-white font-bold text-sm">{i + 1}. {ex.title}</h4>
                <span className="text-yellow-400 text-xs border border-yellow-400/50 px-2 py-0.5 flex-shrink-0">{ex.level}</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-600">
                <span>Durée : {ex.duration}</span>
                <span>Matériel : {ex.materiel}</span>
              </div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Objectif : <span className="text-gray-300 normal-case">{ex.objectif}</span></div>
              <ol className="space-y-1">
                {ex.steps.map((step, j) => (
                  <li key={j} className="flex gap-3 items-start text-sm">
                    <span className="text-yellow-400 text-xs flex-shrink-0 w-4 text-right mt-0.5">{j + 1}.</span>
                    <span className="text-gray-400">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Récapitulatif */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">12. Les 10 commandements du défenseur</h2>
        <div className="border-2 border-gray-700 p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-2">
            {COMMANDEMENTS.map(([title, sub], i) => (
              <div key={i} className="border border-gray-700 p-3 flex gap-3 items-start">
                <span className="text-yellow-400 font-bold text-sm flex-shrink-0 w-5">{i + 1}.</span>
                <div>
                  <div className="text-white text-sm font-bold">{title}</div>
                  <div className="text-gray-500 text-xs">{sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            <div className="border-2 border-yellow-400 bg-yellow-400/5 p-4 text-center">
              <div className="text-yellow-400 font-bold text-sm">Même côté que l'attaquant</div>
              <div className="text-yellow-400 text-lg font-bold mt-1">→ AVANCER (3–4m)</div>
              <div className="text-gray-500 text-xs mt-1">Défendre feintes et amorties</div>
            </div>
            <div className="border-2 border-gray-600 p-4 text-center">
              <div className="text-gray-300 font-bold text-sm">Côté opposé à l'attaquant</div>
              <div className="text-gray-300 text-lg font-bold mt-1">→ RECULER (6–7m)</div>
              <div className="text-gray-500 text-xs mt-1">Défendre diagonales longues</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div className="border-2 border-yellow-400 bg-yellow-400/5 p-6 space-y-4">
          <h2 className="text-yellow-400 text-xs uppercase tracking-widest font-bold">Conclusion</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Le positionnement défensif s'apprend avec la pratique et l'expérience. Ne te décourage pas si tu fais
            des erreurs au début — même les professionnels ajustent constamment leur placement.
          </p>
          <p className="text-white font-bold text-sm">
            La clé : applique la règle de base (même côté = avance, opposé = recule), observe l'attaquant,
            communique avec tes coéquipiers, et n'aie jamais peur de plonger pour une balle.
          </p>
          <p className="text-yellow-400 font-bold tracking-wide">La défense gagne les matchs.</p>
        </div>
      </section>

    </div>
  );
}
