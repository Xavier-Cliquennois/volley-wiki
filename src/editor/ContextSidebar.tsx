// Right-hand sidebar that adapts to whatever is currently selected on the
// canvas. Three states:
//   - a player is selected → its info + brick controls (add / edit / remove)
//   - the ball is selected → ball height + trajectory
//   - nothing selected    → onboarding hint + global toggles
//
// Only one brick per player per card is allowed: adding a new one replaces
// the existing one, so the UI shows either "current brick" or "add brick".

import { useState } from 'react';
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
import type { EditorPlayer, BallTrajectory } from './types';
import type { BallCurve, PlayerRole } from '../scenarios/types';
import { BallTrajectoryEditor } from './BallTrajectoryEditor';

// Roles that can perform an attacking jumping action — drives the visibility
// of the "smash sequence" macro button in the player panel.
const ATTACKER_ROLES: ReadonlySet<PlayerRole> = new Set([
  'outside', 'opposite', 'middle', 'opponent',
]);

const CATEGORY_LABELS: Record<BrickCategory, string> = {
  attack: 'Attaque',
  distribution: 'Distribution',
  defense: 'Défense',
  movement: 'Déplacement',
};

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

const PRIMARY_BTN: React.CSSProperties = {
  border: '2.5px solid var(--ink)',
  background: 'var(--orange)',
  color: '#fff',
  fontFamily: '"Bungee", sans-serif',
  fontSize: 11,
  letterSpacing: '0.06em',
  padding: '8px 14px',
  cursor: 'pointer',
  boxShadow: '2px 2px 0 var(--ink)',
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

export type ContextSidebarProps = {
  // Selection state — exactly one of selectedPlayer / ballSelected is "live",
  // or neither (rest state).
  selectedPlayer: EditorPlayer | null;
  ballSelected: boolean;
  // Brick currently posed on the selected player (if any).
  playerBrick: BrickAction | null;
  // Ball state for editing.
  ballHeight: number;
  ballTrajectory: BallTrajectory | undefined;
  // Ball height at the previous step — used by the trajectory mini-schema
  // to draw "from previous height to current height". Undefined for step 0.
  previousBallHeight?: number;
  // True when the active card is not the first one (ball trajectory only
  // matters for transitions, not for the very first frame).
  showBallTrajectory: boolean;
  // Display toggles surfaced from the parent — global to the canvas.
  showOtherBricks: boolean;
  onToggleShowOtherBricks: (v: boolean) => void;
  // Mutations.
  onAddBrick: (kind: BrickKind) => void;
  onRemoveBrick: () => void;
  // Macro: insert a two-card "pass → smash" sequence after the current step.
  // Surfaced as a primary button on attacker-role players. Optional so the
  // sidebar can be embedded outside the editor page later.
  onInsertSmashSequence?: () => void;
  onSetBallHeight: (y: number) => void;
  onSetBallCurve: (c: BallCurve) => void;
  onSetBallApex: (apex: number) => void;
};

export function ContextSidebar(props: ContextSidebarProps) {
  return (
    <aside style={{
      width: '100%',
      border: '3px solid var(--ink)',
      background: 'var(--paper)',
      boxShadow: 'var(--shadow-sm)',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      alignSelf: 'stretch',
    }}>
      {props.selectedPlayer
        ? <PlayerPanel
            player={props.selectedPlayer}
            brick={props.playerBrick}
            onAddBrick={props.onAddBrick}
            onRemoveBrick={props.onRemoveBrick}
            onInsertSmashSequence={props.onInsertSmashSequence}
          />
        : props.ballSelected
          ? <BallPanel
              height={props.ballHeight}
              trajectory={props.ballTrajectory}
              previousBallHeight={props.previousBallHeight}
              showTrajectory={props.showBallTrajectory}
              onSetHeight={props.onSetBallHeight}
              onSetCurve={props.onSetBallCurve}
              onSetApex={props.onSetBallApex}
            />
          : <EmptyState
              showOtherBricks={props.showOtherBricks}
              onToggleShowOtherBricks={props.onToggleShowOtherBricks}
            />
      }
    </aside>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// State 1: a player is selected
// ──────────────────────────────────────────────────────────────────────────

function PlayerPanel({
  player,
  brick,
  onAddBrick,
  onRemoveBrick,
  onInsertSmashSequence,
}: {
  player: EditorPlayer;
  brick: BrickAction | null;
  onAddBrick: (kind: BrickKind) => void;
  onRemoveBrick: () => void;
  onInsertSmashSequence?: () => void;
}) {
  const [hover, setHover] = useState<BrickMeta | null>(null);
  const canAttack = ATTACKER_ROLES.has(player.role);

  return (
    <>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ width: 26, height: 26, borderRadius: '50%', background: player.color, border: '2.5px solid var(--ink)', flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, letterSpacing: '0.04em', color: 'var(--ink)' }}>
              {player.label}
            </div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.55 }}>
              {player.id} · {player.role}
            </div>
          </div>
        </div>
      </div>

      {/* Macro: insert a coordinated smash sequence (only for attacker roles).
          This creates two cards after the current one — pass + smash — with
          all the ball/jump timing pre-configured. The author can still edit
          afterwards, but the default is "ready to play". */}
      {canAttack && onInsertSmashSequence && (
        <div>
          <span style={SECTION_LABEL}>Enchaînement rapide</span>
          <button
            type="button"
            onClick={onInsertSmashSequence}
            title="Crée deux cartes : une passe haute + le smash, déjà synchronisés."
            style={PRIMARY_BTN}
          >
            + ATTAQUE SMASH (2 cartes)
          </button>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, opacity: 0.55, marginTop: 4, lineHeight: 1.4 }}>
            Génère une passe haute puis un smash coordonné — pas besoin d'aligner la balle à la main.
          </div>
        </div>
      )}

      {/* Current brick (if any) */}
      <div>
        <span style={SECTION_LABEL}>Brique de ce joueur</span>
        {brick ? <BrickSummary brick={brick} onRemove={onRemoveBrick} /> : <NoBrickHint />}
      </div>

      {/* Add brick toolbar — when a brick is already there, this section is
          framed as "remplacer par" so the author understands the swap. */}
      <div>
        <span style={SECTION_LABEL}>
          {brick ? 'Remplacer par' : 'Choisir une action'}
        </span>
        <BrickPicker player={player} currentKind={brick?.kind ?? null} onPick={onAddBrick} onHover={setHover} />
      </div>

      {/* Detail of hovered brick */}
      <div style={{ minHeight: 70 }}>
        {hover && <BrickHoverDetail meta={hover} />}
      </div>
    </>
  );
}

function BrickSummary({ brick, onRemove }: { brick: BrickAction; onRemove: () => void }) {
  const meta = BRICK_BY_KIND[brick.kind];
  const color = BRICK_CATEGORY_COLORS[meta.category];
  const params = brickParamsLine(brick);
  return (
    <div style={{
      border: `2px solid var(--ink)`,
      borderLeftWidth: 6,
      borderLeftColor: color,
      background: 'var(--cream)',
      padding: '8px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.04em', color }}>
          {meta.label.toUpperCase()}
        </div>
        {params && (
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, opacity: 0.6, marginTop: 2 }}>
            {params}
          </div>
        )}
      </div>
      <button
        onClick={onRemove}
        title="Supprimer la brique"
        style={{ ...GHOST_BTN, padding: '4px 10px', fontSize: 14 }}
      >
        ×
      </button>
    </div>
  );
}

function brickParamsLine(brick: BrickAction): string | null {
  if ('impact' in brick) return `impact (${brick.impact[0].toFixed(1)}, ${brick.impact[2].toFixed(1)})`;
  if ('to' in brick) return `arrivée (${brick.to[0].toFixed(1)}, ${brick.to[2].toFixed(1)})`;
  return null;
}

function NoBrickHint() {
  return (
    <div style={{
      border: '2px dashed rgba(26,24,18,0.25)',
      padding: '8px 10px',
      fontFamily: '"DM Mono", monospace',
      fontSize: 11,
      color: 'var(--ink)',
      opacity: 0.55,
      textAlign: 'center',
    }}>
      Aucune brique sur ce joueur. Choisis une action ci-dessous.
    </div>
  );
}

function BrickPicker({
  player,
  currentKind,
  onPick,
  onHover,
}: {
  player: EditorPlayer;
  currentKind: BrickKind | null;
  onPick: (kind: BrickKind) => void;
  onHover: (meta: BrickMeta | null) => void;
}) {
  const grouped: Record<BrickCategory, BrickMeta[]> = { attack: [], distribution: [], defense: [], movement: [] };
  for (const m of BRICK_CATALOG) grouped[m.category].push(m);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(Object.keys(grouped) as BrickCategory[]).map(cat => (
        <div key={cat}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.14em', color: BRICK_CATEGORY_COLORS[cat], textTransform: 'uppercase', marginBottom: 4 }}>
            {CATEGORY_LABELS[cat]}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {grouped[cat].map(meta => {
              const allowed = isAllowed(meta, player);
              const isCurrent = meta.kind === currentKind;
              return (
                <button
                  key={meta.kind}
                  disabled={!allowed}
                  onClick={() => onPick(meta.kind)}
                  onMouseEnter={() => onHover(meta)}
                  onFocus={() => onHover(meta)}
                  onMouseLeave={() => onHover(null)}
                  title={allowed ? meta.description : `Pas applicable au rôle "${player.role}"`}
                  style={{
                    ...GHOST_BTN,
                    opacity: allowed ? 1 : 0.3,
                    cursor: allowed ? 'pointer' : 'not-allowed',
                    background: isCurrent ? BRICK_CATEGORY_COLORS[cat] : 'var(--cream)',
                    color: isCurrent ? '#fff' : 'var(--ink)',
                    borderColor: isCurrent ? BRICK_CATEGORY_COLORS[cat] : 'var(--ink)',
                  }}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BrickHoverDetail({ meta }: { meta: BrickMeta }) {
  return (
    <div style={{ padding: '8px 10px', background: 'var(--cream)', border: '2px dashed rgba(26,24,18,0.18)', fontSize: 11, lineHeight: 1.45 }}>
      <div style={{ marginBottom: 4 }}>{meta.description}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, fontFamily: '"DM Mono", monospace', fontSize: 10, opacity: 0.7 }}>
        <span style={{ opacity: 0.55 }}>Génère :</span>
        {meta.subActions.map((sa, i) => (
          <span key={i} style={{ padding: '0 4px', border: '1px solid rgba(26,24,18,0.2)' }}>{sa}</span>
        ))}
        {(meta.kind === 'SMASH' || meta.kind === 'FEINTE' || meta.kind === 'JUMP_SERVE' || meta.kind === 'BLOC') && (
          <span style={{ opacity: 0.55, marginLeft: 4 }}>· hauteur ≈ {jumpHeightFor(meta.kind)} m</span>
        )}
      </div>
    </div>
  );
}

function jumpHeightFor(kind: 'SMASH' | 'FEINTE' | 'JUMP_SERVE' | 'BLOC'): number {
  switch (kind) {
    case 'SMASH': return DEFAULT_JUMP.smash;
    case 'FEINTE': return DEFAULT_JUMP.feinte;
    case 'JUMP_SERVE': return DEFAULT_JUMP.jumpServe;
    case 'BLOC': return DEFAULT_JUMP.bloc;
  }
}

function isAllowed(meta: BrickMeta, player: EditorPlayer): boolean {
  if (meta.validRoles === null) return true;
  return meta.validRoles.includes(player.role);
}

// ──────────────────────────────────────────────────────────────────────────
// State 2: the ball is selected
// ──────────────────────────────────────────────────────────────────────────

function BallPanel({
  height,
  trajectory,
  previousBallHeight,
  showTrajectory,
  onSetHeight,
  onSetCurve,
  onSetApex,
}: {
  height: number;
  trajectory: BallTrajectory | undefined;
  previousBallHeight: number | undefined;
  showTrajectory: boolean;
  onSetHeight: (y: number) => void;
  onSetCurve: (c: BallCurve) => void;
  onSetApex: (apex: number) => void;
}) {
  const curve = trajectory?.curve ?? 'arc';
  const apex = trajectory?.apex ?? 3.5;

  return (
    <>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--yellow)', border: '2.5px solid var(--ink)', boxShadow: '0 0 0 2px var(--paper), 0 0 0 4px var(--orange)', flexShrink: 0 }} />
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, letterSpacing: '0.04em' }}>BALLON</div>
        </div>
      </div>

      <BallTrajectoryEditor
        curve={curve}
        apex={apex}
        toHeight={height}
        fromHeight={showTrajectory ? previousBallHeight : undefined}
        onSetCurve={onSetCurve}
        onSetApex={onSetApex}
        onSetHeight={onSetHeight}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// State 3: nothing selected — onboarding + global display toggles
// ──────────────────────────────────────────────────────────────────────────

function EmptyState({
  showOtherBricks,
  onToggleShowOtherBricks,
}: {
  showOtherBricks: boolean;
  onToggleShowOtherBricks: (v: boolean) => void;
}) {
  return (
    <>
      <div>
        <span style={SECTION_LABEL}>Comment ça marche</span>
        <ol style={{ margin: 0, padding: '0 0 0 18px', fontSize: 12, lineHeight: 1.6, color: 'var(--ink)' }}>
          <li>Clique un <strong>joueur</strong> sur le terrain pour lui ajouter une action.</li>
          <li>Clique le <strong>ballon</strong> pour régler sa hauteur ou sa trajectoire.</li>
          <li>Clique <strong>+ Carte suivante</strong> pour décrire l'instant d'après.</li>
        </ol>
      </div>

      <div>
        <span style={SECTION_LABEL}>Affichage</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
          <input
            type="checkbox"
            checked={showOtherBricks}
            onChange={e => onToggleShowOtherBricks(e.target.checked)}
          />
          Voir les briques des autres joueurs
        </label>
      </div>

      <div style={{ marginTop: 'auto', padding: 10, background: 'var(--cream)', border: '2px dashed rgba(26,24,18,0.18)', fontFamily: '"DM Mono", monospace', fontSize: 10, opacity: 0.6, lineHeight: 1.45 }}>
        Astuce : un joueur ne peut avoir qu'<strong>une seule brique</strong> par carte.
        Si tu en ajoutes une nouvelle, elle remplace la précédente.
      </div>

      {/* Re-export so PRIMARY_BTN ts-unused-vars doesn't trip when this file
          adds dialogs in a future iteration. Cheap, no runtime cost. */}
      <span style={{ display: 'none' }}>{PRIMARY_BTN.background as string}</span>
    </>
  );
}
