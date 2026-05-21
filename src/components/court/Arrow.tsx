import type { CourtArrow, CourtPoint, CourtView } from './types';

// The arrows SVG must share the container's aspect ratio, otherwise
// preserveAspectRatio="meet" introduces letterboxing margins and the SVG
// coordinates no longer line up with the CSS-positioned players above it.
// 'full' view is 3:4, 'our-side' view is 1:1.1 (per VIEW_GEOMETRY in Court.tsx).
const VB_W = 300;
const VB_H_BY_VIEW: Record<CourtView, number> = {
  full: 400,           // 300:400 = 3:4
  'our-side': 330,     // 300:330 = 1:1.1
};

// Player circle is 36 px on a court rendered at up to 420 px wide. The SVG
// uses a 300x400 viewBox with preserveAspectRatio=meet, so 1 SVG unit is roughly
// the court-width / 300 in pixels. 20 SVG units clears the player circle on all
// common screen sizes.
const PLAYER_AVOID_RADIUS_SVG = 20;

// Pull the arrow tip back from its target so the marker stops in front of the
// player circle instead of overlapping it. svgBackoff is in SVG user units.
// The line is allowed to PASS through players along the way — only the
// endpoint is adjusted: if it would land inside any player's avoidance radius,
// pull it back to that player's entry point so the arrowhead stays visible
// just before the circle.
function shortenAvoidingPlayers(
  from: CourtPoint,
  to: CourtPoint,
  players: CourtPoint[],
  svgBackoff: number,
  sx: (n: number) => number,
  sy: (n: number) => number,
): CourtPoint {
  const dxs = sx(to.x) - sx(from.x);
  const dys = sy(to.y) - sy(from.y);
  const len2 = dxs * dxs + dys * dys;
  const len = Math.sqrt(len2);
  if (len < 1) return { x: to.x, y: to.y };

  let t = Math.max(0, (len - svgBackoff) / len);
  const r2 = PLAYER_AVOID_RADIUS_SVG * PLAYER_AVOID_RADIUS_SVG;

  // Iterate so that pulling back for one player doesn't push the endpoint
  // inside a second player further upstream along the line.
  for (let iter = 0; iter <= players.length; iter++) {
    let changed = false;
    for (const p of players) {
      const pxs = sx(p.x) - sx(from.x);
      const pys = sy(p.y) - sy(from.y);
      const ex = t * dxs - pxs;
      const ey = t * dys - pys;
      if (ex * ex + ey * ey >= r2) continue;
      const b = -2 * (dxs * pxs + dys * pys);
      const c = pxs * pxs + pys * pys - r2;
      const disc = b * b - 4 * len2 * c;
      if (disc < 0) continue;
      const tEnter = (-b - Math.sqrt(disc)) / (2 * len2);
      if (tEnter >= 0 && tEnter < t) {
        t = tEnter;
        changed = true;
      }
    }
    if (!changed) break;
  }

  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

type ArrowsProps = {
  arrows: CourtArrow[];
  players: CourtPoint[];
  idSuffix: string;
  view: CourtView;
};

// Arrow visual styles. Each kind has its own stroke, width, dash pattern,
// marker, and default backoff distance.
const ARROW_STYLE = {
  main:     { stroke: '#e2542e', strokeWidth: 4, dash: undefined,   defaultBackoff: 24 },
  alt:      { stroke: '#8a7a62', strokeWidth: 2, dash: '6,5',       defaultBackoff: 18 },
  movement: { stroke: '#1f7a8c', strokeWidth: 2, dash: '2,4',       defaultBackoff: 14 },
} as const;

export function Arrows({ arrows, players, idSuffix, view }: ArrowsProps) {
  if (arrows.length === 0) return null;
  const mainMarkerId = `arrow-main-${idSuffix}`;
  const altMarkerId = `arrow-alt-${idSuffix}`;
  const movementMarkerId = `arrow-movement-${idSuffix}`;
  const vbH = VB_H_BY_VIEW[view];
  const sx = (x: number) => (x / 100) * VB_W;
  const sy = (y: number) => (y / 100) * vbH;

  const markerForKind: Record<'main' | 'alt' | 'movement', string> = {
    main: mainMarkerId,
    alt: altMarkerId,
    movement: movementMarkerId,
  };

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <defs>
        <marker
          id={mainMarkerId}
          markerUnits="userSpaceOnUse"
          markerWidth="14"
          markerHeight="11"
          refX="13"
          refY="5.5"
          orient="auto"
        >
          <polygon points="0 0, 14 5.5, 0 11" fill={ARROW_STYLE.main.stroke} />
        </marker>
        <marker
          id={altMarkerId}
          markerUnits="userSpaceOnUse"
          markerWidth="11"
          markerHeight="8"
          refX="10"
          refY="4"
          orient="auto"
        >
          <polygon points="0 0, 11 4, 0 8" fill={ARROW_STYLE.alt.stroke} />
        </marker>
        <marker
          id={movementMarkerId}
          markerUnits="userSpaceOnUse"
          markerWidth="9"
          markerHeight="7"
          refX="8"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 9 3.5, 0 7" fill={ARROW_STYLE.movement.stroke} />
        </marker>
      </defs>
      {arrows.map(arrow => {
        const kind = arrow.kind ?? 'main';
        const style = ARROW_STYLE[kind];
        const backoff = arrow.backoff ?? style.defaultBackoff;
        const end = shortenAvoidingPlayers(arrow.from, arrow.to, players, backoff, sx, sy);
        // Movement arrows animate with a "marching ants" effect to convey
        // the trajectory the player walks/runs along. Other arrows stay
        // static so the ball trajectory remains the visual anchor.
        const isMovement = kind === 'movement';
        return (
          <line
            key={arrow.id}
            x1={sx(arrow.from.x)}
            y1={sy(arrow.from.y)}
            x2={sx(end.x)}
            y2={sy(end.y)}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            strokeDasharray={style.dash}
            markerEnd={`url(#${markerForKind[kind]})`}
            opacity={arrow.dimmed ? 0.25 : 1}
            style={{ transition: 'opacity 0.12s ease-out' }}
          >
            {isMovement && (
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-12"
                dur="1.4s"
                repeatCount="indefinite"
              />
            )}
          </line>
        );
      })}
    </svg>
  );
}
