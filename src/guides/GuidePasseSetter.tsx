import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import { S } from './styles';
import DrillList from '../drills/DrillList';
import { QuizEmbed } from '../quiz/components/QuizEmbed';

// Short setter guide. The long-form sections (hand mechanics, footwork,
// distribution decisions) are intentionally compact; the bulk of the
// pedagogical value lives in the DrillList that follows. Text comes from
// src/locales/<lng>/guideContent.json under the "passe" key.

type LabelText = { label: string; text: string };

export default function GuidePasseSetter() {
  const { t } = useTranslation('guideContent');
  const { t: tD } = useTranslation('drills');

  const handCues = t('passe.hands.cues', { returnObjects: true }) as LabelText[];
  const footworkSteps = t('passe.footwork.steps', { returnObjects: true }) as string[];
  const decisions = t('passe.decisions.items', { returnObjects: true }) as LabelText[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <GoldenRule mantra={t('passe.goldenRule.mantra')}>
        {t('passe.goldenRule.body')}
      </GoldenRule>

      {/* Triangle des mains */}
      <section>
        <h2 style={S.section}>{t('passe.hands.title')}</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          {t('passe.hands.intro')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {handCues.map((c, i) => (
            <div key={i} style={S.card}>
              <div style={S.label}>{c.label}</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, opacity: 0.85 }}>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footwork */}
      <section>
        <h2 style={S.section}>{t('passe.footwork.title')}</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          {t('passe.footwork.intro')}
        </p>
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {footworkSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Décisions */}
      <section>
        <h2 style={S.section}>{t('passe.decisions.title')}</h2>
        <p style={{ margin: '0 0 14px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
          {t('passe.decisions.intro')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {decisions.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={S.labelTeal}>{d.label}</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Drills */}
      <section>
        <h2 style={S.section}>{tD('sectionTitle', { skill: tD('skills.set') })}</h2>
        <DrillList skill="set" />
      </section>

      <QuizEmbed slug="passe" persistProgress={false} />
    </div>
  );
}
