import type { StepTempo } from './types';
import { TEMPO_META } from './types';

// Order matters: pause / calme / standard / rapide reads left-to-right as
// "slow → fast", which matches the natural mental model.
const ORDERED: ReadonlyArray<StepTempo> = ['pause', 'calme', 'standard', 'rapide'];

const ICONS: Record<StepTempo, string> = {
  pause:    '⏸',
  calme:    '⏵',
  standard: '⏯',
  rapide:   '⏩',
};

const monoLabel: React.CSSProperties = {
  fontFamily: '"Bungee", sans-serif',
  fontSize: 11,
  letterSpacing: '0.08em',
  color: 'var(--ink)',
  marginBottom: 6,
  display: 'block',
};

export function TempoPicker({
  value,
  onChange,
  isFirstStep,
}: {
  value: StepTempo;
  onChange: (t: StepTempo) => void;
  isFirstStep: boolean;
}) {
  return (
    <div>
      <span style={monoLabel}>
        {isFirstStep ? 'Pause initiale' : 'Tempo de cette transition'}
      </span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {ORDERED.map(t => {
          const isActive = t === value;
          const meta = TEMPO_META[t];
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              title={`${meta.label} — ${meta.subtitle}`}
              style={{
                flex: '1 1 90px',
                minWidth: 90,
                padding: '8px 10px',
                border: `2.5px solid var(--ink)`,
                background: isActive ? 'var(--orange)' : 'var(--cream)',
                color: isActive ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                fontFamily: '"Bungee", sans-serif',
                fontSize: 11,
                letterSpacing: '0.06em',
                boxShadow: isActive ? '2px 2px 0 var(--ink)' : 'none',
                transform: isActive ? 'translate(-1px, -1px)' : 'none',
              }}
            >
              <span style={{ fontSize: 16, fontFamily: 'system-ui' }}>{ICONS[t]}</span>
              <span>{meta.label}</span>
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, opacity: isActive ? 0.85 : 0.55, letterSpacing: 0 }}>
                {meta.subtitle}
              </span>
            </button>
          );
        })}
      </div>
      <p style={{ margin: '6px 0 0 0', fontSize: 11, color: 'var(--ink)', opacity: 0.55, fontFamily: '"DM Mono", monospace' }}>
        {isFirstStep
          ? 'Durée pendant laquelle la position de départ reste affichée avant le premier mouvement.'
          : 'Durée de l’animation entre la carte précédente et celle-ci.'}
      </p>
    </div>
  );
}
