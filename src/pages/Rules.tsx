import { useMemo, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';
import DisciplineBadge from '../components/DisciplineBadge';
import DisciplineFilter, { type DisciplineFilterValue } from '../components/DisciplineFilter';
import type { Discipline } from '../discipline/useDiscipline';

type Rule = { title: string; content: string; discipline?: Discipline[] };
type Section = {
  id: string;
  title: string;
  num: string;
  rules: Rule[];
  discipline?: Discipline[];
};

function resolveDiscipline(d?: Discipline[]): Discipline[] {
  return d && d.length > 0 ? d : ['indoor'];
}

function matchesFilter(disc: Discipline[], filter: DisciplineFilterValue): boolean {
  if (filter === 'all') return true;
  if (filter === 'both') return disc.length >= 2;
  return disc.includes(filter);
}

export default function Rules() {
  const [open, setOpen] = useState<string | null>('basics');
  const [filter, setFilter] = useState<DisciplineFilterValue>('all');
  const { t } = useTranslation('rules');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();

  const sections = t('sections', { returnObjects: true }) as Section[];
  const quickFaults = t('quickFaults', { returnObjects: true }) as string[];

  const visibleSections = useMemo(() => {
    if (filter === 'all') return sections;
    return sections.filter(s => matchesFilter(resolveDiscipline(s.discipline), filter));
  }, [sections, filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <Head
        title={tSeo('rules.title')}
        description={tSeo('rules.description')}
        path="/rules"
        jsonLd={buildBreadcrumb(
          [
            { name: tSeo('breadcrumbs.home'), path: '/' },
            { name: tSeo('breadcrumbs.rules'), path: '/rules' },
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
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7, maxWidth: 600 }}>
          {t('header.subtitle')}
        </p>
      </div>

      <div style={{ border: '3px solid var(--ink)', background: 'var(--yellow)', boxShadow: 'var(--shadow-sm)', padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--ink)',
          background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Bungee", sans-serif', fontSize: 16, flexShrink: 0,
        }}>!</div>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>
          <Trans i18nKey="warning" t={t} components={{ strong: <strong /> }} />
        </p>
      </div>

      <DisciplineFilter value={filter} onChange={setFilter} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visibleSections.map(section => {
          const isOpen = open === section.id;
          const sectionDisc = resolveDiscipline(section.discipline);
          return (
            <div
              key={section.id}
              style={{
                border: '3px solid var(--ink)',
                boxShadow: isOpen ? 'var(--shadow)' : 'var(--shadow-sm)',
                background: 'var(--cream)',
                overflow: 'hidden',
                transition: 'box-shadow 0.1s',
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : section.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 20px',
                  background: isOpen ? 'var(--paper)' : 'transparent',
                  border: 'none',
                  borderBottom: isOpen ? '3px solid var(--ink)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 36, height: 36, border: '3px solid var(--ink)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isOpen ? 'var(--orange)' : 'var(--cream)',
                  fontFamily: '"Bungee", sans-serif', fontSize: 11, flexShrink: 0,
                }}>
                  {section.num}
                </div>
                <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 15, letterSpacing: '0.03em', flex: 1 }}>
                  {section.title}
                </span>
                <DisciplineBadge on={sectionDisc} size="sm" />
                <div style={{
                  width: 32, height: 32, border: '3px solid var(--ink)',
                  background: 'var(--yellow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Bungee", sans-serif', fontSize: 18,
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.1s',
                  flexShrink: 0,
                }}>+</div>
              </button>

              {isOpen && (
                <div>
                  {section.rules.map((rule, idx) => {
                    const ruleHasOwnDisc = rule.discipline && rule.discipline.length > 0;
                    const ruleDisc = resolveDiscipline(rule.discipline ?? section.discipline);
                    return (
                      <div
                        key={rule.title}
                        style={{
                          padding: '14px 20px',
                          borderBottom: idx < section.rules.length - 1 ? '2px dashed rgba(26,24,18,0.18)' : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.08em', color: 'var(--orange)' }}>
                            {rule.title}
                          </div>
                          {ruleHasOwnDisc && (
                            <DisciplineBadge on={ruleDisc} size="sm" />
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, opacity: 0.8 }}>{rule.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 24 }}>
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 13, letterSpacing: '0.06em' }}>{t('quickFaultsTitle')}</span>
            <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {quickFaults.map(fault => (
            <div key={fault} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
              <div style={{
                width: 22, height: 22, border: '2.5px solid var(--ink)', background: 'var(--orange)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"Bungee", sans-serif', fontSize: 11, flexShrink: 0,
              }}>✗</div>
              {fault}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
