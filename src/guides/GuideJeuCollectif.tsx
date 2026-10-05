import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import { S } from './styles';
import DrillList from '../drills/DrillList';
import { QuizEmbed } from '../quiz/components/QuizEmbed';

// Short team-play guide focused on transitions, coverage and communication.
// The substance lives in the drills (pepper, wash, transition, queen of the
// court) — this guide provides the framing. Text comes from
// src/locales/<lng>/guideContent.json under the "jeuCollectif" key.

type Phase = { phase: string; items: string[] };
type LabelText = { label: string; text: string };

export default function GuideJeuCollectif() {
  const { t } = useTranslation('guideContent');
  const { t: tD } = useTranslation('drills');

  const phases = t('jeuCollectif.phases.items', { returnObjects: true }) as Phase[];
  const coverage = t('jeuCollectif.coverage.items', { returnObjects: true }) as LabelText[];
  const communication = t('jeuCollectif.communication.items', { returnObjects: true }) as LabelText[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <GoldenRule mantra={t('jeuCollectif.goldenRule.mantra')}>
        {t('jeuCollectif.goldenRule.body')}
      </GoldenRule>

      {/* 3 phases */}
      <section>
        <h2 style={S.section}>{t('jeuCollectif.phases.title')}</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          {t('jeuCollectif.phases.intro')}
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

      {/* Couverture */}
      <section>
        <h2 style={S.section}>{t('jeuCollectif.coverage.title')}</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          {t('jeuCollectif.coverage.intro')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {coverage.map((c, i) => (
            <div key={i} style={S.card}>
              <div style={S.labelTeal}>{c.label}</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Communication */}
      <section>
        <h2 style={S.section}>{t('jeuCollectif.communication.title')}</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          {t('jeuCollectif.communication.intro')}
        </p>
        <div style={{ ...S.alert, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {communication.map((c, i) => (
            <div key={i} style={{ fontSize: 13.5 }}>
              <strong style={{ color: 'var(--ink)' }}>{c.label} : </strong>
              <span style={{ opacity: 0.85 }}>{c.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Drills */}
      <section>
        <h2 style={S.section}>{tD('sectionTitle', { skill: tD('skills.team-play') })}</h2>
        <DrillList skill="team-play" />
      </section>

      <QuizEmbed slug="jeu-collectif" persistProgress={false} />
    </div>
  );
}
