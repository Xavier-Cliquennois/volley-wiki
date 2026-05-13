import { useMemo, useState } from 'react';
import {
  BRICK_CATALOG,
  BRICK_BY_KIND,
  BRICK_CATEGORY_COLORS,
  type BrickAction,
  type BrickCategory,
  type BrickKind,
  type BrickMeta,
} from './bricks';
import { DEFAULT_JUMP } from './bricks/expand';
import type { EditorPlayer } from './types';

const card: React.CSSProperties = {
  border: '3px solid var(--ink)',
  background: 'var(--paper)',
  boxShadow: 'var(--shadow-sm)',
  padding: '16px 18px',
};

const monoLabel: React.CSSProperties = {
  fontFamily: '"Bungee", sans-serif',
  fontSize: 11,
  letterSpacing: '0.08em',
  color: 'var(--ink)',
  marginBottom: 6,
  display: 'block',
};

const btn: React.CSSProperties = {
  border: '2px solid var(--ink)',
  background: 'var(--cream)',
  fontFamily: '"DM Mono", monospace',
  fontSize: 11,
  padding: '5px 9px',
  cursor: 'pointer',
  color: 'var(--ink)',
};

const btnDisabled: React.CSSProperties = {
  ...btn,
  opacity: 0.35,
  cursor: 'not-allowed',
};

const CATEGORY_LABELS: Record<BrickCategory, string> = {
  attack: 'Attaque',
  distribution: 'Distribution',
  defense: 'Défense',
  movement: 'Déplacement',
};

// Type-safe updater: the patch must be a Partial of the exact brick variant —
// no more `Partial<BrickAction>` (which is the union of every variant's fields)
// silently allowing `from` patches on a SMASH.
export type BrickUpdater = <T extends BrickAction>(brickId: string, patch: Partial<T>) => void;

export type BrickPanelProps = {
  players: EditorPlayer[];
  selectedPlayerId: string | null;
  bricks: BrickAction[];
  // Position lookup for the player owning each brick — used to display
  // "(R4a → impact x=-3.5, z=0.6)" lines and to seed the impact when adding.
  positions: Record<string, [number, number, number]>;
  onAddBrick: (kind: BrickKind, playerId: string) => void;
  onRemoveBrick: (brickId: string) => void;
  onUpdateBrick: BrickUpdater;
};

export function BrickPanel({
  players,
  selectedPlayerId,
  bricks,
  positions,
  onAddBrick,
  onRemoveBrick,
  onUpdateBrick,
}: BrickPanelProps) {
  const selectedPlayer = useMemo(
    () => players.find(p => p.id === selectedPlayerId) ?? null,
    [players, selectedPlayerId],
  );

  const groupedBricks = useMemo(() => {
    const groups: Record<BrickCategory, BrickMeta[]> = {
      attack: [],
      distribution: [],
      defense: [],
      movement: [],
    };
    for (const meta of BRICK_CATALOG) groups[meta.category].push(meta);
    return groups;
  }, []);

  // Brick whose detail card is currently shown (mouse over a button).
  const [previewMeta, setPreviewMeta] = useState<BrickMeta | null>(null);

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, margin: 0, letterSpacing: '0.06em' }}>
          BRIQUES D'ACTION — CARTE COURANTE ({bricks.length})
        </h2>
      </div>

      {/* Plain-language explainer — what a brick is, in two sentences. */}
      <div style={{ marginBottom: 14, padding: '10px 12px', background: 'var(--cream)', border: '2px dashed rgba(26,24,18,0.18)', fontSize: 12, lineHeight: 1.5, color: 'var(--ink)' }}>
        Une <strong>brique</strong> est un raccourci d'action complexe (smash, bloc, service…). Elle génère automatiquement plusieurs micro-mouvements et synchronise le joueur sur l'arrivée du ballon. Survolez un bouton pour voir ce qu'elle contient.
      </div>

      {/* Call to action when no player selected: highlighted prompt instead of
          the silently-greyed toolbar pattern. */}
      {!selectedPlayer && (
        <div style={{
          marginBottom: 14, padding: '12px 14px',
          background: 'var(--paper)', border: '2px solid var(--orange)',
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.06em', color: 'var(--orange)',
        }}>
          <span style={{ fontSize: 18 }}>↑</span>
          <span>SÉLECTIONNE UN JOUEUR DANS LE CANVAS POUR ACTIVER LES BRIQUES</span>
        </div>
      )}

      {/* Add toolbar — grouped by category, greyed out when no player selected
          or when the selected player's role doesn't match. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {selectedPlayer && (
          <span style={monoLabel}>
            Ajouter une brique sur :{' '}
            <span style={{ color: 'var(--orange)' }}>{selectedPlayer.label} ({selectedPlayer.id})</span>
          </span>
        )}
        {(Object.keys(groupedBricks) as BrickCategory[]).map(cat => (
          <div key={cat} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: BRICK_CATEGORY_COLORS[cat], width: 110, flexShrink: 0, textTransform: 'uppercase' }}>
              {CATEGORY_LABELS[cat]}
            </span>
            {groupedBricks[cat].map(meta => {
              const allowed = isBrickAllowed(meta, selectedPlayer);
              return (
                <button
                  key={meta.kind}
                  style={allowed ? btn : btnDisabled}
                  disabled={!allowed}
                  onClick={() => selectedPlayer && onAddBrick(meta.kind, selectedPlayer.id)}
                  onMouseEnter={() => setPreviewMeta(meta)}
                  onFocus={() => setPreviewMeta(meta)}
                  onMouseLeave={() => setPreviewMeta(p => (p?.kind === meta.kind ? null : p))}
                  title={meta.description}
                >
                  + {meta.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Detail panel — appears below the toolbar when hovering a brick button.
          Reserves vertical space (min-height) so the panel doesn't push the
          rest of the page when it appears. */}
      <div style={{ minHeight: 78, marginBottom: 12 }}>
        {previewMeta && (
          <div style={{ padding: '10px 14px', border: `2px solid ${BRICK_CATEGORY_COLORS[previewMeta.category]}`, background: 'var(--paper)', fontSize: 12, lineHeight: 1.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em', color: BRICK_CATEGORY_COLORS[previewMeta.category] }}>
                {previewMeta.label.toUpperCase()}
              </span>
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, opacity: 0.55, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {CATEGORY_LABELS[previewMeta.category]}
              </span>
            </div>
            <div style={{ marginBottom: 6, color: 'var(--ink)' }}>{previewMeta.description}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.75 }}>
              <span style={{ opacity: 0.55 }}>Génère :</span>
              {previewMeta.subActions.map((sa, i) => (
                <span key={i} style={{ padding: '1px 6px', border: '1px solid rgba(26,24,18,0.25)', borderRadius: 2 }}>{sa}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Posed bricks — list with inline params edit. Empty state for clarity. */}
      <div>
        <span style={monoLabel}>Briques posées dans cette carte</span>
        {bricks.length === 0 ? (
          <div style={{ padding: '12px 14px', border: '2px dashed rgba(26,24,18,0.2)', fontFamily: '"DM Mono", monospace', fontSize: 12, color: 'var(--ink)', opacity: 0.55, textAlign: 'center' }}>
            Aucune brique. Sélectionne un joueur puis clique sur une action ci-dessus.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bricks.map(brick => (
              <BrickRow
                key={brick.id}
                brick={brick}
                player={players.find(p => p.id === brick.playerId)}
                playerPos={positions[brick.playerId]}
                onRemove={() => onRemoveBrick(brick.id)}
                onUpdate={patch => onUpdateBrick(brick.id, patch)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function isBrickAllowed(meta: BrickMeta, player: EditorPlayer | null): boolean {
  if (!player) return false;
  if (meta.validRoles === null) return true;
  return meta.validRoles.includes(player.role);
}

// ──────────────────────────────────────────────────────────────────────────
// One row per brick: shows kind + player + key params, with inline editors.
// ──────────────────────────────────────────────────────────────────────────

type BrickRowProps<T extends BrickAction> = {
  brick: T;
  player: EditorPlayer | undefined;
  playerPos: [number, number, number] | undefined;
  onRemove: () => void;
  onUpdate: (patch: Partial<T>) => void;
};

function BrickRow<T extends BrickAction>({ brick, player, onRemove, onUpdate }: BrickRowProps<T>) {
  const meta = BRICK_BY_KIND[brick.kind];
  const categoryColor = BRICK_CATEGORY_COLORS[meta.category];

  return (
    <div style={{ border: `2px solid var(--ink)`, borderLeftWidth: 6, borderLeftColor: categoryColor, background: 'var(--cream)', padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.06em', color: categoryColor }}>
          {meta.label.toUpperCase()}
        </span>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.7 }}>
          → {player?.label ?? brick.playerId}
        </span>
        <button
          onClick={onRemove}
          style={{ marginLeft: 'auto', padding: '3px 9px', fontFamily: '"DM Mono", monospace', fontSize: 11, border: '2px solid var(--ink)', background: 'var(--paper)', cursor: 'pointer' }}
          title="Supprimer cette brique"
        >
          ×
        </button>
      </div>

      <BrickParamsEditor brick={brick} onUpdate={onUpdate} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Inline numeric editors for the params of each brick — kept lightweight on
// purpose (drag-on-canvas comes from the canvas markers, not from here).
// ──────────────────────────────────────────────────────────────────────────

const numInput: React.CSSProperties = {
  width: 70,
  border: '1.5px solid var(--ink)',
  background: 'var(--paper)',
  fontFamily: '"DM Mono", monospace',
  fontSize: 11,
  padding: '3px 5px',
  color: 'var(--ink)',
};

function BrickParamsEditor<T extends BrickAction>({ brick, onUpdate }: { brick: T; onUpdate: (patch: Partial<T>) => void }) {
  // Each variant has a different shape — render a small editor per relevant
  // field, narrowed via `'key' in brick`. The patch type is bound to T so the
  // compiler refuses cross-variant fields (e.g. `from` on a SMASH).
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {'impact' in brick && (
        <XzRow
          label="Impact"
          value={brick.impact}
          onChange={v => onUpdate({ impact: v } as unknown as Partial<T>)}
        />
      )}
      {'to' in brick && (
        <XzRow
          label="Arrivée"
          value={brick.to}
          onChange={v => onUpdate({ to: v } as unknown as Partial<T>)}
        />
      )}
      {'jumpHeight' in brick && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
          <label style={{ width: 80, opacity: 0.7 }}>Hauteur saut</label>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.1}
            value={brick.jumpHeight ?? defaultJumpHeight(brick.kind)}
            onChange={e => onUpdate({ jumpHeight: parseFloat(e.target.value) } as unknown as Partial<T>)}
            style={{ flex: 1 }}
          />
          <span style={{ width: 50, textAlign: 'right', opacity: 0.6 }}>
            {(brick.jumpHeight ?? defaultJumpHeight(brick.kind)).toFixed(1)} m
          </span>
        </div>
      )}
    </div>
  );
}

function XzRow({ label, value, onChange }: { label: string; value: [number, number, number]; onChange: (v: [number, number, number]) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: '"DM Mono", monospace', fontSize: 11 }}>
      <label style={{ width: 80, opacity: 0.7 }}>{label}</label>
      <span style={{ opacity: 0.5 }}>x</span>
      <input
        type="number"
        step={0.1}
        value={value[0].toFixed(2)}
        onChange={e => onChange([parseFloat(e.target.value) || 0, value[1], value[2]])}
        style={numInput}
      />
      <span style={{ opacity: 0.5 }}>z</span>
      <input
        type="number"
        step={0.1}
        value={value[2].toFixed(2)}
        onChange={e => onChange([value[0], value[1], parseFloat(e.target.value) || 0])}
        style={numInput}
      />
    </div>
  );
}

// Reads from expand.ts so the slider shows the same value the runtime will use.
function defaultJumpHeight(kind: BrickAction['kind']): number {
  switch (kind) {
    case 'SMASH':      return DEFAULT_JUMP.smash;
    case 'FEINTE':     return DEFAULT_JUMP.feinte;
    case 'JUMP_SERVE': return DEFAULT_JUMP.jumpServe;
    case 'BLOC':       return DEFAULT_JUMP.bloc;
    default:           return 1.0;
  }
}
