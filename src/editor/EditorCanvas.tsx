import { useCallback, useRef, useState } from 'react';
import type { EditorPlayer } from './types';

// Court dimensions in metres — matches the 3D scene.
const COURT_HALF_WIDTH = 4.5;
const COURT_HALF_LENGTH = 9; // z ∈ [-9, +9]
// Padding around the court inside the canvas (in metres of margin).
const PADDING = 1.5;
const TOTAL_WIDTH = (COURT_HALF_WIDTH + PADDING) * 2;
const TOTAL_LENGTH = (COURT_HALF_LENGTH + PADDING) * 2;
// Pointer snap, in canvas pixels — prevents pixel-perfect dragging hell.
const SNAP_PX = 5;

// Stroke for any line that represents the ball's motion or attachment —
// matches the ball's high-contrast ring on the canvas so the eye groups all
// ball-related dashed lines together regardless of brick categories around.
const BALL_LINE_COLOR = 'var(--orange)';

// Convert a court coordinate (metres) to a percentage inside the canvas.
function xToPct(xMetres: number): number {
  return ((xMetres + COURT_HALF_WIDTH + PADDING) / TOTAL_WIDTH) * 100;
}
function zToPct(zMetres: number): number {
  // Top-down view: opponent side (z<0) at the top, our side (z>0) at the bottom.
  return ((-zMetres + COURT_HALF_LENGTH + PADDING) / TOTAL_LENGTH) * 100;
}

function pctToX(pctX: number): number {
  return (pctX / 100) * TOTAL_WIDTH - COURT_HALF_WIDTH - PADDING;
}
function pctToZ(pctY: number): number {
  return -((pctY / 100) * TOTAL_LENGTH - COURT_HALF_LENGTH - PADDING);
}

// Clamp to the court area (+ a bit of margin so service positions still fit).
function clampX(x: number): number {
  return Math.max(-COURT_HALF_WIDTH - PADDING + 0.3, Math.min(COURT_HALF_WIDTH + PADDING - 0.3, x));
}
function clampZ(z: number): number {
  return Math.max(-COURT_HALF_LENGTH - PADDING + 0.3, Math.min(COURT_HALF_LENGTH + PADDING - 0.3, z));
}

// A draggable brick anchor (impact/from/to) shown as a coloured ring on the
// court so the author can directly position where their SMASH lands or where
// the COURSE_ELAN ends. Multiple anchors per brick (e.g. course_elan has both
// from and to) get distinct keys so the drag state knows which one moved.
export type BrickMarker = {
  brickId: string;
  // 'impact' | 'to' — see brickAnchorPoints().
  anchorKey: string;
  position: [number, number, number];
  color: string;
  // Short tag rendered inside the ring, e.g. "S" for smash. Only the first
  // letter is shown to keep the marker compact.
  tag: string;
  // Player owning this brick — drawn as a faint line connecting the player
  // to their impact, so it's obvious which marker belongs to whom.
  playerId: string;
};

// Per-player badge displayed UNDER the player circle when a brick is posed.
// The colour matches the brick category and the label is short (a few chars)
// so it doesn't clutter the canvas.
export type PlayerBrickBadge = {
  playerId: string;
  label: string;
  color: string;
};

// Visual hint for a jumping brick's ball-contact sync state. When the
// previous step's ball XZ lines up with the impact, the sync is "ok" (green
// ring + check); otherwise the indicator goes amber so the author sees that
// the ball won't actually meet the player's hand at apex.
export type SmashSyncIndicator = {
  brickId: string;
  playerId: string;
  contactPoint: [number, number, number];
  isSynced: boolean;
  distance: number;
};

export type EditorCanvasProps = {
  players: EditorPlayer[];
  positions: Record<string, [number, number, number]>;
  ballPosition: [number, number, number];
  // What's selected on the canvas: a player, the ball, or nothing. Replaces
  // the previous string-only `selectedId` so the canvas can highlight the
  // ball as a first-class selection target.
  selection: { kind: 'player'; id: string } | { kind: 'ball' } | null;
  onSelect: (sel: { kind: 'player'; id: string } | { kind: 'ball' } | null) => void;
  onMovePlayer: (id: string, x: number, z: number) => void;
  onMoveBall: (x: number, z: number) => void;
  // Brick anchor markers — optional, renders nothing when omitted.
  brickMarkers?: BrickMarker[];
  onMoveBrickMarker?: (brickId: string, anchorKey: string, x: number, z: number) => void;
  // Per-player brick badges — small chips under the player circle.
  brickBadges?: PlayerBrickBadge[];
  // Previous-step state — when provided, the canvas draws ghost circles at the
  // previous positions and dashed arrows pointing to the current ones.
  previousPositions?: Record<string, [number, number, number]>;
  previousBallPosition?: [number, number, number];
  // Per-player arrow colour (= category of the brick posed on that player).
  // Players not in this map get a neutral grey arrow.
  arrowColors?: Record<string, string>;
  // When set, the ball is "carried" by this player — render a yellow link
  // between them so the carrying relationship is obvious.
  ballAttachedTo?: string;
  // Per-brick sync indicators — rendered as a ring + dashed line + label at
  // the contact point. Green when the previous step's ball lines up with the
  // impact (the smash WILL meet the ball at apex), amber otherwise.
  smashSyncIndicators?: SmashSyncIndicator[];
};

type DragTarget =
  | { kind: 'player'; id: string }
  | { kind: 'ball' }
  | { kind: 'marker'; brickId: string; anchorKey: string };

export function EditorCanvas({
  players,
  positions,
  ballPosition,
  selection,
  onSelect,
  onMovePlayer,
  onMoveBall,
  brickMarkers,
  onMoveBrickMarker,
  brickBadges,
  previousPositions,
  previousBallPosition,
  arrowColors,
  ballAttachedTo,
  smashSyncIndicators,
}: EditorCanvasProps) {
  const selectedPlayerId = selection?.kind === 'player' ? selection.id : null;
  const ballSelected = selection?.kind === 'ball';
  const rootRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<DragTarget | null>(null);

  const updateFromPointer = useCallback((target: DragTarget, clientX: number, clientY: number) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Snap to the 5px grid in canvas-pixel space — same visual step regardless of zoom.
    const localX = Math.round((clientX - rect.left) / SNAP_PX) * SNAP_PX;
    const localY = Math.round((clientY - rect.top) / SNAP_PX) * SNAP_PX;
    const pctX = (localX / rect.width) * 100;
    const pctY = (localY / rect.height) * 100;
    const x = clampX(pctToX(pctX));
    const z = clampZ(pctToZ(pctY));
    if (target.kind === 'player') onMovePlayer(target.id, x, z);
    else if (target.kind === 'ball') onMoveBall(x, z);
    else if (target.kind === 'marker' && onMoveBrickMarker) onMoveBrickMarker(target.brickId, target.anchorKey, x, z);
  }, [onMovePlayer, onMoveBall, onMoveBrickMarker]);

  const startDrag = (target: DragTarget) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(target);
    if (target.kind === 'player') onSelect({ kind: 'player', id: target.id });
    else if (target.kind === 'ball') onSelect({ kind: 'ball' });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromPointer(dragging, e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {
      // Pointer may already have been released by the browser (e.g. drag ended off-element).
    }
    setDragging(null);
  };

  const onBackgroundClick = () => onSelect(null);

  // Net is at z=0 → middle of the canvas vertically (after padding).
  const netTopPct = zToPct(0);
  const threeFrontTopPct = zToPct(3);
  const threeBackTopPct = zToPct(-3);

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <div
        ref={rootRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onBackgroundClick}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${TOTAL_WIDTH} / ${TOTAL_LENGTH}`,
          border: '3px solid var(--ink)',
          background: 'var(--paper)',
          boxShadow: 'var(--shadow)',
          touchAction: 'none',
          userSelect: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0 43px, rgba(26,24,18,0.04) 43px 44px), repeating-linear-gradient(90deg, transparent 0 43px, rgba(26,24,18,0.04) 43px 44px)',
        }}
      >
        {/* Court boundary */}
        <div style={{
          position: 'absolute',
          left: `${xToPct(-COURT_HALF_WIDTH)}%`,
          top: `${zToPct(COURT_HALF_LENGTH)}%`,
          width: `${(COURT_HALF_WIDTH * 2 / TOTAL_WIDTH) * 100}%`,
          height: `${(COURT_HALF_LENGTH * 2 / TOTAL_LENGTH) * 100}%`,
          border: '2px solid var(--ink)',
          background: 'transparent',
          pointerEvents: 'none',
        }} />

        {/* Net */}
        <div style={{
          position: 'absolute',
          left: -3, right: -3,
          top: `${netTopPct}%`,
          transform: 'translateY(-50%)',
          height: 6,
          background: 'var(--orange)',
          borderTop: '2px solid var(--ink)',
          borderBottom: '2px solid var(--ink)',
          pointerEvents: 'none',
          zIndex: 5,
        }} />

        {/* 3m lines (front and back) */}
        <div style={{
          position: 'absolute',
          left: `${xToPct(-COURT_HALF_WIDTH)}%`,
          right: `${100 - xToPct(COURT_HALF_WIDTH)}%`,
          top: `${threeFrontTopPct}%`,
          borderTop: '2px dashed rgba(26,24,18,0.3)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          left: `${xToPct(-COURT_HALF_WIDTH)}%`,
          right: `${100 - xToPct(COURT_HALF_WIDTH)}%`,
          top: `${threeBackTopPct}%`,
          borderTop: '2px dashed rgba(26,24,18,0.3)',
          pointerEvents: 'none',
        }} />

        {/* Side labels */}
        <div style={labelStyle(4, 'top')}>ADVERSAIRES</div>
        <div style={labelStyle(4, 'bottom')}>NOTRE CÔTÉ</div>

        {/* Movement overlay — ghosts of previous positions, dashed arrows to
            the current spot (coloured by brick category), and the ball-carry
            link. SVG sits below the draggable circles so they keep pointer
            priority. Only rendered when previousPositions is provided. */}
        {(previousPositions || previousBallPosition || ballAttachedTo) && (
          <svg
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none',
              zIndex: 4,
              overflow: 'visible',
            }}
          >
            <defs>
              {/* Generate one arrowhead per used colour. We always include the
                  neutral and ball ones; arrowColors values supply the rest. */}
              {Array.from(new Set([
                'rgba(26,24,18,0.55)',
                ...Object.values(arrowColors ?? {}),
              ])).map((stroke, i) => (
                <marker
                  key={i}
                  id={`arrow-${i}`}
                  viewBox="0 0 10 10"
                  refX="8" refY="5"
                  markerWidth="6" markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={stroke} />
                </marker>
              ))}
              {/* Dedicated ball-arrow marker — kept distinct so the ball line
                  arrowhead always matches BALL_LINE_COLOR regardless of which
                  player colours are present this step. */}
              <marker
                id="arrow-ball"
                viewBox="0 0 10 10"
                refX="8" refY="5"
                markerWidth="6" markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={BALL_LINE_COLOR} />
              </marker>
            </defs>

            {/* Ball carry link — solid ball-coloured line between the ball
                and the player carrying it. */}
            {ballAttachedTo && positions[ballAttachedTo] && (
              <line
                x1={`${xToPct(positions[ballAttachedTo][0])}%`}
                y1={`${zToPct(positions[ballAttachedTo][2])}%`}
                x2={`${xToPct(ballPosition[0])}%`}
                y2={`${zToPct(ballPosition[2])}%`}
                stroke={BALL_LINE_COLOR}
                strokeWidth={3}
                opacity={0.8}
              />
            )}

            {/* Player movement arrows */}
            {previousPositions && players.map(p => {
              const prev = previousPositions[p.id];
              const curr = positions[p.id];
              if (!prev || !curr) return null;
              const dx = curr[0] - prev[0];
              const dz = curr[2] - prev[2];
              if (Math.hypot(dx, dz) < 0.15) return null; // didn't really move
              const stroke = arrowColors?.[p.id] ?? 'rgba(26,24,18,0.55)';
              const palette = ['rgba(26,24,18,0.55)', ...Object.values(arrowColors ?? {})];
              const markerIdx = palette.indexOf(stroke);
              return (
                <line
                  key={`arrow-${p.id}`}
                  x1={`${xToPct(prev[0])}%`}
                  y1={`${zToPct(prev[2])}%`}
                  x2={`${xToPct(curr[0])}%`}
                  y2={`${zToPct(curr[2])}%`}
                  stroke={stroke}
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                  markerEnd={`url(#arrow-${markerIdx})`}
                  opacity={0.85}
                />
              );
            })}

            {/* Ball movement arrow — dashed, ball-coloured. Uses a dedicated
                arrowhead so the marker fill matches the ball line stroke. */}
            {previousBallPosition && (() => {
              const dx = ballPosition[0] - previousBallPosition[0];
              const dz = ballPosition[2] - previousBallPosition[2];
              if (Math.hypot(dx, dz) < 0.15) return null;
              return (
                <line
                  x1={`${xToPct(previousBallPosition[0])}%`}
                  y1={`${zToPct(previousBallPosition[2])}%`}
                  x2={`${xToPct(ballPosition[0])}%`}
                  y2={`${zToPct(ballPosition[2])}%`}
                  stroke={BALL_LINE_COLOR}
                  strokeWidth={2.5}
                  strokeDasharray="3 5"
                  markerEnd="url(#arrow-ball)"
                  opacity={0.85}
                />
              );
            })()}
          </svg>
        )}

        {/* Player ghosts at previous positions (no pointer events) */}
        {previousPositions && players.map(p => {
          const prev = previousPositions[p.id];
          const curr = positions[p.id];
          if (!prev || !curr) return null;
          if (Math.hypot(curr[0] - prev[0], curr[2] - prev[2]) < 0.15) return null;
          return (
            <div
              key={`ghost-${p.id}`}
              style={{
                position: 'absolute',
                left: `${xToPct(prev[0])}%`,
                top: `${zToPct(prev[2])}%`,
                transform: 'translate(-50%, -50%)',
                width: 38, height: 38,
                borderRadius: '50%',
                background: p.color,
                border: '2px dashed rgba(26,24,18,0.6)',
                opacity: 0.25,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />
          );
        })}

        {/* Ball ghost at previous position */}
        {previousBallPosition && Math.hypot(
          ballPosition[0] - previousBallPosition[0],
          ballPosition[2] - previousBallPosition[2],
        ) >= 0.15 && (
          <div
            style={{
              position: 'absolute',
              left: `${xToPct(previousBallPosition[0])}%`,
              top: `${zToPct(previousBallPosition[2])}%`,
              transform: 'translate(-50%, -50%)',
              width: 18, height: 18,
              borderRadius: '50%',
              background: 'var(--yellow)',
              border: '2px dashed rgba(26,24,18,0.5)',
              opacity: 0.3,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        )}

        {/* Brick anchor markers — drawn UNDER the ball/players so they don't
            steal pointer events from those primary draggables. The line from
            the player to the anchor uses the player's jersey colour (so it's
            clear WHO owns the brick); the marker ring itself stays category-
            coloured (so the type of action is still legible). */}
        {brickMarkers && brickMarkers.length > 0 && (
          <svg
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none',
              zIndex: 6,
            }}
          >
            {brickMarkers.map(marker => {
              const playerPos = positions[marker.playerId];
              if (!playerPos) return null;
              const owner = players.find(p => p.id === marker.playerId);
              const lineColor = owner?.color ?? marker.color;
              return (
                <line
                  key={`${marker.brickId}-${marker.anchorKey}-line`}
                  x1={`${xToPct(playerPos[0])}%`}
                  y1={`${zToPct(playerPos[2])}%`}
                  x2={`${xToPct(marker.position[0])}%`}
                  y2={`${zToPct(marker.position[2])}%`}
                  stroke={lineColor}
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  opacity={0.75}
                />
              );
            })}
          </svg>
        )}

        {/* Smash sync indicators — green ring + label when the ball will meet
            the player's hand at apex, amber when desynced. Drawn at the
            impact XZ. Sits in its own SVG so the ring layers cleanly above
            the brick marker line but below the player buttons. */}
        {smashSyncIndicators && smashSyncIndicators.length > 0 && (
          <svg
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none',
              zIndex: 7,
            }}
          >
            {smashSyncIndicators.map(ind => {
              const okColor = '#27ae60';
              const warnColor = '#e67e22';
              const color = ind.isSynced ? okColor : warnColor;
              const label = ind.isSynced ? '✓ SYNCHRO' : '⚠ DÉSYNC.';
              return (
                <g key={`sync-${ind.brickId}`}>
                  <circle
                    cx={`${xToPct(ind.contactPoint[0])}%`}
                    cy={`${zToPct(ind.contactPoint[2])}%`}
                    r="22"
                    fill="none"
                    stroke={color}
                    strokeWidth={2.5}
                    strokeDasharray={ind.isSynced ? '0' : '4 3'}
                    opacity={0.85}
                  />
                  {ind.isSynced && (
                    <circle
                      cx={`${xToPct(ind.contactPoint[0])}%`}
                      cy={`${zToPct(ind.contactPoint[2])}%`}
                      r="30"
                      fill="none"
                      stroke={color}
                      strokeWidth={1.5}
                      opacity={0.35}
                    />
                  )}
                  <text
                    x={`${xToPct(ind.contactPoint[0])}%`}
                    y={`${zToPct(ind.contactPoint[2])}%`}
                    dy="40"
                    textAnchor="middle"
                    fill={color}
                    fontSize="9"
                    fontFamily='"Bungee", sans-serif'
                    letterSpacing="0.08em"
                    style={{ paintOrder: 'stroke', stroke: 'var(--paper)', strokeWidth: 3 }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {brickMarkers?.map(marker => (
          <button
            key={`${marker.brickId}-${marker.anchorKey}`}
            type="button"
            onPointerDown={startDrag({ kind: 'marker', brickId: marker.brickId, anchorKey: marker.anchorKey })}
            onClick={(e) => e.stopPropagation()}
            title={`Brique ${marker.brickId} — ${marker.anchorKey}`}
            aria-label={`Marqueur ${marker.brickId} ${marker.anchorKey}`}
            style={{
              position: 'absolute',
              left: `${xToPct(marker.position[0])}%`,
              top: `${zToPct(marker.position[2])}%`,
              transform: 'translate(-50%, -50%)',
              width: 24, height: 24,
              borderRadius: '50%',
              background: 'transparent',
              border: `3px solid ${marker.color}`,
              boxShadow: `inset 0 0 0 2px var(--paper)`,
              cursor: dragging?.kind === 'marker' && dragging.brickId === marker.brickId && dragging.anchorKey === marker.anchorKey ? 'grabbing' : 'grab',
              padding: 0,
              fontFamily: '"Bungee", sans-serif',
              fontSize: 9,
              color: marker.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 8,
            }}
          >
            {marker.tag}
          </button>
        ))}

        {/* Ball */}
        <button
          type="button"
          onPointerDown={startDrag({ kind: 'ball' })}
          onClick={(e) => { e.stopPropagation(); onSelect({ kind: 'ball' }); }}
          aria-label="Ballon"
          style={{
            position: 'absolute',
            left: `${xToPct(ballPosition[0])}%`,
            top: `${zToPct(ballPosition[2])}%`,
            transform: `translate(-50%, -50%) ${ballSelected ? 'scale(1.15)' : 'scale(1)'}`,
            width: 22, height: 22,
            borderRadius: '50%',
            background: 'var(--yellow)',
            border: ballSelected ? '3px solid var(--ink)' : '2.5px solid var(--ink)',
            boxShadow: ballSelected
              ? '0 0 0 3px var(--paper), 0 0 0 6px var(--orange), 0 0 0 9px rgba(226,84,46,0.35)'
              : '0 0 0 2.5px var(--cream), 0 0 0 5px var(--orange)',
            cursor: dragging?.kind === 'ball' ? 'grabbing' : 'grab',
            padding: 0,
            zIndex: ballSelected ? 13 : 12,
            transition: dragging ? 'none' : 'transform 0.1s, box-shadow 0.1s',
          }}
        />

        {/* Players */}
        {players.map((p) => {
          const pos = positions[p.id];
          if (!pos) return null;
          const isSelected = p.id === selectedPlayerId;
          const dimmed = selectedPlayerId !== null && !isSelected; // focus the selected one, fade others
          const badge = brickBadges?.find(b => b.playerId === p.id);
          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${xToPct(pos[0])}%`,
                top: `${zToPct(pos[2])}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 11 : 10,
                opacity: dimmed ? 0.55 : 1,
                transition: dragging ? 'none' : 'opacity 0.15s',
              }}
            >
              <button
                type="button"
                onPointerDown={startDrag({ kind: 'player', id: p.id })}
                onClick={(e) => { e.stopPropagation(); onSelect({ kind: 'player', id: p.id }); }}
                title={p.label}
                style={{
                  display: 'block',
                  width: 48, height: 48,
                  borderRadius: '50%',
                  background: p.color,
                  color: textColorOn(p.color),
                  border: isSelected ? '3px solid var(--ink)' : '2px solid rgba(26,24,18,0.6)',
                  boxShadow: isSelected
                    ? '0 0 0 4px var(--yellow), 0 0 0 7px rgba(240,200,76,0.5), 2px 2px 0 var(--ink)'
                    : '2px 2px 0 rgba(26,24,18,0.4)',
                  fontFamily: '"Bungee", sans-serif',
                  fontSize: 9,
                  lineHeight: 1.05,
                  cursor: dragging?.kind === 'player' && dragging.id === p.id ? 'grabbing' : 'grab',
                  padding: 2,
                  textAlign: 'center',
                  userSelect: 'none',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  transition: dragging ? 'none' : 'transform 0.08s, box-shadow 0.08s',
                  wordBreak: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {displayName(p.label, p.id)}
              </button>
              {badge && (
                <div
                  title={`Brique : ${badge.label}`}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-50%, 4px)',
                    background: badge.color,
                    color: '#fff',
                    fontFamily: '"Bungee", sans-serif',
                    fontSize: 8,
                    letterSpacing: '0.06em',
                    padding: '2px 6px',
                    border: '1.5px solid var(--ink)',
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                >
                  {badge.label.toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected coordinates summary */}
      {selectedPlayerId && positions[selectedPlayerId] && (
        <div style={{ marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.7, textAlign: 'center' }}>
          {selectedPlayerId} → x={positions[selectedPlayerId][0].toFixed(2)}m · z={positions[selectedPlayerId][2].toFixed(2)}m
        </div>
      )}
      {ballSelected && (
        <div style={{ marginTop: 8, fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.7, textAlign: 'center' }}>
          ballon → x={ballPosition[0].toFixed(2)}m · z={ballPosition[2].toFixed(2)}m · y={ballPosition[1].toFixed(2)}m
        </div>
      )}
    </div>
  );
}

function labelStyle(offset: number, side: 'top' | 'bottom'): React.CSSProperties {
  return {
    position: 'absolute',
    [side]: offset,
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: '"DM Mono", monospace',
    fontSize: 9,
    letterSpacing: '0.14em',
    color: 'var(--ink)',
    opacity: 0.5,
    pointerEvents: 'none',
    zIndex: 4,
  };
}

function textColorOn(bg: string): string {
  // Yellow tones look bad with white text — use ink instead.
  if (/^#f[0-9a-f]c/i.test(bg)) return '#1a1812';
  return '#ffffff';
}

// Strip a "(P3)" or similar suffix so the name itself fits in the circle.
// Falls back to the player id when the label is empty.
function displayName(label: string, id: string): string {
  const stripped = label.replace(/\s*\([^)]*\)\s*$/, '').trim();
  return stripped || id;
}
