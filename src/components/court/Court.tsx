import { useTranslation as useT } from 'react-i18next';
import { ROLE_COLORS, type RoleColorKey } from '../../constants/positions';
import { Arrows } from './Arrow';
import type {
  CourtLayout,
  CourtPlayer,
  CourtProps,
  CourtView,
  CourtZone,
} from './types';

function roleColor(role?: RoleColorKey): string {
  if (!role) return '#8a7a62';
  return ROLE_COLORS[role];
}

function textColorOn(bg: string): string {
  return bg === ROLE_COLORS.P5 ? '#1a1812' : '#ffffff';
}

type ViewGeometry = {
  aspectRatio: string;
  netTopPercent: number;
  threeMeterTopPercent: number;
  showOpponentLabel: boolean;
};

const VIEW_GEOMETRY: Record<CourtView, ViewGeometry> = {
  full: {
    aspectRatio: '3 / 4',
    netTopPercent: 25,
    threeMeterTopPercent: 25 + (75 * 1) / 3,
    showOpponentLabel: true,
  },
  'our-side': {
    aspectRatio: '1 / 1.1',
    netTopPercent: 0,
    threeMeterTopPercent: 33,
    showOpponentLabel: false,
  },
};

// Place a zone label so it never sits under a player circle. The label's `x`
// prop is its LEFT edge (with a small offset applied later) and `y` is its
// TOP. Player circles cover roughly 8.5% x 6.4% of the court; labels are
// short Bungee text — approximate the box as ~16% x 2.5% and check AABB
// overlap. Prefer the zone center; fall back to inset corner candidates.
function pickLabelPosition(zone: CourtZone, players: CourtPlayer[]) {
  const insetX = Math.min(8, zone.w * 0.25);
  const insetY = Math.min(6, zone.h * 0.2);
  const cx = zone.x + zone.w / 2;
  const cy = zone.y + zone.h / 2;

  const candidates = [
    { x: cx, y: cy },
    { x: cx, y: zone.y + zone.h - insetY },
    { x: cx, y: zone.y + insetY },
    { x: zone.x + insetX, y: zone.y + zone.h - insetY },
    { x: zone.x + zone.w - insetX, y: zone.y + zone.h - insetY },
    { x: zone.x + insetX, y: zone.y + insetY },
    { x: zone.x + zone.w - insetX, y: zone.y + insetY },
  ];

  const labelHalfW = 8;
  const labelHalfH = 1.3;
  const playerHalfX = 4.5;
  const playerHalfY = 3.4;

  function isClear(c: { x: number; y: number }) {
    const labelCx = c.x - 5 + labelHalfW;
    const labelCy = c.y + labelHalfH;
    for (const p of players) {
      if (
        Math.abs(labelCx - p.x) < playerHalfX + labelHalfW &&
        Math.abs(labelCy - p.y) < playerHalfY + labelHalfH
      ) return false;
    }
    return true;
  }

  for (const c of candidates) {
    if (isClear(c)) return c;
  }

  let best = candidates[0];
  let bestDist = -Infinity;
  for (const c of candidates) {
    let minDist = Infinity;
    for (const p of players) {
      const dx = c.x - p.x;
      const dy = (c.y - p.y) * (4 / 3);
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minDist) minDist = d;
    }
    if (minDist > bestDist) {
      bestDist = minDist;
      best = c;
    }
  }
  return best;
}

function ZoneShape({ zone }: { zone: CourtZone }) {
  const color = roleColor(zone.role);
  return (
    <div
      style={{
        position: 'absolute',
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        width: `${zone.w}%`,
        height: `${zone.h}%`,
        border: `1.5px dashed ${color}`,
        backgroundColor: `${color}1a`,
      }}
    />
  );
}

function ZoneLabel({
  x, y, label, role,
}: { x: number; y: number; label: string; role?: RoleColorKey }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        fontFamily: '"Bungee", sans-serif',
        fontSize: 11,
        pointerEvents: 'none',
        color: roleColor(role),
      }}
    >
      {label}
    </div>
  );
}

function Ball({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: 20,
        height: 20,
        background: 'var(--yellow)',
        border: '2.5px solid var(--ink)',
        borderRadius: '50%',
        boxShadow: '0 0 0 2.5px var(--cream), 0 0 0 5px var(--orange)',
        zIndex: 10,
      }}
    />
  );
}

function PlayerMarker({ player }: { player: CourtPlayer }) {
  const bg = roleColor(player.role);
  const fg = textColorOn(bg);
  const interactive = !!player.onClick;
  const active = !!player.active;

  const circle = (
    <span
      style={{
        width: 44,
        height: 44,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Bungee", sans-serif',
        fontSize: 13,
        lineHeight: 1.1,
        backgroundColor: bg,
        color: fg,
        border: active ? '3px solid var(--ink)' : '3px solid rgba(26,24,18,0.5)',
        borderRadius: '50%',
        boxShadow: active
          ? '0 0 0 3px var(--yellow), 2px 2px 0 var(--ink)'
          : '2px 2px 0 rgba(26,24,18,0.4)',
        transform: active ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 0.08s, box-shadow 0.08s',
        userSelect: 'none',
      }}
    >
      {player.label}
      {player.sub && <span style={{ fontSize: 8, lineHeight: 1 }}>{player.sub}</span>}
    </span>
  );

  const captionBg = active ? bg : 'rgba(26,24,18,0.55)';
  const captionEl = player.caption ? (
    <span
      style={{
        marginTop: 4,
        fontSize: 9,
        letterSpacing: '0.06em',
        fontFamily: '"DM Mono", monospace',
        color: captionBg,
        whiteSpace: 'nowrap',
      }}
    >
      {player.caption}
    </span>
  ) : null;

  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${player.x}%`,
    top: `${player.y}%`,
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  };

  if (interactive) {
    return (
      <button
        type="button"
        onClick={player.onClick}
        title={player.title}
        style={{
          ...wrapperStyle,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {circle}
        {captionEl}
      </button>
    );
  }

  return (
    <div style={wrapperStyle} title={player.title}>
      {circle}
      {captionEl}
    </div>
  );
}

export function Court({
  layout,
  view = 'full',
  show3mLine = false,
  showSideLabels,
  withShadow = true,
  idSuffix,
}: CourtProps) {
  const geometry = VIEW_GEOMETRY[view];
  const sideLabels = showSideLabels ?? (view === 'full');
  const { t } = useT('common');
  const opponentLabel = t('court.opponentSide').toUpperCase();
  const ourSideLabel = t('court.ourSide').toUpperCase();

  const players = layout.players ?? [];
  const zones = layout.zones ?? [];
  const arrows = layout.arrows ?? [];
  const ball = layout.ball;

  const playerPoints = players.map(p => ({ x: p.x, y: p.y }));

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 420,
        margin: '0 auto',
        background: 'var(--paper)',
        border: '3px solid var(--ink)',
        boxShadow: withShadow ? 'var(--shadow)' : undefined,
        aspectRatio: geometry.aspectRatio,
        overflow: 'hidden',
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent 0 43px, rgba(26,24,18,0.04) 43px 44px), repeating-linear-gradient(90deg, transparent 0 43px, rgba(26,24,18,0.04) 43px 44px)',
      }}
    >
      {/* Net */}
      <div
        style={{
          position: 'absolute',
          left: -3,
          right: -3,
          top: `${geometry.netTopPercent}%`,
          transform: view === 'full' ? 'translateY(-50%)' : 'none',
          height: 6,
          background: 'var(--orange)',
          borderTop: '2.5px solid var(--ink)',
          borderBottom: '2.5px solid var(--ink)',
          zIndex: 20,
        }}
      />

      {/* 3-meter line */}
      {show3mLine && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${geometry.threeMeterTopPercent}%`,
            borderTop: '2px dashed rgba(26,24,18,0.35)',
            zIndex: 1,
          }}
        />
      )}

      {/* Side labels */}
      {sideLabels && (
        <>
          {geometry.showOpponentLabel && (
            <div
              style={{
                position: 'absolute',
                top: 4,
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: '"DM Mono", monospace',
                fontSize: 9,
                letterSpacing: '0.14em',
                color: 'var(--ink)',
                opacity: 0.4,
                zIndex: 10,
                whiteSpace: 'nowrap',
              }}
            >
              {opponentLabel}
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: '"DM Mono", monospace',
              fontSize: 9,
              letterSpacing: '0.14em',
              color: 'var(--ink)',
              opacity: 0.7,
              zIndex: 10,
              whiteSpace: 'nowrap',
            }}
          >
            {ourSideLabel}
          </div>
        </>
      )}

      {/* Zones */}
      {zones.map(z => (
        <ZoneShape key={`zone-${z.id}`} zone={z} />
      ))}

      {/* Ball */}
      {ball && <Ball x={ball.x} y={ball.y} />}

      {/* Arrows (computed under players so the avoidance leaves the player visible) */}
      <Arrows arrows={arrows} players={playerPoints} idSuffix={idSuffix} />

      {/* Zone labels — auto-positioned (with legacy -5 nudge) when no explicit pos */}
      {zones.map(z => {
        if (!z.label) return null;
        let labelX: number;
        let labelY: number;
        if (z.labelPos) {
          labelX = z.labelPos.x;
          labelY = z.labelPos.y;
        } else {
          const auto = pickLabelPosition(z, players);
          labelX = auto.x - 5;
          labelY = auto.y;
        }
        return (
          <ZoneLabel
            key={`zone-label-${z.id}`}
            x={labelX}
            y={labelY}
            label={z.label}
            role={z.labelRole}
          />
        );
      })}

      {/* Players */}
      {players.map(p => (
        <PlayerMarker key={`player-${p.id}`} player={p} />
      ))}
    </div>
  );
}

export type { CourtLayout, CourtProps };
