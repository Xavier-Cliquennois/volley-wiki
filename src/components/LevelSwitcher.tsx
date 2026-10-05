import { useTranslation } from 'react-i18next';
import { LEVELS, useUserLevel, type Level } from '../userLevel/useUserLevel';

const LEVEL_ACCENT: Record<Level, string> = {
  beginner: 'var(--teal)',
  intermediate: 'var(--orange)',
  advanced: 'var(--pink)',
};

const LEVEL_TEXT_ON: Record<Level, string> = {
  beginner: 'var(--cream)',
  intermediate: 'var(--ink)',
  advanced: 'var(--cream)',
};

export default function LevelSwitcher({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { t } = useTranslation('common');
  const [current, setLevel] = useUserLevel();

  const fontSize = size === 'sm' ? 10 : 11;
  const padY = size === 'sm' ? 4 : 5;
  const padX = size === 'sm' ? 8 : 10;

  return (
    <div
      role="group"
      aria-label={t('userLevel.switcherLabel')}
      style={{
        display: 'inline-flex',
        border: '2.5px solid var(--ink)',
        boxShadow: '2px 2px 0 var(--ink)',
        background: 'var(--cream)',
      }}
    >
      {LEVELS.map((l, idx) => {
        const active = l === current;
        return (
          <button
            key={l}
            type="button"
            aria-pressed={active}
            onClick={() => setLevel(l)}
            style={{
              padding: `${padY}px ${padX}px`,
              fontFamily: '"Bungee", sans-serif',
              fontSize,
              letterSpacing: '0.08em',
              border: 'none',
              borderRight: idx < LEVELS.length - 1 ? '2.5px solid var(--ink)' : 'none',
              background: active ? LEVEL_ACCENT[l] : 'transparent',
              color: active ? LEVEL_TEXT_ON[l] : 'var(--ink)',
              cursor: 'pointer',
              transition: 'background 0.08s, color 0.08s',
            }}
          >
            {t(`userLevel.${l}Short`)}
          </button>
        );
      })}
    </div>
  );
}
