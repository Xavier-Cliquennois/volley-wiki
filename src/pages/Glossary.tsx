import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';

type Term = { term: string; def: string };

export default function Glossary() {
  const [search, setSearch] = useState('');
  const { t } = useTranslation('glossary');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();

  const rawTerms = t('terms', { returnObjects: true }) as Term[];
  const terms = useMemo(
    () => [...rawTerms].sort((a, b) => a.term.localeCompare(b.term)),
    [rawTerms],
  );

  const filtered = useMemo(() => {
    if (!search) return terms;
    const q = search.toLowerCase();
    return terms.filter(t => t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q));
  }, [search, terms]);

  const letters = useMemo(() => {
    const set = new Set(filtered.map(t => t.term[0]?.toUpperCase()));
    return Array.from(set).filter(Boolean).sort();
  }, [filtered]);

  const subtitleHtml = t('header.subtitleTemplate', { count: terms.length }).replace(
    /<count>(.*?)<\/count>/,
    '<span style=\'font-family:"DM Mono",monospace;font-weight:500\'>$1</span>',
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={tSeo('glossary.title')}
        description={tSeo('glossary.description')}
        path="/glossary"
        jsonLd={buildBreadcrumb(
          [
            { name: tSeo('breadcrumbs.home'), path: '/' },
            { name: tSeo('breadcrumbs.glossary'), path: '/glossary' },
          ],
          lang,
        )}
      />
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          {t('header.kicker')}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {t('header.title')}
        </h1>
        <p
          style={{ margin: 0, fontSize: 15, opacity: 0.7 }}
          dangerouslySetInnerHTML={{ __html: subtitleHtml }}
        />
      </div>

      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.5 }}>🔍</span>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px 12px 42px',
            border: '3px solid var(--ink)',
            background: search ? '#fff8e6' : 'var(--cream)',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14,
            outline: 'none',
            boxShadow: 'inset 3px 3px 0 rgba(26,24,18,0.08)',
            transition: 'background 0.1s',
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.5,
            }}
          >✕</button>
        )}
      </div>

      {!search && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {letters.map(l => (
            <a
              key={l}
              href={`#letter-${l}`}
              style={{
                width: 32, height: 32,
                border: '2.5px solid var(--ink)',
                background: 'var(--cream)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"Bungee", sans-serif', fontSize: 12,
                color: 'var(--ink)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--orange)';
                (e.currentTarget as HTMLElement).style.boxShadow = '2px 2px 0 var(--ink)';
                (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--cream)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'none';
              }}
            >
              {l}
            </a>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ border: '3px dashed var(--ink)', padding: '32px 20px', textAlign: 'center', background: 'var(--paper)' }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, opacity: 0.6 }}>
            {t('search.noResults', { query: search })}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {letters.map(letter => {
            const items = filtered.filter(t => t.term[0]?.toUpperCase() === letter);
            if (items.length === 0) return null;
            return (
              <div key={letter} id={`letter-${letter}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 36, color: 'var(--orange)', lineHeight: 1 }}>{letter}</span>
                  <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map(item => (
                    <div
                      key={item.term}
                      style={{
                        borderLeft: '5px solid var(--orange)',
                        paddingLeft: 16,
                        paddingTop: 4,
                        paddingBottom: 4,
                        background: 'linear-gradient(90deg, rgba(226,84,46,0.06), transparent 40%)',
                      }}
                    >
                      <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, letterSpacing: '0.03em', marginBottom: 4 }}>{item.term}</div>
                      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, opacity: 0.8 }}>{item.def}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
