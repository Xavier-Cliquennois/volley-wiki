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
      Z('P1', 65, 40, 35, 60, 'Z1 kısa'),
      Z('P5', 0, 43, 50, 57, 'Uzun çapraz'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Rakip Z4 saldırısı (onların sol kanadı) → top bizim sağ tarafımıza geliyor.',
      '2-1-2 sistemi: 2 kişilik blok (P2 paralel + P3 çapraz) + 2 derin savunmacı.',
      'P4 (smaçör) off-blocker olarak fileden 2-2,5 m, yan çizgiden 1 m mesafede — plase ve kesik vuruşları kapatır.',
      'P5 (~7-7,5 m, sol çizgiden 0,5 m) uzun çaprazı savunur.',
      'P1 (~7-7,5 m, sağ çizgiden 0,5 m) derin paraleli, blok gölgesinde savunur.',
      'Birincil savunulan vuruş: uzun çapraz (istatistiksel olarak en sık görülen yörünge).',
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
      Z('P5', 0, 40, 50, 60, 'Sol çapraz'),
      Z('P1', 50, 40, 50, 60, 'Sağ çapraz'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 82 }],
    notes: [
      'Merkezden hızlı saldırı (Z3) — kısa açılar, az reaksiyon süresi.',
      '1 kişilik blok: P3 (orta oyuncu) okuma yapar, commitment mümkün değil.',
      'P4 ve P2 (off-blocker) hücum çizgisinde fileden 2 m — sekmeleri kapatır.',
      'P5 ve P1 1 m önde (~fileden 7 m) — açılar yüksek toplardan daha kısadır.',
      'Zayıflık: özel bir derin merkez savunmacı yok (5v5\'te yalnızca 2 arka oyuncu).',
      'Anahtar kural: "temas anında durmuş" — saldırı anında herkes durmuş ve dengeli olmalı.',
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
      Z('P5', 0, 40, 35, 60, 'Z5 kısa'),
      Z('P1', 50, 43, 50, 57, 'Uzun çapraz'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Rakip Z2 saldırısı (onların sağ kanadı) → top bizim soldan geliyor. Z4\'ün tam aynası.',
      '2 kişilik blok: P4 (dış paralel) + P3 (orta çapraz).',
      'P2 (pasör çaprazı / pasör) off-blocker olarak fileden 2-2,5 m, sağ tarafta.',
      'P1 (~7-7,5 m, sağ çizgiden 1 m) uzun çaprazı savunur.',
      'P5 (~7-7,5 m, sol çizgiden 0,5 m) derin paraleli blok gölgesinde savunur.',
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
      Z('P1', 65, 40, 35, 60, 'Z1 kısa'),
      Z('P5', 0, 43, 50, 57, 'Uzun çapraz'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 35, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      'Rakip Z4 saldırısı → top bizim sağ tarafımıza geliyor.',
      '3F-2B dizilişi: 3 ön sıra → avantajlı 2 kişilik blok (P3 + pasör-blokçu P2).',
      'P4 (smaçör) hücum çizgisinde sol tarafta kısa off-blocker (fileden ~2-2,5 m).',
      'P5 uzun çaprazı savunur (~7 m, sol çizgiden 0,5 m).',
      'P1 derin sağ paraleli blok gölgesinde savunur (~7 m, sağ çizgiden 0,5 m).',
      'Dezavantaj: yalnızca 2 arka savunmacı → savunmacı başına 30+ m² (6v6\'da 20 m²\'ye karşı).',
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
      Z('P5', 0, 40, 50, 60, 'Sol çapraz'),
      Z('P1', 50, 40, 50, 60, 'Sağ çapraz'),
    ],
    mainShot: { toX: 50, toY: 82 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 75, toY: 70 }],
    notes: [
      'Merkezden hızlı saldırı (Z3) — kısa açılar.',
      '3 ön sıra ile 3 kişilik blok mümkün ancak yalnızca 2 saha savunmacısı kalır — önerilmez.',
      'Önerilen: 2 kişilik blok (P3 + smaç hattına en yakın kanat).',
      'P5 ve P1 1 m önde (~7 m) çünkü hızlı toplarda açılar daha kısadır.',
      'Zayıflık: derin eksen topu açıkta (5v5 3F-2B\'de Z6 savunmacısı yok).',
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
      Z('P5', 0, 43, 35, 57, 'Z5 kısa'),
      Z('P1', 50, 43, 50, 57, 'Uzun çapraz'),
      Z('P2', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      'Rakip Z2 saldırısı → top bizim sol tarafımıza geliyor. Z4\'ün tam aynası.',
      '2 kişilik blok: P4 (dış paralel) + P3 (orta çapraz).',
      'Pasör (P2) off-blocker olarak fileden 2-2,5 m, sağ tarafta (plase önleme + hızlı pas hedefine geçiş).',
      'P1 uzun çaprazı savunur (~7-7,5 m).',
      'P5 derin sol paraleli blok gölgesinde savunur.',
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
      Z('P2', 65, 34, 35, 66, 'Kısa paralel'),
      Z('P4', 0, 25, 35, 45, 'Sol çapraz'),
      Z('P1', 25, 62.5, 45, 37.5, 'Derin'),
    ],
    mainShot: { toX: 20, toY: 55 },
    altShots: [{ toX: 82, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 70, toY: 47.5 }],
    notes: [
      'Rakip Z4 saldırısı → top bizim sağ tarafımıza geliyor.',
      'Elmas dizilişi (1-2-1) → A sistemi: 1 blokçu (P3) + 3 savunmacı.',
      'P3 sağ tarafta tek başına bloka çıkar (rakip smaçörün karşısında).',
      'P2 (ön sağ) 3 m çizgisine, fileden 3,5-4 m geri çekilir — blok arkasındaki plase ve aldatmacaları kapatır.',
      'P4 (ön sol) sahanın ortasına, sola düşer — kısa çaprazı kapatır.',
      'P1 (tek arka savunmacı) uzun çaprazı kapatır (~7-7,5 m, sağ çizgiden 1 m).',
      'Anticipasyon = 1 numaralı yetenek: yalnızca 1 arka savunmacı → kapatılacak ~40 m².',
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
      Z('P4', 0, 32.5, 35, 52.5, 'Sol çapraz'),
      Z('P2', 65, 32.5, 35, 52.5, 'Sağ çapraz'),
      Z('P1', 30, 62.5, 45, 37.5, 'Derin'),
    ],
    mainShot: { toX: 50, toY: 77.5 },
    altShots: [{ toX: 18, toY: 55 }, { toX: 80, toY: 55 }],
    notes: [
      'Merkezden hızlı saldırı (Z3) — 4v4\'te en zor dizilim: az süre, yalnızca 1 blokçu.',
      '1 kişilik blok (P3 tek başına) sürekli READ modunda (commitment mümkün değil).',
      'P4 ve P2 sahanın ortasına geri çekilir (fileden ~3,5-4 m, iki kısa çaprazı da kapatır).',
      'Tek arka savunmacı P1 Z6 savunmacısı gibi davranır (merkez ekseni, fileden 7-8 m).',
      'Birincil vuruş: güçlü eksen topu (P1\'e doğru) çünkü 1 kişilik blok yalnızca merkezi kapatır.',
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
      Z('P4', 0, 34, 35, 66, 'Kısa paralel'),
      Z('P2', 60, 25, 40, 45, 'Sağ çapraz'),
      Z('P1', 30, 62.5, 45, 37.5, 'Derin'),
    ],
    mainShot: { toX: 80, toY: 55 },
    altShots: [{ toX: 18, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 30, toY: 55 }],
    notes: [
      'Rakip Z2 saldırısı → top bizim sol tarafımıza geliyor. Z4\'ün tam aynası.',
      'A sistemi: 1 blokçu (P3) + 3 savunmacı.',
      'P4 (ön sol) 3 m çizgisine, fileden 3,5-4 m geri çekilir — soldaki plase ve aldatmacaları kapatır.',
      'P2 (ön sağ) sahanın ortasına, sağa düşer — kısa çaprazı kapatır.',
      'Tek arka savunmacı P1 uzun çaprazı savunur (~7-7,5 m, sol çizgiden 1 m).',
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
      Z('P1', 65, 43, 35, 57, 'Kısa çapraz'),
      Z('P5', 0, 43, 50, 57, 'Uzun çapraz'),
      Z('P4', 0, 25, 35, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 22, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Rakip Z4 saldırısı → top bizim sağ tarafımıza geliyor.',
      'Kare dizilişi (2-2 / box) → A sistemi: 1 blokçu (P2) + 3 savunmacı.',
      'P2 (ön sağ) rakip smaçöre karşı tek başına blok, paraleli alır.',
      'P4 (ön sol) off-blocker, fileden 2-2,5 m — solda plase ve kesik vuruşu kapatır.',
      'P5 uzun çaprazı savunur (~7 m, sol çizgiden 0,5 m).',
      'P1 derin paraleli / kısa çaprazı savunur (~7 m, blok gölgesinde).',
      'B sistemi (2 kişilik blok P2+P4) mümkün ancak yalnızca 2 savunmacı bırakır — büyük smaçörlere saklayın.',
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
      Z('P5', 0, 40, 50, 60, 'Sol çapraz'),
      Z('P1', 50, 40, 50, 60, 'Sağ çapraz'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 47.5 }],
    notes: [
      'Merkezden hızlı saldırı (Z3) — kısa açılar, az süre.',
      '2 kişilik blok (P4 + P2) merkezi kapatır — arkada 2 savunmacılı B sistemi.',
      'P5 ve P1 kısa çaprazları alır (~7 m, yan çizgilerden 0,5-1 m).',
      'Büyük zayıflık: blok arkasında kısa örtü yok, karenin orta saha oyuncusu yok.',
      'Alternatif: 1 kişilik blok (P3 benzeri rol, burada P4 veya P2 tek başına) bir plase savunmacısı serbest bırakmak için.',
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
      Z('P5', 0, 43, 35, 57, 'Kısa çapraz'),
      Z('P1', 50, 43, 50, 57, 'Uzun çapraz'),
      Z('P2', 60, 25, 40, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 78, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      'Rakip Z2 saldırısı → top bizim sol tarafımıza geliyor. Z4\'ün tam aynası.',
      'A sistemi: 1 blokçu (P4) + 3 savunmacı.',
      'P4 (ön sol) rakip smaçöre karşı tek başına blok, paraleli alır.',
      'P2 (pasör-smaçör ön sağ) off-blocker, fileden 2-2,5 m — plase önleme + hızlı pas hedefine geçiş.',
      'P1 uzun çaprazı savunur (~7 m, sağ çizgiden 0,5 m).',
      'P5 kısa derin paraleli savunur (~7 m, blok gölgesinde).',
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
      Z('P1', 65, 40, 35, 60, 'Sağ paralel'),
      Z('P6', 33, 52, 34, 48, 'Eksen'),
      Z('P5', 0, 43, 35, 57, 'Sol çapraz'),
      Z('P4', 0, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 25, toY: 75 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 70 }, { toX: 18, toY: 40 }],
    notes: [
      'Rakip Z4 saldırısı → top bizim sağa geliyor.',
      '2F-3B dizilişi (P4+P3 ön sıra, P5+P6+P1 arka sıra, P1 penetre eden): 1 kişilik blok.',
      'P3 (orta oyuncu) sağda tek başına blok — 2 kişilik blok için P2 yok.',
      'P4 (smaçör) off-blocker, fileden 2-2,5 m solda.',
      '3 derin savunmacı: P5 uzun çapraz, P6 merkez ekseni (~7-8 m), P1 sağ paralel.',
      '1-1-3 sistemi (1 blokçu + 1 off-blocker + 3 savunmacı) 6v6 çevresel savunmasına en yakın savunmadır.',
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
      Z('P5', 0, 40, 33, 60, 'Sol çapraz'),
      Z('P6', 33, 52, 34, 48, 'Eksen'),
      Z('P1', 67, 40, 33, 60, 'Sağ çapraz'),
    ],
    mainShot: { toX: 50, toY: 75 },
    altShots: [{ toX: 22, toY: 65 }, { toX: 78, toY: 65 }],
    notes: [
      'Merkezden hızlı saldırı (Z3) — kısa açılar.',
      '1 kişilik blok (P3) okumada — 2F-3B\'de hızlı saldırı en zor hedeftir.',
      'P4 sahanın ortasında yan tarafa kayar (fileden ~2 m) sekmeler için.',
      'Avantaj: 3 derin savunmacı (P5, P6, P1) 3 ana arka bölgeyi kapatır.',
      'P6 orta smaçörün karşısında smaç hattında (~7,5-8 m, eksen).',
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
      Z('P5', 0, 40, 35, 60, 'Sol paralel'),
      Z('P6', 33, 52, 34, 48, 'Eksen'),
      Z('P1', 65, 43, 35, 57, 'Sağ çapraz'),
      Z('P3', 70, 25, 30, 33, 'Off-blk'),
    ],
    mainShot: { toX: 75, toY: 75 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 70 }, { toX: 80, toY: 40 }],
    notes: [
      'Rakip Z2 saldırısı → top bizim sola geliyor. Z4\'ün aynası.',
      '1 kişilik blok: P4 solda tek başına blok yapar (2F-3B\'de P2 yok).',
      'P3 (orta oyuncu) sağda off-blocker olur, fileden 2-2,5 m.',
      'P5 derin sol paraleli, P6 ekseni, P1 uzun çaprazı savunur.',
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
      { posNumber: 'P5', x: 0, y: 43, w: 50, h: 57, label: 'Uzun çapraz', labelPos: { x: 18, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Blok gölgesi', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 62, y: 34, w: 38, h: 42, label: 'Paralel', labelPos: { x: 70, y: 40 } },
      { posNumber: 'P4', x: 0, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 4, y: 33 } },
    ],
    mainShot: { toX: 22, toY: 77.5 },
    altShots: [
      { toX: 78, toY: 47.5 },
      { toX: 45, toY: 62.5 },
      { toX: 15, toY: 40 },
    ],
    notes: [
      { label: 'Pozisyon 2 (pasör çaprazı / OPP)', text: 'Paralel blokçu — bloklar, sağ tarafta fileye çıkar.' },
      { label: 'Pozisyon 3 (orta blokçu)', text: 'Pasör çaprazıyla 2 kişilik blokta çaprazı kapatır.' },
      { label: 'Pozisyon 4 (smaçör off-blocker)', text: 'Sol tarafta 3 m çizgisine düşer — kısa kesik vuruşu (keskin çapraz) ve aldatmacaları kapatır.' },
      { label: 'Pozisyon 5 (Libero)', text: 'Fileden ~7-8 m uzakta, orta blokçunun iç omuzunda uzun çaprazı savunur.' },
      { label: 'Pozisyon 6 (arka orta)', text: 'Bloku aşan yüksek toplar, uzun blok dokunuşları, eksen ~8-8,5 m.' },
      { label: 'Pozisyon 1 (arka sağ)', text: 'Derin paraleli blok gölgesinde savunur, fileden ~7-7,5 m, sağ çizgiden 0,5 m.' },
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
      { posNumber: 'P5', x: 0, y: 34, w: 36, h: 66, label: 'Sol çapraz', labelPos: { x: 10, y: 70 } },
      { posNumber: 'P6', x: 32, y: 52, w: 36, h: 48, label: 'Eksen', labelPos: { x: 42, y: 73 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 64, y: 34, w: 36, h: 66, label: 'Sağ çapraz', labelPos: { x: 75, y: 70 } },
      { posNumber: 'P4', x: 0, y: 25, w: 28, h: 28, label: 'Örtü', labelPos: { x: 4, y: 36 } },
      { posNumber: 'P2', x: 72, y: 25, w: 28, h: 28, label: 'Örtü', labelPos: { x: 78, y: 36 } },
    ],
    mainShot: { toX: 75, toY: 65 },
    altShots: [
      { toX: 25, toY: 65 },
      { toX: 50, toY: 80 },
    ],
    notes: [
      { label: 'Pozisyon 3 (orta blokçu)', text: 'Rakip izlemesine göre 1 kişilik okuma bloğu (read) veya commitment.' },
      { label: 'Pozisyonlar 4 ve 2 (smaçörler)', text: 'Hücum çizgisinde (fileden ~2-2,5 m, yan çizgilerden 0,5 m): blok sekmelerini ve bloktan geçen topları kapatırlar.' },
      { label: 'Pozisyon 5 (Libero)', text: 'Orta smaçörün karşısında, smaç hattında (fileden ~7-8 m).' },
      { label: 'Pozisyon 6 (arka orta)', text: 'Omuzlar smaçöre dönük; bloktan geçen güçlü topu savunur (eksen ~8-8,5 m).' },
      { label: 'Pozisyon 1 (arka sağ)', text: 'Bir metre öne adım atar (fileden ~7,5 m, sağ çizgiden 1 m): hızlı toplarda açılar daha kısadır.' },
      { label: 'Anahtar kural', text: '"Temas anında durmuş": herkes vuruş anında durmuş ve dengeli olmalıdır.' },
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
      { posNumber: 'P1', x: 50, y: 43, w: 50, h: 57, label: 'Uzun çapraz', labelPos: { x: 68, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'Blok gölgesi', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P5', x: 0, y: 34, w: 38, h: 42, label: 'Paralel', labelPos: { x: 10, y: 40 } },
      { posNumber: 'P2', x: 70, y: 25, w: 30, h: 36, label: 'Off-blocker', labelPos: { x: 76, y: 33 } },
    ],
    mainShot: { toX: 78, toY: 77.5 },
    altShots: [
      { toX: 22, toY: 47.5 },
      { toX: 55, toY: 62.5 },
      { toX: 85, toY: 40 },
    ],
    notes: [
      { label: 'Pozisyon 4 (smaçör)', text: 'Paralel blokçu — sol tarafta filede blok yapar.' },
      { label: 'Pozisyon 3 (orta blokçu)', text: 'Smaçörle 2 kişilik blokta çaprazı kapatır.' },
      { label: 'Pozisyon 2 (pasör çaprazı / OPP)', text: 'Sağda off-blocker olur — 3 m çizgisine düşer, kısa kesik vuruş ve aldatmacaları kapatır.' },
      { label: 'Pozisyon 5 (Libero)', text: 'Derin paraleli blok gölgesinde savunur, fileden ~7-7,5 m, sol çizgiden 0,5 m.' },
      { label: 'Pozisyon 6 (arka orta)', text: 'Bloku aşan yüksek toplar, eksen fileden ~8-8,5 m.' },
      { label: 'Pozisyon 1 (pasör veya smaçör/OPP)', text: 'Uzun çaprazı savunur, fileden ~7-8 m.' },
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
  { title: 'Fileden uzak smaçör', action: 'ÖNE ÇIK', accentColor: 'var(--orange)',
    points: ['Pas fileden 2-3 m uzakta', 'Sert smaç yapamazlar', 'Yüksek aldatmaca veya yumuşak vuruş riski', '1-2 metre öne çıkın'] },
  { title: 'Fileye yakın smaçör', action: 'GERİ ÇEKİL', accentColor: 'var(--plum)',
    points: ['Pas fileden 1 m\'den az', 'Tam güçle smaç yapabilir', 'Hızlı aşağı doğru yörünge', 'Mümkün olduğunca geri çekilin'] },
  { title: 'Smaçörün omzu', action: 'Vuruş omzunu izleyin', accentColor: 'var(--teal)',
    points: ['Yüksek omuz geri çekilmiş = güçlü smaç', 'Düşük omuz = muhtemel aldatmaca', 'Omuz rotasyonu = top yönü', '0,5 saniyede ayarlayın'] },
  { title: 'Smaçörün yaklaşması', action: 'Yaklaşma koşusunu izleyin', accentColor: 'var(--ink)',
    points: ['Uzun, hızlı yaklaşma = sert smaç', 'Kısa yaklaşma veya durma = aldatmaca', 'Yaklaşma açısı = hedef bölge', 'Gücü öngörün'] },
];

const COMMANDEMENTS = [
  ['Pasörü izle', 'Sonra smaçörü, topu değil'],
  ['Aynı taraf = Öne çık', 'Karşı taraf = Geri çekil'],
  ['Kötü rakip pası', '→ 1-2 m öne çık (aldatmaca olası)'],
  ['Asla ortada kalma', 'Seç: öne VEYA geriye'],
  ['HER ZAMAN iletişim kur', 'Aldığın her topta "Bende!"'],
  ['Servis sonrası hareket et', 'Servis pozisyonu ≠ savunma pozisyonu'],
  ['Omzu oku', 'Yüksek omuz = smaç, düşük = aldatmaca'],
  ['Alçak duruş', 'Dizler bükülü, kollar hazır'],
  ['Hızlı geçişler', 'Sıfırlamak için en fazla 3 saniye'],
  ['Bölgeni savun', 'Her oyuncunun bir sorumluluğu var'],
];

type MistakesSection = {
  title: string;
  intro: string;
  mistakes: [string, string][];
};

const MISTAKES_BY_SIZE: Record<TeamSize, MistakesSection> = {
  6: {
    title: 'On yaygın savunma pozisyonu hatası',
    intro: 'Mike Hebert (Thinking Volleyball), John Forman (CoachingVB), USA Volleyball ve FIVB Top Volley kılavuzundan derlenen tipoloji.',
    mistakes: [
      ['1. Blok gölgesine kayma', 'Savunmacılar kendilerini blok gölgesi çevresinde konumlandırmak yerine içgüdüsel olarak blokçuların arkasına sığınır — çaprazları ve "off the block" yörüngelerini açık bırakır. Hebert: "blok gölgesine sızma".'],
      ['2. Hatalı okuma', 'Savunmacı "top → pasör → top → smaçör" sırasını takip etmek yerine topa bakar. Sonuç: okumak yerine tahmin eder ve temas anında durmuş ve dengeli değildir ("temas anında durmuş ve dengeli").'],
      ['3. Liberonun derinlikte yanlış yerleşmesi', 'Fileye çok yakın olduğunda derin smaçları savunamaz; çok geride olduğunda plaseleri kapatamaz. Kural: dış omzunu orta blokçunun iç omzuyla hizalayın, bloka göre fileden 6-8 m.'],
      ['4. Pasör-savunmacının kötü hazırlanması', 'Topu + rakip sahayı görmesini engelleyen çok alçak veya kötü yönelmiş duruş; hedefe erken kaçış Z1\'de boşluk yaratır; savunmadan çıktığını bildiren "release call" yok.'],
      ['5. Pozisyon hataları (overlap)', 'En yaygın olanı: Z6 Z3\'ün önüne kayar, Z5 Z6\'dan daha sağda olur ve pasör penetre etmek için pozisyonunu çok erken terk eder (5-1\'de 1 numaralı hata). Servis anında tüm ayaklar ön/arka ve sol/sağ ilişkilerine uymalıdır (Kural 7.4).'],
      ['6. Karşılama → savunma geçişinin unutulması', 'Oyuncular rakip pasör topa dokunur dokunmaz savunma temel pozisyonuna geçmek yerine W karşılama dizilişinde donmuş kalır. Hebert: "topa müdahaleden sonra yavaş toparlanma".'],
      ['7. 6. bölgenin kötü yönetilmesi', '"6-up" (rotasyon), "6-back" (çevresel) ve "6-deep" arasındaki karışıklık. Z6 oyuncusu merkezi kalmak yerine rakip saldırı tarafına göre yana kaymalıdır. Karşılamak için geriye yaslanmak ("leaning back") ağırlığı topuklara koyar ve reaktiviteyi öldürür.'],
      ['8. Merkez hızlı saldırıda başarısız savunma', 'Rakip orta blokçuyu çok geç okumak; arka sıra öne adım atmamış (hızlı toplarda Z1 ve Z5 bir metre öne adım atmalı çünkü açılar daha kısadır); mevcut süreyi boşa harcayan "false stepping" (ilk adımın geriye olması).'],
      ['9. Sahipsiz plase örtüsü', 'Aldatmacaya açıkça atanmış bir savunmacı yok; "plaselere kalkma" — savunmacı smaç için alçaktadır, sonra ayağa kalkıp plase için uzanır, topun tam önünde düşmesine izin verir. Odak, plaseye sıçramaya izin veren alçak duruşta smaçta kalmalıdır.'],
      ['10. Kolektif sessizlik', '"plase!", "paralel!", "out!", "bende!" çağrıları yok; blokçular paralel veya çapraz yönelimlerini iletmiyor; servisten önce overlapları kontrol edecek bir rotasyon kaptanı yok.'],
    ],
  },
  5: {
    title: '5v5\'te yaygın hatalar',
    intro: '5v5 formatına özgü hatalar (Volleyball Canada, VolleyballXL ve 6v6 doktrininden uyarlamalar).',
    mistakes: [
      ['1. 6v6\'yı mekanik olarak tekrarlamak', '3 derin bölgeyi 3 savunmacıyla kapatmak işe yarar (2F-3B dizilişi), ancak geri çekilen off-blocker eksiktir — kimse açıkça atanmadıysa 3 m bölgesi kapatılmaz.'],
      ['2. Ön sıra off-blocker\'ın fileye yapışık kalması', 'Blok temasından sonra ön sıra off-blocker plaseleri kapatmak için 2-2,5 m geri çekilmelidir. Filede kalırsa, blok arkası bölge tamamen açıktır.'],
      ['3. 2 savunmacının yan yana durması', '3F-2B dizilişinde 2 derin savunmacı aralıklı olmalı (biri solda, biri sağda) ve birlikte merkezde değil. Aksi takdirde yan çizgiler savunmasız kalır.'],
      ['4. Pasörün çok erken kaçması (penetre eden diziliş)', 'P1\'den penetre eden pasörlü 2F-3B dizilişinde, hedefe koşmadan önce topun savunulmasını beklemelidir — aksi takdirde Z1\'de bir boşluk açılır.'],
      ['5. Ön/arka karışıklığı', '5 oyuncu ile ön sıranın 3 m çizgisinde kalarak kendi tarafını savunmasına izin verme dürtüsü güçlüdür — ancak bu derin sahayı açık bırakır. Ön sıra bloka çıkar, arka sıra derinde savunur.'],
      ['6. Hatalı okuma', 'Bir oyuncunun eksik olması 6v6\'ya göre daha erken okuma gerektirir. "Top → pasör → top → smaçör" sırası + temas anında dengeli duruş.'],
    ],
  },
  4: {
    title: '4v4\'te yaygın hatalar',
    intro: 'Salon 4v4\'e özgü hatalar (üniversite intramuralleri, FFVb / Volleyball Canada doktrini, plaj 4v4).',
    mistakes: [
      ['1. Plase örtüsü olmayan izole blokçu', '3 savunmacının tümü derine gider, 3-5 m bölgesini boş bırakır. Birisinin fileden 3,5-4 m\'de her zaman plaseye atanmış olması gerekir.'],
      ['2. Düz hatta 2 savunmacı', 'Aynı derinlikte yan yana → kesik vuruş aralarına düşer. 4v4\'te savunmacılar her zaman kaydırılmış (biri yakın, biri uzak) veya yanal olarak yayılmış olmalıdır.'],
      ['3. Top savunulmadan pasörün hedefe kaçması', 'Savunmada boşluk bırakan erken geçiş. Pasör hedefe gitmeden önce topun kurtarıldığının onaylanmasını bekler.'],
      ['4. Blokçu ve savunmacılar arasında işaret yok', 'Blokçu saldırı başlamadan önce MUTLAKA "paralel" veya "çapraz" işaret etmelidir. Bu olmadan 3 savunmacı neyi kapatacağını bilmez — herkes doğaçlama yapar.'],
      ['5. Plase savunmacısının fileden çok uzak olması', 'Diğer arka savunmacılarla geri çekilir ve artık kısa aldatmacaları kapatamaz. Pozisyonu fileden 3,5-4 m, eksen — 7 m değil.'],
      ['6. "Rastgele" yanlış oyuncuyu bloklamak', '4v4\'te kötü yerleşmiş bir oyuncuyla blok yapmak (smaçörden uzak) rakibi 3 hizasız savunmacıyla karşı karşıya bırakır. Blokçu birincil smaçörün karşısında olan kişi olmalıdır.'],
      ['7. Hatalı okuma', 'Savunmacı başına ~40 m² ile (6v6\'da 20 m²\'ye karşı), bir okuma hatası telafi edilemez. Anticipasyon = 4v4\'te 1 numaralı yetenek.'],
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
    title: 'Üç ana savunma sistemi (FIVB / USAV)',
    warning: {
      label: '⚠ Terminolojik uyarı',
      text: 'Fransa\'da sıkça duyulan "W savunması" ifadesi yanlıştır. "W-formation" tarihsel olarak 5 oyuncu servis karşılama dizilişini ifade eder — savunma sistemi değil. Uluslararası doktrin (FIVB, USAV IMPACT, Liskevych, Stone) üç sistem ayırt eder: man-up (2-1-3), çevresel (2-0-4) ve rotasyon (3-2-1).',
    },
    systems: [
      {
        name: 'Man-up savunması (2-1-3)',
        tag: 'Eski adıyla "W savunması" / kırmızı savunma',
        principe: 'Bir savunmacı, plaseleri ve yumuşak vuruşları yakalamak için blokun arkasında 3 m çizgisine çıkar. Filede iki blokçu, off-blocker geri çekilir ve üç derin oyuncu uzun açıları kapatır.',
        forces: ['Plaselerin, yumuşak vuruşların ve blok arkasındaki "junk" topların olağanüstü örtüsü', 'Öne çıkan oyuncu pasör ise hızlı saldırıya geçiş', 'Genç takımlara öğretmesi kolay'],
        faiblesses: ['Yalnızca 3 derin savunmacı — güçlü, dar çapraz smaçlara karşı savunmasız', 'Blokçular arasında sert vuran bir smaçör kolayca geçer'],
        indication: 'Genç takımlar, okul ligi, çok plase veya off-speed vuruş yapan taktiksel rakipler.',
        accent: 'var(--orange)',
      },
      {
        name: 'Çevresel savunma (2-0-4)',
        tag: 'Beyaz savunma — elit erkek seviyesinde baskın sistem',
        principe: 'Dört arka savunmacı fileye doğru açılan bir U oluşturur, neredeyse yan ve dip çizgilerin üzerinde — "ayak çizgide" (Liskevych). Sahanın orta kısmı kasıtlı olarak terk edilir.',
        forces: ['Güçlü smaçların, paralellerin ve derin köşelerin mükemmel örtüsü', 'Basit kolektif hareket', 'Modern uluslararası erkek voleybolunda baskın sistem'],
        faiblesses: ['Blok arkasındaki kısa plaselere karşı çok savunmasız — 3 ile 5 m arasındaki merkez bölge açık', 'İleri dalış yapabilen atletik savunmacılar gerektirir'],
        indication: 'Büyükler, erkekler, uluslararası seviye, güçlü rakipler.',
        accent: 'var(--teal)',
      },
      {
        name: 'Rotasyon savunması / slide savunması (3-2-1)',
        tag: 'Rotational / slide savunma',
        principe: 'Üç arka savunmacı rakip saldırı tarafına kayar: karşı taraftaki arka sıra oyuncusu blokun arkasına çıkar (plase), orta saldırılan paralele kayar, saldırılan taraftaki savunmacı kısa açıyı alır.',
        forces: ['Derin paralel VE plasenin aynı anda mükemmel örtüsü', 'Çok adapte olabilen sistem', 'Pasör P1\'deyken hızlı pasör geçişi'],
        faiblesses: ['Derinde bir savunmacı eksik (bir oyuncu plaseye adanmış)', 'Karşı çapraz köşe savunmasız', 'Yüksek okuma ve koordinasyon becerisi gerektirir'],
        indication: 'Güç ve paralel/plase karıştıran rakipler; orta ile elit seviye.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['Man-up 2-1-3', 'Çevresel 2-0-4', 'Rotasyon 3-2-1'],
    tableRows: [
      ['Blok arkasında oyuncu', 'Evet', 'Hayır', 'Evet'],
      ['Derin savunmacılar', '3', '4', '2'],
      ['Plase örtüsü', '★★★', '★', '★★'],
      ['Güçlü smaç örtüsü', '★★', '★★★', '★★'],
      ['Derin paralel örtüsü', '★★', '★★', '★★★'],
      ['Dar çapraz örtüsü', '★', '★★★', '★★'],
      ['Tipik libero pozisyonu', 'Z5 veya Z6', 'Z5 (çizgide)', 'Z5 kayar'],
      ['Karmaşıklık', 'Düşük', 'Orta', 'Yüksek'],
    ],
    footer: {
      strong: 'Seçim bir ortodoksluk meselesi değildir: ',
      text: 'rakibin hücum profiline ve savunmacılarınızın niteliklerine bağlıdır. Modern savunma, formasyondan çok okuma ile tanımlanır — "top → pasör → top → smaçör" görsel sıralaması ve temas anında dengeli duruş.',
    },
  },
  5: {
    title: '5v5\'te üç savunma sistemi',
    warning: {
      label: '⚠ Resmi FIVB formatı değil',
      text: 'Salon 5v5\'in özel bir FIVB veya FFVb kural kitabı yoktur. Bu üç sistem, VolleyballXL, The Art of Coaching Volleyball ve Volleyball Canada tarafından belgelenen 6v6\'nın mantıksal uyarlamalarıdır. Resmi bir 5v5 teknik el kitabı yoktur — sistemi takım dizilişinize göre seçin (2-3 veya 3-2).',
    },
    systems: [
      {
        name: '1-1-3 sistemi',
        tag: '1 blokçu + 1 plase örtücüsü + 3 derin savunmacı',
        principe: '2F-3B dizilişine uygun (2 ön sıra, 3 arka sıra). Blokçu tek başına sıçrar; 2. ön sıra plaseler için fileden 2-3 m off-blocker olarak geri çekilir; 3 derin savunmacı paralel, eksen ve uzun çaprazı kapatır.',
        forces: ['6v6 çevresel gibi 3 derin savunmacı — iyi smaç örtüsü', '6v6 5-1\'e en yakın diziliş (6v6\'ya geçiş hazırlığı)', 'Off-blocker tarafından kapatılan plase'],
        faiblesses: ['Yalnızca 1 kişilik blok → büyük smaçörlere karşı zayıf', '2-3 m geride off-blocker çok reaktif olmalı'],
        indication: '2F-3B dizilişi (penetre eden pasör), orta güçlü rakipler. 6v6\'ya pedagojik geçiş için önerilen sistem.',
        accent: 'var(--teal)',
      },
      {
        name: '2-1-2 sistemi',
        tag: '2 blokçu + 1 plase + 2 derin savunmacı',
        principe: '3F-2B dizilişine uygun (3 ön sıra, 2 arka sıra). Filede 2 kişilik blok, ortadaki ön sıra fileden 2-3 m plaseyi kapatır, 2 derin savunmacı uzun çapraz ve paraleli alır.',
        forces: ['6v6\'da olduğu gibi 2 kişilik blok — güçlü smaçlara karşı önemli ölçüde daha etkili', 'Karşı saldırı için filede 3 saldırgan'],
        faiblesses: ['Yalnızca 2 derin savunmacı → 9 m arka sahayı kapatmak çok zor', '2 arka sıra savunmacısı üzerinde yüksek atletik talep'],
        indication: 'Çok güçlü takımlara karşı 3F-2B dizilişi. Setin sonunda her sayı önemliyken tercih edin.',
        accent: 'var(--orange)',
      },
      {
        name: '1-2-2 sistemi',
        tag: 'Uyarlanmış man-up (6v6 2-1-3\'e eşdeğer)',
        principe: 'Tek blokçu + 2 ön bölge örtücüsü (plase + blok arkası) + 2 derin savunmacı. Rakip çok plase yaptığında veya başlangıç düzeyindeki takımlar için uygundur.',
        forces: ['Kısa aldatmacaların mükemmel örtüsü (2 ön bölge örtücüsü)', 'Rakibin sömürmesi zor plase'],
        faiblesses: ['Yalnızca 2 derin savunmacı → güçlü smaçlar zor', '2 ön bölge örtücüsü arasında koordinasyon gerektirir'],
        indication: 'Çok plase yapan rakipler; kadın voleybolu, gençlik kategorileri, teknik takımlar.',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['1-1-3', '2-1-2', '1-2-2 (man-up)'],
    tableRows: [
      ['Blokçular', '1', '2', '1'],
      ['Ön bölge örtücüleri', '1 (off-blocker)', '1 (plase)', '2 (plase + blok arkası)'],
      ['Derin savunmacılar', '3', '2', '2'],
      ['Plase örtüsü', '★★', '★★', '★★★'],
      ['Güçlü smaç örtüsü', '★★', '★★★', '★★'],
      ['Arka saha örtüsü', '★★★', '★★', '★★'],
      ['Uygun diziliş', '2F-3B', '3F-2B', '2F-3B / 3F-2B'],
      ['Karmaşıklık', 'Düşük', 'Orta', 'Yüksek'],
    ],
    footer: {
      strong: '5v5 önerisi: ',
      text: '2F-3B dizilişinde penetre eden pasörlü 1-1-3 sistemi 6v6\'ya en yakın savunmadır — pedagojik geçiş için idealdir. 2-1-2 yalnızca gerçekten güçlü smaçörlere karşı haklıdır.',
    },
  },
  4: {
    title: '4v4\'te üç savunma sistemi',
    warning: {
      label: '⚠ Resmi FIVB formatı değil',
      text: 'Salon 4v4\'ün resmi bir FIVB kural kitabı yoktur. Bu üç sistem üniversite intramural uygulamalarından (ABD), FFVb / Volleyball Canada pedagojik geçiş el kitaplarından ve plaj literatüründen (Brandon Joyner, Better at Beach) gelir. 4 oyuncu ile her savunmacı ~30-40 m² kapatır (6v6\'da 20 m²\'ye karşı) — anticipasyon 1 numaralı yetenektir.',
    },
    systems: [
      {
        name: 'A sistemi: 1 blokçu + 3 savunmacı',
        tag: 'Salon 4v4\'te en yaygın olanı',
        principe: 'Tek bir oyuncu birincil smaçörün karşısında bloka çıkar. Diğer 3 oyuncu ayrılır: plase savunmacısı (fileden 3-4 m, eksen), çapraz savunmacısı (7-7,5 m, sağ çizgi, uzun çapraz), paralel savunmacısı (7-7,5 m, blok gölgesinde).',
        forces: ['Plase, paralel ve uzun çaprazı aynı anda kapatır', '4v4\'te en dengeli olanı', 'Paralel/çapraz blokçu işareti çok etkili'],
        faiblesses: ['1 kişilik blok — büyük smaçörlere karşı savunmasız', 'Geri çekilmeyen disiplinli bir plase savunmacısı gerektirir'],
        indication: 'Eşdeğer veya orta seviye rakipler. 4v4\'te en çok yönlü diziliş (elmas dizilişi veya 3-1 dizilişi).',
        accent: 'var(--orange)',
      },
      {
        name: 'B sistemi: 2 blokçu + 2 savunmacı',
        tag: '2 kişilik blok (4v4\'te nadir)',
        principe: '2 ön sıra birincil smaçörün karşısında birlikte çıkar. 2 arka sıra konumlanır: biri paralel tarafta (7 m, çizgiden 1 m), biri çapraza hafifçe kaymış eksende. Plase kapatılmaz.',
        forces: ['Güçlü smaçlara karşı önemli ölçüde daha etkili 2 kişilik blok', 'Rakip smaçör üzerinde maksimum baskı'],
        faiblesses: ['Sahada yalnızca 2 savunmacı → her şeyi kapatmak imkansız', 'Blok arkasındaki plase tamamen savunmasız', 'Bir seçim zorunlu kılar: paralel VEYA çapraz, ikisi birden değil'],
        indication: 'Yalnızca incelik sahibi olmayan (aldatmaca yapmayan) çok güçlü smaçörlere karşı kullanılmalı. Kare 2-2 veya 3-1 dizilişi.',
        accent: 'var(--plum)',
      },
      {
        name: 'C sistemi: 0 blokçu',
        tag: 'Alçak savunma (smaç yapmayan rakipler)',
        principe: 'Hiçbir oyuncu bloka çıkmaz. 4 oyuncu derinde savunur: ortada 2 (3-4 m) aldatmacalar için, derinde 2 (7-8 m) daha derin toplar için. Pasör 4. savunmacı olarak görev yapar.',
        forces: ['Sahanın tüm derinliğini kapatır', 'Yavaş ralliler için iyi uygundur'],
        faiblesses: ['Bir rakip ciddi şekilde vurduğunda KARŞI ÜRETKEN (smaç karşılıksız geçer)', 'Filede baskı yok'],
        indication: 'Okul seviyeleri, başlangıç düzeyi rekreasyon, smaç yapmayan rakipler. Rakip güç kazanır kazanmaz kaçının.',
        accent: 'var(--teal)',
      },
    ],
    tableHeaders: ['A sistemi', 'B sistemi', 'C sistemi'],
    tableRows: [
      ['Blokçular', '1', '2', '0'],
      ['Derin savunmacılar', '3', '2', '4'],
      ['Plase örtüsü', '★★', '★', '★★★'],
      ['Güçlü smaç örtüsü', '★★', '★★★', '★ (blok yok)'],
      ['Derin paralel örtüsü', '★★', '★★', '★★'],
      ['Uzun çapraz örtüsü', '★★★', '★★', '★★'],
      ['Önerilen rakipler', 'Tüm seviyeler', 'Çok güçlü', 'Smaç yapmayanlar'],
      ['Karmaşıklık', 'Düşük', 'Orta', 'Düşük'],
    ],
    footer: {
      strong: '4v4 önerisi: ',
      text: 'A sistemi (1 blokçu + 3 savunmacı) neredeyse evrensel varsayılandır. B sistemi yalnızca setin sonunda gerçekten güçlü smaçörlere karşı haklıdır. C sistemi yalnızca başlangıç düzeyi rekreasyonda işe yarar — bir rakip smaç yaptığında A sistemine dönün.',
    },
  },
};

const EXERCICES = [
  { title: 'Durum okuma', level: 'Başlangıç', duration: '10 dk', materiel: '1 antrenör veya toplu partner',
    objectif: 'Saldırı bölgesini hızlıca belirlemeyi öğrenin',
    steps: ['Antrenör filenin diğer tarafında bölge 4, 3 veya 2\'de durur', 'Sahanın merkezinden başlarsınız', 'Antrenör bölgeyi söyler ve topu atar', 'Savunma bölgenize 2-3 saniye içinde ulaşmalısınız', 'Bölgeleri değiştirerek 20 kez tekrarlayın'] },
  { title: 'Pasa göre öne çık / geri çekil', level: 'Orta', duration: '15 dk', materiel: '1 pasör, 1 smaçör, birkaç savunmacı',
    objectif: 'Pozisyonunuzu pas kalitesine göre ayarlayın',
    steps: ['Pasör smaçöre değişen kalitede paslar verir', 'Fileye yakın pas → Geri çekilirsiniz (güçlü smaç beklenir)', 'Fileden uzak pas → Öne çıkarsınız (aldatmaca olası)', 'Smaçör saldırır ve siz savunursunuz', 'Antrenör her toptan sonra pozisyonunuzu düzeltir'] },
  { title: 'Savunma iletişimi', level: 'Tüm seviyeler', duration: '10 dk', materiel: 'Tam takım',
    objectif: 'Otomatik iletişim geliştirin',
    steps: ['Formatınızda maç (4v4, 5v5 veya 6v6) ancak her çağrıyı BAĞIRARAK', 'Ceza: bir oyuncu topunda "Bende!" demezse -1 sayı', 'Bonus: tüm takım bir ralli boyunca iletişim kurarsa +1 sayı', 'Her oyuncu rakip saldırı bölgesini duyurmalı'] },
  { title: 'Aldatmacalara karşı savunma', level: 'Orta', duration: '15 dk', materiel: '1 smaçör, 3 arka savunmacı',
    objectif: 'Kısa topların savunmasını geliştirin',
    steps: ['Smaçör YALNIZCA aldatmaca ve yumuşak vuruş oynar', 'Savunmacıların hepsi öne çıkmalı (3-4 m)', 'Hedef: 10 toptan 8\'ini kurtarmak', 'Sonra dönüşümlü: 5 aldatmaca, 5 smaç — adaptasyon çalışmak için'] },
  { title: 'Hızlı geçişler', level: 'İleri', duration: '20 dk', materiel: 'Tam takım',
    objectif: 'Saldırı-savunma değişimlerinde ustalaşın',
    steps: ['Normal oyun ancak antrenör geçişleri kronometreyle ölçer', 'Hedef: 3 saniyeden kısa sürede savunma pozisyonunda olmak', 'Çok yavaşsa takım 5 şınav çeker ve baştan başlar', 'Rallilerin temposunu kademeli artırın'] },
  { title: 'Smaçörü okuma', level: 'İleri', duration: '15 dk', materiel: '1 smaçör, savunmacılar',
    objectif: 'Vücut diline göre tahmin etmek',
    steps: ['Smaçör uyarı vermeden smaç, aldatmaca, plase arasında değişir', 'Vurmadan önce savunmacı tahminini söyler: "Smaç!" veya "Aldatmaca!"', 'Tahmin doğruysa VE top savunulduysa sayı', 'Odak: omuz, yaklaşma, fileye göre pozisyon'] },
];

type GuidePositionnementProps = {
  teamSize?: TeamSize;
  configId?: string;
};

export default function GuidePositionnementTr({ teamSize: teamSizeProp, configId: configIdProp }: GuidePositionnementProps = {}) {
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
      return <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>Bu diziliş için diyagram mevcut değil.</div>;
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
        <div style={S.label}>Takım dizilişiniz</div>
        <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
          Formatınızı ve taktik dizilişinizi seçin: <strong>tüm rehber içeriği</strong> (pozisyonlar, bölgeler, saldırıya göre savunma) buna uyum sağlayacak.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Oyun formatı</div>
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
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>Taktik diziliş</div>
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
        <div style={S.label}>Savunmanın temel ilkesi</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0' }}>Savunma pozisyonu 3 ana faktöre bağlıdır:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Pozisyonunuz (ön veya arka sıra)', 'Rakip saldırı bölgesi (bölge 4, 3, 2)', 'Saldırı türü (güçlü smaç, aldatmaca, plase)'].map((pt, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={S.bullet}>▸</span>
              <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Positions and zones */}
      <section>
        <h2 style={S.section}>1. Pozisyonlar ve bölgeler — {configuration.shortName} ({teamSize}v{teamSize})</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {configuration.name} dizilişinde takım yerleşiminiz
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
              Her pozisyonun detayını /positions sayfasında görün →
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--ink)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>Önemli kural: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>
            {teamSize === 6 && 'Arka sıra oyuncuları (5, 6, 1) filede blok yapAMAZ. Arka sahada savunma yaparlar.'}
            {teamSize === 5 && '5 oyuncu ile her savunmacı ~30 m² kapatır (6v6\'da 20 m²\'ye karşı). Okuma kritik hale gelir.'}
            {teamSize === 4 && 'Libero yok. Her oyuncu ~30-40 m² savunur. Anticipasyon 1 numaralı yetenektir.'}
          </span>
        </div>
      </section>

      {/* 2. Positioning by zone */}
      <section>
        <h2 style={S.section}>2. Rakip saldırı bölgesine göre konumlanma</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button key={z} onClick={() => setZone(z)} style={zone === z ? btnActive : btnBase}>
              {z === 'zone4' ? 'Bölge 4 saldırısı' : z === 'zone3' ? 'Bölge 3 saldırısı' : 'Bölge 2 saldırısı'}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {teamSize}v{teamSize} · {configuration.shortName} — {
              zone === 'zone4' ? 'Bölge 4 saldırısına karşı savunma (rakip sol kanat)' :
              zone === 'zone3' ? 'Bölge 3 saldırısına karşı savunma (merkez)' :
              'Bölge 2 saldırısına karşı savunma (rakip sağ kanat)'
            }
          </div>
          {renderZoneTab()}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <span><span style={{ color: 'var(--orange)' }}>■</span> <span style={{ color: 'var(--ink)', opacity: 0.6 }}>Sorumluluk bölgesi</span></span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>BLK</strong> = blok</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>OFF</strong> = off-blocker</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>DEF</strong> = savunma</span>
        </div>
      </section>

      {/* 3. General principles */}
      <section>
        <h2 style={S.section}>3. Genel konumlanma ilkeleri</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={S.labelTeal}>Sorumluluk bölgeleri</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          {[
            { title: 'Ön sıra oyuncuları',
              points: ['Öncelik: Filede blok', 'Blok yapmıyorsa: karşı paraleli savun', 'Mesafe: filede veya arka saha'] },
            { title: teamSize === 4 ? 'Tek arka savunmacı (P1)' : 'Savunma pivotu (Libero / P6)',
              points: teamSize === 4
                ? ['Pozisyon: merkez, ~40 m² kapatılacak', 'Mesafe: fileden 5-6 m', 'Rol: tek savunma direği, maksimum anticipasyon']
                : ['Pozisyon: merkez, adapte olabilir', 'Mesafe: fileden 5-6 m', 'Rol: savunma direği, merkezi kapatır'] },
            { title: 'Dış arka savunmacılar',
              points: ['Değişken rol: öne çık veya geri çekil', 'Saldırılan taraf: öne çık (3-4 m)', 'Karşı taraf: geri çekil (6-7 m)'] },
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
            ★ Evrensel savunma ilkeleri (4v4 / 5v5 / 6v6)
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px 0', lineHeight: 1.5 }}>
            Hebert, Liskevych ve Volleyball Canada'dan bu ilkeler, sahadaki oyuncu sayısından bağımsız olarak geçerlidir.
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Blok temeldir', 'Arka savunmacılar bağımsız değil — blok gölgesine ve yönelimine göre konumlanırlar.'],
              ['Temas anında durmuş ve dengeli', 'Smaçör topa temas ettiğinde hâlâ hareket halinde olan herhangi bir savunmacı reaktivitesini kaybeder ("temas anında durmuş").'],
              ['Sıralı görsel okuma', '"Top → rakip pasör → top → rakip smaçör". 4v4 ve 5v5\'te eksik oyuncular daha erken okumayı zorunlu kılar.'],
              ['İşaret iletişimi', 'Rekreasyon seviyesinde bile blokçu "paralel" veya "çapraz" işaret etmelidir — bu olmadan arka savunmacılar neyi kapatacaklarını bilmezler.'],
              ['Ön bölge örtülmüş', 'Birisi blok arkasındaki 3-5 m\'yi kapatmalıdır — küçük formatlarda (4v4 / 5v5) en ihmal edilen bölge.'],
              ['Hızlı geçiş', 'Pasör topun savunulduğunu onaylamadan asla hedefe kaçmamalıdır ("release call").'],
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
        <h2 style={S.section}>4. Smaçörü okumak: görsel ipuçları</h2>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Konumlanmanız gördüğünüze göre ayarlanmalıdır. İşte temel ipuçları:
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
          <strong style={{ color: 'var(--ink)' }}>Pro ipucu: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>Rakip servisinden sonraki 2 saniyede bakışınızı pasöre, sonra HEMEN saldıracak olan smaçöre odaklayın.</span>
        </div>
      </section>

      {/* 5. When to step up / drop back */}
      <section>
        <h2 style={S.section}>5. Ne zaman öne çıkılır veya geri çekilir?</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, marginBottom: 14 }}>Hızlı karar ağacı</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderLeft: '4px solid var(--orange)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--orange)', letterSpacing: '0.08em' }}>Öne çık (fileden 3-4 m) eğer:</div>
              {[
                'Smaçörle aynı taraftaysan',
                'Smaçör fileden uzaksa (kötü pas)',
                'Aldatmaca veya yumuşak vuruş bekliyorsan',
                'Blok sağlamsa — daha az güçlü top geçer',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={S.bulletOrange}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '4px solid var(--ink)', paddingLeft: 16, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.08em' }}>Geri çekil (fileden 6-7 m) eğer:</div>
              {[
                'Smaçörün karşı tarafındaysan',
                'Smaçörün fileye yakın iyi bir pası varsa',
                'Smaçör güçlü veya uzunsa',
                'Blok zayıfsa (yalnızca 1 blokçu)',
                'Çaprazı savunuyorsan (en uzun yörünge)',
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
        <h2 style={S.section}>7. Serviste konumlanma</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            <strong>Servisteki yerleşiminiz savunma pozisyonunuzdan FARKLIDIR. </strong>
            Servis atıldığı anda yeniden konumlanmalısınız.
          </p>
        </div>
        <div style={S.card}>
          <div style={{ ...S.labelTeal, marginBottom: 12 }}>Servis → savunma geçişi</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Takımınız servis atıyor', 'Rotasyon pozisyonundasınız'],
              ['Servisçi vuruyor', 'Rakip pasörü izlersiniz'],
              ['Pasör topa dokunuyor', 'Savunma bölgenize doğru hareket edersiniz'],
              ['Smaçör sıçrıyor', 'Son pozisyondasınız, tepki vermeye hazırsınız'],
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
        <h2 style={S.section}>8. Savunma iletişimi</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>Sessiz savunma, etkisiz savunmadır.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { moment: 'Rakip saldırısından önce', calls: [['"Dört!"', 'Saldırının geldiği bölgeyi duyurun'], ['"Blokta iki!"', 'Kaç blokçu olduğunu belirtin'], ['"Paralel açık!"', 'Blok paraleli kapatmıyorsa'], ['"Öne çıkıyorum!" / "Geri çekiliyorum!"', 'Hareketinizi duyurun']] },
            { moment: 'Aksiyon sırasında', calls: [['"Bende!" / "Aldım!"', 'Topu siz alıyorsunuz (EN önemli olan)'], ['"Sende!" / "Sen!"', 'Topu takım arkadaşına bırakıyorsunuz'], ['"Out!"', 'Top dışarı çıkıyor, dokunmayın'], ['"Blokta!"', 'Eğer blok yaptıysanız, söyleyin']] },
            { moment: 'Aksiyondan sonra', calls: [['"Örtü!"', 'Saldırı örtüsü çağırın'], ['"Free!"', 'Free ball, sıfırla'], ['"Kal!"', 'Savunmayı yerinde tut']] },
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
          <strong style={{ color: 'var(--ink)' }}>Altın kural: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>İki oyuncu arasında tereddüt varsa, daha önde olan oyuncu HER ZAMAN topu alır.</span>
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
                    <div style={S.labelTeal}>Güçlü yönler</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.forces.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={S.bullet}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.55 }}>Zayıf yönler</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.faiblesses.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sys.accent, marginTop: 6 }}>
                      Kullanım: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{sys.indication}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div style={{ ...S.card, marginTop: 14, overflowX: 'auto' }}>
                <div style={{ ...S.label, marginBottom: 10 }}>Sentetik karşılaştırma tablosu</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.6 }}>Kriter</th>
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
        <h2 style={S.section}>10. Saldırı ↔ savunma geçişleri</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            Voleybol, hızlı geçişlerden oluşan bir oyundur. Sürekli olarak saldırıdan savunmaya ve geri dönüş yaparsınız.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Saldırı → savunma geçişi', items: [['Takım arkadaşınız saldırıyor', 'Zihinsel olarak savunmaya hazırlanın'], ['Top geri geliyor', 'Kimin saldıracağını hemen tespit edin'], ['Hızlı hareket', 'Savunma bölgenize ulaşın (en fazla 2-3 saniye)'], ['Alçak duruş', 'Dizlerinizi bükün, dalmaya hazır olun']] },
            { label: 'Savunma → saldırı geçişi', items: [['Topu savunursunuz', 'Pasöre doğru pas'], ['ÖN SIRADAYSANIZ', 'Saldırmak veya blok yapmak için fileye koşun'], ['ARKA SIRADAYSANIZ', 'Hafifçe geri çekilin, saldırı örtüsüne hazır olun'], ['Saldırı örtüsü', 'Smaçörünüzün etrafını sarın (2-3 m uzaklıkta yarım daire)']] },
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
        <h2 style={S.section}>11. Geliştirici antrenmanlar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{i + 1}. {ex.title}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 8px', border: '1.5px solid var(--ink)', color: 'var(--ink)', background: 'var(--cream)', flexShrink: 0 }}>{ex.level}</span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, marginBottom: 6 }}>
                Süre: {ex.duration} · Ekipman: {ex.materiel}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 8 }}>
                Hedef: <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{ex.objectif}</span>
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
        <h2 style={S.section}>12. Savunmacının 10 emri</h2>
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
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Smaçörle aynı taraf</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--orange)', marginBottom: 4 }}>→ ÖNE ÇIK (3-4 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Aldatmaca ve yumuşak vuruşları savun</div>
            </div>
            <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>Smaçörün karşı tarafı</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>→ GERİ ÇEKİL (6-7 m)</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>Uzun çaprazları savun</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>Sonuç</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            Savunma pozisyonu pratik ve deneyimle öğrenilir. Başlangıçta hata yaparsanız cesaretiniz kırılmasın
            — profesyoneller bile sürekli yerleşimlerini ayarlar.
          </p>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: 0 }}>
            Anahtar: temel kuralı uygulayın (aynı taraf = öne çık, karşı = geri çekil), smaçörü izleyin,
            takım arkadaşlarınızla iletişim kurun ve bir top için dalmaktan asla korkmayın.
          </p>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, color: 'var(--ink)', margin: 0, letterSpacing: '0.06em' }}>Maçları savunma kazanır.</p>
        </div>
      </section>

    </div>
  );
}
