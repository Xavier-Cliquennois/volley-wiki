import { ROLE_COLORS, ZONE_NUM_TO_ROLE } from '../constants/positions';

type PlayerType = 'avant' | 'arriere' | 'libero';

function roleColor(label: string, type: PlayerType): string {
  if (type === 'libero') return ROLE_COLORS.L;
  const n = parseInt(label);
  const key = ZONE_NUM_TO_ROLE[n];
  return key ? ROLE_COLORS[key] : '#6b7280';
}

export function Player({
  x, y, label, sub, type,
}: {
  x: number; y: number; label: string; sub?: string; type: PlayerType;
}) {
  const bg = roleColor(label, type);
  // Yellow (P5) needs black text for contrast; everything else uses white.
  const fg = bg === ROLE_COLORS.P5 ? '#000000' : '#ffffff';
  return (
    <div
      className="absolute w-9 h-9 flex flex-col items-center justify-center text-xs font-bold -translate-x-1/2 -translate-y-1/2 leading-tight select-none"
      style={{ left: `${x}%`, top: `${y}%`, backgroundColor: bg, color: fg }}
    >
      {label}
      {sub && <div className="text-[8px] leading-none">{sub}</div>}
    </div>
  );
}

export function Zone({
  x, y, w, h, type, posNumber,
}: {
  x: number; y: number; w: number; h: number; type: PlayerType; posNumber?: number;
}) {
  let color = '#6b7280';
  if (posNumber !== undefined) {
    const key = type === 'libero' ? 'L' : ZONE_NUM_TO_ROLE[posNumber];
    if (key) color = ROLE_COLORS[key];
  } else if (type === 'libero') {
    color = ROLE_COLORS.L;
  }
  return (
    <div
      className="absolute border border-dashed"
      style={{
        left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`,
        borderColor: color,
        backgroundColor: `${color}1a`,
      }}
    />
  );
}

export function Ball({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute w-5 h-5 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
}

export function ZoneLabel({
  x, y, label, type, right,
}: {
  x?: number; y: number; label: string; type: PlayerType; right?: number;
}) {
  const n = parseInt(label.replace(/\D/g, ''));
  let color = '#6b7280';
  if (type === 'libero') {
    color = ROLE_COLORS.L;
  } else if (!isNaN(n) && ZONE_NUM_TO_ROLE[n]) {
    color = ROLE_COLORS[ZONE_NUM_TO_ROLE[n]];
  }
  return (
    <div
      className="absolute text-xs font-bold pointer-events-none"
      style={{
        left: x !== undefined ? `${x}%` : undefined,
        right: right !== undefined ? `${right}%` : undefined,
        top: `${y}%`,
        color,
      }}
    >
      {label}
    </div>
  );
}

export function Court({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-[440px] mx-auto bg-gray-800 border border-gray-600 aspect-square overflow-hidden">
      <div
        className="absolute left-0 right-0 bg-yellow-400 z-20"
        style={{ top: '50%', height: '3px', transform: 'translateY(-50%)' }}
      />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-wider z-10">
        Notre côté
      </div>
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 uppercase tracking-wider z-10">
        Adversaires
      </div>
      {children}
    </div>
  );
}
