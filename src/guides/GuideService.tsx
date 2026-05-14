import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';

const LEVEL_COLOR: Record<string, string> = {
  beginner: 'var(--mint)',
  'beginner-intermediate': 'var(--mint)',
  intermediate: 'var(--yellow)',
  'intermediate-plus': 'var(--orange)',
  advanced: 'var(--orange)',
  competition: 'var(--plum)',
};

const LEVEL_TEXT: Record<string, string> = {
  competition: '#fff',
};

type ErrorItem = { label: string; text: string };
type VideoItem = { title: string; url: string };
type ServiceType = {
  id: string;
  name: string;
  level: string;
  levelLabel: string;
  tagline: string;
  description: string;
  biomechanics: string[];
  steps: string[];
  errors: ErrorItem[];
  exercises: string[];
  videos: VideoItem[];
};
type ZoneRow = { zone: string; effect: string };
type LabelText = { label: string; text: string };

const S: Record<string, React.CSSProperties> = {
  sectionTitle: {
    fontFamily: '"Bungee", sans-serif', fontSize: 18, letterSpacing: '0.03em',
    margin: '0 0 18px 0', paddingBottom: 10, borderBottom: '3px solid var(--ink)',
  },
  label: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', marginBottom: 10 },
  labelTeal: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 },
  labelOrange: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 10 },
  card: { border: '3px solid var(--ink)', background: 'var(--cream)', boxShadow: 'var(--shadow)', padding: 20 },
  alert: { border: '3px solid var(--ink)', background: 'var(--yellow)', boxShadow: 'var(--shadow-sm)', padding: '14px 20px' },
};

export default function GuideService() {
  const { t } = useTranslation('guideContent');

  const serviceTypes = t('service.types.items', { returnObjects: true }) as ServiceType[];
  const zoneRows = t('service.zones.rows', { returnObjects: true }) as ZoneRow[];
  const zoneTips = t('service.zones.tips', { returnObjects: true }) as LabelText[];

  const [activeId, setActiveId] = useState(serviceTypes[0]?.id ?? 'cuillere');
  const current = serviceTypes.find(s => s.id === activeId) ?? serviceTypes[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* Règle d'or */}
      <GoldenRule>
        {t('service.goldenRule.body')}
      </GoldenRule>

      {/* Service type selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={S.sectionTitle}>{t('service.types.title')}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {serviceTypes.map(st => {
            const on = activeId === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setActiveId(st.id)}
                style={{
                  padding: '7px 16px',
                  fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.06em',
                  border: '2.5px solid var(--ink)',
                  background: on ? LEVEL_COLOR[st.level] : 'var(--cream)',
                  color: on && LEVEL_TEXT[st.level] ? LEVEL_TEXT[st.level] : 'var(--ink)',
                  cursor: 'pointer',
                  boxShadow: on ? 'var(--shadow-sm)' : 'none',
                  transform: on ? 'translate(-1px,-1px)' : 'none',
                  transition: 'all 0.08s',
                }}
              >
                {st.name}
              </button>
            );
          })}
        </div>

        <span style={{
          padding: '3px 12px',
          border: '2.5px solid var(--ink)',
          background: LEVEL_COLOR[current.level],
          fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.1em',
          display: 'inline-block',
          color: LEVEL_TEXT[current.level] || 'var(--ink)',
        }}>{current.levelLabel.toUpperCase()}</span>

        <div style={S.card}>
          <h3 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, margin: '0 0 4px 0' }}>{current.name}</h3>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', opacity: 0.6, marginBottom: 14 }}>{current.tagline}</div>
          <p style={{ margin: '0 0 18px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{current.description}</p>

          <div style={{ marginBottom: 18 }}>
            <div style={S.labelTeal}>{t('service.types.biomechanicsLabel')}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.biomechanics.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...S.label, opacity: 0.7 }}>{t('service.types.stepsLabel')}</div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {current.steps.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{
                    background: 'var(--orange)', color: 'var(--ink)',
                    fontFamily: '"Bungee", sans-serif', fontSize: 11,
                    width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            <div>
              <div style={S.labelOrange}>{t('service.types.errorsLabel')}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {current.errors.map((err, i) => (
                  <li key={i} style={{ fontSize: 13 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--orange)', flexShrink: 0 }}>✗</span>
                      <strong>{err.label}</strong>
                    </div>
                    <div style={{ paddingLeft: 20, marginTop: 3, fontSize: 12, opacity: 0.65 }}>{err.text}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={S.labelTeal}>{t('service.types.exercisesLabel')}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {current.exercises.map((e, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                    <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {current.videos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ ...S.label, opacity: 0.6 }}>{t('service.types.videosLabel')} — {current.name.toUpperCase()}</div>
            {current.videos.map((v, i) => (
              <VideoLink key={i} title={v.title} url={v.url} />
            ))}
          </div>
        )}
      </section>

      {/* Zones */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={S.sectionTitle}>{t('service.zones.title')}</h2>
        <div style={{ border: '3px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>{t('service.zones.headerZone')}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>{t('service.zones.headerEffect')}</th>
              </tr>
            </thead>
            <tbody>
              {zoneRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < zoneRows.length - 1 ? '2px solid var(--ink)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--orange)' }}>{row.zone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, opacity: 0.8 }}>{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {zoneTips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>
              <span><strong>{tip.label} : </strong><span style={{ opacity: 0.8 }}>{tip.text}</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* Hierarchy */}
      <section>
        <div style={{ border: '3px solid var(--ink)', background: 'var(--cream)', boxShadow: 'var(--shadow)', padding: 20 }}>
          <div style={{ ...S.label, marginBottom: 16 }}>{t('service.learningHierarchy.label')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 14 }}>
            {serviceTypes.map(st => {
              const textColor = LEVEL_TEXT[st.level] || 'var(--ink)';
              return (
                <div key={st.id} style={{
                  border: '2.5px solid var(--ink)',
                  background: LEVEL_COLOR[st.level],
                  padding: '10px 12px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: textColor, marginBottom: 4 }}>{st.name}</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: textColor, opacity: 0.7 }}>{st.levelLabel}</div>
                </div>
              );
            })}
          </div>
          <p
            style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: t('service.learningHierarchy.footer') }}
          />
        </div>
      </section>

    </div>
  );
}
