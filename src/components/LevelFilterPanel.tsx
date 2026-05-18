import { useTranslation } from 'react-i18next';
import LevelSwitcher from './LevelSwitcher';

// Inline level filter for pages with leveled content. Adds an explanatory
// kicker + tagline around LevelSwitcher so the toggle's purpose is obvious.
export default function LevelFilterPanel() {
  const { t } = useTranslation('common');
  return (
    <div
      style={{
        border: '2.5px solid var(--ink)',
        background: 'var(--cream)',
        padding: '14px 18px',
        boxShadow: '3px 3px 0 var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div
            style={{
              fontFamily: '"Bungee", sans-serif',
              fontSize: 11,
              letterSpacing: '0.14em',
              color: 'var(--teal)',
            }}
          >
            {t('userLevel.panelKicker')}
          </div>
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              opacity: 0.7,
              marginTop: 2,
            }}
          >
            {t('userLevel.panelTagline')}
          </div>
        </div>
        <LevelSwitcher />
      </div>
    </div>
  );
}
