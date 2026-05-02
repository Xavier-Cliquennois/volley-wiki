type PlayerType = 'avant' | 'arriere' | 'libero';

const PLAYER_COLORS: Record<PlayerType, string> = {
  avant: 'bg-yellow-400 text-black',
  arriere: 'bg-gray-600 text-white',
  libero: 'bg-gray-300 text-gray-900',
};

const ZONE_COLORS: Record<PlayerType, string> = {
  avant: 'border-yellow-400 bg-yellow-400/10',
  arriere: 'border-gray-500 bg-gray-500/10',
  libero: 'border-gray-300 bg-gray-300/10',
};

export function Player({
  x, y, label, sub, type,
}: {
  x: number; y: number; label: string; sub?: string; type: PlayerType;
}) {
  return (
    <div
      className={`absolute w-9 h-9 flex flex-col items-center justify-center text-xs font-bold -translate-x-1/2 -translate-y-1/2 leading-tight select-none ${PLAYER_COLORS[type]}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {label}
      {sub && <div className="text-[8px] leading-none">{sub}</div>}
    </div>
  );
}

export function Zone({
  x, y, w, h, type,
}: {
  x: number; y: number; w: number; h: number; type: PlayerType;
}) {
  return (
    <div
      className={`absolute border border-dashed ${ZONE_COLORS[type]}`}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
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
  const color = type === 'avant' ? 'text-yellow-400' : type === 'libero' ? 'text-gray-300' : 'text-gray-500';
  return (
    <div
      className={`absolute text-xs font-bold ${color} pointer-events-none`}
      style={{ left: x !== undefined ? `${x}%` : undefined, right: right !== undefined ? `${right}%` : undefined, top: `${y}%` }}
    >
      {label}
    </div>
  );
}

export function Court({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-[440px] mx-auto bg-gray-800 border border-gray-600 aspect-square overflow-hidden">
      {/* Net */}
      <div
        className="absolute left-0 right-0 bg-yellow-400 z-20"
        style={{ top: '50%', height: '3px', transform: 'translateY(-50%)' }}
      />
      {/* Our side label */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-wider z-10">
        Notre côté
      </div>
      {/* Opponent label */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 uppercase tracking-wider z-10">
        Adversaires
      </div>
      {children}
    </div>
  );
}
