import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { Drill } from './types';
import type { Level } from '../userLevel/useUserLevel';

const LEVEL_COLOR: Record<Level, string> = {
  beginner: 'var(--mint)',
  intermediate: 'var(--yellow)',
  advanced: 'var(--orange)',
};

const S: Record<string, CSSProperties> = {
  card: {
    border: '2.5px solid var(--ink)',
    background: 'var(--paper)',
    boxShadow: 'var(--shadow-sm)',
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  header: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  badge: {
    background: 'var(--orange)',
    color: '#fff',
    fontFamily: '"Bungee", sans-serif',
    fontSize: 12,
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontFamily: '"Bungee", sans-serif',
    fontSize: 14,
    letterSpacing: '0.02em',
    margin: 0,
    lineHeight: 1.3,
  },
  metaLine: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 11,
    letterSpacing: '0.04em',
    opacity: 0.7,
    marginTop: 6,
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px 14px',
  },
  sectionLabel: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: '0.14em',
    color: 'var(--teal)',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sectionLabelOrange: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: '0.14em',
    color: 'var(--orange)',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  goalText: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.55,
    opacity: 0.9,
  },
  variantRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    fontSize: 13,
    lineHeight: 1.55,
    marginBottom: 6,
  },
  levelTag: {
    fontFamily: '"Bungee", sans-serif',
    fontSize: 9,
    letterSpacing: '0.06em',
    padding: '2px 6px',
    border: '2px solid var(--ink)',
    flexShrink: 0,
    minWidth: 38,
    textAlign: 'center',
  },
  criteriaList: {
    margin: 0,
    paddingLeft: 18,
    fontSize: 13,
    lineHeight: 1.55,
  },
  cueLine: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.75,
    margin: 0,
  },
  sourcesLine: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: '0.06em',
    opacity: 0.5,
    margin: 0,
  },
};

export type DrillCardProps = {
  drill: Drill;
  index: number;
};

export default function DrillCard({ drill, index }: DrillCardProps) {
  const { t } = useTranslation('drills');
  const { setup, variants, successCriteria, coachingCues, sources } = drill;

  return (
    <article style={S.card}>
      <header style={S.header}>
        <span style={S.badge}>{index + 1}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={S.title}>{drill.title}</h3>
          <div style={S.metaLine}>
            <span>⏱ {setup.duration}</span>
            <span>👥 {setup.minPlayers}+</span>
            <span>🏐 {setup.equipment.join(', ')}</span>
            <span>📐 {setup.teamSizes.map(s => `${s}v${s}`).join(' · ')}</span>
          </div>
        </div>
      </header>

      <div>
        <div style={S.sectionLabel}>{t('card.goal')}</div>
        <p style={S.goalText}>{drill.goal}</p>
      </div>

      <div>
        <div style={S.sectionLabel}>{t('card.variants')}</div>
        <div>
          {variants.map((v, i) => (
            <div key={i} style={S.variantRow}>
              <span
                style={{ ...S.levelTag, background: LEVEL_COLOR[v.level] }}
                title={t(`levels.${v.level}`)}
              >
                {t(`levelShort.${v.level}`)}
              </span>
              <span style={{ opacity: 0.9 }}>{v.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={S.sectionLabelOrange}>{t('card.criteria')}</div>
        <ul style={S.criteriaList}>
          {successCriteria.map((c, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{c}</li>
          ))}
        </ul>
      </div>

      {coachingCues && coachingCues.length > 0 && (
        <div>
          <div style={S.sectionLabel}>{t('card.cues')}</div>
          {coachingCues.map((cue, i) => (
            <p key={i} style={S.cueLine}>« {cue} »</p>
          ))}
        </div>
      )}

      {sources && sources.length > 0 && (
        <p style={S.sourcesLine}>{t('card.source')} : {sources.join(' · ')}</p>
      )}
    </article>
  );
}
