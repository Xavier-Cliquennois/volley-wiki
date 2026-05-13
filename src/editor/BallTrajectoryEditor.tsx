// Interactive side-view of the ball flight: the author drags the arrival
// point (right) and the apex point (top) directly on the diagram. Both snap
// to fixed levels (Sol/Hanche/Filet/Cloche for arrival; multiple steps up to
// 6 m for the apex), so the result is always a sensible value.
//
// On the first card (no previous step), the diagram collapses to a single
// vertical track with just the arrival point — there's no trajectory yet.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BallCurve } from '../scenarios/types';

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: '"Bungee", sans-serif',
  fontSize: 10,
  letterSpacing: '0.12em',
  color: 'var(--ink)',
  opacity: 0.6,
  textTransform: 'uppercase',
  marginBottom: 8,
  display: 'block',
};

const GHOST_BTN: React.CSSProperties = {
  border: '2px solid var(--ink)',
  background: 'var(--cream)',
  color: 'var(--ink)',
  fontFamily: '"DM Mono", monospace',
  fontSize: 11,
  padding: '5px 9px',
  cursor: 'pointer',
};

const CURVE_HINTS: Record<BallCurve, string> = {
  arc: 'Trajectoire en cloche symétrique — passes hautes, manchettes longues.',
  flat: 'Ligne droite — smashes, manchettes tendues.',
  floater: 'Montée lente puis chute brusque — service flottant qui « tombe ».',
};

const CURVE_LABELS: Record<BallCurve, string> = {
  arc: 'Cloche',
  flat: 'Tendu',
  floater: 'Floater',
};

// Arrival altitude levels — same labels/colours as the old BallHeightPicker.
const ARRIVAL_LEVELS = [
  { key: 'cloche', label: 'Cloche', y: 4.0, color: '#3498db' },
  { key: 'filet',  label: 'Filet',  y: 2.5, color: '#e67e22' },
  { key: 'hanche', label: 'Hanche', y: 1.0, color: '#f0c84c' },
  { key: 'sol',    label: 'Sol',    y: 0.0, color: '#5fb37e' },
] as const;

// Apex levels — five steps spanning typical volleyball trajectories.
// Filtered at runtime to never go below the departure height (an apex below
// the starting point would mean the ball goes down then up, which is silly).
const APEX_LEVELS_FULL = [
  { label: 'Tendu',  y: 2.5 },
  { label: 'Demi',   y: 3.5 },
  { label: 'Haute',  y: 4.5 },
  { label: 'Cloche', y: 5.5 },
  { label: 'Lobée',  y: 6.0 },
] as const;

const MAX_Y = 6;
// SVG viewport — H is generous so a 6 m parabola actually looks like a parabola.
const W = 320;
const H = 220;
const PAD_LEFT = 56;   // space for left labels
const PAD_RIGHT = 64;  // space for right labels
const PAD_TOP = 18;
const PAD_BOTTOM = 32;
const PLOT_W = W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = H - PAD_TOP - PAD_BOTTOM;

function yToPx(m: number): number {
  return PAD_TOP + (1 - m / MAX_Y) * PLOT_H;
}

function pxToY(px: number): number {
  const m = (1 - (px - PAD_TOP) / PLOT_H) * MAX_Y;
  return Math.max(0, Math.min(MAX_Y, m));
}

function snapToNearest(value: number, options: number[]): number {
  let best = options[0];
  for (const o of options) {
    if (Math.abs(o - value) < Math.abs(best - value)) best = o;
  }
  return best;
}

export type BallTrajectoryEditorProps = {
  curve: BallCurve;
  apex: number;
  toHeight: number;
  fromHeight: number | undefined; // undefined = first card, no trajectory
  onSetCurve: (c: BallCurve) => void;
  onSetApex: (apex: number) => void;
  onSetHeight: (y: number) => void;
};

export function BallTrajectoryEditor(props: BallTrajectoryEditorProps) {
  const { curve, apex, toHeight, fromHeight, onSetCurve, onSetApex, onSetHeight } = props;
  const showTrajectory = fromHeight !== undefined;
  const departure = fromHeight ?? toHeight;
  // Apex must be STRICTLY above the highest endpoint — otherwise the curve
  // would dip below the chord and look like the ball goes down then up,
  // which never happens in real volley flights.
  const minApexFloor = Math.max(departure, toHeight);
  const apexLevels = APEX_LEVELS_FULL.filter(l => l.y > minApexFloor + 0.01);

  // Self-correct when an endpoint move makes the current apex invalid (too
  // low). Snap up to the lowest still-valid level. Skipped when the curve is
  // flat (apex is unused) or when there's no valid level (shouldn't happen
  // with our presets since arrival caps at 4 m and apex tops at 6 m).
  useEffect(() => {
    if (!showTrajectory || curve === 'flat') return;
    if (apex > minApexFloor + 0.01) return;
    if (apexLevels.length === 0) return;
    onSetApex(apexLevels[0].y);
  }, [showTrajectory, curve, apex, minApexFloor, apexLevels, onSetApex]);

  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<'arrival' | 'apex' | null>(null);
  // Hover focus on a draggable handle — used to show/hide the matching level
  // lines so the diagram doesn't drown the user in irrelevant guides.
  const [hovered, setHovered] = useState<'arrival' | 'apex' | null>(null);
  // The "active" handle is whatever is being dragged, falling back to hover.
  const focus = dragging ?? hovered;

  const updateFromPointer = useCallback((target: 'arrival' | 'apex', clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const localY = (clientY - rect.top) * (H / rect.height);
    const m = pxToY(localY);
    if (target === 'arrival') {
      onSetHeight(snapToNearest(m, ARRIVAL_LEVELS.map(l => l.y)));
    } else {
      const allowed = apexLevels.map(l => l.y);
      if (allowed.length === 0) return;
      onSetApex(snapToNearest(m, allowed));
    }
  }, [onSetHeight, onSetApex, apexLevels]);

  const startDrag = (target: 'arrival' | 'apex') => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(target);
    updateFromPointer(target, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromPointer(dragging, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {
      // pointer may already have been released by the browser
    }
    setDragging(null);
  };

  // Anchor positions in the plot — the departure point sits at the left edge,
  // arrival at the right edge. For the first-card case, both collapse onto
  // the centre so the diagram becomes a vertical "thermometer".
  const xLeft = PAD_LEFT;
  const xRight = W - PAD_RIGHT;
  const xMid = (xLeft + xRight) / 2;
  const xArrival = showTrajectory ? xRight : xMid;
  const xDeparture = xLeft;
  const yArrival = yToPx(toHeight);
  const yDeparture = showTrajectory ? yToPx(departure) : yArrival;
  const yApex = yToPx(apex);

  // Net height in metres — a real volley flight HAS to clear it. The flat
  // trajectory bumps slightly above the net even when both endpoints sit
  // below it, so the curve is never physically impossible.
  const NET_Y = 2.5;
  const NET_CLEARANCE = 0.3;

  // Build the trajectory path — only meaningful when showTrajectory is true.
  let pathD = '';
  if (showTrajectory) {
    if (curve === 'flat') {
      const realMax = Math.max(departure, toHeight);
      if (realMax >= NET_Y + NET_CLEARANCE) {
        pathD = `M ${xDeparture} ${yDeparture} L ${xArrival} ${yArrival}`;
      } else {
        // Both endpoints below net height → arch slightly over to clear it.
        const yPeak = yToPx(NET_Y + NET_CLEARANCE);
        const ctrlY = 2 * yPeak - (yDeparture + yArrival) / 2;
        pathD = `M ${xDeparture} ${yDeparture} Q ${xMid} ${ctrlY} ${xArrival} ${yArrival}`;
      }
    } else if (curve === 'arc') {
      // Symmetric parabola: control point above the chord, scaled so the curve
      // peaks at apex height in the middle of the flight.
      const ctrlY = 2 * yApex - (yDeparture + yArrival) / 2;
      pathD = `M ${xDeparture} ${yDeparture} Q ${xMid} ${ctrlY} ${xArrival} ${yArrival}`;
    } else {
      // Floater: ease-out climb to a late peak (~70 %), then sharp drop.
      const xPeak = xDeparture + (xArrival - xDeparture) * 0.7;
      pathD = `M ${xDeparture} ${yDeparture} Q ${(xDeparture + xPeak) / 2} ${yApex} ${xPeak} ${yApex} T ${xArrival} ${yArrival}`;
    }
  }

  return (
    <div>
      <span style={SECTION_LABEL}>Vol depuis la carte précédente</span>
      <p style={{ margin: '0 0 8px 0', fontSize: 11, color: 'var(--ink)', opacity: 0.55, fontFamily: '"DM Mono", monospace', lineHeight: 1.4 }}>
        {showTrajectory
          ? 'Glisse les points pour régler la trajectoire entre les deux cartes.'
          : 'Glisse le point pour choisir la hauteur de départ du ballon.'}
      </p>

      {/* Curve type buttons — only meaningful when there is a flight to shape */}
      {showTrajectory && (
        <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['arc', 'flat', 'floater'] as BallCurve[]).map(c => {
            const isActive = curve === c;
            return (
              <button
                key={c}
                style={{
                  ...GHOST_BTN,
                  flex: '1 1 80px',
                  background: isActive ? 'var(--orange)' : 'var(--cream)',
                  color: isActive ? '#fff' : 'var(--ink)',
                  borderColor: isActive ? 'var(--orange)' : 'var(--ink)',
                }}
                onClick={() => onSetCurve(c)}
                title={CURVE_HINTS[c]}
              >
                {CURVE_LABELS[c]}
              </button>
            );
          })}
        </div>
      )}

      {/* Interactive SVG */}
      <div style={{ background: 'var(--cream)', border: '2px solid var(--ink)', padding: 6 }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ display: 'block', touchAction: 'none', cursor: dragging ? 'grabbing' : 'default' }}
        >
          {/* Plot box */}
          <rect
            x={PAD_LEFT}
            y={PAD_TOP}
            width={PLOT_W}
            height={PLOT_H}
            fill="rgba(255,255,255,0.4)"
            stroke="rgba(26,24,18,0.15)"
          />

          {/* Arrival level lines (left side) — only shown when manipulating
              the arrival point. The "Filet" line is always visible as a
              constant reference (the net height). */}
          {ARRIVAL_LEVELS.map(level => {
            const isFilet = level.key === 'filet';
            const showAll = focus === 'arrival';
            if (!showAll && !isFilet) return null;
            const y = yToPx(level.y);
            const isCurrent = Math.abs(level.y - toHeight) < 0.01;
            return (
              <g key={`arr-${level.key}`} style={{ cursor: 'pointer' }} onClick={() => onSetHeight(level.y)}>
                <line
                  x1={PAD_LEFT}
                  y1={y}
                  x2={W - PAD_RIGHT}
                  y2={y}
                  stroke={level.color}
                  strokeWidth={isCurrent ? 1.5 : 1}
                  strokeDasharray={isCurrent ? '0' : '2 4'}
                  opacity={isCurrent ? 0.6 : 0.35}
                />
                <text
                  x={PAD_LEFT - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily='"DM Mono", monospace'
                  fill={isCurrent ? level.color : 'rgba(26,24,18,0.55)'}
                  fontWeight={isCurrent ? 700 : 400}
                >
                  {level.label}
                </text>
              </g>
            );
          })}

          {/* Apex level lines (right side) — only shown while focusing the
              apex handle, so the diagram stays clean the rest of the time. */}
          {showTrajectory && curve !== 'flat' && focus === 'apex' && apexLevels.map(level => {
            const y = yToPx(level.y);
            const isCurrent = Math.abs(level.y - apex) < 0.01;
            return (
              <g key={`apex-${level.label}`} style={{ cursor: 'pointer' }} onClick={() => onSetApex(level.y)}>
                <line
                  x1={PAD_LEFT}
                  y1={y}
                  x2={W - PAD_RIGHT}
                  y2={y}
                  stroke="var(--orange)"
                  strokeWidth={isCurrent ? 1.5 : 1}
                  strokeDasharray={isCurrent ? '5 3' : '2 4'}
                  opacity={isCurrent ? 0.7 : 0.25}
                />
                <text
                  x={W - PAD_RIGHT + 6}
                  y={y + 3}
                  textAnchor="start"
                  fontSize="9"
                  fontFamily='"DM Mono", monospace'
                  fill={isCurrent ? 'var(--orange)' : 'rgba(26,24,18,0.55)'}
                  fontWeight={isCurrent ? 700 : 400}
                >
                  {level.label}
                </text>
              </g>
            );
          })}

          {/* The trajectory itself */}
          {showTrajectory && (
            <path d={pathD} fill="none" stroke="var(--ink)" strokeWidth={2.5} />
          )}

          {/* Vertical drag track for the apex point — only when there's a curve */}
          {showTrajectory && curve !== 'flat' && (
            <g
              onPointerDown={startDrag('apex')}
              onPointerEnter={() => setHovered('apex')}
              onPointerLeave={() => setHovered(h => (h === 'apex' ? null : h))}
              style={{ cursor: dragging === 'apex' ? 'grabbing' : 'grab' }}
            >
              {/* Big invisible hitbox for easier grabbing */}
              <rect x={xMid - 14} y={yApex - 14} width={28} height={28} fill="transparent" />
              <circle
                cx={xMid}
                cy={yApex}
                r={dragging === 'apex' ? 9 : 8}
                fill="var(--orange)"
                stroke="var(--ink)"
                strokeWidth={2.5}
              />
              <text
                x={xMid}
                y={yApex - 14}
                textAnchor="middle"
                fontSize="9"
                fontFamily='"DM Mono", monospace'
                fill="var(--orange)"
                fontWeight={700}
              >
                apex {apex.toFixed(1)} m
              </text>
            </g>
          )}

          {/* Departure point (fixed, shows where the previous card left the ball).
              Hidden when there's no previous card. */}
          {showTrajectory && (
            <g>
              <circle cx={xDeparture} cy={yDeparture} r={6} fill="var(--yellow)" stroke="var(--ink)" strokeWidth={1.5} opacity={0.7} />
              <text
                x={xDeparture}
                y={H - 12}
                textAnchor="middle"
                fontSize="9"
                fontFamily='"DM Mono", monospace'
                fill="rgba(26,24,18,0.6)"
              >
                départ
              </text>
              <text
                x={xDeparture}
                y={H - 2}
                textAnchor="middle"
                fontSize="9"
                fontFamily='"DM Mono", monospace'
                fill="rgba(26,24,18,0.6)"
              >
                {departure.toFixed(1)} m
              </text>
            </g>
          )}

          {/* Arrival point — draggable */}
          <g
            onPointerDown={startDrag('arrival')}
            onPointerEnter={() => setHovered('arrival')}
            onPointerLeave={() => setHovered(h => (h === 'arrival' ? null : h))}
            style={{ cursor: dragging === 'arrival' ? 'grabbing' : 'grab' }}
          >
            <rect x={xArrival - 16} y={yArrival - 16} width={32} height={32} fill="transparent" />
            <circle
              cx={xArrival}
              cy={yArrival}
              r={dragging === 'arrival' ? 10 : 9}
              fill="var(--yellow)"
              stroke="var(--ink)"
              strokeWidth={3}
            />
            <text
              x={xArrival}
              y={H - 12}
              textAnchor="middle"
              fontSize="9"
              fontFamily='"DM Mono", monospace'
              fill="rgba(26,24,18,0.85)"
              fontWeight={700}
            >
              {showTrajectory ? 'arrivée' : 'ballon'}
            </text>
            <text
              x={xArrival}
              y={H - 2}
              textAnchor="middle"
              fontSize="9"
              fontFamily='"DM Mono", monospace'
              fill="rgba(26,24,18,0.85)"
              fontWeight={700}
            >
              {toHeight.toFixed(1)} m
            </text>
          </g>
        </svg>
      </div>

      <p style={{ margin: '8px 0 0 0', fontSize: 10, color: 'var(--ink)', opacity: 0.5, fontFamily: '"DM Mono", monospace', lineHeight: 1.4 }}>
        Clique un palier pour aligner directement, ou drag le point.
      </p>
    </div>
  );
}
