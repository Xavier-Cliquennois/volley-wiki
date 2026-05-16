import { useTranslation } from 'react-i18next';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';

type Role = {
  id: 'blocker' | 'defender';
  label: string;
  subtitle: string;
  profile: string;
  mission: string;
  tips: string[];
};

type Signal = {
  icon: string;
  signal: string;
  meaning: string;
  defender: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
};

type CallGroup = {
  title: string;
  items: string[];
};

const LEVEL_COLOR: Record<Signal['level'], string> = {
  'Débutant': 'var(--mint)',
  'Intermédiaire': 'var(--yellow)',
  'Avancé': 'var(--orange)',
};

// Map the raw FR level value coming from the JSON to the localized label
// already present in the `common` namespace for all supported languages.
const LEVEL_COMMON_KEY: Record<Signal['level'], string> = {
  'Débutant': 'level_beginner',
  'Intermédiaire': 'level_intermediate',
  'Avancé': 'level_advanced',
};

// Mini-court 16x8 m — beach proportions, drawn flat top-down.
function BeachCourt({ blockerLabel, defenderLabel, netLabel, endLineLabel }: {
  blockerLabel: string;
  defenderLabel: string;
  netLabel: string;
  endLineLabel: string;
}) {
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '2 / 1',
        background: 'var(--paper)',
        border: '3px solid var(--ink)',
        boxShadow: 'var(--shadow-sm)',
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent 0 22px, rgba(26,24,18,0.05) 22px 23px),' +
          'repeating-linear-gradient(90deg, transparent 0 22px, rgba(26,24,18,0.05) 22px 23px)',
      }}
    >
      {/* Net at center */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 6,
          background: 'var(--orange)',
          borderLeft: '1.5px solid var(--ink)',
          borderRight: '1.5px solid var(--ink)',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -22,
          transform: 'translateX(-50%)',
          fontFamily: '"Bungee", sans-serif',
          fontSize: 9,
          letterSpacing: '0.18em',
          color: 'var(--orange)',
        }}
      >
        {netLabel}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -22,
          textAlign: 'center',
          fontFamily: '"DM Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.1em',
          opacity: 0.6,
        }}
      >
        ← {endLineLabel} · 16 × 8 m · {endLineLabel} →
      </div>

      {/* Our side blocker (front) */}
      <BeachPlayer left="30%" top="28%" label={blockerLabel} variant="blocker" />
      {/* Our side defender (back) */}
      <BeachPlayer left="22%" top="70%" label={defenderLabel} variant="defender" />
      {/* Opponent side blocker */}
      <BeachPlayer left="70%" top="28%" label={blockerLabel} variant="opponent" />
      {/* Opponent side defender */}
      <BeachPlayer left="78%" top="70%" label={defenderLabel} variant="opponent" />
    </div>
  );
}

function BeachPlayer({
  left, top, label, variant,
}: { left: string; top: string; label: string; variant: 'blocker' | 'defender' | 'opponent' }) {
  const bg = variant === 'blocker' ? 'var(--teal)' : variant === 'defender' ? 'var(--orange)' : '#9aa3a5';
  const color = variant === 'opponent' || variant === 'defender' ? 'var(--ink)' : 'var(--cream)';
  return (
    <div style={{ position: 'absolute', left, top, transform: 'translate(-50%, -50%)' }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: bg,
          border: '3px solid var(--ink)',
          boxShadow: '2px 2px 0 var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Bungee", sans-serif',
          fontSize: 12,
          color,
        }}
      >
        {variant === 'blocker' ? 'B' : variant === 'defender' ? 'D' : '·'}
      </div>
      {variant !== 'opponent' && (
        <div
          style={{
            position: 'absolute',
            top: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--cream)',
            border: '2px solid var(--ink)',
            padding: '1px 6px',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 8,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export default function PositionsBeach() {
  const { t } = useTranslation('positionsBeach');
  const { t: tCommon } = useTranslation('common');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();

  const courtFacts = t('court.facts', { returnObjects: true }) as Record<string, string>;
  const courtLabels = t('court.labels', { returnObjects: true }) as Record<string, string>;
  const roles = t('roles.items', { returnObjects: true }) as Role[];
  const signals = t('signals.items', { returnObjects: true }) as Signal[];
  const headers = t('signals.headers', { returnObjects: true }) as Record<string, string>;
  const callGroups = t('calls.groups', { returnObjects: true }) as CallGroup[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <Head
        title={tSeo('positionsBeach.title')}
        description={tSeo('positionsBeach.description')}
        path="/beach/positions"
        jsonLd={buildBreadcrumb(
          [
            { name: tSeo('breadcrumbs.home'), path: '/' },
            { name: tSeo('breadcrumbs.beach'), path: '/beach' },
            { name: tSeo('breadcrumbs.beachPositions'), path: '/beach/positions' },
          ],
          lang,
        )}
      />

      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--orange)', marginBottom: 10 }}>
          {t('header.kicker')}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {t('header.title')}
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.75, maxWidth: 720, lineHeight: 1.6 }}>
          {t('header.subtitle')}
        </p>
      </div>

      {/* COURT */}
      <section>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 12 }}>
          {t('court.kicker')}
        </div>
        <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 22, margin: '0 0 18px', letterSpacing: '0.03em' }}>
          {t('court.title')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 28, alignItems: 'start' }}>
          <div style={{ padding: '24px 18px 36px' }}>
            <BeachCourt
              blockerLabel={courtLabels.blocker}
              defenderLabel={courtLabels.defender}
              netLabel={courtLabels.net}
              endLineLabel={courtLabels.endLine}
            />
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(courtFacts).map(([key, value]) => (
              <li key={key} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14 }}>
                <span style={{ color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', flexShrink: 0 }}>▸</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ROLES */}
      <section>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 12 }}>
          {t('roles.kicker')}
        </div>
        <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 22, margin: '0 0 12px', letterSpacing: '0.03em' }}>
          {t('roles.title')}
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: 14, opacity: 0.75, maxWidth: 720, lineHeight: 1.55 }}>
          {t('roles.intro')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {roles.map(role => (
            <div
              key={role.id}
              style={{
                border: '3px solid var(--ink)',
                boxShadow: 'var(--shadow)',
                background: 'var(--cream)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  background: role.id === 'blocker' ? 'var(--teal)' : 'var(--orange)',
                  color: role.id === 'blocker' ? 'var(--cream)' : 'var(--ink)',
                  borderBottom: '3px solid var(--ink)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 10,
                }}
              >
                <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16 }}>{role.label}</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em' }}>{role.subtitle}</span>
              </div>
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 4 }}>{t('roles.labels.profile')}</div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>{role.profile}</p>
                </div>
                <div>
                  <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 4 }}>{t('roles.labels.mission')}</div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>{role.mission}</p>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {role.tips.map((tip, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.45 }}>
                      <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            border: '3px solid var(--ink)',
            background: 'var(--mint)',
            boxShadow: 'var(--shadow-sm)',
            padding: '14px 18px',
          }}
        >
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.1em', marginBottom: 6 }}>
            {t('roles.switchingTitle')}
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>{t('roles.switchingBody')}</p>
        </div>
      </section>

      {/* SIGNALS */}
      <section>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--orange)', marginBottom: 12 }}>
          {t('signals.kicker')}
        </div>
        <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 22, margin: '0 0 12px', letterSpacing: '0.03em' }}>
          {t('signals.title')}
        </h2>
        <p style={{ margin: '0 0 14px', fontSize: 14, opacity: 0.75, maxWidth: 720, lineHeight: 1.55 }}>
          {t('signals.intro')}
        </p>

        <div
          style={{
            border: '3px solid var(--ink)',
            background: 'var(--yellow)',
            boxShadow: 'var(--shadow-sm)',
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <span aria-hidden style={{ fontFamily: '"Bungee", sans-serif', fontSize: 18, color: 'var(--orange)', flexShrink: 0 }}>⚠</span>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{t('signals.warning')}</p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              border: '3px solid var(--ink)',
              boxShadow: 'var(--shadow)',
              background: 'var(--cream)',
              minWidth: 560,
            }}
          >
            <thead>
              <tr>
                {[headers.signal, headers.meaning, headers.defender, headers.level].map(h => (
                  <th
                    key={h}
                    style={{
                      background: 'var(--ink)',
                      color: 'var(--cream)',
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      textAlign: 'left',
                      padding: '10px 14px',
                      borderRight: '2.5px solid var(--ink)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {signals.map((sig, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      padding: '12px 14px',
                      borderRight: '2.5px solid var(--ink)',
                      borderBottom: idx < signals.length - 1 ? '2.5px solid var(--ink)' : 'none',
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 12,
                      letterSpacing: '0.06em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{sig.icon}</span>
                    <span>{sig.signal}</span>
                  </td>
                  <td style={{ padding: '12px 14px', borderRight: '2.5px solid var(--ink)', borderBottom: idx < signals.length - 1 ? '2.5px solid var(--ink)' : 'none', fontSize: 13 }}>
                    {sig.meaning}
                  </td>
                  <td style={{ padding: '12px 14px', borderRight: '2.5px solid var(--ink)', borderBottom: idx < signals.length - 1 ? '2.5px solid var(--ink)' : 'none', fontSize: 13 }}>
                    {sig.defender}
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: idx < signals.length - 1 ? '2.5px solid var(--ink)' : 'none' }}>
                    <span
                      style={{
                        padding: '2px 10px',
                        border: '2.5px solid var(--ink)',
                        background: LEVEL_COLOR[sig.level],
                        fontFamily: '"Bungee", sans-serif',
                        fontSize: 9,
                        letterSpacing: '0.1em',
                      }}
                    >
                      {tCommon(`labels.${LEVEL_COMMON_KEY[sig.level]}`).toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: 20,
            border: '3px solid var(--ink)',
            background: 'var(--cream)',
            boxShadow: 'var(--shadow-sm)',
            padding: '14px 18px',
          }}
        >
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.1em', marginBottom: 6, color: 'var(--teal)' }}>
            {t('signals.logicTitle')}
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}>{t('signals.logicBody')}</p>
        </div>
      </section>

      {/* CALLS */}
      <section>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 12 }}>
          {t('calls.kicker')}
        </div>
        <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 22, margin: '0 0 12px', letterSpacing: '0.03em' }}>
          {t('calls.title')}
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: 14, opacity: 0.75, maxWidth: 720, lineHeight: 1.55 }}>
          {t('calls.intro')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {callGroups.map(group => (
            <div
              key={group.title}
              style={{ border: '3px solid var(--ink)', background: 'var(--cream)', boxShadow: 'var(--shadow-sm)', padding: 18 }}
            >
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em', marginBottom: 12, color: 'var(--orange)' }}>
                {group.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {group.items.map((it, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.45 }}>
                    <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
