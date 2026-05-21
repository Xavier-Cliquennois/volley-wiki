import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import { S } from './styles';
import LevelFilterPanel from '../components/LevelFilterPanel';
import LeveledContent from '../components/LeveledContent';
import type { Level } from '../userLevel/useUserLevel';

type CompareRow = { category: string; indoor: string; beach: string; impact: 'low' | 'high' };
type SkillRow = { skill: string; indoor: string; beach: string };
type LabelText = { label: string; text: string };
type Drill = { level: string; desc: string };

const LEVEL_BY_KEY: Record<string, Level> = {
  skillAdaptations: 'intermediate',
  tacticAdaptations: 'intermediate',
  physical: 'intermediate',
  drills: 'intermediate',
};

export default function GuideIndoorBeach() {
  const { t } = useTranslation('guideContent');

  const rows = t('indoorBeach.overview.rows', { returnObjects: true }) as CompareRow[];
  const skills = t('indoorBeach.skillAdaptations.items', { returnObjects: true }) as SkillRow[];
  const tactics = t('indoorBeach.tacticAdaptations.items', { returnObjects: true }) as LabelText[];
  const physical = t('indoorBeach.physical.items', { returnObjects: true }) as LabelText[];
  const cases = t('indoorBeach.whenToTransition.cases', { returnObjects: true }) as LabelText[];
  const mistakes = t('indoorBeach.commonMistakes.items', { returnObjects: true }) as LabelText[];
  const drills = t('indoorBeach.drills.items', { returnObjects: true }) as Drill[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <GoldenRule mantra={t('indoorBeach.goldenRule.mantra')}>
        {t('indoorBeach.goldenRule.body')}
      </GoldenRule>

      <LevelFilterPanel />

      {/* Comparison table */}
      <section>
        <h2 style={S.section}>{t('indoorBeach.overview.title')}</h2>
        <p style={{ margin: '0 0 16px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          {t('indoorBeach.overview.intro')}
        </p>
        <div style={{ ...S.card, padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ background: 'var(--cream)' }}>
                <th style={tableHeadStyle}></th>
                <th style={tableHeadStyle}>Indoor</th>
                <th style={tableHeadStyle}>Beach</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: '1.5px solid rgba(26,24,18,0.2)',
                    background: row.impact === 'high' ? 'rgba(226, 84, 46, 0.06)' : 'transparent',
                  }}
                >
                  <td style={{ ...tableCellStyle, fontWeight: 600 }}>
                    {row.impact === 'high' && (
                      <span style={{ color: 'var(--orange)', marginRight: 6 }}>★</span>
                    )}
                    {row.category}
                  </td>
                  <td style={tableCellStyle}>{row.indoor}</td>
                  <td style={tableCellStyle}>{row.beach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Skill adaptations */}
      <LeveledContent requires={LEVEL_BY_KEY.skillAdaptations}>
        <section>
          <SectionHeader title={t('indoorBeach.skillAdaptations.title')} level={t('indoorBeach.skillAdaptations.level')} />
          <p style={{ margin: '0 0 16px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('indoorBeach.skillAdaptations.intro')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {skills.map((skill, idx) => (
              <div key={idx} style={S.card}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, letterSpacing: '0.04em', marginBottom: 10, color: 'var(--orange)' }}>
                  {skill.skill}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  <div>
                    <div style={S.labelTeal}>Indoor</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55 }}>{skill.indoor}</p>
                  </div>
                  <div>
                    <div style={S.label}>Beach</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55 }}>{skill.beach}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </LeveledContent>

      {/* Tactical adaptations */}
      <LeveledContent requires={LEVEL_BY_KEY.tacticAdaptations}>
        <section>
          <SectionHeader title={t('indoorBeach.tacticAdaptations.title')} level={t('indoorBeach.tacticAdaptations.level')} />
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('indoorBeach.tacticAdaptations.intro')}
          </p>
          <CueGrid cues={tactics} />
        </section>
      </LeveledContent>

      {/* Physical preparation */}
      <LeveledContent requires={LEVEL_BY_KEY.physical}>
        <section>
          <SectionHeader title={t('indoorBeach.physical.title')} level={t('indoorBeach.physical.level')} />
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('indoorBeach.physical.intro')}
          </p>
          <CueGrid cues={physical} />
        </section>
      </LeveledContent>

      {/* When to transition */}
      <section>
        <h2 style={S.section}>{t('indoorBeach.whenToTransition.title')}</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          {t('indoorBeach.whenToTransition.intro')}
        </p>
        <CueGrid cues={cases} />
      </section>

      {/* Common mistakes */}
      <section>
        <h2 style={S.section}>{t('indoorBeach.commonMistakes.title')}</h2>
        <CueGrid cues={mistakes} variant="warning" />
      </section>

      {/* Drills */}
      <LeveledContent requires={LEVEL_BY_KEY.drills}>
        <section>
          <SectionHeader title={t('indoorBeach.drills.title')} level={t('indoorBeach.drills.level')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {drills.map((drill, idx) => (
              <div key={idx} style={{ ...S.card, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={S.stepBadge}>{idx + 1}</span>
                <div>
                  <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.04em', marginBottom: 4 }}>
                    {drill.level}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{drill.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </LeveledContent>
    </div>
  );
}

function SectionHeader({ title, level }: { title: string; level: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
      <h2 style={{ ...S.section, margin: 0, paddingBottom: 0, borderBottom: 'none' }}>{title}</h2>
      <span
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.12em',
          padding: '2px 8px',
          border: '1.5px solid var(--ink)',
          background: 'var(--paper)',
          opacity: 0.75,
        }}
      >
        {level}
      </span>
    </div>
  );
}

function CueGrid({ cues, variant }: { cues: LabelText[]; variant?: 'warning' }) {
  const bg = variant === 'warning' ? 'var(--yellow)' : 'var(--paper)';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
      {cues.map((cue, idx) => (
        <div key={idx} style={{ ...S.card, background: bg }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={S.bullet}>▸</span>
            <strong style={{ fontSize: 13, lineHeight: 1.4 }}>{cue.label}</strong>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, opacity: 0.85 }}>{cue.text}</p>
        </div>
      ))}
    </div>
  );
}

const tableHeadStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  fontFamily: '"Bungee", sans-serif',
  fontSize: 10,
  letterSpacing: '0.08em',
  borderBottom: '2.5px solid var(--ink)',
};
const tableCellStyle: React.CSSProperties = {
  padding: '10px 14px',
  verticalAlign: 'top',
  lineHeight: 1.55,
};
