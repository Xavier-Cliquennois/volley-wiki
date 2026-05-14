import { useTranslation } from 'react-i18next';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

type TimingStep = { title: string; desc: string };
type TypePoint = { label: string; text: string };
type ContreType = { name: string; objective: string; points: TypePoint[] };
type LabelText = { label: string; text: string };
type SequenceItem = { label: string; text: string };
type TimingRow = { type: string; timing: string };
type BlockStyle = { label: string; body: string; points: string[] };
type JumpItem = { label?: string; text: string };
type JumpColumn = { title: string; items: JumpItem[] };
type Exercise = { title: string; desc: string };
type VideoItem = { title: string; url: string };

export default function GuideContre() {
  const { t } = useTranslation('guideContent');

  const timingSteps = t('contre.timingSteps.items', { returnObjects: true }) as TimingStep[];
  const contreTypes = t('contre.types.items', { returnObjects: true }) as ContreType[];
  const timingTips = t('contre.timingTips.items', { returnObjects: true }) as LabelText[];
  const visualChips = t('contre.visualSequence.chips', { returnObjects: true }) as string[];
  const visualItems = t('contre.visualSequence.items', { returnObjects: true }) as SequenceItem[];
  const timingByAttackRows = t('contre.timingByAttack.rows', { returnObjects: true }) as TimingRow[];
  const readStyle = t('contre.blockStyles.read', { returnObjects: true }) as BlockStyle;
  const commitStyle = t('contre.blockStyles.commit', { returnObjects: true }) as BlockStyle;
  const jumpColumns = t('contre.jumpTechnique.columns', { returnObjects: true }) as JumpColumn[];
  const errors = t('contre.errors.items', { returnObjects: true }) as LabelText[];
  const exercises = t('contre.exercises.items', { returnObjects: true }) as Exercise[];
  const proTips = t('contre.proTips.items', { returnObjects: true }) as LabelText[];
  const videos = t('contre.videos.items', { returnObjects: true }) as VideoItem[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra={t('contre.goldenRule.mantra')}>
        {t('contre.goldenRule.body')}
      </GoldenRule>

      {/* Fondamentaux */}
      <section>
        <h2 style={S.section}>{t('contre.fundamentals.title')}</h2>
        <div style={S.card}>
          <p
            style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: t('contre.fundamentals.html').replace(/<strong>/g, '<strong style="color: var(--orange)">') }}
          />
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>{t('contre.timingSteps.title')}</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {timingSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', margin: '0 0 4px 0' }}>{step.title}</p>
                <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Types de contres */}
      <section>
        <h2 style={S.section}>{t('contre.types.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {contreTypes.map((type, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{i + 1}. {type.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', marginBottom: 10 }}>
                <span style={{ color: 'var(--ink)', opacity: 0.5, textTransform: 'uppercase' }}>{t('contre.types.objectiveLabel')} : </span>
                <span style={{ color: 'var(--teal)' }}>{type.objective}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {type.points.map((point, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{point.label} : </strong>
                      <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{point.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Astuces timing */}
      <section>
        <h2 style={S.section}>{t('contre.timingTips.title')}</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {timingTips.map((tip, i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{tip.label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{tip.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Séquence visuelle élite */}
      <section>
        <h2 style={S.section}>{t('contre.visualSequence.title')}</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>{t('contre.visualSequence.intro')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {visualChips.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, padding: '4px 10px', letterSpacing: '0.08em' }}>{step}</span>
                {i < visualChips.length - 1 && <span style={{ color: 'var(--orange)', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {visualItems.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <span style={S.bulletOrange}>▸</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{item.label} : </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timing précis par type d'attaque */}
      <section>
        <h2 style={S.section}>{t('contre.timingByAttack.title')}</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>{t('contre.timingByAttack.headerType')}</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>{t('contre.timingByAttack.headerWhen')}</th>
              </tr>
            </thead>
            <tbody>
              {timingByAttackRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < timingByAttackRows.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{row.type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{row.timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Read vs Commit blocking */}
      <section>
        <h2 style={S.section}>{t('contre.blockStyles.title')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={{ ...S.card, border: '2.5px solid var(--orange)' }}>
            <div style={S.label}>{readStyle.label}</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: '0 0 10px 0', lineHeight: 1.6 }}>{readStyle.body}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {readStyle.points.map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ ...S.labelTeal, color: 'var(--ink)', opacity: 0.6 }}>{commitStyle.label}</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 10px 0', lineHeight: 1.6 }}>{commitStyle.body}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {commitStyle.points.map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.55 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technique de saut */}
      <section>
        <h2 style={S.section}>{t('contre.jumpTechnique.title')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {jumpColumns.map((col, ci) => (
            <div key={ci} style={S.card}>
              <div style={S.label}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {col.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.85 }}>
                      {item.label ? <strong>{item.label} : </strong> : null}
                      <span style={{ opacity: 0.8 }}>{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Erreurs fréquentes */}
      <section>
        <h2 style={S.section}>{t('contre.errors.title')}</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>{t('contre.errors.subtitle')}</div>
          {errors.map((err, i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{err.label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{err.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Exercices */}
      <section>
        <h2 style={S.section}>{t('contre.exercises.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{ ...S.card, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, color: 'var(--orange)', flexShrink: 0, width: 24, textAlign: 'right' }}>{i + 1}.</span>
              <div>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{ex.title}</div>
                <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conseils de pro */}
      <section>
        <h2 style={S.section}>{t('contre.proTips.title')}</h2>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {proTips.map((tip, i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{tip.label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{tip.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vidéos */}
      <section>
        <h2 style={S.section}>{t('contre.videos.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {videos.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
