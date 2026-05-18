import { useTranslation } from 'react-i18next';
import { Court, type CourtArrow, type CourtLayout, type CourtPlayer } from '../components/court';
import { useCurrentLang } from '../i18n/paths';
import type { PlayerSlot, RoleCode, Rotation, AttackOption } from './types';
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

function slotToPlayer(slot: PlayerSlot, lang: string): CourtPlayer {
  const pastille = PASTILLE_LABEL[slot.role];
  return {
    id: slot.role,
    x: slot.servePosition.x,
    y: slot.servePosition.y,
    label: pastille.label,
    sub: pastille.sub,
    role: slot.color,
    caption: roleCaption(slot.role, lang),
  };
}

// Build one arrow per attack option: trajectory from the attacker's serve
// position to the strike point on the net. The line starts at the player's
// center; the player circle (z-index 2) sits on top so the arrow visually
// emerges from the player. Backoff is tiny because the target is empty
// space (no player at the net) — the default 24-unit backoff would consume
// short trajectories like MB quick from P3.
const ATTACK_BACKOFF = 4;

function attackArrows(rotation: Rotation): CourtArrow[] {
  return rotation.attacks
    .map(attack => {
      const attacker = rotation.slots.find(s => s.role === attack.attacker);
      if (!attacker) return null;
      return {
        id: `attack-${attack.id}`,
        from: attacker.servePosition,
        to: attack.target,
        kind: attack.risk === 'low' ? 'main' : 'alt',
        backoff: ATTACK_BACKOFF,
      } as CourtArrow;
    })
    .filter((a): a is CourtArrow => a !== null);
}

type Props = {
  rotation: Rotation;
};

export default function RotationDiagram({ rotation }: Props) {
  const { t } = useTranslation('common');
  const lang = useCurrentLang();

  const players = rotation.slots.map(s => slotToPlayer(s, lang));
  const arrows: CourtArrow[] = attackArrows(rotation);

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
              <AttackCard key={attack.id} attack={attack} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AttackCard({ attack }: { attack: AttackOption }) {
  const { t } = useTranslation('common');
  const riskColor = RISK_COLORS[attack.risk];
  return (
    <div
      style={{
        border: '2.5px solid var(--ink)',
        background: 'var(--cream)',
        padding: '10px 12px',
        boxShadow: '2px 2px 0 var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
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
