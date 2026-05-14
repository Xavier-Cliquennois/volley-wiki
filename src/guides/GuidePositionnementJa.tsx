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
      Z('P1', 65, 40, 35, 60, 'Z1ショート'),
      Z('P5', 0, 43, 50, 57, 'ロングクロス'),
      Z('P4', 0, 25, 30, 33, 'オフブロッカー'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      '相手のZ4からの攻撃（相手の左ウィング）→ ボールは自陣の右側に到達します。',
      '2-1-2システム：2枚ブロック（P2がストレート＋P3がクロス）＋ディープディフェンダー2人。',
      'P4（アウトサイドヒッター）はオフブロッカーとしてネットから2〜2.5m、サイドラインから1mに位置し、フェイントとカットショットをカバーします。',
      'P5（約7〜7.5m、左ラインから0.5m）はロングクロスを守ります。',
      'P1（約7〜7.5m、右ラインから0.5m）はブロックの影でディープラインを守ります。',
      '主に守る打球：ロングクロス（統計的に最も多いコース）。',
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
      Z('P5', 0, 40, 50, 60, 'クロスL'),
      Z('P1', 50, 40, 50, 60, 'クロスR'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 82 }],
    notes: [
      'センターからのクイック攻撃（Z3）— 角度が浅く反応時間が短いです。',
      '1枚ブロック：P3（ミドルブロッカー）がリード、コミットは不可能。',
      'P4とP2（オフブロッカー）はアタックライン上でネットから2m、ブロックの跳ね返りをカバーします。',
      'P5とP1は1m前に出て（ネットから約7m）、クイックでは角度が浅くなります。',
      '弱点：センターディープに専任のディフェンダーがいません（5v5ではバックは2人のみ）。',
      '重要ルール：「コンタクトで停止」— ヒッターのインパクトの瞬間には全員停止しバランスを取ります。',
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
      Z('P5', 0, 40, 35, 60, 'Z5ショート'),
      Z('P1', 50, 43, 50, 57, 'ロングクロス'),
      Z('P2', 70, 25, 30, 33, 'オフブロッカー'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      '相手のZ2からの攻撃（相手の右ウィング）→ ボールは自陣の左側に到達します。Z4の完全な鏡像です。',
      '2枚ブロック：P4（アウトサイドのストレート）＋ P3（ミドルのクロス）。',
      'P2（オポジット／セッター）はオフブロッカーとして右サイドのネットから2〜2.5mに位置します。',
      'P1（約7〜7.5m、右ラインから1m）はロングクロスを守ります。',
      'P5（約7〜7.5m、左ラインから0.5m）はブロックの影でディープラインを守ります。',
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
      Z('P1', 65, 40, 35, 60, 'Z1ショート'),
      Z('P5', 0, 43, 50, 57, 'ロングクロス'),
      Z('P4', 0, 25, 30, 33, 'オフブロッカー'),
    ],
    mainShot: { toX: 35, toY: 77.5 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 55 }, { toX: 20, toY: 40 }],
    notes: [
      '相手のZ4からの攻撃 → ボールは自陣の右側に到達します。',
      '3F-2Bフォーメーション：フロント3人 → 有利な2枚ブロック（P3 ＋ セッター兼ブロッカーのP2）。',
      'P4（アウトサイドヒッター）はアタックラインの左側でショートオフブロッカー（ネットから約2〜2.5m）。',
      'P5はロングクロスを守ります（約7m、左ラインから0.5m）。',
      'P1はブロックの影でディープラインの右を守ります（約7m、右ラインから0.5m）。',
      '弱点：バックは2人のみ → 1人あたり30㎡以上を担当（6v6では20㎡）。',
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
      Z('P5', 0, 40, 50, 60, 'クロスL'),
      Z('P1', 50, 40, 50, 60, 'クロスR'),
    ],
    mainShot: { toX: 50, toY: 82 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 75, toY: 70 }],
    notes: [
      'センターからのクイック攻撃（Z3）— 角度が浅いです。',
      'フロント3人なら3枚ブロックも可能ですが、フロアディフェンダーが2人だけになるため推奨されません。',
      '推奨：2枚ブロック（P3 ＋ ヒッティングレーンに最も近いウィング）。',
      'P5とP1は1m前（約7m）、クイックでは角度が浅くなるためです。',
      '弱点：センター奥のボールがカバーされません（5v5の3F-2BではZ6ディフェンダーなし）。',
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
      Z('P5', 0, 43, 35, 57, 'Z5ショート'),
      Z('P1', 50, 43, 50, 57, 'ロングクロス'),
      Z('P2', 70, 25, 30, 33, 'オフブロッカー'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 55 }, { toX: 80, toY: 40 }],
    notes: [
      '相手のZ2からの攻撃 → ボールは自陣の左側に到達します。Z4の完全な鏡像です。',
      '2枚ブロック：P4（アウトサイドのストレート）＋ P3（ミドルのクロス）。',
      'セッター（P2）はオフブロッカーとして右サイドのネットから2〜2.5mに位置（フェイント対策＋ターゲットへの素早いトランジション）。',
      'P1はロングクロスを守ります（約7〜7.5m）。',
      'P5はブロックの影でディープラインの左を守ります。',
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
      Z('P2', 65, 34, 35, 66, 'ショートライン'),
      Z('P4', 0, 25, 35, 45, 'クロスL'),
      Z('P1', 25, 62.5, 45, 37.5, 'ディープ'),
    ],
    mainShot: { toX: 20, toY: 55 },
    altShots: [{ toX: 82, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 70, toY: 47.5 }],
    notes: [
      '相手のZ4からの攻撃 → ボールは自陣の右側に到達します。',
      'ダイヤモンドフォーメーション（1-2-1）→ Aシステム：1枚ブロック（P3）＋ ディフェンダー3人。',
      'P3は右側で単独ブロックに跳びます（相手ヒッターと正対）。',
      'P2（前衛右）は3mラインまで下がり、ネットから3.5〜4m — ブロックの後ろのフェイントやチップをカバーします。',
      'P4（前衛左）はミッドコートの左に下がり — ショートクロスをカバーします。',
      'P1（唯一のバックディフェンダー）はロングクロスを守ります（約7〜7.5m、右ラインから1m）。',
      '予測力が最重要スキル：バックは1人のみ → 約40㎡をカバーします。',
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
      Z('P4', 0, 32.5, 35, 52.5, 'クロスL'),
      Z('P2', 65, 32.5, 35, 52.5, 'クロスR'),
      Z('P1', 30, 62.5, 45, 37.5, 'ディープ'),
    ],
    mainShot: { toX: 50, toY: 77.5 },
    altShots: [{ toX: 18, toY: 55 }, { toX: 80, toY: 55 }],
    notes: [
      'センターからのクイック攻撃（Z3）— 4v4で最も難しい局面：時間が少なくブロッカーは1人だけ。',
      '1枚ブロック（P3単独）は常時リードモード（コミットは不可能）。',
      'P4とP2はミッドコートに下がり（ネットから約3.5〜4m、両側のショートクロスをカバー）。',
      '唯一のバックディフェンダーP1はZ6ディフェンダーとして機能（センター軸、ネットから7〜8m）。',
      '主に守る打球：強烈な軸打ち（P1方向）、1枚ブロックではセンターしかカバーできないため。',
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
      Z('P4', 0, 34, 35, 66, 'ショートライン'),
      Z('P2', 60, 25, 40, 45, 'クロスR'),
      Z('P1', 30, 62.5, 45, 37.5, 'ディープ'),
    ],
    mainShot: { toX: 80, toY: 55 },
    altShots: [{ toX: 18, toY: 70 }, { toX: 50, toY: 77.5 }, { toX: 30, toY: 55 }],
    notes: [
      '相手のZ2からの攻撃 → ボールは自陣の左側に到達します。Z4の完全な鏡像です。',
      'Aシステム：1枚ブロック（P3）＋ ディフェンダー3人。',
      'P4（前衛左）は3mラインまで下がり、ネットから3.5〜4m — 左側のフェイントやチップをカバーします。',
      'P2（前衛右）はミッドコートの右に下がり — ショートクロスをカバーします。',
      '唯一のバックディフェンダーP1はロングクロスを守ります（約7〜7.5m、左ラインから1m）。',
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
      Z('P1', 65, 43, 35, 57, 'ショートクロス'),
      Z('P5', 0, 43, 50, 57, 'ロングクロス'),
      Z('P4', 0, 25, 35, 33, 'オフブロッカー'),
    ],
    mainShot: { toX: 25, toY: 77.5 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 22, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      '相手のZ4からの攻撃 → ボールは自陣の右側に到達します。',
      'ボックスフォーメーション（2-2／ボックス）→ Aシステム：1枚ブロック（P2）＋ ディフェンダー3人。',
      'P2（前衛右）は相手ヒッターと正対して単独ブロックし、ストレートを取ります。',
      'P4（前衛左）はオフブロッカーとしてネットから2〜2.5m — 左側のフェイントとカットショットをカバーします。',
      'P5はロングクロスを守ります（約7m、左ラインから0.5m）。',
      'P1はディープライン／ショートクロスを守ります（約7m、ブロックの影で）。',
      'Bシステム（P2＋P4の2枚ブロック）も可能ですが、ディフェンダーが2人だけになるため、強烈なヒッター用に温存してください。',
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
      Z('P5', 0, 40, 50, 60, 'クロスL'),
      Z('P1', 50, 40, 50, 60, 'クロスR'),
    ],
    mainShot: { toX: 25, toY: 70 },
    altShots: [{ toX: 75, toY: 70 }, { toX: 50, toY: 47.5 }],
    notes: [
      'センターからのクイック攻撃（Z3）— 角度が浅く時間が少ないです。',
      '2枚ブロック（P4 ＋ P2）でセンターを閉じる — 後方にディフェンダー2人のBシステム。',
      'P5とP1はショートクロスを担当（約7m、サイドラインから0.5〜1m）。',
      '大きな弱点：ブロックの後ろのショートカバーがなく、ボックスにはミッドコートプレーヤーがいません。',
      '代替案：1枚ブロック（P3的な役割、ここではP4またはP2単独）でフェイントディフェンダーを1人確保。',
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
      Z('P5', 0, 43, 35, 57, 'ショートクロス'),
      Z('P1', 50, 43, 50, 57, 'ロングクロス'),
      Z('P2', 60, 25, 40, 33, 'オフブロッカー'),
    ],
    mainShot: { toX: 75, toY: 77.5 },
    altShots: [{ toX: 25, toY: 70 }, { toX: 78, toY: 47.5 }, { toX: 50, toY: 62.5 }],
    notes: [
      '相手のZ2からの攻撃 → ボールは自陣の左側に到達します。Z4の完全な鏡像です。',
      'Aシステム：1枚ブロック（P4）＋ ディフェンダー3人。',
      'P4（前衛左）は相手ヒッターと正対して単独ブロックし、ストレートを取ります。',
      'P2（前衛右のセッター兼ヒッター）はオフブロッカーとしてネットから2〜2.5m — フェイント対策＋ターゲットへの素早いトランジション。',
      'P1はロングクロスを守ります（約7m、右ラインから0.5m）。',
      'P5はディープラインのショート側を守ります（約7m、ブロックの影で）。',
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
      Z('P1', 65, 40, 35, 60, 'ラインR'),
      Z('P6', 33, 52, 34, 48, '軸'),
      Z('P5', 0, 43, 35, 57, 'クロスL'),
      Z('P4', 0, 25, 30, 33, 'オフブロッカー'),
    ],
    mainShot: { toX: 25, toY: 75 },
    altShots: [{ toX: 78, toY: 70 }, { toX: 50, toY: 70 }, { toX: 18, toY: 40 }],
    notes: [
      '相手のZ4からの攻撃 → ボールは自陣の右側に到達します。',
      '2F-3Bフォーメーション（P4＋P3がフロント、P5＋P6＋P1がバック、P1がペネトレーション）：1枚ブロック。',
      'P3（ミドルブロッカー）が右側で単独ブロック — P2がいないため2枚ブロックは不可能。',
      'P4（アウトサイドヒッター）はオフブロッカーとして左側のネットから2〜2.5m。',
      'ディープディフェンダー3人：P5はロングクロス、P6はセンター軸（約7〜8m）、P1は右ライン。',
      '1-1-3システム（ブロッカー1人＋オフブロッカー1人＋ディフェンダー3人）は6v6のペリメーター・ディフェンスに最も近い守備です。',
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
      Z('P5', 0, 40, 33, 60, 'クロスL'),
      Z('P6', 33, 52, 34, 48, '軸'),
      Z('P1', 67, 40, 33, 60, 'クロスR'),
    ],
    mainShot: { toX: 50, toY: 75 },
    altShots: [{ toX: 22, toY: 65 }, { toX: 78, toY: 65 }],
    notes: [
      'センターからのクイック攻撃（Z3）— 角度が浅いです。',
      '1枚ブロック（P3）のリード — クイックは2F-3Bで最も難しい標的です。',
      'P4はミッドコートで横方向にずれて位置（ネットから約2m）、跳ね返りに備えます。',
      '利点：ディフェンダー3人（P5、P6、P1）が後方の3つの主要ゾーンをカバーします。',
      'P6は相手ミドルヒッターのヒッティングレーンに正対（約7.5〜8m、軸上）。',
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
      Z('P5', 0, 40, 35, 60, 'ラインL'),
      Z('P6', 33, 52, 34, 48, '軸'),
      Z('P1', 65, 43, 35, 57, 'クロスR'),
      Z('P3', 70, 25, 30, 33, 'オフブロッカー'),
    ],
    mainShot: { toX: 75, toY: 75 },
    altShots: [{ toX: 22, toY: 70 }, { toX: 50, toY: 70 }, { toX: 80, toY: 40 }],
    notes: [
      '相手のZ2からの攻撃 → ボールは自陣の左側に到達します。Z4の鏡像です。',
      '1枚ブロック：P4が左側で単独ブロック（2F-3BにはP2がいません）。',
      'P3（ミドルブロッカー）が右側のオフブロッカーになり、ネットから2〜2.5m。',
      'P5はディープラインの左、P6は軸、P1はロングクロスを守ります。',
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
      { posNumber: 'P5', x: 0, y: 43, w: 50, h: 57, label: 'ロングクロス', labelPos: { x: 18, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'ブロックの影', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 62, y: 34, w: 38, h: 42, label: 'ライン', labelPos: { x: 70, y: 40 } },
      { posNumber: 'P4', x: 0, y: 25, w: 30, h: 36, label: 'オフブロッカー', labelPos: { x: 4, y: 33 } },
    ],
    mainShot: { toX: 22, toY: 77.5 },
    altShots: [
      { toX: 78, toY: 47.5 },
      { toX: 45, toY: 62.5 },
      { toX: 15, toY: 40 },
    ],
    notes: [
      { label: 'ポジション2（オポジット／OPP）', text: 'ラインブロッカー — 右側でブロックし、ネットまで出ます。' },
      { label: 'ポジション3（ミドルブロッカー）', text: 'オポジットとの2枚ブロックでクロスを閉じます。' },
      { label: 'ポジション4（アウトサイドのオフブロッカー）', text: '左側で3mラインまで下がり — ショートカット（鋭いクロス）とフェイントをカバーします。' },
      { label: 'ポジション5（リベロ）', text: 'ロングクロスを守り、ネットから約7〜8m、ミドルブロッカーの内側の肩のラインに位置します。' },
      { label: 'ポジション6（バックセンター）', text: 'ブロックを越える高いボール、ブロックワンタッチで伸びるボールを担当、軸上で約8〜8.5m。' },
      { label: 'ポジション1（バックライト）', text: 'ブロックの影でディープラインを守り、ネットから約7〜7.5m、右ラインから0.5m。' },
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
      { posNumber: 'P5', x: 0, y: 34, w: 36, h: 66, label: 'クロスL', labelPos: { x: 10, y: 70 } },
      { posNumber: 'P6', x: 32, y: 52, w: 36, h: 48, label: '軸', labelPos: { x: 42, y: 73 }, ...LIBERO_LABEL },
      { posNumber: 'P1', x: 64, y: 34, w: 36, h: 66, label: 'クロスR', labelPos: { x: 75, y: 70 } },
      { posNumber: 'P4', x: 0, y: 25, w: 28, h: 28, label: 'カバー', labelPos: { x: 4, y: 36 } },
      { posNumber: 'P2', x: 72, y: 25, w: 28, h: 28, label: 'カバー', labelPos: { x: 78, y: 36 } },
    ],
    mainShot: { toX: 75, toY: 65 },
    altShots: [
      { toX: 25, toY: 65 },
      { toX: 50, toY: 80 },
    ],
    notes: [
      { label: 'ポジション3（ミドルブロッカー）', text: '相手スカウティングに応じて1枚ブロックのリード（read）またはコミット。' },
      { label: 'ポジション4と2（アウトサイドヒッター）', text: 'アタックライン上（ネットから約2〜2.5m、サイドラインから0.5m）：ブロックの跳ね返りや抜けたボールをカバーします。' },
      { label: 'ポジション5（リベロ）', text: 'ミドルヒッターと正対し、そのヒッティングレーン上に位置（ネットから約7〜8m）。' },
      { label: 'ポジション6（バックセンター）', text: 'ヒッターに正対した姿勢でブロックを抜けてくる強打を守ります（軸上で約8〜8.5m）。' },
      { label: 'ポジション1（バックライト）', text: '1m前に出ます（ネットから約7.5m、右ラインから1m）：クイックでは角度が浅いため。' },
      { label: '重要ルール', text: '「コンタクトで停止」：ヒッターのインパクトの正確な瞬間に全員停止しバランスを取ります。' },
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
      { posNumber: 'P1', x: 50, y: 43, w: 50, h: 57, label: 'ロングクロス', labelPos: { x: 68, y: 75 } },
      { posNumber: 'P6', x: 33, y: 52, w: 34, h: 36, label: 'ブロックの影', labelPos: { x: 36, y: 88 }, ...LIBERO_LABEL },
      { posNumber: 'P5', x: 0, y: 34, w: 38, h: 42, label: 'ライン', labelPos: { x: 10, y: 40 } },
      { posNumber: 'P2', x: 70, y: 25, w: 30, h: 36, label: 'オフブロッカー', labelPos: { x: 76, y: 33 } },
    ],
    mainShot: { toX: 78, toY: 77.5 },
    altShots: [
      { toX: 22, toY: 47.5 },
      { toX: 55, toY: 62.5 },
      { toX: 85, toY: 40 },
    ],
    notes: [
      { label: 'ポジション4（アウトサイドヒッター）', text: 'ラインブロッカー — 左側のネットでブロックします。' },
      { label: 'ポジション3（ミドルブロッカー）', text: 'アウトサイドヒッターとの2枚ブロックでクロスを閉じます。' },
      { label: 'ポジション2（オポジット／OPP）', text: '右側のオフブロッカーとなり — 3mラインまで下がり、ショートカットとフェイントをカバーします。' },
      { label: 'ポジション5（リベロ）', text: 'ブロックの影でディープラインを守り、ネットから約7〜7.5m、左ラインから0.5m。' },
      { label: 'ポジション6（バックセンター）', text: 'ブロックを越える高いボール、軸上でネットから約8〜8.5m。' },
      { label: 'ポジション1（セッターまたはOH／OPP）', text: 'ロングクロスを守り、ネットから約7〜8m。' },
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
  { title: 'ヒッターがネットから遠い', action: '前に出る', accentColor: 'var(--orange)',
    points: ['トスがネットから2〜3m', '強打は打てない', 'フェイントやロールショットのリスクが高い', '1〜2m前に出る'] },
  { title: 'ヒッターがネットに近い', action: '後ろに下がる', accentColor: 'var(--plum)',
    points: ['トスがネットから1m以内', 'フルパワーで強打可能', '速く落ちる軌道', 'できる限り後ろに下がる'] },
  { title: 'ヒッターの肩', action: '打つ側の肩を見る', accentColor: 'var(--teal)',
    points: ['肩が高く引かれている＝強烈なスパイク', '肩が低い＝フェイントの可能性', '肩の回転＝ボールの方向', '0.5秒で調整する'] },
  { title: 'ヒッターの助走', action: '助走の動きを見る', accentColor: 'var(--ink)',
    points: ['長く速い助走＝強打', '短い助走や停止＝フェイント', '助走の角度＝狙うゾーン', 'パワーを予測する'] },
];

const COMMANDEMENTS = [
  ['セッターを見る', '次にヒッター、ボールではなく'],
  ['同サイド＝前に出る', '反対サイド＝後ろに下がる'],
  ['相手のトスが悪い', '→ 1〜2m前に出る（フェイントの可能性大）'],
  ['中途半端はダメ', '前か後ろを選ぶ'],
  ['常に声を出す', '取るボールは必ず「マイ！」'],
  ['サーブ後に動く', 'サーブ位置 ≠ 守備位置'],
  ['肩を読む', '肩が高い＝スパイク、低い＝フェイント'],
  ['低い構え', '膝を曲げ、腕は構える'],
  ['素早いトランジション', '3秒以内でリセット'],
  ['自分のゾーンを守る', '各プレーヤーに責任がある'],
];

type MistakesSection = {
  title: string;
  intro: string;
  mistakes: [string, string][];
};

const MISTAKES_BY_SIZE: Record<TeamSize, MistakesSection> = {
  6: {
    title: '守備ポジショニングの10のよくあるミス',
    intro: 'Mike Hebert（Thinking Volleyball）、John Forman（CoachingVB）、USA Volleyball、FIVBのTop Volleyマニュアルから引いた分類です。',
    mistakes: [
      ['1. ブロックの影に流れ込む', 'ディフェンダーは本能的にブロッカーの後ろに隠れる傾向があり、ブロックの影の周りに位置取らない結果、クロスや「オフ・ザ・ブロック」コースが空いてしまいます。Hebert曰く「creeping into the block shadow」。'],
      ['2. リーディングの誤り', 'ディフェンダーがボールばかり見て、「ボール→セッター→ボール→ヒッター」の順序を踏まない。結果として読みではなく勘で動き、コンタクトの瞬間に停止してバランスを取れていません（「stopped and balanced at the moment of contact」）。'],
      ['3. リベロの位置（奥行き）が不適切', 'ネットに近すぎるとディープなスパイクを守れず、後ろに下がりすぎるとフェイントをカバーできません。原則：リベロの外側の肩をミドルブロッカーの内側の肩にそろえ、ブロックに応じてネットから6〜8m。'],
      ['4. セッター兼ディフェンダーの準備不足', '構えが低すぎたり向きが悪くてボールと相手コートを同時に見られない、ターゲットへ早く離れすぎてZ1に穴ができる、守備から抜けることを知らせる「release call」がない。'],
      ['5. オーバーラップの反則', '最も多いミス：Z6がZ3の前に流れる、Z5がZ6より右にいる、セッターがペネトレーションのためポジションを早く離れる（5-1で反則第1位）。サーバーがボールに触れる瞬間、すべての足が前後・左右の関係を守らなければなりません（規則7.4）。'],
      ['6. レセプション→ディフェンスのトランジション忘れ', 'プレーヤーがWのレセプション陣形に固まり、相手セッターがボールに触れた瞬間にディフェンスのベースポジションへ切り替えていない。Hebert曰く「sluggish recovery after play on the ball」。'],
      ['7. ゾーン6の運用ミス', '「6-up」（ローテーション）、「6-back」（ペリメーター）、「6-deep」の混同。Z6プレーヤーは相手アタックサイドに合わせて横方向にシフトする必要があり、中央に留まりません。digで体を後ろに傾ける（「leaning back」）と踵に重心が乗り反応性が落ちます。'],
      ['8. センターからのクイック攻撃に対するディフェンス失敗', '相手ミドルブロッカーの読みが遅い、バックローが前に詰めていない（クイックでは角度が浅いためZ1とZ5は1m前に出る）、最初のステップが後ろに出てしまう「false stepping」で時間を浪費。'],
      ['9. 親なしのフェイントカバー', 'フェイント担当が明確に割り当てられていない、「standing up on tips」— スパイクに備えて低くなった後、フェイントに対して立ち上がって手を伸ばすため、目の前にボールが落ちる。スパイクに集中して低い構えのままフェイントへ跳び上がる動きが必要です。'],
      ['10. チーム全体の沈黙', '「tip!」「line!」「out!」「mine!」のコールがない、ブロッカーがストレートとクロスの向きを伝えない、サーブ前にオーバーラップを確認するローテーションキャプテンがいません。'],
    ],
  },
  5: {
    title: '5v5でよくあるミス',
    intro: '5v5フォーマット特有のミス（Volleyball Canada、VolleyballXL、6v6ドクトリンからの応用）。',
    mistakes: [
      ['1. 6v6を機械的にコピーする', 'ディフェンダー3人でディープな3ゾーンをカバーすることは可能（2F-3B構成）ですが、下がってくるはずのオフブロッカーが欠ける — 担当が明確でなければ3mゾーンがカバーされません。'],
      ['2. フロントのオフブロッカーがネットに張り付く', 'ブロックコンタクトの後、フロントのオフブロッカーは2〜2.5m下がってフェイントをカバーする必要があります。ネットに留まると、ブロックの後ろのゾーンが完全に空きます。'],
      ['3. ディフェンダー2人が並んで立つ', '3F-2B構成では、ディープなディフェンダー2人は離れて（一人は左、一人は右）位置し、まとめて中央に固まってはいけません。さもないと両サイドラインがさらされます。'],
      ['4. セッターの離脱が早すぎる（ペネトレーション構成）', '2F-3B構成でP1からペネトレーションするセッターは、ボールが守られるまで待ってからターゲットへ走る必要があります — さもないとZ1に穴が空きます。'],
      ['5. フロントとバックの混同', '5人だと、フロントが自分のサイドを守りながら3mライン上に留まる誘惑が強いです — しかしこれだとコートの奥が空きます。フロントはブロックに上がり、バックが奥を守ります。'],
      ['6. リーディングの誤り', '1人少ない分、6v6よりさらに早いリードが要求されます。順序「ボール→セッター→ボール→ヒッター」＋コンタクトの瞬間のバランスのとれた停止。'],
    ],
  },
  4: {
    title: '4v4でよくあるミス',
    intro: '屋内4v4特有のミス（大学リクリエーション、FFVb／Volleyball Canadaのドクトリン、ビーチ4人制）。',
    mistakes: [
      ['1. 孤立したブロッカーとフェイントカバー無し', 'ディフェンダー3人全員が奥に下がり、3〜5mのゾーンが空っぽに。常に誰かをネットから3.5〜4mのフェイント担当にしておく必要があります。'],
      ['2. ディフェンダー2人が一直線', '同じ奥行きで横並び → カットショットが2人の間に落ちる。4v4ではディフェンダーは必ず段差をつける（前後にずらす）か横方向に広げます。'],
      ['3. セッターがボールを守る前にターゲットへ離脱', '早すぎるトランジションがディフェンスに穴を作ります。セッターはボールが救出されたのを確認してからターゲットへ移動します。'],
      ['4. ブロッカーとディフェンダーの間でサインなし', 'ブロッカーは攻撃が始まる前に必ず「ライン」か「クロス」を伝える必要があります。さもないとディフェンダー3人は何をカバーすべきか分からず、各自が即興で動きます。'],
      ['5. フェイントディフェンダーがネットから遠すぎる', '他のバックディフェンダーと一緒に下がってしまい、ショートフェイントをカバーできなくなる。位置はネットから3.5〜4m、軸上 — 7mではありません。'],
      ['6. 「適当な」誰かのブロック', '4v4では位置の悪い（ヒッターから遠い）選手がブロックすると、相手は配置のずれた3人のディフェンダーと対面します。ブロッカーは主要ヒッターと正対する人でなければなりません。'],
      ['7. リーディングの誤り', '1人あたり約40㎡（6v6では20㎡）の担当エリアでは、読みのミスは取り戻せません。予測力が4v4で最も重要なスキルです。'],
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
    title: '3つの主要なディフェンスシステム（FIVB／USAV）',
    warning: {
      label: '⚠ 用語上の注意',
      text: 'フランスでよく耳にする「Wディフェンス」という表現は誤りです。「W-formation」は歴史的に5人のサーブレシーブ陣形を指すもので、ディフェンスシステムではありません。国際的なドクトリン（FIVB、USAV IMPACT、Liskevych、Stone）では、マンナップ（2-1-3）、ペリメーター（2-0-4）、ローテーション（3-2-1）の3つのシステムが区別されます。',
    },
    systems: [
      {
        name: 'マンナップディフェンス（2-1-3）',
        tag: '旧称「Wディフェンス」／レッドディフェンス',
        principe: 'ディフェンダー1人がブロックの後ろの3mライン付近まで上がり、フェイントやロールショットをインターセプトします。ネットにブロッカー2人、オフブロッカーが下がり、ディープなコースを3人でカバーします。',
        forces: ['フェイント、ロールショット、ブロック裏の「ジャンクボール」の卓越したカバー', 'ステップアップした選手がセッターなら攻撃へのトランジションが速い', '若いチームに教えやすい'],
        faiblesses: ['ディープディフェンダーが3人のみ — 強烈なタイトクロスに弱い', 'ブロッカーの間に強打を打たれると容易に抜かれる'],
        indication: '若いチーム、学校レベル、フェイントやチェンジオブペースを多用する戦術的な相手。',
        accent: 'var(--orange)',
      },
      {
        name: 'ペリメーター・ディフェンス（2-0-4)',
        tag: 'ホワイトディフェンス — エリート男子で主流のシステム',
        principe: 'バック4人がネットに開く形でU字を作り、ほぼサイドラインとエンドライン上に位置します — 「片足はラインの上に」（Liskevych）。コート中央は意図的に手放します。',
        forces: ['強打、ストレート、ディープな両コーナーの優れたカバー', '集団移動がシンプル', '現代の国際男子バレーで主流のシステム'],
        faiblesses: ['ブロック裏のショートフェイントに非常に弱い — 3〜5mの中央が空く', '前へ飛び込めるアスレチックなディフェンダーが必要'],
        indication: 'シニア、男子、国際レベル、強烈な相手。',
        accent: 'var(--teal)',
      },
      {
        name: 'ローテーションディフェンス／スライドディフェンス（3-2-1）',
        tag: 'ローテーショナル／スライドディフェンス',
        principe: 'ディープな3人が相手アタックサイドへスライドします：オポジット側のバック選手がブロック裏のフェイントカバーへ上がり、センターは攻撃されたラインへスライド、攻撃サイドのディフェンダーはショートクロスを取ります。',
        forces: ['ディープラインとフェイントの両方を同時に優れてカバー', '非常に適応性の高いシステム', 'セッターがP1にいるときのトランジションが速い'],
        faiblesses: ['ディープのディフェンダーが1人少なくなる（1人がフェイント専任）', '反対側の対角コーナーが弱い', '高いリーディングと連携スキルが必要'],
        indication: 'パワーとライン／フェイントを混ぜてくる相手；中級〜エリートレベル。',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['マンナップ 2-1-3', 'ペリメーター 2-0-4', 'ローテーション 3-2-1'],
    tableRows: [
      ['ブロック裏に1人上げる', 'あり', 'なし', 'あり'],
      ['ディープディフェンダー', '3人', '4人', '2人'],
      ['フェイントカバー', '★★★', '★', '★★'],
      ['強打カバー', '★★', '★★★', '★★'],
      ['ディープラインカバー', '★★', '★★', '★★★'],
      ['タイトクロスカバー', '★', '★★★', '★★'],
      ['典型的なリベロ位置', 'Z5またはZ6', 'Z5（ライン上）', 'Z5がスライド'],
      ['複雑さ', '低', '中', '高'],
    ],
    footer: {
      strong: '選択は正統性の問題ではありません： ',
      text: '相手の攻撃プロファイルと自チームのディフェンダーの能力によって決まります。現代のディフェンスは陣形よりもリードによって定義されます — 「ボール→セッター→ボール→ヒッター」の視覚的シーケンスとコンタクト瞬間のバランスのとれた停止です。',
    },
  },
  5: {
    title: '5v5の3つのディフェンスシステム',
    warning: {
      label: '⚠ FIVB非公式フォーマット',
      text: '屋内5v5にはFIVBやFFVbの専用ルールブックがありません。これら3つのシステムは、VolleyballXL、The Art of Coaching Volleyball、Volleyball Canadaが文書化した6v6からの論理的な応用です。公式の5v5技術マニュアルは存在しないため、チーム構成（2-3または3-2）に応じてシステムを選んでください。',
    },
    systems: [
      {
        name: '1-1-3システム',
        tag: 'ブロッカー1人＋フェイントカバー1人＋ディープディフェンダー3人',
        principe: '2F-3B構成（フロント2人、バック3人）に適応。ブロッカーが単独で跳び、2人目のフロントがオフブロッカーとして2〜3m下がってフェイントを担当、ディープ3人がライン、軸、ロングクロスをカバーします。',
        forces: ['6v6のペリメーターと同様にディープ3人 — 強打に対する良いカバー', '6v6 5-1に最も近い構成（6v6への移行の準備）', 'オフブロッカーがフェイントをカバー'],
        faiblesses: ['1枚ブロックのみ → 強烈なヒッターに対して脆弱', '2〜3m下がるオフブロッカーは非常に反応的でなければならない'],
        indication: '2F-3B構成（ペネトレーションセッター）、中程度のパワーの相手。6v6への教育的移行に推奨されるシステム。',
        accent: 'var(--teal)',
      },
      {
        name: '2-1-2システム',
        tag: 'ブロッカー2人＋フェイント1人＋ディープディフェンダー2人',
        principe: '3F-2B構成（フロント3人、バック2人）に適応。ネットで2枚ブロック、フロント中央がネットから2〜3mでフェイントをカバー、ディープ2人がロングクロスとストレートを取ります。',
        forces: ['6v6と同様の2枚ブロック — 強打に対して大幅に効果的', 'カウンター攻撃のためにネットに3人の攻撃者'],
        faiblesses: ['ディープが2人のみ → 9mのバックコートは非常にカバーが難しい', 'バック2人への高い体力要求'],
        indication: '3F-2B構成、非常に強力なチーム相手。セットの終盤で1ポイントが重要な場面で優先。',
        accent: 'var(--orange)',
      },
      {
        name: '1-2-2システム',
        tag: 'マンナップの応用（6v6の2-1-3に相当）',
        principe: '単独ブロッカー＋フロントゾーン担当2人（フェイント＋ブロック裏）＋ディープディフェンダー2人。相手のフェイントが多い場合や初心者チームに適応します。',
        forces: ['ショートフェイントの優れたカバー（フロントゾーン担当2人）', '相手にとってフェイントを活用しにくい'],
        faiblesses: ['ディープディフェンダーが2人のみ → 強打が難しい', '2人のフロントゾーン担当の連携が必要'],
        indication: 'フェイントを多用する相手；女子バレー、ジュニアカテゴリー、テクニカルなチーム。',
        accent: 'var(--plum)',
      },
    ],
    tableHeaders: ['1-1-3', '2-1-2', '1-2-2（マンナップ）'],
    tableRows: [
      ['ブロッカー', '1人', '2人', '1人'],
      ['フロントゾーン担当', '1人（オフブロッカー）', '1人（フェイント）', '2人（フェイント＋ブロック裏）'],
      ['ディープディフェンダー', '3人', '2人', '2人'],
      ['フェイントカバー', '★★', '★★', '★★★'],
      ['強打カバー', '★★', '★★★', '★★'],
      ['バックコートカバー', '★★★', '★★', '★★'],
      ['対応する構成', '2F-3B', '3F-2B', '2F-3B／3F-2B'],
      ['複雑さ', '低', '中', '高'],
    ],
    footer: {
      strong: '5v5の推奨： ',
      text: 'ペネトレーションセッターを伴う2F-3B構成での1-1-3システムは6v6に最も近いディフェンスです — 教育的移行に最適。2-1-2は本当にパワフルなヒッターに対してのみ正当化されます。',
    },
  },
  4: {
    title: '4v4の3つのディフェンスシステム',
    warning: {
      label: '⚠ FIVB非公式フォーマット',
      text: '屋内4v4には公式のFIVBルールブックがありません。これら3つのシステムは、大学リクリエーションの実践（米国）、FFVb／Volleyball Canadaの教育的移行マニュアル、ビーチ文献（Brandon Joyner、Better at Beach）から来ています。4人だと各ディフェンダーは約30〜40㎡をカバーします（6v6では20㎡）— 予測力が最も重要なスキルです。',
    },
    systems: [
      {
        name: 'Aシステム：1枚ブロック＋ディフェンダー3人',
        tag: '屋内4v4で最も一般的',
        principe: '1人が主要ヒッターと正対してブロックに上がります。残り3人は分担：フェイント担当（ネットから3〜4m、軸上）、クロス担当（7〜7.5m、右ライン、ロングクロス）、ライン担当（7〜7.5m、ブロックの影）。',
        forces: ['フェイント、ストレート、ロングクロスを同時にカバー', '4v4で最もバランスがとれている', 'ブロッカーのライン／クロスサインが非常に効果的'],
        faiblesses: ['1枚ブロック — 強烈なヒッターに弱い', '下がらない規律あるフェイントディフェンダーが必要'],
        indication: '同等または中程度のレベルの相手。4v4で最も汎用的な構成（ダイヤモンドフォーメーションまたは3-1ライン）。',
        accent: 'var(--orange)',
      },
      {
        name: 'Bシステム：2枚ブロック＋ディフェンダー2人',
        tag: '2枚ブロック（4v4では珍しい）',
        principe: 'フロント2人が主要ヒッターと正対して一緒に上がります。バック2人はそれぞれ：1人はライン側（7m、ラインから1m）、もう1人は軸からクロス側にややずれた位置。フェイントはカバーされません。',
        forces: ['2枚ブロックで強打に対して大幅に効果的', '相手ヒッターに最大限のプレッシャー'],
        faiblesses: ['フロアのディフェンダーが2人のみ → すべてをカバーするのは不可能', 'ブロック裏のフェイントが完全に無防備', '選択を強いる：ストレートかクロスのどちらか、両方は無理'],
        indication: 'フィネスを持たない非常にパワフルなヒッターに対してのみ（フェイントなし）。ボックス2-2または3-1ライン構成。',
        accent: 'var(--plum)',
      },
      {
        name: 'Cシステム：ブロックなし',
        tag: 'ローディフェンス（スパイクしない相手向け）',
        principe: 'ブロックに上がる選手なし。4人全員がディープを守る：ミッドコート2人（3〜4m）がフェイント担当、ディープ2人（7〜8m）が深いボール担当。セッターが4人目のディフェンダーとして機能します。',
        forces: ['コートの奥行き全体をカバー', 'スローなラリーに適応'],
        faiblesses: ['相手が本気で打ち始めた瞬間に逆効果（スパイクが抵抗なく抜ける）', 'ネットでのプレッシャーなし'],
        indication: '学校レベル、初心者レクリエーション、スパイクしない相手。相手がパワーを発揮し始めたら避ける。',
        accent: 'var(--teal)',
      },
    ],
    tableHeaders: ['Aシステム', 'Bシステム', 'Cシステム'],
    tableRows: [
      ['ブロッカー', '1人', '2人', '0人'],
      ['ディープディフェンダー', '3人', '2人', '4人'],
      ['フェイントカバー', '★★', '★', '★★★'],
      ['強打カバー', '★★', '★★★', '★（ブロックなし）'],
      ['ディープラインカバー', '★★', '★★', '★★'],
      ['ロングクロスカバー', '★★★', '★★', '★★'],
      ['推奨対戦相手', '全レベル', '非常にパワフル', 'スパイクしない'],
      ['複雑さ', '低', '中', '低'],
    ],
    footer: {
      strong: '4v4の推奨： ',
      text: 'Aシステム（1枚ブロック＋ディフェンダー3人）はほぼ普遍的なデフォルトです。Bシステムは本当にパワフルなヒッターに対してセットの終盤でのみ正当化されます。Cシステムは初心者レクリエーションレベルでのみ機能します — 相手がスパイクし始めた瞬間にAシステムに戻してください。',
    },
  },
};

const EXERCICES = [
  { title: '状況のリーディング', level: '初級', duration: '10分', materiel: 'ボールを持つコーチまたはパートナー1人',
    objectif: '攻撃ゾーンを素早く識別する',
    steps: ['コーチがネットの向こう側でゾーン4、3、または2に立ちます', 'あなたはコート中央からスタート', 'コーチがゾーンを告げてボールをトスします', '2〜3秒以内に守備ゾーンに到達する', 'ゾーンを変えて20回繰り返す'] },
  { title: 'トスに応じた前進／後退', level: '中級', duration: '15分', materiel: 'セッター1人、ヒッター1人、複数のディフェンダー',
    objectif: 'トスの質に基づいて位置を調整する',
    steps: ['セッターがヒッターに様々な質のトスを上げます', 'ネットに近いトス → 後ろに下がる（強打が予想される）', 'ネットから遠いトス → 前に出る（フェイントの可能性）', 'ヒッターが攻撃しあなたが守る', 'コーチが毎回ポジションを修正します'] },
  { title: '守備のコミュニケーション', level: '全レベル', duration: '10分', materiel: 'チーム全員',
    objectif: '自動的な声出しを身につける',
    steps: ['自分のフォーマット（4v4、5v5、6v6）で試合をし、すべてのコールを大声で', 'ペナルティ：自分のボールで「マイ！」と叫ばなかったら-1点', 'ボーナス：ラリー中チーム全員が声を出せば+1点', '各選手は相手の攻撃ゾーンを告知する'] },
  { title: 'フェイントに対するディフェンス', level: '中級', duration: '15分', materiel: 'ヒッター1人、バックディフェンダー3人',
    objectif: 'ショートボールのディフェンスを向上させる',
    steps: ['ヒッターはフェイントとロールショットのみを行います', 'ディフェンダー全員が前に出る（3〜4m）', '目標：10球中8球を救出する', '次に交互に：フェイント5、強打5で適応力を鍛える'] },
  { title: '素早いトランジション', level: '上級', duration: '20分', materiel: 'チーム全員',
    objectif: '攻撃と守備の切り替えを習得する',
    steps: ['通常のプレーですがコーチがトランジションを計測', '目標：3秒以内に守備位置につく', '遅すぎたらチームで腕立て5回、やり直し', 'ラリーのテンポを徐々に上げる'] },
  { title: 'ヒッターのリーディング', level: '上級', duration: '15分', materiel: 'ヒッター1人、ディフェンダー',
    objectif: 'ボディランゲージから予測する',
    steps: ['ヒッターは予告なしにスパイク、フェイント、チップを交互に', 'ヒッターが打つ前にディフェンダーが予測をコール：「スパイク！」「フェイント！」', '予測が正しくかつボールを救出できれば得点', '注目点：肩、助走、ネットに対する位置'] },
];

type GuidePositionnementProps = {
  teamSize?: TeamSize;
  configId?: string;
};

export default function GuidePositionnementJa({ teamSize: teamSizeProp, configId: configIdProp }: GuidePositionnementProps = {}) {
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
      return <div style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.5 }}>この構成では図はご利用いただけません。</div>;
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
        <div style={S.label}>チーム構成</div>
        <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
          フォーマットと戦術構成を選んでください：<strong>ガイド全体の内容</strong>（ポジション、ゾーン、攻撃別ディフェンス）が適応します。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>ゲームフォーマット</div>
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
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5 }}>戦術構成</div>
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
        <div style={S.label}>ディフェンスの基本原則</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: '0 0 10px 0' }}>守備のポジショニングは3つの主要な要素に依存します：</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['自分のポジション（前衛または後衛）', '相手の攻撃ゾーン（ゾーン4、3、2）', '攻撃のタイプ（強打、フェイント、チップ）'].map((pt, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
              <span style={S.bullet}>▸</span>
              <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 1. Positions and zones */}
      <section>
        <h2 style={S.section}>1. ポジションとゾーン — {configuration.shortName}（{teamSize}v{teamSize}）</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {configuration.name}でのチーム配置
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
              /positionsで各ポジションを詳しく見る →
            </Link>
          </div>
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--ink)', paddingLeft: 16, paddingTop: 4, fontSize: 13 }}>
          <strong style={{ color: 'var(--ink)' }}>重要ルール： </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>
            {teamSize === 6 && '後衛の選手（5、6、1）はネットでブロックできません。バックコートで守ります。'}
            {teamSize === 5 && '5人だと各ディフェンダーは約30㎡をカバーします（6v6では20㎡）。リーディングが死活的に重要になります。'}
            {teamSize === 4 && 'リベロなし。各選手が約30〜40㎡を守ります。予測力が最も重要なスキルです。'}
          </span>
        </div>
      </section>

      {/* 2. Positioning by zone */}
      <section>
        <h2 style={S.section}>2. 相手の攻撃ゾーン別ポジショニング</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['zone4', 'zone3', 'zone2'] as const).map(z => (
            <button key={z} onClick={() => setZone(z)} style={zone === z ? btnActive : btnBase}>
              {z === 'zone4' ? 'ゾーン4攻撃' : z === 'zone3' ? 'ゾーン3攻撃' : 'ゾーン2攻撃'}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, textAlign: 'center', marginBottom: 16 }}>
            {teamSize}v{teamSize} · {configuration.shortName} — {
              zone === 'zone4' ? 'ゾーン4からの攻撃（相手の左ウィング）に対するディフェンス' :
              zone === 'zone3' ? 'ゾーン3からの攻撃（センター）に対するディフェンス' :
              'ゾーン2からの攻撃（相手の右ウィング）に対するディフェンス'
            }
          </div>
          {renderZoneTab()}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <span><span style={{ color: 'var(--orange)' }}>■</span> <span style={{ color: 'var(--ink)', opacity: 0.6 }}>担当ゾーン</span></span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>BLK</strong> = ブロック</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>OFF</strong> = オフブロッカー</span>
          <span style={{ color: 'var(--ink)', opacity: 0.6 }}><strong>DEF</strong> = ディフェンス</span>
        </div>
      </section>

      {/* 3. General principles */}
      <section>
        <h2 style={S.section}>3. ポジショニングの一般原則</h2>
        <div style={{ marginBottom: 12 }}>
          <div style={S.labelTeal}>担当ゾーン</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          {[
            { title: '前衛の選手',
              points: ['最優先：ネットでのブロック', 'ブロックしない場合：反対側のストレートを守る', '距離：ネット際またはバックコート'] },
            { title: teamSize === 4 ? '唯一のバックディフェンダー（P1）' : 'ディフェンスの軸（リベロ／P6）',
              points: teamSize === 4
                ? ['位置：中央、約40㎡を担当', '距離：ネットから5〜6m', '役割：唯一の守備の柱、最大限の予測']
                : ['位置：中央、可変', '距離：ネットから5〜6m', '役割：守備の柱、センターをカバー'] },
            { title: 'サイドの後衛ディフェンダー',
              points: ['可変的な役割：前に出るか後ろに下がる', '攻撃側：前に出る（3〜4m）', '反対側：後ろに下がる（6〜7m）'] },
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
            ★ 普遍的なディフェンス原則（4v4／5v5／6v6）
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 12px 0', lineHeight: 1.5 }}>
            これらのHebert、Liskevych、Volleyball Canadaの原則は、コート上の選手数に関係なく適用されます。
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['ブロックが基盤', '後衛ディフェンダーは独立してではなく、ブロックの影と方向を基準に位置取りします。'],
              ['コンタクトの瞬間に停止しバランスを取る', 'ヒッターがボールに触れる時点でまだ動いているディフェンダーは反応性が崩れます（「stopped on contact」）。'],
              ['順序立てた視覚的リーディング', '「ボール→相手セッター→ボール→相手ヒッター」。4v4と5v5では選手が少ない分、さらに早いリーディングが必要です。'],
              ['サインによるコミュニケーション', 'レクリエーションレベルでも、ブロッカーは「ライン」または「クロス」を伝える必要があります — そうでないと後衛ディフェンダーは何をカバーすべきか分かりません。'],
              ['フロントゾーンのカバー', 'ブロック裏の3〜5mを誰かがカバーしなければなりません — 縮小フォーマット（4v4／5v5）で最も軽視されるゾーンです。'],
              ['素早いトランジション', 'セッターは、ボールが守られたことが確認されるまで決してターゲットへ離脱してはなりません（「release call」）。'],
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
        <h2 style={S.section}>4. ヒッターのリーディング：視覚的な手がかり</h2>
        <div style={{ ...S.card, marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            ポジショニングは見えるものに合わせて調整します。重要な手がかりは以下のとおりです：
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
          <strong style={{ color: 'var(--ink)' }}>プロのヒント： </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>相手のサーブ後の2秒間、視線をセッターに向け、次に攻撃に行くヒッターへ即座に向けてください。</span>
        </div>
      </section>

      {/* 5. When to step up / drop back */}
      <section>
        <h2 style={S.section}>5. いつ前に出る／後ろに下がるか？</h2>
        <div style={S.card}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.5, marginBottom: 14 }}>クイック判断ツリー</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderLeft: '4px solid var(--orange)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--orange)', letterSpacing: '0.08em' }}>前に出る（ネットから3〜4m）状況：</div>
              {[
                'ヒッターと同じサイドにいる',
                'ヒッターがネットから遠い（悪いトス）',
                'フェイントやロールショットを予想する',
                'ブロックが強固 — 強打が通りにくい',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                  <span style={S.bulletOrange}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                </div>
              ))}
            </div>
            <div style={{ borderLeft: '4px solid var(--ink)', paddingLeft: 16, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.08em' }}>後ろに下がる（ネットから6〜7m）状況：</div>
              {[
                'ヒッターと反対側にいる',
                'ヒッターがネットに近い良いトス',
                'ヒッターが強烈または長身',
                'ブロックが弱い（1枚ブロックのみ）',
                'クロス（最長コース）を守る',
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
        <h2 style={S.section}>7. サーブ時のポジショニング</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            <strong>サーブ時の配置は守備位置とは異なります。 </strong>
            サーブが打たれた瞬間に位置を取り直す必要があります。
          </p>
        </div>
        <div style={S.card}>
          <div style={{ ...S.labelTeal, marginBottom: 12 }}>サーブ→ディフェンスのトランジション</div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['自チームがサーブ', 'ローテーションのポジションにいる'],
              ['サーバーが打つ', '相手セッターを見る'],
              ['セッターがボールに触れる', '自分の守備ゾーンに向けて動く'],
              ['ヒッターが跳ぶ', '最終位置で反応する準備が整う'],
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
        <h2 style={S.section}>8. ディフェンスのコミュニケーション</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>沈黙のディフェンスは無効なディフェンスです。</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { moment: '相手の攻撃前', calls: [['「ナンバー4！」', '攻撃が来るゾーンを告知'], ['「ブロック2枚！」', 'ブロッカーの人数を示す'], ['「ライン空き！」', 'ブロックがストレートをカバーしていない場合'], ['「前に出る！」／「後ろに下がる！」', '自分の動きを告知']] },
            { moment: 'プレー中', calls: [['「マイ！」／「俺が行く！」', '自分がボールを取る（最も重要）'], ['「ユア！」／「お前！」', 'チームメイトに譲る'], ['「アウト！」', 'ボールはアウト、触らない'], ['「ブロック！」', 'ブロックしたらコール']] },
            { moment: '行動後', calls: [['「カバー！」', '攻撃カバーを要請'], ['「フリー！」', 'フリーボール、リセット'], ['「ステイ！」', 'ディフェンスをそのまま維持']] },
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
          <strong style={{ color: 'var(--ink)' }}>黄金ルール： </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.75 }}>2人の選手の間で迷ったときは、前にいる選手が必ずボールを取ります。</span>
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
                    <div style={S.labelTeal}>強み</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.forces.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={S.bullet}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.55 }}>弱み</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {sys.faiblesses.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                          <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                          <span style={{ color: 'var(--ink)', opacity: 0.6 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: sys.accent, marginTop: 6 }}>
                      使用場面： <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{sys.indication}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison table */}
              <div style={{ ...S.card, marginTop: 14, overflowX: 'auto' }}>
                <div style={{ ...S.label, marginBottom: 10 }}>総合比較表</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', opacity: 0.6 }}>基準</th>
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
        <h2 style={S.section}>10. 攻撃 ↔ ディフェンスのトランジション</h2>
        <div style={{ ...S.card, marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>
            バレーボールは素早いトランジションの競技です。攻撃と守備を絶えず切り替えます。
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: '攻撃→ディフェンスのトランジション', items: [['チームメイトが攻撃', '守備の心構えをする'], ['ボールが返ってくる', '誰が攻撃するかを即座に識別'], ['素早い移動', '守備ゾーンに到達（最大2〜3秒）'], ['低い構え', '膝を曲げ、飛び込む準備']] },
            { label: 'ディフェンス→攻撃のトランジション', items: [['ボールを守る', 'セッターへ正確にパス'], ['前衛の場合', 'ネットへ走って攻撃またはブロック'], ['後衛の場合', '少し下がって攻撃カバーの準備'], ['攻撃のカバー', 'ヒッターを半円で囲む（2〜3m離れて）']] },
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
        <h2 style={S.section}>11. 上達のための練習</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{i + 1}. {ex.title}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 8px', border: '1.5px solid var(--ink)', color: 'var(--ink)', background: 'var(--cream)', flexShrink: 0 }}>{ex.level}</span>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, marginBottom: 6 }}>
                所要時間：{ex.duration} · 用具：{ex.materiel}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 8 }}>
                目的： <span style={{ textTransform: 'none', color: 'var(--ink)', opacity: 0.75 }}>{ex.objectif}</span>
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
        <h2 style={S.section}>12. ディフェンダーの10の戒め</h2>
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
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>ヒッターと同じサイド</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--orange)', marginBottom: 4 }}>→ 前に出る（3〜4m）</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>フェイントとロールショットを守る</div>
            </div>
            <div style={{ border: '2.5px solid var(--ink)', background: 'var(--paper)', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>ヒッターと反対側</div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>→ 後ろに下がる（6〜7m）</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.6 }}>ロングクロスを守る</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink)' }}>結論</div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            ディフェンスのポジショニングは練習と経験を通じて身につきます。最初のうちにミスをしても落ち込まないでください — プロでも常にポジションを調整しています。
          </p>
          <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', margin: 0 }}>
            鍵：基本ルールを適用する（同サイド＝前に出る、反対側＝後ろに下がる）、ヒッターを見る、チームメイトと声を出し合う、そしてボールに飛び込むことを決して恐れない。
          </p>
          <p style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, color: 'var(--ink)', margin: 0, letterSpacing: '0.06em' }}>ディフェンスが試合を制する。</p>
        </div>
      </section>

    </div>
  );
}
