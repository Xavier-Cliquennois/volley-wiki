import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Court, Player, Zone, Ball, ZoneLabel } from './CourtDiagram';
import { ROLE_COLORS } from '../constants/positions';
import { CONFIGURATIONS, type TeamSize } from '../pages/Positions';

const S = {
  section: { fontFamily: '"Bungee", sans-serif', fontSize: 13, letterSpacing: '0.08em', color: 'var(--ink)', marginBottom: 14, paddingBottom: 8, borderBottom: '2.5px solid var(--ink)' } as React.CSSProperties,
  label: { fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--orange)', marginBottom: 4 },
  labelTeal: { fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'var(--teal)', marginBottom: 4 },
  card: { background: 'var(--paper)', border: '2.5px solid var(--ink)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' } as React.CSSProperties,
  alert: { background: 'var(--yellow)', border: '2.5px solid var(--ink)', padding: '14px 18px', boxShadow: 'var(--shadow-sm)' } as React.CSSProperties,
  bullet: { color: 'var(--teal)', marginTop: 2, flexShrink: 0 } as React.CSSProperties,
  bulletOrange: { color: 'var(--orange)', marginTop: 2, flexShrink: 0 } as React.CSSProperties,
  stepBadge: { background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 11, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as React.CSSProperties,
};

type ZoneTab = 'zone4' | 'zone3' | 'zone2';
type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

type DefensePlayer = {
  zoneId: ZoneId;
  x: number;
  y: number;
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
  mainShot: Shot;
  altShots: Shot[];
  notes: string[];
};

const Z = (zoneId: ZoneId, x: number, y: number, w: number, h: number, label: string): DefenseZone =>
  ({ zoneId, x, y, w, h, posNumber: zoneId, label } as DefenseZone & { zoneId: ZoneId });

const LAYOUTS_5V5_PENTAGON: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P3', x: 38, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 80, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 70 },
      { zoneId: 'P1', x: 75, y: 67 },
    ],
    zones: [
      Z('P5', 0, 40, 35, 60, 'Z5 court'),
      Z('P1', 50, 43, 50, 57, 'Grande diagonale'),
      Z('P2', 70, 25, 30, 33, 'Off-blk court'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P1).',
      'Block à 2 (P4 monte avec P3) ferme la diagonale.',
      'P2 (aile droite) recule sur les 3 m en off-blocker.',
      "P5 (proche de l'attaque) défend la petite diagonale courte.",
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
      'Coup principal : diagonale puissante (G ou D, ici G).',
      'Block à 1 sur la rapide centrale (P3 seul).',
      'P4 et P2 reculent latéralement sur les 3 m.',
      'P5 et P1 tiennent les diagonales — pas de défense fond centre dédiée.',
    ],
  },
  zone2: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P3', x: 62, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 20, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 67 },
      { zoneId: 'P1', x: 78, y: 70 },
    ],
    zones: [
      Z('P1', 65, 40, 35, 60, 'Z1 court'),
      Z('P5', 0, 43, 50, 57, 'Grande diagonale'),
      Z('P4', 0, 25, 30, 33, 'Off-blk court'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P5).',
      'Symétrique de Z4 : P3 + P2 forment le bloc, P4 off-blocker court.',
      'P1 défend la petite diagonale courte côté droit.',
      'P5 prend la grande diagonale longue.',
    ],
  },
};

const LAYOUTS_5V5_3F2B: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P3', x: 40, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 18, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 80, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 22, y: 70 },
      { zoneId: 'P1', x: 75, y: 70 },
    ],
    zones: [
      Z('P5', 0, 43, 35, 57, 'Z5 court'),
      Z('P1', 50, 43, 50, 57, 'Grande diagonale'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P1).',
      'Block à 2 (P4 + P3) ferme la diagonale.',
      'Le passeur (P2) recule en off-blocker côté ligne.',
      'P5 (souvent meilleur réceptionneur) en grande diagonale.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 19,
    players: [
      { zoneId: 'P4', x: 30, y: 29.5, sub: 'BLK' },
      { zoneId: 'P3', x: 50, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 70, y: 29.5, sub: 'BLK' },
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
      'Coup principal : balle profonde droit devant (faiblesse du système).',
      "Avec 3 avants, block à 3 possible — mais laisse seulement 2 défenseurs au sol.",
      "En général : block à 2 (P3 + l'aile la plus proche).",
      'P5 et P1 partagent les diagonales.',
    ],
  },
  zone2: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P3', x: 60, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 82, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 20, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 35, y: 70 },
      { zoneId: 'P1', x: 78, y: 70 },
    ],
    zones: [
      Z('P1', 65, 40, 35, 60, 'Z1 court'),
      Z('P5', 0, 43, 50, 57, 'Grande diagonale'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 35, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P5).',
      "Bloc P3 + P2 — l'aile droite (P2 = passeur ici) bloque.",
      'P4 off-blocker court côté gauche.',
      'P1 défend la ligne droite, P5 la grande diagonale.',
    ],
  },
};

const LAYOUTS_4V4_LOSANGE: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P3', x: 38, y: 29.5, sub: 'BLK' },
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
      'Coup principal : diagonale longue (vers P2 reculé).',
      'Block à 1 (P3 monte sur la zone 4 adverse).',
      'P4 redescend sur les 3 m côté ligne (couverture courte + feintes).',
      "L'arrière unique P1 doit anticiper la trajectoire profonde.",
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
      'Coup principal : balle profonde droit devant (vers P1 fond).',
      'Block à 1 (P3 seul) sur la rapide centrale.',
      'Les 2 ailes reculent latéralement sur les 3 m.',
      "L'arrière unique au fond — il doit lire vite.",
    ],
  },
  zone2: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P3', x: 62, y: 29.5, sub: 'BLK' },
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
      'Coup principal : grande diagonale longue (vers P4 reculé).',
      'Symétrique de Z4 : P3 monte côté zone 2 adverse, block à 1.',
      'P2 redescend sur les 3 m en couverture courte + feintes.',
      "L'arrière unique défend le fond.",
    ],
  },
};

const LAYOUTS_4V4_CARRE: Record<ZoneTab, DefenseLayout> = {
  zone4: {
    ballX: 15, ballY: 19,
    players: [
      { zoneId: 'P4', x: 22, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 78, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 70 },
      { zoneId: 'P1', x: 75, y: 70 },
    ],
    zones: [
      Z('P5', 0, 43, 35, 57, 'Petite diag'),
      Z('P1', 50, 43, 50, 57, 'Grande diagonale'),
      Z('P2', 60, 25, 40, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 78, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P1).',
      'P4 fixe la ligne — block à 1 (block à 2 rare en carré sans central).',
      'P2 (passeur-attaquant) recule en off-blocker.',
      'P5 et P1 partagent diagonales courtes et longues.',
    ],
  },
  zone3: {
    ballX: 50, ballY: 19,
    players: [
      { zoneId: 'P4', x: 35, y: 29.5, sub: 'BLK' },
      { zoneId: 'P2', x: 65, y: 29.5, sub: 'BLK' },
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
      'Coup principal : diagonale puissante (G ou D).',
      'Block à 2 (P4 + P2) ferme le centre.',
      "P5 et P1 prennent les diagonales — pas de couverture courte derrière le bloc.",
      "Vulnérable aux feintes — le carré n'a pas de joueur à mi-terrain.",
    ],
  },
  zone2: {
    ballX: 85, ballY: 19,
    players: [
      { zoneId: 'P2', x: 78, y: 29.5, sub: 'BLK' },
      { zoneId: 'P4', x: 22, y: 47.5, sub: 'OFF' },
      { zoneId: 'P5', x: 25, y: 70 },
      { zoneId: 'P1', x: 75, y: 70 },
    ],
    zones: [
      Z('P1', 65, 43, 35, 57, 'Petite diag'),
      Z('P5', 0, 43, 50, 57, 'Grande diagonale'),
      Z('P4', 0, 25, 35, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 22, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Coup principal : grande diagonale longue (vers P5).',
      'Symétrique de Z4 : P2 fixe la ligne au filet.',
      'P4 (aile gauche) recule en off-blocker.',
      'P5 prend la grande diagonale, P1 la petite courte.',
    ],
  },
};

const LAYOUTS_4V4_31 = LAYOUTS_4V4_LOSANGE;
const LAYOUTS_5V5_2F3B = LAYOUTS_5V5_PENTAGON;

const LAYOUTS_BY_CONFIG: Record<string, Record<ZoneTab, DefenseLayout>> = {
  'pentagon': LAYOUTS_5V5_PENTAGON,
  '3F-2B': LAYOUTS_5V5_3F2B,
  '2F-3B': LAYOUTS_5V5_2F3B,
  'losange': LAYOUTS_4V4_LOSANGE,
  'carre': LAYOUTS_4V4_CARRE,
  '3-1': LAYOUTS_4V4_31,
};

function DataDrivenDefense({ layout }: { layout: DefenseLayout }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Court>
        <Ball x={layout.ballX} y={layout.ballY} />
        {layout.zones.map((z, i) => (
          <Zone key={`z-${i}`} x={z.x} y={z.y} w={z.w} h={z.h} type="arriere" posNumber={parseInt(z.posNumber.slice(1))} />
        ))}
        {layout.zones.map((z, i) => (
          <ZoneLabel key={`zl-${i}`} x={z.x + z.w / 2 - 5} y={z.y + z.h / 2} label={z.label} type="arriere" />
        ))}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none', zIndex: 20 }}
        >
          <defs>
            <marker id="ddm" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#e2542e" />
            </marker>
            <marker id="dda" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#8a7a62" />
            </marker>
          </defs>
          <line
            x1={layout.ballX} y1={layout.ballY}
            x2={layout.mainShot.toX} y2={layout.mainShot.toY}
            stroke="#e2542e" strokeWidth="1.5" markerEnd="url(#ddm)"
          />
          {layout.altShots.map((s, i) => (
            <line
              key={i}
              x1={layout.ballX} y1={layout.ballY}
              x2={s.toX} y2={s.toY}
              stroke="#8a7a62" strokeWidth="0.8" markerEnd="url(#dda)" strokeDasharray="3,2"
            />
          ))}
        </svg>
        {layout.players.map(p => (
          <Player
            key={p.zoneId}
            x={p.x} y={p.y}
            label={p.zoneId.slice(1)}
            sub={p.sub}
            type={['P4', 'P3', 'P2'].includes(p.zoneId) ? 'avant' : 'arriere'}
          />
        ))}
      </Court>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {layout.notes.map((n, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
            <span style={S.bulletOrange}>▸</span>
            <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Zone4Tab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Court>
        <Ball x={15} y={19} />
        <Zone x={0} y={25} w={28} h={42} type="arriere" posNumber={5} />
        <Zone x={23} y={34} w={35} h={48} type="libero" posNumber={6} />
        <Zone x={58} y={43} w={42} h={57} type="arriere" posNumber={1} />
        <Zone x={70} y={25} w={30} h={36} type="avant" posNumber={2} />
        <ZoneLabel x={8} y={40} label="Zone 5" type="arriere" />
        <ZoneLabel x={38} y={52} label="Zone 6" type="libero" />
        <ZoneLabel x={72} y={70} label="Zone 1" type="arriere" />
        <ZoneLabel x={78} y={40} label="Zone 2" type="avant" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none', zIndex: 20 }}
        >
          <defs>
            <marker id="am" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#e2542e" />
            </marker>
            <marker id="aa" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#8a7a62" />
            </marker>
          </defs>
          <line x1="15" y1="19" x2="75" y2="77.5" stroke="#e2542e" strokeWidth="1.5" markerEnd="url(#am)" />
          <line x1="15" y1="19" x2="18" y2="47.5" stroke="#8a7a62" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
          <line x1="15" y1="19" x2="40" y2="62.5" stroke="#8a7a62" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
          <line x1="15" y1="19" x2="85" y2="40" stroke="#8a7a62" strokeWidth="0.8" markerEnd="url(#aa)" strokeDasharray="3,2" />
        </svg>
        <Player x={20} y={29.5} label="4" sub="BLK" type="avant" />
        <Player x={40} y={29.5} label="3" sub="BLK" type="avant" />
        <Player x={85} y={62.5} label="2" sub="DÉF" type="avant" />
        <Player x={15} y={62.5} label="5" type="arriere" />
        <Player x={38} y={62.5} label="6" sub="LIB" type="libero" />
        <Player x={85} y={77.5} label="1" type="arriere" />
      </Court>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          ['Postes 4 et 3', 'Bloquent au filet pour fermer la diagonale.'],
          ['Poste 2', 'Recule et défend la ligne (off-blocker).'],
          ['Poste 5', 'Avance légèrement, défend les balles courtes derrière le bloc.'],
          ['Poste 6 (Libéro)', 'Se décale nettement vers la gauche, défend au centre-gauche.'],
          ['Poste 1', 'Recule en fond de terrain, défend la diagonale longue.'],
        ].map(([l, t], i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
            <span style={S.bulletOrange}>▸</span>
            <span>
              <strong style={{ color: 'var(--ink)' }}>{l} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{t}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Zone3Tab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Court>
        <Ball x={50} y={19} />
        <Zone x={0} y={25} w={33} h={75} type="arriere" posNumber={5} />
        <Zone x={33} y={52} w={34} h={48} type="libero" posNumber={6} />
        <Zone x={67} y={25} w={33} h={75} type="arriere" posNumber={1} />
        <ZoneLabel x={10} y={70} label="Zone 5" type="arriere" />
        <ZoneLabel x={45} y={73} label="Zone 6" type="libero" />
        <ZoneLabel x={78} y={70} label="Zone 1" type="arriere" />
        <Player x={35} y={29.5} label="4" sub="BLK" type="avant" />
        <Player x={50} y={29.5} label="3" sub="BLK" type="avant" />
        <Player x={65} y={29.5} label="2" sub="BLK" type="avant" />
        <Player x={20} y={70} label="5" type="arriere" />
        <Player x={50} y={70} label="6" sub="LIB" type="libero" />
        <Player x={80} y={70} label="1" type="arriere" />
      </Court>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          ['Postes 4, 3 et 2', 'Triple bloc au centre.'],
          ['Postes 5 et 1', 'Reculent profondément dans les angles.'],
          ['Poste 6 (Libéro)', 'Se positionne au centre, prêt à réagir dans toutes les directions.'],
        ].map(([l, t], i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
            <span style={S.bulletOrange}>▸</span>
            <span>
              <strong style={{ color: 'var(--ink)' }}>{l} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{t}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Zone2Tab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Court>
        <Ball x={85} y={19} />
        <Zone x={0} y={43} w={42} h={57} type="arriere" posNumber={5} />
        <Zone x={40} y={34} w={35} h={48} type="libero" posNumber={6} />
        <Zone x={72} y={25} w={28} h={42} type="arriere" posNumber={1} />
        <Zone x={0} y={25} w={30} h={36} type="avant" posNumber={4} />
        <ZoneLabel x={16} y={70} label="Zone 5" type="arriere" />
        <ZoneLabel x={55} y={52} label="Zone 6" type="libero" />
        <ZoneLabel x={80} y={40} label="Zone 1" type="arriere" />
        <ZoneLabel x={7} y={40} label="Zone 4" type="avant" />
        <Player x={60} y={29.5} label="3" sub="BLK" type="avant" />
        <Player x={80} y={29.5} label="2" sub="BLK" type="avant" />
        <Player x={15} y={62.5} label="4" sub="DÉF" type="avant" />
        <Player x={15} y={77.5} label="5" type="arriere" />
        <Player x={62} y={62.5} label="6" sub="LIB" type="libero" />
        <Player x={85} y={62.5} label="1" type="arriere" />
      </Court>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          ['Postes 3 et 2', 'Bloquent au filet, ferment la diagonale.'],
          ['Poste 4', 'Recule et défend la ligne gauche (off-blocker).'],
          ['Poste 1', 'Avance légèrement, défend les balles courtes derrière le bloc.'],
          ['Poste 6 (Libéro)', 'Se décale nettement vers la droite.'],
          ['Poste 5', 'Recule en fond de terrain, défend la diagonale longue.'],
        ].map(([l, t], i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
            <span style={S.bulletOrange}>▸</span>
            <span>
              <strong style={{ color: 'var(--ink)' }}>{l} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{t}</span>
            </span>
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

export default function GuidePositionnement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSize = (parseInt(searchParams.get('size') ?? '6') as TeamSize);
  const initialConfig = searchParams.get('config') ?? CONFIGURATIONS[initialSize][0].id;

  const [teamSize, setTeamSize] = useState<TeamSize>([4, 5, 6].includes(initialSize) ? initialSize : 6);
  const [configId, setConfigId] = useState<string>(initialConfig);
  const [zone, setZone] = useState<ZoneTab>('zone4');

  const configurations = CONFIGURATIONS[teamSize];
  const configuration = configurations.find(c => c.id === configId) ?? configurations[0];

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
      return <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>Diagramme non disponible pour cette configuration.</div>;
    }
    return <DataDrivenDefense layout={layouts[zone]} />;
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
            {([6, 5, 4] as const).map(size => (
              <button key={size} onClick={() => changeTeamSize(size)} style={teamSize === size ? btnActive : btnBase}>
                {size}v{size}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Configuration tactique</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {configurations.map(c => (
              <button key={c.id} onClick={() => setConfigId(c.id)} style={configId === c.id ? btnActive : btnBase}>
                {c.shortName}
              </button>
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
          <div style={{
            position: 'relative', width: '100%', maxWidth: 440, margin: '0 auto',
            background: 'var(--paper)', border: '2.5px solid var(--ink)',
            aspectRatio: '1 / 1.1',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--orange)', zIndex: 5 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, borderTop: '1px dashed var(--ink)', opacity: 0.2, top: '33%' }} />
            {configuration.positions.filter(p => p.zoneId !== 'L').map(p => (
              <div
                key={p.zoneId}
                style={{
                  position: 'absolute',
                  left: `${p.court.x}%`, top: `${p.court.y}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}
              >
                <span style={{
                  width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Bungee", sans-serif', fontSize: 13,
                  color: ROLE_COLORS[p.zoneId] === '#f0c84c' ? '#1a1812' : '#ffffff',
                  backgroundColor: ROLE_COLORS[p.zoneId],
                  border: '2.5px solid rgba(26,24,18,0.5)',
                  borderRadius: '50%',
                  boxShadow: '2px 2px 0 rgba(26,24,18,0.35)',
                }}>
                  {p.zoneId}
                </span>
                <span style={{ marginTop: 3, fontFamily: '"DM Mono", monospace', fontSize: 9, textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, whiteSpace: 'nowrap' }}>{p.name}</span>
              </div>
            ))}
            <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', fontFamily: '"DM Mono", monospace', fontSize: 9, fontWeight: 700, color: 'var(--ink)', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>Notre côté</div>
            <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', fontFamily: '"DM Mono", monospace', fontSize: 9, color: 'var(--ink)', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>Adversaires</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link
              to={`/positions?size=${teamSize}&config=${configuration.id}`}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
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

      {/* 6. Erreurs courantes */}
      <section>
        <h2 style={S.section}>6. Erreurs courantes à éviter</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['Rester au milieu du terrain', "Beaucoup de débutants restent à 4–5m du filet, dans «no man's land». C'est la zone où vous ne pouvez défendre ni les balles courtes ni les balles longues. Choisissez : avancé OU reculé !"],
            ['Ne pas regarder le bloc', 'La position du bloc détermine où la balle peut passer. Si le bloc ferme bien la ligne, défendez plus la diagonale.'],
            ['Ne pas bouger après le service', "Votre position de service n'est JAMAIS votre position de défense. Dès que le service part, repositionnez-vous selon l'attaque adverse."],
            ['Défendre la même zone que votre coéquipier', 'Communiquez ! Si deux joueurs vont au même endroit, un espace se crée ailleurs.'],
          ].map(([label, text], i) => (
            <div key={i} style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 16, paddingTop: 6, paddingBottom: 6, fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
            </div>
          ))}
        </div>
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

      {/* 9. Systèmes défensifs */}
      <section>
        <h2 style={S.section}>9. Systèmes défensifs : avancé vs reculé</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Il existe deux philosophies défensives principales. Ton équipe peut choisir de jouer avec une défense avancée ou reculée.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={{ ...S.card, border: '2.5px solid var(--orange)' }}>
            <div style={{ ...S.label, textAlign: 'center', marginBottom: 8 }}>Défense avancée</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.55, marginBottom: 10 }}>Principe : les arrières se positionnent à 3–4m du filet</div>
            <div style={S.labelTeal}>Avantages</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 10px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {['Excellente contre les feintes', 'Récupère les balles molles', 'Couvre bien les amorties', 'Transition rapide attaque-défense'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </li>
              ))}
            </ul>
            <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>Inconvénients</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {['Vulnérable aux smashes puissants', 'Diagonales longues difficiles', 'Nécessite des blocs solides'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.55 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.1em', textAlign: 'center', color: 'var(--ink)', marginBottom: 8 }}>Défense reculée</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.55, marginBottom: 10 }}>Principe : les arrières se positionnent à 6–7m du filet</div>
            <div style={S.labelTeal}>Avantages</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 10px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {['Excellente contre les smashes puissants', 'Plus de temps de réaction', 'Couvre toute la profondeur', 'Diagonales bien défendues'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </li>
              ))}
            </ul>
            <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>Inconvénients</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {['Vulnérable aux feintes courtes', 'Zone morte derrière le bloc', 'Difficile de remonter les amorties'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.55 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Niveau avancé : </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>Les meilleures équipes utilisent une défense mixte — le joueur du même côté que l'attaque avance (3–4m), tandis que les deux autres reculent (6–7m).</span>
        </div>
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
