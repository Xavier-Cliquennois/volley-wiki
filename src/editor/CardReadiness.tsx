import type { EditorStep } from './types';

// Compact "is this card ready?" panel — shown at the bottom of the card editor
// to surface what's already filled in vs what's missing, plus a primary CTA
// to advance to the next card.
//
// Validation is soft: nothing is blocked. The panel is informative — the
// author can still add the next card with empty fields, but they see at a
// glance that the description is missing.

type CheckItem = { label: string; ok: boolean; required: boolean };

function buildChecklist(step: EditorStep, playerCount: number): CheckItem[] {
  const items: CheckItem[] = [
    { label: 'Titre rempli',                 ok: step.title.trim().length > 0,         required: true },
    { label: 'Description rempli',           ok: step.description.trim().length > 0,   required: true },
    { label: `${playerCount} joueurs placés`, ok: playerCount > 0,                      required: true },
    { label: 'Ballon positionné',            ok: true,                                 required: true }, // always set
    { label: 'Briques d’action',             ok: (step.actions?.length ?? 0) > 0,      required: false },
  ];
  return items;
}

export function CardReadiness({
  step,
  playerCount,
  onAddNext,
}: {
  step: EditorStep;
  playerCount: number;
  onAddNext: () => void;
}) {
  const items = buildChecklist(step, playerCount);
  const requiredItems = items.filter(i => i.required);
  const requiredOk = requiredItems.filter(i => i.ok).length;
  const ready = requiredOk === requiredItems.length;

  return (
    <div style={{
      marginTop: 14,
      padding: '12px 14px',
      border: `2px solid ${ready ? 'var(--ink)' : 'var(--orange)'}`,
      background: ready ? 'var(--cream)' : 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em', color: ready ? 'var(--ink)' : 'var(--orange)' }}>
          {ready
            ? `CARTE PRÊTE (${requiredOk}/${requiredItems.length})`
            : `CARTE INCOMPLÈTE (${requiredOk}/${requiredItems.length})`}
        </span>
        <button
          onClick={onAddNext}
          style={{
            border: '2.5px solid var(--ink)',
            background: ready ? 'var(--orange)' : 'var(--cream)',
            color: ready ? '#fff' : 'var(--ink)',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.06em',
            padding: '8px 16px',
            cursor: 'pointer',
            boxShadow: ready ? '2px 2px 0 var(--ink)' : 'none',
            transform: ready ? 'translate(-1px, -1px)' : 'none',
          }}
        >
          + Carte suivante
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              border: '1.5px solid var(--ink)',
              background: item.ok ? 'var(--cream)' : 'transparent',
              fontFamily: '"DM Mono", monospace',
              fontSize: 11,
              opacity: item.ok ? 1 : 0.65,
            }}
          >
            <span style={{ color: item.ok ? 'var(--orange)' : 'var(--ink)', opacity: item.ok ? 1 : 0.4 }}>
              {item.ok ? '✓' : '○'}
            </span>
            <span>{item.label}</span>
            {!item.required && (
              <span style={{ opacity: 0.5, fontSize: 9, marginLeft: 2 }}>(optionnel)</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
