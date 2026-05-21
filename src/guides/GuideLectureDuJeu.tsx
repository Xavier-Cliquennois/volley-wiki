import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import { S } from './styles';
import LevelFilterPanel from '../components/LevelFilterPanel';
import LeveledContent from '../components/LeveledContent';
import { useCurrentLang } from '../i18n/paths';
import { SCENARIOS } from '../scenarios/data';
import { useLocalizedScenarios } from '../i18n/localizeScenario';
import type { Level } from '../userLevel/useUserLevel';

type LabelText = { label: string; text: string };
type PhaseBlock = { phase: string; items: string[] };
type IfThen = { if: string; then: string };
type Axis = { axis: string; questions: string[] };
type Drill = { level: string; desc: string };

// Levels per section. Used to drive the LeveledContent gate so each topic
// reveals when the reader's selected user level is high enough.
const LEVEL_BY_KEY: Record<string, Level> = {
  readServer: 'beginner',
  readPasserOpp: 'intermediate',
  readSetter: 'intermediate',
  readHitter: 'advanced',
  blockTiming: 'advanced',
  ifThen: 'intermediate',
  scouting: 'advanced',
  scoutingFormat: 'advanced',
  drills: 'advanced',
};

export default function GuideLectureDuJeu() {
  const { t } = useTranslation('guideContent');
  const lang = useCurrentLang();
  const localizedScenarios = useLocalizedScenarios(SCENARIOS);

  const phases = t('lectureDuJeu.eyeSequence.phases', { returnObjects: true }) as PhaseBlock[];
  const serverCues = t('lectureDuJeu.readServer.cues', { returnObjects: true }) as LabelText[];
  const passerCases = t('lectureDuJeu.readPasserOpp.cases', { returnObjects: true }) as LabelText[];
  const setterCues = t('lectureDuJeu.readSetter.cues', { returnObjects: true }) as LabelText[];
  const hitterCues = t('lectureDuJeu.readHitter.cues', { returnObjects: true }) as LabelText[];
  const blockRules = t('lectureDuJeu.blockTiming.rules', { returnObjects: true }) as LabelText[];
  const ifThens = t('lectureDuJeu.ifThen.scenarios', { returnObjects: true }) as IfThen[];
  const scoutingAxes = t('lectureDuJeu.scouting.axes', { returnObjects: true }) as Axis[];
  const scoutingChecklist = t('lectureDuJeu.scoutingFormat.checklist', { returnObjects: true }) as string[];
  const mistakes = t('lectureDuJeu.commonMistakes.items', { returnObjects: true }) as LabelText[];
  const drills = t('lectureDuJeu.drills.items', { returnObjects: true }) as Drill[];

  // Linked scenarios: only those tagged with a system (the guide pairs well
  // with /scenarios — tactical scenarios where reading the play matters).
  const taggedScenarios = localizedScenarios
    .filter(s => !!s.config.system)
    .slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <GoldenRule mantra={t('lectureDuJeu.goldenRule.mantra')}>
        {t('lectureDuJeu.goldenRule.body')}
      </GoldenRule>

      <LevelFilterPanel />

      {/* Eye sequence */}
      <section>
        <h2 style={S.section}>{t('lectureDuJeu.eyeSequence.title')}</h2>
        <p style={{ margin: '0 0 16px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          {t('lectureDuJeu.eyeSequence.intro')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {phases.map((p, idx) => (
            <div key={idx} style={S.card}>
              <div style={S.label}>{p.phase}</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
                {p.items.map((it, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Read server */}
      <LeveledContent requires={LEVEL_BY_KEY.readServer}>
        <section>
          <SectionHeader title={t('lectureDuJeu.readServer.title')} level={t('lectureDuJeu.readServer.level')} />
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('lectureDuJeu.readServer.intro')}
          </p>
          <CueGrid cues={serverCues} />
        </section>
      </LeveledContent>

      {/* Read passer (opponent's first contact) */}
      <LeveledContent requires={LEVEL_BY_KEY.readPasserOpp}>
        <section>
          <SectionHeader title={t('lectureDuJeu.readPasserOpp.title')} level={t('lectureDuJeu.readPasserOpp.level')} />
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('lectureDuJeu.readPasserOpp.intro')}
          </p>
          <CueGrid cues={passerCases} />
        </section>
      </LeveledContent>

      {/* Read setter */}
      <LeveledContent requires={LEVEL_BY_KEY.readSetter}>
        <section>
          <SectionHeader title={t('lectureDuJeu.readSetter.title')} level={t('lectureDuJeu.readSetter.level')} />
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('lectureDuJeu.readSetter.intro')}
          </p>
          <CueGrid cues={setterCues} />
        </section>
      </LeveledContent>

      {/* Read hitter */}
      <LeveledContent requires={LEVEL_BY_KEY.readHitter}>
        <section>
          <SectionHeader title={t('lectureDuJeu.readHitter.title')} level={t('lectureDuJeu.readHitter.level')} />
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('lectureDuJeu.readHitter.intro')}
          </p>
          <CueGrid cues={hitterCues} highlight />
        </section>
      </LeveledContent>

      {/* Block timing */}
      <LeveledContent requires={LEVEL_BY_KEY.blockTiming}>
        <section>
          <SectionHeader title={t('lectureDuJeu.blockTiming.title')} level={t('lectureDuJeu.blockTiming.level')} />
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('lectureDuJeu.blockTiming.intro')}
          </p>
          <CueGrid cues={blockRules} />
        </section>
      </LeveledContent>

      {/* IF/THEN framework */}
      <LeveledContent requires={LEVEL_BY_KEY.ifThen}>
        <section>
          <h2 style={S.section}>{t('lectureDuJeu.ifThen.title')}</h2>
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('lectureDuJeu.ifThen.intro')}
          </p>
          <div style={{ ...S.card, padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--cream)' }}>
                  <th style={tableHeadStyle}>IF · l'indice observé</th>
                  <th style={tableHeadStyle}>THEN · la réaction</th>
                </tr>
              </thead>
              <tbody>
                {ifThens.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1.5px solid rgba(26,24,18,0.2)' }}>
                    <td style={tableCellStyle}><strong style={{ color: 'var(--orange)' }}>{row.if}</strong></td>
                    <td style={tableCellStyle}>{row.then}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </LeveledContent>

      {/* Scouting */}
      <LeveledContent requires={LEVEL_BY_KEY.scouting}>
        <section>
          <SectionHeader title={t('lectureDuJeu.scouting.title')} level={t('lectureDuJeu.scouting.level')} />
          <p style={{ margin: '0 0 16px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('lectureDuJeu.scouting.intro')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {scoutingAxes.map((axis, idx) => (
              <div key={idx} style={S.card}>
                <div style={S.labelTeal}>{axis.axis}</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
                  {axis.questions.map((q, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </LeveledContent>

      {/* Scouting format */}
      <LeveledContent requires={LEVEL_BY_KEY.scoutingFormat}>
        <section>
          <h2 style={S.section}>{t('lectureDuJeu.scoutingFormat.title')}</h2>
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('lectureDuJeu.scoutingFormat.intro')}
          </p>
          <div style={S.alert}>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7 }}>
              {scoutingChecklist.map((item, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </LeveledContent>

      {/* Common mistakes */}
      <section>
        <h2 style={S.section}>{t('lectureDuJeu.commonMistakes.title')}</h2>
        <CueGrid cues={mistakes} variant="warning" />
      </section>

      {/* Drills */}
      <LeveledContent requires={LEVEL_BY_KEY.drills}>
        <section>
          <SectionHeader title={t('lectureDuJeu.drills.title')} level={t('lectureDuJeu.drills.level')} />
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

      {/* Linked scenarios */}
      {taggedScenarios.length > 0 && (
        <section>
          <h2 style={S.section}>{t('lectureDuJeu.linkedScenarios.title')}</h2>
          <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
            {t('lectureDuJeu.linkedScenarios.intro')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {taggedScenarios.map(scenario => (
              <Link
                key={scenario.id}
                to={`/${lang}/scenarios/${scenario.id}`}
                style={{
                  ...S.card,
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  display: 'block',
                }}
              >
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, marginBottom: 4 }}>
                  {scenario.title}
                </div>
                <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, opacity: 0.6 }}>
                  {scenario.config.contextLabel}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
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

function CueGrid({
  cues,
  highlight,
  variant,
}: {
  cues: LabelText[];
  highlight?: boolean;
  variant?: 'warning';
}) {
  const bullet = highlight ? S.bulletOrange : S.bullet;
  const bg = variant === 'warning' ? 'var(--yellow)' : 'var(--paper)';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
      {cues.map((cue, idx) => (
        <div key={idx} style={{ ...S.card, background: bg }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={bullet}>▸</span>
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
