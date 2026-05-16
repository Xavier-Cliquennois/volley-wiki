import { useTranslation } from 'react-i18next';
import type { Discipline } from '../discipline/useDiscipline';

// "both" denotes content shared between the two disciplines. We accept either
// a single key or an array (e.g. ["indoor","beach"] from a JSON entry) and
// resolve to "both" when both are present.
export type DisciplineKey = Discipline | 'both';

function resolveKey(value: DisciplineKey | readonly Discipline[]): DisciplineKey {
  if (typeof value === 'string') return value;
  const set = new Set(value);
  if (set.size === 0) return 'indoor';
  if (set.size === 1) return [...set][0];
  return 'both';
}

const STYLES: Record<DisciplineKey, { bg: string; color: string; rotate: number }> = {
  indoor: { bg: 'var(--teal)', color: 'var(--cream)', rotate: -6 },
  beach: { bg: 'var(--orange)', color: 'var(--ink)', rotate: 6 },
  both: { bg: 'var(--mint)', color: 'var(--ink)', rotate: -3 },
};

export default function DisciplineBadge({
  on,
  size = 'md',
  style,
}: {
  on: DisciplineKey | readonly Discipline[];
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}) {
  const { t } = useTranslation('common');
  const key = resolveKey(on);
  const s = STYLES[key];
  const fontSize = size === 'sm' ? 8 : 9;
  const padY = size === 'sm' ? 2 : 3;
  const padX = size === 'sm' ? 8 : 10;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${padY}px ${padX}px`,
        background: s.bg,
        color: s.color,
        border: '2.5px solid var(--ink)',
        boxShadow: '2px 2px 0 var(--ink)',
        fontFamily: '"Bungee", sans-serif',
        fontSize,
        letterSpacing: '0.1em',
        transform: `rotate(${s.rotate}deg)`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {t(`discipline.badge.${key}`)}
    </span>
  );
}
