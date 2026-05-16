import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Technique, TechniqueLevel, TechniqueTag } from './data';
import { LEVEL_TAGS } from './data';

const LEVEL_COLOR: Record<TechniqueLevel, string> = {
  'Débutant': 'var(--mint)',
  'Intermédiaire': 'var(--yellow)',
  'Avancé': 'var(--orange)',
};

type Props = {
  items: Technique[];
  categoryTags: TechniqueTag[];
  namespace: string;
};

// Shared renderer for both indoor and beach technique catalogs.
// The namespace param picks which i18n bundle the card content comes from.
export default function TechniqueList({ items, categoryTags, namespace }: Props) {
  const [activeTags, setActiveTags] = useState<TechniqueTag[]>([]);
  const { t } = useTranslation(namespace);

  const toggle = (tag: TechniqueTag) =>
    setActiveTags(prev => (prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]));

  const filtered = activeTags.length === 0
    ? items
    : items.filter(it => activeTags.some(tag => it.tags.includes(tag)));

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', marginBottom: 8, opacity: 0.6 }}>{t('filters.category')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {categoryTags.map(tag => {
                const on = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggle(tag)}
                    style={{
                      padding: '6px 14px',
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      border: '2.5px solid var(--ink)',
                      background: on ? 'var(--orange)' : 'var(--cream)',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      boxShadow: on ? 'var(--shadow-sm)' : 'none',
                      transform: on ? 'translate(-1px,-1px)' : 'none',
                      transition: 'all 0.08s',
                    }}
                  >
                    {t(`tags.${tag}`)}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', marginBottom: 8, opacity: 0.6 }}>{t('filters.level')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {LEVEL_TAGS.map(tag => {
                const on = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggle(tag)}
                    style={{
                      padding: '6px 14px',
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      border: '2.5px solid var(--ink)',
                      background: on ? LEVEL_COLOR[tag as TechniqueLevel] : 'var(--cream)',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      boxShadow: on ? 'var(--shadow-sm)' : 'none',
                      transform: on ? 'translate(-1px,-1px)' : 'none',
                      transition: 'all 0.08s',
                    }}
                  >
                    {t(`tags.${tag}`)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {activeTags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 12, opacity: 0.6 }}>
              {t(filtered.length === 1 ? 'filters.countSingle' : 'filters.countPlural', { count: filtered.length })}
            </span>
            <button
              onClick={() => setActiveTags([])}
              style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.08em', color: 'var(--orange)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {t('filters.showAll')}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>{t('sectionTitle')}</span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.length === 0 ? (
          <div style={{ border: '3px dashed var(--ink)', padding: '32px 20px', textAlign: 'center', background: 'var(--paper)' }}>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, opacity: 0.6 }}>{t('filters.noResults')}</div>
          </div>
        ) : (
          filtered.map(tech => {
            const name = t(`items.${tech.id}.name`);
            const description = t(`items.${tech.id}.description`);
            const keyPoints = t(`items.${tech.id}.keyPoints`, { returnObjects: true }) as string[];
            const errors = t(`items.${tech.id}.errors`, { returnObjects: true }) as string[];
            const when = t(`items.${tech.id}.when`);
            const localizedLevel = t(`tags.${tech.level}`);
            return (
              <div key={tech.id} style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '2px solid var(--ink)', background: 'var(--paper)', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <span style={{ fontSize: 30 }}>{tech.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                      <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 20, margin: 0, letterSpacing: '0.03em' }}>{name}</h2>
                      <span style={{
                        padding: '2px 10px',
                        border: '2.5px solid var(--ink)',
                        background: LEVEL_COLOR[tech.level],
                        fontFamily: '"Bungee", sans-serif',
                        fontSize: 9,
                        letterSpacing: '0.1em',
                      }}>{localizedLevel.toUpperCase()}</span>
                    </div>
                    <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 12, letterSpacing: '0.08em', color: 'var(--teal)' }}>
                      {t('card.when')} : {when}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                    <div>
                      <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 }}>
                        {t('card.keyPoints')}
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {keyPoints.map((pt, i) => (
                          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.45 }}>
                            <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 10 }}>
                        {t('card.errors')}
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {errors.map((err, i) => (
                          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.45 }}>
                            <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--orange)', flexShrink: 0 }}>✗</span>
                            {err}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                {tech.videos.length > 0 && (
                  <div style={{ borderTop: '2px dashed rgba(26,24,18,0.18)', padding: '12px 24px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {tech.videos.map((v, i) => (
                      <a
                        key={i}
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '6px 12px',
                          border: '2px solid var(--ink)',
                          fontFamily: '"DM Mono", monospace',
                          fontSize: 11,
                          color: 'var(--ink)',
                          textDecoration: 'none',
                          background: 'var(--cream)',
                          transition: 'all 0.08s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'var(--teal)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--cream)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'var(--cream)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--ink)';
                        }}
                      >
                        <span style={{ color: 'var(--orange)', fontSize: 10 }}>▶</span>
                        {v.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
