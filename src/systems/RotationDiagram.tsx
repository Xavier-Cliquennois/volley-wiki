import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Court, type CourtArrow, type CourtLayout, type CourtPlayer } from '../components/court';
import { useCurrentLang } from '../i18n/paths';
import type { PlayerSlot, RoleCode, Rotation, AttackOption, CourtCoord, MovementKind } from './types';
import { RISK_COLORS } from './types';

// Compact label shown inside the player circle. Same in every language —
// the long localized name appears as a caption below.
const PASTILLE_LABEL: Record<RoleCode, { label: string; sub?: string }> = {
  S: { label: 'S' },
  S2: { label: 'S', sub: '2' },
  OPP: { label: 'OPP' },
  MB1: { label: 'MB', sub: '1' },
  MB2: { label: 'MB', sub: '2' },
  OH1: { label: 'OH', sub: '1' },
  OH2: { label: 'OH', sub: '2' },
  L: { label: 'L' },
  B1: { label: 'J', sub: '1' },
  B2: { label: 'J', sub: '2' },
};

// Long-form label. FR uses french terms; other languages keep the
// international codes (cleaner across many locales).
function roleCaption(role: RoleCode, lang: string): string {
  if (lang === 'fr') {
    const FR: Record<RoleCode, string> = {
      S: 'Passeur',
      S2: '2e passeur',
      OPP: 'Pointu',
      MB1: 'Central 1',
      MB2: 'Central 2',
      OH1: 'Aile 1',
      OH2: 'Aile 2',
      L: 'Libéro',
      B1: 'Joueur 1',
      B2: 'Joueur 2',
    };
    return FR[role];
  }
  const I18N_CODES: Record<RoleCode, string> = {
    S: 'S',
    S2: 'S2',
    OPP: 'OPP',
    MB1: 'MB1',
    MB2: 'MB2',
    OH1: 'OH1',
    OH2: 'OH2',
    L: 'L',
    B1: 'P1',
    B2: 'P2',
  };
  return I18N_CODES[role];
}

function slotToPlayer(
  slot: PlayerSlot,
  lang: string,
  onActivate?: (role: RoleCode) => void,
  tooltip?: string,
): CourtPlayer {
  const pastille = PASTILLE_LABEL[slot.role];
  return {
    id: slot.role,
    x: slot.servePosition.x,
    y: slot.servePosition.y,
    label: pastille.label,
    sub: pastille.sub,
    role: slot.color,
    caption: roleCaption(slot.role, lang),
    onClick: onActivate ? () => onActivate(slot.role) : undefined,
    title: tooltip,
  };
}

// Build one arrow per attack option: trajectory from the attacker's serve
// position to the strike point. The line starts at the player's center; the
// player circle (z-index 2) sits on top so the arrow visually emerges from
// the player. Backoff is tiny because the target is empty space (no player
// at the net) — the default 24-unit backoff would consume short trajectories
// like MB quick from P3.
const ATTACK_BACKOFF = 4;

// When movements are shown, the run to the strike point starts where the
// attacker's approach leg ended rather than at the serve position.
function attackStart(slot: PlayerSlot, withMovements: boolean) {
  const approach = withMovements
    ? slot.movements?.find(m => m.kind === 'approach')
    : undefined;
  return approach?.to ?? slot.servePosition;
}

function attackArrows(rotation: Rotation, hoveredId: string | null, withMovements: boolean): CourtArrow[] {
  return rotation.attacks
    .map(attack => {
      const attacker = rotation.slots.find(s => s.role === attack.attacker);
      if (!attacker) return null;
      return {
        id: `attack-${attack.id}`,
        from: attackStart(attacker, withMovements),
        to: attack.target,
        kind: attack.risk === 'low' ? 'main' : 'alt',
        backoff: ATTACK_BACKOFF,
        dimmed: hoveredId !== null && hoveredId !== attack.id,
      } as CourtArrow;
    })
    .filter((a): a is CourtArrow => a !== null);
}

// One colour (and dash pattern, for colour-blind readers) per movement
// family. Dash periods divide 12 so the marching-ants animation loops cleanly.
const MOVEMENT_STYLE: Record<MovementKind, { color: string; dash: string }> = {
  setter: { color: '#1f7a8c', dash: '2,4' },
  reception: { color: '#6b2c5c', dash: '8,4' },
  approach: { color: '#2f7a3a', dash: '4,2' },
  coverage: { color: '#3b4fa8', dash: '6,2,2,2' },
};
const MOVEMENT_ORDER: MovementKind[] = ['setter', 'reception', 'approach', 'coverage'];
// Movement targets are empty spots, so the arrowhead can land close to them.
const MOVEMENT_BACKOFF = 4;

// Movement legs of every slot: a legacy `releasePosition` counts as a single
// setter leg; `movements` legs are chained from the serve position.
function movementLegs(slot: PlayerSlot) {
  const legs: { kind: MovementKind; from: CourtCoord; to: CourtCoord }[] = [];
  if (slot.releasePosition) {
    legs.push({ kind: 'setter', from: slot.servePosition, to: slot.releasePosition });
  }
  let from = slot.servePosition;
  for (const leg of slot.movements ?? []) {
    legs.push({ kind: leg.kind, from, to: leg.to });
    from = leg.to;
  }
  return legs;
}

// Player movement arrows (penetration, W reception, approach, coverage).
// Drawn under attack arrows so the ball trajectory stays the primary signal.
// When one family is focused, the others fade out.
function movementArrows(rotation: Rotation, focused: MovementKind | null): CourtArrow[] {
  return rotation.slots.flatMap(slot =>
    movementLegs(slot).map((leg, i) => ({
      id: `movement-${slot.role}-${i}`,
      from: leg.from,
      to: leg.to,
      kind: 'movement' as const,
      ...(slot.movements?.length ? MOVEMENT_STYLE[leg.kind] : {}),
      backoff: slot.movements?.length ? MOVEMENT_BACKOFF : undefined,
      dimmed: focused !== null && focused !== leg.kind,
    })),
  );
}

function movementKindsOf(rotation: Rotation): MovementKind[] {
  const kinds = new Set(rotation.slots.flatMap(s => movementLegs(s).map(l => l.kind)));
  return MOVEMENT_ORDER.filter(k => kinds.has(k));
}

type Props = {
  rotation: Rotation;
  // When true, render the secondary movement arrows (penetration, approach…).
  showMovements?: boolean;
  // Optional positions-page link target so clicking a pastille jumps to the
  // matching position guide. Omitted when no positions page exists.
  positionsHref?: string;
};

export default function RotationDiagram({ rotation, showMovements = false, positionsHref }: Props) {
  const { t } = useTranslation('common');
  const lang = useCurrentLang();
  const navigate = useNavigate();
  const [hoveredAttackId, setHoveredAttackId] = useState<string | null>(null);
  // Setter focus: only offered when the rotation has two setters (6-2, 4-2).
  const [setterFocus, setSetterFocus] = useState<'S' | 'S2' | null>(null);
  const hasTwoSetters = rotation.slots.some(s => s.role === 'S2');
  const [focusedMovement, setFocusedMovement] = useState<MovementKind | null>(null);

  const tooltipFor = (role: RoleCode) => {
    const caption = roleCaption(role, lang);
    return positionsHref ? `${caption} — ${t('actions.viewPositions')}` : caption;
  };

  const onActivate = positionsHref
    ? () => navigate(`/${lang}${positionsHref}`)
    : undefined;

  const players = rotation.slots.map(s => ({
    ...slotToPlayer(s, lang, onActivate, tooltipFor(s.role)),
    active: hasTwoSetters && setterFocus === s.role,
  }));
  const arrows: CourtArrow[] = [
    ...(showMovements ? movementArrows(rotation, focusedMovement) : []),
    ...attackArrows(rotation, hoveredAttackId, showMovements),
  ];

  const layout: CourtLayout = { players, arrows };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <Court
          layout={layout}
          view="our-side"
          show3mLine
          idSuffix={`rotation-${rotation.id}`}
        />
      </div>

      <DiagramLegend
        movementKinds={showMovements ? movementKindsOf(rotation) : []}
        focused={focusedMovement}
        onFocus={setFocusedMovement}
      />

      {hasTwoSetters && (
        <SetterFocusToggle value={setterFocus} onChange={setSetterFocus} />
      )}

      {rotation.attacks.length > 0 && (
        <div>
          <h4
            style={{
              fontFamily: '"Bungee", sans-serif',
              fontSize: 13,
              letterSpacing: '0.08em',
              margin: '0 0 12px 0',
              color: 'var(--ink)',
            }}
          >
            {t('systems.attackOptions')}
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 10,
            }}
          >
            {rotation.attacks.map(attack => (
              <AttackCard
                key={attack.id}
                attack={attack}
                hovered={hoveredAttackId === attack.id}
                onHover={setHoveredAttackId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AttackCard({
  attack,
  hovered,
  onHover,
}: {
  attack: AttackOption;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const { t } = useTranslation('common');
  const riskColor = RISK_COLORS[attack.risk];
  return (
    <div
      onMouseEnter={() => onHover(attack.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(attack.id)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      style={{
        border: '2.5px solid var(--ink)',
        background: hovered ? 'var(--paper)' : 'var(--cream)',
        padding: '10px 12px',
        boxShadow: hovered ? '4px 4px 0 var(--ink)' : '2px 2px 0 var(--ink)',
        transform: hovered ? 'translate(-2px, -2px)' : 'translate(0, 0)',
        transition: 'transform 0.12s ease-out, box-shadow 0.12s ease-out, background 0.12s ease-out',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        outline: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.06em',
            color: 'var(--ink)',
          }}
        >
          {attack.label}
        </span>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 6px',
            fontFamily: '"DM Mono", monospace',
            fontSize: 9,
            letterSpacing: '0.08em',
            background: riskColor,
            color: attack.risk === 'medium' ? 'var(--ink)' : 'var(--cream)',
            border: '1.5px solid var(--ink)',
          }}
        >
          {t(`systems.risk.${attack.risk}`)}
        </span>
      </div>
      <span
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 10,
          opacity: 0.7,
          color: 'var(--ink)',
        }}
      >
        {t('systems.attackerLabel', { role: attack.attacker })} · {t('systems.tempoLabel', { tempo: attack.tempo })}
      </span>
    </div>
  );
}

function SetterFocusToggle({
  value,
  onChange,
}: {
  value: 'S' | 'S2' | null;
  onChange: (value: 'S' | 'S2' | null) => void;
}) {
  const { t } = useTranslation('common');
  const options: { id: 'S' | 'S2' | null; label: string }[] = [
    { id: null, label: t('systems.setterFocus.none') },
    { id: 'S', label: t('systems.setterFocus.s') },
    { id: 'S2', label: t('systems.setterFocus.s2') },
  ];
  return (
    <div
      role="group"
      aria-label={t('systems.setterFocus.label')}
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}
    >
      <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.06em' }}>
        {t('systems.setterFocus.label')}
      </span>
      {options.map(o => (
        <button
          key={o.id ?? 'none'}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          style={{
            padding: '4px 10px',
            border: '2px solid var(--ink)',
            background: value === o.id ? 'var(--yellow)' : 'var(--cream)',
            color: 'var(--ink)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.06em',
            cursor: 'pointer',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Movement entries are buttons: clicking one isolates that family on the
// court (the others fade), clicking it again shows every family.
function DiagramLegend({
  movementKinds,
  focused,
  onFocus,
}: {
  movementKinds: MovementKind[];
  focused: MovementKind | null;
  onFocus: (kind: MovementKind | null) => void;
}) {
  const { t } = useTranslation('common');
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 16px',
        padding: '8px 12px',
        border: '1.5px dashed rgba(26,24,18,0.35)',
        fontFamily: '"DM Mono", monospace',
        fontSize: 10,
        letterSpacing: '0.06em',
        color: 'var(--ink)',
        opacity: 0.85,
      }}
    >
      <LegendItem
        color="#e2542e"
        kind="solid"
        label={t('systems.legend.tempo1')}
      />
      <LegendItem
        color="#8a7a62"
        kind="dashed"
        label={t('systems.legend.tempo2')}
      />
      {movementKinds.map(kind => {
        const active = focused === kind;
        return (
          <button
            key={kind}
            type="button"
            aria-pressed={active}
            title={t('systems.legend.isolate')}
            onClick={() => onFocus(active ? null : kind)}
            style={{
              font: 'inherit',
              color: 'inherit',
              letterSpacing: 'inherit',
              background: active ? 'var(--paper)' : 'none',
              border: active ? '1.5px solid var(--ink)' : '1.5px solid transparent',
              padding: '1px 4px',
              margin: '-2px -5px',
              cursor: 'pointer',
              opacity: focused === null || active ? 1 : 0.45,
            }}
          >
            <LegendItem
              color={MOVEMENT_STYLE[kind].color}
              dash={MOVEMENT_STYLE[kind].dash}
              label={t(`systems.legend.${kind}`)}
            />
          </button>
        );
      })}
    </div>
  );
}

function LegendItem({
  color,
  kind,
  dash: dashOverride,
  label,
}: {
  color: string;
  kind?: 'solid' | 'dashed' | 'dotted';
  dash?: string;
  label: string;
}) {
  const dash = dashOverride ?? (kind === 'dashed' ? '6 5' : kind === 'dotted' ? '2 4' : undefined);
  const strokeWidth = kind === 'solid' ? 3 : 2;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <svg width={28} height={10} aria-hidden="true">
        <line
          x1={2}
          y1={5}
          x2={26}
          y2={5}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={dash}
        />
      </svg>
      {label}
    </span>
  );
}
