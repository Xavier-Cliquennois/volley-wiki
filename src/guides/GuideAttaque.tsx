import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';
import DrillList from '../drills/DrillList';
import { QuizEmbed } from '../quiz/components/QuizEmbed';

const LEVEL_COLOR: Record<string, string> = {
  beginner: 'var(--mint)',
  'beginner-intermediate': 'var(--mint)',
  intermediate: 'var(--yellow)',
  'intermediate-plus': 'var(--orange)',
  advanced: 'var(--orange)',
};

type Phase = { name: string; desc: string };
type ApproachStep = { label: string; text: string };
type ApproachVariant = { title: string; sub: string; items: ApproachStep[]; rule?: string };
type TimingRow = { type: string; timing: string };
type AttackType = {
  id: string;
  name: string;
  position: string;
  description: string;
  keyPoints: string[];
  shots: string[];
};
type SpecialShot = { name: string; level: string; levelLabel: string; desc: string };
type ErrorItem = { label: string; text: string };
type VideoItem = { title: string; url: string };

export default function GuideAttaque() {
  const { t } = useTranslation('guideContent');
  const { t: tD } = useTranslation('drills');

  const phases = t('attaque.phases.items', { returnObjects: true }) as Phase[];
  const approachThree = t('attaque.approach.three', { returnObjects: true }) as ApproachVariant;
  const approachFour = t('attaque.approach.four', { returnObjects: true }) as ApproachVariant;
  const timingRows = t('attaque.timing.rows', { returnObjects: true }) as TimingRow[];
  const attackTypes = t('attaque.types.items', { returnObjects: true }) as AttackType[];
  const specialShots = t('attaque.special.items', { returnObjects: true }) as SpecialShot[];
  const errors = t('attaque.errors.items', { returnObjects: true }) as ErrorItem[];
  const videos = t('attaque.videos.items', { returnObjects: true }) as VideoItem[];

  const [activeAttack, setActiveAttack] = useState(attackTypes[0]?.id ?? 'outside');
  const current = attackTypes.find(t => t.id === activeAttack) ?? attackTypes[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <GoldenRule mantra={t('attaque.goldenRule.mantra')}>
        {t('attaque.goldenRule.body')}
      </GoldenRule>

      <section>
        <h2 style={S.section}>{t('attaque.phases.title')}</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {phases.map((phase, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <div>
                <strong style={{ fontSize: 14, color: 'var(--ink)' }}>{phase.name} : </strong>
                <span style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75 }}>{phase.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14 }}>
          <strong style={{ color: 'var(--ink)' }}>{t('attaque.phases.footerLabel')} : </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{t('attaque.phases.footer')}</span>
        </div>
      </section>

      <section>
        <h2 style={S.section}>{t('attaque.approach.title')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {[approachThree, approachFour].map((variant, idx) => (
            <div key={idx} style={idx === 1 ? { ...S.card, border: '2.5px solid var(--orange)' } : S.card}>
              <div style={S.label}>{variant.title}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>{variant.sub}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {variant.items.map((step, i) => (
                  <li key={i} style={{ fontSize: 13 }}>
                    <strong style={{ color: 'var(--ink)' }}>{step.label} : </strong>
                    <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{step.text}</span>
                  </li>
                ))}
              </ul>
              {variant.rule && (
                <div style={{ marginTop: 10, borderLeft: '3px solid var(--orange)', paddingLeft: 10, fontSize: 12, color: 'var(--orange)', fontFamily: '"DM Mono", monospace' }}>
                  {variant.rule}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>{t('attaque.timing.title')}</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>{t('attaque.timing.headerType')}</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>{t('attaque.timing.headerWhen')}</th>
              </tr>
            </thead>
            <tbody>
              {timingRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < timingRows.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{row.type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{row.timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 style={S.section}>{t('attaque.types.title')}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {attackTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveAttack(t.id)}
              style={{
                padding: '6px 14px',
                fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em',
                border: '2.5px solid var(--ink)',
                background: activeAttack === t.id ? 'var(--orange)' : 'var(--cream)',
                color: activeAttack === t.id ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                boxShadow: activeAttack === t.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t.position}
            </button>
          ))}
        </div>
        {current && (
          <div style={S.card}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>{current.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{current.position}</div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.8, lineHeight: 1.6, marginBottom: 16 }}>{current.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <div style={S.labelTeal}>{t('attaque.types.keyPointsLabel')}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {current.keyPoints.map((pt, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <span style={S.bullet}>▸</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={S.label}>{t('attaque.types.shotsLabel')}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {current.shots.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <span style={S.bulletOrange}>▸</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 style={S.section}>{t('attaque.special.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {specialShots.map((s, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{s.name}</div>
                <span style={{
                  fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 10px',
                  border: '1.5px solid var(--ink)',
                  background: LEVEL_COLOR[s.level] || 'var(--paper)',
                  color: 'var(--ink)', flexShrink: 0,
                }}>{s.levelLabel}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>{t('attaque.errors.title')}</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>{t('attaque.errors.subtitle')}</div>
          {errors.map((err, i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{err.label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{err.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>{tD('sectionTitle', { skill: tD('skills.attack') })}</h2>
        <DrillList skill="attack" />
      </section>

      <section>
        <h2 style={S.section}>{t('attaque.videos.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {videos.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

      <QuizEmbed slug="options-attaque" />
    </div>
  );
}
