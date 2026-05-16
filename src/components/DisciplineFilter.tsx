import { useTranslation } from 'react-i18next';

export type DisciplineFilterValue = 'all' | 'indoor' | 'beach' | 'both';

const DOT_COLORS: Record<DisciplineFilterValue, string> = {
  all: 'var(--ink)',
  indoor: 'var(--teal)',
  beach: 'var(--orange)',
  both: 'var(--mint)',
};

const ACTIVE_BG: Record<DisciplineFilterValue, string> = {
  all: 'var(--yellow)',
  indoor: 'var(--teal)',
  beach: 'var(--orange)',
  both: 'var(--mint)',
};

const ACTIVE_TEXT: Record<DisciplineFilterValue, string> = {
  all: 'var(--ink)',
  indoor: 'var(--cream)',
  beach: 'var(--ink)',
  both: 'var(--ink)',
};

const ORDER: DisciplineFilterValue[] = ['all', 'indoor', 'beach', 'both'];

export default function DisciplineFilter({
  value,
  onChange,
}: {
  value: DisciplineFilterValue;
  onChange: (v: DisciplineFilterValue) => void;
}) {
  const { t } = useTranslation('common');

  return (
    <div
      role="radiogroup"
      aria-label={t('discipline.filter.label')}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}
    >
      <span
        style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 10,
          letterSpacing: '0.14em',
          opacity: 0.6,
        }}
      >
        {t('discipline.filter.kicker')}
      </span>
      {ORDER.map(v => {
        const on = v === value;
        return (
          <button
            key={v}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              border: '2.5px solid var(--ink)',
              background: on ? ACTIVE_BG[v] : 'var(--cream)',
              color: on ? ACTIVE_TEXT[v] : 'var(--ink)',
              fontFamily: '"DM Mono", monospace',
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 999,
              cursor: 'pointer',
              boxShadow: on ? '2px 2px 0 var(--ink)' : 'none',
              transform: on ? 'translate(-1px,-1px)' : 'none',
              transition: 'all 0.08s',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: DOT_COLORS[v],
                border: '1.5px solid var(--ink)',
              }}
            />
            {t(`discipline.filter.${v}`)}
          </button>
        );
      })}
    </div>
  );
}
