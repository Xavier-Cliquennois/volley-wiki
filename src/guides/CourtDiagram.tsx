import { ROLE_COLORS, ZONE_NUM_TO_ROLE } from '../constants/positions';

type PlayerType = 'avant' | 'arriere' | 'libero';

function roleColor(label: string, type: PlayerType): string {
  if (type === 'libero') return ROLE_COLORS.L;
  const n = parseInt(label);
  const key = ZONE_NUM_TO_ROLE[n];
  return key ? ROLE_COLORS[key] : '#8a7a62';
}

export function Player({
  x, y, label, sub, type,
}: {
  x: number; y: number; label: string; sub?: string; type: PlayerType;
}) {
  const bg = roleColor(label, type);
  const fg = bg === ROLE_COLORS.P5 ? '#1a1812' : '#ffffff';
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`, top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: 36, height: 36,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Bungee", sans-serif',
        fontSize: 12, lineHeight: 1.1,
        backgroundColor: bg, color: fg,
        border: '2.5px solid rgba(26,24,18,0.5)',
        borderRadius: '50%',
        boxShadow: '2px 2px 0 rgba(26,24,18,0.35)',
        userSelect: 'none',
        zIndex: 2,
      }}
    >
      {label}
      {sub && <div style={{ fontSize: 8, lineHeight: 1 }}>{sub}</div>}
    </div>
  );
}

export function Zone({
  x, y, w, h, type, posNumber,
}: {
  x: number; y: number; w: number; h: number; type: PlayerType; posNumber?: number;
}) {
  let color = '#8a7a62';
  if (posNumber !== undefined) {
    const key = type === 'libero' ? 'L' : ZONE_NUM_TO_ROLE[posNumber];
    if (key) color = ROLE_COLORS[key];
  } else if (type === 'libero') {
    color = ROLE_COLORS.L;
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`,
        border: `1.5px dashed ${color}`,
        backgroundColor: `${color}1a`,
      }}
    />
  );
}

export function Ball({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`, top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        width: 20, height: 20,
        background: 'var(--yellow)',
        border: '2.5px solid var(--ink)',
        borderRadius: '50%',
        boxShadow: '0 0 0 2.5px var(--cream), 0 0 0 5px var(--orange)',
        zIndex: 10,
      }}
    />
  );
}

export function ZoneLabel({
  x, y, label, type, right,
}: {
  x?: number; y: number; label: string; type: PlayerType; right?: number;
}) {
  const n = parseInt(label.replace(/\D/g, ''));
  let color = '#8a7a62';
  if (type === 'libero') {
    color = ROLE_COLORS.L;
  } else if (!isNaN(n) && ZONE_NUM_TO_ROLE[n]) {
    color = ROLE_COLORS[ZONE_NUM_TO_ROLE[n]];
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: x !== undefined ? `${x}%` : undefined,
        right: right !== undefined ? `${right}%` : undefined,
        top: `${y}%`,
        fontFamily: '"Bungee", sans-serif',
        fontSize: 11,
        pointerEvents: 'none',
        color,
      }}
    >
      {label}
    </div>
  );
}

export function Court({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 420,
      margin: '0 auto',
      background: 'var(--paper)',
      border: '3px solid var(--ink)',
      boxShadow: 'var(--shadow)',
      aspectRatio: '3 / 4',
      overflow: 'hidden',
      backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 43px, rgba(26,24,18,0.04) 43px 44px), repeating-linear-gradient(90deg, transparent 0 43px, rgba(26,24,18,0.04) 43px 44px)',
    }}>
      {/* Net */}
      <div style={{
        position: 'absolute',
        left: -3, right: -3,
        top: '25%', transform: 'translateY(-50%)',
        height: 6,
        background: 'var(--orange)',
        borderTop: '2.5px solid var(--ink)',
        borderBottom: '2.5px solid var(--ink)',
        zIndex: 20,
      }} />
      {/* Labels */}
      <div style={{
        position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
        fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.14em',
        color: 'var(--ink)', opacity: 0.7, zIndex: 10, whiteSpace: 'nowrap',
      }}>
        NOTRE CÔTÉ
      </div>
      <div style={{
        position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
        fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.14em',
        color: 'var(--ink)', opacity: 0.4, zIndex: 10, whiteSpace: 'nowrap',
      }}>
        ADVERSAIRES
      </div>
      {children}
    </div>
  );
}
