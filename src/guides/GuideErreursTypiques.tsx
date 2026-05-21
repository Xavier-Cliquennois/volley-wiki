import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import { S } from './styles';
import { ROLE_COLORS, type RoleColorKey } from '../constants/positions';

type Error = { label: string; text: string };
type Position = { role: string; color: RoleColorKey; errors: Error[] };

export default function GuideErreursTypiques() {
  const { t } = useTranslation('guideContent');
  const positions = t('erreursTypiques.positions', { returnObjects: true }) as Position[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <GoldenRule>{t('erreursTypiques.intro.body')}</GoldenRule>

      <section>
        <h2 style={S.section}>{t('erreursTypiques.intro.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {positions.map((pos, pIdx) => {
            const color = ROLE_COLORS[pos.color] ?? 'var(--ink)';
            return (
              <article
                key={pIdx}
                style={{
                  border: `3px solid var(--ink)`,
                  background: 'var(--cream)',
                  boxShadow: 'var(--shadow)',
                  padding: 0,
                  overflow: 'hidden',
                }}
              >
                <header
                  style={{
                    background: color,
                    color: pos.color === 'P5' ? 'var(--ink)' : 'var(--cream)',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--cream)',
                      color,
                      border: '2.5px solid var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 11,
                      flexShrink: 0,
                    }}
                  >
                    {pos.color}
                  </span>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 16,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {pos.role}
                  </h3>
                </header>
                <div
                  style={{
                    padding: '16px 20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 14,
                  }}
                >
                  {pos.errors.map((err, eIdx) => (
                    <div
                      key={eIdx}
                      style={{
                        ...S.card,
                        background: 'var(--paper)',
                        borderLeft: `4px solid ${color}`,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                        <span style={{ ...S.stepBadge, background: color, color: pos.color === 'P5' ? 'var(--ink)' : 'var(--cream)' }}>
                          {eIdx + 1}
                        </span>
                        <strong style={{ fontSize: 13, lineHeight: 1.4 }}>{err.label}</strong>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, opacity: 0.85 }}>{err.text}</p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
