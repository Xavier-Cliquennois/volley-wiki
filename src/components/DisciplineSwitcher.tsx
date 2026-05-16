import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentLang } from '../i18n/paths';
import { useDiscipline, swapDisciplineInPath, DISCIPLINES, type Discipline } from '../discipline/useDiscipline';

const DISCIPLINE_ACCENT: Record<Discipline, string> = {
  indoor: 'var(--teal)',
  beach: 'var(--orange)',
};

const DISCIPLINE_TEXT_ON: Record<Discipline, string> = {
  indoor: 'var(--cream)',
  beach: 'var(--ink)',
};

export default function DisciplineSwitcher({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const lang = useCurrentLang();
  const location = useLocation();
  const current = useDiscipline();
  const { t } = useTranslation('common');

  const fontSize = size === 'sm' ? 10 : 11;
  const padY = size === 'sm' ? 4 : 5;
  const padX = size === 'sm' ? 10 : 12;

  return (
    <div
      role="group"
      aria-label={t('discipline.switcherLabel')}
      style={{
        display: 'inline-flex',
        border: '2.5px solid var(--ink)',
        boxShadow: '2px 2px 0 var(--ink)',
        background: 'var(--cream)',
      }}
    >
      {DISCIPLINES.map((d, idx) => {
        const active = d === current;
        const href = `${swapDisciplineInPath(location.pathname, d, lang)}${location.search}${location.hash}`;
        return (
          <Link
            key={d}
            to={href}
            aria-pressed={active}
            style={{
              padding: `${padY}px ${padX}px`,
              fontFamily: '"Bungee", sans-serif',
              fontSize,
              letterSpacing: '0.08em',
              textDecoration: 'none',
              borderRight: idx < DISCIPLINES.length - 1 ? '2.5px solid var(--ink)' : 'none',
              background: active ? DISCIPLINE_ACCENT[d] : 'transparent',
              color: active ? DISCIPLINE_TEXT_ON[d] : 'var(--ink)',
              transition: 'background 0.08s, color 0.08s',
            }}
          >
            {t(`discipline.${d}`)}
          </Link>
        );
      })}
    </div>
  );
}
